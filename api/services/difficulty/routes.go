package difficulty

import (
	"net/http"
	"trainix/types"
	"trainix/utils"

	"github.com/gorilla/mux"
)

type DI struct {
	DifficultyStore types.DifficultyStore
}

type Handler struct {
	difficultyStore types.DifficultyStore
}

func NewHandler(di DI) *Handler {
	return &Handler{
		difficultyStore: di.DifficultyStore,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("", h.handleFindAll).Methods("GET")
}

func (h *Handler) handleFindAll(w http.ResponseWriter, r *http.Request) {
	difficulties, err := h.difficultyStore.FindAllDifficulties()

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, difficulties)
}
