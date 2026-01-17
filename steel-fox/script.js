// Галерея тренеров с горизонтальным скроллом
document.addEventListener('DOMContentLoaded', function() {
    const trainersContainer = document.querySelector('.trainers-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    // Прокрутка галереи
    if (trainersContainer && prevBtn && nextBtn) {
        const scrollAmount = 320; // Примерная ширина карточки + отступ
        
        prevBtn.addEventListener('click', () => {
            trainersContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            updateActiveDot();
        });
        
        nextBtn.addEventListener('click', () => {
            trainersContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            updateActiveDot();
        });
        
        // Обновление активных точек при скролле
        trainersContainer.addEventListener('scroll', updateActiveDot);
        
        // Клик по точкам для перехода к соответствующей карточке
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                scrollToCard(index);
            });
        });
        
        // Функция для обновления активной точки
        function updateActiveDot() {
            const scrollPosition = trainersContainer.scrollLeft;
            const cardWidth = trainersContainer.querySelector('.trainer-card').offsetWidth + 30; // + отступ
            const activeIndex = Math.round(scrollPosition / cardWidth);
            
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Функция для прокрутки к определенной карточке
        function scrollToCard(index) {
            const cardWidth = trainersContainer.querySelector('.trainer-card').offsetWidth + 30;
            trainersContainer.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }
        
        // Инициализация активной точки
        updateActiveDot();
    }
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрытие мобильного меню после клика
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Обработка формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь обычно отправка формы на сервер
            // Для демонстрации просто покажем сообщение
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ЗАЯВКА ОТПРАВЛЕНА';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }
    
    // Изменение навигации при скролле
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(13, 27, 42, 0.98)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.backgroundColor = 'rgba(13, 27, 42, 0.95)';
            navbar.style.padding = '15px 0';
        }
    });
});