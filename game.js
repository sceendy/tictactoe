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
  }

  init() {
    this.player.setupOptions();

    // setup gameboard
    for (let i = 0; i < 9; i++) {
      let tile = document.createElement('div');
      tile.classList.add('game__piece');
      tile.addEventListener('click', e => this.update(e.target));
      this.gameboard.appendChild(tile);
    }
  }

  update(block) {
    block.textContent = this.player.icon;

    // random computer move
    const tiles = [...document.getElementsByClassName('game__piece')];
    let emptyTiles = tiles.filter(tile => tile.textContent === '');
    let opponentMove = Math.floor(Math.random() * (emptyTiles.length - 1));
    emptyTiles[opponentMove].textContent = this.player.opponent;

    // check possible win
    if (emptyTiles.length < 5) {
      let tictactoe = tiles.filter(tile =>
        // return elements from winning row
        tile.textContent === this.player.icon
      );

      if (tictactoe.length == 3) this.win(tictactoe);
    } else if (emptyTiles.length == 0) this.draw();
  }

  win(tictactoe) {
    tictactoe.map(tile => tile.classList.add('game__piece--success'));
    this.feedback.textContent = 'You win!';
  }

  draw() {
    this.feedback.textContent = 'Draw! Try Again!';

  }

  reset() {
    // clear board, take user back to icon selection
  }
}
