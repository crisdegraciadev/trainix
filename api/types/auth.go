package types

import "github.com/golang-jwt/jwt/v5"

type PasswordService interface {
	HashPassword(password string) (string, error)
	ComparePassword(hashed string, plain []byte) bool
}

type JWTService interface {
	CreateJWT(secret []byte, userID int) (string, error)
	ValidateJWT(tokenString string) (*jwt.Token, error)
}

type LoginDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type ValidateTokenDTO struct {
	Token string `json:"token" validate:"required"`
}
