
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // Clear "future history" if any moves are made after moving backwards to a previous move
    const current = history[history.length - 1];
    // console.log(history);
    // console.log(current);
    const squares = current.squares.slice(); // Copy current squares array to new squares array
    // console.log(squares);
    if (calculateWinner(squares) || squares[i]) {
      // If game is over or square is already clicked, dont do anything.
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]), // Add move to game history
      stepNumber: history.length, // Give number for the step
      xIsNext: !this.state.xIsNext // Flip player turn
    });
  }

  // Jump to certain point in game history
  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares); // Winner is either "X" or "O"

    // View previous moves, game history
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = <b>Winner: {winner} </b>; // Show winner
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O"); // Show next player
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Calculate winner of the game
function calculateWinner(squares) {
  const lines = [
    // different possibilities for a 3x3 game board
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Loop through all the possibilities
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If same player mark (X or O) is in three squares vertically, horizontally or in cross-axis, return that mark as winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

