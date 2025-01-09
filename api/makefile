build:
	@go build -o bin/trainix cmd/main.go

test:
	@set -o pipefail && go test -json -v ./... | tparse -all 

run: build
	@./bin/trainix

migration:
	@migrate create -ext sql -dir cmd/migrate/migrations $(filter-out $@,$(MAKECMDGOALS))

migrate-up:
	@go run cmd/migrate/main.go up

migrate-down:
	@go run cmd/migrate/main.go down

drop:
	@go run cmd/migrate/main.go drop
