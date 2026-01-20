let currentWordIndex = 0;
let audioContext = null;
let gameWords = [];

// DOM elements
const emojiDisplay = document.querySelector('.emoji-display');
const wordDisplay = document.querySelector('.word-display');
const letterChoices = document.querySelector('.letter-choices');
const progressDots = document.querySelector('.progress-dots');
const celebration = document.querySelector('.celebration');
const playAgainBtn = document.querySelector('.play-again-btn');
const soundBtn = document.querySelector('.sound-btn');

// Initialize audio on first interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playCorrectSound() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, audioContext.currentTime);
    osc.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.4);
}

function playWrongSound() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioContext.currentTime);
    gain.gain.setValueAtTime(0.15, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.25);
}

function speakWord() {
    const word = gameWords[currentWordIndex].word;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}

function initProgressDots() {
    progressDots.innerHTML = '';
    for (let i = 0; i < gameWords.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i < currentWordIndex) dot.classList.add('completed');
        if (i === currentWordIndex) dot.classList.add('current');
        progressDots.appendChild(dot);
    }
}

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];

function getDistractors(correctLetter) {
    const isVowel = VOWELS.includes(correctLetter);
    const pool = isVowel ? VOWELS : CONSONANTS;
    const available = pool.filter(l => l !== correctLetter);
    return shuffleArray(available).slice(0, 3);
}

function loadWord() {
    const wordData = gameWords[currentWordIndex];
    const word = wordData.word.toUpperCase();
    const missingIndex = Math.floor(Math.random() * word.length);
    const correctLetter = word[missingIndex];

    emojiDisplay.textContent = wordData.emoji;

    wordDisplay.innerHTML = '';
    for (let i = 0; i < word.length; i++) {
        if (i === missingIndex) {
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.dataset.correct = correctLetter;
            wordDisplay.appendChild(dropZone);
        } else {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = word[i];
            wordDisplay.appendChild(letterSpan);
        }
    }

    const distractors = getDistractors(correctLetter);
    const allLetters = shuffleArray([correctLetter, ...distractors]);
    letterChoices.innerHTML = '';
    allLetters.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.textContent = letter;
        card.draggable = true;
        card.dataset.letter = letter;
        letterChoices.appendChild(card);
    });

    initProgressDots();
    setupDragDrop();
}

function setupDragDrop() {
    const cards = document.querySelectorAll('.letter-card');
    const dropZone = document.querySelector('.drop-zone');

    cards.forEach(card => {
        card.addEventListener('dragstart', e => {
            initAudio();
            e.dataTransfer.setData('text/plain', card.dataset.letter);
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));

        // Touch support
        let touchClone = null;
        card.addEventListener('touchstart', e => {
            initAudio();
            e.preventDefault();
            card.classList.add('dragging');
            touchClone = card.cloneNode(true);
            touchClone.style.position = 'fixed';
            touchClone.style.pointerEvents = 'none';
            touchClone.style.zIndex = '1000';
            touchClone.style.opacity = '0.8';
            document.body.appendChild(touchClone);
            const touch = e.touches[0];
            touchClone.style.left = (touch.clientX - 35) + 'px';
            touchClone.style.top = (touch.clientY - 35) + 'px';
        });

        card.addEventListener('touchmove', e => {
            e.preventDefault();
            if (!touchClone) return;
            const touch = e.touches[0];
            touchClone.style.left = (touch.clientX - 35) + 'px';
            touchClone.style.top = (touch.clientY - 35) + 'px';
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            if (elementBelow?.classList.contains('drop-zone')) {
                dropZone.classList.add('drag-over');
            } else {
                dropZone.classList.remove('drag-over');
            }
        });

        card.addEventListener('touchend', e => {
            e.preventDefault();
            card.classList.remove('dragging');
            if (touchClone) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                touchClone.remove();
                touchClone = null;
                dropZone.classList.remove('drag-over');
                if (elementBelow?.classList.contains('drop-zone')) {
                    checkAnswer(card.dataset.letter, dropZone);
                }
            }
        });
    });

    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const letter = e.dataTransfer.getData('text/plain');
        checkAnswer(letter, dropZone);
    });
}

function checkAnswer(letter, dropZone) {
    const correct = dropZone.dataset.correct;
    if (letter === correct) {
        playCorrectSound();
        dropZone.textContent = letter;
        dropZone.classList.add('correct');
        setTimeout(() => {
            currentWordIndex++;
            if (currentWordIndex >= gameWords.length) {
                showCelebration();
            } else {
                loadWord();
            }
        }, 800);
    } else {
        playWrongSound();
        dropZone.classList.add('incorrect');
        setTimeout(() => dropZone.classList.remove('incorrect'), 400);
    }
}

function showCelebration() {
    celebration.classList.remove('hidden');
}

function startGame() {
    currentWordIndex = 0;
    gameWords = shuffleArray(WORDS);
    celebration.classList.add('hidden');
    loadWord();
}

playAgainBtn.addEventListener('click', startGame);
soundBtn.addEventListener('click', speakWord);

startGame();
