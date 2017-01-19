;(function() {
	var CANVAS_WIDTH = 300;
	var CANVAS_HEIGHT = 500;
	var BOX_WIDTH = 50
	var BOX_HEIGHT = 100;
	var SPEED = 2;
	var TIME_LOOP = 10;
	var CAR_LIMIT = 3;
	var OFFSET = 25;


	function Box() {
		var that = this;
		this.x =0;
		this.y =0;
		this.element;
		this.dx = 0;
		this.dy = 1;
		this.init = function() {
			this.element = document.createElement('div');
			this.element.setAttribute('class','box');
			this.container = document.getElementById('container');
			this.container.appendChild(this.element);

		}

		this.setBoxPosition = function(randX,randY) {
			this.x = randX * 100 + 25;
			this.y = -50;
		}

		this.draw = function() {
			this.element.style.top = this.y + 'px';
			this.element.style.left = this.x + 'px';
		}

		this.removeElement = function() {
			this.element.remove();
		}
	}

	function GameAnimation() {
		var boxes = [];
		var car = new Box();
		var that = this;
		var score = 0;
		var counter = 0;
		var moveBoxIntervalID;
		var gameStop = false;
		var scoreBoard = document.getElementById('score');
		var gameStatus = document.getElementById('gameStatus');


		this.init = function() {
			score = 0;
			counter = 0;
			carGen();
			moveBoxIntervalID = setInterval(moveBoxes,TIME_LOOP);
			scoreBoard.innerHTML = "Score: 0";
			gameStatus.innerHTML = "";
		}

		var stopGame= function(){
			clearInterval(moveBoxIntervalID);
			gameStop = true;
			gameStatus.innerHTML = "<h4>Game Over!!</h4> Press any key to continue";
		}

		function carGen() {
			car.y =(CANVAS_HEIGHT - BOX_HEIGHT);
			car.x = (CANVAS_WIDTH  - BOX_WIDTH)/ 2;
			car.init();
			car.element.setAttribute('class','mycar');
			car.draw();
			document.addEventListener("keydown", keyDownHandler, false);
		}

		var createBoxes = function() {
			var box = new Box();
			var randX = getRandom(0, 2);
			var randY = 0;
			box.setBoxPosition(randX,randY);
			box.init();
			box.draw();
			boxes.push(box);
		}

		var moveBoxes = function() {
			counter++;
			if((counter % 200) == 0) {
				createBoxes();
			}
			moveBackground();
			for(var i =0; i< boxes.length; i++) {
				var box = boxes[i];
				box.y += box.dy;
				checkWallCollision(box);
				carCollision(i);
				box.draw();
			}
		}

		var checkWallCollision = function(box) {
			if(box.y >= (CANVAS_HEIGHT)){
				score++;
				scoreBoard.innerHTML="Score: " + score;
				box.removeElement();
				boxes.shift();
				
			}
		}
			
		var carCollision = function(position) {
			for(var i = 0; i < boxes.length; i++) {
				if(i != position) {
					if ((car.x < boxes[i].x + BOX_WIDTH) && (car.x + BOX_WIDTH > boxes[i].x) &&
				   	(car.y < boxes[i].y + BOX_HEIGHT) && (BOX_HEIGHT + car.y > boxes[i].y)) {
						//car collision
						stopGame();
					}
				}
			}
		}

		function keyDownHandler(e) {
		  if(e.keyCode == 39 && gameStop != true){
		  	//go right
		    if(car.x < CANVAS_WIDTH - BOX_WIDTH - OFFSET){
		    	car.x += 100;
		    }
		  }
		  else if (e.keyCode == 37 && gameStop != true ){
		  	//go left
		  	if(car.x > OFFSET) {
			  	car.x -=100;	
		  	}
		  }
		  if(gameStop && e.keyCode != 0) {
		  	console.log("game stopped keyevent success");
		  	gameStop = false;
		  	car.removeElement();
		  	for(var i =0; i < boxes.length; i++) {
		  		boxes[i].removeElement();
		  	}
		  	score = 0;
		  	gameStatus.innerHTML = "Score: " + score;
		  	delete(car);
		  	delete(score);
		  	delete(gameObj);
		  	gameObj = new GameAnimation().init();
		  }
		  console.log(e.keyCode);
		  car.draw();
		}
		
	}

	var moveBackground = function() {
		var background = document.getElementById('background');
		var margin = parseInt(getComputedStyle(background).getPropertyValue('margin-top'));
		console.log(margin);
		margin = margin + 1;
		background.style.marginTop = margin + 'px';
		console.log('moving background');
	}

	function getRandom(min, max) {
    	return Math.floor(Math.random() * (max - min + 1) + min);
	}	

	var gameObj = new GameAnimation().init();
})();