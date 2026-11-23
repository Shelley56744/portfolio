// =========================================
// 黃宥瑄 Shelley 作品集｜互動效果
// =========================================

// 使用者是否開啟「減少動態效果」
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// 1. 導覽列：往下捲時加上陰影
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});


// 2. 手機版：點了選單連結後自動收起選單
const navMenu = document.getElementById('navMenu');
document.querySelectorAll('#navMenu .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
    }
  });
});


// 3. 文字逐字出現：把文字拆成一個個字，每個字從上或下隨機滑進來
//    （參考 Codrops 文章裡的 text roll 效果，改成用 CSS transition 做）
document.querySelectorAll('.roll-text').forEach((el) => {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);

  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.setProperty('--from', Math.random() > 0.5 ? '100%' : '-100%');
    span.style.transitionDelay = (i * 0.05) + 's';
    el.appendChild(span);
  });
});


// 4. 捲到畫面裡才出現（文字滾動 + 區塊淡入）
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);   // 只播一次
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.roll-text, .reveal').forEach((el) => observer.observe(el));


// 5. 視差：金魚、星星等裝飾跟著捲動，用不同速度移動
const decos = document.querySelectorAll('.deco');
let ticking = false;

function updateParallax() {
  decos.forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0;
    const rect = el.parentElement.getBoundingClientRect();
    // 區塊中心離畫面中心多遠，就移動多少
    const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
    el.style.translate = `0 ${offset * speed}px`;
  });
  ticking = false;
}

if (!reduceMotion) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  updateParallax();
}


// 6. 作品卡片：滑鼠在圖片上移動時，柔光跟著游標
document.querySelectorAll('.work-img').forEach((box) => {
  box.addEventListener('mousemove', (e) => {
    const rect = box.getBoundingClientRect();
    box.style.setProperty('--x', (e.clientX - rect.left) + 'px');
    box.style.setProperty('--y', (e.clientY - rect.top) + 'px');
  });
});


// 7. 聯絡表單：用 Bootstrap 的驗證樣式，送出成功就跳出感謝視窗
//    （這是靜態網頁，沒有後端，所以訊息不會真的寄出）
const form = document.getElementById('contactForm');
const thanksModal = new bootstrap.Modal(document.getElementById('thanksModal'));

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  thanksModal.show();
  form.reset();
  form.classList.remove('was-validated');
});


// 8. 關掉彈出視窗時，把裡面的影片／小遊戲重新載入，避免影片關掉後還在播
document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('hidden.bs.modal', () => {
    modal.querySelectorAll('iframe').forEach((frame) => {
      frame.src = frame.src;
    });
  });
});


// 9. 點擊時冒出泡泡：在點的位置產生幾顆泡泡，往上飄然後消失
if (!reduceMotion) {
  document.addEventListener('pointerdown', (e) => {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('span');
      const size = 10 + Math.random() * 14;                       // 泡泡大小 10–24px
      bubble.className = 'bubble';
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = e.clientX + 'px';
      bubble.style.top = e.clientY + 'px';
      bubble.style.setProperty('--dx', (Math.random() * 70 - 35) + 'px'); // 左右飄
      bubble.style.setProperty('--dy', (60 + Math.random() * 60) + 'px'); // 往上飄
      bubble.style.animationDelay = (i * 0.04) + 's';
      document.body.appendChild(bubble);
      bubble.addEventListener('animationend', () => bubble.remove());
    }
  });
}


// 10. 頁尾年份自動更新
document.getElementById('year').textContent = new Date().getFullYear();
