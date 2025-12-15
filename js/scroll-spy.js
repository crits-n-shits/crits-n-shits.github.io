document.addEventListener("DOMContentLoaded", function() {
    // 1. Получаем все секции, на которые ссылается меню
    const sections = document.querySelectorAll("section[id]");

    // 2. Получаем все ссылки в навигации
    const navLinks = document.querySelectorAll(".sticky-nav a");

    // Функция, которая проверяет, какая секция находится в поле видимости
    function updateActiveLink() {
        // Текущая позиция прокрутки + половина высоты окна для более точного определения центральной секции
        let scrollY = window.scrollY + window.innerHeight / 2.5;

        sections.forEach(currentSection => {
            const sectionTop = currentSection.offsetTop;
            const sectionHeight = currentSection.offsetHeight;
            const sectionId = currentSection.getAttribute("id");

            // Проверяем, находится ли текущая секция в области видимости
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Сначала удаляем класс 'active' со всех ссылок
                navLinks.forEach(link => link.classList.remove("active"));
                
                // Находим нужную ссылку и добавляем класс 'active'
                const activeLink = document.querySelector(`.sticky-nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }

    // Инициализация при загрузке страницы
    updateActiveLink();

    // Добавляем обработчик события прокрутки
    window.addEventListener("scroll", updateActiveLink);
    
    // Также можно добавить плавный скролл для якорных ссылок (опционально)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // -60 для учета высоты фиксированной навигации
                    behavior: 'smooth'
                });
            }
        });
    });
});
