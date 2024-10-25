package types

type StatusStore interface {
	FindStatus(id int) (*Status, error)
}

type Status struct {
	ID    int    `json:"id"`
	Label string `json:"label"`
	Value int    `json:"value"`
}
