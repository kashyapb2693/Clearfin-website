/**
 * ClearFin General UI Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initParallaxHero();
  initPhraseRotator();
  initScrollAnimations();
});

// Smooth Scroll to Tool
function scrollToTool() {
  document.getElementById('tool').scrollIntoView({ behavior: 'smooth' });
}

// 1. 3D Parallax Hover for Hero Credit Cards
function initParallaxHero() {
  const heroSection = document.getElementById('hero');
  const cardStack = document.getElementById('cardStack');
  const cards = document.querySelectorAll('.credit-card');
  
  if (!heroSection || !cardStack) return;

  heroSection.addEventListener('mousemove', (e) => {
    // Get mouse position relative to center of screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Normalize coordinates from -1 to 1
    const mouseX = (e.clientX / windowWidth) * 2 - 1;
    const mouseY = (e.clientY / windowHeight) * 2 - 1;
    
    // Maximum rotation limits increased for deeper 3D feel
    const limitX = 20; // degrees tilt up/down
    const limitY = 30; // degrees tilt left/right
    
    // Calculate new target angles
    const targetRotateX = mouseY * -limitX;
    const targetRotateY = mouseX * limitY;
    
    // Smooth transition for stack
    cardStack.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;

    // Interactive glare for individual cards
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    // Reset smoothly to 0 on leave
    cardStack.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

// 2. Phrase Rotator Logic
function initPhraseRotator() {
  const phrases = document.querySelectorAll('.phrase-rotator .phrase');
  if (phrases.length === 0) return;

  let currentIndex = 0;
  
  setInterval(() => {
    // Remove active class from current and add "prev" for exit animation
    phrases[currentIndex].classList.remove('active');
    phrases[currentIndex].classList.add('prev');
    
    // Calculate next index
    const prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % phrases.length;
    
    // Prepare next item by removing "prev" and adding "active"
    phrases[currentIndex].classList.remove('prev');
    phrases[currentIndex].classList.add('active');
    
    // Clean up older classes shortly after transition completes
    setTimeout(() => {
      phrases[prevIndex].classList.remove('prev');
    }, 500); // matches css transition time

  }, 3000); // 3 seconds interval
}

// 3. Ultra-Premium GSAP Cinematic Scroll Enhancements
function initScrollAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Premium animations skipped.');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);

  // A. Fluid Hero Cinematic Sequence (Unpinned)
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top", // Immediately transitions out without forcing empty scrolling
      scrub: 1.2
    }
  });

  // Camera pushes through the text
  heroTl.to(".hero-content", { 
    scale: 1.2, 
    y: -50,
    opacity: 0, 
    filter: "blur(10px)",
    duration: 1
  }, 0);

  // Cards aggressively blast out into 3D space, separating and scaling past the viewport
  heroTl.to(".card-1", { z: 500, x: -300, y: -200, rotationZ: -25, scale: 1.5, opacity: 0, filter: "blur(5px)", duration: 1.5 }, 0.2)
        .to(".card-2", { z: 400, x: 250, y: -100, rotationZ: 40, scale: 1.5, opacity: 0, filter: "blur(5px)", duration: 1.5 }, 0.2)
        .to(".card-3", { z: 200, x: 50, y: 300, rotationZ: -10, scale: 2, opacity: 0, filter: "blur(5px)", duration: 1.5 }, 0.2)
        .to(".hero-bg-glow", { scale: 1.5, opacity: 0, duration: 1.5 }, 0.2);


  // B. Marquee Velocity Tracker (Skew Effect)
  // The faster the user scrolls, the more the marquee text physically bends to simulate speed
  let proxy = { skew: 0 };
  let skewSetter = gsap.quickSetter(".marquee-content", "skewX", "deg");
  let clamp = gsap.utils.clamp(-30, 30);

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -150);
      
      // Map to the proxy so we can animate it back to exactly 0 smoothly with a spring-like ease
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew)
        });
      }
    }
  });


  // C. 3D Origami Fold-Up for the Tool Container
  gsap.from(".tool-container", {
    scrollTrigger: {
      trigger: ".tool-section",
      start: "top 80%",
      end: "top 30%",
      scrub: 1.5
    },
    rotationX: 45,
    transformPerspective: 1000,
    transformOrigin: "center bottom",
    opacity: 0,
    y: 100,
    boxShadow: "0 0 0 rgba(37, 99, 235, 0)"
  });


  // D. Logo Dynamic Color Shifting
  ScrollTrigger.create({
    trigger: "#tool",
    start: "top center",
    onEnter: () => gsap.to(".logo-cf-block", { background: "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)", boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)", duration: 0.8 }),
    onLeaveBack: () => gsap.to(".logo-cf-block", { background: "linear-gradient(180deg, #FFCA28 0%, #F59E0B 100%)", boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)", duration: 0.8 })
  });
  
  ScrollTrigger.create({
    trigger: ".footer-cta",
    start: "top 80%",
    onEnter: () => gsap.to(".logo-cf-block", { background: "linear-gradient(180deg, #111827 0%, #000000 100%)", color: "#F59E0B", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", duration: 0.8 }),
    onLeaveBack: () => gsap.to(".logo-cf-block", { background: "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)", color: "#000", boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)", duration: 0.8 })
  });


  // E. Base Premium Section Reveals for Text
  gsap.utils.toArray('.gs-reveal').forEach(function(elem) {
    if (elem.classList.contains('service-card') || elem.classList.contains('tool-container')) return;
    
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });
  });


  // F. Scrub-Bound Service Cards (They float precisely with scroll movement rather than firing blindly)
  gsap.from('.services-grid .service-card', {
    scrollTrigger: {
      trigger: ".services-grid",
      start: "top 90%",
      end: "top 40%",
      scrub: 1.5,
    },
    y: 150,
    rotationZ: (i) => i === 0 ? -10 : i === 2 ? 10 : 0, 
    opacity: 0,
    stagger: 0.1
  });
}
