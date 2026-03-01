import { API_BASE } from "../config.js";

function getToken() {
    return localStorage.getItem("token");
}

const headers = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getToken()
});

// ================= GET ALL =================
export async function getAllPosts() {
    const res = await fetch(`${API_BASE}/admin/posts`, {
        headers: headers()
    });

    if (!res.ok) throw new Error("Lỗi tải posts");
    return res.json();
}

// ================= CREATE =================
export async function createPost(post) {
    const res = await fetch(`${API_BASE}/admin/posts`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(post)
    });

    if (!res.ok) throw new Error("Lỗi tạo post");
    return res.json();
}

// ================= UPDATE =================
export async function updatePost(id, post) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(post)
    });

    if (!res.ok) throw new Error("Lỗi cập nhật");
    return res.json();
}

// ================= DELETE =================
export async function deletePost(id) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
        method: "DELETE",
        headers: headers()
    });

    if (!res.ok) throw new Error("Lỗi xóa");
}

// ================= TOGGLE LOCK =================
export async function toggleLock(id) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}/lock`, {
        method: "PATCH",
        headers: headers()
    });

    if (!res.ok) throw new Error("Lỗi khóa bài");
    return res.json();
}