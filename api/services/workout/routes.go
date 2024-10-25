package workout

import (
	"context"
	"fmt"
	"log"
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
	isDuplicated, err := h.workoutStore.ExistWorkout(payload.Name)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if isDuplicated {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("workout with name [%s] already exists", payload.Name))
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
	// get JSON payload
	var payload types.QueryWorkoutsDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	rawFilter, rawOrder := payload.Filter, payload.Order

	// setup filter
	if _, err := h.checkMuscleIDs(rawFilter.MuscleIDs); err != nil && len(rawFilter.MuscleIDs) != 0 {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	if _, err := h.checkDifficultyID(rawFilter.DifficultyID); err != nil && rawFilter.DifficultyID != 0 {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	filter := types.WorkoutFilter{
		Name:         rawFilter.Name,
		MuscleIDs:    rawFilter.MuscleIDs,
		DifficultyID: rawFilter.DifficultyID,
	}

	log.Printf("Exercise Filter Request: %v", filter)

	// setup order
	order := types.WorkoutOrder{
		Name:      rawOrder.Name,
		CreatedAt: rawOrder.CreatedAt,
	}

	// setup pagination
	skip, err := utils.ParseQueryParam(r, "skip", 0)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	take, err := utils.ParseQueryParam(r, "take", 12)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	pagination := types.Pagination{
		Take: take,
		Skip: skip,
	}

	// filter workouts
	workouts, err := h.workoutStore.FilterWorkouts(filter, order, pagination)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	newValues := []types.WorkoutWithRelations{}

	for _, workout := range workouts {
		workoutWithRelations := types.WorkoutWithRelations{
			ID:          workout.ID,
			Name:        workout.Name,
			Description: workout.Description,
			UserID:      workout.UserID,
			CreatedAt:   workout.CreatedAt,
		}

		muscles, err := h.muscleStore.FindMusclesRelatedWithWorkout(workout.ID)

		if err != nil {
			log.Printf("failed to find muscle related with exercise %v", err)
			utils.WriteError(w, http.StatusNotFound, fmt.Errorf("related muscle not found"))
			return
		}

		workoutWithRelations.Muscles = muscles

		difficulty, err := h.difficultyStore.FindDifficultyByID(workout.DifficultyID)

		if err != nil {
			log.Printf("failed to find difficulty related with exercise %v", err)
			utils.WriteError(w, http.StatusNotFound, fmt.Errorf("related difficulty not found"))
			return
		}

		workoutWithRelations.Difficulty = *difficulty

		newValues = append(newValues, workoutWithRelations)
	}

	// totalItems how many exercises where found
	totalItems, err := h.workoutStore.CountWorkouts(filter)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// create page
	totalPages, pageNumber := utils.CalculatePageMetada(skip, take, totalItems)

	page := types.Page[types.WorkoutWithRelations]{
		Values:     newValues,
		TotalItems: totalItems,
		TotalPages: totalPages,
		PageNumber: pageNumber,
		PageSize:   take,
		PageOffset: skip,
	}

	utils.WriteJSON(w, http.StatusOK, page)
}

func (h *Handler) handleFind(w http.ResponseWriter, r *http.Request) {
	// get id from path param
	id, err := utils.ParsePathParamInt(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// find the workout
	workout, err := h.workoutStore.FindWorkout(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("workout with id [%d] not found", id))
		return
	}

	utils.WriteJSON(w, http.StatusOK, workout)
}

func (h *Handler) handleUpdate(w http.ResponseWriter, r *http.Request) {
	// get id from path param
	id, err := utils.ParsePathParamInt(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// get JSON payload
	var payload types.UpdateWorkoutDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// check that workout to update exists
	_, err = h.workoutStore.FindWorkout(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("workout to update with id [%d] not found", id))
		return
	}

	// check muscleIDs if provided
	if payload.MuscleIDs != nil {

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
	}

	// check difficultyId if provided
	if payload.DifficultyID != 0 {

		// check if difficulty exists
		if _, err := h.checkDifficultyID(payload.DifficultyID); err != nil {
			utils.WriteError(w, http.StatusNotFound, err)
			return
		}
	}

	// update the exercise
	updatedData := types.Workout{
		Name:         payload.Name,
		Description:  payload.Description,
		DifficultyID: payload.DifficultyID,
	}

	err = h.workoutStore.UpdateWorkout(id, updatedData, payload.MuscleIDs)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}

func (h *Handler) handleDelete(w http.ResponseWriter, r *http.Request) {
	// get id from path param
	id, err := utils.ParsePathParamInt(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// check that workout to delete exists
	_, err = h.workoutStore.FindWorkout(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("workout to delete with id [%d] not found", id))
		return
	}

	// delete exercise
	err = h.workoutStore.DeleteWorkout(id)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
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
