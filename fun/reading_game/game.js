let currentWordIndex = 0;
let audioContext = null;
let gameWords = [];
let firstTryCorrect = 0;
let firstTryTotal = 0;
let madeWrongGuess = false;
let answerCheckedThisDrag = false;

// DOM elements
const emojiDisplay = document.querySelector('.emoji-display');
const wordDisplay = document.querySelector('.word-display');
const letterChoices = document.querySelector('.letter-choices');
const progressDots = document.querySelector('.progress-dots');
const celebration = document.querySelector('.celebration');
const playAgainBtn = document.querySelector('.play-again-btn');
const soundBtn = document.querySelector('.sound-btn');
const scoreDisplay = document.querySelector('.score-display');
const scoreBarCorrect = document.querySelector('.score-bar-correct');
const scoreBarWrong = document.querySelector('.score-bar-wrong');

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
    const cardColors = [
        'linear-gradient(135deg, #ff8a80, #ff5252)',
        'linear-gradient(135deg, #82b1ff, #448aff)',
        'linear-gradient(135deg, #b9f6ca, #69f0ae)',
        'linear-gradient(135deg, #ffe57f, #ffd740)'
    ];
    letterChoices.innerHTML = '';
    allLetters.forEach((letter, i) => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.textContent = letter;
        card.dataset.letter = letter;
        card.style.background = cardColors[i];
        letterChoices.appendChild(card);
    });

    initProgressDots();
    setupDragDrop();
}

function setupDragDrop() {
    const cards = document.querySelectorAll('.letter-card');
    const dropZone = document.querySelector('.drop-zone');

    let activeCard = null;
    let startRect, offsetX, offsetY;

    function onPointerDown(e) {
        initAudio();
        e.preventDefault();
        activeCard = e.currentTarget;
        startRect = activeCard.getBoundingClientRect();
        const cx = e.clientX || e.touches[0].clientX;
        const cy = e.clientY || e.touches[0].clientY;
        offsetX = cx - startRect.left;
        offsetY = cy - startRect.top;

        activeCard.classList.add('dragging');
        activeCard.style.zIndex = '1000';
        activeCard.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
        if (!activeCard) return;
        e.preventDefault();
        const x = e.clientX ?? e.touches?.[0]?.clientX;
        const y = e.clientY ?? e.touches?.[0]?.clientY;
        if (x == null || y == null) return;
        const dx = x - (startRect.left + offsetX);
        const dy = y - (startRect.top + offsetY);
        activeCard.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;

        activeCard.style.pointerEvents = 'none';
        const elementBelow = document.elementFromPoint(x, y);
        activeCard.style.pointerEvents = '';
        if (elementBelow?.classList.contains('drop-zone')) {
            dropZone.classList.add('drag-over');
        } else {
            dropZone.classList.remove('drag-over');
        }
    }

    function onPointerUp(e) {
        if (!activeCard) return;
        const y = e.clientY ?? e.changedTouches?.[0]?.clientY;
        const card = activeCard;
        dropZone.classList.remove('drag-over');

        const draggedUp = y != null && y < startRect.top;
        const isCorrect = draggedUp && card.dataset.letter === dropZone.dataset.correct;

        card.classList.remove('dragging');
        card.style.transform = '';
        card.style.zIndex = '';

        if (isCorrect) {
            card.style.display = 'none';
        }

        if (draggedUp) {
            checkAnswer(card.dataset.letter, dropZone, card);
        }

        activeCard = null;
    }

    cards.forEach(card => {
        card.draggable = false;
        card.addEventListener('pointerdown', onPointerDown);
        card.addEventListener('touchstart', onPointerDown, { passive: false });
    });

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('touchend', onPointerUp);
}

function updateScore() {
    const wrong = firstTryTotal - firstTryCorrect;
    const percent = firstTryTotal === 0 ? 100 : Math.round((firstTryCorrect / firstTryTotal) * 100);
    const correctPct = firstTryTotal === 0 ? 0 : (firstTryCorrect / firstTryTotal) * 100;
    const wrongPct = firstTryTotal === 0 ? 0 : (wrong / firstTryTotal) * 100;
    scoreBarCorrect.style.width = correctPct + '%';
    scoreBarWrong.style.width = wrongPct + '%';
    scoreDisplay.textContent = `${firstTryCorrect} correct, ${wrong} missed (${percent}%)`;
}

function spawnConfetti() {
    const container = document.querySelector('.game-container');
    const rect = container.getBoundingClientRect();
    const colors = ['#ff5252', '#ffb74d', '#66bb6a', '#42a5f5', '#ab47bc', '#ffd740'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        const angle = Math.random() * 2 * Math.PI;
        const dist = 80 + Math.random() * 120;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = '50%';
        p.style.top = '45%';
        p.style.animationDuration = (1.2 + Math.random() * 0.6) + 's';
        container.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}

function checkAnswer(letter, dropZone, card) {
    const correct = dropZone.dataset.correct;
    if (letter === correct) {
        playCorrectSound();
        spawnConfetti();
        dropZone.textContent = letter;
        dropZone.classList.add('correct');
        firstTryTotal++;
        if (!madeWrongGuess) firstTryCorrect++;
        updateScore();
        setTimeout(() => {
            madeWrongGuess = false;
            currentWordIndex++;
            if (currentWordIndex >= gameWords.length) {
                showCelebration();
            } else {
                loadWord();
            }
        }, 1500);
    } else {
        playWrongSound();
        madeWrongGuess = true;
        dropZone.classList.add('incorrect');
        setTimeout(() => dropZone.classList.remove('incorrect'), 400);
    }
}

function showCelebration() {
    celebration.classList.remove('hidden');
}

function startGame() {
    currentWordIndex = 0;
    firstTryCorrect = 0;
    firstTryTotal = 0;
    madeWrongGuess = false;
    gameWords = shuffleArray(WORDS);
    celebration.classList.add('hidden');
    updateScore();
    loadWord();
}

playAgainBtn.addEventListener('click', startGame);
soundBtn.addEventListener('click', speakWord);

startGame();
