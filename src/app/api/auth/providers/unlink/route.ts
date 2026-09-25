import { NextRequest } from "next/server";
import { authRepository, AUTH_COOKIE_NAME } from "@/lib/auth/authService";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";
import { AuthProvider } from "@/lib/auth/authTypes";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return apiError("UNAUTHORIZED", "Bạn cần đăng nhập để thực hiện thao tác này.", 401);
    }

    const session = await authRepository.getSession(token);
    if (!session) {
      return apiError("UNAUTHORIZED", "Phiên đăng nhập đã hết hạn.", 401);
    }

    const body = await request.json();
    const { provider } = body || {};

    if (!provider || (provider !== "google" && provider !== "facebook" && provider !== "credentials")) {
      return apiError("INVALID_PROVIDER", "Phương thức đăng nhập không hợp lệ.", 400);
    }

    const updatedUser = await authRepository.unlinkProvider(session.user.id, provider as AuthProvider);
    session.user = updatedUser;

    return apiSuccess({
      user: updatedUser,
      message: `Đã hủy liên kết phương thức đăng nhập ${provider} thành công.`,
    });
  } catch (error: any) {
    return apiError("UNLINK_FAILED", error?.message || "Không thể hủy liên kết tài khoản.", 400);
  }
}
