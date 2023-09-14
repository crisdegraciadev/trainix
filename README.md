# Trainix - Fitness Tracking App

Trainix is a TypeScript-based fitness tracking application designed to help users maintain consistency in their training routines and experience a sense of progress. This README provides an overview of Trainix, its architecture, coding style, and core technologies used.

## Packages

Trainix consists of two primary packages: the `api` package and the `web` package (with plans for a future mobile app package).

## API

### Description

The `api` package serves as the backend of the application, following the RESTful API architectural pattern. It leverages several core technologies:

- TypeScript
- Express
- Prisma
- Effect

**TypeScript** is the chosen technology for development, with the **Express** framework used to provide external access through HTTP. **Prisma** serves as the ORM for database interactions. Notably, the API employs a functional programming library called [Effect](https://effect.website/) , which focuses on isolating side effects to enhance code reliability and maintainability.

Effect's primary goal is to isolate and manage side effects in a controlled and well-defined manner. This approach promotes code trustworthiness.

### Architecture

The backend root folder is organized into four key sections:

```bash

.
├── containers       # Docker files containing database images
├── prisma           # Schema files, seeds, and Prisma migrations
├── src              # Source code
├── test             # Test files
```

The majority of the code resides in `/src`, adhering to the following structure:

```bash

.
├── src
│   ├── auth            # Authorization endpoints
│   ├── config          # External library configurations
│   ├── consts          # Constants
│   ├── errors          # Error types and handlers
│   ├── lib             # Wrappers for external non-core libraries
│   ├── middleware      # Request/Response middlewares
│   ├── resources       # Resource endpoints
│   └── utils           # Utility functions
└── ...
```

The API currently encompasses five core resources:

- Activities
- Exercises
- Workouts
- Users

Each resource is structured similarly with the following components:

```bash

.
├── exercises
│   ├── services            # Resource services
│   ├── types               # Types representing the resource
│   ├── utils               # Utility functions
│   ├── controller.ts       # HTTP Request handlers
│   └── route.ts            # Request-Controller mapper
└── ...
```

### Coding Style

The core coding principles driving this package include:

1. **Pure Functions:** The package follows a functional approach, emphasizing pure functions.
2. **Immutability:** Code is designed to be immutable whenever possible.
3. **Referential Transparency:** The codebase aims to achieve referential transparency, enhancing predictability and testability.

To support these principles, the **Effect** library is employed extensively. It introduces the `Effect<Requirements, Error, Value>` type to handle potential errors and side effects consistently.

For example, here's how an exercise retrieval function is implemented:

```ts
type RetrieveArgs = { id: number };
type RetrieveErrors = NotFoundError;
type RetrieveReturn = Effect.Effect<never, RetrieveErrors, Exercise>;

export const retrieveExercise = ({ id }: RetrieveArgs): RetrieveReturn => {
  return Effect.tryPromise({
    try: () => prisma.exercise.findUniqueOrThrow({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
```

All services that interact with the database and may produce side effects are wrapped in an `Effect`, indicating the expected return type and defined errors.

Controllers leverage the tools provided by Effect to work at a higher level with the values stored in the returned Effects. Functions are composed into pipelines using utilities like the `pipe` function to enhance readability.

Here's an example of a controller for finding an exercise by ID:

```ts
export const handleFindExerciseById = async (
  req: Request<ExerciseRequestParams>,
  res: Response<ResponseExerciseDto>
): Promise<void> => {
  const { id: exerciseId } = req.params;

  const findByIdResult = await pipe(
    Effect.all([mapIdToNumber(exerciseId)]),
    Effect.flatMap(([id]) => retrieveExercise({ id })),
    Effect.flatMap((exercise) => createResponseExerciseDto(exercise)),
    Effect.runPromiseExit
  );

  Exit.match(findByIdResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};
```

By adhering to these coding principles and utilizing the Effect library, Trainix aims to provide a clean, maintainable, and reliable fitness tracking solution for its users.
