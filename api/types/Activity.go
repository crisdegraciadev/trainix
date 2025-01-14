package types

import (
	"database/sql"
	"time"
)

type ActivityStore interface {
	CreateActivity(tx *sql.Tx, iterationId int, activity Activity) error
	UpdateActivity(id int, activity Activity) error
	FindActivity(id int) (*Activity, error)
	FindActivitiesByIteraion(iterationId int) ([]Activity, error)
	ExistActivity(id int) (v bool, err error)
}

type Activity struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Sets        int       `json:"sets"`
	Reps        int       `json:"reps"`
	Order      int    `json:"order"`
	StatusID    int       `json:"statusID"`
	ExerciseID  int       `json:"exerciseID"`
	IterationID int       `json:"iterationId"`
	CreatedAt   time.Time `json:"createdAt"`
}

type ActivityWithRelations struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Sets      int       `json:"sets"`
	Reps      int       `json:"reps"`
	Status    Status    `json:"status"`
	Exercise  Exercise  `json:"exercise"`
	CreatedAt time.Time `json:"createdAt"`
}

type CreateActivityDTO struct {
	Name       string `json:"name"`
	Sets       int    `json:"sets"`
	Reps       int    `json:"reps"`
	Order      int    `json:"order"`
	StatusID   int    `json:"statusID"`
	ExerciseID int    `json:"exerciseID"`
}

type UpdateActivityDTO struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Sets       int    `json:"sets"`
	Reps       int    `json:"reps"`
	StatusID   int    `json:"statusID"`
	ExerciseID int    `json:"exerciseID"`
}
