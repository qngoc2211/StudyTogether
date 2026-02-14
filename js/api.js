const API_BASE = "http://localhost:8080/api";

// =========================
// AUTH
// =========================

async function login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const token = await response.text();
    localStorage.setItem("token", token);
    return token;
}

async function register(username, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.text();
}

// =========================
// PROTECTED REQUEST
// =========================

async function authorizedFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": "Bearer " + token
        }
    });
}

// =========================
// EXAMPLE CALL
// =========================

async function getUserData() {
    const response = await authorizedFetch(`${API_BASE}/user/test`);

    if (!response.ok) {
        throw new Error("Unauthorized");
    }

    return await response.text();
}
