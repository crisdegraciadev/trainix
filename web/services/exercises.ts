import axios from "axios";
import { Exercise } from "../types/entities";
import { Difficulty, Muscle } from "../types/enums";
import { ApiPaths } from "../consts/api-paths";
import {
  sendDeleteRequest,
  sendGetRequest,
  sendPostRequest,
} from "../lib/axios";

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await sendGetRequest<Exercise[]>({ path: ApiPaths.EXERCISES });
  const { data } = res;
  return data;
}

export async function createExercise(
  exercise: Omit<Exercise, "id">
): Promise<Exercise> {
  const res = await sendPostRequest<Exercise>({
    path: ApiPaths.EXERCISES,
    data: exercise,
  });

  const { data } = res;
  return data;
}

export async function deleteExercise(id: string): Promise<Exercise> {
  const res = await sendDeleteRequest<Exercise>({
    path: ApiPaths.EXERCISES,
    id,
  });

  const { data } = res;
  return data;
}
