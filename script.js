// ====== ATUR TANGGAL SPESIAL DI SINI ======
// Gunakan format: new Date('2026-12-31T00:00:00')
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 1); // Set h+1 otomatis untuk demo
targetDate.setHours(targetDate.getHours() + 9);
targetDate.setMinutes(targetDate.getMinutes() + 22);
targetDate.setSeconds(targetDate.getSeconds() + 30);
// ===========================================

const elDays = document.getElementById('cd-days');
const elHours = document.getElementById('cd-hours');
const elMins = document.getElementById('cd-mins');
const elSecs = document.getElementById('cd-secs');

function pad(n){ return String(n).padStart(2,'0'); }

function updateCountdown(){
  const now = new Date();
  let diff = targetDate - now;

  if(diff <= 0){
    elDays.textContent = '00';
    elHours.textContent = '00';
    elMins.textContent = '00';
    elSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000*60*60*24));
  diff -= days * (1000*60*60*24);
  const hours = Math.floor(diff / (1000*60*60));
  diff -= hours * (1000*60*60);
  const mins = Math.floor(diff / (1000*60));
  diff -= mins * (1000*60);
  const secs = Math.floor(diff / 1000);

  elDays.textContent = pad(days);
  elHours.textContent = pad(hours);
  elMins.textContent = pad(mins);
  elSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// SCROLL TO SECTION FUNCTION
function scrollToSection(id) {
  const element = document.getElementById(id);
  if(element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// SURAT CINTA ENVELOPE INTERACTION
function toggleEnvelope() {
  const env = document.getElementById('envelope-letter');
  env.classList.toggle('open');
  
  // Memulai musik jika amplop dibuka pertama kali demi melewati kebijakan browser
  const audio = document.getElementById('bg-music');
  if(env.classList.contains('open') && audio.paused) {
    playMusic();
  }
}

// FIREWORKS CANVAS
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fireworksCtx = fireworksCanvas?.getContext('2d');
const fireworksColors = ['#f78da7', '#ffd166', '#8e44ad', '#ff5e5e', '#7fdbff'];
let fireworksParticles = [];
let fireworksAnimationId = null;
let fireworksTimeout = null;
let fireworksActive = false;

function resizeFireworksCanvas() {
  if (!fireworksCanvas) return;
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

function createFireworkBurst(x, y) {
  const color = fireworksColors[Math.floor(Math.random() * fireworksColors.length)];
  const count = 30 + Math.floor(Math.random() * 18);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    fireworksParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 1.1,
      alpha: 1,
      decay: 0.02 + Math.random() * 0.018,
      color,
      radius: 1.8 + Math.random() * 1.8,
      gravity: 0.08 + Math.random() * 0.04,
    });
  }
}

