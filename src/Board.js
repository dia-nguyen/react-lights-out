import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import isWithinBounds from "./helper";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      initialBoard.push([]);
      for (let j = 0; j < ncols; j++) {
        initialBoard[i].push(Math.random() < chanceLightStartsOn);
      }
    }
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    return board.every((row) => row.every((cell) => cell === false));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = JSON.parse(JSON.stringify(oldBoard));

      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy); // clicked cell
      isWithinBounds(x - 1, nrows) && flipCell(y, x - 1, boardCopy); // left
      isWithinBounds(x + 1, nrows) && flipCell(y, x + 1, boardCopy); // right
      isWithinBounds(y - 1, ncols) && flipCell(y - 1, x, boardCopy); // top
      isWithinBounds(y + 1, ncols) && flipCell(y + 1, x, boardCopy); // bottom

      // TODO: return the copy
      return boardCopy;
    });
  }

  // make html version of the current board state
  const htmlBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      const coord = `${y}-${x}`;
      row.push(
        <Cell
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    htmlBoard.push(<tr>{row}</tr>);
  }

  // if the game is won, just show a winning msg & render nothing else
  // otherwise, render the  table board
  return hasWon() ? <p>You won!</p> : <table>{htmlBoard}</table>;
}

export default Board;
