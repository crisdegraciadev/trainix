package types

import (
	"context"
	"time"
)

type WorkoutStore interface {
	CreateWorkout(ctx context.Context, workout Workout, muscleIDS []int) error
	IsWorkoutDuplicated(name string) (v bool, err error)
	FilterWorkouts(filter WorkoutFilter, order WorkoutOrder, pagination Pagination) (workouts []Workout, err error)
	CountWorkouts(filter WorkoutFilter) (count int, err error)
	FindWorkout(id int) (workout *Workout, err error)
	UpdateWorkout(id int, workout Workout, muscleIDS []int) error
	DeleteWorkout(id int) error
}

type Workout struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	UserID       int       `json:"userId"`
	DifficultyID int       `json:"difficultyId"`
	CreatedAt    time.Time `json:"createdAt"`
}

type WorkoutWithRelations struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	UserID      int        `json:"userId"`
	Muscles     []Muscle   `json:"muscles"`
	Difficulty  Difficulty `json:"difficulty"`
	CreatedAt   time.Time  `json:"createdAt"`
}

type WorkoutFilter struct {
	Name         string
	MuscleIDs    []int
	DifficultyID int
}

type WorkoutOrder struct {
	Name      string
	CreatedAt string
}

type QueryWorkoutsDTO struct {
	Filter FilterWorkoutsDTO `json:"filter"`
	Order  OrderWorkoutsDTO  `json:"order"`
}

type FilterWorkoutsDTO struct {
	Name         string `json:"name"`
	MuscleIDs    []int  `json:"muscleIds"`
	DifficultyID int    `json:"difficultyId"`
}

type OrderWorkoutsDTO struct {
	Name      string
	CreatedAt string
}

type CreateWorkoutDTO struct {
	Name         string `json:"name" validate:"required"`
	Description  string `json:"description"`
	DifficultyID int    `json:"difficultyId" validate:"required"`
	MuscleIDs    []int  `json:"muscleIds" validate:"required"`
}

type UpdateWorkoutDTO struct {
	Name         string `json:"name" validate:"required"`
	Description  string `json:"description"`
	MuscleIDs    []int  `json:"muscleIds" validate:"required"`
	DifficultyID int    `json:"difficultyID" validate:"required"`
}
