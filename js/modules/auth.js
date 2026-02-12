import { appState } from './data.js';

/* ===============================
   MỞ MODAL ĐĂNG KÝ / ĐĂNG NHẬP
================================= */
export function openAuthModal(isLogin = false) {
    appState.isLoginMode = isLogin;

    const modal = document.getElementById('authModal');
    const title = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchLink = document.getElementById('switchAuthMode');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');

    if (isLogin) {
        title.textContent = "Đăng nhập";
        submitBtn.textContent = "Đăng nhập";
        switchLink.textContent = "Chưa có tài khoản? Đăng ký ngay";
        confirmPasswordGroup.style.display = "none";
    } else {
        title.textContent = "Đăng ký tài khoản";
        submitBtn.textContent = "Đăng ký";
        switchLink.textContent = "Đã có tài khoản? Đăng nhập ngay";
        confirmPasswordGroup.style.display = "block";
    }

    modal.style.display = "flex";
}

/* ===============================
   ĐÓNG MODAL
================================= */
export function closeAuthModal() {
    document.getElementById('authModal').style.display = "none";
    document.getElementById('authForm').reset();
}

/* ===============================
   XỬ LÝ ĐĂNG KÝ / ĐĂNG NHẬP
================================= */
export function handleAuth(event) {
    event.preventDefault();

    const userType = document.getElementById('userType').value;
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!appState.isLoginMode) {
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            toastr.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (password.length < 6) {
            toastr.error("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (!email.includes('@fpt.edu.vn') && !email.includes('@fe.edu.vn')) {
            toastr.warning("Vui lòng sử dụng email FPT (@fpt.edu.vn hoặc @fe.edu.vn)!");
            return;
        }
    }

    // Giả lập đăng ký / đăng nhập
    appState.currentUser = {
        name: fullName,
        email: email,
        type: userType
    };

    if (appState.isLoginMode) {
        toastr.success(`Chào mừng ${fullName} trở lại StudyTogether!`);
    } else {
        toastr.success(`Đăng ký thành công! Chào mừng ${fullName} đến với StudyTogether - FPT Đà Nẵng!`);

        const studentCountEl = document.getElementById('studentCount');
        const currentStudents = parseInt(studentCountEl.textContent);
        studentCountEl.textContent = currentStudents + 1;
    }

    closeAuthModal();
    updateUIAfterLogin(fullName);
}

/* ===============================
   CẬP NHẬT GIAO DIỆN SAU LOGIN
================================= */
function updateUIAfterLogin(fullName) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    loginBtn.style.display = 'none';

    registerBtn.textContent = `Xin chào, ${fullName.split(' ')[0]}`;
    registerBtn.classList.remove('btn-primary');
    registerBtn.classList.add('btn-outline');
}
