package activity

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"trainix/types"
)

// Activities can only be modified with iterations, that's why Write operatiobs
// can only be done within a transaction

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) FindActivity(id int) (*types.Activity, error) {
	rows, err := s.db.Query("SELECT id, name, sets, reps, statusId, exerciseId, iterationId FROM activities WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	activity := new(types.Activity)

	for rows.Next() {
		activity, err = s.scanRowIntoActivity(rows)

		if err != nil {
			log.Printf("%s", err)
			return nil, err
		}
	}

	rows.Close()

	if activity.ID == 0 {
		log.Printf("%s", "activity ID is 0")
		return nil, fmt.Errorf("activity not found")
	}

	return activity, nil
}

func (s *Store) FindActivitiesByIteraion(iterationId int) ([]types.Activity, error) {
	rows, err := s.db.Query("SELECT id, name, sets, reps, statusId, exerciseId, iterationId FROM activities WHERE iterationId = ?", iterationId)

	if err != nil {
		return nil, err
	}

	activities := []types.Activity{}

	for rows.Next() {
		activity, err := s.scanRowIntoActivity(rows)

		if err != nil {
			return nil, err
		}

		if activity.ID == 0 {
			log.Printf("%s", "activity ID is 0")
			return nil, fmt.Errorf("activity not found")
		}

		activities = append(activities, *activity)
	}

	rows.Close()

	return activities, nil
}

func (s *Store) CreateActivity(tx *sql.Tx, iterationId int, activity types.Activity) error {
	_, err := tx.Exec("INSERT INTO activities (name, sets, reps, order, statusId, exerciseId, iterationId) VALUES (?,?,?,?,?,?)",
		activity.Name, activity.Sets, activity.Reps, activity.Order, activity.StatusID, activity.ExerciseID, iterationId,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *Store) UpdateActivity(id int, activity types.Activity) error {
	baseQuery := "UPDATE activities SET"
	updates := []string{}

	if activity.Name != "" {
		updates = append(updates, fmt.Sprintf(" name = '%s'", activity.Name))
	}

	if activity.Sets != 0 {
		updates = append(updates, fmt.Sprintf(" sets = '%d'", activity.Sets))
	}

	if activity.Reps != 0 {
		updates = append(updates, fmt.Sprintf(" reps = '%d'", activity.Reps))
	}

	if activity.StatusID != 0 {
		updates = append(updates, fmt.Sprintf(" statusId = '%d'", activity.StatusID))
	}

	if activity.ExerciseID != 0 {
		updates = append(updates, fmt.Sprintf(" exerciseId = '%d'", activity.ExerciseID))
	}

	// no updates on base model added, nothing to update
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

func (s *Store) ExistActivity(id int) (v bool, err error) {
	var count int

	row := s.db.QueryRow("SELECT COUNT(*) FROM activities WHERE id = ?", id)
	err = row.Scan(&count)

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (s *Store) scanRowIntoActivity(rows *sql.Rows) (*types.Activity, error) {
	activity := new(types.Activity)

	err := rows.Scan(
		&activity.ID,
		&activity.Name,
		&activity.Sets,
		&activity.Reps,
		&activity.StatusID,
		&activity.ExerciseID,
		&activity.IterationID,
		&activity.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return activity, nil
}
