package types

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Common
type Page[T any] struct {
	Values     []T `json:"values"`
	PageNumber int `json:"pageNumber"`
	PageSize   int `json:"pageSize"`
	PageOffset int `json:"pageOffset"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totaPages"`
}

type Pagination struct {
	Skip int
	Take int
}

// Auth
type PasswordService interface {
	HashPassword(password string) (string, error)
	ComparePassword(hashed string, plain []byte) bool
}

type JWTService interface {
	CreateJWT(secret []byte, userID int) (string, error)
	ValidateJWT(tokenString string) (*jwt.Token, error)
}

type LoginDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type ValidateTokenDTO struct {
	Token string `json:"token" validate:"required"`
}

// User
type UserStore interface {
	FindUserByEmail(email string) (*User, error)
	FindUserByID(id int) (*User, error)
	CreateUser(User) error
}

type User struct {
	ID        int       `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"createdAt"`
}

type RegisterUserDTO struct {
	FirstName       string `json:"firstName" validate:"required"`
	LastName        string `json:"lastName" validate:"required"`
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=3,max=130"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=3,max=130"`
}

// Exercise
type ExerciseStore interface {
	CreateExercise(ctx context.Context, exercise Exercise, muscleIDS []int, difficultyID int) error
	IsExerciseDuplicated(name string) (v bool, err error)
	FilterExercises(filter ExerciseFilter, order ExerciseOrder, pagination Pagination) (exercises []Exercise, err error)
	CountExercises(filter ExerciseFilter) (count int, err error)
	FindExercise(id int) (exercise *Exercise, err error)
	UpdateExercise(id int, exercise Exercise, muscleIDs []int, difficultyID int) error
	DeleteExercise(id int) error
}

type Exercise struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	VideoURL    string    `json:"videoUrl"`
	UserID      int       `json:"userId"`
	CreatedAt   time.Time `json:"createdAt"`
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
	UserID       int    `json:"userId"`
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

// Muscle
type MuscleStore interface {
	FindMuscleByID(id int) (*Muscle, error)
	FindAllMuscles() ([]Muscle, error)
	FindMusclesRelatedWithExercise(exerciseId int) ([]Muscle, error)
}

type Muscle struct {
	ID    int    `json:"id"`
	Label string `json:"label"`
	Value int    `json:"value"`
}

// Difficulty
type DifficultyStore interface {
	FindDifficultyByID(id int) (*Difficulty, error)
	FindAllDifficulties() ([]Difficulty, error)
	FindDifficultyRelatedWithExercise(exerciseId int) (*Difficulty, error)
}

type Difficulty struct {
	ID    int    `json:"id"`
	Label string `json:"label"`
	Value int    `json:"value"`
}
