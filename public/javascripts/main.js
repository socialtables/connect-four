/**
 * Connect Four Game
 * Extensive Jquery 2.0 usage 
 * @param grid -the empty 7x6 2D array obtanined from the server
 * @param gameId - the unique id of a game
 */


$(function() {
	var grid;
	var gameId;
	$(".board").hide();
	// winner is added to DOM
	var declareWinner= function(player)
	{
		$(".players").hide();
		return $(".info-box").html("<div class='message alert  alert-success'>"+player+" Won!</div>")	
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
           	$(this).effect( "shake",{direction:"up",times:"1"});
			var column=$(this).attr("id").toString();
			var columnId=$("."+column).data("id");	
			for(var i=5;0<=i;i--){
				if(grid[columnId][i]===null)
				{
					$("."+column).children().eq(i).addClass("token-red");
					grid[columnId][i]="red";
					getConnectFour(columnId,i);
					$(".token-enterance").off("click");
					return;
				}
			} 
			//when there is no space on board it alerts user
			if(grid[columnId][0]!==null)
			{
				alert("Don't you see it is full")
			} 
		});
   	};
   	// as same as insertRedToken but inserts blue tokens
   	var insertBlueToken =function(){
		$(".token-enterance").on("click",".token",function(){
			console.log("clicked blue token")
			updateInfoBox("Red");
			$(this).effect( "shake",{direction:"up",times:"1"});
			var column=$(this).attr("id").toString();
			var columnId=$("."+column).data("id");
		   		for(var i=5;0<=i;i--){
					if(grid[columnId][i]===null)
					{
						$("."+column).children().eq(i).addClass("token-blue");
						grid[columnId][i]="blue";
						getConnectFour(columnId,i);
						$(".token-enterance").off("click");
						return;
					}
				} 
				if(grid[columnId][0]!==null)
				{
					alert("Don't you see it is full")
				}  			
		});
   	};
   	// it gets an empty 2D array from server
	$(".buttons").on("click",".btn-new-game",function(){
		$("div").removeClass("token-blue");
		$("div").removeClass("token-red");
		$(".info-box").show();
		$(".board").show();
		$(".players").show();
		$(".info-box").text("Click Player's Button")
		$.get("/new",{},function(data){
			grid=data.data;
			gameId=data.id;
		});
	});
	// Saves data to server with unique Id
	$(".buttons").on("click",".save-game",function(){
		$(".board").hide();
		$(".info-box").hide();
		$(".head-container").append("<div class='game-info alert  alert-info'>"+gameId+"  Game Saved !</div>");	
	    $(".game-info").fadeOut(2500);
		$.post("/save/"+gameId,{data:grid},function(data){
			console.log(data);
		});
	});

    // click red button creates a token at inserted location
    $(".buttons").on("click",".btn-red",function(){	
    	$(".btn-red").hide();
		$(".btn-blue").show();
    	$(".info-box").text("Red is playing Now !");
        insertRedToken();      
	});
	$(".buttons").on("click",".btn-blue",function(){
		$(".btn-blue").hide();
		$(".btn-red").show();
		$(".info-box").text("Blue is playing Now !")
		insertBlueToken();
	});
});