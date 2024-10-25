package status

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

func (s *Store) FindStatus(id int) (*types.Status, error) {
	rows, err := s.db.Query("SELECT * FROM status WHERE id = ?", id)

	if err != nil {
		return nil, err
	}

	status := new(types.Status)

	for rows.Next() {
		status, err = scanRowIntoStatus(rows)
		if err != nil {
			return nil, err
		}
	}

	rows.Close()

	if status.ID == 0 {
		return nil, fmt.Errorf("status not found")
	}

	return status, nil
}

func scanRowIntoStatus(rows *sql.Rows) (*types.Status, error) {
	status := new(types.Status)

	err := rows.Scan(
		&status.ID,
		&status.Label,
		&status.Value,
	)

	if err != nil {
		return nil, err
	}

	return status, nil
}
