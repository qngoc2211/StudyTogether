// ===============================
// APP-V2 CONFIG
// ===============================

// Auto detect môi trường
const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

// Backend URL
export const CONFIG = {
    API_BASE: isLocalhost
        ? "http://localhost:5000/api"
        : "https://studytogether-backend.onrender.com/api",

    APP_NAME: "StudyTogether Admin",

    VERSION: "2.0.0"
};