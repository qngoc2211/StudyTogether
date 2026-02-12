import { 
    renderFeaturedContent, 
    renderKnowledgeContent, 
    renderActivities, 
    renderForumPosts, 
    renderRankings, 
    renderQuizHistory,
    animateCounter 
} from './ui.js';

import { 
    renderQuizQuestions, 
    showQuizResult, 
    updateStatsAfterQuiz,
    resetQuizAnswers 
} from './quiz.js';

import { 
    openAuthModal, 
    closeAuthModal, 
    handleAuth 
} from './auth.js';

import { switchSection } from './navigation.js';

import { appState, sampleData } from './data.js';

// Khởi tạo Toastr
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

// Mở modal quiz
function openQuizModal() {
    resetQuizAnswers();
    renderQuizQuestions();
    document.getElementById('quizModal').style.display = "flex";
}

// Đóng modal quiz
function closeQuizModal() {
    document.getElementById('quizModal').style.display = "none";
}

// Mở modal tạo bài viết
function openCreatePostModal() {
    if (!appState.currentUser) {
        toastr.warning("Vui lòng đăng nhập để tạo bài viết mới!");
        openAuthModal(false);
        return;
    }
    
    document.getElementById('createPostModal').style.display = "flex";
}

// Đóng modal tạo bài viết
function closeCreatePostModal() {
    document.getElementById('createPostModal').style.display = "none";
    document.getElementById('postForm').reset();
}

// Xử lý tạo bài viết mới
function handleCreatePost(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value;
    
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
    
    // Hiển thị lại danh sách bài viết
    renderForumPosts();
    
    // Đóng modal
    closeCreatePostModal();
    
    toastr.success("Bài viết của bạn đã được đăng thành công!");
}

// Khởi tạo hiệu ứng khi cuộn trang
function initScrollEffects() {
    // Hiệu ứng cho header khi cuộn
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        }
    });
    
    // Hiệu ứng xuất hiện khi cuộn
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Áp dụng hiệu ứng cho các phần tử
    const elementsToObserve = [
        ...document.querySelectorAll('.feature-card'),
        ...document.querySelectorAll('.quiz-today'),
        ...document.querySelectorAll('.stat-item'),
        ...document.querySelectorAll('.activity-card'),
        ...document.querySelectorAll('.community-card')
    ];
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

