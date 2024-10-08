package difficulty

import (
	"database/sql"
	"fmt"
	"log"
	"trainix/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) FindDifficultyByID(id int) (*types.Difficulty, error) {
	rows, err := s.db.Query("SELECT * FROM difficulties WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	d := new(types.Difficulty)

	for rows.Next() {
		d, err = scanRowIntoDifficulty(rows)
		if err != nil {
			return nil, err
		}
	}

	if d.ID == 0 {
		return nil, fmt.Errorf("difficulty not found")
	}

	return d, nil
}

func (s *Store) FindDifficultyRelatedWithExercise(exerciseId int) (*types.Difficulty, error) {
	rows, err := s.db.Query("SELECT difficultyId FROM exercise_difficulty WHERE exerciseId = ?", exerciseId)

	if err != nil {
		return nil, err
	}

	d := new(types.Difficulty)
	var difficultyID int

	for rows.Next() {
		rows.Scan(&difficultyID)
		log.Printf("DifficultyID = %d", difficultyID)
		d, err = s.FindDifficultyByID(difficultyID)

		if err != nil {
			return nil, err
		}
	}

	if d.ID == 0 {
		return nil, fmt.Errorf("difficulty not found")
	}

	return d, nil
}

func scanRowIntoDifficulty(rows *sql.Rows) (*types.Difficulty, error) {
	difficulty := new(types.Difficulty)

	err := rows.Scan(
		&difficulty.ID,
		&difficulty.Label,
		&difficulty.Value,
	)

	if err != nil {
		return nil, err
	}

	return difficulty, nil
}
