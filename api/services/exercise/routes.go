package exercise

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
	ExerciseStore   types.ExerciseStore
	MuscleStore     types.MuscleStore
	DifficultyStore types.DifficultyStore
	UserStore       types.UserStore
}

type Handler struct {
	exerciseStore   types.ExerciseStore
	muscleStore     types.MuscleStore
	difficultyStore types.DifficultyStore
	userStore       types.UserStore
}

func NewHandler(di DI) *Handler {
	return &Handler{
		exerciseStore:   di.ExerciseStore,
		muscleStore:     di.MuscleStore,
		difficultyStore: di.DifficultyStore,
		userStore:       di.UserStore,
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
	var payload types.CreateExerciseDTO

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
	isDuplicated, err := h.exerciseStore.IsExerciseDuplicated(payload.Name)

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
	if _, err := h.checkDifficultyIDs([]int{payload.DifficultyID}); err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	// create exercise on db
	exercise := types.Exercise{
		Name:        payload.Name,
		Description: payload.Description,
		VideoURL:    payload.VideoURL,
		UserID:      auth.GetUserIDFromContext(r.Context()),
	}

	ctx := context.Background()

	err = h.exerciseStore.CreateExercise(
		ctx,
		exercise,
		payload.MuscleIDs,
		payload.DifficultyID,
	)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, nil)
}

func (h *Handler) handleFilter(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.QueryExercisesDTO

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

	if _, err := h.checkDifficultyIDs([]int{rawFilter.DifficultyID}); err != nil && rawFilter.DifficultyID != 0 {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	filter := types.ExerciseFilter{
		Name:         rawFilter.Name,
		MuscleIDs:    rawFilter.MuscleIDs,
		DifficultyID: rawFilter.DifficultyID,
	}

	log.Printf("Exercise Filter Request: %v", filter)

	// setup order
	order := types.ExerciseOrder{
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

	// filter exercises
	exercises, err := h.exerciseStore.FilterExercises(filter, order, pagination)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	newValues := []types.ExerciseWithRelations{}

	for _, exercise := range exercises {
		exerciseWithRelation := types.ExerciseWithRelations{
			ID:          exercise.ID,
			Name:        exercise.Name,
			Description: exercise.Description,
			VideoURL:    exercise.VideoURL,
			UserID:      exercise.UserID,
			CreatedAt:   exercise.CreatedAt,
		}

		muscles, err := h.muscleStore.FindMusclesRelatedWithExercise(exercise.ID)

		if err != nil {
			log.Printf("failed to find muscle related with exercise %v", err)
			utils.WriteError(w, http.StatusNotFound, fmt.Errorf("related muscle not found"))
			return
		}

		exerciseWithRelation.Muscles = muscles

		difficulty, err := h.difficultyStore.FindDifficultyRelatedWithExercise(exercise.ID)

		if err != nil {
			log.Printf("failed to find difficulty related with exercise %v", err)
			utils.WriteError(w, http.StatusNotFound, fmt.Errorf("related difficulty not found"))
			return
		}

		exerciseWithRelation.Difficulty = *difficulty

		newValues = append(newValues, exerciseWithRelation)
	}

	// totalItems how many exercises where found
	totalItems, err := h.exerciseStore.CountExercises(filter)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// create page
	totalPages, pageNumber := utils.CalculatePageMetada(skip, take, totalItems)

	page := types.Page[types.ExerciseWithRelations]{
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
	id, err := utils.ParsePathParam(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// find the exercise
	exercise, err := h.exerciseStore.FindExercise(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("exercise with id [%d] not found", id))
		return
	}

	utils.WriteJSON(w, http.StatusOK, exercise)
}

func (h *Handler) handleDelete(w http.ResponseWriter, r *http.Request) {
	// get id from path param
	id, err := utils.ParsePathParam(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// check that exercise to delete exists
	_, err = h.exerciseStore.FindExercise(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("exercise to delete with id [%d] not found", id))
		return
	}

	// delete exercise
	err = h.exerciseStore.DeleteExercise(id)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}

func (h *Handler) handleUpdate(w http.ResponseWriter, r *http.Request) {
	// get id from path param
	id, err := utils.ParsePathParam(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// get JSON payload
	var payload types.UpdateExerciseDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// check that exercise to update exists
	_, err = h.exerciseStore.FindExercise(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("exercise to delete with id [%d] not found", id))
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
		if _, err := h.checkDifficultyIDs([]int{payload.DifficultyID}); err != nil {
			utils.WriteError(w, http.StatusNotFound, err)
			return
		}
	}

	// update the exercise
	updatedData := types.Exercise{
		Name:        payload.Name,
		Description: payload.Description,
		VideoURL:    payload.VideoURL,
	}

	err = h.exerciseStore.UpdateExercise(id, updatedData, payload.MuscleIDs, payload.DifficultyID)

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

func (h *Handler) checkDifficultyIDs(difficultyIDs []int) (isValid bool, err error) {
	for _, difficultyID := range difficultyIDs {
		_, err = h.difficultyStore.FindDifficultyByID(difficultyID)

		if err != nil {
			return false, fmt.Errorf("difficulty with id [%d] not found", difficultyID)
		}
	}

	return true, nil
}
