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

func (s *Store) CreateExercise(ctx context.Context, exercise types.Exercise, muscleIDs []int) error {
	// setup transaction
	tx, err := s.db.BeginTx(ctx, nil)
	defer tx.Rollback()

	if err != nil {
		return err
	}

	// insert exercise
	r, err := tx.Exec(
		"INSERT INTO exercises (name, description, videoUrl, userId, difficultyId) VALUES (?,?,?,?,?)",
		exercise.Name, exercise.Description, exercise.VideoURL, exercise.UserID, exercise.DifficultyID,
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

func (s *Store) UpdateExercise(id int, exercise types.Exercise, muscleIDs []int) error {
	baseQuery := "UPDATE exercises SET"
	updates := []string{}

	if exercise.Name != "" {
		updates = append(updates, fmt.Sprintf(" name = '%s'", exercise.Name))
	}

	if exercise.Description != "" {
		updates = append(updates, fmt.Sprintf(" description = '%s'", exercise.Description))
	}

	if exercise.VideoURL != "" {
		updates = append(updates, fmt.Sprintf(" videoUrl = '%v'", exercise.VideoURL))
	}

	if exercise.DifficultyID != 0 {
		updates = append(updates, fmt.Sprintf(" difficultyId = '%d'", exercise.DifficultyID))
	}

	// Update muscles
	_, err := s.db.Exec("DELETE FROM exercise_muscle WHERE exerciseId = ?", id)

	if err != nil {
		return err
	}

	for _, muscleId := range muscleIDs {
		_, err = s.db.Exec("INSERT INTO exercise_muscle (exerciseId,muscleId) VALUES(?,?)", id, muscleId)

		if err != nil {
			return err
		}
	}

	// no updates on base model added, nothing to update
	if len(updates) == 0 {
		return nil
	}

	query := fmt.Sprintf("%s %s WHERE id = %d", baseQuery, strings.Join(updates, ","), id)
	_, err = s.db.Exec(query)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) FindExercise(id int) (exercise *types.Exercise, err error) {
	rows, err := s.db.Query("SELECT id, name, description, userId, difficultyId, createdAt FROM exercises WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	exercise = new(types.Exercise)

	for rows.Next() {
		exercise, err = s.scanRowIntoExercise(rows)

		if err != nil {
			log.Printf("%s", err)
			return nil, err
		}
	}

	rows.Close()

	if exercise.ID == 0 {
		log.Printf("%s", "Exercise ID is 0")
		return nil, fmt.Errorf("exercise not found")
	}

	return exercise, nil
}

func (s *Store) FilterExercises(
	filter types.ExerciseFilter,
	order types.ExerciseOrder,
	pagination types.Pagination,
) (exercises []types.Exercise, err error) {
	var queryBuilder strings.Builder

	queryBuilder.WriteString(`
    SELECT DISTINCT id, name, description, userId, difficultyId, createdAt FROM exercises e 
    LEFT JOIN exercise_muscle em ON e.id = em.exerciseId  
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

	if filter.DifficultyID != 0 {
		condition := fmt.Sprintf(" AND e.difficultyId = %d", filter.DifficultyID)
		queryBuilder.WriteString(condition)
	}

	if order.Name != "" || order.CreatedAt != "" {
		order := utils.MapOrdersToSQL(map[string]string{"name": order.Name, "createdAt": order.CreatedAt})
		queryBuilder.WriteString(order)
	}

	queryBuilder.WriteString(fmt.Sprintf(" LIMIT %d OFFSET %d", pagination.Take, pagination.Skip))

	query := queryBuilder.String()

	log.Printf("%s", query)

	rows, err := s.db.Query(query)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		exercise, err := s.scanRowIntoExercise(rows)

		if err != nil {
			return nil, err
		}

		exercises = append(exercises, *exercise)
	}

	rows.Close()

	return exercises, nil
}

func (s *Store) CountExercises(filter types.ExerciseFilter) (count int, err error) {
	var queryBuilder strings.Builder

	queryBuilder.WriteString(`
    SELECT COUNT(DISTINCT e.id) FROM exercises e 
    LEFT JOIN exercise_muscle em ON e.id = em.exerciseId  
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

	if filter.DifficultyID != 0 {
		condition := fmt.Sprintf(" AND e.difficultyId = %d", filter.DifficultyID)
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

	rows.Close()

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s *Store) scanRowIntoExercise(rows *sql.Rows) (*types.Exercise, error) {
	exercise := new(types.Exercise)

	err := rows.Scan(
		&exercise.ID,
		&exercise.Name,
		&exercise.Description,
		&exercise.UserID,
		&exercise.DifficultyID,
		&exercise.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	var videoUrl sql.NullString
	err = s.db.QueryRow("SELECT videoUrl FROM exercises WHERE id = ?", exercise.ID).Scan(&videoUrl)

	if err != nil {
		log.Fatal(err)
	}

	if videoUrl.Valid {
		exercise.VideoURL = videoUrl.String
	} else {
		exercise.VideoURL = ""
	}

	return exercise, nil
}
