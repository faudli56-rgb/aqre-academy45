const API_URL = "https://script.google.com/macros/s/AKfycbxMog8gTa9QaTUX_36_RapCB4G0H4lyDTnr_n7X6BA76WDXp0343rfTnGA1yZ-uD8mzYg/exec";

// ==========================================
// --- جلب بيانات الدورات والأخبار ---
// ==========================================
function fetchCoursesAPI() {
    fetch(API_URL + "?action=getCourses")
    .then(response => response.json())
    .then(data => {
        globalCourses = data;
        renderCourses(data); // دالة موجودة في main.js
    })
    .catch(err => console.error("خطأ في جلب الدورات:", err));
}

function fetchNewsAPI() {
    fetch(API_URL + "?action=getNews")
    .then(response => response.json())
    .then(data => {
        // دالة عرض الأخبار
        renderNews(data); 
    })
    .catch(err => console.error("خطأ في جلب الأخبار:", err));
}

// ==========================================
// --- تسجيل طالب جديد ---
// ==========================================
function submitRegistrationAPI(studentData) {
    return fetch(API_URL + "?action=saveStudent", {
        method: 'POST',
        body: JSON.stringify(studentData)
    })
    .then(response => response.json());
}

// ==========================================
// --- تسجيل الدخول (للمدير والمسوقين) ---
// ==========================================
function loginAPI(username, password) {
    return fetch(API_URL + "?action=login", {
        method: 'POST',
        body: JSON.stringify({username: username, password: password})
    })
    .then(response => response.json());
}

// ==========================================
// --- جلب بيانات الإحصائيات (للمسوق والمدير) ---
// ==========================================
function getStatsAPI(role, code, userName) {
    fetch(`${API_URL}?action=getStats&role=${role}&code=${code}&name=${encodeURIComponent(userName)}`)
    .then(response => response.json())
    .then(res => {
        if(res.success) {
            // تحديث البطاقات الإحصائية وشريط التقدم
            updateMarketerProgress(res.studentsCount); 
            // تحديث أرقام المربعات الإحصائية الأخرى...
        }
    })
    .catch(err => console.error("خطأ في جلب الإحصائيات:", err));
}
