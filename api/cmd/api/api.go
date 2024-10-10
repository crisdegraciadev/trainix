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

	userRouter := mainRouter.PathPrefix("/users").Subrouter()
	setupUserRoutes(s, userRouter)

	exerciseRouter := mainRouter.PathPrefix("/exercises").Subrouter()
	setupExerciseRoutes(s, exerciseRouter)

	muscleRouter := mainRouter.PathPrefix("/muscles").Subrouter()
	setupMuscleRoutes(s, muscleRouter)

	difficultyRouter := mainRouter.PathPrefix("/difficulties").Subrouter()
	setupDifficultuRoutes(s, difficultyRouter)

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

func setupMuscleRoutes(s *APIServer, muscleRouter *mux.Router) {
	di := muscle.DI{
		MuscleStore: muscle.NewStore(s.db),
	}

	muscleHandler := muscle.NewHandler(di)
	muscleHandler.RegisterRoutes(muscleRouter)
}

func setupDifficultuRoutes(s *APIServer, difficultyRouter *mux.Router) {
	di := difficulty.DI{
		DifficultyStore: difficulty.NewStore(s.db),
	}

	difficultyHandler := difficulty.NewHandler(di)
	difficultyHandler.RegisterRoutes(difficultyRouter)
}
