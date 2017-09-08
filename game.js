const winner = [
  [ [0, 0], [0, 1], [0, 2] ],
  [ [1, 0], [1, 1], [1, 2] ],
  [ [2, 0], [2, 1], [2, 2] ],
  [ [0, 0], [1, 0], [2, 0] ],
  [ [0, 1], [1, 1], [2, 1] ],
  [ [0, 2], [1, 2], [2, 2] ],
  [ [0, 0], [1, 1], [2, 2] ],
  [ [0, 2], [1, 1], [2, 0] ]
];

class Player {
  constructor() {
    this.stageOne = document.getElementsByClassName('stage-1')[0];
    this.stageTwo = document.getElementsByClassName('stage-2')[0];
    this.icon = '';
    this.opponent = '';
  }

  setupOptions() {
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
      btn.addEventListener('click', e => this.setIcon(e.target.textContent));
    });
  }

  setIcon(icon) {
    this.stageOne.style.display = 'none';
    this.stageTwo.style.display = 'block';
    this.icon = icon;
    this.opponent = icon == 'x' ? 'o' : 'x';
  }
}

class Game {
  constructor() {
    this.gameboard = document.getElementById('game__board');
    this.feedback = document.getElementsByClassName('game__message')[0];
    this.player = new Player();
    this.tictactoe = [[, , ,], [, , ,], [, , ,]];
    this.moves = 0;
  }

  init() {
    this.player.setupOptions();

    // setup game
    for (let i = 0; i < 9; i++) {
      let tile = document.createElement('button');
      tile.classList.add('game__piece');
      tile.setAttribute('coords', this.assignCoords(i));
      tile.addEventListener('click', e => {
        const coords = e.target.getAttribute('coords');
        this.update(coords);
      });
      this.gameboard.appendChild(tile);
    }
  }

  assignCoords(index) {
    const coords = index.toString(3);
    return `${(coords.length === 1) ? `0${coords}` : `${coords}`}`;
  }

  update(tileCoords) {
    this.moves++;
    const x = tileCoords.charAt(0);
    const y = tileCoords.charAt(1);
    const tile = document.querySelectorAll(`[coords='${tileCoords}']`)[0];

    this.tictactoe[x][y] = this.player.icon;
    tile.textContent = this.player.icon;
    tile.disabled = true;

    if (this.moves > 4) this.checkGame();

    if (!this.feedback.textContent) {
      let emptyTiles = (() => {
        let empty = new Array();
        this.tictactoe.map(row => {
          let x = this.tictactoe.indexOf(row);
          for (let [y, tile] of row.entries()) {
            if (!tile) empty.push([x, y])
          }
        });
        return empty;
      })();

      let opponentMove = Math.floor(Math.random() * emptyTiles.length);
      let oppX = emptyTiles[opponentMove][0];
      let oppY = emptyTiles[opponentMove][1];
      let tile = document.querySelectorAll(`[coords='${oppX}${oppY}']`)[0];
      this.tictactoe[oppX][oppY] = this.player.opponent;
      tile.textContent = this.player.opponent;
      tile.disabled = true;
      this.moves++;
      if (this.moves > 4) this.checkGame();
    }
  }

  checkGame() {
    // compare rows to winning rows
    let rowArrays = winner.map(winRow => {
      return winRow.map(coord => [this.tictactoe[coord[0]][coord[1]], coord]);
    });

    let gameWinner = rowArrays.filter(row => {
      let match = row.every((val, i, arr) => val[0] == arr[0][0]);
      if (match && !!row[0][0]) { return row }
    });
    if (gameWinner.length !== 0) {
      this.win(gameWinner);
    } else if (this.moves === 9) this.draw();
  }

  win(winner) {
    let player = winner[0][0][0];
    let tiles = [...document.getElementsByClassName('game__piece')];

    winner[0].map(info => {
      for (let value of info) {
        if (Array.isArray(value)) {
          let tile = document.querySelectorAll(`[coords='${value[0]}${value[1]}']`)[0];
          let color = player == this.player.icon ? 'success' : 'lose';
          tile.classList.add('game__piece--' + color);
        }
      }
    });

    tiles.forEach(tile => tile.disabled = true);
    this.feedback.textContent = player == this.player.icon ? 'You win!' : 'You lose!';
  }

  draw() {
    this.feedback.textContent = 'Draw! Try again!';
    this.reset();
  }

  /*reset() {
    let tiles = [...document.getElementsByClassName('game__piece')];
    setTimeout(() => {
      tiles.map(tile => {
        tile.textContent = '';
        tile.removeAttribute('disabled');
      }, 3000);
    });
  }*/
}
