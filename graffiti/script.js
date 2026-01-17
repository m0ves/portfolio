// ===== ГЛАВНЫЙ КЛАСС ДЛЯ АНИМАЦИЙ =====
class GraffitiAnimation {
    constructor() {
        this.canvas = document.getElementById('graffitiCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.trails = [];
        this.maxParticles = 8; // Мало частиц, как просили
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        // Устанавливаем размер canvas
        this.resize();
        
        // Создаём начальные частицы
        for (let i = 0; i < 3; i++) {
            this.createParticle();
        }
        
        // Добавляем новые частицы с интервалом
        setInterval(() => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }
        }, 3000);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        const colors = [
            {r: 255, g: 71, b: 87},   // Акцентный красный
            {r: 0, g: 212, b: 255},   // Синий
            {r: 157, g: 78, b: 221},  // Фиолетовый
            {r: 255, g: 193, b: 7}    // Золотой
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 100 + 50, // 50-150px
            color: color,
            opacity: 0,
            targetOpacity: 0.2 + Math.random() * 0.3,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            life: 0,
            maxLife: 200 + Math.random() * 300,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            hueShift: 0,
            hueSpeed: (Math.random() - 0.5) * 0.5
        };
        
        this.particles.push(particle);
        return particle;
    }
    
    updateParticle(particle) {
        // Плавное появление
        if (particle.life < 60) {
            particle.opacity += (particle.targetOpacity - particle.opacity) * 0.05;
        }
        
        // Плавное исчезновение в конце жизни
        if (particle.life > particle.maxLife - 60) {
            particle.opacity -= 0.01;
        }
        
        // Обновление позиции
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Медленное изменение направления
        particle.speedX += (Math.random() - 0.5) * 0.01;
        particle.speedY += (Math.random() - 0.5) * 0.01;
        
        // Ограничение скорости
        const maxSpeed = 0.5;
        particle.speedX = Math.max(Math.min(particle.speedX, maxSpeed), -maxSpeed);
        particle.speedY = Math.max(Math.min(particle.speedY, maxSpeed), -maxSpeed);
        
        // Отскок от границ
        if (particle.x < -particle.size || particle.x > this.canvas.width + particle.size) {
            particle.speedX *= -0.8;
        }
        if (particle.y < -particle.size || particle.y > this.canvas.height + particle.size) {
            particle.speedY *= -0.8;
        }
        
        // Вращение
        particle.rotation += particle.rotationSpeed;
        
        // Изменение цвета
        particle.hueShift += particle.hueSpeed;
        
        // Добавление следа
        if (Math.random() > 0.7) {
            this.trails.push({
                x: particle.x,
                y: particle.y,
                size: particle.size * 0.5,
                color: particle.color,
                opacity: particle.opacity * 0.3,
                life: 100
            });
        }
        
        particle.life++;
        
        // Удаляем старые частицы
        if (particle.life > particle.maxLife || particle.opacity <= 0) {
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        // Создаём градиент для размытого эффекта
        const gradient = this.ctx.createRadialGradient(
            0, 0, 0,
            0, 0, particle.size
        );
        
        // Применяем hue shift
        const hue = Math.sin(particle.hueShift) * 30;
        const r = Math.min(255, Math.max(0, particle.color.r + hue));
        const g = Math.min(255, Math.max(0, particle.color.g + hue * 0.5));
        const b = Math.min(255, Math.max(0, particle.color.b - hue * 0.5));
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.filter = `blur(${20 + particle.size * 0.1}px)`;
        
        // Рисуем размытый круг
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    updateTrails() {
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            
            // Уменьшаем размер и прозрачность
            trail.size *= 0.97;
            trail.opacity *= 0.95;
            trail.life--;
            
            // Рисуем след
            this.ctx.save();
            this.ctx.globalAlpha = trail.opacity;
            
            const gradient = this.ctx.createRadialGradient(
                trail.x, trail.y, 0,
                trail.x, trail.y, trail.size
            );
            
            gradient.addColorStop(0, `rgba(${trail.color.r}, ${trail.color.g}, ${trail.color.b}, 0.3)`);
            gradient.addColorStop(1, `rgba(${trail.color.r}, ${trail.color.g}, ${trail.color.b}, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.filter = `blur(${trail.size * 0.5}px)`;
            
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Удаляем старые следы
            if (trail.life <= 0 || trail.size < 1) {
                this.trails.splice(i, 1);
            }
        }
    }
    
    animate() {
        // Очищаем canvas с прозрачным цветом для эффекта шлейфа
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновляем и рисуем следы
        this.updateTrails();
        
        // Обновляем и рисуем частицы
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });
        
        // Добавляем частицу при клике (для тестирования)
        this.canvas.addEventListener('click', (e) => {
            const particle = this.createParticle();
            particle.x = e.clientX;
            particle.y = e.clientY;
        });
    }
}

// ===== УПРАВЛЕНИЕ САЙТОМ =====
class SiteManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Инициализация анимации
        this.animation = new GraffitiAnimation();
        
        // Инициализация компонентов
        this.initNavigation();
        this.initScrollAnimations();
        this.initTickets();
        this.initForm();
        this.initScrollEvents();
        
        console.log('🚀 Сайт "Стенография" загружен!');
    }
    
    initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.innerHTML = navLinks.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Закрываем меню при клике на ссылку
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }
        
        // Добавляем тень при скролле
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Наблюдаем за карточками
        document.querySelectorAll('.feature-card, .artist-card, .ticket-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    initTickets() {
        const ticketButtons = document.querySelectorAll('.select-ticket');
        const ticketSelect = document.getElementById('ticketType');
        
        ticketButtons.forEach(button => {
            button.addEventListener('click', () => {
                const ticketType = button.getAttribute('data-ticket');
                
                // Заполняем форму
                if (ticketSelect) {
                    ticketSelect.value = ticketType;
                }
                
                // Прокручиваем к форме
                const form = document.getElementById('orderForm');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                    
                    // Добавляем анимацию подсветки
                    form.style.animation = 'none';
                    setTimeout(() => {
                        form.style.animation = 'highlight 1s ease';
                    }, 10);
                }
            });
        });
    }
    
    initForm() {
        const form = document.getElementById('ticketForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Простая валидация
                const phone = form.querySelector('input[type="tel"]');
                const phoneValue = phone.value.replace(/\D/g, '');
                
                if (phoneValue.length < 11) {
                    alert('Пожалуйста, введите корректный номер телефока (минимум 11 цифр).');
                    phone.focus();
                    return;
                }
                
                // Показываем состояние отправки
                const submitBtn = form.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
                
                // Имитация отправки
                setTimeout(() => {
                    alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение дня для подтверждения заказа.');
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }
    
    initScrollEvents() {
        // Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== ЗАПУСК САЙТА =====
document.addEventListener('DOMContentLoaded', () => {
    new SiteManager();
});

// ===== CSS ДЛЯ АНИМАЦИЙ =====
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
        50% { box-shadow: 0 0 0 20px rgba(255, 71, 87, 0.2); }
        100% { box-shadow: 0 0 0 40px rgba(255, 71, 87, 0); }
    }
`;
document.head.appendChild(style);

// Анимация галереи при прокрутке
const galleryItems = document.querySelectorAll('.masonry-item');

function animateGallery() {
    galleryItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.85);
        
        if (isVisible) {
            item.style.opacity = '1';
            item.style.transform = item.style.transform.replace(/scale\([^)]*\)/, 'scale(1)');
        }
    });
}

// Инициализация анимации галереи
window.addEventListener('scroll', animateGallery);
window.addEventListener('load', () => {
    // Устанавливаем начальную прозрачность
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Запускаем анимацию
    setTimeout(animateGallery, 100);
});

// Добавляем возможность открытия изображения в полный размер
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        `;
        
        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.alt = img.alt;
        fullImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
        `;
        
        overlay.appendChild(fullImg);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });
});