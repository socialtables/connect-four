/**
 * Connect Four Game
 * Extensive Jquery 2.0 usage 
 * @param grid -the empty 7x6 2D array obtanined from the server
 * @param gameId - the unique id of a game
 */


$(function() {
	var grid;
	var gameId;
	var savedGames={};
	$(".board").hide();
	// winner is added to DOM
	var declareWinner= function(player)
	{
		$(".players").hide();
		return $(".info-box").text(player.toUpperCase()+" Player Won!");
	};
	// updates player's turn
	var updateInfoBox=function(color){
		return $(".info-box").text(color+"'s turn,click "+color+" button");
	}

	/**
 	* The game board is represented by a 7x6 2D array.
 	* Empty array is populated either "red" or "blue" values
 	* @param getConnectFour checks if there are any 4 consecutive 
 	* same color tokens at each insertion
 	* @param column - column location on grid between 0 and 6
 	* @param row  - row location on grid  between 0 and 5
 	* 
 	*/
	var getConnectFour=function(column,row){
		//checks consecutive same color tokens only on a column
		if(row<=2)
		{
			if(grid[column][row]===grid[column][row+1]&&grid[column][row]===grid[column][row+2]&&
				grid[column][row]===grid[column][row+3])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}
		//checks left side of the row
		if(3<=column)
		{
			if(grid[column][row]===grid[column-1][row]&&grid[column][row]===grid[column-2][row]&&
				grid[column][row]===grid[column-3][row])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}
		//checks right side of the row
		if(column<=3)
		{
			if(grid[column][row]===grid[column+1][row]&&grid[column][row]===grid[column+2][row]&&
				grid[column][row]===grid[column+3][row])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}

		//checks dioganal bottom-left side of grid
		if(row<=2 && 3<=column)
		{
			if(grid[column][row]===grid[column-1][row+1]&&grid[column][row]===grid[column-2][row+2]&&
				grid[column][row]===grid[column-3][row+3])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}
		//checks dioganal bottom-right side of grid
		if(row<=2 && column<=3)
		{
			if(grid[column][row]===grid[column+1][row+1]&&grid[column][row]===grid[column+2][row+2]&&
				grid[column][row]===grid[column+3][row+3])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}
		//checks dioganal top-left side of grid
		if(3<=row && 3<=column)
		{
			if(grid[column][row]===grid[column-1][row-1]&&grid[column][row]===grid[column-2][row-2]&&
				grid[column][row]===grid[column-3][row-3])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}
		//checks dioganal top-right side of grid
		if(3<=row && column<=3)
		{
			if(grid[column][row]===grid[column+1][row-1]&&grid[column][row]===grid[column+2][row-2]&&
				grid[column][row]===grid[column+3][row-3])
			{
				console.log(grid[column][row],"wins");
				declareWinner(grid[column][row]);
			}
		}
	};
    var renderSavedGame =function (arr2D)
    {
    	console.log("array",arr2D)
    	$("div").removeClass("token-blue");
		$("div").removeClass("token-red");
    	$(".game-ids-board").hide();
		$(".info-box").show();
		$(".btn-red").show();
		$(".btn-blue").show();
		$(".players").show();
		$(".board").show();
		for(var column=0;column<arr2D.length;column++)
		{
			console.log("checking");
			for(var row=0;row<arr2D[column].length;row++)
			{
				if(arr2D[column][row]==="red")
				{
					$(".col"+column).children(".row-"+row).addClass("token-red");
				}
				if(arr2D[column][row]==="blue")
				{
					$(".col"+column).children(".row-"+row).addClass("token-blue");
				}
			}
		}
    };
	/**
 	* with help of data-id attributtes 
    * each div has a data-id on grid
    * when a token inserted it starts looking from  
    * bottom and moves upwords on column until it finds a null value
    * in 2D grid array and inserts "red" or "blue" values
 	*/
 
   	var insertRedToken=function(){
   		$(".token-enterance").on("click",".token",function(){
			updateInfoBox("Blue");
			var column=$(this).attr("id").toString();
			var columnId=$("."+column).data("id");	
			for(var i=5;0<=i;i--){
				if(grid[columnId][i]===null)
				{
					$(this).effect( "shake",{direction:"up",times:"1"});
					$("." + column).children().eq(i).addClass("token-red");
					grid[columnId][i]="red";
					getConnectFour(columnId,i);
					$(".token-enterance").off("click");
					return;
				}
			} 
			//when there is no space on board it alerts user
			if(grid[columnId][0]!==null)
			{
				$(".info-box").text("No Space Pick Another Column");
			} 
		});
   	};
   	// as same as insertRedToken but inserts blue tokens
   	var insertBlueToken =function(){
		$(".token-enterance").on("click",".token",function(){
			updateInfoBox("Red");		
			var column=$(this).attr("id").toString();
			var columnId=$("." + column).data("id");
		   		for(var i=5;0<=i;i--){
					if(grid[columnId][i]===null)
					{
						$(this).effect( "shake",{direction:"up",times:"1"});
						$("."+column).children().eq(i).addClass("token-blue");
						grid[columnId][i]="blue";
						getConnectFour(columnId,i);
						$(".token-enterance").off("click");
						return;
					}
				} 
				if(grid[columnId][0]!==null)
				{
				 $(".info-box").text("No Space Pick Another Column")
				}  			
		});
   	};
   	// it gets an empty 2D array from server
	$(".buttons").on("click",".btn-new-game",function(){
		$("div").removeClass("token-blue");
		$("div").removeClass("token-red");
		$(".game-ids-board").hide();
		$(".info-box").show();
		$(".btn-red").show();
		$(".btn-blue").show();
		$(".players").show();
		$(".board").show();
		$(".info-box").text("Pick Your Color")
		$.get("/new",{},function(data){
			grid=data.data;
			gameId=data.id;
		});
	});
	// Saves data to server with unique Id
	$(".buttons").on("click",".save-game",function(){
		$(".board").hide();
		$(".info-box").hide();
		$(".game-ids-board").hide();
		$(".head-container").append("<div class='game-info alert  alert-info ' data-gameid='"+gameId+"'>"+gameId+"  Game Saved !</div>");	
	    $(".game-info").fadeOut(2500);
		$.post("/save/"+gameId,{data:grid},function(data){
			savedGames[data.gameId]=data.gameId;
			console.log(savedGames);
		});
	});
	$(".game-ids-board").on("click",".game-ids",function(){
		var gameIde=$(this).data("gameid");
		$.get("/detail/"+gameIde,{},function(data){
			var savedGrid=data.data.data;
			renderSavedGame(savedGrid);	
		});
	});
	$(".buttons").on("click",".saved-game",function(){
		$(".board").hide();
		$(".info-box").hide();
		$(".game-ids-board").empty();
		$(".game-ids-board").show();
        for(var key in savedGames){
			$(".game-ids-board").append("<a><div class='game-ids alert  alert-info' href='#' data-gameid='"+savedGames[key]+"'> Game Id:"+savedGames[key]+" !</div></a>");
        };
 
	});
    // click red button creates a token at inserted location
    $(".players").on("click",".btn-red",function(){	
    	$(".btn-red").hide();
		$(".btn-blue").show();
    	$(".info-box").text("Red is playing Now !");
        insertRedToken();      
	});
	$(".players").on("click",".btn-blue",function(){
		$(".btn-blue").hide();
		$(".btn-red").show();
		$(".info-box").text("Blue is playing Now !")
		insertBlueToken();
	});

});