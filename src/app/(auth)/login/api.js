import axios from "axios"

export const api = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3000/api/v1"

export async function LoginRequest(obj) {
  try {
    const { data } = await axios.post(`${api}/auth/login`, obj)

    const token =
      data?.access_token ??
      data?.token ??
      data?.accessToken ??
      data?.data?.token ??
      data?.data?.accessToken

    if (token) {
      localStorage.setItem("token", token)
    }

    if (data?.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token)
    }

    return token || null
  } catch (error) {
    console.error("Login error:", error)
    const message = error?.response?.data?.error?.message
    return { error: message || "Login failed" }
  }
}

export async function RegisterRequest(obj) {
  try {
    const { data } = await axios.post(`${api}/auth/register`, obj)

    const token =
      data?.access_token ??
      data?.token ??
      data?.accessToken ??
      data?.data?.token ??
      data?.data?.accessToken

    if (token) {
      localStorage.setItem("token", token)
    }

    if (data?.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token)
    }

    return token || null
  } catch (error) {
    console.error("Register error:", error)
    const message = error?.response?.data?.error?.message
    return { error: message || "Registration failed" }
  }
}

export async function GetProfileRequest() {
  try {
    const { data } = await axios.get(`${api}/auth/me`, {
      headers: getAuthHeaders(),
    })
    return data
  } catch (error) {
    console.error("Get profile error:", error)
    return null
  }
}

export async function UpdateProfileRequest(obj) {
  try {
    const { data } = await axios.patch(`${api}/auth/me`, obj, {
      headers: getAuthHeaders(),
    })
    return data
  } catch (error) {
    console.error("Update profile error:", error)
    const message = error?.response?.data?.error?.message
    return { error: message || "Update failed" }
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem("token")

  return {
    Authorization: `Bearer ${token}`,
  }
}