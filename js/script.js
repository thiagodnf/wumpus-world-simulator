
var canvas,			// Canvas DOM element
	ctx,
    keys,
	assets,
	env,
	isAlive = true,
	isFinished = false,
    player;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function init(){
	console.log("Welcome to Wumpus World Simulator");

	// Declare the canvas and rendering context
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	assets = [];

	env = new Environment(15, 8, 64, 64);

	player = new Player(env, 0, 0);

    keys = new Keys();

    // Start listening for events
    setEventHandlers();
}

function setEventHandlers(){
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", player.onKeyup, false);

	// Window resize
	resizeCanvas();
}

// Browser window resize
function resizeCanvas(){
	canvas.width = env.width * env.i;
	canvas.height = env.height * env.j;
}

// Keyboard key down
function onKeydown(e) {
	if (player) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (player) {
		keys.onKeyUp(e);
	};
};

function update(){

	if(player.update(keys)){
		player.score -= 10;
	}

	var deadWumpus = player.kill(keys);

	if(deadWumpus){
		player.score += 1000;		
		env.removeWumpus(deadWumpus);
	}

	var capturedGold = player.capture(keys);

	if(capturedGold){
		player.score += 1000;

		env.removeGold(capturedGold);
			
		if(env.golds.length == 0){
			isFinished = true;
		}
	}

	if(env.hasAHole(player) || env.hasAWumpus(player)){
		isAlive = false;
	}

	$("#score").html(player.score);
	$("#arrow").html(player.arrow);
	$("#gold").html(env.golds.length);

	if(!isAlive || isFinished){
		env.showAll= true;
	}

	if(!isAlive){
		$("#game-over").modal("show");
	}
	if(isFinished){
		$("#finished").modal("show");
	}
}

function draw(){
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	env.draw(ctx);

	player.draw(ctx);
}

function animate(){
    update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
}


$(function(){
	init();

	$(".card").width(canvas.width);
	assets['facing_to_up'] = 'img/player_facing_to_up.png';
	assets['facing_to_down'] = 'img/player_facing_to_down.png';
	assets['facing_to_left'] = 'img/player_facing_to_left.png';
	assets['facing_to_right'] = 'img/player_facing_to_right.png';
	assets['wall'] = 'img/wall.png';
	assets['floor'] = 'img/floor.png';
	assets['hole'] = 'img/hole.png';
	assets['wumpus'] = 'img/wumpus.png';
	assets['gold'] = 'img/gold.png';
	assets['floor_gold'] = 'img/floor_gold.png';

	var res = [];

	for(key in assets){
		res.push(assets[key]);
	}

	resources.load(res);

	resources.onReady(function(){
		for(key in assets){
			assets[key] = resources.get(assets[key]);
		}

		animate();
	});
});
