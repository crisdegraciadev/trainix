package iteration

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"trainix/services/activity"
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

	// setup linked activity store
	activityStore := activity.NewStore(s.db)

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
		err = activityStore.CreateActivity(tx, int(iterationId), a)

		if err != nil {
			return fmt.Errorf("cannot create activity")
		}
	}

	// commit the transaction
	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (s *Store) FindIteration(id int) (*types.Iteration, error) {
	rows, err := s.db.Query("SELECT id, createdAt FROM iterations WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	iteration := new(types.Iteration)

	for rows.Next() {
		iteration, err = s.scanRowIntoIteration(rows)

		if err != nil {
			log.Printf("%s", err)
			return nil, err
		}
	}

	rows.Close()

	if iteration.ID == 0 {
		log.Printf("%s", "iteration ID is 0")
		return nil, fmt.Errorf("iteration not found")
	}

	return iteration, nil
}

func (s *Store) FilterAllIterations(filter types.IterationFilter, order types.IterationOrder, pagination types.Pagination) (iterations []types.Iteration, err error) {
	query := fmt.Sprintf(
		"SELECT * FROM iterations WHERE workoutId = %d ORDER BY createdAt %s LIMIT %d OFFSET %d",
		filter.WorkoutID, order.CreatedAt, pagination.Take, pagination.Skip,
	)

	rows, err := s.db.Query(query)

	if err != nil {
		return nil, err
	}

	iterations = []types.Iteration{}

	for rows.Next() {
		iteration, err := s.scanRowIntoIteration(rows)

		if err != nil {
			return nil, err
		}

		iterations = append(iterations, *iteration)
	}

	rows.Close()

	return iterations, nil
}

func (s *Store) CountIterations(workoutId int) (int, error) {
	var count int

	row := s.db.QueryRow("SELECT COUNT(*) FROM iterations WHERE workoutId = ?", workoutId)
	err := row.Scan(&count)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s *Store) scanRowIntoIteration(rows *sql.Rows) (*types.Iteration, error) {
	iteration := new(types.Iteration)

	err := rows.Scan(&iteration.ID, &iteration.CreatedAt)

	if err != nil {
		return nil, err
	}

	return iteration, nil
}
