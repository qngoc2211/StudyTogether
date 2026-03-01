import { API_BASE } from "../config.js";

function getToken() {
    return localStorage.getItem("token");
}

export async function getAllUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
}

export async function deleteUser(id) {
    await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });
}