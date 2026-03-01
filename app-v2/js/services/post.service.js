const BASE_URL = "https://studytogether-backend.onrender.com";

export async function getAllPosts() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.json();
}