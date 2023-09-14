# Trainix

Trainix is a fitness tracking app built with Typescript based technologies to help its users to be consistent with their training and help them perceive a sensation of progress.

## Packages

The app is composed by 2 different packages, the `api` package and the `web` package (in the future, the idea is to be composed by 3, being this third package a mobile app).

## API

### Description

This package store the backend of the application. As it's name suggest, the backend is built following the API REST structural pattern.

The core technologies used to develop this package are 4.

- Typescript
- Express
- Prisma
- Effect

Typescript has been the selected technology to develop this application, using Express framework in convination to provide external access through HTTP. Also, Prisma is the ORM used to perform database interactions. The interesting point with this API, is that it uses a functional programming library called [Effect](https://effect.website/).

The idea behind Effect is to bring a way to isolate side effects, so in that way you can work in a safer and cleaner way. The beneficts os using this library, is that side effects are more controllable and well defined, so the code is much more trustable.

### Architecture

The backend root folder is divided in 4 folders.

    .
    ├── containers       # Docker files containing database images
    ├── prisma           # Schema files, seeds and primsa migrations
    ├── src              # Source code
    ├── test             # Tests files

Most part of the code is inside in `/src`, where the following folder structure has been followed

    .
    ├── src
    │   ├── auth            # Authorization endpoints
    │   ├── config          # External libs configurations
    │   ├── consts          # Constants
    │   ├── errors          # Error types and handlers
    │   ├── lib             # External non core libs wrappers
    │   ├── middleware      # Request/Response middlewares
    │   ├── resources       # Resource endpoints
    │   └── utils           # Utility functions
    └── ...

The API currently represents 5 resources

- Activities
- Exercises
- Workouts
- Users

Each resource, is organized with the following folder structure.

    .
    ├── exercises
    │   ├── services            # Resource services
    │   ├── types               # Types to represents the resource
    │   ├── utils               # Utility functions
    │   ├── controller.ts       # HTTP Request handlers
    │   └── route.ts            # Request-Controller mapper
    └── ...

### Coding style

The main idea behind this package, is to follow a functional approach as much as I can. To achieve that, I'll try to follow 3 principles.

- Pure functions
- Inmutability
- Referencial transparency

To achieve this, I'll use a library called Effect, which embraces functional programming and will allow me to write better pure functions and implement transparencial transparency.

The main idea behind this library, is the `Effect<Requirements, Error, Value>` type. The idea is to return and effect in all the functions that can throw an error, to be consistent with the return types (referencial transparency) and to have tools to work with side effects at a higher level.

In example, the code to find an exercise by id, where we can expect and error or an undefined value, will be something like this.

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

All the services will be functions, one exported function per file, trying to also respect the SRP. Also, to improve the extensibility of this code, the input arguments will be types,

```ts
type UpdateArgs = { id: number; data: UpdateExerciseDto };
type UpdateErrors = NotFoundError;
type UpdateReturn = Effect.Effect<never, UpdateErrors, Exercise>;

export const updateExercise = ({ id, data }: UpdateArgs): UpdateReturn => {
  return Effect.tryPromise({
    try: () => prisma.exercise.update({ where: { id }, data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
```

The idea is that all services that access the database, and as consecuence can produce side effects, are wrapped in a `Effect`, to clarify that this service can return the expected type, or the defined errors.

In the other hands, the controllers will work with the tools provided by Effect, to work at a higher level with the values stored in the returned Effects.

Thanks to utilities like the `pipe` function, we can work with our functions creating pipelines, which highly improve readability. We can also use some kind of pattern matching, to return a clean response for every case that we meet.

Here is an example of how the controller to find an exercise by id is implemented.

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
