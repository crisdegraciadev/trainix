package utils

import "math"

func CalculatePageMetada(skip int, take int, total int) (totalPages int, pageNumber int) {
	totalPages = int(math.Ceil(float64(total) / float64(take)))
	pageNumber = int(math.Ceil((float64(skip*take) / float64(totalPages))))

	return totalPages, pageNumber
}
