package workout

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

func (s *Store) CreateWorkout(ctx context.Context, workout types.Workout, muscleIDs []int) error {
	// setup transaction
	tx, err := s.db.BeginTx(ctx, nil)
	defer tx.Rollback()

	if err != nil {
		return err
	}

	// insert workout
	r, err := tx.Exec(
		"INSERT INTO workouts (name, description, userId, difficultyId) VALUES (?,?,?,?)",
		workout.Name, workout.Description, workout.UserID, workout.DifficultyID,
	)

	if err != nil {
		return err
	}

	workoutID, err := r.LastInsertId()

	if err != nil {
		return err
	}

	// link muscles with workout
	for _, muscleId := range muscleIDs {
		err := s.linkWorkoutMuscle(tx, int(workoutID), muscleId)

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

func (s *Store) ExistWorkout(name string) (v bool, err error) {
	var count int

	row := s.db.QueryRow("SELECT COUNT(*) FROM workouts WHERE name = ?", name)
	err = row.Scan(&count)

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (s *Store) linkWorkoutMuscle(tx *sql.Tx, workoutId int, muscleId int) error {
	_, err := tx.Exec(
		"INSERT INTO workout_muscle (workoutId, muscleId) VALUES (?,?)",
		workoutId, muscleId,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) FilterWorkouts(filter types.WorkoutFilter, order types.WorkoutOrder, pagination types.Pagination) (workouts []types.Workout, err error) {
	var queryBuilder strings.Builder

	queryBuilder.WriteString(`
    SELECT DISTINCT id, name, description, userId, difficultyId, createdAt FROM workouts w 
    LEFT JOIN workout_muscle wm ON w.id = wm.workoutId 
    WHERE 1 = 1  
  `)

	if filter.Name != "" {
		condition := fmt.Sprintf(" AND w.name LIKE '%%%s%%'", filter.Name)
		queryBuilder.WriteString(condition)
	}

	if len(filter.MuscleIDs) != 0 {
		condition := fmt.Sprintf(" AND wm.muscleId IN %s", utils.MapIDsToSQLRange(filter.MuscleIDs))
		queryBuilder.WriteString(condition)
	}

	if filter.DifficultyID != 0 {
		condition := fmt.Sprintf(" AND w.difficultyId = %d", filter.DifficultyID)
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
		exercise, err := s.scanRowIntoWorkout(rows)

		if err != nil {
			return nil, err
		}

		workouts = append(workouts, *exercise)
	}

	rows.Close()

	return workouts, nil
}

func (s *Store) CountWorkouts(filter types.WorkoutFilter) (count int, err error) {
	var queryBuilder strings.Builder

	queryBuilder.WriteString(`
    SELECT COUNT(DISTINCT w.id) FROM workouts w 
    LEFT JOIN workout_muscle wm ON w.id = wm.workoutId  
    WHERE 1 = 1  
  `)

	if filter.Name != "" {
		condition := fmt.Sprintf(" AND w.name LIKE '%%%s%%'", filter.Name)
		queryBuilder.WriteString(condition)
	}

	if len(filter.MuscleIDs) != 0 {
		condition := fmt.Sprintf(" AND wm.muscleId IN %s", utils.MapIDsToSQLRange(filter.MuscleIDs))
		queryBuilder.WriteString(condition)
	}

	if filter.DifficultyID != 0 {
		condition := fmt.Sprintf(" AND w.difficultyId = %d", filter.DifficultyID)
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

func (s *Store) FindWorkout(id int) (*types.Workout, error) {
	rows, err := s.db.Query("SELECT id, name, description, userId, difficultyId, createdAt FROM workouts WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	workout := new(types.Workout)

	for rows.Next() {
		workout, err = s.scanRowIntoWorkout(rows)

		if err != nil {
			log.Printf("%s", err)
			return nil, err
		}
	}

	rows.Close()

	if workout.ID == 0 {
		log.Printf("%s", "workout ID is 0")
		return nil, fmt.Errorf("workout not found")
	}

	return workout, nil
}

func (s *Store) UpdateWorkout(id int, workout types.Workout, muscleIDs []int) error {
	baseQuery := "UPDATE workouts SET"
	updates := []string{}

	if workout.Name != "" {
		updates = append(updates, fmt.Sprintf(" name = '%s'", workout.Name))
	}

	if workout.Description != "" {
		updates = append(updates, fmt.Sprintf(" description = '%s'", workout.Description))
	}

	if workout.DifficultyID != 0 {
		updates = append(updates, fmt.Sprintf(" difficultyId = '%d'", workout.DifficultyID))
	}

	// Update muscles
	_, err := s.db.Exec("DELETE FROM workout_muscle WHERE workoutId = ?", id)

	if err != nil {
		return err
	}

	for _, muscleID := range muscleIDs {
		_, err = s.db.Exec("INSERT INTO workout_muscle (exerciseId,muscleId) VALUES(?,?)", id, muscleID)

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

func (s *Store) DeleteWorkout(id int) error {
	_, err := s.db.Exec("DELETE FROM workouts WHERE id = ?", id)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) scanRowIntoWorkout(rows *sql.Rows) (*types.Workout, error) {
	workout := new(types.Workout)

	err := rows.Scan(
		&workout.ID,
		&workout.Name,
		&workout.Description,
		&workout.UserID,
		&workout.DifficultyID,
		&workout.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return workout, nil
}
