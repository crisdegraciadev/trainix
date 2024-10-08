package api

import (
	"database/sql"
	"log"
	"net/http"
	"trainix/services/auth"
	"trainix/services/difficulty"
	"trainix/services/exercise"
	"trainix/services/muscle"
	"trainix/services/user"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type APIServer struct {
	address string
	db      *sql.DB
}

func NewAPIServer(address string, db *sql.DB) *APIServer {
	return &APIServer{
		address: address,
		db:      db,
	}
}

func (s *APIServer) Run() error {
	router := mux.NewRouter()
	mainRouter := router.PathPrefix("/api/v1").Subrouter()

	authRouter := mainRouter.PathPrefix("/auth").Subrouter()
	setupAuthRoutes(s, authRouter)

	userRouter := mainRouter.PathPrefix("/user").Subrouter()
	setupUserRoutes(s, userRouter)

	exerciseRouter := mainRouter.PathPrefix("/exercises").Subrouter()
	setupExerciseRoutes(s, exerciseRouter)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"QUERY", "GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-type"},
		AllowCredentials: true,
		// Debug:            true,
	})

	handler := c.Handler(router)

	log.Println("Listening on", s.address)

	return http.ListenAndServe(s.address, handler)
}

func setupAuthRoutes(s *APIServer, userRouter *mux.Router) {
	di := auth.DI{
		Store:    user.NewStore(s.db),
		Jwt:      auth.NewJWTService(),
		Password: auth.NewPasswordService(),
	}

	authHandler := auth.NewHandler(di)
	authHandler.RegisterRoutes(userRouter)
}

func setupUserRoutes(s *APIServer, userRouter *mux.Router) {
	di := user.DI{
		Store:    user.NewStore(s.db),
		Jwt:      auth.NewJWTService(),
		Password: auth.NewPasswordService(),
	}

	userHandler := user.NewHandler(di)
	userHandler.RegisterRoutes(userRouter)
}

func setupExerciseRoutes(s *APIServer, exerciseRouter *mux.Router) {
	di := exercise.DI{
		ExerciseStore:   exercise.NewStore(s.db),
		MuscleStore:     muscle.NewStore(s.db),
		DifficultyStore: difficulty.NewStore(s.db),
		UserStore:       user.NewStore(s.db),
	}

	exerciseHandler := exercise.NewHandler(di)
	exerciseHandler.RegisterRoutes(exerciseRouter)
}
