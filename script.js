const firebaseConfig = {
    apiKey: "AIzaSyCZJXGvtIkvRZZ3cc_NTgz-BvK9Rn8McSo",
    authDomain: "techno-b5a9a.firebaseapp.com",
    projectId: "techno-b5a9a",
    storageBucket: "techno-b5a9a.firebasestorage.app",
    messagingSenderId: "685060656861",
    appId: "1:685060656861:web:6e6a237312824e51c71534",
    measurementId: "G-JWTZHDXK7J"
};

const API_URL = "http://localhost:5000/api";

// ================= GLOBAL STORES =================
let allSubjects = [];
let userProgress = [];
let currentYear = 1;
function getCurrentYear() { return currentYear; }

// ================= FETCH SUBJECTS FROM BACKEND =================
async function loadSubjects() {
    try {
        const res = await fetch(`${API_URL}/subjects`);
        const data = await res.json();
        allSubjects = Array.isArray(data) ? data : [];
        filterYear(1);
    } catch (err) {
        console.error("Failed to load subjects:", err);
        document.getElementById("subjectGrid").innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:50px;">
                <h3 style="color:#e74c3c;">Could not load subjects. Make sure the server is running.</h3>
            </div>`;
    }
}

// ================= RENDER CARDS =================
function renderCards(subjects) {
    const grid = document.getElementById("subjectGrid");
    const token = localStorage.getItem("token");

    if (subjects.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:50px;">
                <h3 style="color:#666;">No subjects found.</h3>
            </div>`;
        return;
    }

    grid.innerHTML = subjects.map(sub => {
        const progress = userProgress.find(p => p.subjectId === sub._id) || {};
        const notesViewed = progress.notesViewed || false;
        const ytViewed = progress.youtubeViewed || false;
        const completed = progress.completed || false;

        return `
        <div class="sub-card" style="${completed ? 'border: 2px solid #088178;' : ''}">
            <span style="color:#088178; font-size:12px; font-weight:bold;">YEAR ${sub.year}</span>
            ${completed ? '<span style="float:right; color:#088178; font-weight:bold;">🏆 Completed</span>' : ''}
            <h3>${sub.name}</h3>
            ${sub.suggestion ? `
                <p style="font-size:13px; color:#e67e22; margin:10px 0; background:#fff5eb; padding:8px; border-left:3px solid #e67e22; border-radius:4px;">
                    <strong>💡 Suggestion:</strong> ${sub.suggestion}
                </p>
            ` : '<p style="font-size:14px; color:#666;">Complete notes and video tutorials for university exams.</p>'}
            <div class="action-btns">
                <a href="${sub.pdf}" target="_blank"
                   onclick="${token ? `trackProgress('${sub._id}', 'notes')` : ''}"
                   class="pdf-btn" style="${notesViewed ? 'opacity:0.7;' : ''}">
                   <i class="fas fa-file-pdf"></i> View Notes ${notesViewed ? '✅' : ''}
                </a>
                <a href="${sub.yt}" target="_blank"
                   onclick="${token ? `trackProgress('${sub._id}', 'yt')` : ''}"
                   class="yt-btn" style="${ytViewed ? 'opacity:0.7;' : ''}">
                   <i class="fab fa-youtube"></i> YouTube ${ytViewed ? '✅' : ''}
                </a>
            </div>
        </div>`;
    }).join("");
}

// ================= FILTER BY YEAR =================
function filterYear(yearNum) {
    currentYear = yearNum;
    const buttons = document.querySelectorAll(".year-btn");
    buttons.forEach((btn, index) => {
        btn.classList.toggle("active", index + 1 === yearNum);
    });
    const filtered = allSubjects.filter(item => item.year === yearNum);
    renderCards(filtered);
}

// ================= SEARCH =================
function searchSubjects() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allSubjects.filter(sub =>
        sub.name.toLowerCase().includes(query)
    );
    if (filtered.length === 0) {
        document.getElementById("subjectGrid").innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:50px;">
                <h3 style="color:#666;">No subjects found for "${query}"</h3>
                <p>Try searching for a different keyword or check your spelling.</p>
            </div>`;
    } else {
        renderCards(filtered);
    }
}

// ================= PROGRESS TRACKING =================
async function loadProgress() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) return;

    try {
        const res = await fetch(`${API_URL}/progress/${user._id || user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        userProgress = await res.json();
        renderProgressBar();
        filterYear(getCurrentYear());
    } catch (err) {
        console.error("Failed to load progress:", err);
    }
}

