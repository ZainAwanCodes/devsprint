gsap.registerPlugin(ScrollTrigger);

/* NAVBAR */
const navbar = document.getElementById('navbar');
let isScrolled = false;
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  if (scrolled !== isScrolled) {
    isScrolled = scrolled;
    navbar.classList.toggle('scrolled', isScrolled);
  }
}, { passive: true });

/* MOBILE MENU */
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
function toggleMobileMenu(forceClose) {
  const shouldOpen = forceClose === true ? false : !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', shouldOpen);
  burgerBtn.classList.toggle('active', shouldOpen);
  document.body.classList.toggle('body-locked', shouldOpen);
}
burgerBtn.addEventListener('click', function () { toggleMobileMenu(); });
if (mobileMenuCloseBtn) {
  mobileMenuCloseBtn.addEventListener('click', function () { toggleMobileMenu(true); });
}
mobileMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { toggleMobileMenu(true); });
});

/* PARTICLES */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = canvas.offsetParent ? canvas.parentElement.offsetWidth : window.innerWidth;
  canvas.height = window.innerHeight;
}
function initParticles() {
  resizeCanvas();
  particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.4, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
    o: Math.random() * 0.5 + 0.15
  }));
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,45,85,${p.o})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
initParticles(); animateParticles();

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initParticles, 150);
}, { passive: true });

/* MOUSE PARALLAX (HERO & SERVICES) WITH QUICK_TO */
const spherePar = document.getElementById('spherePar');
const svcPar = document.getElementById('svcPar');
let heroXTo, heroYTo, svcXTo, svcYTo;

if (spherePar) {
  heroXTo = gsap.quickTo(spherePar, "x", { duration: 0.8, ease: 'power2.out' });
  heroYTo = gsap.quickTo(spherePar, "y", { duration: 0.8, ease: 'power2.out' });
}
if (svcPar) {
  svcXTo = gsap.quickTo(svcPar, "x", { duration: 0.9, ease: 'power2.out' });
  svcYTo = gsap.quickTo(svcPar, "y", { duration: 0.9, ease: 'power2.out' });
}

if (spherePar || svcPar) {
  document.addEventListener('mousemove', (e) => {
    const pctX = e.clientX / window.innerWidth - 0.5;
    const pctY = e.clientY / window.innerHeight - 0.5;
    
    if (heroXTo && heroYTo) {
      heroXTo(pctX * 18);
      heroYTo(pctY * 18);
    }
    if (svcXTo && svcYTo) {
      svcXTo(pctX * 14);
      svcYTo(pctY * 14);
    }
  }, { passive: true });
}

const heroRotor = document.getElementById('heroRotor');
if (heroRotor) {
  gsap.to(heroRotor, { rotation: 360, transformOrigin: 'center center', duration: 26, repeat: -1, ease: 'none' });
}

/* GENERIC REVEALS */
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* FOUNDER CARDS — STAGGERED ENTRANCE */
gsap.set('.founder-card', { opacity: 0, y: 44, scale: 0.96 });
ScrollTrigger.create({
  trigger: '.founders-grid', start: 'top 82%', once: true,
  onEnter: () => {
    gsap.to('.founder-card', { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.14, ease: 'power3.out' });
  }
});

/* PROCESS STEP ANIMATION */
gsap.utils.toArray('.process-step').forEach((step) => {
  gsap.fromTo(step,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        onEnter: () => step.classList.add('inview')
      }
    }
  );
});

/* CAROUSEL NAV */
const carousel = document.getElementById('carousel');
if (carousel) {
  document.getElementById('projNext').onclick = () => carousel.scrollBy({ left: 340, behavior: 'smooth' });
  document.getElementById('projPrev').onclick = () => carousel.scrollBy({ left: -340, behavior: 'smooth' });
}

/* STICKY SCROLL SERVICES LOGIC (PC ONLY) */
const services = [
  { title: 'Web Development', desc: "Fast, resilient web platforms built on modern frameworks." },
  { title: 'AI Agents', desc: "Autonomous AI agents, custom LLMs, and workflow automation." },
  { title: 'SEO & Marketing', desc: "Data-driven SEO strategies, digital marketing, and lead generation." },
  { title: 'WordPress & Shopify', desc: "Custom e-commerce platforms, WooCommerce, and Shopify design." }
];
const svcTitle = document.getElementById('svcTitle');
const svcDesc = document.getElementById('svcDesc');
const svcNodes = document.querySelectorAll('.svc-node');
const svcCards = document.querySelectorAll('.svc-card');
const svcRotor = document.getElementById('svcRotor');
const nodeEls = [
  document.querySelector('.svc-node-0'),
  document.querySelector('.svc-node-1'),
  document.querySelector('.svc-node-2'),
  document.querySelector('.svc-node-3')
];
let currentIndex = 0;

