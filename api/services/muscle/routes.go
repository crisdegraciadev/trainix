package muscle

import (
	"net/http"
	"trainix/types"
	"trainix/utils"

	"github.com/gorilla/mux"
)

type DI struct {
	MuscleStore types.MuscleStore
}

type Handler struct {
	muscleStore types.MuscleStore
}

func NewHandler(di DI) *Handler {
	return &Handler{
		muscleStore: di.MuscleStore,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("", h.handleFindAll).Methods("GET")
}

func (h *Handler) handleFindAll(w http.ResponseWriter, r *http.Request) {
	muscles, err := h.muscleStore.FindAllMuscles()

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, muscles)
}
