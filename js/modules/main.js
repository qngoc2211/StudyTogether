// main.js
import { 
    renderFeaturedContent, 
    renderActivities, 
    renderForumPosts, 
    renderRankings,
    renderKnowledgeContent,
    renderQuizHistory 
} from './ui.js';

import { 
    renderQuizQuestions, 
    showQuizResult, 
    updateStatsAfterQuiz,
    resetQuizAnswers 
} from './quiz.js';

import { 
    openAuthModal, 
    handleAuth,
    closeAuthModal,
    logout 
} from './auth.js';

import { switchSection, initNavigation } from './navigation.js';
import { appState, sampleData } from './data.js';

// =============================
// KIỂM TRA VÀ XỬ LÝ LOCALSTORAGE
// =============================
(function() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('✅ localStorage hoạt động bình thường');
    } catch (e) {
        console.warn('⚠️ localStorage bị chặn, tạo fallback storage');
        
        // Tạo fallback storage
        const fallbackStorage = {
            _data: {},
            setItem: function(key, value) {
                this._data[key] = String(value);
                console.log(`Fallback: set ${key}=${value}`);
            },
            getItem: function(key) {
                return this._data[key] || null;
            },
            removeItem: function(key) {
                delete this._data[key];
            },
            clear: function() {
                this._data = {};
            }
        };
        
        // Override localStorage
        Object.defineProperty(window, 'localStorage', {
            value: fallbackStorage,
            writable: false,
            configurable: false
        });
    }
})();

// =============================
// CẤU HÌNH TOASTR
// =============================
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: "4000",
    extendedTimeOut: "1000",
    showDuration: "300",
    hideDuration: "1000"
};

// =============================
// ĐỒNG BỘ TRẠNG THÁI USER
// =============================
function syncUserFromStorage() {
    // Thử lấy từ localStorage trước
    let username = null;
    let token = null;
    let email = null;
    let points = null;
    
    try {
        username = localStorage.getItem("username");
        token = localStorage.getItem("token");
        email = localStorage.getItem("email");
        points = localStorage.getItem("points");
    } catch (e) {
        console.warn("Lỗi đọc localStorage:", e);
    }
    
    // Nếu không có trong localStorage, thử sessionStorage
    if (!username || !token) {
        try {
            username = username || sessionStorage.getItem("username");
            token = token || sessionStorage.getItem("token");
            email = email || sessionStorage.getItem("email");
            points = points || sessionStorage.getItem("points");
        } catch (e) {
            console.warn("Lỗi đọc sessionStorage:", e);
        }
    }

    console.log("🔄 Syncing user:", { username, token });

    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const displayUsername = document.getElementById("displayUsername");

    if (username && token) {
        // Cập nhật appState
        appState.currentUser = { 
            name: username,
            email: email,
            points: points 
        };

        // Hiển thị user menu, ẩn auth buttons
        if (authButtons) authButtons.style.display = "none";
        if (userMenu) {
            userMenu.style.display = "flex";
            console.log("✅ User menu displayed");
        }

        // Cập nhật tên hiển thị
        if (displayUsername) displayUsername.textContent = username;

        // Cập nhật profile section
        updateProfileUI(username, email, points);

    } else {
        // Chưa đăng nhập
        appState.currentUser = null;

        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
        
        console.log("ℹ️ User not logged in");
    }
}

// =============================
// CẬP NHẬT PROFILE UI
// =============================
function updateProfileUI(username, email, points) {
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const profilePoints = document.getElementById("profilePoints");
    
    if (profileUsername) profileUsername.textContent = username || "---";
    if (profileEmail) profileEmail.textContent = email || "Chưa cập nhật";
    if (profilePoints) profilePoints.textContent = points || "0";
}

// =============================
// XỬ LÝ ĐĂNG XUẤT
// =============================
function handleLogout(e) {
    e?.preventDefault();

    try {
        // Xóa localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("points");
    } catch (e) {
        console.warn("Lỗi xóa localStorage:", e);
    }
    
    try {
        // Xóa sessionStorage
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("points");
    } catch (e) {
        console.warn("Lỗi xóa sessionStorage:", e);
    }

    appState.currentUser = null;

    toastr.success("👋 Đăng xuất thành công!");

    // Đồng bộ UI
    syncUserFromStorage();
    
    // Chuyển về trang chủ
    switchSection("home-section");
    
    // Đóng dropdown nếu đang mở
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) dropdownMenu.classList.remove("show-dropdown");
}

