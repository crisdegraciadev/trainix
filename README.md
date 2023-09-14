# Trainix - Fitness Tracking App

**Trainix** is a cutting-edge fitness tracking application built with TypeScript that empowers users to maintain their training consistency and experience a profound sense of progress. This comprehensive README offers an in-depth exploration of Trainix, covering its architecture, coding style, and the core technologies that drive its functionality.

## Packages

Trainix is organized into two primary packages: the `api` package and the `web` package. There are plans for a future mobile app package, demonstrating the project's commitment to flexibility and expansion.

## API

### Description

The `api` package is the engine behind Trainix, adhering to the RESTful API architectural pattern. It leverages a suite of essential technologies:

- **TypeScript:** The foundation of Trainix's development, ensuring type safety and robust code.
- **Express:** Powering the API's external access through HTTP, offering reliability and performance.
- **Prisma:** Serving as the Object-Relational Mapping (ORM) tool for seamless database interactions.
- Effect : A functional programming library with a focus on isolating side effects, enhancing code reliability and maintainability.

[Effect](https://effect.website/) plays a pivotal role in the API, providing a structured way to manage side effects and bolster the codebase's trustworthiness.

### Architecture

The backend root directory is thoughtfully organized into four key sections:

```bash

.
├── containers       # Docker files containing database images
├── prisma           # Schema files, seeds, and Prisma migrations
├── src              # Source code
├── test             # Test files
```

The heart of the code resides in `/src`, adhering to a hierarchical structure that promotes clarity and maintainability:

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

The API currently manages four primary resources:

- Activities
- Exercises
- Workouts
- Users

Each resource adheres to a similar structure:

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

The API is governed by a set of core coding principles:

1. **Pure Functions:** Trainix emphasizes a functional approach, prioritizing pure functions.
2. **Immutability:** The codebase is designed with immutability in mind, enhancing predictability.
3. **Referential Transparency:** Achieving referential transparency is a core goal, further improving predictability and testability.

To uphold these principles, Trainix extensively employs the **Effect** library. This library introduces the `Effect<Requirements, Error, Value>` type to handle potential errors and side effects consistently.

For instance, here's an example of an exercise retrieval function:

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

All services interacting with the database and potentially producing side effects are encapsulated within an `Effect`. This clearly defines expected return types and error handling.

Controllers make use of Effect's tools to work at a higher level with the values stored in returned Effects. Functions are combined into pipelines using utilities such as the `pipe` function, enhancing code readability.

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

By adhering to these coding principles and harnessing the power of the Effect library, Trainix aims to provide a clean, maintainable, and dependable fitness tracking solution.

### Testing

Trainix adheres to a Test-Driven Development (TDD) strategy to ensure the creation of robust and dependable software. This approach dictates that the development process is guided by failing tests, which serve as the blueprint for code implementation and feature development.

Trainix currently conducts two types of tests:

1. **Unit Testing:** Focusing on the examination of individual units of code, typically utility functions or complex data management functions, in isolation to validate correctness and functionality.
2. **Integration Testing (E2E API Level):** Evaluating the different endpoints representing resources to ensure that expected responses arrive correctly.

Key technologies utilized for testing include:

- **Jest:** A widely-used JavaScript testing framework offering a comprehensive suite of utilities for writing unit and integration tests.
- **Supertest:** An HTTP assertion library that enables automated testing of API endpoints. It facilitates sending HTTP requests and receiving responses, enabling comprehensive testing of the API's functionality.

The testing environment in Trainix operates autonomously, running tests in a separate instance of the application, complete with its dedicated database. This isolation ensures that tests do not interfere with the application's production data.

In the future, Trainix plans to implement a continuous integration (CI) pipeline. This pipeline will automate the testing process, running tests with each code commit and ensuring that only bug-free and thoroughly-tested code is pushed to the repository. This proactive approach to quality control will enhance the overall reliability and stability of the application.

## WEB

### Description

The `web` package is the frontend of Trainix, designed as a Single Page Application (SPA) with a robust tech stack:

- **TypeScript:** Empowering development with type safety.
- **React:** The primary framework for building the user interface.
- **Next.js:** A meta framework for React, enhancing server-side rendering and routing.
- **Shadcn/ui:** The chosen component library for creating an interactive UI, built on top of **Radix UI** .

This tech stack ensures a responsive, reliable, and feature-rich user experience.

### Architecture

The frontend root folder boasts a well-organized structure comprising twelve key sections:

```bash

.
├── app                 # Application source code
├── components          # Reusable app components
├── config              # External library configurations
├── consts              # Constants
├── hooks               # Global hooks
├── layouts             # Reusable layouts
├── lib                 # Wrappers for external non-core libraries
├── public              # Assets
├── services            # Business logic services
├── stores              # Global state stores
├── types               # Application types
├── utils               # Utility functions
```

The main pages within the WEB package are structured as follows:

```bash

.
├── app
│   ├── authentication
│   ├── dashboard
│   │   ├── exercises
│   │   ├── workouts
│   │   └── history
│   └── ...
└── ...
```

Each page features components, constants, data, hooks, a layout, and page content tailored to its specific use:

```bash

.
├── exercise
│   ├── components      # Components used in this scope
│   ├── consts          # Constants used in this scope
│   ├── data            # Complex constant data
│   ├── hooks           # Custom hooks
│   ├── layout.tsx      # Layout of the page
│   └── page.tsx        # Page content
└── ...
```

### Coding Style

Trainix prioritizes scalability and code reusability. Each component aims to adhere to the Single Responsibility Principle (SRP), serving as a fundamental building block for UI composition.

The same principle applies to hooks. Components requiring extensive hook usage are divided into two files: a `.tsx` file for the component's UI code and a `.ts` file for a custom hook that encapsulates the component's logic.

In general, components adopt the long function declaration syntax to enhance code readability, while hooks utilize the arrow function syntax to align with React conventions. Here's an example of a component defined with the long function syntax:

```tsx
export default function ExercisesPage() {
  const { data } = useFetchExercises();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="mt-1">
      <DataTable
        columns={EXERCISES_COLUMNS}
        createFormDialog={
          <CreateExerciseFormDialog
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
          />
        }
        searchBarPlaceholder="Search by exercise name..."
        data={data}
        facetedFilters={FACETED_FILTERS}
      />
    </section>
  );
}
```

Here's an example of a hook with the arrow function syntax:

```tsx
export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries(ReactQueryKeys.Query.Exercise.FETCH_ALL);
    },
  });

  return { ...mutation };
};
```

### State Management

Trainix relies on the Redux Toolkit as the chosen library for managing global state. To abstract from it, all stores are accessed via custom hooks, ensuring a seamless and efficient state management process.

### Data Fetching

Data fetching in Trainix employs the following core technologies:

- **Axios:** A widely-used HTTP client for making requests to the API.
- **React Query:** A powerful data fetching library that streamlines data retrieval and management.

This combination ensures that data is retrieved efficiently and presented to users seamlessly, providing a top-notch user experience.

## Conclusion

Trainix represents a forward-thinking fitness tracking application that marries cutting-edge technology with a user-centric design. Whether you're tracking your workouts or planning your training routine, Trainix has you covered, offering a seamless and feature-rich experience from end to end.