async function trackProgress(subjectId, type) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) return;

    const existing = userProgress.find(p => p.subjectId === subjectId) || {};
    const notesViewed = type === 'notes' ? true : (existing.notesViewed || false);
    const youtubeViewed = type === 'yt' ? true : (existing.youtubeViewed || false);

    try {
        const res = await fetch(`${API_URL}/progress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user._id || user.id,
                subjectId,
                notesViewed,
                youtubeViewed
            })
        });
        const updated = await res.json();
        const idx = userProgress.findIndex(p => p.subjectId === subjectId);
        if (idx > -1) userProgress[idx] = updated;
        else userProgress.push(updated);
        renderProgressBar();
    } catch (err) {
        console.error("Failed to track progress:", err);
    }
}

function renderProgressBar() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const total = allSubjects.filter(s => s.year === Number(user.year)).length;
    const completed = userProgress.filter(p => p.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    let bar = document.getElementById("progressBar");
    if (!bar) {
        const section = document.getElementById("explore");
        section.insertAdjacentHTML("afterbegin", `
            <div id="progressBar" style="background:#f4f7f6; padding:20px 80px; margin-bottom:20px;">
                <p style="font-weight:600; color:#1a1a2e; margin-bottom:8px;">
                    📊 Your Progress: <span id="progressText">${completed}/${total} subjects completed (${percent}%)</span>
                </p>
                <div style="background:#ddd; border-radius:50px; height:12px;">
                    <div id="progressFill" style="background:#088178; height:12px; border-radius:50px; width:${percent}%; transition:0.5s;"></div>
                </div>
            </div>`);
    } else {
        document.getElementById("progressText").textContent = `${completed}/${total} subjects completed (${percent}%)`;
        document.getElementById("progressFill").style.width = `${percent}%`;
    }
}

// ================= AUTH SYSTEM =================
function openAuth() {
    if (!document.getElementById("authModal")) {
        const authHTML = `
        <div id="authModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:2000;">
            <div style="background:white; padding:40px; border-radius:15px; width:350px; text-align:center; position:relative;">
                <h2 id="authTitle" style="margin-bottom:20px; color:#1a1a2e;">Student Login</h2>
                <div id="loginForm">
                    <input id="loginEmail" type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                    <input id="loginPassword" type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                    <p id="loginError" style="color:red; font-size:13px; margin-bottom:10px; display:none;"></p>
                    <button onclick="handleLogin()" style="width:100%; padding:12px; background:#088178; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>
                    <p style="margin-top:15px; font-size:13px; color:#666;">Don't have an account? <a href="#" onclick="showRegister()" style="color:#088178;">Register here</a></p>
                </div>
                <div id="registerForm" style="display:none;">
                    <input id="regName" type="text" placeholder="Full Name" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                    <input id="regEmail" type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                    <input id="regPassword" type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                    <input id="regRoll" type="text" placeholder="Roll Number" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                    <select id="regYear" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:5px;">
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                    <p id="regError" style="color:red; font-size:13px; margin-bottom:10px; display:none;"></p>
                    <button onclick="handleRegister()" style="width:100%; padding:12px; background:#088178; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Register</button>
                    <p style="margin-top:15px; font-size:13px; color:#666;">Already have an account? <a href="#" onclick="showLogin()" style="color:#088178;">Login here</a></p>
                </div>
                <button onclick="closeAuth()" style="margin-top:20px; background:none; border:none; color:#999; cursor:pointer; text-decoration:underline;">Close</button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", authHTML);
    } else {
        document.getElementById("authModal").style.display = "flex";
    }
}

function closeAuth() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("authTitle").textContent = "Create Account";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("authTitle").textContent = "Student Login";
}

//handle login and registration

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

// ================= ON PAGE LOAD =================
document.addEventListener("DOMContentLoaded", () => {
    loadSavedTheme();   
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
        updateNavForLoggedInUser(user);
        loadProgress();    // ← load progress if already logged in
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