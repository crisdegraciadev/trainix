package exercise

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"trainix/types"
	"trainix/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) CreateExercise(ctx context.Context, exercise types.Exercise, muscleIDs []int, difficultyID int) error {
	// setup transaction
	tx, err := s.db.BeginTx(ctx, nil)
	defer tx.Rollback()

	if err != nil {
		return err
	}

	// insert exercise
	r, err := tx.Exec(
		"INSERT INTO exercises (name, description, videoUrl, userId) VALUES (?,?,?,?)",
		exercise.Name, exercise.Description, exercise.VideoURL, exercise.UserID,
	)

	if err != nil {
		return err
	}

	exerciseID, err := r.LastInsertId()

	if err != nil {
		return err
	}

	// link muscles with exercises
	for _, muscleId := range muscleIDs {
		err := s.linkExerciseMuscle(tx, int(exerciseID), muscleId)

		if err != nil {
			return err
		}
	}

	// link difficulty with exercise
	err = s.linkExerciseDifficulty(tx, int(exerciseID), difficultyID)

	if err != nil {
		return err
	}

	// commit the transaction
	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (s *Store) linkExerciseMuscle(tx *sql.Tx, exerciseId int, muscleId int) error {
	_, err := tx.Exec(
		"INSERT INTO exercise_muscle (exerciseId, muscleId) VALUES (?,?)",
		exerciseId, muscleId,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) linkExerciseDifficulty(tx *sql.Tx, exerciseId int, difficultyId int) error {
	_, err := tx.Query(
		"INSERT INTO exercise_difficulty (exerciseId, difficultyId) VALUES (?,?)",
		exerciseId, difficultyId,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) IsExerciseDuplicated(name string) (v bool, err error) {
	var count int

	row := s.db.QueryRow("SELECT COUNT(*) FROM exercises WHERE name = ?", name)
	err = row.Scan(&count)

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (s *Store) DeleteExercise(id int) error {
	_, err := s.db.Exec("DELETE FROM exercises WHERE id = ?", id)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) UpdateExercise(id int, exercise types.Exercise, muscleIDs []int, difficultyID int) error {

	baseQuery := "UPDATE exercises SET"
	updates := []string{}

	if exercise.Name != "" {
		updates = append(updates, fmt.Sprintf(" name = '%s'", exercise.Name))
	}

	if exercise.Description != "" {
		updates = append(updates, fmt.Sprintf(" description = '%s'", exercise.Description))
	}

	if exercise.VideoURL != "" {
		updates = append(updates, fmt.Sprintf(" videoUrl = '%s'", exercise.VideoURL))
	}

	// no updates added, nothing to update
	if len(updates) == 0 {
		return nil
	}

	query := fmt.Sprintf("%s %s WHERE id = %d", baseQuery, strings.Join(updates, ","), id)
	_, err := s.db.Exec(query)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) FindExercise(id int) (exercise *types.Exercise, err error) {
	rows, err := s.db.Query("SELECT id, name, description, videoUrl, userId, createdAt FROM exercises WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	exercise = new(types.Exercise)

	for rows.Next() {
		exercise, err = scanRowIntoExercise(rows)

		if err != nil {
			log.Printf("%s", err)
			return nil, err
		}
	}

	if exercise.ID == 0 {
		log.Printf("%s", "Exercise ID is 0")
		return nil, fmt.Errorf("exercise not found")
	}

	return exercise, nil
}

func (s *Store) FilterExercises(filter types.ExerciseFilter, skip int, take int) (exercises []types.Exercise, err error) {
	var queryBuilder strings.Builder

	queryBuilder.WriteString(`
    SELECT DISTINCT id, name, description, videoUrl, userId, createdAt FROM exercises e 
    LEFT JOIN exercise_muscle em ON e.id = em.exerciseId  
    LEFT JOIN exercise_difficulty ed ON e.id = ed.exerciseId
    WHERE 1 = 1  
  `)

	if filter.Name != "" {
		condition := fmt.Sprintf(" AND e.name LIKE '%%%s%%'", filter.Name)
		queryBuilder.WriteString(condition)
	}

	if len(filter.MuscleIDs) != 0 {
		condition := fmt.Sprintf(" AND em.muscleId IN %s", utils.MapIDsToSQLRange(filter.MuscleIDs))
		queryBuilder.WriteString(condition)
	}

	if len(filter.DifficultyIDs) != 0 {
		condition := fmt.Sprintf(" AND ed.difficultyId IN %s", utils.MapIDsToSQLRange(filter.DifficultyIDs))
		queryBuilder.WriteString(condition)
	}

	queryBuilder.WriteString(fmt.Sprintf(" LIMIT %d OFFSET %d", take, skip))

	query := queryBuilder.String()
	rows, err := s.db.Query(query)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		exercise, err := scanRowIntoExercise(rows)

		if err != nil {
			return nil, err
		}

		exercises = append(exercises, *exercise)
	}

	return exercises, nil
}

func (s *Store) CountExercises(filter types.ExerciseFilter) (count int, err error) {
	var queryBuilder strings.Builder

	queryBuilder.WriteString(`
    SELECT COUNT(DISTINCT e.id) FROM exercises e 
    LEFT JOIN exercise_muscle em ON e.id = em.exerciseId  
    LEFT JOIN exercise_difficulty ed ON e.id = ed.exerciseId
    WHERE 1 = 1  
  `)

	if filter.Name != "" {
		condition := fmt.Sprintf(" AND e.name LIKE '%%%s%%'", filter.Name)
		queryBuilder.WriteString(condition)
	}

	if len(filter.MuscleIDs) != 0 {
		condition := fmt.Sprintf(" AND em.muscleId IN %s", utils.MapIDsToSQLRange(filter.MuscleIDs))
		queryBuilder.WriteString(condition)
	}

	if len(filter.DifficultyIDs) != 0 {
		condition := fmt.Sprintf(" AND ed.difficultyId IN %s", utils.MapIDsToSQLRange(filter.DifficultyIDs))
		queryBuilder.WriteString(condition)
	}

	query := queryBuilder.String()

	rows, err := s.db.Query(query)

	if err != nil {
		return 0, err
	}

	if !rows.Next() {
		return 0, nil
	}

	err = rows.Scan(&count)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func scanRowIntoExercise(rows *sql.Rows) (*types.Exercise, error) {
	exercise := new(types.Exercise)

	err := rows.Scan(
		&exercise.ID,
		&exercise.Name,
		&exercise.Description,
		&exercise.VideoURL,
		&exercise.UserID,
		&exercise.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return exercise, nil
}
