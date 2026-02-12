import { sampleData } from './data.js';

/* ===============================
   TẠO CARD NỘI DUNG
=================================*/
export function createContentCard(content) {
    const icon =
        content.type === 'video'
            ? 'fa-play-circle'
            : content.type === 'quiz'
            ? 'fa-question-circle'
            : 'fa-file-alt';

    return `
        <div class="feature-card" data-id="${content.id}">
            <div class="feature-image">
                <img src="${content.image}" alt="${content.title}">
            </div>
            <div class="feature-content">
                <h3>${content.title}</h3>
                <p>${content.description}</p>
                <div class="meta">
                    <span><i class="far ${icon}"></i> ${content.readTime}</span>
                    <span><i class="far fa-calendar"></i> ${content.date}</span>
                    ${content.category 
                        ? `<span><i class="fas fa-tag"></i> ${content.category}</span>` 
                        : ''}
                </div>
            </div>
        </div>
    `;
}

/* ===============================
   TẠO CARD HOẠT ĐỘNG
=================================*/
export function createActivityCard(activity) {
    const isUpcoming = activity.status === 'sắp diễn ra';

    return `
        <div class="activity-card">
            <div class="activity-header">
                <h3>${activity.title}</h3>
                <div class="activity-date">
                    ${activity.date} | ${activity.time}
                </div>
            </div>

            <div class="activity-body">
                <p>${activity.description}</p>

                <div class="activity-details">
                    <div class="activity-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${activity.location}</span>
                    </div>
                    <div class="activity-detail">
                        <i class="fas fa-users"></i>
                        <span>${activity.participants} người tham gia</span>
                    </div>
                </div>
            </div>

            <div style="padding: 0 25px 25px;">
                <button class="btn ${isUpcoming ? 'btn-primary' : 'btn-outline'} register-activity"
                        data-id="${activity.id}">
                    ${isUpcoming ? 'Sắp diễn ra' : 'Đã diễn ra'}
                </button>

                ${
                    isUpcoming
                        ? '<button class="btn btn-outline" style="margin-left:10px;">Chi tiết</button>'
                        : ''
                }
            </div>
        </div>
    `;
}

/* ===============================
   TẠO BÀI VIẾT DIỄN ĐÀN
=================================*/
export function createForumPost(post) {
    const categoryIcons = {
        study: 'fa-book',
        activity: 'fa-calendar-alt',
        question: 'fa-question-circle',
        share: 'fa-share-alt',
        other: 'fa-comment'
    };

    const categoryLabels = {
        study: 'Học tập',
        activity: 'Hoạt động',
        question: 'Hỏi đáp',
        share: 'Chia sẻ',
        other: 'Khác'
    };

    return `
        <div class="forum-post">
            <div class="post-header">
                <div>
                    <span class="post-author">${post.author}</span>
                    <span style="margin: 0 10px;">•</span>
                    <span>
                        <i class="fas ${categoryIcons[post.category]}"></i>
                        ${categoryLabels[post.category]}
                    </span>
                </div>
                <span class="post-time">${post.time}</span>
            </div>

            <div class="post-content">
                <h4 style="margin-bottom:10px;">${post.title}</h4>
                <p>${post.content}</p>
            </div>

            <div class="post-actions">
                <div class="post-action like-post" data-id="${post.id}">
                    <i class="far fa-thumbs-up"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="post-action">
                    <i class="far fa-comment"></i>
                    <span>${post.comments}</span>
                </div>
                <div class="post-action">
                    <i class="far fa-share-square"></i>
                    <span>Chia sẻ</span>
                </div>
            </div>
        </div>
    `;
}

/* ===============================
   RENDER CÁC PHẦN
=================================*/
export function renderFeaturedContent() {
    const container = document.getElementById('featured-content');
    if (!container) return;

    container.innerHTML = sampleData.featuredContent
        .map(createContentCard)
        .join('');
}

export function renderKnowledgeContent() {
    const container = document.getElementById('knowledge-content');
    if (!container) return;

    container.innerHTML = sampleData.knowledgeContent
        .map(createContentCard)
        .join('');
}

export function renderActivities() {
    const container = document.getElementById('activities-content');
    if (!container) return;

    container.innerHTML = sampleData.activitiesContent
        .map(createActivityCard)
        .join('');
}

export function renderForumPosts() {
    const container = document.getElementById('forum-posts-content');
    if (!container) return;

    container.innerHTML = sampleData.forumPosts
        .map(createForumPost)
        .join('');
}

export function renderRankings(type = 'weekly') {
    const container = document.getElementById('ranking-content');
    if (!container) return;

    const rankings =
        type === 'weekly'
            ? sampleData.rankings.weekly
            : sampleData.rankings.monthly;

    container.innerHTML = `
        <table class="ranking-table">
            <thead>
                <tr>
                    <th class="rank">Hạng</th>
                    <th>Tên sinh viên</th>
                    <th>Khoa</th>
                    <th>Điểm</th>
                </tr>
            </thead>
            <tbody>
                ${rankings
                    .map(
                        item => `
                        <tr>
                            <td class="rank rank-${item.rank}">
                                ${item.rank}
                            </td>
                            <td>${item.name}</td>
                            <td>${item.faculty}</td>
                            <td>${item.points.toLocaleString()}</td>
                        </tr>
                    `
                    )
                    .join('')}
            </tbody>
        </table>
    `;
}

export function renderQuizHistory() {
    const container = document.getElementById('quiz-history');
    if (!container) return;

    if (sampleData.quizHistory.length === 0) {
        container.innerHTML =
            '<p style="text-align:center;padding:40px;background:white;border-radius:8px;">Bạn chưa tham gia quiz nào. Hãy bắt đầu ngay!</p>';
        return;
    }

    container.innerHTML = `
        <table class="ranking-table">
            <thead>
                <tr>
                    <th>Ngày</th>
                    <th>Chủ đề</th>
                    <th>Điểm</th>
                    <th>Điểm hoạt động</th>
                </tr>
            </thead>
            <tbody>
                ${sampleData.quizHistory
                    .map(
                        item => `
                        <tr>
                            <td>${item.date}</td>
                            <td>${item.topic}</td>
                            <td>${item.score}</td>
                            <td>${item.points}</td>
                        </tr>
                    `
                    )
                    .join('')}
            </tbody>
        </table>
    `;
}

/* ===============================
   ANIMATE COUNTER
=================================*/
export function animateCounter(elementId, targetValue, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let start = 0;
    const increment = targetValue / (duration / 16);

    const timer = setInterval(() => {
        start += increment;

        if (start >= targetValue) {
            start = targetValue;
            clearInterval(timer);
        }

        element.textContent = Math.floor(start);
    }, 16);
}
