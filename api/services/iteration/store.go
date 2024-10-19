package iteration

import (
	"context"
	"database/sql"
	"log"
	"trainix/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) CreateIteration(ctx context.Context, iteration types.Iteration, activities []types.Activity) error {
	// setup transaction
	tx, err := s.db.BeginTx(ctx, nil)
	defer tx.Rollback()

	if err != nil {
		return err
	}

	// insert iteration
	r, err := tx.Exec("INSERT INTO iterations (workoutId) VALUES (?)", iteration.WorkoutID)

	if err != nil {
		return err
	}

	iterationId, err := r.LastInsertId()

	if err != nil {
		return err
	}

	// insert activities
	for _, a := range activities {
		_, err := tx.Exec("INSERT INTO activities (name, sets, reps, statusId, exerciseId, iterationId) VALUES (?,?,?,?,?,?)",
			a.Name, a.Sets, a.Reps, a.StatusID, a.ExerciseID, iterationId,
		)
		log.Printf("Activity = {%v}", iterationId)

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

func (s *Store) UpdateIteration(id int, iteration types.Iteration) error {
	return nil
}
