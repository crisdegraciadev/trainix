package utils

import (
	"fmt"
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

func MapOrdersToSQL(order map[string]string) string {
	var clauses []string

	for field, order := range order {
		if order != "" {
			clauses = append(clauses, fmt.Sprintf("%s %s", field, order))
		}
	}

	return " ORDER BY " + strings.Join(clauses, ", ")
}
