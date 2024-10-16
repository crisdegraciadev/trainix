package types

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
