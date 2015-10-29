//------------------------------------------------------------------------------------Iteração com o banco de dados MONGODB via servidor node.js e WebSocket-----------------------------

$.api = function( request, handler, error ) {

	var ws = new WebSocket("ws://127.0.0.1:3000");
	ws.onopen = function (event) {
		var req = {};
		req.data = request;
		req.id = 1;
  		ws.send(JSON.stringify(req)); 
	};

	ws.onmessage = function (event) {
  		ws.close();
  		handler(JSON.parse(event.data))
	}

};

// --------------------------------------------------------------fim--0----------------------

//------------------------------------------------INTERFACE APENAS-----------------

for(var i = 0; i < 9; i++)
{
	var letra = null;
	if(i == 0)
	{
		letra = "A"
	}
	else if(i == 1)
	{
		letra = "B"
	}
	else if(i == 2)
	{
		letra = "C"
	}
	else if(i == 3)
	{
		letra = "D"
	}
	else if(i == 4)
	{
		letra = "E"
	}
	else if(i == 5)
	{
		letra = "F"
	}
	else if(i == 6)
	{
		letra = "G"
	}
	else if(i == 7)
	{
		letra = "H"
	}
	else if(i == 8)
	{
		letra = "J"
	}


	$('.tabuleiro').append('<div class = "marcador" style = "top:'+ ((i*80)-10) +'px; left:-30px;"><b>'+letra+'</b></div>')
	$('.tabuleiro').append('<div class = "marcador" style = "top: -30px; left:'+ ((i*80)) +'px;"><b>'+(i+1)+'</b></div>')
}

var idsC = 0;
var haveQuery = false;
for(var i = 0; i < 8; i++)
{
	for(var j = 0; j < 8; j++)
	{
		$('.tabuleiro').append('<div id=house'+idsC+' class = "house"></div>');
		idsC++;
	}
}

for(var i = 0; i < 9; i++)
{

	for(var j = 0; j < 9; j++)
	{
		// ________________________________________________________________INTERFACE
			$('.tabuleiro').append('<div id = '+i+'_'+j+' class = "piece" style = "top:'+ ((80*(i))-20) +'px; left:' + ((80*(j))-20) +'px" ></div>')
		//-----------------------------------------------------------------fim--------------------------------------------------------------------
	}
}
$('.move-black').on('mouseover', function()
{
	$(this).tooltip('show');
})
$('.move-white').on('mouseover', function()
{
	$(this).tooltip('show');
})
$('.new-game').on('mouseover', function()
{
	$(this).tooltip('show');
})
$('.see-score').on('mouseover', function()
{
	$(this).tooltip('show');
})

$('.send-command').on('mouseover', function()
{
	$(this).tooltip('show');
})

$('.new-game').on('click', function()
{
	if(!haveQuery)
	{
		haveQuery = true;
		var request = 
		{
			method:'sendCommand',
			params:{
				command:"clear_board"
			}
		}
		$.api(request, function(response)
		{
			haveQuery = false;
			generateState("new")
		})
	}
})

$('.see-score').on('click', function()
{
	if(!haveQuery)
	{
		haveQuery = true;
		var request = 
		{
			method:'sendCommand',
			params:{
				command:"final_score"
			}
		}
		$.api(request, function(response)
		{
			console.log(response)
			haveQuery = false;
		})
	}
})

$('.move-white').on('click', function(ev)
{
	if(!haveQuery)
	{
		haveQuery = true;
		var request = 
		{
			method:'makeMove',
			params:{
				player:"white"
			}
		}
		$.api(request, function(response)
		{
			haveQuery = false;
			var casa = response.result.trim();
			if(casa != "PASS")
			{
				console.log("white: "+casa)
				var indice = stoneArc(casa, "white");
				console.log(indice)
				generateState("not-new", indice, "white")
				isMyTime(stateGeneric)
			}
			else
			{
				console.log("passed")
			}
		})
	}
})
$('.move-black').on('click', function(ev)
{
	if(!haveQuery)
	{
		haveQuery = true;
		var request = 
		{
			method:'makeMove',
			params:{
				player:"black"
			}
		}
		$.api(request, function(response)
		{
			haveQuery = false;
			var casa = response.result.trim();
			console.log("black: "+casa)
			var indice = stoneArc(casa, "black");
			console.log(indice)
			generateState("not-new", indice, "black")
			isMyTime(stateGeneric)
		})
	}
})

$('.send-command').popover({
	html:true,
	title:"Digite o comando",
	content: '<div  id = "command"><div class="input-group"><input type="text" class="form-control" placeholder="clear_board" autofocus><span class="input-group-btn"><button class="btn btn-default" type="button">Enviar</button></span></div><div class = "error-msg"></div></div>',
	placement:'bottom'
})

