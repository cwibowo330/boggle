const pieces = Array.from(document.querySelectorAll('.piece'));
const directions = document.querySelector('#directions span');
const potentialWord = document.querySelector('#word');
const submitWord = document.querySelector('#submit_word');
const totalPoints = document.querySelector('#points span');
const usedWordsDisplay = document.querySelector('#used-words span');

// valid boggleWords (used a boggle site as a reference to find these combos based on existing abcde grid)
const boggleWords = [
    'deeded',
    'deed',
    'baba',
    'abba',
    'abb',
    'aba',
    'dee',
    'baa'
]

// keeps track of existing used words
const usedWords = [];

let lastPiece = {
    row: '',
    column: '',
    letter: '',
    idx: 1,
    target: '',
    points: 0
}

let currentPiece = {
    row: '',
    column: '',
    letter: '',
    idx: 1,
    target: '',
    points: 0
}

let word = '';
let points = 0;
let doubleScore = false;

pieces.forEach(piece => {
    // listens for each piece on the board to be clicked
    piece.addEventListener('click', (e) => {
        e.preventDefault();
        currentPiece.row = e.target.parentNode.dataset.row;
        currentPiece.column = e.target.dataset.column;
        currentPiece.letter = e.target.innerHTML;
        currentPiece.target = e.target;

        // calculate points for currentPiece
        if (currentPiece.target.classList.contains('purple')) {
            // purple gives 3 points
            currentPiece.points = 3;
        } else if (currentPiece.target.classList.contains('blue')) {
            // blue gives 2 points
            currentPiece.points = 2;
        } else if (currentPiece.target.classList.contains('grey')) {
            // grey gives 1 point but doubles score if its a valid word
            currentPiece.points = 1;
            doubleScore = true;
        } else {
            // everything else is 1 point
            currentPiece.points = 1;
        }

        // checks if currentPiece has been previously selected
        let isAlreadySelected = currentPiece.target.classList.contains('selected');

        if (word.length === 0) {
            // when word length === 0, it sets the idx = 1, and sets the innerHTML to diagonal since the next item will be an even number (2)
            currentPiece.idx = 1;
            updateWord_LastPiece_CurrentClass(currentPiece);
            directions.innerHTML = 'Pick Adjacent Diagonal Piece';
        } else if (word.length > 0) {
            // when word length > 0: 
            // we start comparing the lastPosition to the currentPosition
            // depending on the idx being even or odd 
            // we determine if this should be a diagonal or horizontal / vertical
            currentPiece.idx = word.length + 1;
            directions.innerHTML = ((currentPiece.idx % 2) === 0) ? 'Pick Adjacent Horizontal or Vertical Piece' : 'Pick Adjacent Diagonal Piece';
            
            // checks if currentPosition is diagonal to lastPiece
            let isNotLastPieceRow = (currentPiece.row !== lastPiece.row);
            let isNotLastPieceColumn = (currentPiece.column !== lastPiece.column);
            let isCurrentPieceDiagonal = isNotLastPieceRow && isNotLastPieceColumn;
            
            // checks to see if the currentPosition is within the lastPosition's boundaries
            let rowWithinBoundaries = ((lastPiece.row - currentPiece.row) <= 1) && ((lastPiece.row - currentPiece.row) >= -1);
            let columnWithinBoundaries = ((lastPiece.column - currentPiece.column <= 1) && (lastPiece.column - currentPiece.column) >= -1);
            const withinLastPieceBoundaries = rowWithinBoundaries && columnWithinBoundaries;

            if ((currentPiece.idx % 2) === 0) {
                // handle even choices: making sure currentPiece is diagonal
                if (isCurrentPieceDiagonal && withinLastPieceBoundaries && !isAlreadySelected) {
                    updateWord_LastPiece_CurrentClass(currentPiece);
                } else if (!isCurrentPieceDiagonal){
                    directions.innerHTML = 'Pick Adjacent Diagonal Piece';
                    alert('INVALID: CHOOSE A DIAGONAL PIECE');    
                }
            } else if (((currentPiece.idx % 2) !== 0)){
                // handle odd choices: make sure currentPiece is up down left or right of lastPiece (or not diagonal)
                if (!isCurrentPieceDiagonal && withinLastPieceBoundaries && !isAlreadySelected) {
                    updateWord_LastPiece_CurrentClass(currentPiece);
                } else {
                    directions.innerHTML = 'Pick Adjacent Horizontal or Vertical Piece';
                    alert('INVALID: CHOOSE A VERTICAL OR HORIZONTAL PIECE');
                }
            }
        }

        // updates the potential word display
        potentialWord.innerHTML = word;
    });
});

function updateWord_LastPiece_CurrentClass(currentPiece){
    word += currentPiece.letter;
    lastPiece = Object.assign({}, currentPiece);
    currentPiece.target.classList.add('selected');
    points += currentPiece.points;
}

function clearBoard() {
    pieces.forEach( piece => {
        piece.classList.remove('selected')
    });
}

function resetGame(){
    points = 0;
    potentialWord.innerHTML = '';
    doubleScore = false;
    word = '';
}

// listens for a submitted word
// and validates this word against boggleWords 
// also makes sure that this word has not yet been used
submitWord.addEventListener('click', () => {
    if (boggleWords.includes(potentialWord.innerHTML) && !usedWords.includes(potentialWord.innerHTML)) {
        let currentPoints = parseInt(totalPoints.innerHTML);
        if (doubleScore) {
            usedWords.push(potentialWord.innerHTML);
            totalPoints.innerHTML = currentPoints + (points * 2);
            resetGame();
            clearBoard();
        } else {
            usedWords.push(potentialWord.innerHTML);
            totalPoints.innerHTML = currentPoints + points;
            resetGame();
            clearBoard();
        }
        usedWordsDisplay.innerHTML = usedWords.join(' , ');
    } else {
        alert('INVALID WORD OR ALREADY USED');
        resetGame();
        clearBoard();
    }
})