function drawFireworks() {
  if (!fireworksCtx || !fireworksCanvas) return;
  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworksCtx.globalCompositeOperation = 'lighter';

  fireworksParticles = fireworksParticles.filter((particle) => {
    particle.vx *= 0.99;
    particle.vy += particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) {
      return false;
    }

    fireworksCtx.beginPath();
    fireworksCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    fireworksCtx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.alpha})`;
    fireworksCtx.fill();
    return true;
  });
}

function hexToRgb(hex) {
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

function animateFireworks() {
  if (!fireworksActive) {
    return;
  }

  if (Math.random() < 0.16) {
    createFireworkBurst(
      Math.random() * fireworksCanvas.width * 0.85 + fireworksCanvas.width * 0.075,
      Math.random() * fireworksCanvas.height * 0.55 + fireworksCanvas.height * 0.1
    );
  }

  drawFireworks();
  fireworksAnimationId = requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  if (!fireworksCanvas || !fireworksCtx) return;
  fireworksActive = true;
  fireworksParticles = [];
  fireworksCanvas.classList.add('active');
  fireworksCanvas.style.display = 'block';
  resizeFireworksCanvas();
  animateFireworks();

  if (fireworksTimeout) {
    clearTimeout(fireworksTimeout);
  }

  fireworksTimeout = setTimeout(() => {
    stopFireworks();
  }, 4500);

  setTimeout(() => {
    scrollToSection('sec-gallery');
  }, 1200);
}

function stopFireworks() {
  fireworksActive = false;
  if (fireworksAnimationId) {
    cancelAnimationFrame(fireworksAnimationId);
    fireworksAnimationId = null;
  }

  if (fireworksTimeout) {
    clearTimeout(fireworksTimeout);
    fireworksTimeout = null;
  }

  if (fireworksCtx && fireworksCanvas) {
    fireworksParticles = [];
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  }

  if (fireworksCanvas) {
    fireworksCanvas.classList.remove('active');
    fireworksCanvas.style.display = 'none';
  }
}

window.addEventListener('resize', resizeFireworksCanvas);
resizeFireworksCanvas();

// MUSIC CONTROLLER
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('music-btn-toggle');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('music-progress-bar');
const progressFill = document.getElementById('music-progress');
const currentTimeLabel = document.getElementById('current-time');
const durationTimeLabel = document.getElementById('duration-time');
const volumeSlider = document.getElementById('volume-slider');
const nowPlayingText = document.getElementById('now-playing-text');
const floatingHearts = document.getElementById('floating-hearts');
const photoSide = document.querySelector('.photo-side');

let firstPlay = true;
let progressUpdateInterval = null;

function formatTime(seconds) {
  const rounded = Math.floor(seconds);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
  if (!audio.duration || isNaN(audio.duration)) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  durationTimeLabel.textContent = formatTime(audio.duration);
}

function setPlayState(isPlaying) {
  if (isPlaying) {
    playBtn.classList.add('playing');
    playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    nowPlayingText.classList.add('visible');
    floatingHearts.classList.add('active');
    if (!progressUpdateInterval) {
      progressUpdateInterval = setInterval(updateProgress, 250);
    }
  } else {
    playBtn.classList.remove('playing');
    playIcon.innerHTML = `<path d="M5 3l14 9-14 9V3z"/>`;
    floatingHearts.classList.remove('active');
    if (progressUpdateInterval) {
      clearInterval(progressUpdateInterval);
      progressUpdateInterval = null;
    }
  }
}

function playMusic() {
  audio.play().then(() => {
    setPlayState(true);
  }).catch(err => console.log('Auto-play diblokir oleh browser sebelum ada interaksi.', err));
}

function pauseMusic() {
  audio.pause();
  setPlayState(false);
}

function togglePlayMusic() {
  if (audio.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function syncNowPlayingMessage() {
  if (firstPlay) {
    firstPlay = false;
    nowPlayingText.classList.add('visible');
    setTimeout(() => {
      nowPlayingText.classList.remove('visible');
    }, 3800);
  }
}

function initializeAudio() {
  volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
  });

  playBtn.addEventListener('click', () => {
    togglePlayMusic();
    syncNowPlayingMessage();
  });

  progressBar.addEventListener('click', (event) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    if (!isNaN(newTime)) {
      audio.currentTime = newTime;
      updateProgress();
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    durationTimeLabel.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('play', () => {
    setPlayState(true);
    syncNowPlayingMessage();
  });

  audio.addEventListener('pause', () => {
    setPlayState(false);
  });

  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    updateProgress();
    setPlayState(false);
  });

  // Keep the animated hearts in sync with playback.
  audio.addEventListener('play', () => floatingHearts.classList.add('active'));
  audio.addEventListener('pause', () => floatingHearts.classList.remove('active'));
  audio.addEventListener('ended', () => floatingHearts.classList.remove('active'));
}

initializeAudio();

// GALLERY FILTER
function filterGallery(category, button) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');

  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const isVisible = category === 'all' || item.classList.contains(category);
    if (isVisible) {
      item.style.display = '';
      item.classList.remove('hidden', 'filter-leaving');
      item.classList.add('showing');
      window.requestAnimationFrame(() => {
        item.classList.remove('showing');
      });
    } else {
      item.classList.remove('showing');
      item.classList.add('filter-leaving');
      setTimeout(() => {
        item.classList.add('hidden');
        item.classList.remove('filter-leaving');
        item.style.display = 'none';
      }, 280);
    }
  });
}

// LIGHTBOX ZOOM FOTO
function openLightbox(element) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const imgEl = element.querySelector('img');
  const src = imgEl.src;
  const alt = imgEl.alt || 'Foto detail galeri';

  img.src = src;
  caption.textContent = alt;
  modal.classList.add('active');
  document.body.classList.add('body-no-scroll');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('active');
  document.body.classList.remove('body-no-scroll');
}

function initializeQuoteSlider() {
  const slides = document.querySelectorAll('.quote-slide');
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  showSlide(currentIndex);
  setInterval(nextSlide, 5200);
}

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll('.section-container, .gallery-item, .timeline-item, .wish-card, .quote-slider, .letter-grid, .music-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
  });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

initializeQuoteSlider();
initializeRevealAnimations();

// ====== WISH CARD ANIMATIONS ======
function playWishAnimation(cardElement) {
  const svg = cardElement.querySelector('.wish-animation');
  if (svg) {
    svg.classList.add('playing');
  }
}

function stopWishAnimation(cardElement) {
  const svg = cardElement.querySelector('.wish-animation');
  if (svg) {
    svg.classList.remove('playing');
  }
}

// ACTIONS DI HERO
function rayakan(){
  playMusic();
}

function jalankanRayakan() {
  playMusic();

  if (typeof confetti !== 'function') {
    setTimeout(() => scrollToSection('galeri'), 1000);
    return;
  }

  const colors = ['#f78da7', '#ffd166', '#8e44ad', '#ff5e5e', '#7fdbff'];
  const duration = 3600;
  const end = Date.now() + duration;

  const shoot = () => {
    confetti({
      particleCount: 18,
      angle: 60 + Math.random() * 20,
      spread: 45 + Math.random() * 20,
      origin: { x: Math.random() * 0.35 + 0.05, y: Math.random() * 0.05 + 0.05 },
      colors,
      gravity: 0.9,
      scalar: 1.05,
      drift: 0.4,
    });

    confetti({
      particleCount: 18,
      angle: 120 + Math.random() * 20,
      spread: 45 + Math.random() * 20,
      origin: { x: Math.random() * 0.35 + 0.55, y: Math.random() * 0.05 + 0.05 },
      colors,
      gravity: 0.9,
      scalar: 1.05,
      drift: -0.4,
    });
  };

  shoot();
  const confettiInterval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(confettiInterval);
      return;
    }
    shoot();
  }, 260);
}

function bacaSurat(){
  scrollToSection('sec-letter');
}

// ====== GALLERY CAROUSEL ======
const carouselData = [
  {
    id: 0,
    image: 'galeri/foto6.jpeg',
    title: 'Kue Ulang Tahun',
    description: 'Setiap momen spesial bersama menciptakan kenangan yang akan selamanya tertanam di hati saya.',
    tag: 'Spesial',
    tagColor: 'rose'
  },
  {
    id: 1,
    image: 'galeri/foto7.jpeg',
    title: 'Malam Bersamamu',
    description: 'Di setiap malam yang tenang, saya bersyukur memiliki dirimu di sisi saya. Cinta ini tumbuh semakin kuat.',
    tag: 'Cinta',
    tagColor: 'rose'
  },
  {
    id: 2,
    image: 'galeri/foto8.jpeg',
    title: 'Tawa Bahagia Kita',
    description: 'Tawa lepas adalah simbol kebahagiaan sejati. Terima kasih telah membuat hidupku penuh gelak tawa.',
    tag: 'Momen',
    tagColor: 'blue'
  },
  {
    id: 3,
    image: 'galeri/foto9.jpeg',
    title: 'Liburan Singkat',
    description: 'Setiap petualangan bersama adalah cerita indah yang ingin aku ulang berulang kali.',
    tag: 'Jalan-jalan',
    tagColor: 'amber'
  }
];

let currentSlideIndex = 0;

function initializeCarouselDots() {
  const dotsContainer = document.getElementById('carousel-dots');
  if (!dotsContainer) return;
  
  dotsContainer.innerHTML = '';
  carouselData.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${
      index === currentSlideIndex 
        ? 'bg-rose-600 w-8' 
        : 'bg-gray-300 hover:bg-gray-400'
    }`;
    dot.onclick = () => goToCarouselSlide(index);
    dotsContainer.appendChild(dot);
  });
}

