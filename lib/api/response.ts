import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    );
  }

  static error(message: string, status = 400, errors?: any) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        ...(errors && { errors }),
      },
      { status }
    );
  }

  static unauthorized(message = "Unauthorized") {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 401 }
    );
  }

  static notFound(message = "Resource not found") {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 404 }
    );
  }

  static serverError(message = "Internal server error") {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

