// =======================================
// ADMIN SIDEBAR MENU - APP V2
// =======================================

import { isAdmin } from "./guard.js";


// =======================================
// INIT MENU
// =======================================
export function initAdminMenu() {
    if (!isAdmin()) return;

    renderSidebar();
    initMenuEvents();
    setActive("dashboard");
}


// =======================================
// RENDER SIDEBAR
// =======================================
function renderSidebar() {
    const container = document.getElementById("adminSidebar");
    if (!container) return;

    container.innerHTML = `
        <div class="admin-logo">
            <h2>Admin Panel</h2>
        </div>

        <ul class="admin-menu">
            <li data-section="dashboard" class="menu-item active">
                📊 Dashboard
            </li>
            <li data-section="posts" class="menu-item">
                📝 Manage Posts
            </li>
            <li data-section="quizzes" class="menu-item">
                ❓ Manage Quizzes
            </li>
            <li data-section="users" class="menu-item">
                👥 Manage Users
            </li>
            <li data-section="settings" class="menu-item">
                ⚙ Settings
            </li>
        </ul>

        <div class="admin-logout">
            <button id="adminLogoutBtn">🚪 Logout</button>
        </div>
    `;
}


// =======================================
// MENU EVENTS
// =======================================
function initMenuEvents() {
    const items = document.querySelectorAll(".menu-item");

    items.forEach(item => {
        item.addEventListener("click", () => {
            const section = item.dataset.section;
            setActive(section);
            switchSection(section);
        });
    });

    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.reload();
        });
    }
}


// =======================================
// SET ACTIVE MENU
// =======================================
function setActive(section) {
    const items = document.querySelectorAll(".menu-item");

    items.forEach(item => {
        item.classList.remove("active");
        if (item.dataset.section === section) {
            item.classList.add("active");
        }
    });
}


// =======================================
// SWITCH SECTION (MINI ROUTER)
// =======================================
function switchSection(section) {
    const sections = document.querySelectorAll(".admin-section");

    sections.forEach(sec => {
        sec.style.display = "none";
    });

    const activeSection = document.getElementById(`admin-${section}`);
    if (activeSection) {
        activeSection.style.display = "block";
    }
}