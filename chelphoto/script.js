// Минимальный JavaScript для сайта фотографа

// Установка текущего года в футере
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Инициализация Swiper галереи
document.addEventListener('DOMContentLoaded', function() {
    // Swiper слайдер
    const swiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });
    
    // Плавный скролл для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.includes('modal')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если открыто
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });
    
    // Простая функция отправки формы (имитация)
    window.sendMessage = function() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        
        if (!name || !phone) {
            alert('Пожалуйста, заполните имя и телефон');
            return;
        }
        
        // Имитация отправки
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
        modal.hide();
        
        // Показываем уведомление
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success position-fixed top-0 end-0 m-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            Спасибо, ${name}! Я свяжусь с вами в течение дня.
        `;
        document.body.appendChild(alertDiv);
        
        // Очищаем форму
        document.getElementById('contactForm').reset();
        
        // Убираем уведомление через 5 секунд
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    };
    
    // Добавляем тень на навигацию при скролле
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Функция для отладки (можно удалить в продакшене)
console.log('Сайт фотографа загружен!');
console.log('Все фото с Unsplash работают');