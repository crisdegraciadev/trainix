import {
  CreateExerciseDto,
  Exercise,
  UpdateExerciseDto,
} from "../types/entities";
import { ApiPaths } from "../consts/api-paths";
import {
  sendDeleteRequest,
  sendGetRequest,
  sendPostRequest,
  sendPutRequest,
} from "../lib/axios";

type CreateExerciseArgs = {
  createExerciseDto: CreateExerciseDto;
};

export async function createExercise({
  createExerciseDto,
}: CreateExerciseArgs): Promise<Exercise> {
  const res = await sendPostRequest<Exercise>({
    path: ApiPaths.EXERCISES,
    data: createExerciseDto,
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
  updateExerciseDto: UpdateExerciseDto;
};

export async function editExercise({
  id,
  updateExerciseDto,
}: EditExerciseArgs) {
  const res = await sendPutRequest<Exercise>({
    id,
    path: ApiPaths.EXERCISES,
    data: updateExerciseDto,
  });

  const { data } = res;
  return data;
}

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await sendGetRequest<Exercise[]>({ path: ApiPaths.EXERCISES });
  const { data } = res;
  return data;
}