$('.send-command').on('click', function(){
	if(!haveQuery)
	{
		$(this).popover('show');
		$('#command').find('.input-group-btn').on('click', function( ev )
		{
			ev.preventDefault();
			var command = $('#command').find('.form-control').val();
			command =  command.trim();
			command =  command.toUpperCase();
			if(command!=null || command!="")
			{
				haveQuery = true;
				var request = 
				{
					method:'sendCommand',
					params:{
						command:command
					}
				}
				if(request.params.command != "" && request.params.command != null)
				{
					$.api(request, function(response)
					{
						haveQuery = false;
						if(response.result == "?")
							alert("Este comando não existe!")
					})
				}		
			}
		})
	}
})


function stoneArc(casa, jogador)
{
	var count = 0;
	var i = 0;
	if(casa[0] == "A" || casa[0] == "0")
	{
		i = 0
		count = 9;
	}
	else if(casa[0] == "B" || casa[0] == "1")
	{
		i = 1
		count = 18;
	}
	else if(casa[0] == "C" || casa[0] == "2")
	{
		i = 2
		count = 27;
	}
	else if(casa[0] == "D" || casa[0] == "3")
	{
		i = 3
		count = 36;
	}
	else if(casa[0] == "E" || casa[0] == "4")
	{
		i = 4
		count = 45;
	}
	else if(casa[0] == "F" || casa[0] == "5")
	{
		i = 5
		count = 54;
	}
	else if(casa[0] == "G" || casa[0] == "6")
	{
		i = 6
		count = 63;
	}
	else if(casa[0] == "H" || casa[0] == "7")
	{
		i = 7
		count = 72;
	}
	else if(casa[0] == "J" || casa[0] == "8")
	{
		i = 8
		count = 81;
	}

	if(casa[1] != "_")
	{
		var j = parseInt(casa[1]);
		var indice = (count - (9-j));
		drawStone(i, j, jogador)
		return indice;
	}
	else
	{
		var j = parseInt(casa[2]);
		var indice = (count - (9-j));
		drawStone(i, j, jogador);
		return indice;
	}
}
function drawStone( i, j, jogador )
{
	$('#'+i+'_'+j).css('background', jogador)
	$('#'+i+'_'+j).show();
}


// ------------------------------------------------fim -----------------------------



//--------------------------------------------------Geração de dados do tabuleiro--------------------------

var stateGeneric = []// contera a disposição das peças no tabuleiro

generateState("new")

function generateState( mode, indice, jogador )
{
	if(mode == "new")
	{
		for(var i = 0; i < 81; i++)//gera um estado de tabuleiro 
		{
			stateGeneric.push({ocupada: false, jogador: null})
		}
	}
	else 
	{
		console.log(indice)
		stateGeneric[indice].ocupada = true;
		stateGeneric[indice].jogador = jogador;
	}
}

