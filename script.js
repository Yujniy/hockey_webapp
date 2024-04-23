function setThemeParams(theme) {
  document.documentElement.style.setProperty('--text-color', theme.text_color || '#ffffff');
  document.documentElement.style.setProperty('--button-color', theme.button_color || '#007bff');
  document.documentElement.style.setProperty('--button-text-color', theme.button_text_color || '#ffffff');
}

if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.onEvent('themeChanged', setThemeParams);
  setThemeParams(Telegram.WebApp.themeParams);
} else {
  setThemeParams({});
}

document.querySelector('.button').addEventListener('click', function() {
  const elements = document.querySelectorAll('h1, .sticker, .button');
  fadeOutElements(elements, showNewContent);
});

function fadeOutElements(elements, callback) {
  elements.forEach(function(element) {
    element.classList.add('animate__animated', 'animate__fadeOut');

    element.addEventListener('animationend', function() {
      element.style.display = 'none';

      if (Array.from(elements).every(el => el.style.display === 'none')) {
        callback();
      }
    });
  });
}

function showNewContent() {
  const newContent = document.getElementById('newContent');
  newContent.style.display = 'flex';

  const newElements = newContent.querySelectorAll('.animate__animated');
  newElements.forEach(element => {
    element.classList.add('animate__fadeIn');
  });

  const characterCounts = newContent.querySelectorAll('.character-count');
  characterCounts.forEach(count => {
    count.classList.add('animate__fadeIn');
  });
}

const teamNameInputs = document.querySelectorAll('.team-name');
teamNameInputs.forEach(input => {
  const characterCount = input.nextElementSibling;
  const oldTens = characterCount.querySelector('.old-tens');
  const newTens = characterCount.querySelector('.new-tens');
  const oldOnes = characterCount.querySelector('.old-ones');
  const newOnes = characterCount.querySelector('.new-ones');

  input.addEventListener('input', function() {
    const remainingCharacters = 20 - this.value.length;
    const tensValue = Math.floor(remainingCharacters / 10);
    const onesValue = remainingCharacters % 10;

    newTens.textContent = tensValue > 0 ? tensValue : '';
    newOnes.textContent = onesValue;

    if (oldTens.textContent !== newTens.textContent) {
      const isIncreasing = remainingCharacters > parseInt(oldTens.textContent + oldOnes.textContent);
      const animationClass = isIncreasing ? 'animate__fadeInUp' : 'animate__fadeInDown';
      const reverseAnimationClass = isIncreasing ? 'animate__fadeOutUp' : 'animate__fadeOutDown';

      oldTens.classList.add('animate__animated', reverseAnimationClass);
      newTens.classList.add('animate__animated', animationClass);

      oldTens.addEventListener('animationend', function() {
        oldTens.textContent = newTens.textContent;
        oldTens.classList.remove('animate__animated', reverseAnimationClass);
        newTens.classList.remove('animate__animated', animationClass);
      });
    }

    if (oldOnes.textContent !== onesValue.toString()) {
      const isIncreasing = remainingCharacters > parseInt(oldTens.textContent + oldOnes.textContent);
      const animationClass = isIncreasing ? 'animate__fadeInUp' : 'animate__fadeInDown';
      const reverseAnimationClass = isIncreasing ? 'animate__fadeOutUp' : 'animate__fadeOutDown';

      oldOnes.classList.add('animate__animated', reverseAnimationClass);
      newOnes.classList.add('animate__animated', animationClass);

      oldOnes.addEventListener('animationend', function() {
        oldOnes.textContent = onesValue;
        oldOnes.classList.remove('animate__animated', reverseAnimationClass);
        newOnes.classList.remove('animate__animated', animationClass);
      });
    }
  });
});

const nextButton = document.querySelector('.next-button');
let blueTeam = '';
let redTeam = '';

teamNameInputs.forEach((input, index) => {
  input.addEventListener('input', function() {
    if (index === 0) {
      blueTeam = this.value.trim();
    } else {
      redTeam = this.value.trim();
    }
    checkInputs();
  });
});

function checkInputs() {
  const allInputsFilled = Array.from(teamNameInputs).every(input => input.value.trim() !== '');
  
  if (allInputsFilled) {
    nextButton.classList.remove('hidden');
    nextButton.classList.add('animate__fadeIn');
  } else {
    nextButton.classList.add('hidden');
    nextButton.classList.remove('animate__fadeIn');
  }
}

teamNameInputs.forEach(input => {
  input.addEventListener('input', checkInputs);
});

nextButton.addEventListener('click', function() {
  const newContentElements = document.querySelectorAll('#newContent > *');
  fadeOutElements(newContentElements, showThirdScreen);
});

function showThirdScreen() {
  const thirdScreen = document.getElementById('thirdScreen');
  thirdScreen.style.display = 'flex';

  const thirdScreenElements = thirdScreen.querySelectorAll('.animate__animated');
  thirdScreenElements.forEach(element => {
    element.classList.add('animate__fadeIn');
  });
}

const timeSlider = document.getElementById('timeSlider');
const timeValue = document.getElementById('timeValue');
const breakTimeSlider = document.getElementById('breakTimeSlider');
const breakTimeValue = document.getElementById('breakTimeValue');
const startButton = document.querySelector('.start-button');

let selectedTime = 5; // Значение по умолчанию для времени периода игры
let selectedBreakTime = 5; // Значение по умолчанию для времени перерыва

timeSlider.addEventListener('input', function() {
  selectedTime = parseInt(this.value);
  timeValue.textContent = selectedTime + ' минут';
});

breakTimeSlider.addEventListener('input', function() {
  selectedBreakTime = parseInt(this.value);
  breakTimeValue.textContent = selectedBreakTime + ' минут';
});

startButton.addEventListener('click', function() {
  // Переход к следующему экрану с выбранным временем периода игры и перерыва
  console.log('Выбранное время периода игры:', selectedTime);
  console.log('Выбранное время перерыва:', selectedBreakTime);
});

// Код для предотвращения отключения экрана телефона (только для мобильных устройств)
let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock is active');
    
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null && wakeLock.released === false) {
    await wakeLock.release();
    wakeLock = null;
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    requestWakeLock();
  } else {
    releaseWakeLock();
  }
}

if (window.innerWidth <= 768) {
  // Запрос блокировки отключения экрана при загрузке страницы на мобильных устройствах
  window.addEventListener('load', requestWakeLock);

  // Освобождение блокировки при сворачивании страницы на мобильных устройствах
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Освобождение блокировки при закрытии страницы на мобильных устройствах
  window.addEventListener('beforeunload', releaseWakeLock);
}