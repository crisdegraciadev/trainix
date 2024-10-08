package auth

import (
	"fmt"
	"net/http"

	"trainix/config"
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
	router.HandleFunc("/login", h.handleLogin).Methods("POST")
	router.HandleFunc("/validate", h.handleValidate).Methods("POST")
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.LoginDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	// find the user if exists
	u, err := h.store.FindUserByEmail(payload.Email)

	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid credentials"))
		return
	}

	// check if the passwords match
	if !h.password.ComparePassword(u.Password, []byte(payload.Password)) {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid credentials"))
		return
	}

	// generate JWT
	secret := []byte(config.Envs.JWTSecret)
	token, err := h.jwt.CreateJWT(secret, u.ID)

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})
}

func (h *Handler) handleValidate(w http.ResponseWriter, r *http.Request) {
	// get JSON payload
	var payload types.ValidateTokenDTO

	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	// validate jwt token
	token, err := h.jwt.ValidateJWT(payload.Token)

	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("failed to validate token"))
		return
	}

	if !token.Valid {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	utils.WriteJSON(w, http.StatusOK, nil)
}
