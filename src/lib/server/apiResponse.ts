import { NextResponse } from "next/server";
import { MovieApiError } from "./movieApiClient";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  pagination?: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  person?: {
    name: string;
    avatar?: string;
    role: "actor" | "director" | "all";
    roleTitle: string;
    movieCount: number;
  };
  director?: {
    name: string;
    avatar?: string;
    movieCount: number;
  };
  extra?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export function apiSuccess<T>(
  data: T,
  pagination?: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
    person?: {
      name: string;
      avatar?: string;
      role: "actor" | "director" | "all";
      roleTitle: string;
      movieCount: number;
    };
    director?: {
      name: string;
      avatar?: string;
      movieCount: number;
    };
    [key: string]: any;
  },
  headers?: Record<string, string>
) {
  const { director, person, ...paging }: Record<string, any> = pagination || {};
  const hasPagination = Boolean(paging && typeof paging.totalItems === "number");

  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(hasPagination ? { pagination: paging as any } : {}),
    ...(director ? { director } : {}),
    ...(person ? { person } : {}),
  };

  return NextResponse.json(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function apiError(
  code: string,
  message: string,
  statusCode: number = 500,
  headers?: Record<string, string>
) {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  return NextResponse.json(body, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function handleRouteError(error: unknown) {
  if (error instanceof MovieApiError) {
    let statusCode = error.statusCode;
    if (statusCode === 404) {
      return apiError(error.code || "NOT_FOUND", error.message, 404);
    }
    if (statusCode === 400) {
      return apiError(error.code || "VALIDATION_ERROR", error.message, 400);
    }
    if (statusCode === 429) {
      return apiError("RATE_LIMITED", "Too many requests, please slow down", 429);
    }

    // Obfuscate raw 5xx provider errors for client security
    return apiError(
      "PROVIDER_UNAVAILABLE",
      "Movie service is temporarily unavailable. Please try again shortly.",
      statusCode >= 500 ? 502 : statusCode
    );
  }

  console.error("Unhandled Route Error:", error);
  return apiError(
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred while processing your request.",
    500
  );
}
