// auth.js
import { appState } from './data.js';
import { login, register } from '../api.js';

/* ===============================
   MỞ MODAL
================================= */
export function openAuthModal(isLogin = true) {
    appState.isLoginMode = isLogin;

    const modal = document.getElementById('authModal');
    const title = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchLink = document.getElementById('switchAuthMode');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const emailGroup = document.getElementById('emailGroup');

    console.log("Opening auth modal, isLogin:", isLogin);

    if (isLogin) {
        title.textContent = "Đăng nhập";
        submitBtn.textContent = "Đăng nhập";
        switchLink.textContent = "Chưa có tài khoản? Đăng ký ngay";
        confirmPasswordGroup.style.display = "none";
        emailGroup.style.display = "none";
    } else {
        title.textContent = "Đăng ký tài khoản";
        submitBtn.textContent = "Đăng ký";
        switchLink.textContent = "Đã có tài khoản? Đăng nhập ngay";
        confirmPasswordGroup.style.display = "block";
        emailGroup.style.display = "block";
    }

    modal.style.display = "flex";
}

/* ===============================
   ĐÓNG MODAL
================================= */
export function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const form = document.getElementById('authForm');
    
    if (modal) modal.style.display = "none";
    if (form) form.reset();
}

/* ===============================
   HANDLE AUTH - CHỈ MỘT LẦN DUY NHẤT
================================= */
export async function handleAuth(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password').value;

    console.log("Handling auth, isLoginMode:", appState.isLoginMode);

    try {
        // ================= ĐĂNG NHẬP =================
        if (appState.isLoginMode) {
            if (!username || !password) {
                toastr.error("Vui lòng nhập tên đăng nhập và mật khẩu!");
                return;
            }

            try {
                // Thử gọi API login
                const token = await login(username, password);

                if (!token) {
                    throw new Error("Sai tài khoản hoặc mật khẩu!");
                }

                // Lưu vào localStorage
                try {
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);
                    
                    // Lấy email từ response nếu có
                    if (email) localStorage.setItem("email", email);
                    localStorage.setItem("points", "100");
                } catch (storageError) {
                    // Fallback to sessionStorage
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("username", username);
                    if (email) sessionStorage.setItem("email", email);
                    sessionStorage.setItem("points", "100");
                }

                // Đồng bộ appState
                appState.currentUser = { name: username };

                toastr.success("Đăng nhập thành công!");
                closeAuthModal();

                // Reload để cập nhật UI
                setTimeout(() => location.reload(), 500);

            } catch (apiError) {
                // Nếu API lỗi, dùng demo mode
                console.warn("API login failed, using demo mode:", apiError);
                
                // Demo login - cho phép đăng nhập với bất kỳ tài khoản nào
                try {
                    localStorage.setItem("token", "demo-token-" + Date.now());
                    localStorage.setItem("username", username);
                    localStorage.setItem("email", email || username + "@fpt.edu.vn");
                    localStorage.setItem("points", "100");
                } catch (e) {
                    sessionStorage.setItem("token", "demo-token-" + Date.now());
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("email", email || username + "@fpt.edu.vn");
                    sessionStorage.setItem("points", "100");
                }

                appState.currentUser = { name: username };
                toastr.success("Đăng nhập thành công (Demo Mode)!");
                closeAuthModal();
                setTimeout(() => location.reload(), 500);
            }
        } 
        
        // ================= ĐĂNG KÝ =================
        else {
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate
            if (!username || !email || !password) {
                toastr.error("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            if (password !== confirmPassword) {
                toastr.error("Mật khẩu xác nhận không khớp!");
                return;
            }

            if (password.length < 6) {
                toastr.error("Mật khẩu phải có ít nhất 6 ký tự!");
                return;
            }

            try {
                // Thử gọi API register
                const success = await register(username, email, password);

                if (!success) {
                    throw new Error("Đăng ký thất bại!");
                }

                toastr.success("Đăng ký thành công! Hãy đăng nhập.");
                closeAuthModal();

                // Chuyển sang login mode
                setTimeout(() => openAuthModal(true), 300);

            } catch (apiError) {
                // Nếu API lỗi, dùng demo mode
                console.warn("API register failed, using demo mode:", apiError);
                
                // Demo register
                try {
                    localStorage.setItem("token", "demo-token-" + Date.now());
                    localStorage.setItem("username", username);
                    localStorage.setItem("email", email);
                    localStorage.setItem("points", "50");
                } catch (e) {
                    sessionStorage.setItem("token", "demo-token-" + Date.now());
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("email", email);
                    sessionStorage.setItem("points", "50");
                }

                toastr.success("Đăng ký thành công! (Demo Mode)");
                closeAuthModal();
                
                // Tự động đăng nhập sau khi đăng ký demo
                appState.currentUser = { name: username };
                setTimeout(() => location.reload(), 500);
            }
        }
    } catch (error) {
        console.error("Auth error:", error);
        
        // Xóa storage nếu có lỗi
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("points");
        } catch (e) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("points");
        }

        toastr.error(error.message || "Có lỗi xảy ra! Vui lòng thử lại.");
    }
}

/* ===============================
   KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
================================= */
export function isAuthenticated() {
    try {
        return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
    } catch (e) {
        return false;
    }
}

/* ===============================
   LẤY THÔNG TIN USER HIỆN TẠI
================================= */
export function getCurrentUser() {
    try {
        const username = localStorage.getItem("username") || sessionStorage.getItem("username");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        if (username && token) {
            return { name: username };
        }
        return null;
    } catch (e) {
        return null;
    }
}

/* ===============================
   ĐĂNG XUẤT
================================= */
export function logout() {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("points");
    } catch (e) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("points");
    }
    
    appState.currentUser = null;
    toastr.success("Đăng xuất thành công!");
    
    // Reload về trang chủ
    setTimeout(() => {
        window.location.href = '/';
    }, 500);
}