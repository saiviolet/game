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
        }
        else if( evt.key === ' ') this.game.player.shootTop();
        console.log(this.game.keys);
      });
      // удалить клавишу из списка, если ее отпустили
      window.addEventListener('keyup', evt => {
        if(this.game.keys.indexOf(evt.key) > -1) {
          //удалить 1 элемент, который начинается с индекса
          this.game.keys.splice(this.game.keys.indexOf(evt.key), 1);
        };
      })

    }

  };
  //обработка лазеров игрока
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.forDelete = false;
    }

    update() {
      this.x += this.speed;
      //если снаряд выходит за границы игры на 80процентов, то снаряд нужно удалить
      if(this.x > this.game.width * .8) this.forDelete = true;
    };
    draw(context) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
    }

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
      this.projectiles = [];
    }
    //метод для перемещения
    update() {
      if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed
      else this.speedY = 0;
      this.y += this.speedY;
      this.projectiles.forEach(pr => {
        pr.update();
      });
      this.projectiles = this.projectiles.filter(pr => !pr.forDelete);
    };
    //метод для рисования
    draw (context) {
      context.fillStyle = 'black';
      context.fillRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach(pr => {
        pr.draw(context);
      });
    };
    //метод для верхней стрельбы
    shootTop () {
      if(this.game.ammo > 0) {
        this.projectiles.push(new Projectile(this.game, this.x, this.y));
        this.game.ammo--;
      }
    }
  };
  //основной для врагов
  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.forDelete = false;
      this.lives = 5;
      this.score = this.lives;
    }
    update() {
      this.x += this.speedX;
      if(this.x + this.width < 0) this.forDelete = true;
    }
    draw(context) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = 'black';
      context.font = '20px Helvetica';
      context.fillText(this.lives, this.x, this.y);
    }
  };

  class Evil1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228 * .3;
      this.height= 169 * .3;
      this.y = Math.random() * (this.game.height * .9 - this.height);
    }
  }
  //фоновые слои
  class Layer {

  };
  // все вместе для анимации фона
  class Background {

  };
  //для пользовательского интерфейса
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Helvetica';
      this.color = 'white';
    }

    draw(context) {
      //отображение счета
      context.font = this.fontSize + 'px ' + this.fontFamily;
      context.fillText('Счет: ' + this.game.score, 20, 40);
      // отображение количества снарядов
      context.fillStyle = this.color;
      for(let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i,50,3,20);
      }
    }
  };
  //ОСНОВНОЙ ИГРОВОЙ КЛАСС
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHAndler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.ammo = 20;
      this.maxAmmo = 40;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 10;
    }
    update(deltaTime) {
      this.player.update();
      if(this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      }
      else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach(enemy => {
        enemy.update();
        if(this.checkCollision(this.player, enemy)) {
          enemy.forDelete = true;
        }
        this.player.projectiles.forEach(pr => {
          if( this.checkCollision(pr, enemy)) {
            enemy.lives--;
            pr.forDelete = true;
            if(enemy.lives <= 0) {
              enemy.forDelete = true;
              this.score += enemy.score;
              if (this.score >= this.winningScore) this.gameOver = true;
            }
          }
        })
      });
      this.enemies = this.enemies.filter(enemy => !enemy.forDelete);
      if(this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      }
      else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach(enemy => {
        enemy.draw(context);
      });
    }
    addEnemy() {
      this.enemies.push(new Evil1(this));
    }
    // ф-ия обработки столкновений 2 объектов
    checkCollision (obj1, obj2) {
      return ( obj1.x < obj2.x + obj2.width &&
              obj1.x + obj1.width > obj2.x &&
              obj1.y < obj2.y + obj2.height &&
              obj1.y + obj1.height > obj2.y )
    }
  }
  //создаем игру класса игра и передаем размеры нашего канваса
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  //анимация
  const animate = (timeStamp) => {
    //очищать предыдущее положение
    ctx.clearRect(0,0, canvas.width, canvas.height);
    // дельта время - разница между метками циклов
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw(ctx);
    //встроенная функция для перерисовки
    requestAnimationFrame(animate);
  }
  animate(0);
})
