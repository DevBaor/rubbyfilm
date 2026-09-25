import { NextRequest } from "next/server";
import { authRepository, AUTH_COOKIE_NAME } from "@/lib/auth/authService";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return apiSuccess({ user: null, authenticated: false });
    }

    const session = await authRepository.getSession(token);
    if (!session) {
      return apiSuccess({ user: null, authenticated: false });
    }

    return apiSuccess({
      user: session.user,
      authenticated: true,
    });
  } catch (error) {
    return apiError("AUTH_CHECK_FAILED", "Không thể xác thực phiên đăng nhập.", 500);
  }
}