// Khởi tạo các sự kiện
function initEventListeners() {
    // Sự kiện cho nút đăng nhập/đăng ký
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        openAuthModal(true);
    });
    
    document.getElementById('registerBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (appState.currentUser) {
            // Nếu đã đăng nhập, hiển thị menu người dùng
            toastr.info("Menu người dùng đang được phát triển!");
        } else {
            openAuthModal(false);
        }
    });
    
    // Sự kiện cho modal auth
    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('switchAuthMode').addEventListener('click', function(e) {
        e.preventDefault();
        openAuthModal(!appState.isLoginMode);
    });
    
    // Sự kiện cho modal quiz
    document.getElementById('closeQuizModal').addEventListener('click', closeQuizModal);
    document.getElementById('submitQuizBtn').addEventListener('click', function() {
        const result = showQuizResult();
        updateStatsAfterQuiz(result);
    });
    document.getElementById('closeQuizResultBtn').addEventListener('click', closeQuizModal);
    
    // Sự kiện cho modal tạo bài viết
    document.getElementById('closePostModal').addEventListener('click', closeCreatePostModal);
    document.getElementById('postForm').addEventListener('submit', handleCreatePost);
    
    // Sự kiện cho các nút quiz
    const quizButtons = ['dailyQuizBtn', 'takeQuizBtn', 'takeQuizBtn2'];
    quizButtons.forEach(btnId => {
        document.getElementById(btnId).addEventListener('click', function(e) {
            e.preventDefault();
            openQuizModal();
        });
    });
    
    document.getElementById('startNowBtn').addEventListener('click', function(e) {
        e.preventDefault();
        toastr.info("Bắt đầu hành trình của bạn với StudyTogether - FPT Đà Nẵng! Hãy khám phá các nội dung trên website.");
    });
    
    // Sự kiện cho phần cộng đồng
    document.getElementById('joinForumBtn').addEventListener('click', function() {
        switchSection('community-section');
    });
    
    document.getElementById('findGroupBtn').addEventListener('click', function() {
        toastr.info("Tính năng tìm nhóm học tập đang được phát triển!");
    });
    
    document.getElementById('askQuestionBtn').addEventListener('click', function() {
        if (appState.currentUser) {
            openCreatePostModal();
        } else {
            toastr.warning("Vui lòng đăng nhập để đặt câu hỏi!");
            openAuthModal(false);
        }
    });
    
    document.getElementById('createPostBtn').addEventListener('click', function() {
        openCreatePostModal();
    });
    
    // Sự kiện cho phần hoạt động
    document.getElementById('loadMoreActivities').addEventListener('click', function() {
        toastr.info("Đang tải thêm hoạt động...");
    });
    
    // Sự kiện cho menu điều hướng
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section + '-section');
        });
    });
    
    // Sự kiện cho footer navigation
    document.querySelectorAll('.footer-nav').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section + '-section');
        });
    });
    
    // Sự kiện cho bảng xếp hạng
    document.getElementById('weeklyRankingBtn').addEventListener('click', function() {
        renderRankings('weekly');
    });
    
    document.getElementById('monthlyRankingBtn').addEventListener('click', function() {
        renderRankings('monthly');
    });
    
    // Thêm sự kiện cho các thẻ bài viết
    document.addEventListener('click', function(e) {
        const featureCard = e.target.closest('.feature-card');
        if (featureCard) {
            const id = featureCard.getAttribute('data-id');
            const content = sampleData.featuredContent.find(item => item.id == id) || 
                           sampleData.knowledgeContent.find(item => item.id == id);
            
            if (content) {
                if (content.type === 'quiz') {
                    openQuizModal();
                } else {
                    toastr.info(`Đang mở ${content.type === 'video' ? 'video' : 'bài viết'}: "${content.title}"`);
                }
            }
        }
        
        // Sự kiện đăng ký hoạt động
        const registerBtn = e.target.closest('.register-activity');
        if (registerBtn) {
            const id = registerBtn.getAttribute('data-id');
            const activity = sampleData.activitiesContent.find(item => item.id == id);
            
            if (activity) {
                if (appState.currentUser) {
                    toastr.success(`Bạn đã đăng ký tham gia "${activity.title}" thành công!`);
                    registerBtn.textContent = "Đã đăng ký";
                    registerBtn.classList.remove('btn-primary');
                    registerBtn.classList.add('btn-outline');
                    registerBtn.disabled = true;
                } else {
                    toastr.warning("Vui lòng đăng nhập để đăng ký tham gia hoạt động!");
                    openAuthModal(false);
                }
            }
        }
        
        // Sự kiện like bài viết
        const likeBtn = e.target.closest('.like-post');
        if (likeBtn) {
            const id = likeBtn.getAttribute('data-id');
            const post = sampleData.forumPosts.find(item => item.id == id);
            
            if (post) {
                if (appState.currentUser) {
                    const likeCount = likeBtn.querySelector('span');
                    const currentLikes = parseInt(likeCount.textContent);
                    likeCount.textContent = currentLikes + 1;
                    
                    const icon = likeBtn.querySelector('i');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = 'var(--primary-color)';
                    
                    toastr.success("Bạn đã thích bài viết này!");
                } else {
                    toastr.warning("Vui lòng đăng nhập để tương tác với bài viết!");
                    openAuthModal(false);
                }
            }
        }
    });
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(e) {
        const authModal = document.getElementById('authModal');
        const quizModal = document.getElementById('quizModal');
        const postModal = document.getElementById('createPostModal');
        
        if (e.target === authModal) {
            closeAuthModal();
        }
        
        if (e.target === quizModal) {
            closeQuizModal();
        }
        
        if (e.target === postModal) {
            closeCreatePostModal();
        }
    });
}

// Khởi tạo ứng dụng
function initApp() {
    // Hiển thị nội dung ban đầu
    renderFeaturedContent();
    renderRankings('weekly');
    renderActivities();
    renderForumPosts();
    
    // Khởi động thống kê đếm số
    setTimeout(() => {
        animateCounter('studentCount', 1847);
        animateCounter('quizCompleted', 256);
        animateCounter('upcomingEvents', 4);
        
        // Cập nhật thanh tiến trình quiz
        const quizPercentage = Math.floor(256 / 1847 * 100);
        document.getElementById('quizProgressBar').style.width = `${quizPercentage}%`;
        document.getElementById('quizProgressBar2').style.width = `${quizPercentage}%`;
        document.getElementById('quizPercentage').textContent = `${quizPercentage}% sinh viên`;
        document.getElementById('quizPercentage2').textContent = `${quizPercentage}% sinh viên`;
    }, 500);
    
    // Khởi tạo hiệu ứng cuộn
    initScrollEffects();
    
    // Khởi tạo các sự kiện
    initEventListeners();
    
    // Hiển thị thông báo chào mừng
    setTimeout(() => {
        toastr.info("Chào mừng bạn đến với StudyTogether - Đồng hành cùng tân sinh viên FPT Đà Nẵng!");
    }, 1000);
}

// Chạy ứng dụng khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', initApp);