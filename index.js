// ============================================
// GERENCIAMENTO DE TEMA CLARO/ESCURO
// ============================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Verificar preferência salva ou preferência do sistema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
}

// Definir o tema
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// Toggle do tema
themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// ============================================
// MENU HAMBURGUER MOBILE
// ============================================

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('show');
    const icon = menuToggle.querySelector('i');
    if (mainNav.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
});

// fechar menu ao clicar em link
mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('show')) {
            mainNav.classList.remove('show');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ============================================
// SMOOTH SCROLL PARA NAVEGAÇÃO
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            const offsetTop = targetElement.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Fechar menu mobile se estiver aberto
            if (window.innerWidth < 768 && mainNav.classList.contains('show')) {
                mainNav.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// ============================================
// FILTRO DE CERTIFICADOS
// ============================================

const certificadoItems = document.querySelectorAll('.certificado-item');
const certificadoModal = document.getElementById('certificadoModal');
const certificadoModalTitle = document.getElementById('certificadoModalTitle');
const certificadoModalIssuer = document.getElementById('certificadoModalIssuer');
const certificadoCredential = document.getElementById('certificadoCredential');
const certificadoViewer = document.getElementById('certificadoViewer');
const certificadoDownload = document.getElementById('certificadoDownload');

function openCertificadoModal(item) {
    if (!certificadoModal) return;

    const title = item.dataset.title;
    const issuer = item.dataset.issuer;
    const credential = item.dataset.credential;
    const file = item.dataset.file;
    const type = item.dataset.type;

    certificadoModalTitle.textContent = title;
    certificadoModalIssuer.textContent = issuer;
    certificadoCredential.textContent = credential;
    certificadoDownload.href = file;
    certificadoDownload.setAttribute('download', file.split('/').pop());

    certificadoViewer.innerHTML = '';
    if (type === 'image') {
        const image = document.createElement('img');
        image.src = file;
        image.alt = `Certificado ${title}`;
        certificadoViewer.appendChild(image);
    } else {
        const frame = document.createElement('iframe');
        frame.src = file;
        frame.title = `Certificado ${title}`;
        certificadoViewer.appendChild(frame);
    }

    certificadoModal.classList.add('show');
    certificadoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCertificadoModal() {
    if (!certificadoModal) return;

    certificadoModal.classList.remove('show');
    certificadoModal.setAttribute('aria-hidden', 'true');
    certificadoViewer.innerHTML = '';
    document.body.style.overflow = '';
}

certificadoItems.forEach(item => {
    item.addEventListener('click', () => openCertificadoModal(item));
});

document.querySelectorAll('[data-close-certificado]').forEach(button => {
    button.addEventListener('click', closeCertificadoModal);
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && certificadoModal?.classList.contains('show')) {
        closeCertificadoModal();
    }
});

const imagePreviewTriggers = document.querySelectorAll('.image-preview-trigger');
const imageModal = document.getElementById('imageModal');
const imageModalTitle = document.getElementById('imageModalTitle');
const imageModalImg = document.getElementById('imageModalImg');
const imageModalOpen = document.getElementById('imageModalOpen');

function openImageModal(trigger) {
    if (!imageModal) return;

    const imagePath = trigger.dataset.image;
    const title = trigger.dataset.title || 'Imagem do projeto';

    imageModalTitle.textContent = title;
    imageModalImg.src = imagePath;
    imageModalImg.alt = title;
    imageModalOpen.href = imagePath;
    imageModal.classList.add('show');
    imageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    if (!imageModal) return;

    imageModal.classList.remove('show');
    imageModal.setAttribute('aria-hidden', 'true');
    imageModalImg.src = '';
    document.body.style.overflow = '';
}

imagePreviewTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openImageModal(trigger));
});

document.querySelectorAll('[data-close-image]').forEach(button => {
    button.addEventListener('click', closeImageModal);
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && imageModal?.classList.contains('show')) {
        closeImageModal();
    }
});

const filtroButtons = document.querySelectorAll('.filtro-btn');
const certificadoCards = document.querySelectorAll('.certificado-card');

filtroButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active de todos os botões
        filtroButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona active ao botão clicado
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        certificadoCards.forEach(card => {
            // Animar saída
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';

            setTimeout(() => {
                if (filterValue === 'todos') {
                    card.style.display = 'block';
                } else if (filterValue === 'plataforma') {
                    card.style.display = 'block';
                } else if (filterValue === 'linguagem') {
                    card.style.display = 'block';
                }

                // Animar entrada
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.transform = 'scale(1)';
                }, 10);
            }, 300);
        });
    });
});

// ============================================
// ANIMAÇÃO DE SCROLL - REVEAL ELEMENTS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar cards e elementos para animação
document.querySelectorAll('.skill-icon, .certificado-card, .projeto-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ============================================
// ANIMAÇÃO DE SKILL BARS (removido - não usado mais)
// ============================================

// ============================================
// EFEITO DE HOVER NOS CARDS
// ============================================

document.querySelectorAll('.skill-icon, .certificado-card, .projeto-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });

    // Touch support
    card.addEventListener('touchstart', function () {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('touchend', function () {
        setTimeout(() => {
            this.style.transform = 'translateY(0)';
        }, 300);
    });
});

document.querySelectorAll('.projeto-gallery img').forEach(image => {
    const markMissingImage = () => {
        const galleryArea = image.closest('.projeto-gallery-main, .projeto-gallery-thumbs');
        if (galleryArea) {
            galleryArea.classList.add('is-missing');
        }
        image.remove();
    };

    image.addEventListener('error', markMissingImage);

    if (image.complete && image.naturalWidth === 0) {
        markMissingImage();
    }
});

// ============================================
// NAVBAR ATIVA AO SCROLL
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = 'var(--accent)';
        } else {
            link.style.color = 'var(--text-primary)';
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ============================================
// ADICIONAR CLASSE PARA NAV LINK ATIVO
// ============================================

const style2 = document.createElement('style');
style2.textContent = `
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style2);

// ============================================
// ANIMAÇÃO DE DIGITAÇÃO (OPCIONAL)
// ============================================

function typewriterEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Descomentar se quiser usar in typewriter em algum elemento
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typewriterEffect(heroTitle, originalText, 30);
// }

// ============================================
// CONTADORES ANIMADOS (OPCIONAL)
// ============================================

function animateCounter(element, target, duration = 1000) {
    let current = 0;
    const increment = target / (duration / 16);
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    updateCounter();
}

// ============================================
// FORM VALIDATION (Se adicionar formulário)
// ============================================

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// ============================================
// PRINT AMIGÁVEL
// ============================================

window.addEventListener('beforeprint', () => {
    document.body.classList.remove('dark-theme');
});

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    console.log('Portfolio carregado com sucesso! 🎉');

    // Adicionar classe ao header quando não estiver no topo
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-lg)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
        }
    });
});

// ============================================
// SERVICE WORKER (Para PWA - Opcional)
// ============================================

if ('serviceWorker' in navigator) {
    // Descomente para usar service worker
    // navigator.serviceWorker.register('sw.js').then(registration => {
    //     console.log('Service Worker registrado:', registration);
    // });
}
