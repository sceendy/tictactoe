const winner = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8]
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
    this.tictactoe = [];
  }

  init() {
    this.player.setupOptions();

    // setup gameboard
    for (let i = 0; i < 9; i++) {
      let tile = document.createElement('button');
      tile.classList.add('game__piece');
      tile.addEventListener('click', e => this.update(e.target));
      this.gameboard.appendChild(tile);
    }
  }

  update(block) {
    block.textContent = this.player.icon;
    block.disabled = true;
    // random computer move
    const tiles = [...document.getElementsByClassName('game__piece')];
    let emptyTiles = tiles.filter(tile => tile.textContent === '');

    this.checkGame(tiles, emptyTiles);

    // if game finished/won, computer opponent stops
    if (emptyTiles.length !== 0 && this.tictactoe.length !== 3) {
      let opponentMove = Math.floor(Math.random() * (emptyTiles.length - 1));
      emptyTiles[opponentMove].textContent = this.player.opponent;
    }
  }

  checkGame(tiles, empty) {
    if (empty.length < 5) {
      var winnerCoords = [];
      winner.map(coord => {
        // coord = [0, 1, 2];
        // tiles = [[tile element], [tile element], [tile element]]
        winnerCoords = coord.filter(c => {
          if (tiles[c].textContent == this.player.icon
              && winnerCoords.length < 4){
            tiles[c];
          }
        });
      });

      this.tictactoe = winnerCoords;

      this.tictactoe = tiles.filter(tile => {
        return tile.textContent === this.player.icon
      });
      if (this.tictactoe.length == 3) this.win();
    } else if (empty.length == 0) this.draw();
  }

  win() {

    this.tictactoe.map(tile => tile.classList.add('game__piece--success'));
    [...document.getElementsByClassName('game__piece')]
      .forEach(tile => tile.disabled = true);
    this.feedback.textContent = 'You win!';
  }

  draw() {
    this.feedback.textContent = 'Draw! Try Again!';

  }

  reset() {
    // clear board, take user back to icon selection
  }
}
