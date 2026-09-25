import { NextRequest } from "next/server";
import { authRepository } from "@/lib/auth/authService";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return apiError("INVALID_INPUT", "Vui lòng nhập đầy đủ email và mật khẩu mới.", 400);
    }

    if (typeof password !== "string" || password.length < 6) {
      return apiError("WEAK_PASSWORD", "Mật khẩu mới phải có tối thiểu 6 ký tự.", 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await authRepository.resetPassword(cleanEmail, password);

    return apiSuccess({
      user,
      message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay.",
    });
  } catch (error: any) {
    return apiError("RESET_FAILED", error?.message || "Đặt lại mật khẩu thất bại.", 400);
  }
}
