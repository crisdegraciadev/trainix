package utils

import (
	"database/sql"
	"fmt"
)

func Transaction(tx *sql.Tx, f func() error) error {
	if err := f(); err != nil {
		_ = tx.Rollback()
		return fmt.Errorf("f %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("Commit %w", err)
	}

	return nil
}