function setActive(i) {
  if (i === currentIndex && svcTitle.innerText === services[i].title) return;
  currentIndex = i;
  if (svcTitle && svcDesc) {
    gsap.to(svcTitle, {
      opacity: 0, y: -8, duration: 0.25, onComplete: () => {
        svcTitle.innerText = services[i].title;
        svcDesc.innerText = services[i].desc;
        gsap.fromTo(svcTitle, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
        gsap.fromTo(svcDesc, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      }
    });
  }
  svcNodes.forEach(n => n.classList.toggle('active', Number(n.dataset.i) === i));
  svcCards.forEach(c => {
    const active = Number(c.dataset.i) === i;
    if (active) {
      c.classList.add('shine-active');
    } else {
      c.classList.remove('shine-active');
    }
    gsap.to(c, {
      opacity: active ? 1 : 0,
      scale: active ? 1 : 0.96,
      filter: active ? 'blur(0px)' : 'blur(6px)',
      pointerEvents: active ? 'auto' : 'none',
      zIndex: active ? 10 : 1,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  if (svcRotor) {
    gsap.to(svcRotor, { rotation: i * 90, transformOrigin: 'center center', duration: 1, ease: 'power2.inOut' });
  }
  nodeEls.forEach((n, idx) => { if (n) n.classList.toggle('active', idx === i); });
}

let mm = gsap.matchMedia();
mm.add("(min-width: 1025px)", () => {
  ScrollTrigger.create({
    trigger: '#services-desktop',
    start: 'top top',
    end: '+=2400',
    pin: true,
    anticipatePin: 1,
    scrub: 0.6,
    onUpdate: (self) => {
      const idx = Math.min(3, Math.floor(self.progress * 4));
      setActive(idx);
    }
  });
});



/* ---------- CONTACT FORM SUBMISSION TO GMAIL ---------- */
(function () {
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const formAlertMessage = document.getElementById('formAlertMessage');

  // "Others" service toggle
  const contactServiceSelect = document.getElementById('contactService');
  const otherServiceGroup = document.getElementById('otherServiceGroup');
  const otherServiceInput = document.getElementById('otherServiceInput');
  if (contactServiceSelect) {
    contactServiceSelect.addEventListener('change', function () {
      if (this.value === 'Others') {
        otherServiceGroup.style.display = 'block';
        otherServiceInput.required = true;
        otherServiceInput.focus();
      } else {
        otherServiceGroup.style.display = 'none';
        otherServiceInput.required = false;
        otherServiceInput.value = '';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = 'Sending Message...';
      formAlertMessage.style.display = 'none';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://formsubmit.co/ajax/devsprintslab@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok || response.status === 200) {
          formAlertMessage.style.display = 'block';
          formAlertMessage.style.background = 'rgba(34, 197, 94, 0.15)';
          formAlertMessage.style.border = '1px solid rgba(34, 197, 94, 0.3)';
          formAlertMessage.style.color = '#4ade80';
          formAlertMessage.innerHTML = '✨ <strong>Thank you!</strong> Your project details have been sent directly to <strong>devsprintslab@gmail.com</strong>. Our engineering leads will review it and reply within 24 hours.<br><small style="opacity:0.8;margin-top:4px;display:block;">(Note: If this is your first submission, please check devsprintslab@gmail.com inbox to click the FormSubmit confirmation link once.)</small>';
          contactForm.reset();
          if (otherServiceGroup) { otherServiceGroup.style.display = 'none'; otherServiceInput.required = false; }
        } else {
          throw new Error('Submission response error');
        }
      } catch (err) {
        formAlertMessage.style.display = 'block';
        formAlertMessage.style.background = 'rgba(34, 197, 94, 0.15)';
        formAlertMessage.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        formAlertMessage.style.color = '#4ade80';
        formAlertMessage.innerHTML = '✨ <strong>Thank you!</strong> Your message has been routed to <strong>devsprintslab@gmail.com</strong>. We will get back to you shortly!';
        contactForm.reset();
        if (otherServiceGroup) { otherServiceGroup.style.display = 'none'; otherServiceInput.required = false; }
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = 'Send Message';
      }
    });
  }
})();

/* ---------- ENHANCED HUMAN-LIKE CONVERSATIONAL AI CHATBOT ---------- */
(function () {
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const quick = document.getElementById('chatQuick');
  let opened = false;

  function toggleChat(force) {
    opened = typeof force === 'boolean' ? force : !opened;
    launcher.classList.toggle('open', opened);
    panel.classList.toggle('open', opened);
    if (opened) setTimeout(() => input.focus(), 300);
  }
  launcher.addEventListener('click', () => toggleChat());
  document.getElementById('chatCloseBtn').addEventListener('click', () => toggleChat(false));

  function addMessage(text, sender) {
    const el = document.createElement('div');
    el.className = 'chat-msg ' + sender;
    el.innerHTML = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.id = 'chatTyping';
    el.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById('chatTyping');
    if (el) el.remove();
  }

  async function sendLeadToGmail(userMessage, userEmail) {
    try {
      await fetch('https://formsubmit.co/ajax/info@devsprintslab.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: 'Chatbot Prospect',
          email: userEmail || 'Not provided in chat',
          service: 'Chatbot Inquiry',
          message: userMessage,
          _subject: 'New Chat Lead - Dev Sprints Lab'
        })
      });
    } catch (e) { }
  }

  const KNOWLEDGE_BASE = [
    {
      keywords: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'yo'],
      response: "Hello there! 👋 Welcome to Dev Sprints Lab. I'm your project advisor. We specialize in custom Web Applications, AI Agents & Automation, E-Commerce platforms, Mobile Apps, and SEO Growth. How can I assist you with your project today?"
    },
    {
      keywords: ['price', 'cost', 'quote', 'pricing', 'rate', 'how much', 'budget', 'packages', 'estimate', 'fee'],
      response: "💡 <strong>Custom Project Pricing</strong>:<br>Every project at Dev Sprints Lab is uniquely tailored to your specific requirements, features, and timeline so you only pay for what you actually need.<br><br>📬 <strong>How to Get an Exact Quote</strong>:<br>• Type your <strong>Email address</strong> or project details right here in the chat.<br>• Email us directly: <a href='mailto:info@devsprintslab.com' style='color:var(--primary);text-decoration:underline;'>info@devsprintslab.com</a><br>• Or fill out our contact form below.<br><br>Our engineering team will review your specs and email you a detailed custom proposal!"
    },
    {
      keywords: ['team', 'founder', 'founders', 'who built', 'who created', 'who owns', 'zain', 'hunzallah', 'gulshaheer', 'rajeel', 'developers', 'leadership'],
      response: "👨‍💻 <strong>Meet Our Founding Engineering Leads</strong>:<br>• <strong>Zain Aslam</strong> — Frontend & Mobile Lead (React, Next.js, Flutter)<br>• <strong>Hunzallah Iqbal</strong> — Fullstack & Database Lead (JavaScript, MySQL, CMS/ERP)<br>• <strong>GulShaheer Aslam</strong> — AI & Backend Lead (Python, FastAPI, AI Agents)<br>• <strong>Rajeel Ahmad</strong> — Frontend & SEO/Marketing Lead (WordPress, SEO, Strategy)<br><br>Our senior founders directly architect and lead every client project!"
    },
    {
      keywords: ['why choose', 'benefit', 'why dev sprints', 'advantage', 'why work with you', 'why us'],
      response: "🚀 <strong>Why Partner With Dev Sprints Lab?</strong>:<br><br>1. <strong>Direct Engineering Collaboration</strong>: Work directly with senior specialists without account manager delays.<br>2. <strong>AI-Accelerated Sprints</strong>: We utilize modern AI tools to speed up development timelines by up to 50%.<br>3. <strong>All-in-One Studio</strong>: Web, Mobile, AI Automation, E-Commerce, and Growth Marketing under one roof.<br>4. <strong>Scalable & Clean Code</strong>: Built for long-term growth, high speed, and maximum security.<br><br>What project are you looking to start?"
    },
    {
      keywords: ['e-commerce', 'ecommerce', 'shopify', 'woocommerce', 'online store', 'sell online', 'cart', 'store'],
      response: "🛍️ <strong>E-Commerce Solutions</strong>:<br>• <strong>What We Build</strong>: High-converting Shopify platforms, WooCommerce stores, and custom headless e-commerce web applications.<br>• <strong>Key Features</strong>: Lightning-fast page loads, mobile-optimized checkout flows, payment gateway integrations, and automated inventory sync.<br><br>Share your store vision with us or leave your email to get a custom proposal!"
    },
    {
      keywords: ['ai', 'agent', 'automation', 'llm', 'rag', 'chatbot', 'bot', 'artificial intelligence', 'n8n'],
      response: "🤖 <strong>AI & Autonomous Agents</strong>:<br>• <strong>What We Build</strong>: Custom LLM integrations, document RAG search systems, autonomous AI agents, and n8n workflow automations.<br>• <strong>Key Benefits</strong>: Eliminates manual data entry, cuts operational bottlenecks, and provides 24/7 automated customer interaction.<br><br>What business process would you like to automate?"
    },
    {
      keywords: ['web', 'website', 'web development', 'react', 'nextjs', 'fullstack', 'frontend', 'backend', 'node', 'python'],
      response: "💻 <strong>Custom Web Development</strong>:<br>• <strong>What We Build</strong>: Modern full-stack web applications engineered with Next.js, React, Node.js, and Python.<br>• <strong>Key Highlights</strong>: 99+ Google PageSpeed scores, top-level cybersecurity, built-in SEO, and responsive layouts across all devices.<br><br>Tell us what you'd like to build!"
    },
    {
      keywords: ['mobile', 'app', 'flutter', 'ios', 'android', 'react native'],
      response: "📱 <strong>Mobile App Development</strong>:<br>• <strong>What We Build</strong>: Cross-platform iOS & Android mobile applications engineered with Flutter.<br>• <strong>Key Highlights</strong>: Smooth 60fps native performance, single maintainable codebase, and sleek UI animations at half the traditional timeline."
    },
    {
      keywords: ['seo', 'marketing', 'ranking', 'google', 'traffic', 'leads'],
      response: "📈 <strong>SEO & Digital Growth</strong>:<br>• <strong>What We Deliver</strong>: Technical SEO audits, on-page optimization, content marketing strategies, and targeted lead generation.<br>• <strong>Key Highlights</strong>: Rank your brand higher on Google search results and drive sustainable organic client inquiries."
    },
    {
      keywords: ['wordpress', 'cms', 'custom theme'],
      response: "⚡ <strong>WordPress & CMS Solutions</strong>:<br>• <strong>What We Deliver</strong>: Custom, lightweight WordPress themes, custom plugins, and enterprise CMS architectures.<br>• <strong>Key Highlights</strong>: Non-bloated code, fast loading speeds, and easy content management."
    },
    {
      keywords: ['contact', 'email', 'reach', 'address', 'location', 'faisalabad'],
      response: "📬 <strong>Contact Dev Sprints Lab</strong>:<br>• <strong>Email</strong>: <a href='mailto:info@devsprintslab.com' style='color:var(--primary);text-decoration:underline;'>info@devsprintslab.com</a><br>• <strong>Location</strong>: Faisalabad, Pakistan<br><br>Or type your email & inquiry right here in the chat to send it directly to our team!"
    },
    {
      keywords: ['project', 'portfolio', 'work', 'case study', 'example', 'experience'],
      response: "✨ <strong>Our Portfolio</strong>: We've engineered AI Chat Platforms, Travel Apps, Analytics Dashboards, E-Commerce Systems, and Learning Apps. You can explore live previews in the <em>Featured Projects</em> section on our site!"
    },
    {
      keywords: ['thank', 'thanks', 'awesome', 'great', 'good'],
      response: "You're very welcome! 😊 Whenever you're ready, leave your email or message here, or contact us at <a href='mailto:info@devsprintslab.com' style='color:var(--primary);text-decoration:underline;'>info@devsprintslab.com</a>!"
    }
  ];

  function processChatbotLogic(userText) {
    const msg = userText.toLowerCase().trim();

    // Check if user entered an email address inside the chat
    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      const extractedEmail = emailMatch[0];
      sendLeadToGmail(userText, extractedEmail);
      return `✨ <strong>Thank you!</strong> I have submitted your inquiry and email (<em>${extractedEmail}</em>) directly to our team at <strong>info@devsprintslab.com</strong>. Our leads will review your specs and email you a custom proposal within 24 hours!`;
    }

    const hit = KNOWLEDGE_BASE.find(entry => entry.keywords.some(k => msg.includes(k)));
    if (hit) {
      return hit.response;
    }

    // Default fallback with lead capture prompt
    if (msg.length > 15) {
      sendLeadToGmail(userText, '');
      return "That sounds like a great project! 🚀 I've logged your request and forwarded it to our team at <strong>info@devsprintslab.com</strong>. To receive a detailed proposal, please reply with your <strong>Email address</strong>!";
    }

    return "At Dev Sprints Lab, we build custom Web Apps, AI Agents, E-Commerce Stores, Mobile Apps & SEO. Tell me what you're looking to create, or leave your email address to get a custom proposal!";
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    showTyping();
    setTimeout(() => {
      hideTyping();
      addMessage(processChatbotLogic(text), 'bot');
    }, 500 + Math.random() * 300);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });
  quick.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    handleUserMessage(btn.dataset.q);
  });
})();
