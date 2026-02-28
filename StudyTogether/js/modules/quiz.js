import { sampleData, appState } from './data.js';

/* ===============================
   HIỂN THỊ CÂU HỎI QUIZ
================================= */
export function renderQuizQuestions() {

    const container = document.getElementById('quizQuestions');
    if (!container) return;

    // Reset câu trả lời trước khi render
    appState.currentQuizAnswers = {};

    let html = `<h2>${sampleData.dailyQuiz.title}</h2>`;

    sampleData.dailyQuiz.questions.forEach((q, index) => {

        html += `
            <div class="quiz-question" data-id="${q.id}">
                <h3>Câu ${index + 1}: ${q.question}</h3>
                <div class="quiz-options">
        `;

        q.options.forEach((option, optIndex) => {
            html += `
                <div class="quiz-option"
                     data-question="${q.id}"
                     data-answer="${optIndex}">
                    ${option}
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;

    // Gắn sự kiện chọn đáp án
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function () {

            const questionId = this.dataset.question;
            const answerId = parseInt(this.dataset.answer);

            // Bỏ selected của cùng câu
            document.querySelectorAll(
                `.quiz-option[data-question="${questionId}"]`
            ).forEach(opt => opt.classList.remove('selected'));

            this.classList.add('selected');

            appState.currentQuizAnswers[questionId] = answerId;

            // Hiển thị nút nộp khi đủ câu
            const totalQuestions = sampleData.dailyQuiz.questions.length;

            if (Object.keys(appState.currentQuizAnswers).length === totalQuestions) {
                const submitBtn = document.getElementById('submitQuizBtn');
                if (submitBtn) submitBtn.style.display = 'inline-block';
            }
        });
    });

    // Reset UI
    toggleQuizUI(false);
}

/* ===============================
   TÍNH ĐIỂM
================================= */
function calculateQuizScore() {

    let score = 0;
    const totalQuestions = sampleData.dailyQuiz.questions.length;

    sampleData.dailyQuiz.questions.forEach(q => {
        if (appState.currentQuizAnswers[q.id] === q.correctAnswer) {
            score++;
        }
    });

    return {
        score,
        total: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
    };
}

/* ===============================
   HIỂN THỊ KẾT QUẢ
================================= */
export function showQuizResult() {

    const result = calculateQuizScore();
    const container = document.getElementById('quizResult');
    if (!container) return result;

    let html = `
        <div class="quiz-result">
            <h2>Kết quả quiz của bạn</h2>
            <div class="quiz-score">${result.score}/${result.total}</div>
            <p>Bạn trả lời đúng ${result.score}/${result.total} câu.</p>
            <p>Tỷ lệ đúng: <strong>${result.percentage}%</strong></p>
            <p>Điểm nhận được: <strong>${result.score * 10}</strong> điểm</p>
            <div class="quiz-result-details">
    `;

    sampleData.dailyQuiz.questions.forEach((q, index) => {

        const isCorrect = appState.currentQuizAnswers[q.id] === q.correctAnswer;
        const userAnswer = appState.currentQuizAnswers[q.id] !== undefined
            ? q.options[appState.currentQuizAnswers[q.id]]
            : "Chưa trả lời";

        const correctAnswer = q.options[q.correctAnswer];

        html += `
            <div style="margin-bottom:15px;padding:10px;
                        border-left:4px solid ${isCorrect ? '#4CAF50' : '#F44336'};
                        background:#f9f9f9;">
                <p><strong>Câu ${index + 1}:</strong> ${q.question}</p>
                <p>Đáp án bạn chọn:
                   <span style="color:${isCorrect ? '#4CAF50' : '#F44336'}">
                   ${userAnswer}
                   </span>
                </p>
                ${!isCorrect
                    ? `<p>Đáp án đúng:
                        <span style="color:#4CAF50">${correctAnswer}</span>
                       </p>`
                    : ''}
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;

    toggleQuizUI(true);

    return result;
}

/* ===============================
   CẬP NHẬT THỐNG KÊ
================================= */
export function updateStatsAfterQuiz(result) {

    if (result.score <= 0) return;

    const quizCompletedEl = document.getElementById('quizCompleted');
    if (!quizCompletedEl) return;

    const currentCompleted = parseInt(quizCompletedEl.textContent) || 0;
    quizCompletedEl.textContent = currentCompleted + 1;

    const currentPercentage =
        Math.min(100, Math.floor((currentCompleted + 1) / 2847 * 100));

    updateQuizProgress(currentPercentage);

    // Lưu lịch sử
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    sampleData.quizHistory.unshift({
        date: dateStr,
        topic: sampleData.dailyQuiz.title,
        score: `${result.score}/${result.total}`,
        points: result.score * 10
    });

    if (sampleData.quizHistory.length > 10) {
        sampleData.quizHistory.length = 10;
    }
}

/* ===============================
   RESET QUIZ
================================= */
export function resetQuizAnswers() {
    appState.currentQuizAnswers = {};
}

/* ===============================
   HELPER FUNCTIONS
================================= */
function toggleQuizUI(showResult) {

    const quizQuestions = document.getElementById('quizQuestions');
    const quizResult = document.getElementById('quizResult');
    const submitBtn = document.getElementById('submitQuizBtn');
    const closeBtn = document.getElementById('closeQuizResultBtn');

    if (!quizQuestions || !quizResult) return;

    quizQuestions.style.display = showResult ? 'none' : 'block';
    quizResult.style.display = showResult ? 'block' : 'none';

    if (submitBtn) submitBtn.style.display = 'none';
    if (closeBtn) closeBtn.style.display = showResult ? 'inline-block' : 'none';
}

function updateQuizProgress(percent) {

    const elements = [
        'quizPercentage',
        'quizPercentage2'
    ];

    const bars = [
        'quizProgressBar',
        'quizProgressBar2'
    ];

    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${percent}% sinh viên`;
    });

    bars.forEach(id => {
        const bar = document.getElementById(id);
        if (bar) bar.style.width = `${percent}%`;
    });
}
