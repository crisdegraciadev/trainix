package iteration

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
	UserStore      types.UserStore
	IteartionStore types.IterationStore
	ActivityStore  types.ActivityStore
	WorkoutStore   types.WorkoutStore
	ExerciseStore  types.ExerciseStore
	StatusStore    types.StatusStore
}

type Handler struct {
	userStore      types.UserStore
	iterationStore types.IterationStore
	activityStore  types.ActivityStore
	workoutStore   types.WorkoutStore
	exerciseStore  types.ExerciseStore
	statusStore    types.StatusStore
}

func NewHandler(di DI) *Handler {
	return &Handler{
		userStore:      di.UserStore,
		iterationStore: di.IteartionStore,
		activityStore:  di.ActivityStore,
		workoutStore:   di.WorkoutStore,
		exerciseStore:  di.ExerciseStore,
		statusStore:    di.StatusStore,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("", auth.WithJWTAuth(h.handleCreate, h.userStore)).Methods("POST")
	router.HandleFunc("", auth.WithJWTAuth(h.handleFilter, h.userStore)).Methods("QUERY")
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
	iteration := types.Iteration{WorkoutID: payload.WorkoutID}
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

// TODO: Add QueryIterationDTO
func (h *Handler) handleFilter(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.QueryIterationDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	rawFilter, rawOrder := payload.Filter, payload.Order

	// setup filter
	if _, err := h.workoutStore.FindWorkout(rawFilter.WorkoutID); err != nil && rawFilter.WorkoutID != 0 {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	filter := types.IterationFilter{
		WorkoutID: rawFilter.WorkoutID,
	}

	log.Printf("Iteration Filter Request: %v", filter)

	// setup order
	order := types.IterationOrder{
		CreatedAt: rawOrder.CreatedAt,
	}

	// setup pagination
	skip, err := utils.ParseQueryParam(r, "skip", 0)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	take, err := utils.ParseQueryParam(r, "take", 10)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	pagination := types.Pagination{
		Take: take,
		Skip: skip,
	}

	// filter iterations
	iterations, err := h.iterationStore.FilterAllIterations(filter, order, pagination)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

  // build iterations with relations
	iterationsWR, err := h.buildIterationsWithRelations(iterations)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	// totalItems how many exercises where found
	totalItems, err := h.iterationStore.CountIterations(filter.WorkoutID)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// create page
	totalPages, pageNumber := utils.CalculatePageMetada(skip, take, totalItems)

	page := types.Page[types.IterationWithRelations]{
		Values:     iterationsWR,
		TotalItems: totalItems,
		TotalPages: totalPages,
		PageNumber: pageNumber,
		PageSize:   take,
		PageOffset: skip,
	}

	utils.WriteJSON(w, http.StatusOK, page)
}

func (h *Handler) buildIterationsWithRelations(iterations []types.Iteration) ([]types.IterationWithRelations, error) {
	iterationsWR := []types.IterationWithRelations{}

	for _, i := range iterations {

		activities, err := h.activityStore.FindActivitiesByIteraion(i.ID)

		if err != nil {
			return nil, fmt.Errorf("related activities not found")
		}

		activitiesWR := []types.ActivityWithRelations{}

		for _, a := range activities {
			exercise, err := h.exerciseStore.FindExercise(a.ExerciseID)

			if err != nil {
				return nil, fmt.Errorf("exercise not found")
			}

			status, err := h.statusStore.FindStatus(a.StatusID)

			if err != nil {
				return nil, fmt.Errorf("status not found")
			}

			activityWithRelations := types.ActivityWithRelations{
				Name:      a.Name,
				Sets:      a.Sets,
				Reps:      a.Reps,
				Exercise:  *exercise,
				Status:    *status,
				CreatedAt: a.CreatedAt,
			}

			activitiesWR = append(activitiesWR, activityWithRelations)
		}

		iterationWithRelations := types.IterationWithRelations{
			ID:         i.ID,
			WorkoutID:  i.WorkoutID,
			Activities: activitiesWR,
			CreatedAt:  i.CreatedAt,
		}

		iterationsWR = append(iterationsWR, iterationWithRelations)
	}

	return iterationsWR, nil
}

func (h *Handler) handleUpdate(w http.ResponseWriter, r *http.Request) {
	// get id from path param
	id, err := utils.ParsePathParamInt(r, "id")

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// get JSON payload
	var payload types.UpdateIterationDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// check that iteration to update exists
	_, err = h.iterationStore.FindIteration(id)

	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("workout to update with id [%d] not found", id))
		return
	}

	// check activities are provided
	if len(payload.Activities) != 0 {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("no activities given to update"))
		return
	}

	// check if activities exists
	for _, a := range payload.Activities {
		if _, err := h.activityStore.ExistActivity(a.ID); err != nil {
			utils.WriteError(w, http.StatusNotFound, err)
			return
		}
	}

	// Update activities on iteration
	for _, a := range payload.Activities {
		updatedData := types.Activity{
			Name:       a.Name,
			Sets:       a.Sets,
			Reps:       a.Reps,
			StatusID:   a.StatusID,
			ExerciseID: a.ExerciseID,
		}

		err := h.activityStore.UpdateActivity(a.ID, updatedData)

		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err)
			return
		}
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}

func (h *Handler) handleDelete(w http.ResponseWriter, r *http.Request) {
}
