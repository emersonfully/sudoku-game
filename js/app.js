document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark')
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode)

    //change mobile statusBar color
    document.querySelector('meta[name="theme-color"').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff')
});

// Innitial Value


// Screens
const startScreen = document.querySelector('#start-screen');
const gameScreen = document.querySelector('#game-screen');
const pauseScreen = document.querySelector('#pause-screen')

// ----------------------------------------------------------------------------------
const cells = document.querySelectorAll('.main-grid-cell')

const nameInput = document.querySelector('#input-name');

const playerName = document.querySelector('#player-name');
const gameLevel = document.querySelector('#game-level');
const gameTime = document.querySelector('#game-time')

let level_index = 0;
let level = CONSTANT.LEVEL[level_index]

let timer = null
let pause = false
let seconds = 0
// ----------------------------------------------------------------------------------

document.querySelector('#btn-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index]
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        startGame()
    } else {
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500);
    }
});


// pause the game
document.querySelector('#pause-btn').addEventListener('click', () => {
    pauseScreen.classList.add('active');
    pause = true
});

// resume the game
document.querySelector('#btn-resume').addEventListener('click', () => {
    pauseScreen.classList.remove('active');
    pause = false
})

document.querySelector('#btn-new-game').addEventListener('click', () => {
    returnToStartScreen()
})

const getGameInfo = () => JSON.parse(localStorage.getItem('game'))

// add spaces for each 9 cells

const initGameGrid = () => {
    let index = 0;

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row === 2 || row === 5) cells[index].style.marginBottom = '10px';
        if (col === 2 || col === 5) cells[index].style.marginRight = '10px';

        index++
    }
}
// ----------------------------------------------------------------------------------

const setPlayerName = (name) => localStorage.setItem('playerName', name);
const getPlayerName = () => localStorage.getItem('playerName');

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8)

const startGame = () => {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    playerName.innerHTML = nameInput.value.trim();
    setPlayerName(nameInput.value.trim())

    gameLevel.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    seconds = 0

    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1;
            gameTime.innerHTML = showTime(seconds)
        }
    }, 1000);
}

const returnToStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    startScreen.classList.add('active');
    gameScreen.classList.remove('active');
    pauseScreen.classList.remove('active')
}

const init = () => {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkmode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"').setAttribute('content', darkmode ? '#1a1a2e' : '#fff');

    const game = getGameInfo()

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'nome';

    initGameGrid()

    if (getPlayerName()) {
        nameInput.value = getPlayerName()
    } else {
        nameInput.focus()
    }
}

init()