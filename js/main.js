// ==========================================
// --- المتغيرات العامة والتخزين المحلي ---
// ==========================================
var globalCourses = [];
var globalAds = [
    { title: "سجل الآن في دبلوم إدارة الأعمال", type: "إعلان رئيسي", date: "ينتهي في 2026-12-31", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800", link: "#" },
    { title: "خصم 50% على دورات الذكاء الاصطناعي", type: "إعلان عاجل", date: "ينتهي في 2026-08-01", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800", link: "#" },
    { title: "الدفعة الجديدة للغة الإنجليزية", type: "إعلان عادي", date: "مستمر", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800", link: "#" }
];
var currentAdIndex = 0;

// نظام حماية التخزين لمتصفحات الجوال (مثل سامسونج)
function safeSetStorage(key, value) {
    try { localStorage.setItem(key, value); } 
    catch(e) { console.warn("Mobile tracking protection active - Storage ignored"); }
}
function safeGetStorage(key) {
    try { return localStorage.getItem(key); } 
    catch(e) { return null; }
}

var totalViews = safeGetStorage('site_views') ? parseInt(safeGetStorage('site_views'), 10) : 1482;
var totalClicks = safeGetStorage('wa_clicks') ? parseInt(safeGetStorage('wa_clicks'), 10) : 342;

// ==========================================
// --- التهيئة الأساسية عند تحميل الموقع ---
// ==========================================
function initializeWebsiteLayout() {
    try { totalViews += 1; safeSetStorage('site_views', totalViews); } catch(e) {}
    
    // تشغيل السلايدر
    renderAdsSlider();
    setInterval(function() { moveAdSlide(1); }, 5000);
    
    // 🌟 التعديل المطلوب: ظهور الإعلان المنبثق بعد 5 ثوانٍ بالضبط (5000 ملي ثانية)
    setTimeout(function() { 
        var popup = document.getElementById('welcome-popup');
        if(popup) popup.classList.remove('hidden'); 
    }, 5000);

    // استدعاء الدوال من api.js لجلب البيانات (سننشئها لاحقاً)
    if(typeof fetchCoursesAPI === 'function') fetchCoursesAPI();
    if(typeof fetchNewsAPI === 'function') fetchNewsAPI();
    if(typeof fetchTestimonialsAPI === 'function') fetchTestimonialsAPI();
}

// ==========================================
// --- التنقل بين الصفحات (نظام الصفحة الواحدة) ---
// ==========================================
function navigateTo(pageId) {
    // إخفاء كل الأقسام
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('header nav a').forEach(b => b.classList.remove('nav-active'));
    
    // إظهار القسم المطلوب
    var targetPage = document.getElementById('page-' + pageId);
    if(targetPage) targetPage.classList.add('active');
    
    // تفعيل زر القائمة
    var targetBtn = document.getElementById('btn-' + pageId);
    if(targetBtn) targetBtn.classList.add('nav-active');
    
    // إخفاء صفحة الهبوط إذا كانت مفتوحة
    closeLandingPage();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    var icon = document.getElementById('menu-toggle-icon');
    if (menu.classList.contains('hidden')) { 
        menu.classList.remove('hidden'); 
        icon.innerHTML = "&#10006;"; 
    } else { 
        menu.classList.add('hidden'); 
        icon.innerHTML = "&#9776;"; 
    }
}

function trackButtonClick(buttonName) {
    if(buttonName === 'WhatsApp_Float') { 
        try { totalClicks += 1; safeSetStorage('wa_clicks', totalClicks); } catch(e) {} 
    }
}

// ==========================================
// --- النوافذ المنبثقة (Popups) ---
// ==========================================
function closePopup() { 
    var popup = document.getElementById('welcome-popup');
    if(popup) popup.classList.add('hidden'); 
}

function popupActionRegister() { 
    closePopup(); 
    navigateTo('register'); 
}

function openLoginModal() { 
    document.getElementById('loginModal').classList.remove('hidden'); 
}

function closeLoginModal() { 
    document.getElementById('loginModal').classList.add('hidden'); 
}

// ==========================================
// --- سلايدر الإعلانات ---
// ==========================================
function renderAdsSlider() {
    var container = document.getElementById('ads-slider-container');
    var dots = document.getElementById('ads-dots-container');
    if(!container || !dots) return;
    
    container.innerHTML = ''; 
    dots.innerHTML = '';
    
    globalAds.forEach(function(ad, idx) {
        let badgeClass = ad.type === "إعلان عاجل" ? "bg-rose-600" : (ad.type === "إعلان رئيسي" ? "bg-[#D4A017]" : "bg-blue-600");
        container.innerHTML += `
        <div class="slide bg-slate-900 cursor-pointer" onclick="navigateTo('register')">
            <img src="${ad.img}" class="w-full h-full object-cover opacity-60">
            <div class="absolute inset-0 flex flex-col justify-end p-8 text-white text-right bg-gradient-to-t from-black/80 to-transparent">
                <span class="${badgeClass} text-[10px] font-bold px-3 py-1 rounded-full w-max mb-3 shadow">${ad.type}</span>
                <h3 class="text-3xl font-black mb-2">${ad.title}</h3>
                <p class="text-xs text-slate-300 font-bold mb-4"><i class="fas fa-clock"></i> ${ad.date}</p>
            </div>
        </div>`;
        dots.innerHTML += `<div onclick="setAdSlide(${idx})" class="dot transition ${idx===0?'active':''}"></div>`;
    });
}

function moveAdSlide(dir) {
    if(globalAds.length === 0) return;
    currentAdIndex = (currentAdIndex + dir + globalAds.length) % globalAds.length;
    setAdSlide(currentAdIndex);
}

function setAdSlide(idx) {
    currentAdIndex = idx;
    var slider = document.getElementById('ads-slider-container');
    if(slider) slider.style.transform = "translateX(" + (idx * -100) + "%)"; // -100% للغة العربية RTL
    document.querySelectorAll('.dot').forEach(function(d, i) {
        if (i === idx) d.classList.add('active'); else d.classList.remove('active');
    });
}

// ==========================================
// --- التفاعل مع الدورات وصفحات الهبوط ---
// ==========================================
function filterCourses(category) {
    document.querySelectorAll('#courses-list-container > div').forEach(function(card) {
        card.style.display = (category === 'all' || card.getAttribute('data-category') === category) ? 'flex' : 'none';
    });
}

function selectCourseDirectly(courseTitle) { 
    var courseSelect = document.getElementById('reg-course');
    if(courseSelect) {
        courseSelect.value = courseTitle; 
        showSelectedCourseDetails();
    }
    navigateTo('register'); 
}

function showSelectedCourseDetails() {
    var selectedTitle = document.getElementById('reg-course').value;
    var course = null;
    for(var i=0; i<globalCourses.length; i++) {
        if(globalCourses[i].title === selectedTitle) { course = globalCourses[i]; break; }
    }
    
    var display = document.getElementById('course-dynamic-info');
    if(!display) return;
    
    if (course) {
        display.innerHTML = `
            <div class="flex items-center gap-2"><i class="fas fa-info-circle text-blue-500"></i> تفاصيل المسار المختار:</div>
            <ul class="list-disc list-inside font-bold mr-2 text-blue-900 mt-1 space-y-1">
                <li>المدة: ${course.duration || 'مفتوحة'}</li>
                <li>الرسوم: ${course.fee || 'مجاناً'}</li>
                <li>موعد البدء: قريباً (سيتم الإبلاغ عبر الواتساب)</li>
            </ul>`;
        display.classList.remove('hidden');
    } else {
        display.classList.add('hidden');
    }
}

function closeLandingPage() {
    var landingContainer = document.getElementById('landing-page-container');
    var mainContent = document.getElementById('page-courses');
    
    if(landingContainer) landingContainer.classList.add('hidden');
    if(mainContent && document.getElementById('page-courses').classList.contains('active')) {
        mainContent.style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function registerFromLanding() {
    var landingContainer = document.getElementById('landing-page-container');
    if(!landingContainer) return;
    var courseTitle = landingContainer.getAttribute('data-current-course');
    closeLandingPage();
    selectCourseDirectly(courseTitle);
}

// ==========================================
// --- البحث في الأخبار ---
// ==========================================
function searchNews() {
    var term = document.getElementById('news-search').value.toLowerCase();
    var cards = document.querySelectorAll('#news-list-container > div');
    cards.forEach(function(card) {
        var txt = card.innerText.toLowerCase();
        card.style.display = txt.includes(term) ? 'flex' : 'none';
    });
}
