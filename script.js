// ==============================================
// КОНФИГУРАЦИЯ БЭКЕНДА
// ==============================================
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzDcBsmxmuZuBn7TdYOw1eJW9fycR4XqzJUjwopEmiwM2EfBMY5IBI2rvJtZhqDyuNlpQ/exec',
    DEBUG: true
};

async function submitToGoogleSheets(formData) {
    try {
        const urlEncodedData = new URLSearchParams();
        for (let [key, value] of formData.entries()) {
            urlEncodedData.append(key, value);
        }
        
        if (CONFIG.DEBUG) {
            console.log('Отправка данных:', Object.fromEntries(formData.entries()));
        }
        
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlEncodedData.toString()
        });
        
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
    console.log('DOM загружен');
    
    // ===== ПЛЕЕР =====
    const audioPlayer = document.getElementById('wedding-audio');
    const playBtn = document.getElementById('play-btn');
    const muteBtn = document.getElementById('mute-btn');
    const progressBar = document.querySelector('.progress');
    
    if (audioPlayer && playBtn) {
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
        
        if (muteBtn) {
            muteBtn.addEventListener('click', function() {
                if (audioPlayer.muted) {
                    audioPlayer.muted = false;
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                } else {
                    audioPlayer.muted = true;
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                }
            });
        }
        
        if (audioPlayer && progressBar) {
            audioPlayer.addEventListener('timeupdate', function() {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.style.width = `${progress}%`;
            });
        }
    }
    
    // ===== СЧЕТЧИК =====
    function updateCountdown() {
        const weddingDate = new Date('2026-05-16T15:30:00').getTime();
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        
        if (timeLeft < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // ===== КАЛЕНДАРЬ =====
    function generateCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        const weddingDate = new Date('2026-05-16');
        const currentMonth = weddingDate.getMonth();
        const currentYear = weddingDate.getFullYear();
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'day other-month';
            day.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(day);
        }
        
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.className = 'day';
            day.textContent = i;
            
            if (i === 16) {
                day.className = 'day wedding-day';
                day.title = 'День нашей свадьбы!';
            }
            
            calendarDays.appendChild(day);
        }
        
        const totalCells = 42;
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
    
    // ===== ВЫБОР ГОСТЕЙ =====
    const guestButtons = document.querySelectorAll('.guest-btn');
    const guestsInput = document.getElementById('guests');
    
    if (guestButtons.length > 0 && guestsInput) {
        guestButtons.forEach(button => {
            button.addEventListener('click', function() {
                guestButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                guestsInput.value = this.getAttribute('data-value');
            });
        });
        
        guestButtons[0].classList.add('active');
    }
    
    // ===== ФОРМА =====
    const rsvpForm = document.getElementById('rsvp-form');
    console.log('Форма для обработки:', rsvpForm);
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Форма отправлена!');
            
            const submitBtn = this.querySelector('.submit-btn');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'ОТПРАВКА...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData();
                formData.append('name', document.getElementById('name')?.value || '');
                
                const attendance = document.querySelector('input[name="attendance"]:checked');
                formData.append('attendance', attendance ? attendance.value : 'no');
                
                formData.append('guests', document.getElementById('guests')?.value || '1');
                formData.append('message', document.getElementById('message')?.value || '');
                
                const result = await submitToGoogleSheets(formData);
                
                if (result.success) {
                    const thankyouModal = document.getElementById('thankyou-modal');
                    if (thankyouModal) {
                        thankyouModal.style.display = 'flex';
                    } else {
                        alert('Спасибо! Ваш ответ отправлен.');
                    }
                    
                    rsvpForm.reset();
                    
                    if (guestButtons.length > 0 && guestsInput) {
                        guestButtons.forEach(btn => btn.classList.remove('active'));
                        guestButtons[0].classList.add('active');
                        guestsInput.value = "1";
                    }
                } else {
                    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
                }
                
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
                
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    } else {
        console.error('ФОРМА НЕ НАЙДЕНА! Проверьте id="rsvp-form" в HTML');
    }
    
    // ===== МОДАЛЬНЫЕ ОКНА (безопасно) =====
    const orderModal = document.getElementById('order-modal');
    const thankyouModal = document.getElementById('thankyou-modal');
    
    // Закрытие модальных окон
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (orderModal) orderModal.style.display = 'none';
            if (thankyouModal) thankyouModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (orderModal && event.target === orderModal) {
            orderModal.style.display = 'none';
        }
        if (thankyouModal && event.target === thankyouModal) {
            thankyouModal.style.display = 'none';
        }
    });
    
    // ===== ДИАГНОСТИКА =====
    setTimeout(function() {
        console.log('Проверка элементов:');
        console.log('- Форма:', document.getElementById('rsvp-form'));
        console.log('- Кнопка:', document.querySelector('.submit-btn'));
        console.log('- Поле name:', document.getElementById('name'));
    }, 1000);
});
