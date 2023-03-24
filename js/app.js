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

const numberInputs = document.querySelectorAll('.number')

const playerName = document.querySelector('#player-name');
const gameLevel = document.querySelector('#game-level');
const gameTime = document.querySelector('#game-time')

let level_index = 0;
let level = CONSTANT.LEVEL[level_index]

let timer = null
let pause = false
let seconds = 0

let su = undefined
let su_answer = undefined

let selected_cell = -1;
// ----------------------------------------------------------------------------------

document.querySelector('#btn-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index]
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        initSudoku()
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

document.querySelector('#delete-btn').addEventListener('click', () => {
    cells[selected_cell].innerHTML = ''
    cells[selected_cell].setAttribute('data-value', 0)

    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE)
    let col = selected_cell % CONSTANT.GRID_SIZE

    su_answer[row][col] = 0

    removeErr()
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

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = ''
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const initSudoku = () => {
    // clear the puzzle
    clearSudoku()
    resetBg()
    // generate the sudoku puzzle
    su = sudokuGen(level)
    su_answer = [...su.question]

    console.table(su_answer)

    // show sudoku
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE)
        let col = i % CONSTANT.GRID_SIZE

        cells[i].setAttribute('data-value', su.question[row][col])

        if (su.question[row][col] !== 0) {
            cells[i].classList.add('filled')
            cells[i].innerHTML = su.question[row][col]
        }
    }
}

const hoverBg = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover')
        }
    }

    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while (index - step >= 9 * row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
    while (index + step < 9 * row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
}

const resetBg = () => {
    cells.forEach(e => e.classList.remove('hover'));
}

const checkErr = (value) => {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err')
            cell.classList.add('cell-err')

            setTimeout(() => {
                cell.classList.remove('cell-err')
            }, 500);
        }
    }

    let index = selected_cell

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected')) addErr(cell)
        }
    }

    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= 9 * row) {
        addErr(cells[index - step])
        step += 1;
    }

    step = 1;
    while (index + step < 9 * row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
}

const removeErr = () => cells.forEach(e => e.classList.remove('err'))

const saveGameInfo = () => {
    let game = {
        level: level_index,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }
    localStorage.setItem('game', JSON.stringify(game))
}

const removeGameInfo = () => {
    localStorage.removeItem('game')
    document.querySelector('#btn-continue').style.display = 'none'
}

const isGameWin = () => sudokuCheck(su_answer)

const showResult = () => {
    clearInterval(timer)
    alert('win')
    // show result screen
}

const initNumberInputEvent = () => {
    numberInputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!cells[selected_cell].classList.contains('filled')) {
                cells[selected_cell].innerHTML = index + 1
                cells[selected_cell].setAttribute('data-value', index + 1)

                // add to answer

                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE)
                let col = selected_cell % CONSTANT.GRID_SIZE
                su_answer[row][col] = index + 1

                // save game
                saveGameInfo()
                // ------------------------------------------------

                removeErr()
                checkErr(index + 1)
                cells[selected_cell].classList.add('zoom-in')
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in')
                }, 500);

                // check game win
                if (isGameWin()) {
                    removeGameInfo()
                    showRE
                }
                // -----------------------------------------------
            }
        })
    })
}

const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'))

                selected_cell = index
                e.classList.remove('err')
                e.classList.add('selected')
                resetBg()
                hoverBg(index)
            }
        })
    })
}

const startGame = () => {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    playerName.innerHTML = nameInput.value.trim();
    setPlayerName(nameInput.value.trim())

    gameLevel.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    seconds = 0
    showTime(seconds);

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
    initCellsEvent()
    initNumberInputEvent()


    if (getPlayerName()) {
        nameInput.value = getPlayerName()
    } else {
        nameInput.focus()
    }
}

init()

// 1:33:00