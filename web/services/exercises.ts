import { Exercise } from "../types/entities";
import { ApiPaths } from "../consts/api-paths";
import {
  sendDeleteRequest,
  sendGetRequest,
  sendPostRequest,
  sendPutRequest,
} from "../lib/axios";

type CreateExerciseArgs = {
  exercise: Omit<Exercise, "id">;
};

export async function createExercise({
  exercise,
}: CreateExerciseArgs): Promise<Exercise> {
  const res = await sendPostRequest<Exercise>({
    path: ApiPaths.EXERCISES,
    data: exercise,
  });

  const { data } = res;
  return data;
}

type DeleteExerciseArgs = {
  id: string;
};

export async function deleteExercise({
  id,
}: DeleteExerciseArgs): Promise<Exercise> {
  const res = await sendDeleteRequest<Exercise>({
    path: ApiPaths.EXERCISES,
    id,
  });

  const { data } = res;
  return data;
}

type EditExerciseArgs = {
  id: string;
  exercise: Partial<Omit<Exercise, "id">>;
};

export async function editExercise({ id, exercise }: EditExerciseArgs) {
  const res = await sendPutRequest<Exercise>({
    id,
    path: ApiPaths.EXERCISES,
    data: exercise,
  });

  const { data } = res;
  return data;
}

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await sendGetRequest<Exercise[]>({ path: ApiPaths.EXERCISES });
  const { data } = res;
  return data;
}