// =============================
// MỞ MODAL QUIZ
// =============================
function openQuizModal() {
    if (!appState.currentUser) {
        toastr.warning("Vui lòng đăng nhập để làm quiz!");
        openAuthModal(true);
        return;
    }
    
    resetQuizAnswers();
    renderQuizQuestions();
    const modal = document.getElementById('quizModal');
    if (modal) modal.style.display = "flex";
}

// =============================
// XỬ LÝ TẠO BÀI VIẾT
// =============================
function handleCreatePost(event) {
    event.preventDefault();

    if (!appState.currentUser) {
        toastr.warning("Bạn cần đăng nhập để tạo bài viết!");
        openAuthModal(true);
        return;
    }

    const title = document.getElementById('postTitle')?.value.trim();
    const category = document.getElementById('postCategory')?.value;
    const content = document.getElementById('postContent')?.value.trim();

    if (!title || !content) {
        toastr.error("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (title.length < 5) {
        toastr.error("Tiêu đề phải có ít nhất 5 ký tự!");
        return;
    }

    if (content.length < 10) {
        toastr.error("Nội dung phải có ít nhất 10 ký tự!");
        return;
    }

    // Tạo bài viết mới
    const newPost = {
        id: sampleData.forumPosts.length + 1,
        author: appState.currentUser.name,
        time: "Vừa xong",
        title: title,
        content: content,
        likes: 0,
        comments: 0,
        category: category
    };

    // Thêm vào đầu danh sách
    sampleData.forumPosts.unshift(newPost);
    
    // Render lại forum posts
    renderForumPosts();

    // Đóng modal và reset form
    document.getElementById('createPostModal').style.display = "none";
    document.getElementById('postForm').reset();

    toastr.success("✅ Đăng bài thành công!");
    
    // Chuyển đến section cộng đồng
    switchSection("community-section");
}

// =============================
// KHỞI TẠO USER DROPDOWN
// =============================
function initUserDropdown() {
    const userInfo = document.getElementById("userInfo");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!userInfo || !dropdownMenu) {
        console.warn("User dropdown elements not found");
        return;
    }

    // Toggle dropdown khi click vào user info
    userInfo.addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropdownMenu.classList.toggle("show-dropdown");
    });

    // Click outside để đóng dropdown
    document.addEventListener("click", function(e) {
        if (!userInfo.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show-dropdown");
        }
    });

    // Xử lý các menu item
    const profileBtn = document.getElementById("profileBtn");
    const quizHistoryBtn = document.getElementById("quizHistoryBtn");

    if (profileBtn) {
        profileBtn.addEventListener("click", function(e) {
            e.preventDefault();
            switchSection("profile-section");
            dropdownMenu.classList.remove("show-dropdown");
        });
    }

    if (quizHistoryBtn) {
        quizHistoryBtn.addEventListener("click", function(e) {
            e.preventDefault();
            switchSection("quiz-section");
            dropdownMenu.classList.remove("show-dropdown");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
}

// =============================
// KHỞI TẠO EVENT LISTENERS
// =============================
function initEventListeners() {
    console.log("Initializing event listeners...");

    // Nút đăng nhập
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("🔑 Login button clicked");
            openAuthModal(true); // true = đăng nhập
        });
    }

    // Nút đăng ký
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("📝 Register button clicked");
            openAuthModal(false); // false = đăng ký
        });
    }

    // Switch mode trong modal
    const switchAuthMode = document.getElementById('switchAuthMode');
    if (switchAuthMode) {
        switchAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("🔄 Switch auth mode clicked");
            appState.isLoginMode = !appState.isLoginMode;
            openAuthModal(appState.isLoginMode);
        });
    }

    // Đóng modal
    const closeAuthModal = document.getElementById('closeAuthModal');
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            document.getElementById('authModal').style.display = 'none';
        });
    }

    // Click outside để đóng modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('authModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form xác thực
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }

    // Nút làm quiz
    const takeQuizBtn = document.getElementById('takeQuizBtn');
    const takeQuizBtn2 = document.getElementById('takeQuizBtn2');
    
    if (takeQuizBtn) {
        takeQuizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuizModal();
        });
    }
    
    if (takeQuizBtn2) {
        takeQuizBtn2.addEventListener('click', (e) => {
            e.preventDefault();
            openQuizModal();
        });
    }

    // Nút nộp bài quiz
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', () => {
            const result = showQuizResult();
            updateStatsAfterQuiz(result);
        });
    }

    // Nút tạo bài viết
    const createPostBtn = document.getElementById('createPostBtn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            if (!appState.currentUser) {
                toastr.warning("Vui lòng đăng nhập!");
                openAuthModal(true);
                return;
            }
            document.getElementById('createPostModal').style.display = "flex";
        });
    }

    // Form tạo bài viết
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handleCreatePost);
    }

    // Đóng modal tạo bài viết
    const closePostModal = document.getElementById('closePostModal');
    if (closePostModal) {
        closePostModal.addEventListener('click', () => {
            document.getElementById('createPostModal').style.display = 'none';
            document.getElementById('postForm').reset();
        });
    }

    // Nút xem thêm hoạt động
    const loadMoreActivities = document.getElementById('loadMoreActivities');
    if (loadMoreActivities) {
        loadMoreActivities.addEventListener('click', () => {
            toastr.info("Tính năng đang phát triển!");
        });
    }

    // Nút xếp hạng tuần/tháng
    const weeklyRankingBtn = document.getElementById('weeklyRankingBtn');
    const monthlyRankingBtn = document.getElementById('monthlyRankingBtn');
    
    if (weeklyRankingBtn) {
        weeklyRankingBtn.addEventListener('click', () => {
            renderRankings('weekly');
            weeklyRankingBtn.classList.add('btn-primary');
            weeklyRankingBtn.classList.remove('btn-outline');
            if (monthlyRankingBtn) {
                monthlyRankingBtn.classList.add('btn-outline');
                monthlyRankingBtn.classList.remove('btn-primary');
            }
        });
    }
    
    if (monthlyRankingBtn) {
        monthlyRankingBtn.addEventListener('click', () => {
            renderRankings('monthly');
            monthlyRankingBtn.classList.add('btn-primary');
            monthlyRankingBtn.classList.remove('btn-outline');
            if (weeklyRankingBtn) {
                weeklyRankingBtn.classList.add('btn-outline');
                weeklyRankingBtn.classList.remove('btn-primary');
            }
        });
    }
}

