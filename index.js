const squaresOnTheBoard = 9; // to avoid magic numbers

function initBoard() {
    const board = document.getElementById('board');
    const messageDisplay = document.getElementById('message-display');
    if (!board.classList.contains('set')) { //perhaps unneeded, prevents eventlisteners being added multiple times
        
        const squares = document.getElementsByClassName('position');
        for (let i=0; i<squares.length; i++) { //add a click event listener to all the squares
            squares[i].addEventListener('click', positionClicked);
        }
        messageDisplay.textContent = "Xs Turn" // init the display
        board.classList.add('set'); //prevent another init call from adding more eventlisteners
    }
}

function positionClicked(event) {

    const square = event.target;
    const board = document.getElementById('board');
    const player = currentPlayer(); // make a call to see who is the current player
    const messageDisplay = document.getElementById('message-display');

    if (board.classList.contains('game-over')) { // you have clicked on a completed game...

        resetBoard(); // ...so you must want to restart!

    } else if (isEmpty(square)) { // the game is still in progress and the square is empty
        square.classList.add('filled') // set it to filled
        square.innerText = player; // change the text in that square

        const possibleWins = winClasses(square); // get the list of the groups that square belongs to
        checkForWin(possibleWins, player); // check to see if the player has won of if it is a draw
    }

}

function currentPlayer() {
    const squares = Array.from(document.getElementsByClassName('position'));
    let filledSquareCount = squares.reduce((count, square) => square.classList.contains('filled') ? ++count : count, 0); // count all the squares that are 'filled'
    if (filledSquareCount % 2 === 0) {
        return "x"; // even number means it is Xs turn
    } else {
        return "o"; // odd number means it is Os turn
    }
}

function isEmpty(element) {
    let square = element;
    return !square.classList.contains('filled') // not filled is empty. This function improves readability in positionClicked
}

function winClasses(element) {
    const allWinCheckClasses = ['top', 'middle', 'bottom', 'left', 'center', 'right', 'diagonal-one', 'diagonal-two'] // all the groups a square could belong to
    const currentWinClasses = [];

    for (let i=0; i<allWinCheckClasses.length; i++) {
        if (element.classList.contains(allWinCheckClasses[i])) { // if the element belongs to a class...
            currentWinClasses.push(allWinCheckClasses[i]); // ...push it to the return array
        }
    }

    return currentWinClasses
}

function checkForWin(classes, player) {

    let winFound = false; // assume the game is not over
    let i = 0;

    while (!winFound && i<classes.length) { //loop until all the winGroupClasses have been checked or you find a win

        winFound = checkGroup(classes[i], player);
        i++
    }

    const messageDisplay = document.getElementById('message-display');
    const board = document.getElementById('board')
    if (winFound) { // if you found a win...
        messageDisplay.textContent = `${player.toUpperCase()} WINS!`; // ...fill in the message board...
        board.classList.add('game-over'); // ...and set the board state to a 'game-over'
    } else if (document.getElementsByClassName('filled').length === squaresOnTheBoard){ //no win but full board...
        messageDisplay.textContent = `It's a DRAW!`; //...fill in the message board...
        board.classList.add('game-over'); // ...and set the board state to a 'game-over'
    } else {
        messageDisplay.textContent = `${currentPlayer().toUpperCase()}s Turn` // swap the turn message
    }
}

function checkGroup(className, player) {

    // checks to see if all the elements in a win class (top row, for example) match the player value
    const checkElements = document.getElementsByClassName(className);
    return Array.from(checkElements).reduce((valid, element) => element.innerText === player ? valid : false, true)

}

function resetBoard() {
    const squares = document.getElementsByClassName('position');
    const messageDisplay = document.getElementById('message-display');
    const board = document.getElementById('board');

    for (let i=0; i<squares.length; i++) {
        const square = squares[i];
        square.classList.remove('filled'); // remove the filled class from all the squares
        square.textContent = (''); // remove all the Xs and Os
    }
    messageDisplay.textContent = 'Xs Turn'; // reset the message board
    board.classList.remove('game-over'); // set the board to game in progress
}

initBoard(); //kick off the game when the page loads.