function updateCarouselSlide() {
  const data = carouselData[currentSlideIndex];
  
  // Update image
  document.querySelectorAll('.carousel-image').forEach((img, idx) => {
    img.style.opacity = idx === currentSlideIndex ? '1' : '0';
  });

  // Update title and description (sinkronisasi dengan modal header)
  const titleEl = document.getElementById('carousel-title');
  const subtitleEl = document.getElementById('carousel-subtitle');
  if (titleEl) titleEl.textContent = data.title;
  if (subtitleEl) subtitleEl.textContent = data.description;

  // Update image details panel
  document.getElementById('carousel-image-title').textContent = data.title;
  document.getElementById('carousel-image-description').textContent = data.description;
  document.getElementById('carousel-image-tag').textContent = data.tag;
  
  // Update tag color
  const tagEl = document.getElementById('carousel-image-tag');
  
  const colorMap = {
    rose: 'bg-rose-100 text-rose-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700'
  };
  
  const colorClass = colorMap[data.tagColor] || colorMap.rose;
  tagEl.setAttribute('class', `inline-block px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${colorClass}`);

  // Update counter
  document.getElementById('carousel-counter').textContent = `${currentSlideIndex + 1} / ${carouselData.length}`;

  // Update progress bar
  const progress = ((currentSlideIndex + 1) / carouselData.length) * 100;
  document.getElementById('carousel-progress').style.width = `${progress}%`;

  // Update dots
  initializeCarouselDots();
}

function nextCarouselSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % carouselData.length;
  updateCarouselSlide();
}

function prevCarouselSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + carouselData.length) % carouselData.length;
  updateCarouselSlide();
}

function goToCarouselSlide(index) {
  currentSlideIndex = index;
  updateCarouselSlide();
}

function openGalleryModal(index = 0) {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    currentSlideIndex = index;
    updateCarouselSlide();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// Click outside modal to close
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeGalleryModal();
      }
    });
  }
  
  // Initialize carousel
  initializeCarouselDots();
});

// Keyboard support
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById('gallery-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  
  if (e.key === 'ArrowLeft') {
    prevCarouselSlide();
  } else if (e.key === 'ArrowRight') {
    nextCarouselSlide();
  } else if (e.key === 'Escape') {
    closeGalleryModal();
  }
});