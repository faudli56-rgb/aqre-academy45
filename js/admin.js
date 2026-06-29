// ==========================================
// --- نظام التبويبات (Tabs) في لوحة التحكم ---
// ==========================================
function switchAdminTab(tabId, btnElement) {
    var contents = document.getElementsByClassName('admin-tab-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.add('hidden');
        contents[i].classList.remove('block');
    }
    
    var btns = document.getElementsByClassName('admin-tab-btn');
    for (var j = 0; j < btns.length; j++) {
        btns[j].classList.remove('bg-[#0B1F4D]', 'text-white', 'shadow');
        btns[j].classList.add('bg-transparent', 'text-slate-600');
    }
    
    document.getElementById(tabId).classList.remove('hidden');
    document.getElementById(tabId).classList.add('block');
    btnElement.classList.remove('bg-transparent', 'text-slate-600');
    btnElement.classList.add('bg-[#0B1F4D]', 'text-white', 'shadow');
}

// ==========================================
// --- تسجيل الخروج ---
// ==========================================
function logout() {
    sessionStorage.clear();
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    navigateTo('home');
}

// ==========================================
// --- نسخ رابط المسوق التلقائي ---
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    var copyBtn = document.getElementById("btn-copy-link");
    if(copyBtn) {
        copyBtn.addEventListener('click', function() {
            var copyText = document.getElementById("marketer-link-input");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            
            this.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
            this.classList.replace('bg-emerald-600', 'bg-emerald-800');
            var btn = this;
            setTimeout(function() { 
                btn.innerHTML = '<i class="fas fa-copy ml-1"></i> نسخ الرابط'; 
                btn.classList.replace('bg-emerald-800', 'bg-emerald-600');
            }, 3000);
        });
    }
});

// ==========================================
// --- نظام العمولات المتدرج وشريط التقدم الذكي ---
// ==========================================
function updateMarketerProgress(studentsCount) {
    var progressCard = document.getElementById('marketer-progress-card');
    if(!progressCard) return;

    // إظهار البطاقة بمجرد دخول المسوق
    progressCard.classList.remove('hidden');

    var tierBadge = document.getElementById('current-tier-badge');
    var studentsCountEl = document.getElementById('marketer-students-count');
    var neededEl = document.getElementById('students-needed');
    var progressBar = document.getElementById('marketer-progress-bar');

    // تحديث العداد الفعلي
    if(studentsCountEl) studentsCountEl.innerText = studentsCount;

    var currentTier = "";
    var nextGoal = 0;
    var progressPercentage = 0;

    // تطبيق شرائح العمولات المعتمدة آلياً
    if (studentsCount <= 50) {
        // الفئة الأساسية
        currentTier = "20%";
        nextGoal = 51 - studentsCount;
        progressPercentage = (studentsCount / 50) * 33; // الثلث الأول من شريط التقدم
        
        if(tierBadge) tierBadge.className = "bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm border border-blue-100 font-black";
        if(neededEl) neededEl.parentElement.innerHTML = 'الهدف القادم<br><span id="students-needed" class="text-lg font-black">' + nextGoal + '</span><br>طالب للفضية';
    } 
    else if (studentsCount >= 51 && studentsCount <= 200) {
        // الفئة الفضية
        currentTier = "25%";
        nextGoal = 201 - studentsCount;
        progressPercentage = 33 + (((studentsCount - 50) / 150) * 33); // الثلث الثاني
        
        if(tierBadge) tierBadge.className = "bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm border border-slate-300 font-black";
        if(neededEl) neededEl.parentElement.innerHTML = 'الهدف القادم<br><span id="students-needed" class="text-lg font-black">' + nextGoal + '</span><br>طالب للذهبية';
    } 
    else {
        // الفئة الذهبية
        currentTier = "30%";
        progressPercentage = 100; // شريط ممتلئ بالكامل
        
        if(tierBadge) tierBadge.className = "bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-sm border border-amber-300 font-black";
        if(neededEl) neededEl.parentElement.innerHTML = '<span class="text-lg font-black text-amber-600">أعلى فئة 🏆</span><br>أنت مسوق ذهبي';
    }

    if(tierBadge) tierBadge.innerText = currentTier;
    
    // تحريك الشريط بنعومة بعد التحميل لإعطاء تأثير بصري محفز
    setTimeout(function() {
        if(progressBar) progressBar.style.width = progressPercentage + "%";
    }, 500);
}
