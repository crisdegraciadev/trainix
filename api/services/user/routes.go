package user

import (
	"fmt"
	"net/http"

	"trainix/types"
	"trainix/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type DI struct {
	Store    types.UserStore
	Password types.PasswordService
	Jwt      types.JWTService
}

type Handler struct {
	store    types.UserStore
	password types.PasswordService
	jwt      types.JWTService
}

func NewHandler(di DI) *Handler {
	return &Handler{
		store:    di.Store,
		password: di.Password,
		jwt:      di.Jwt,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("", h.handleRegister).Methods("POST")
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.RegisterUserDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	// check if password is correct
	if payload.Password != payload.ConfirmPassword {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("password doesn't match"))
		return
	}

	// check if the user exists
	_, err := h.store.FindUserByEmail(payload.Email)

	if err == nil {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("user with email [%s] already exists", payload.Email))
		return
	}

	hashedPassword, err := h.password.HashPassword(payload.Password)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// if it doesn't we create a new user
	err = h.store.CreateUser(types.User{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  hashedPassword,
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, nil)
}
