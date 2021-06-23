import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tooltip } from '@material-ui/core';
import { faDrumstickBite, faBacon, faSync } from '@fortawesome/free-solid-svg-icons'


function Square(props) {

      return (
        <button className="square" onClick={() => props.onClick()}>
          {props.icon != null ? <FontAwesomeIcon icon={props.icon} /> : ""}
        </button>
      );
 }
  
  class Board extends React.Component {

    renderSquare(i) {
      return <Square icon={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
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
    constructor(props){
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stickIsNext: true,
        stepNumber: 0
      };
    }


    handleClick(i){
      
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      if (current.squares[i] != null){
        return;
      }
      if (calculateWinner(current.squares)) {
          return;
      }
      const squares = current.squares.slice();
      squares[i] = this.state.stickIsNext ? faDrumstickBite : faBacon;
      this.setState({
        history: history.concat([{squares: squares}]), 
        stepNumber: history.length,
        stickIsNext: !this.state.stickIsNext 
      });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      stickisNext: (step % 2) === 0,
    });
  }

    render() {
      let status;
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const gameEnded = current.squares.every(square => square != null);
      let icon;
      if (winner) {
          status = 'The winner is: ';
          icon = <FontAwesomeIcon icon={winner} />;
      } 
      else if (gameEnded){
        status = "It's a tie !"
      }
      else {
          status = 'Next player: ';
          icon = <FontAwesomeIcon icon={this.state.stickIsNext ? faDrumstickBite : faBacon} />
      }

      const moves = history.map((step, move) => {
        const desc = move ?
          move :
          <FontAwesomeIcon icon={faSync}></FontAwesomeIcon>;
        const tooltip = move ? "Go back to move n°" + move : "Go back to start";
        return (
          <li key={move}>
            <Tooltip title={tooltip}>
              <button className="jump-btn" onClick={() => this.jumpTo(move)}>
                {desc}
              </button>
            </Tooltip>
          </li>
        );
      });

      return (
        <div className="container">
          <div className="header">
            T<FontAwesomeIcon icon={faBacon}></FontAwesomeIcon>C <br></br>
            TAC <br></br>
            T<FontAwesomeIcon icon={faDrumstickBite}></FontAwesomeIcon>E
          </div>
          <div className="game">
            <div className="status">
            { status }
            {
              icon
            }
            </div>
            <div className="game-board">
              <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <ol>{moves}</ol>
            </div>
          </div>

        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }