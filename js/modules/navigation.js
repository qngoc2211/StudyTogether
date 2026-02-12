import {
    renderKnowledgeContent,
    renderQuizHistory,
    renderActivities,
    renderForumPosts,
    renderRankings
} from './ui.js';

/* ===============================
   CHUYỂN SECTION
================================= */
export function switchSection(sectionId) {

    // 1️⃣ Ẩn tất cả section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden-section');
    });

    // 2️⃣ Hiển thị section được chọn
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden-section');
    }

    // 3️⃣ Cập nhật menu active
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const navTarget = document.querySelector(
        `.nav-link[data-section="${sectionId.replace('-section', '')}"]`
    );

    if (navTarget) {
        navTarget.classList.add('active');
    }

    // 4️⃣ Scroll lên đầu
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5️⃣ Render nội dung theo section
    switch (sectionId) {
        case 'knowledge-section':
            renderKnowledgeContent();
            break;

        case 'quiz-section':
            renderQuizHistory();
            break;

        case 'activities-section':
            renderActivities();
            break;

        case 'community-section':
            renderForumPosts();
            break;

        case 'ranking-section':
            renderRankings('weekly');
            break;
    }
}