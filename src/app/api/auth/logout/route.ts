import { NextRequest } from "next/server";
import { authRepository, AUTH_COOKIE_NAME } from "@/lib/auth/authService";
import { apiSuccess } from "@/lib/server/apiResponse";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    await authRepository.deleteSession(token);
  }

  const response = apiSuccess({ loggedOut: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("rubbyfilm_user_hint", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
