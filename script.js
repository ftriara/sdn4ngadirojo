'use strict';

/* ── HAMBURGER MENU NAVIGATION ───────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Menutup menu jika link diklik (pada tampilan mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/* ── THEME SWITCHER (DARK / LIGHT) ───────────── */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', nextTheme);
});

/* ── SLIDER HERO LOGIC ────────────────────────── */
const wrapper = document.getElementById('sliderWrapper');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;

function goToSlide(index) {
    wrapper.style.transform = `translateX(-${index * 25}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
    currentSlide = index;
}

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
});

// Auto-rotation slider setiap 5 detik
setInterval(() => {
    let next = (currentSlide + 1) % 4;
    goToSlide(next);
}, 5000);

/* ── PRESTASI TABS SYSTEM ─────────────────────── */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.prestasi-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
    });
});

/* ── SCROLL REVEAL & INTERSECTION OBSERVER ───── */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px"
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Sinkronisasi link active navbar saat scroll
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

// Counter Effect 
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');

    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        
        const duration = 1500; 
        const startTime = performance.now();
    
        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = Math.floor(progress * target);
            counter.innerText = currentCount;
    
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                counter.innerText = target;
            }
        };
        requestAnimationFrame(updateNumber);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                startCounting(counter);
                observer.unobserve(counter); 
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));
});

// Berita
(function initNewsLoadMore() {
    document.addEventListener('DOMContentLoaded', () => {
      const loadMoreBtn = document.getElementById('loadMoreBtn');
      const newsGrid = document.getElementById('newsGrid');
      
      if (!loadMoreBtn || !newsGrid) return;
  
      const cardsPerLoad = 3; 
  
      loadMoreBtn.addEventListener('click', () => {
          const hiddenCards = Array.from(newsGrid.querySelectorAll('.news-card:not(.visible)'));
  
          const nextCards = hiddenCards.slice(0, cardsPerLoad);
  
          nextCards.forEach((card, index) => {
              setTimeout(() => {
                  card.classList.add('visible');
              }, index * 80);
          });
  
          if (hiddenCards.length <= cardsPerLoad) {
              loadMoreBtn.classList.add('hidden');
          }
      });
  
      const totalHiddenInitial = newsGrid.querySelectorAll('.news-card:not(.visible)').length;
      if (totalHiddenInitial === 0) {
          loadMoreBtn.classList.add('hidden');
      }
    });
  })();

// GURU
const track = document.getElementById('guruTrack');
const nextBtn = document.getElementById('guruNext');
const prevBtn = document.getElementById('guruPrev');

if (track && nextBtn && prevBtn) {
    let currentIndex = 0;
    let autoSlideInterval;

    function updateCarouselPosition() {
        const firstCard = track.querySelector('.guru-card');
        if (!firstCard) return;

        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const amountToMove = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${amountToMove}px)`;
    }

    function nextSlide() {
        const totalItems = track.querySelectorAll('.guru-card').length;
        
        let itemsPerPage = 4;
        if (window.innerWidth <= 992 && window.innerWidth > 640) {
            itemsPerPage = 3;
        } else if (window.innerWidth <= 640) {
            itemsPerPage = 2; 
        }

        if (currentIndex < totalItems - itemsPerPage) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarouselPosition();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            const totalItems = track.querySelectorAll('.guru-card').length;
            
            let itemsPerPage = 4;
            if (window.innerWidth <= 992 && window.innerWidth > 640) {
                itemsPerPage = 3;
            } else if (window.innerWidth <= 640) {
                itemsPerPage = 2;
            }
            
            currentIndex = Math.max(0, totalItems - itemsPerPage);
        }
        updateCarouselPosition();
        startAutoSlide(); 
    });

    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentIndex = 0;
            updateCarouselPosition();
            startAutoSlide(); 
        }, 250);
    });

    updateCarouselPosition();
    startAutoSlide();
}