package utils

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

func ParseQueryParam(r *http.Request, name string, defaultValue int) (val int, err error) {
	if param := r.URL.Query().Get(name); param != "" {
		parsedParam, err := strconv.Atoi(param)

		if err != nil {
			return 0, err
		}

		return parsedParam, nil
	}

	return defaultValue, nil
}

func ParsePathParamTime(r *http.Request, name string) (val time.Time, err error) {
	vars := mux.Vars(r)
	param := vars[name]

	if param == "" {
		return time.Time{}, fmt.Errorf("path param with name [%s] not found", name)
	}

	layout := "2006-01-02"
	parsedTime, err := time.Parse(layout, param)
	if err != nil {
		return time.Time{}, fmt.Errorf("invalid date format for param [%s]: %v", name, err)
	}

	return parsedTime, nil
}

func ParsePathParamInt(r *http.Request, name string) (val int, err error) {
	vars := mux.Vars(r)
	param := vars[name]

	if param == "" {
		return 0, fmt.Errorf("path param with name [%s] not found", name)
	}

	parsedParam, err := strconv.Atoi(param)

	if err != nil {
		return 0, err
	}

	return parsedParam, nil
}

func GetTokenFromRequest(r *http.Request) string {
	header := r.Header.Get("Authorization")
	authArgs := strings.Split(header, " ")
	return authArgs[1]
}
