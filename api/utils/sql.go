package utils

import (
	"strconv"
	"strings"
)

func MapIDsToSQLRange(arr []int) string {
	strArr := make([]string, len(arr))

	for i, num := range arr {
		strArr[i] = strconv.Itoa(num)
	}

	return "(" + strings.Join(strArr, ",") + ")"
}
