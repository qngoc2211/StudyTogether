export async function loadDashboard() {

    // 1️⃣ Ẩn tất cả section hiện tại
    document.querySelectorAll(".content-section")
        .forEach(sec => sec.classList.add("hidden-section"));

    // 2️⃣ Kiểm tra đã có admin-section chưa
    let adminSection = document.getElementById("admin-section");

    if (!adminSection) {
        adminSection = document.createElement("section");
        adminSection.id = "admin-section";
        adminSection.classList.add("content-section");

        document.getElementById("main-content").appendChild(adminSection);
    }

    // 3️⃣ Hiện section admin
    adminSection.classList.remove("hidden-section");

    // 4️⃣ Loading trước
    adminSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Admin Dashboard</h2>
            <p>Đang tải dữ liệu...</p>
        </div>
    `;

    try {

        // ⚡ Sau này thay bằng gọi API thật
        const totalPosts = 0;
        const totalQuiz = 0;
        const totalUsers = 0;

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

        adminSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Admin Dashboard</h2>
                <p style="color:red;">Lỗi tải dữ liệu</p>
            </div>
        `;
    }
}