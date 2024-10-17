package muscle

import (
	"database/sql"
	"fmt"
	"trainix/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) FindMuscleByID(id int) (*types.Muscle, error) {
	rows, err := s.db.Query("SELECT * FROM muscles WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	m := new(types.Muscle)

	for rows.Next() {
		m, err = scanRowIntoMuscle(rows)
		if err != nil {
			return nil, err
		}
	}

	rows.Close()

	if m.ID == 0 {
		return nil, fmt.Errorf("muscle not found")
	}

	return m, nil
}

func (s *Store) FindAllMuscles() ([]types.Muscle, error) {
	rows, err := s.db.Query("SELECT * FROM muscles")

	if err != nil {
		return nil, err
	}

	muscles := []types.Muscle{}

	for rows.Next() {
		muscle, err := scanRowIntoMuscle(rows)

		if err != nil {
			return nil, err
		}

		muscles = append(muscles, *muscle)
	}

	rows.Close()

	return muscles, nil
}

func (s *Store) FindMusclesRelatedWithExercise(exerciseId int) ([]types.Muscle, error) {
	rows, err := s.db.Query("SELECT muscleId FROM exercise_muscle WHERE exerciseId = ?", exerciseId)

	if err != nil {
		return nil, err
	}

	muscles := []types.Muscle{}
	var muscleID int

	for rows.Next() {
		rows.Scan(&muscleID)
		m, err := s.FindMuscleByID(muscleID)

		if err != nil {
			return nil, err
		}

		muscles = append(muscles, *m)
	}

	rows.Close()

	return muscles, nil
}

func (s *Store) FindMusclesRelatedWithWorkout(workoutId int) ([]types.Muscle, error) {
	rows, err := s.db.Query("SELECT muscleId FROM workout_muscle WHERE workoutId= ?", workoutId)

	if err != nil {
		return nil, err
	}

	muscles := []types.Muscle{}
	var muscleID int

	for rows.Next() {
		rows.Scan(&muscleID)
		m, err := s.FindMuscleByID(muscleID)

		if err != nil {
			return nil, err
		}

		muscles = append(muscles, *m)
	}

	rows.Close()

	return muscles, nil
}

func scanRowIntoMuscle(rows *sql.Rows) (*types.Muscle, error) {
	muscle := new(types.Muscle)

	err := rows.Scan(
		&muscle.ID,
		&muscle.Label,
		&muscle.Value,
	)

	if err != nil {
		return nil, err
	}

	return muscle, nil
}
