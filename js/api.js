// ===============================
// BASE URL (FIX CỨNG BACKEND)
// ===============================
const API_BASE = "https://studytogether-backend.onrender.com/api";


// ===============================
// LOGIN
// ===============================
export async function login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    // Lưu thông tin user
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);

    return data;
}


// ===============================
// REGISTER
// ===============================
export async function register(username, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Register failed");
    }

    return data;
}


// ===============================
// FETCH CÓ TOKEN
// ===============================
export async function authorizedFetch(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...(token && { Authorization: "Bearer " + token })
        }
    });

    if (response.status === 401) {
        logout();
        throw new Error("Session expired. Please login again.");
    }

    return response;
}


// ===============================
// LOGOUT
// ===============================
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
}


// ===============================
// GET USER HIỆN TẠI
// ===============================
export function getCurrentUser() {
    return {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("username"),
        role: localStorage.getItem("role")
    };
}