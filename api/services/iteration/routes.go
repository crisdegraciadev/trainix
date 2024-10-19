package iteration

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
	UserStore      types.UserStore
	IteartionStore types.IterationStore
	WorkoutStore   types.WorkoutStore
}

type Handler struct {
	userStore      types.UserStore
	iterationStore types.IterationStore
	workoutStore   types.WorkoutStore
}

func NewHandler(di DI) *Handler {
	return &Handler{
		userStore:      di.UserStore,
		iterationStore: di.IteartionStore,
		workoutStore:   di.WorkoutStore,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("", auth.WithJWTAuth(h.handleCreate, h.userStore)).Methods("POST")
	router.HandleFunc("", auth.WithJWTAuth(h.handleFindAll, h.userStore)).Methods("GET")
	router.HandleFunc("/{id}", auth.WithJWTAuth(h.handleFind, h.userStore)).Methods("GET")
	router.HandleFunc("/{id}", auth.WithJWTAuth(h.handleUpdate, h.userStore)).Methods("PUT")
	router.HandleFunc("/{id}", auth.WithJWTAuth(h.handleDelete, h.userStore)).Methods("DELETE")
}

func (h *Handler) handleCreate(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.CreateIterationDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	// check if workout exists
	workout, err := h.workoutStore.FindWorkout(payload.WorkoutID)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if workout.ID == 0 || workout == nil {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("workout with id [%d] does not exist", payload.WorkoutID))
		return
	}

	// create iteration on db
	iteration := types.Iteration{
		WorkoutID: payload.WorkoutID,
	}

	activities := []types.Activity{}

	for _, a := range payload.Activities {
		activities = append(activities, types.Activity{
			Name:       a.Name,
			Sets:       a.Sets,
			Reps:       a.Reps,
			StatusID:   a.StatusID,
			ExerciseID: a.ExerciseID,
		})
	}

	ctx := context.Background()

	err = h.iterationStore.CreateIteration(ctx, iteration, activities)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, nil)
}

func (h *Handler) handleFindAll(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) handleFind(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) handleUpdate(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) handleDelete(w http.ResponseWriter, r *http.Request) {
}
