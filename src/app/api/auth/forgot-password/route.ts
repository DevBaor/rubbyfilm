import { NextRequest } from "next/server";
import { authRepository } from "@/lib/auth/authService";
import { apiSuccess, apiError } from "@/lib/server/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email || typeof email !== "string") {
      return apiError("INVALID_INPUT", "Vui lòng cung cấp địa chỉ email hợp lệ.", 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await authRepository.findByEmail(cleanEmail);

    if (!user) {
      return apiError(
        "USER_NOT_FOUND",
        "Không tìm thấy tài khoản nào khớp với email này trong hệ thống.",
        404
      );
    }

    return apiSuccess({
      email: cleanEmail,
      name: user.name,
      message: "Tài khoản hợp lệ. Bạn có thể thiết lập mật khẩu mới.",
    });
  } catch (error: any) {
    return apiError("SERVER_ERROR", error?.message || "Lỗi kiểm tra tài khoản.", 500);
  }
}
