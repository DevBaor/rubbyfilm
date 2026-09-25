import { NextRequest } from "next/server";
import { authRepository, AUTH_COOKIE_NAME } from "@/lib/auth/authService";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return apiError("UNAUTHORIZED", "Bạn cần đăng nhập để thực hiện thao tác này.", 401);
    }

    const session = await authRepository.getSession(token);
    if (!session) {
      return apiError("UNAUTHORIZED", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401);
    }

    const body = await request.json();
    const { name, avatarUrl } = body || {};

    const updatedUser = await authRepository.updateUserProfile(session.user.id, {
      name,
      avatarUrl,
    });

    return apiSuccess({ user: updatedUser });
  } catch (error: any) {
    return apiError("PROFILE_UPDATE_FAILED", error.message || "Cập nhật hồ sơ thất bại.", 500);
  }
}
