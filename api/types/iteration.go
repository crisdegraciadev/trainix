package types

import (
	"context"
	"time"
)

type IterationStore interface {
	CreateIteration(ctx context.Context, iteration Iteration, activities []Activity) error
	FilterAllIterations(filter IterationFilter, order IterationOrder, pagination Pagination) (iterations []Iteration, err error)
	FindIteration(id int) (*Iteration, error)
	CountIterations(workoutId int) (int, error)
}

type Iteration struct {
	ID        int       `json:"id"`
	WorkoutID int       `json:"workoutId"`
	CreatedAt time.Time `json:"createdAt"`
}

type IterationWithRelations struct {
	ID         int                     `json:"id"`
	WorkoutID  int                     `json:"workoutId"`
	Activities []ActivityWithRelations `json:"activities"`
	CreatedAt  time.Time               `json:"createdAt"`
}

type IterationFilter struct {
	WorkoutID int
}

type IterationOrder struct {
	CreatedAt string
}

type CreateIterationDTO struct {
	WorkoutID  int                 `json:"workoutId"`
	Activities []CreateActivityDTO `json:"activities" validate:"required,min=1"`
}

type UpdateIterationDTO struct {
	Activities []UpdateActivityDTO `json:"activities"`
}

type QueryIterationDTO struct {
	Filter FilterIterationsDTO `json:"filter"`
	Order  OrderIterationsDTO  `json:"order"`
}

type FilterIterationsDTO struct {
	WorkoutID int `json:"workoutId"`
}

type OrderIterationsDTO struct {
	CreatedAt string
}
