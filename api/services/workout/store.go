package workout

import (
	"context"
	"database/sql"
	"trainix/types"
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

	// link muscles with exercises
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

func (s *Store) IsWorkoutDuplicated(name string) (v bool, err error) {
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
	return []types.Workout{}, nil
}

func (s *Store) CountWorkouts(filter types.WorkoutFilter) (count int, err error) {
	return 0, nil
}

func (s *Store) FindWorkout(id int) (workout *types.Workout, err error) {
	return nil, nil
}

func (s *Store) UpdateWorkout(id int, workout types.Workout) error {
	return nil
}

func (s *Store) DeleteWorkout(id int) error {
	return nil
}
