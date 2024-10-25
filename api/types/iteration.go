package types

import (
	"context"
	"time"
)

type IterationStore interface {
	CreateIteration(ctx context.Context, iteration Iteration, activities []Activity) error
	FindIteration(id int) (iteration *Iteration, err error)
	FindIterationBefore(createdAt time.Time) (iteration *Iteration, err error)
}

type Iteration struct {
	ID        int       `json:"id"`
	WorkoutID int       `json:"workoutId"`
	CreatedAt time.Time `json:"createdAt"`
}

type CreateIterationDTO struct {
	WorkoutID  int                 `json:"workoutId"`
	Activities []CreateActivityDTO `json:"activities" validate:"required,min=1"`
}

type UpdateIterationDTO struct {
	Activities []UpdateActivityDTO `json:"activities"`
}
