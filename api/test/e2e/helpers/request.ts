import request from 'supertest';

import app from '../../../src/app';

export const INEXISTENT_ID = 99999;

type RequestArgs = {
  url: string;
  headers?: Record<string, string> | {};
};

type GetRequestArgs = RequestArgs;

export const getRequest = async ({ url, headers = {} }: GetRequestArgs): Promise<request.Test> => {
  return request(app).get(url).set(headers).send();
};

type PostRequestArgs = RequestArgs & {
  dto: Record<string, unknown>;
};

export const postRequest = async ({ url, headers = {}, dto }: PostRequestArgs): Promise<request.Test> => {
  return request(app).post(url).set(headers).send(dto);
};

type PutRequestArgs = RequestArgs & {
  dto: Record<string, unknown>;
};

export const putRequest = async ({ url, headers = {}, dto }: PutRequestArgs): Promise<request.Test> => {
  return request(app).put(url).set(headers).send(dto);
};

type DeleteRequestArgs = RequestArgs;

export const deleteRequest = async ({ url, headers = {} }: DeleteRequestArgs): Promise<request.Test> => {
  return request(app).delete(url).set(headers).send();
};
