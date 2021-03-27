
var canvas,			// Canvas DOM element
	ctx,
    keys,
	assets,
	env,
	isAlive = true,
	isFinished = false,
	currentLanguage = "en-US",
	language,
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

	language = [];

	env = new Environment(15, 8, 64, 64);

	player = new Player(env, 0, 0);

    keys = new Keys();

    // Start listening for events
    setEventHandlers();
}

function setEventHandlers(){
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

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
	// if (player) {
	// 	keys.onKeyDown(e);
	// };
	keys.onKeyDown(e);

	animate();
};

// Keyboard key up
function onKeyup(e) {
	// if (player) {
	// 	keys.onKeyUp(e);
	// };
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

	if(!isAlive){
		$("#modal-game-over").modal("show");
	}
	if(isFinished){
		$("#modal-win").modal("show");
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
	//window.requestAnimFrame(animate);
}

function getURL(){
	var url = "{";

	url += "\"holes\":" + encodeToArray(env.holes) + ",";
	url += "\"golds\":" + encodeToArray(env.golds) + ",";
	url += "\"wumpus\":" + encodeToArray(env.wumpus) + "}";

	return "#" + btoa(url);
}

function encodeToArray(array){
	return JSON.stringify(array);
}

function getLink(){
	return window.location.href+getURL();
}

function loadEnvironment(hash){
	var link = atob(hash.replace('#', ''));

	var obj = $.parseJSON(link);

	env.holes = obj.holes;
	env.golds = obj.golds;
	env.wumpus = obj.wumpus;

	animate();
}

function getCurrentLanguage(){
    return localStorage.getItem("wws-locale") || 'en_us';
}

function changeLanguageTo(locale){

    console.log("Changing language to", locale);

    // Define the current language
    $.i18n().locale = locale;
    // Change all text on the webpage
    $('body').i18n();
    // We need to refresh the bootstrap-select
    $('#select-language').selectpicker('refresh');
    // Save the current locate on the locale storage to reload
    localStorage.setItem("wws-locale", locale);
}

$(function(){

	init();

    $.i18n.debug = true;

    $.i18n({
        locale: getCurrentLanguage()
    });

    $.i18n().load( {
        en_us: 'i18n/en_us.json',
        pt_br: 'i18n/pt_br.json'
    }).done( function() {
        changeLanguageTo($.i18n().locale);
    });

    $('#select-language').selectpicker({
        dropdownAlignRight: true
    });

    $('#select-language').selectpicker('val', $.i18n().locale);

	$("#select-language").change(function(event){
        event.preventDefault();
        changeLanguageTo($(this).val());
	});

    $(".btn-restart").click(function(){
		location.reload();
	});

	$(".card").width(canvas.width);
	$(".card-content").height(canvas.height);

	$('#modal-share').on('shown.bs.modal', function () {
		$('#textarea-link').text(getLink());
	});

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

		var hash = window.location.hash;

		if(hash != null && hash != ""){
			loadEnvironment(hash);
		}

		animate();
	});
});
