export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const hasToken = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("token="));
    return hasToken;
  } catch (err) {
    return false;
  }
}

export function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000';
    window.location.href = `${authUrl}/signin`;
  }
}
