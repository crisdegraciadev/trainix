export type ErrorResponse = {
  error: {
    type: string;
    message: string;
  };
};

export const isErrorResponse = (body: unknown): body is ErrorResponse => {
  const {
    error: { type, message },
  } = body as ErrorResponse;

  return !!type && !!message;
};
