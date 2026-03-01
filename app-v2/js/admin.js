document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector(".logo");

    // Thêm badge ADMIN trên header
    const badge = document.createElement("span");
    badge.textContent = " ADMIN";
    badge.style.color = "red";
    badge.style.fontWeight = "bold";
    badge.style.marginLeft = "10px";

    header.appendChild(badge);

    // Thêm nút Admin Panel trong user menu
    const dropdown = document.getElementById("dropdownMenu");

    if (dropdown) {
        const adminLink = document.createElement("a");
        adminLink.innerHTML = '<i class="fas fa-tools"></i> Quản trị hệ thống';
        adminLink.href = "#";

        adminLink.addEventListener("click", () => {
            showAdminPanel();
        });

        dropdown.prepend(adminLink);
    }
});


function showAdminPanel() {
    alert("Chức năng quản trị sẽ được phát triển tiếp!");
}