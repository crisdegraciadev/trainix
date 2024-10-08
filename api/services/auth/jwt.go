package auth

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"trainix/config"
	"trainix/types"
	"trainix/utils"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct{}

func NewJWTService() *JWTService {
	return &JWTService{}
}

func (s *JWTService) CreateJWT(secret []byte, userID int) (string, error) {
	expiration := time.Second * time.Duration(config.Envs.JWTExpirationInSeconds)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID":    strconv.Itoa(userID),
		"expiresAt": time.Now().Add(expiration).Unix(),
	})

	tokenString, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *JWTService) ValidateJWT(tokenString string) (*jwt.Token, error) {
	return validateJWT(tokenString)
}

func validateJWT(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.Envs.JWTSecret), nil
	})
}

const UserKey string = "userID"

func WithJWTAuth(handlerFunc http.HandlerFunc, store types.UserStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := utils.GetTokenFromRequest(r)
		token, err := validateJWT(tokenString)

		if err != nil {
			log.Printf("failed to validate token: %v", err)
			utils.WriteError(w, http.StatusForbidden, fmt.Errorf("permission denied"))
			return
		}

		if !token.Valid {
			log.Println("invalid token")
			utils.WriteError(w, http.StatusForbidden, fmt.Errorf("permission denied"))
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		str := claims["userID"].(string)

		userID, err := strconv.Atoi(str)

		if err != nil {
			log.Printf("failed to convert userID to int: %v", err)
			utils.WriteError(w, http.StatusForbidden, fmt.Errorf("permission denied"))
			return
		}

		u, err := store.FindUserByID(userID)

		if err != nil {
			log.Printf("failed to get user by id: %v", err)
			utils.WriteError(w, http.StatusForbidden, fmt.Errorf("permission denied"))
			return
		}

		// Add the user to the context
		ctx := r.Context()
		ctx = context.WithValue(ctx, UserKey, u.ID)
		r = r.WithContext(ctx)

		// Call the function if the token is valid
		handlerFunc(w, r)
	}
}

func GetUserIDFromContext(ctx context.Context) int {
	userID, ok := ctx.Value(UserKey).(int)

	if !ok {
		return 0
	}

	return userID
}
