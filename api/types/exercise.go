package types

import (
	"context"
	"time"
)

type ExerciseStore interface {
	CreateExercise(ctx context.Context, exercise Exercise, muscleIDS []int) error
	IsExerciseDuplicated(name string) (v bool, err error)
	FilterExercises(filter ExerciseFilter, order ExerciseOrder, pagination Pagination) (exercises []Exercise, err error)
	CountExercises(filter ExerciseFilter) (count int, err error)
	FindExercise(id int) (exercise *Exercise, err error)
	UpdateExercise(id int, exercise Exercise, muscleIDs []int) error
	DeleteExercise(id int) error
}

type Exercise struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	VideoURL     string    `json:"videoUrl"`
	UserID       int       `json:"userId"`
	DifficultyID int       `json:"difficultyId"`
	CreatedAt    time.Time `json:"createdAt"`
}

type ExerciseWithRelations struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	VideoURL    string     `json:"videoUrl"`
	UserID      int        `json:"userId"`
	Muscles     []Muscle   `json:"muscles"`
	Difficulty  Difficulty `json:"difficulty"`
	CreatedAt   time.Time  `json:"createdAt"`
}

type ExerciseFilter struct {
	Name         string
	MuscleIDs    []int
	DifficultyID int
}

type ExerciseOrder struct {
	Name      string
	CreatedAt string
}

type CreateExerciseDTO struct {
	Name         string `json:"name" validate:"required"`
	Description  string `json:"description"`
	VideoURL     string `json:"videoUrl" validate:"omitempty,url"`
	MuscleIDs    []int  `json:"muscleIds" validate:"required"`
	DifficultyID int    `json:"difficultyID" validate:"required"`
}

type QueryExercisesDTO struct {
	Filter FilterExercisesDTO `json:"filter"`
	Order  OrderExercisesDTO  `json:"order"`
}

type FilterExercisesDTO struct {
	Name         string `json:"name"`
	MuscleIDs    []int  `json:"muscleIds"`
	DifficultyID int    `json:"difficultyId"`
}

type OrderExercisesDTO struct {
	Name      string
	CreatedAt string
}

type UpdateExerciseDTO struct {
	Name         string `json:"name" validate:"required"`
	Description  string `json:"description"`
	VideoURL     string `json:"videoUrl" validate:"omitempty,url"`
	MuscleIDs    []int  `json:"muscleIds" validate:"required"`
	DifficultyID int    `json:"difficultyID" validate:"required"`
}
