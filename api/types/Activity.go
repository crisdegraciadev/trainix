package types

import "time"

type ActivityStore interface {
	CreateActivity(activity Activity) error
	UpdateActivity(id int, activity Activity) error
}

type Activity struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Sets        int       `json:"sets"`
	Reps        int       `json:"reps"`
	StatusID    int       `json:"statusID"`
	ExerciseID  int       `json:"exerciseID"`
	IterationID int       `json:"iterationId"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreateActivityDTO struct {
	Name        string `json:"name"`
	Sets        int    `json:"sets"`
	Reps        int    `json:"reps"`
	StatusID    int    `json:"statusID"`
	ExerciseID  int    `json:"exerciseID"`
}
