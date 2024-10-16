package types

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
