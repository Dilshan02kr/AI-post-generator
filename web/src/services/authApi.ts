const API_BASE_URL = "http://127.0.0.1:8000"

export type RegisterPayload = {
    full_name: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type User = {
    id: string;
    full_name: string;
    email: string;
    auth_provider: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user: User;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
  user: User;
};

export async function registerUser(
    payload: RegisterPayload
): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error?.message || "Register failed");
    }

    return data;
}

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Login failed");
  }

  return data;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to fetch current user");
  }

  return data.user;
}