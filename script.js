const firebaseConfig = {
    apiKey: "AIzaSyCZJXGvtIkvRZZ3cc_NTgz-BvK9Rn8McSo",
    authDomain: "techno-b5a9a.firebaseapp.com",
    projectId: "techno-b5a9a",
    storageBucket: "techno-b5a9a.firebasestorage.app",
    messagingSenderId: "685060656861",
    appId: "1:685060656861:web:6e6a237312824e51c71534",
    measurementId: "G-JWTZHDXK7J"
};

// ✅ FIXED API URL
const API_URL = "https://notes-app-techno.onrender.com/api";

// ================= GLOBAL STORES =================
let allSubjects = [];
let userProgress = [];
let currentYear = 1;
function getCurrentYear() { return currentYear; }

// ================= FETCH SUBJECTS =================
async function loadSubjects() {
    try {
        const res = await fetch(`${API_URL}/subjects`);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Subjects not array:", data);
            allSubjects = [];
        } else {
            allSubjects = data;
        }

        filterYear(1);

    } catch (err) {
        console.error("Failed to load subjects:", err);
    }
}

// ================= RENDER =================
function renderCards(subjects) {
    const grid = document.getElementById("subjectGrid");
    const token = localStorage.getItem("token");

    if (subjects.length === 0) {
        grid.innerHTML = `<h3 style="text-align:center;">No subjects found</h3>`;
        return;
    }

    grid.innerHTML = subjects.map(sub => {
        const progress = Array.isArray(userProgress)
            ? userProgress.find(p => p.subjectId === sub._id) || {}
            : {};

        return `
        <div class="sub-card">
            <span>YEAR ${sub.year}</span>
            <h3>${sub.name}</h3>

            ${sub.suggestion && sub.suggestion.trim() !== "" ? `
                <p style="font-size:13px; color:#e67e22; margin:10px 0; background:#fff5eb; padding:8px; border-left:3px solid #e67e22; border-radius:4px;">
                    <strong>💡 Suggestion:</strong> ${sub.suggestion}
                </p>
            ` : ''}

            <div class="action-btns">
                <a href="${sub.pdf}" target="_blank"
                   onclick="${token ? `trackProgress('${sub._id}', 'notes')` : ''}">
                   Notes
                </a>

                <a href="${sub.yt}" target="_blank"
                   onclick="${token ? `trackProgress('${sub._id}', 'yt')` : ''}">
                   YouTube
                </a>
            </div>
        </div>`;
    }).join("");
}

// ================= FILTER =================
function filterYear(yearNum) {
    currentYear = yearNum;
    const filtered = allSubjects.filter(item => item.year === yearNum);
    renderCards(filtered);
}

// ================= SEARCH =================
function searchSubjects() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allSubjects.filter(sub =>
        sub.name.toLowerCase().includes(query)
    );
    renderCards(filtered);
}

// ================= PROGRESS =================
async function loadProgress() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ FIX: prevent undefined crash
    if (!token || !user || !(user._id || user.id)) {
        userProgress = [];
        return;
    }

    try {
        const res = await fetch(`${API_URL}/progress/${user._id || user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        // ✅ FIX: ensure array
        userProgress = Array.isArray(data) ? data : [];

        renderProgressBar();
        filterYear(getCurrentYear());

    } catch (err) {
        console.error("Progress error:", err);
        userProgress = [];
    }
}

async function trackProgress(subjectId, type) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) return;

    try {
        await fetch(`${API_URL}/progress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user._id || user.id,
                subjectId,
                type
            })
        });

        loadProgress();

    } catch (err) {
        console.error("Track error:", err);
    }
}

// ================= PROGRESS BAR =================
function renderProgressBar() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const total = allSubjects.length;

    const completed = Array.isArray(userProgress)
        ? userProgress.filter(p => p.completed).length
        : 0;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    console.log(`Progress: ${percent}%`);
}

// ================= AUTH =================



async function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errEl = document.getElementById("loginError");
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            errEl.textContent = data.message;
            errEl.style.display = "block";
            return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        closeAuth();
        updateNavForLoggedInUser(data.user);
        loadProgress();    // ← loads progress after login
    } catch (err) {
        errEl.textContent = "Server error. Try again.";
        errEl.style.display = "block";
    }
}

async function handleRegister() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const rollNumber = document.getElementById("regRoll").value;
    const year = document.getElementById("regYear").value;
    const errEl = document.getElementById("regError");
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, rollNumber, year: Number(year) })
        });
        const data = await res.json();
        if (!res.ok) {
            errEl.textContent = data.message;
            errEl.style.display = "block";
            return;
        }
        alert("Account created! Please login.");
        showLogin();
    } catch (err) {
        errEl.textContent = "Server error. Try again.";
        errEl.style.display = "block";
    }
}

// ================= NAV UPDATE AFTER LOGIN =================
function updateNavForLoggedInUser(user) {
    const loginBtn = document.querySelector(".login-btn");
    if (loginBtn) {
        loginBtn.textContent = `👤 ${user.name}`;
        loginBtn.onclick = handleLogout;
    }
}

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
}


// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    console.log("API:", API_URL); // 🔥 DEBUG

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
        loadProgress();
    }

    loadSubjects();
});



// ================= SCROLL BUTTON =================
const scrollBtn = document.getElementById("scrollActionBtn");
const scrollIcon = document.getElementById("scrollIcon");

window.onscroll = function() {
    if (window.scrollY < 400) {
        scrollIcon.classList.remove("fa-chevron-up");
        scrollIcon.classList.add("fa-chevron-down");
    } else {
        scrollIcon.classList.remove("fa-chevron-down");
        scrollIcon.classList.add("fa-chevron-up");
    }
};

scrollBtn.onclick = function() {
    if (window.scrollY < 400) {
        document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
    } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};

// ================= THEME SYSTEM =================
function toggleThemeMenu() {
    document.getElementById("themeMenu").classList.toggle("open");
}

function setTheme(mode) {
    document.body.classList.remove("light", "dark", "read");

    if (mode === "auto") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.classList.add(prefersDark ? "dark" : "light");
    } else {
        document.body.classList.add(mode);
    }

    localStorage.setItem("theme", mode);

    // Update active button
    document.querySelectorAll("#themeMenu button").forEach(btn => {
        btn.classList.remove("active-theme");
        if (btn.textContent.toLowerCase().includes(mode)) {
            btn.classList.add("active-theme");
        }
    });

    // Update toggle button icon
    const icons = { light: "☀️", dark: "🌙", read: "📖", auto: "🖥️" };
    document.getElementById("themeToggleBtn").textContent = `${icons[mode]} Theme`;

    // Close menu after selecting
    document.getElementById("themeMenu").classList.remove("open");
}

function loadSavedTheme() {
    const saved = localStorage.getItem("theme") || "auto";
    setTheme(saved);
}

// Close menu if clicking outside
document.addEventListener("click", (e) => {
    if (!document.getElementById("themeSwitcher").contains(e.target)) {
        document.getElementById("themeMenu").classList.remove("open");
    }
});

// Listen for system theme changes (for auto mode)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("theme") === "auto") setTheme("auto");
});



