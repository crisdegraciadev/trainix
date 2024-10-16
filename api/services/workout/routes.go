package workout

import (
	"context"
	"fmt"
	"net/http"
	"trainix/services/auth"
	"trainix/types"
	"trainix/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type DI struct {
	UserStore       types.UserStore
	WorkoutStore    types.WorkoutStore
	DifficultyStore types.DifficultyStore
	MuscleStore     types.MuscleStore
}

type Handler struct {
	userStore       types.UserStore
	workoutStore    types.WorkoutStore
	difficultyStore types.DifficultyStore
	muscleStore     types.MuscleStore
}

func NewHandler(di DI) *Handler {
	return &Handler{
		userStore:       di.UserStore,
		workoutStore:    di.WorkoutStore,
		difficultyStore: di.DifficultyStore,
		muscleStore:     di.MuscleStore,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("", auth.WithJWTAuth(h.handleCreate, h.userStore)).Methods("POST")
	router.HandleFunc("", auth.WithJWTAuth(h.handleFilter, h.userStore)).Methods("QUERY")
	router.HandleFunc("/{id}", auth.WithJWTAuth(h.handleFind, h.userStore)).Methods("GET")
	router.HandleFunc("/{id}", auth.WithJWTAuth(h.handleUpdate, h.userStore)).Methods("PUT")
	router.HandleFunc("/{id}", auth.WithJWTAuth(h.handleDelete, h.userStore)).Methods("DELETE")
}

func (h *Handler) handleCreate(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.CreateWorkoutDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	// check if exercise already exists
	isDuplicated, err := h.workoutStore.IsWorkoutDuplicated(payload.Name)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if isDuplicated {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("exercise with name [%s] already exists", payload.Name))
		return
	}

	// check muscleIds is not empty
	if len(payload.MuscleIDs) == 0 {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("no muscles given to link"))
		return
	}

	// check if muscles exists
	if _, err := h.checkMuscleIDs(payload.MuscleIDs); err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	// check if difficulty exists
	if _, err := h.checkDifficultyID(payload.DifficultyID); err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	// create workout on db
	workout := types.Workout{
		Name:         payload.Name,
		Description:  payload.Description,
		UserID:       auth.GetUserIDFromContext(r.Context()),
		DifficultyID: payload.DifficultyID,
	}

	ctx := context.Background()

	err = h.workoutStore.CreateWorkout(ctx, workout, payload.MuscleIDs)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, nil)
}

func (h *Handler) handleFilter(w http.ResponseWriter, r *http.Request) {
	// TODO
}

func (h *Handler) handleFind(w http.ResponseWriter, r *http.Request) {
	// TODO
}

func (h *Handler) handleUpdate(w http.ResponseWriter, r *http.Request) {
	// TODO
}

func (h *Handler) handleDelete(w http.ResponseWriter, r *http.Request) {
	// TODO
}

func (h *Handler) checkMuscleIDs(muscleIDs []int) (isValid bool, err error) {
	for _, muscleId := range muscleIDs {
		_, err := h.muscleStore.FindMuscleByID(muscleId)

		if err != nil {
			return false, fmt.Errorf("muscle with id [%d] not found", muscleId)
		}
	}

	return true, nil
}

func (h *Handler) checkDifficultyID(difficultyID int) (isValid bool, err error) {
	_, err = h.difficultyStore.FindDifficultyByID(difficultyID)

	if err != nil {
		return false, fmt.Errorf("difficulty with id [%d] not found", difficultyID)
	}

	return true, nil
}
