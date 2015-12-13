/**************************************************
** GAME ENVIRONMENT CLASS
**************************************************/

var Environment = function(i, j, width, height) {

    this.i = i;
  	this.j = j;
    this.width = width;
    this.height = height;
    this.showAll = false;
    this.visible = null;
    this.holes = [];
    this.wumpus = [];
    this.golds = [];

    this.init = function(){
        this.visible = this.getMatrix(this.i, this.j);

        this.visible[0][0] = 1;

        this.holes.push({i:2, j:2});
        this.holes.push({i:3, j:2});

        this.wumpus.push({i:2, j:4});

        this.golds.push({i:3, j:3});
    }

	this.randomInitialization = function(){
        this.visible = this.getMatrix(this.i, this.j);
        this.visible[0][0] = 1;
        
		this.golds = this.generateRandomItens(Math.floor(this.i*this.j/16*1));
		this.holes = this.generateRandomItens(Math.floor(this.i*this.j/16*2));
		this.wumpus = this.generateRandomItens(Math.floor(this.i*this.j/16*1));
    };

	this.generateRandomItens = function(max){
		var items = [];

		while(items.length < max){
			var i = this.getRandomIntegerNumber(0, this.i-1);
			var j = this.getRandomIntegerNumber(0, this.j-1);

			if(this.validPosition(i, j)){
				if( ! this.contains(items, i, j)){
					if( ! this.contains(this.golds, i, j)){
						if( ! this.contains(this.holes, i, j)){
							if( ! this.contains(this.wumpus, i, j)){
								items.push({i:i, j:j});
							}
						}
					}
				}
			}
		}

		return items;
	}

	this.validPosition = function(i, j){
		var invalidPos = [
			{i:0, j:0},
			{i:0, j:1},
			{i:1, j:0},
			{i:1, j:1}
		];

		for(var ind = 0; ind < invalidPos.length; ind++){
			if(invalidPos[ind].i == i && invalidPos[ind].j == j){
				return false;
			}
		}

		return true;
	}

	this.getRandomIntegerNumber = function(min, max){
    	return Math.floor((Math.random() * (max)) + min);
    };

    this.getMatrix = function(maxI, maxJ, initialValue){
        var initialValue = initialValue || 0;
        var matrix = new Array(maxI);

        for(var i = 0; i < maxI; i++){
            matrix[i] = new Array(maxJ);
            for(var j = 0; j < maxJ; j++){
                matrix[i][j] = initialValue;
            }
        }

        return matrix;
    };

    this.removeWumpus = function(deadWumpus){
        this.visible[deadWumpus.i][deadWumpus.j] = 1
        this.wumpus.splice(this.wumpus.indexOf(deadWumpus), 1);
    };

    this.removeGold = function(gold){
        this.golds.splice(this.golds.indexOf(gold), 1);
    };

    this.contains = function(array, i, j){
        return this.get(array, i, j) != false;
    }

    this.get = function(array, i, j){
        for(var ind = 0; ind < array.length; ind++){
            if(array[ind].i == i && array[ind].j == j){
                return array[ind];
            }
        }

        return false;
    }

    this.hasAWumpus = function(player){
        for(var i = 0; i < this.wumpus.length; i++){
            if(this.wumpus[i].i == player.getPosI() && this.wumpus[i].j == player.getPosJ()){
                return true;
            }
        }

        return false;
    };

    this.hasAHole = function(player){
        for(var i = 0; i < this.holes.length; i++){
            if(this.holes[i].i == player.getPosI() && this.holes[i].j == player.getPosJ()){
                return true;
            }
        }

        return false;
    };

    this.draw = function(ctx) {
        for(var i = 0; i < this.i; i++){
            for(var j = 0; j < this.j; j++){
                ctx.drawImage(assets['floor'], i*this.width, j*this.height, this.width, this.height);
            }
        }

        for(var i = 0; i < this.holes.length; i++){
            ctx.drawImage(assets['hole'], this.holes[i].i*this.width, this.holes[i].j*this.height, this.width, this.height);
            this.drawText(ctx, "Breeze".toLocaleString(), this.holes[i].i, this.holes[i].j+1, 3);
            this.drawText(ctx, "Breeze".toLocaleString(), this.holes[i].i, this.holes[i].j-1, 3);
            this.drawText(ctx, "Breeze".toLocaleString(), this.holes[i].i+1, this.holes[i].j, 3);
            this.drawText(ctx, "Breeze".toLocaleString(), this.holes[i].i-1, this.holes[i].j, 3);
        }

        for(var i = 0; i < this.wumpus.length; i++){
            ctx.drawImage(assets['wumpus'], this.wumpus[i].i*this.width, this.wumpus[i].j*this.height, this.width, this.height);
            this.drawText(ctx, "Stench".toLocaleString(), this.wumpus[i].i, this.wumpus[i].j+1, 14);
            this.drawText(ctx, "Stench".toLocaleString(), this.wumpus[i].i, this.wumpus[i].j-1, 14);
            this.drawText(ctx, "Stench".toLocaleString(), this.wumpus[i].i+1, this.wumpus[i].j, 14);
            this.drawText(ctx, "Stench".toLocaleString(), this.wumpus[i].i-1, this.wumpus[i].j, 14);
        }

        for(var i = 0; i < this.golds.length; i++){
			ctx.drawImage(assets['floor_gold'], this.golds[i].i*this.width, this.golds[i].j*this.height, this.width, this.height);
            ctx.drawImage(assets['gold'], this.golds[i].i*this.width, this.golds[i].j*this.height, this.width, this.height);
        }

        for(var i = 0; i < this.i; i++){
            for(var j = 0; j < this.j; j++){
                if(this.visible[i][j] == 0 && !this.showAll){
                    ctx.drawImage(assets['wall'], i*this.width, j*this.height, this.width, this.height);
                }
            }
        }

        // Draw horizontal lines
        for(var i = 1; i < this.i; i++){
            this.drawLine(ctx, i*this.width, 0, i*this.height, this.j*this.width);
        }
        // Draw vertical lines
        for(var j = 1; j < this.j; j++){
            this.drawLine(ctx, 0, j*this.height, this.i*this.width, j*this.height);
        }
	};

    this.drawText = function(ctx, text, i, j, offset){
        if(this.contains(this.holes, i, j) || this.contains(this.wumpus, i, j) || this.contains(this.golds, i, j)){
            return;
        }
        ctx.font="12px Verdana";
        ctx.fillStyle = 'white';
        ctx.textBaseline = "hanging";
        ctx.fillText(text, i*this.width+2, j*this.height+offset);
    }

    this.drawLine = function(ctx, x0, y0, x1, y1){
    	ctx.strokeStyle = 'gray';
    	ctx.lineWidth = 1.0;
        //ctx.translate(0.5, 0.5)
    	ctx.moveTo(x0+0.5, y0+0.5);
    	ctx.lineTo(x1+0.5, y1+0.5);
    	ctx.stroke();
    }

    this.randomInitialization();
};
