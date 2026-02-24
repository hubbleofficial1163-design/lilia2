// ==============================================
// КОНФИГУРАЦИЯ БЭКЕНДА
// ==============================================
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzDcBsmxmuZuBn7TdYOw1eJW9fycR4XqzJUjwopEmiwM2EfBMY5IBI2rvJtZhqDyuNlpQ/exec', // ЗАМЕНИТЕ НА ВАШ URL
    DEBUG: true
};

// Функция отправки данных в Google Sheets
async function submitToGoogleSheets(formData) {
    try {
        // Преобразуем FormData в URL-encoded строку
        const urlEncodedData = new URLSearchParams();
        for (let [key, value] of formData.entries()) {
            urlEncodedData.append(key, value);
        }
        
        if (CONFIG.DEBUG) {
            console.log('Отправка данных:', Object.fromEntries(formData.entries()));
        }
        
        // Отправляем POST запрос к Apps Script
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Важно для работы с Apps Script
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlEncodedData.toString()
        });
        
        // Из-за mode: 'no-cors' мы не можем прочитать ответ
        // Просто считаем, что все хорошо
        return { success: true };
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return { 
            success: false, 
            error: 'Ошибка соединения с сервером'
        };
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Инициализация плеера
    const audioPlayer = document.getElementById('wedding-audio');
    const playBtn = document.getElementById('play-btn');
    const muteBtn = document.getElementById('mute-btn');
    const progressBar = document.querySelector('.progress');
    
    let isPlaying = false;
    
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
    
    muteBtn.addEventListener('click', function() {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            audioPlayer.muted = true;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Обновление прогресс-бара
    audioPlayer.addEventListener('timeupdate', function() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });
    
    // Счетчик дней до свадьбы
    function updateCountdown() {
        const weddingDate = new Date('2026-05-16T15:30:00').getTime();
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Календарь
    function generateCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        const weddingDate = new Date('2026-05-16');
        const currentMonth = weddingDate.getMonth();
        const currentYear = weddingDate.getFullYear();
        
        // Первый день месяца
        const firstDay = new Date(currentYear, currentMonth, 1);
        // Последний день месяца
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // День недели первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
        let firstDayOfWeek = firstDay.getDay();
        // Преобразуем к формату 0-понедельник, 6-воскресенье
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Дни предыдущего месяца
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        
        // Заполняем дни предыдущего месяца
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'day other-month';
            day.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(day);
        }
        
        // Дни текущего месяца
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.className = 'day';
            day.textContent = i;
            
            // Проверяем, является ли этот день днем свадьбы
            if (i === 16) {
                day.className = 'day wedding-day';
                day.title = 'День нашей свадьбы!';
            }
            
            calendarDays.appendChild(day);
        }
        
        // Дни следующего месяца
        const totalCells = 42; // 6 строк по 7 дней
        const daysSoFar = firstDayOfWeek + lastDay.getDate();
        const nextMonthDays = totalCells - daysSoFar;
        
        for (let i = 1; i <= nextMonthDays; i++) {
            const day = document.createElement('div');
            day.className = 'day other-month';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    generateCalendar();
    
    // Управление выбором количества гостей
    const guestButtons = document.querySelectorAll('.guest-btn');
    const guestsInput = document.getElementById('guests');
    
    guestButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            guestButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Устанавливаем значение в скрытое поле
            guestsInput.value = this.getAttribute('data-value');
        });
    });
    
    // Активируем первую кнопку по умолчанию
    if (guestButtons.length > 0) {
        guestButtons[0].classList.add('active');
    }
    
    // Модальные окна
    const orderModal = document.getElementById('order-modal');
    const thankyouModal = document.getElementById('thankyou-modal');
    const orderBtn = document.getElementById('order-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    

    
    orderBtn.addEventListener('click', function() {
        orderModal.style.display = 'flex';
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            orderModal.style.display = 'none';
            thankyouModal.style.display = 'none';
        });
    });
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            orderModal.style.display = 'none';
        }
        if (event.target === thankyouModal) {
            thankyouModal.style.display = 'none';
        }
    });

    
    
    // Обработка формы анкеты
    const rsvpForm = document.getElementById('rsvp-form');

    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Блокируем кнопку отправки
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'ОТПРАВКА...';
        submitBtn.disabled = true;
        
        try {
            // Собираем данные формы
            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            
            const attendance = document.querySelector('input[name="attendance"]:checked');
            formData.append('attendance', attendance ? attendance.value : 'no');
            
            formData.append('guests', document.getElementById('guests').value);
            formData.append('message', document.getElementById('message').value);
            
            // Отправляем в Google Sheets
            const result = await submitToGoogleSheets(formData);
            
            if (result.success) {
                // Показываем success модальное окно
                thankyouModal.style.display = 'flex';
                
                // Сброс формы
                rsvpForm.reset();
                
                // Сброс кнопок гостей
                guestButtons.forEach(btn => btn.classList.remove('active'));
                if (guestButtons.length > 0) {
                    guestButtons[0].classList.add('active');
                }
                guestsInput.value = "1";
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с организатором.');
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
            
        } finally {
            // Разблокируем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Автозапуск музыки (опционально, можно закомментировать)
    // audioPlayer.play();
    // playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    // isPlaying = true;
});