function isMyTime ( state ) {
	var tabuleiro = //dados que são os parametros para a função AG
	{
		score:1,
		places:[]
	}

	var references = []//são refencias, será usada para definir para cada uma das casas quem são as suas referencias.
	var count = 0;//usado para saber qual é o indice no vetor das peças
	for(var i = 0; i < 9; i++) // tamanho 9 x 9 -  MATRIZ
	{
		for(var j = 0; j < 9; j++)
		{
			var aPlace = new place();// o metrodo PLACE é basicamente a ESTRUTURA DE CADA UMA DAS CASAS, e contem informações como: quem está ocupando ela, 
			//quem são as adjacencias e afins. A declaração do place(), ocorre no arquivo: umberPrototype.js
			
			aPlace.casa = i+'_'+j; // as casas são chamadas de acordo com a coluna e linha a qual pertencem
			aPlace.ocupada = state[count].ocupada;// é true, quando existe uma peça alocada naquela dada casa
			aPlace.jogador = state[count].jogador;// informa se é uma casa ocupada por peças: 'white' ou 'black'

			var reference = []; //usado para fazer a referencia.

			if(j+1 < 9)
				reference.push(count+1)
			if(j-1 >= 0)
				reference.push(count-1)

			if(i+1 < 9)
			{
				reference.push(count+9);
			}
			if(i-1 >= 0)
			{
				reference.push(count-9);
			}
			
			references.push(reference);// para cada casa no tabuleiro é armazenada o INDICE no vetor de tabuleiro.places, e posteriormente é usado para fazer as peças terem a referencia
			//de suas adjacencias
			tabuleiro.places.push( aPlace );//adiciona ao tabuleiro a peça.;

			count++;//contador de casas
		}		
	}

	tabuleiro.score = 0; //pontuação do cenário atual - Está informação ainda não é usada

	var states = []
	//no for abaixo adiciono a referencia entre as peças e suas adjacencias
	for(var i =0; i < tabuleiro.places.length; i++)
	{
		for(var j = 0; j < references[i].length; j++)
		{
			var indice = parseInt(references[i][j]);
			tabuleiro.places[i].adjacencias.push(tabuleiro.places[indice])
		}
		if(!tabuleiro.places[i].ocupada)
		{
			var state = new place();
			state.casa = tabuleiro.places[i].casa;
			state.ocupada = tabuleiro.places[i].ocupada;
			state.jogador = tabuleiro.places[i].jogador;
			state.adjacencias = [];
			state.pontuation = tabuleiro.places[i].pontuation;
			state.pontuation = false;

			states.push(state);
		}
	}

	var id = "";
	for(var i = 0; i < states.length; i++)
	{
		id +=""+states[i].casa+""
	}

 //  busca no banco de dados as jogadas que tiveram a mesma entrada que esta
 	var request = {method:"getStates", params:{id: id}}
	$.api( request, function(response){
		var lastPlay = response;
		var whatToDo = umberProt( tabuleiro, lastPlay );//chamo a função "Protagonista de tudo", ela está no arquivo: js/umberPrototype.js e é a responsavél por gerar a jogada que será feita
		var thePlay = null;
		if(whatToDo[0].best!=null)
		{
			if(lastPlay != null)
			{
				if(lastPlay.played.pontuation < whatToDo[whatToDo.length-1].best.pontuation)
				{
					thePlay = whatToDo[whatToDo.length-1].best;
					var newBest = { method:"updateState", params:{
						newState:
						{
							id: id,
							played:{
								pontuation:whatToDo[whatToDo.length-1].best.pontuation,
								casa:whatToDo[whatToDo.length-1].best.casa,
							}
						},
						oldState: lastPlay
					}}
					$.api(newBest, function(response)
					{
						console.log("Nova Melhor");
						var casa = whatToDo[whatToDo.length-1].best.casa
						var indice = stoneArc(casa, "black");
						generateState("not-new", indice, "black")
						casa = normalizeHome( casa );
						console.log(casa)
						var request = {
							method:"doMove",
							params:{
								casa:casa
							}
						}
						$.api(request, function(response)
						{
							console.log("Moveu:" + casa);
						})
					})

				}
				else
				{
					console.log("A Antiga é melhor")
					thePlay = lastPlay.played;
					var casa = lastPlay.played.casa;
					var indice = stoneArc(casa, "black");
					generateState("not-new", indice, "black")
					casa = normalizeHome( casa );
					console.log(casa)

					var request = {
						method:"doMove",
						params:{
							casa:casa
						}
					}
					$.api(request, function(response)
					{
						console.log("Moveu:" + casa);
					})
				}
			}
			else
			{

				var newBest = { method:"newState", params:{
					id: id,
					played:{
						pontuation:whatToDo[whatToDo.length-1].best.pontuation,
						casa:whatToDo[whatToDo.length-1].best.casa,
					}
				}}
				$.api(newBest, function(response)
				{
					console.log("Nova Jogada");
					var casa = whatToDo[whatToDo.length-1].best.casa
					var indice = stoneArc(casa, "black");
					generateState("not-new", indice, "black")
					casa = normalizeHome( casa );
					console.log(casa)
					var request = {
						method:"doMove",
						params:{
							casa:casa
						}
					}
					$.api(request, function(response)
					{
						console.log("Moveu:" + casa);
					})
				})			
			}
		}
	});
}

function normalizeHome( casa )
{
	var letra = null;
	var i = parseInt(casa[0]);
	if(i == 0)
	{
		letra = "A"
	}
	else if(i == 1)
	{
		letra = "B"
	}
	else if(i == 2)
	{
		letra = "C"
	}
	else if(i == 3)
	{
		letra = "D"
	}
	else if(i == 4)
	{
		letra = "E"
	}
	else if(i == 5)
	{
		letra = "F"
	}
	else if(i == 6)
	{
		letra = "G"
	}
	else if(i == 7)
	{
		letra = "H"
	}
	else if(i == 8)
	{
		letra = "J"
	}
	var newJ = parseInt(casa[2])
	casa.replace("_", "");
	newJ += 1;
	var newCasa = letra+newJ
	console.log(newCasa)
	return newCasa;
}


// for(var i = 0; i < 81; i++)//gera um estado de tabuleiro 
// {	
// 	var rand =  Math.floor(Math.random()* 3)//sorteio de 0 até 2, se 0 a casa recebe uma peça branca, se 1 recebe uma peça preta e se 2, recebe nada.

// 	if(rand == 0)
// 		stateGeneric.push({ocupada: true, jogador: 'white'})
// 	else if(rand == 1)
// 		stateGeneric.push({ocupada: true, jogador: 'black'})
// 	else if(rand == 2)
// 		stateGeneric.push({ocupada: false, jogador: null})
// }