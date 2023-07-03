/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable prefer-const */
/* eslint-disable no-useless-return */

// Gameboard module: stores game state

const Gameboard = (() => {
  let gameboardState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  // Factory function to create players
  const PlayerFactory = (piece) => ({
    piece,
  });
  // players created from PlayerFactory function
  const playerX = PlayerFactory('X');
  const playerO = PlayerFactory('O');
  let currentPlayer = playerX.piece;
  // winnerCombinations: Contains all possible winning combinations of the game.
  const winnerCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return {
    gameboardState,
    gameActive,
    playerX,
    playerO,
    currentPlayer,
    winnerCombinations,
  };
})();

// displayFunctions: Module containing display related functions
const displayFunctions = (() => {
  const winnerMessage = () => `Player ${Gameboard.currentPlayer} won!`;
  const tieMessage = () => `It's a tie!`;
  const displayDOM = document.querySelector('.display');
  const currentPlayerTurn = () => {
    displayDOM.innerHTML = `${Gameboard.currentPlayer}'s turn`;
  };
  return {
    winnerMessage,
    tieMessage,
    currentPlayerTurn,
    displayDOM,
  };
})();

// gameLogicFunctions: Module used as a namespace for game logic functions.

const gameLogicFunctions = (() => {
  // savePieceState: It stores the played piece on the gameboardState array (by using clickedSquareIndex parameter) and displays the piece on the corresponding square of the board (by using clickedSquare parameter). It will be invoked later on the checkAndDisplayPiece function.
  function savePieceState(clickedSquare, clickedSquareIndex) {
    Gameboard.gameboardState[clickedSquareIndex] = Gameboard.currentPlayer;
    clickedSquare.innerHTML = Gameboard.currentPlayer;
  }

  // changePlayer: switches turns between players by updating the value of the Gameboard.currentPlayer variable through ternary operators. It will be invoked later on the determineFinalResult function.
  function changePlayer() {
    Gameboard.currentPlayer =
      Gameboard.currentPlayer === 'X'
        ? Gameboard.playerO.piece
        : Gameboard.playerX.piece;
    displayFunctions.currentPlayerTurn();
  }

  //
  function determineFinalResult() {
    // roundWon: if set to true, it breaks the for loop that evaluates the Gameboard.gameboardState array against Gameboard.winnerCombinations[i]; it sets the value of Gameboard.gameActive = false an enables the winnerMessage function.
    let roundWon = false;

    for (let i = 0; i <= 7; i++) {
      // winCondition: variable to store the current index of the iteration over Gameboard.winnerCombinations array.
      const winCondition = Gameboard.winnerCombinations[i];

      // a, b, c: variables to store each individual index of each possible winning combination array inside Gameboard.winnerCombinations array.
      let a = Gameboard.gameboardState[winCondition[0]];
      let b = Gameboard.gameboardState[winCondition[1]];
      let c = Gameboard.gameboardState[winCondition[2]];

      // for each clicked square, the loop evaluates winCondition variable against Gameboard.gameboardState. If any of the Gameboard.gameboardState is empty (''), the loop jumps to the next winning combination.
      if (a === '' || b === '' || c === '') {
        continue;
      }

      // If (and only if) a,b,c have the same value, it means that one of the players (X or O) has matched a winning combination. In that case, the loop stops.
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }
    // if the value of roundWon is set to true during the for loop iteration, the displayDOM value will display the winnerMessage function from the displayFunctions module. It will set gameActive as false, and then it will exit the function.
    if (roundWon) {
      displayFunctions.displayDOM.innerHTML = displayFunctions.winnerMessage();
      Gameboard.gameActive = false;
      return;
    }

    // the roundTie variable stores the completely fill gameboardState array. If true, the displayDOM value will display the tieMessage function from the displayFunctions module. It will set gameActive as false, and then it will exit the function.
    let roundTie = !Gameboard.gameboardState.includes('');
    if (roundTie) {
      displayFunctions.displayDOM.innerHTML = displayFunctions.tieMessage();
      Gameboard.gameActive = false;
      return;
    }
    // Once the validation has been completed, and neither roundWon or roundTie are true, the changePlayer function is invoked the switch players.
    changePlayer();
  }

  // checkAndDisplayPiece: This function will be invoked in the global scope, as the callback of the event when any of the squares of the gameboard is clicked.
  function checkAndDisplayPiece(clickedSquareEvent) {
    // clickedSquare: this variable stores the reference to the square in which the event was dispatched.
    const clickedSquare = clickedSquareEvent.target;
    // clickedSquareIndex: this variable stores the 'data-square-index' of the square that was clicked.
    const clickedSquareIndex = parseInt(
      clickedSquare.getAttribute('data-square-index')
    );

    // The restraint conditions for the checkAndDisplayPiece function to execute: it evaluates the clickedsquareIndex against the gameboardState array index to verify if the spot is already taken; it also verifies if the gameActive variable is true. If either case is true, the function returns.
    if (
      Gameboard.gameboardState[clickedSquareIndex] !== '' ||
      !Gameboard.gameActive
    ) {
      return;
    }
    // savePieceState is invoked, taking as arguments the clickedSquare and clickedSquareIndex declared above.
    savePieceState(clickedSquare, clickedSquareIndex);
    // determineFinalResult: The validation function is invoked.
    determineFinalResult();
  }

  // restartGame: This function will be invoked in the global scope to reset the game, as the callback of the event when the restart button is clicked. It will reset the default initial state of the game, emptying all the squares.
  function restartGame() {
    Gameboard.gameActive = true;
    Gameboard.currentPlayer = Gameboard.playerX.piece;
    Gameboard.gameboardState = ['', '', '', '', '', '', '', '', ''];
    displayFunctions.currentPlayerTurn();
    document
      .querySelectorAll('.square')
      .forEach((square) => (square.innerHTML = ''));
  }

  return {
    checkAndDisplayPiece,
    restartGame,
  };
})();

// gameInterface: Module used as namespace for the functions startGame and resetGame, which are the functions that directly interact with the user.
const gameInterface = (() => {
  const startGame = () => {
    document
      .querySelectorAll('.square')
      .forEach((square) =>
        square.addEventListener(
          'click',
          gameLogicFunctions.checkAndDisplayPiece
        )
      );
  };
  const resetGame = () => {
    document
      .querySelector('.restart-btn')
      .addEventListener('click', gameLogicFunctions.restartGame);
  };
  return {
    startGame,
    resetGame,
  };
})();

displayFunctions.currentPlayerTurn();
gameInterface.startGame();
gameInterface.resetGame();
