import { HttpErrorResponse } from '@angular/common/http';

import { AppHttpError } from '../models/api.model';

export function normalizeApiError(error: unknown): AppHttpError {
  if (error instanceof AppHttpError) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    return new AppHttpError(
      extractApiErrorMessage(error),
      error.status,
      error.error
    );
  }

  if (error instanceof Error) {
    return new AppHttpError(error.message, 500, error);
  }

  return new AppHttpError('Something went wrong while talking to the backend.', 500, error);
}

export function extractApiErrorMessage(error: HttpErrorResponse | AppHttpError | unknown): string {
  if (error instanceof AppHttpError) {
    return error.message;
  }

  if (!(error instanceof HttpErrorResponse)) {
    return error instanceof Error ? error.message : 'Something went wrong while talking to the backend.';
  }

  const errorBody = error.error;

  if (typeof errorBody === 'string' && errorBody.trim()) {
    return errorBody;
  }

  if (errorBody?.message) {
    return errorBody.message;
  }

  if (error.status === 0) {
    return 'Could not connect to the backend server.';
  }

  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.status === 404) {
    return 'The requested resource was not found.';
  }

  return 'Something went wrong while talking to the backend.';
}

export function createMockApiError(message: string, status = 500, details?: unknown): AppHttpError {
  return new AppHttpError(message, status, details);
}
