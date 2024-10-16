package types

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
