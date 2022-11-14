import './index.css';
window.addEventListener('load', () => {
  //настройки для canvas
  const canvas = document.querySelector('canvas');
  //контекст
  const ctx = canvas.getContext('2d');
  canvas.width = 1500;
  canvas.height = 500;
  //обработка вводов
  class InputHAndler {
    constructor(game) {
      this.game = game;
      //прослушиваем нажатие на клавиши
      window.addEventListener('keydown', evt => {
        if(((evt.key === 'ArrowUp') || (evt.key === 'ArrowDown')) && this.game.keys.indexOf(evt.key) === -1) {
          this.game.keys.push(evt.key);
        };
        console.log(this.game.keys);
      });
      // удалить клавишу из списка, если ее отпустили
      window.addEventListener('keyup', evt => {
        if(this.game.keys.indexOf(evt.key) > -1) {
          //удалить 1 элемент, который начинается с индекса
          this.game.keys.splice(this.game.keys.indexOf(evt.key), 1);
        };
        console.log(this.game.keys);
      })

    }

  };
  //обработка лазеров игрока
  class Projectile {

  };
  // болты от врагов
  class Particle {

  };
  // управление главным героем
  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxSpeed = 2;
    }
    //метод для перемещения
    update() {
      if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed
      else this.speedY = 0;
      this.y += this.speedY;
    }
    //метод для рисования
    draw (context) {
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  //основной для врагов
  class Enemy {

  };
  //фоновые слои
  class Layer {

  };
  // все вместе для анимации фона
  class Background {

  };
  //для пользовательского интерфейса
  class UI {

  };
  //ОСНОВНОЙ ИГРОВОЙ КЛАСС
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHAndler(this);
      this.keys = [];
    }
    update() {
      this.player.update();
    }
    draw(context) {
      this.player.draw(context)
    }
  }
  //создаем игру класса игра и передаем размеры нашего канваса
  const game = new Game(canvas.width, canvas.height);
  //анимация
  const animate = () => {
    //очищать предыдущее положение
    ctx.clearRect(0,0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    //встроенная функция для перерисовки
    requestAnimationFrame(animate);
  }
  animate();
})
