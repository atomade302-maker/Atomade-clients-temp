// ===== HERO AUTOMATIC IMAGE SLIDESHOW (INSTANT CUT) =====
document.addEventListener("DOMContentLoaded", () => {
  const imageSlides = document.querySelectorAll('.hero-image-slide');
  if (imageSlides.length > 0) {
    let currentSlide = 0;

    // Set initial state
    imageSlides.forEach((slide, idx) => {
      gsap.set(slide, {
        opacity: idx === 0 ? 1 : 0,
        zIndex: idx === 0 ? 2 : 1
      });
    });

    function goToSlide(nextIndex) {
      const current = imageSlides[currentSlide];
      const next    = imageSlides[nextIndex];

      // Instant cut: snap opacity in 0.05s — no visible transition
      gsap.set(next, { zIndex: 3, opacity: 0 });
      gsap.to(next, {
        opacity: 1,
        duration: 0.05,   // essentially instant
        ease: 'none',
        onComplete: () => {
          gsap.set(current, { opacity: 0, zIndex: 1 });
          gsap.set(next, { zIndex: 2 });
          currentSlide = nextIndex;
        }
      });
    }

    // Hold each image for exactly 6 seconds, then instant cut
    setInterval(() => {
      goToSlide((currentSlide + 1) % imageSlides.length);
    }, 6000);
  }
});


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    btn.textContent = '✅ Request Sent! We\'ll contact you soon.';
    btn.style.background = '#00C896';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Order Request 🎂';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

// ===== CAKE ANIMATION SCROLL TRIGGER =====
// The cake widget is pinned to the left edge of the screen and stays visible
// only when scrolled past the hero section. When on the hero, it disappears.
const aboutCakeImgWrap = document.getElementById('aboutCakeImgWrap');
const heroSection = document.getElementById('home');

if (aboutCakeImgWrap && heroSection) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If the hero section is in view, hide the cake animation
          aboutCakeImgWrap.classList.remove('cake-visible');
        } else {
          // If the user has scrolled past the hero, show the cake animation
          aboutCakeImgWrap.classList.add('cake-visible');
        }
      });
    },
    { threshold: 0.15 } // Trigger when at least 15% of the hero is visible/hidden
  );
  heroObserver.observe(heroSection);
}
// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.getAttribute('id');
  });
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// Add active style
const style = document.createElement('style');
style.textContent = '.nav-links a.active { color: var(--orange) !important; } .nav-links a.active::after { width: 100% !important; }';
document.head.appendChild(style);

// ===== TESTIMONIAL CAROUSEL =====
const testiGrid = document.querySelector('.testi-grid');
const leftCtrl = document.querySelector('.ctrl-left');
const rightCtrl = document.querySelector('.ctrl-right');

if (testiGrid && leftCtrl && rightCtrl) {
  leftCtrl.addEventListener('click', () => {
    testiGrid.scrollBy({ left: -350, behavior: 'smooth' });
  });
  rightCtrl.addEventListener('click', () => {
    testiGrid.scrollBy({ left: 350, behavior: 'smooth' });
  });
}

// ===== DYNAMIC GOOGLE REVIEWS =====
// You can easily add, remove, or update reviews in this array based on your Google Business Profile.
// The website will automatically update the review cards based on this data.
const reviewsData = [
  {
    name: "Jisbin Baby",
    rating: 5,
    text: "Food: 5/5 | Service: 5/5 | Atmosphere: 4/5",
    date: "2 years ago",
    initial: "J"
  },
  {
    name: "Vinod Shaji",
    rating: 5,
    text: "",
    date: "3 years ago",
    initial: "V"
  },
  {
    name: "Jishnuappu Ck",
    rating: 5,
    text: "",
    date: "4 years ago",
    initial: "J"
  },
  {
    name: "Avinash P Paul",
    rating: 4,
    text: "",
    date: "8 years ago",
    initial: "A"
  }
];

const reviewsGrid = document.getElementById('dynamic-reviews-grid');
if (reviewsGrid) {
  reviewsGrid.innerHTML = ''; // Clear existing empty state
  reviewsData.forEach(review => {
    const stars = '⭐'.repeat(review.rating);
    const textHTML = review.text ? `<p>"${review.text}"</p>` : `<p style="font-style: italic; opacity: 0.6;">Rated ${review.rating} stars on Google</p>`;
    const cardHTML = `
      <div class="testi-card reveal">
        <span class="quote-mark">“</span>
        <div class="testi-stars">${stars}</div>
        ${textHTML}
        <div class="testi-author">
          <div class="testi-av-placeholder"><span>${review.initial}</span></div>
          <div>
            <strong>${review.name}</strong>
            <span>${review.date}</span>
          </div>
        </div>
      </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    const cardElement = tempDiv.firstChild;
    reviewsGrid.appendChild(cardElement);
    
    // Add to intersection observer for scroll animation
    if (typeof revealObserver !== 'undefined') {
      revealObserver.observe(cardElement);
    }
  });
}
