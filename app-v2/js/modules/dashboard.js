import { API_BASE } from "../config.js";

function getToken() {
    return localStorage.getItem("token");
}

export async function loadDashboard() {

    // 1️⃣ Ẩn tất cả section
    document.querySelectorAll(".content-section")
        .forEach(sec => sec.classList.add("hidden-section"));

    // 2️⃣ Tạo hoặc lấy admin-section
    let adminSection = document.getElementById("admin-section");

    if (!adminSection) {
        adminSection = document.createElement("section");
        adminSection.id = "admin-section";
        adminSection.classList.add("content-section");
        document.getElementById("main-content")
            .appendChild(adminSection);
    }

    adminSection.classList.remove("hidden-section");

    // 3️⃣ Loading UI
    adminSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Admin Dashboard</h2>
            <p>Đang tải dữ liệu...</p>
        </div>
    `;

    try {

        const token = getToken();

        if (!token) {
            throw new Error("NO_TOKEN");
        }

        const response = await fetch(
            `${API_BASE}/admin/dashboard`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }

        if (!response.ok) {
            throw new Error("SERVER_ERROR");
        }

        const data = await response.json();

        const totalPosts = data.posts ?? 0;
        const totalQuiz = data.quizzes ?? 0;
        const totalUsers = data.users ?? 0;

        adminSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Admin Dashboard</h2>

                <div class="admin-cards">

                    <div class="admin-card">
                        <h3>${totalPosts}</h3>
                        <p>Tổng Posts</p>
                    </div>

                    <div class="admin-card">
                        <h3>${totalQuiz}</h3>
                        <p>Tổng Quiz</p>
                    </div>

                    <div class="admin-card">
                        <h3>${totalUsers}</h3>
                        <p>Tổng Users</p>
                    </div>

                </div>
            </div>
        `;

    } catch (error) {

        let message = "Lỗi tải dữ liệu";

        if (error.message === "NO_TOKEN") {
            message = "Bạn chưa đăng nhập!";
        } else if (error.message === "UNAUTHORIZED") {
            message = "Bạn không có quyền ADMIN!";
        } else if (error.message === "SERVER_ERROR") {
            message = "Backend có thể đang sleep (Render free tier).";
        }

        adminSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Admin Dashboard</h2>
                <p style="color:red;">${message}</p>
            </div>
        `;
    }
}