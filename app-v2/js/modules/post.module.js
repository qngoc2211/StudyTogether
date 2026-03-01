import {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLock
} from "../services/post.service.js";

export async function loadPosts() {

    // Ẩn section khác
    document.querySelectorAll(".content-section")
        .forEach(sec => sec.classList.add("hidden-section"));

    let section = document.getElementById("admin-section");

    if (!section) {
        section = document.createElement("section");
        section.id = "admin-section";
        section.classList.add("content-section");
        document.getElementById("main-content")
            .appendChild(section);
    }

    section.classList.remove("hidden-section");

    section.innerHTML = `
        <div class="container">
            <h2>Quản lý Posts</h2>
            <button id="createBtn">+ Tạo bài</button>
            <div id="postTable">Đang tải...</div>
        </div>
    `;

    try {
        const posts = await getAllPosts();

        document.getElementById("postTable").innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                ${posts.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.title}</td>
                        <td>${p.category}</td>
                        <td>${p.locked ? "🔒 Locked" : "✅ Active"}</td>
                        <td>
                            <button onclick="editPost(${p.id})">Sửa</button>
                            <button onclick="removePost(${p.id})">Xóa</button>
                            <button onclick="lockPost(${p.id})">
                                ${p.locked ? "Mở khóa" : "Khóa"}
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </table>
        `;

        document.getElementById("createBtn")
            .addEventListener("click", showCreateForm);

    } catch (err) {
        section.innerHTML += `<p style="color:red;">Lỗi tải dữ liệu</p>`;
    }
}

// ================= CREATE FORM =================
function showCreateForm() {

    const title = prompt("Tiêu đề:");
    const content = prompt("Nội dung:");
    const category = prompt("Danh mục:");

    if (!title || !content) return;

    createPost({ title, content, category })
        .then(loadPosts);
}

// ================= DELETE =================
window.removePost = async function(id) {
    if (confirm("Xóa bài này?")) {
        await deletePost(id);
        loadPosts();
    }
};

// ================= LOCK =================
window.lockPost = async function(id) {
    await toggleLock(id);
    loadPosts();
};

// ================= EDIT =================
window.editPost = async function(id) {

    const title = prompt("Tiêu đề mới:");
    const content = prompt("Nội dung mới:");
    const category = prompt("Danh mục mới:");

    if (!title || !content) return;

    await updatePost(id, { title, content, category });
    loadPosts();
};