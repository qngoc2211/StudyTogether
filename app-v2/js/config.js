// ===============================
// APP CONFIG
// ===============================

// Detect môi trường
const hostname = window.location.hostname;

const isLocal =
  hostname === "localhost" ||
  hostname === "127.0.0.1";

// ===============================
// BASE URL (KHÔNG có /api)
// ===============================

export const BASE_URL = isLocal
  ? "http://localhost:5000"
  : "https://studytogether-backend.onrender.com";

// ===============================
// API BASE (có /api)
// ===============================

export const API_BASE = `${BASE_URL}/api`;

// ===============================
// APP INFO
// ===============================

export const APP_NAME = "StudyTogether Admin";
export const VERSION = "2.0.0";