
$(function() {
	var grid;
	var gameId;
	$(".board").hide();
	$(".buttons").on("click",".btn-new-game",function(){
		$("div").removeClass("token-blue");
		$("div").removeClass("token-red");
		$(".info-box").show()
		$(".board").show();
		$(".players").show();
		$(".info-box").text("Click Player's Button then arrows")
		$.get("/new",{},function(data){
			grid=data.data;
			gameId=data.id;
		});
	});
	$(".buttons").on("click",".save-game",function(){
		$(".board").hide();
		$(".info-box").hide();
		$(".head-container").append("<div class='game-info alert  alert-info'>"+gameId+"  Game Saved !</div>");	
	     $(".game-info").fadeOut(2500);
		$.post("/save/"+gameId,{data:grid},function(data){
			console.log(data);
		});
	});
	var declareWinner= function(player)
	{
		$(".players").hide();
		return $(".info-box").html("<div class='message alert  alert-success'>"+player+" Won!</div>")	
	};
	var updateInfoBox=function(color){
		return $(".info-box").text(color+" player's turn, click "+color+" button");
	}
	var getConnectFour=function(column,row){

		//checks columns Bottom
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

   
   	var redToken=function(){
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
		});
   	};
   	var blueToken =function(){
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
				
		});
   	};

    // when click on head of the location it creates token
    $(".buttons").on("click",".btn-red",function(){	
    	$(".btn-red").hide();
		$(".btn-blue").show();
    	$(".info-box").text("Red is playing Now !")
    	// $(".message").css("background-color","red");
        redToken();
       
	});
	$(".buttons").on("click",".btn-blue",function(){
		$(".btn-blue").hide();
		$(".btn-red").show();
		$(".info-box").text("Blue is playing Now !")
		// $(".message").css("background-color","blue");
		blueToken();
	});
});