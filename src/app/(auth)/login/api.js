import axios from "axios"

export const api = "http://127.0.0.1:3000/api/v1"

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

    return token || null
  } catch (error) {
    console.error("Login error:", error)
    return null
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

    return token || null
  } catch (error) {
    console.error("Register error:", error)
    return null
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem("token")

  return {
    Authorization: `Bearer ${token}`,
  }
}