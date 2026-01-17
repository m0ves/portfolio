// Основная логика корзины для Alpine.js
function cartComponent() {
    return {
        // Состояние корзины
        cart: [],
        orderData: { name: '', phone: '' },
        isSubmitting: false,
        cartOpen: false,
        
        // Инициализация (загрузка из localStorage)
        initCart() {
            const saved = localStorage.getItem('pretzel_cart');
            if (saved) this.cart = JSON.parse(saved);
        },
        
        // Вычисляемые свойства
        get cartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + item.total, 0);
        },
        
        // Методы
        addToCart(product) {
            const existing = this.cart.find(item => item.id === product.id);
            
            if (existing) {
                existing.quantity++;
                existing.total = existing.quantity * existing.price;
            } else {
                this.cart.push({
                    ...product,
                    quantity: 1,
                    total: product.price
                });
            }
            
            this.saveCart();
            this.showAddedEffect(product.id);
        },
        
        updateQuantity(productId, change) {
            const item = this.cart.find(item => item.id === productId);
            if (!item) return;
            
            const newQty = item.quantity + change;
            if (newQty < 1) return;
            
            item.quantity = newQty;
            item.total = item.quantity * item.price;
            this.saveCart();
        },
        
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
        },
        
        saveCart() {
            localStorage.setItem('pretzel_cart', JSON.stringify(this.cart));
        },
        
        async submitOrder() {
            if (this.cartCount === 0) return;
            
            this.isSubmitting = true;
            
            // Имитация отправки на сервер
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // В реальном проекте здесь был бы fetch
            console.log('Order submitted:', {
                items: this.cart,
                total: this.cartTotal,
                customer: this.orderData
            });
            
            // Показываем уведомление
            this.showNotification('Заказ оформлен! Мы скоро с вами свяжемся.', 'success');
            
            // Очищаем корзину
            this.cart = [];
            this.orderData = { name: '', phone: '' };
            this.saveCart();
            
            this.isSubmitting = false;
            
            // Закрываем модалку через 1.5 секунды
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
                if (modal) modal.hide();
            }, 1500);
        },
        
        // Вспомогательные методы
        showAddedEffect(productId) {
            // Находим кнопку и добавляем класс анимации
            const button = document.querySelector(`[data-product-id="${productId}"]`);
            if (button) {
                button.classList.add('just-added');
                setTimeout(() => button.classList.remove('just-added'), 300);
            }
            
            // Показываем всплывающее уведомление
            this.showNotification('Товар добавлен в корзину!', 'success');
        },
        
        showNotification(message, type = 'info') {
            // Используем Bootstrap тосты для уведомлений
            const toast = document.createElement('div');
            toast.className = `toast align-items-center text-bg-${type} border-0`;
            toast.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;
            
            const container = document.querySelector('.toast-container') || (() => {
                const div = document.createElement('div');
                div.className = 'toast-container position-fixed top-0 end-0 p-3';
                document.body.appendChild(div);
                return div;
            })();
            
            container.appendChild(toast);
            const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
            bsToast.show();
            
            toast.addEventListener('hidden.bs.toast', () => toast.remove());
        }
    };
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем Bootstrap компоненты
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => new bootstrap.Modal(modal));
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимации при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card, .feature, .review-card').forEach(el => {
        observer.observe(el);
    });
});