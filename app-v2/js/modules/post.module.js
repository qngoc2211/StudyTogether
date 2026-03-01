import { getAllPosts } from "../services/post.service.js";

export async function loadPost() {

    const main = document.querySelector("main");
    main.innerHTML = `<h2>Quản lý Post</h2><p>Đang tải...</p>`;

    const posts = await getAllPosts();

    main.innerHTML = `
        <h2>Quản lý Post</h2>
        <button id="addPostBtn">+ Thêm Post</button>
        <div class="post-list">
            ${posts.map(p => `
                <div class="admin-item">
                    <h4>${p.title}</h4>
                    <button>Xóa</button>
                </div>
            `).join("")}
        </div>
    `;
}