// =============================
// KHỞI TẠO ỨNG DỤNG
// =============================
function initApp() {
    console.log("🚀 Initializing StudyTogether app...");

    // Render các thành phần
    try {
        renderFeaturedContent();
        renderRankings('weekly');
        renderActivities();
        renderForumPosts();
        renderKnowledgeContent();
        renderQuizHistory();
        console.log("✅ Content rendered successfully");
    } catch (error) {
        console.error("❌ Error rendering content:", error);
    }

    // Đồng bộ trạng thái user
    syncUserFromStorage();

    // Khởi tạo các event listeners
    initEventListeners();
    
    // Khởi tạo user dropdown
    initUserDropdown();
    
    // Khởi tạo navigation
    initNavigation();

    // Hiển thị thông báo chào mừng
    setTimeout(() => {
        if (!appState.currentUser) {
            toastr.info("👋 Chào mừng bạn đến với StudyTogether! Hãy đăng nhập để trải nghiệm đầy đủ tính năng.");
        } else {
            toastr.success(`🎉 Chào mừng ${appState.currentUser.name} quay trở lại!`);
        }
    }, 1500);
}

// =============================
// KHỞI ĐỘNG ỨNG DỤNG
// =============================
document.addEventListener('DOMContentLoaded', initApp);

// Export functions ra window để debug
window.syncUserFromStorage = syncUserFromStorage;
window.appState = appState;