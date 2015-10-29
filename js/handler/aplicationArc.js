 /*

 -------------------------------------------------------------------------------------Discovery and Mind History-----------------------------------


1 - Algoritmos Geneticos, não seguem todas as leis da biologia. Pois os genes podem ser recessivos e podem vir do passado. 

2 - Elitismo - APlicado para salvar 2 individuos  da população com o maior numero de matches

3 - não é possivél fazer o ag aprender se eu não situar ele por setores de melhores jogadas - Deprecated

4 - Usar como validação e premissa para melhorar a validação se é uma jogada que ocupara um territorio já meu!

5 - Jogadas iniciadas 4x4 produzem bons resultados iniciais. 1x1 ruins para se iniciar e jogadas 2x1 também!

6 - Melhor pontuar com base nas minhas proprias jogadas.

7 - Usar as disposiçoes para calcular areas de morte e areas livres!""

8 - Interface de espera para o Umber Tb. Atualmente só existe para o GNUGO

9 - correções de interface para otimizar a visualização dos itens e tudo mais :)

10 - usar o badblocks em jogadas suicidas ou para jogadas que já foram feitas ou que estão ocupadas

11 -  erro com numero de casas já ocupadas maior do que 18. O Erro ocorre na primeira iteração e no primeiro elemento da nova população
. Também tem o erro de maximum call - erro maior que 19 corrigido - Erro maximum call persiste!

12 - Mapear os territórios

13 - O algorimo genético é necessário ser alterado. Para o escopo deste jogo e o modo como o individuo foi definido, no ato de cruzar dois pais quaisquer, 
é possível obter jogadas que não são validas. Para tal, só será permitido a seleção de pais (usando ainda o mecanismo da roleta) que gerem descendentes válidos
e diferentes dos que já foram criados e avaliados. Este passo ira ser chamado de: remoção de individuos inferteis 

14 - Para aprender sem regra alguam... era somente fazer ele gerar jogadas... e tentar jogar, se fosse uma jogada irregular, ele iria armazenar que para aquele estado
era uma jogada ruim e iria gerar novas jogadas diferentes destas que seria irregulares, ou seja, com o tempo, ele saberia quais jogadas são irregulares 
 e quais não são.

15 - * A ideia 3 - era, obter o conjunto de jogadas possiveis dado uma estado qualquer. Fazer com que o algoritmo AG somente gerasse jogadas novas, ou seja,
O ag sempre iria gerar novas jogadas a cada iteração, isto é, iria inferir até gerar todas as possiveis jogadas.

16 - REFATORAÇÃO! - Basear em longevidade! Ver a arvore de decisão conforme as partidas vão ocorrendo e ir se adaptando. Na primeira vez, ou seja, se o estado 
é novo, calcular a malhor possível jogada. Se o estado for diferente, testar e pontuar as jogadas com base no score.

17 - Para um futuro próximo, remover o GNUGO e implementar as funções necessárias que hoje são usadas por meio dele.

18 - Novamente, poderia adaptar o algoritmo genético para percorrer e avaliar todas as jogadas possíveis.

19 - Nova ideia: Suponha que cada população fosse uma determinada areá do tabuleiro, está area possui individuos (jogadas). O cruzamento geraria elementos da mesma area ou setor
e a mutãção de um área diferente.

20 - Nova Ideia: Avaliar possibilidade de individuos não serem apenas uma jogada em uma casa, mas sim, um territorio. Ou conjunto de peças.

21 - Nova ideia: Talvez o individuo da população deva ser algo extremamente mais complexo do que meramente a jogada. Pois, o número de jogadas é finito e é possível
obter sempre uma jogada boa percorrendo todas elas. 
O resultado de uma partida de GO é definido por um conjunto de ações e não uma ação em especifico, talvez atribuir como individuo
uma estrategia, e apartir dela, verificar jogadas boas. Exemplo, o individuo x é de estratégia Defesa ou ataque. O ideal seria construir estratégias para ganhar
e não apenas obter a melhor jogada possível para aquele esado. Existe uma possibilidade que ainda não verifiquei- TALVEZ OBTENDO SEMPRE AS BOAS JOGADAS SEJA
POSSÍVEL EXTRAIR UM COMPORTAMENTO OU UMA SERIE DE AÇÔES QUE GERAM SEMPRE BONS RESULTADOS.

22 - Território - A função sheepsAndWolves pode ser usada para desenhar e armazenar os terriórios. Com este novo metodo, se tornara possível buscar por exemplo,
jogadas e territórios muito bons como o 2-eyes. Aprimorar

23 - Em algum momento gerou uma jogada invalida. Verificar o que ocorreu. Origem do erro - ValidatePlay, Motivo: A validação de uma jogada já feita, a jogada irregular pode ser
regular se resultar em captura, a validação para isso não ocrre, retornando TRUE sempre nesta instancia. *BUG ISSUE* - Isso não é um bug
é apenas uma não implementação da ultima regra a ser implementada.

24 - Talvez o LibertiesCount não se aplique pois, 2 elementos podem ter a mesma liberdade- Deprecated - O liberties count funciona ao remover 
pois, quando vou remover os elementos já estão todos atualizados com a ultima jogada feita.

-------------------------------------------------------------------Algoritmo Genético----------------------------------
[Início] Gere uma população aleatória de n cromossomas (soluções adequadas para o problema)
[Adequação] Avalie a adequação f(x) de cada cromossoma x da população
[Nova população] Crie uma nova população repetindo os passos seguintes até que a nova população esteja completa
	[Seleção] Selecione de acordo com sua adequação (melhor adequação, mais chances de ser selecionado) dois cromossomas para serem os pais
		[Remove Sterile](*Adaptação para o jogo GO) É necessário remover individuos que não possam gerar novas possíveis soluções para o problema, ou seja,
		não podem ser pais

	[Cruzamento] Com a probabilidade de cruzamento cruze os pais para formar a nova geração. Se não realizar cruzamento, a nova geração será uma cópia exata dos pais.
	[Mutação] Com a probabilidade de mutação, altere os cromossomas da nova geração nos locus (posição nos cromossomas).
[Aceitação] Coloque a nova descendência na nova população
[Substitua] Utilize a nova população gerada para a próxima rodada do algoritmo
[Teste] Se a condição final foi atingida, pare, e retorne a melhor solução da população atual
[Repita] Vá para o passo 2


*/

var realTimeEngine = null;

(function($, window, document, undefined ) 
{
	var aplicationArc = 
	{
		init:function(options, elem, template)
		{
			var self = this; // self aponta para o container
			self.$elem = $( elem ); //este é o container passado
			self.options = $.extend( {}, $.fn.appAplicationArc.options, options );// ao chamar este modulo da aplicação, lá em baixo. Posso passar variaveis de outros modulos
			self.options.badBlocks = [];//Deprecated - Armazenava o conjunto de jogadas irregulares
			self.options.command = false;//usado apenas para controlar a interface do botão de enviar um comando ao GNUGO se for true, ele não volta para as cores normais
			self.options.criticalChance = 1;//É a chance de mutação em % de 1 até 100.
			self.options.eateds = [];
			self.options.forfeit = 0;//armazena o número de jogaroes que deram PASS ou resign, se for igual a 2, significa que a partida acabou pois ambos, decidiram parar
			self.options.haveQuery = false;//se eu estiver buscando algo ou fazendo requisição, isso faz com que o sistema fique "aguardando", isso é necessário porque o javaScript, não espera por requisições.
			self.options.ko =  null; // está variavél assume o ultima jogada de KO realizada. A regra de KO é definida pelo jogo gnugo para evitar loops eternos.
			self.options.lastPlay = null;//armazena a ultima jogada feita, é usado principalmente para exibir a jogada feita por um dos jogadores
			self.options.letras = ['A','B','C','D','E','F','G','H','J']; //o gnugo pula do H para o I -  É usado para idexação e organização das casas
			self.options.maxFolks = 10;// é o numero máximo de individuos em uma população.
			self.options.maxGerations = 50;// é o número máximo de vezes em que o algoritmo genético será executado.
			self.options.maxPoints = 0;// é o somatório da pontuação de cada um dos individuos da população. É usado no umberMIND(algoritmo genético);
			self.options.notTurn = "white";//armazena de quem NÃO é a vez
			self.options.possiblesPlays = []//armazena o conjunto de jogadas válidas. Jogadas ´válidas são jogadas possíveis e também que não tenham sido processadas pelo UMBERGO
			self.options.possiblesPlaysAux = []
			self.options.state = [];//armazena todo o tabuleiro, e suas respectivas informações bem como: casa, edges, cor que está na casa e etc.
			self.options.territory = [];// Será usado no futuro para identificação e controle dos territórios presentes no game
			self.options.turn = "black";// armazena de quem é o turno
			self.$elem.load( template, function() {//carrego a interface e cenário do jogo
				self.setup();//chamo o setup, que é onde carrego as funções de controle da interface. Ou seja, eventos e opções do UMBERGO como um todo.
			});
			realTimeEngine = self;
		},
		setup:function()
		{
			var self = this;
			self.templates = {};//armazena elementos HTML que são incorporados na interface conforme necessário. Estes elementos estão no arquivo
			//templates/aplicationArc.html
			self.templates.boardTemplate = Handlebars.compile(self.$elem.find('#board-template').html());//carrega o tabuleiro e suas casas
			self.templates.pieceTemplate = Handlebars.compile(self.$elem.find('#piece-template').html());//carrega a oeça
			self.templates.commandsTemplate = Handlebars.compile(self.$elem.find('#commands-template').html());// carrega o menu de digitação da opção de enviar comando para o gnugo
			self.templates.loaderTemplate = Handlebars.compile(self.$elem.find('#loader-template').html());// é oq ue faz a ampulheta aparecer
			self.templates.modalTemplate = Handlebars.compile(self.$elem.find('#modal-template').html());// é a tela que abre quando o jogo acaba ou quando pede para calcular a pontuação
			self.templates.scoreTemplate = Handlebars.compile(self.$elem.find('#score-template').html());// mesmo de cima
			self.templates.statusPopoverTemplate = Handlebars.compile(self.$elem.find('#status-popover-template').html());//exibe a mensagem de estado abaixo de cada peça de cor. Branca ou preta
			self.loadBoard();//chama a função que dara inicio ao processo de carregamento da interface de jogo
			self.interfaceEvents();//manipulador e controlador dos eventos de toda a interface
			self.stateManager();//gero o estado inicial e o armazeno na varivel declarada no self.init .
			$('.new-game').trigger('click');
		},
		commandGnuGo:function()
		{
			var self = this;
			// é usado para enviar um comando direto ao GNUGO. Em caso de sucesso, obtera uma resposta.
			self.options.command = true;
			$(this).popover('show');
			$('#command').find('.input-group-btn').unbind('click').on('click', function( ev )
			{
				if(self.options.command)
				{
					ev.preventDefault();
					var command = $('#command').find('.form-control').val();
					command =  command.trim();
					if(command!=null || command!="")
					{
						self.options.haveQuery = true;
						var request = 
						{
							method:'doCommand',
							params:{
								command:command
							}
						}
						if(request.params.command != "" && request.params.command != null)
						{
							$.api(request, function(response)
							{
								self.options.haveQuery = false;
								if(response.result == "?")
									alert("Este comando não existe!")
								else
								{
									$(this).tooltip('hide');
									$(this).popover('hide');
									$(this).css({
										'text-shadow':'',
										'background': '',
										'box-shadow': '',
									})
									self.options.command = false;
									$('.do-command').popover('hide');
									console.log( response )
								}
							})
						}		
					}
				}
			})
		},	
		deadZones: function( house, liberties )//deprecated - Não é mais usada. A ideia desta função era achar zonas de morte
		{	
			var self = this;
			//prevenção de um ciclo suicida apenas. Para contextualizar e validar de modo mais profundo, consultar o caderno onde há um especificação melhor.
			if(!liberties)
				liberties = { count:0 };

			house.covered = true;
			for(var i = 0; i < house.edges.length; i++)
			{
				var adj = house.edges[i];
				var safe = false;
				if(!adj.covered)
				{
					liberties.count++;
					safe = true;
				}
				if( adj.ocupada && adj.jogador != self.options.turn)
				{
					liberties.count --;
					safe = false;
				}

				//fazer recursaão com base nas novas regras
			}

			if(liberties.count > 0)
				return false;
			else
				return true;
		},
		getElementByHouse: function( casa )// com base numa casa que recebo como parametro, percorro toda a estrutura de casas do state em busca desta casa
		{
			var self = this;
			//acha e rretorna uma casa qualquer
			for(var i = 0; i < self.options.state.length; i++)
				if(self.options.state[i].casa == casa)
					return self.options.state[i];
		},
		getStones: function( color )// retorno todas as pedras jogadas e "vivas" conforme a cor
		{
			var self = this;
			var stones = [];
			for(var i = 0; i < self.options.state.length; i++){
				var house = self.options.state[i];
				if(house.ocupada && house.jogador == color)
					stones.push( house );
			}

			return stones;
		},
		getTerritoryByContains:function( piece, jogador )
		{
			var self = this;
			for(var i = 0; i < self.options.territory.length; i++)
				if(self.options.territory[i].id.search( piece ) != -1 && self.options.territory[i].jogador == jogador)
					return {indice:i , territory:self.options.territory[i]};
			return -1;
		},
		gnuGO:function( mode, player )// envio comando ao GNUGO de jogadas. Ou pesso para ele computar uma jogada ou pra ele fazer uma jogada
		{
			var self = this;
			if(mode == "generatePlay")
			{
				self.options.haveQuery = true;
				if(self.options.forfeit < 2)
				{
					if(!player)
						player = self.options.turn;

					var request = 
					{
						method:'generatePlay',
						params:{
							jogador:player
						}
					}
					self.statusArc('loading');
					$.api(request, function(response)
					{
						var casa = response.result.trim();
						self.options.lastPlay = casa;
						self.statusArc('newPlay');
						if(casa != "PASS" && casa != "resign")
						{
							self.options.forfeit = 0;
							self.houseArc();
							self.invertPlayer();
						}
						else
						{
							if(self.options.forfeit == 0)
							{
								self.options.forfeit = 1;
								self.invertPlayer();
							}
							else if( self.options.forfeit > 0)
							{
								if(self.options.forfeit == 1)
									self.invertPlayer();
								self.options.forfeit = 2;
								self.scoreMatch()
							}
						}
					})
				}
				else
					self.scoreMatch()
			}
			else if( mode == "play" )
			{
				var request = {
				method:'doPlay',
				params:{
					casa:self.options.lastPlay,
					jogador:self.options.turn
				}
				}
				$.api(request, function(response)
				{
					self.statusArc( 'newPlay' )
					if(self.options.lastPlay != "PASS" && self.options.lastPlay != "resign")
					{
						self.options.forfeit = 0;
						self.houseArc();
						self.invertPlayer();
					}
					else
					{
						if(self.options.forfeit == 0)
						{
							self.options.forfeit = 1;
							self.invertPlayer();//Troca o jogador. ou seja, se quem jogou foram as brancas as pretas que irã jogar
						}
						else if( self.options.forfeit > 0)
						{
							if(self.options.forfeit == 1)
								self.invertPlayer();
							self.options.forfeit = 2;
							self.scoreMatch()
						}
					}
				})
			}
		},
		houseArc:function( )//controlo informações da casa, dizendo se está ocupada ou não e se estiver, faço aparecer uma peça da cor
		{
			var self = this;
			var house = self.getElementByHouse( self.options.lastPlay )
			$('#'+self.options.lastPlay).find('.handcap').hide();
			var color = "";
			if(self.options.turn == "black")
				color = 'radial-gradient(rgba(65,65,65,1) 5%, rgba(30,30,30,1) 40%, rgba(0,0,0,1) 100%)'
			else
				color = 'radial-gradient(rgba(255,255,255,1) 5%, rgba(215,215,215,1) 40%, rgba(225,225,225,1) 100%)';
			$('#'+self.options.lastPlay).css('background', color);
			$('#'+self.options.lastPlay).css('box-shadow', '0px 0px 6px 0.2px '+self.options.notTurn+'');
			$('#'+self.options.lastPlay).show();
			house.ocupada = true;//a casa jogada deve ser atualizada com as informações de qual jogador es´tá nela
			house.jogador = self.options.turn;
			if(self.options.ko != null)//verificando se no tuni n-1 aconteceu uma jogada do tipo KO
			{
				self.options.ko.ocupada = false;
				self.options.ko = null;
			}
			self.territoryArc( house );//nesta função é onde crio e estabeleço os territórios criados, basicamente é o controlador e manipulador dos territorios

			console.log(self.options.territory);

			var eated = self.sheepsAndTheWolves( house );//é onde verifico quais peças foram comidas com está jogada ffeita
			for(var i = 0; i < eated.length; i++)
			{
				//é necessário calcular o território e também armazenar as peças que foram removidas.
				$('#'+eated[i].casa).css('background', '');
				$('#'+eated[i].casa).css('box-shadow', '');
				$('#'+eated[i].casa).find('.handcap').show();
				eated[i].ocupada = false;
				eated[i].jogador = null;
				if(eated.length == 1)
				{
					eated[i].ocupada = "ko";
					self.options.ko = eated[0];
				}
				eated[i].connected = [];
				eated[i].liberties = [];
				for(var j = 0; j < eated[i].edges.length; j++)
				{
					var edge = eated[i].edges[j];
					eated[i].liberties.push(eated[i].edges[j]);
					if(edge.ocupada && edge.jogador == self.options.turn)
						edge.liberties.push(eated[i]);
				}
				//se a jogada atual originar comida de peça. É necessário não permitir que esta jogada seja possível no turno n+1;
			}
		},
		humanPlay:function( house )
		{
			var self = this;
			house =  self.getElementByHouse( house )
			var isValid = self.validatePlay( house );
			if(isValid == true)
			{
				self.statusArc("loading");
				self.options.query = true;
				self.options.lastPlay = house.casa;
				self.gnuGO( "play" );
			}
			else
			{
				if(isValid == "not-free")
				{
					console.log(house);
					alert("A jogada "+ self.options.turn+" "+house.casa+" é inválida. A casa já tem peça!");
				}
				else if(isValid == "suicide")
				{
					console.log(house);
					alert("A jogada "+ self.options.turn+" "+house.casa+" é suicidio!");
				}
				else if(isValid == "ko")
				{
					alert("A jogada "+ self.options.turn+" "+house.casa+" não pode ser feita neste turno!");
				}
			}
		},
		interfaceEvents:function()
		{
			var self = this;
			$.interfaceEvents( self );
		},
		invertPlayer:function()
		{
			var self = this;
			if(self.options.turn == "black")
			{
				self.options.turn = "white"
				self.options.notTurn = "black"
			}
			else
			{
				self.options.turn = "black"
				self.options.notTurn = "white"
			}

			self.options.haveQuery = false;
		},
		loadBoard:function()
		{
			var self = this;
			$.drawBoard( self );
		},
		newMatch:function()
		{
			var self = this;
			self.options.haveQuery = true;
			var request = 
			{
				method:'doCommand',
				params:{
					command:"clear_board"
				}
			}
			$.api(request, function(response)
			{
				self.options.eated = [];
				self.options.forfeit = 0;
				self.options.haveQuery = false;
				self.options.ko = null;
				self.options.territory = [];
				$('.'+ self.options.notTurn +'-bar').find('.player-status').popover('hide');
				self.options.turn = "black";
				self.options.notTurn = "white";
				self.stateManager()
			})
		},
		resetWalks: function()
		{
			var self = this;
			for(var i= 0; i < self.options.state.length; i++)
				self.options.state[i].covered = false;// redefine que a casa não foi percorrida
		},
		scoreMatch:function()
		{
			var self = this;
			$('.'+ self.options.notTurn +'-bar').find('.player-status').popover('hide');
			self.options.haveQuery = true;
			$('#info-board').modal('show');
			$('#info-board').find('.modal-content').empty().append(self.templates.modalTemplate());
			$('#info-board').find('.modal-body').append(self.templates.loaderTemplate({
				width:"100%",
				msg:"Aguarde enquanto a pontuação é calculada...",
				fontSize:"16px",
				widthH:"40px",
				heightH:"40px"
			}))
			
			var request = 
			{
				method:'doCommand',
				params:{
					command:"final_score"
				}
			}
			$.api(request, function(response)
			{
				self.options.haveQuery = false;
				var score = response.result.split('+');
				var colorW = "";
				var colorL = "";
				var pieceColor = "";
				if(score[0] == 'B')
				{
					colorW = "Pretas"
					colorL = "Brancas"
					pieceColor = "black"
				}
				else
				{
					colorL = "Pretas"
					colorW = "Brancas"
					pieceColor = "white"
				}

				$('#info-board').find(".modal-body").empty().append(self.templates.scoreTemplate({
					width:"100%",
					pontos:score[1],
					colorW:colorW,
					colorL:colorL,
					pieceColor:pieceColor
				}))
				$('#info-board').find(".modal-footer").fadeIn(800);
				$('#info-board').find(".modal-new-game").fadeIn(800);
				$('#info-board').find(".modal-new-game").on('click', function(){self.newMatch()})
				$('#info-board').find(".modal-close").on('click', function(){self.statusArc('display')})
			})
		},
		sheepsAndTheWolves:function( wolf )
		{
			var self = this;
			//wolf é a jogada feita
			var eated = [];//armazena todas as peças que foram "comidas"
			//----------------------------------------------------------versão 1.06----------------------------------------
			for(var i = 0; i < wolf.edges.length; i++)//para cada adjacencia
			{
				var edge = wolf.edges[i];//edge é a adjacencia
				if(edge.liberties.length == 0 && edge.connected.length == 0)//´conexão não é uma liberdade, porém, um território é formado pelo conjunto de todos os elementos e suas liberdades
					eated.push( edge );
				else if(edge.liberties.length == 0)//para todas as liberdades se for maior que 0 
				{
					var result = self.getTerritoryByContains( edge.casa, self.options.notTurn );//pego o território tal qual a peça está atreladada
					var lastInsert = (eated.length);//armazena o ultimo elemento inserido.
					if(result != -1)//se o território existir
					{
						var libertiesCount = 0;//é o somatório das liberdades de todas as peças.
						for(var j = 0; j < result.territory.members.length; j++)
						{
							libertiesCount += result.territory.members[j].liberties.length;
							eated.push(result.territory.members[j]);//adiciono provisóriamente no array de peças comidas
						}
						if(libertiesCount > 0)//se o somatório de liberdades do território for maior 0, quer dizer que não foram cercados.
							eated.splice(lastInsert, (eated.length - lastInsert));//é necessário remover os elementos que adicionei provisóriamente
						else
							self.options.territory.splice( result.indice, 1);//como todas as peças do território devem ser removidas, o território não mais existe
					}
				}
			}
			return eated;

			//----------------------------------------------------------versão 1.05----------------------------------------
			//funciona bem
			// for(var i = 0; i < sheeps.length; i++)
			// {
			// 	var sheep = sheeps[i];
			// 	if(sheep.liberties.length == 0 && sheep.connected.length == 0)
			// 	{
			// 		for(var j = 0; j < sheep.edges.length; j++)
			// 		{
			// 			var edgeS = sheep.edges[j];
			// 			edgeS.liberties.push( sheep );
			// 		}
			// 		eated.push( sheep );
			// 	}
			// 	else if(sheep.connected.length > 0 && sheep.liberties.length == 0)
			// 	{
			// 		var theSheepF = sheepIsSurrounded( sheep );
			// 		function sheepIsSurrounded( cSheep )
			// 		{
			// 			cSheep.covered = true;
			// 			var countSheep = 0;
			// 			for(var i = 0; i < cSheep.connected.length; i++)
			// 			{
			// 				var conSheep = cSheep.connected[i];
			// 				if(!conSheep.covered)
			// 				{
			// 					if(conSheep.liberties.length == 0)
			// 					{
			// 						if(conSheep.connected.length != 0)
			// 						{
			// 							var theSheep = sheepIsSurrounded( conSheep );
			// 							if(theSheep)
			// 							{
			// 								countSheep++;
			// 							}
			// 						}
			// 					}
			// 					else
			// 						countSheep++;
			// 				}
			// 			}
			// 			if(countSheep > 0)
			// 				return true;
			// 			else
			// 				return false;
			// 		}
			// 		for(var  j = 0; j < sheeps.length; j++)
			// 			sheeps[j].covered = false;
					
			// 		if(theSheepF == false)
			// 			eated.push( sheep );
			// 	}
			// }
			// return eated;
		},
		stateManager:function()
		{
			var self = this;
			for(var i = 0; i < self.options.state.length; i++ )
			{
				var house = self.options.state[i];
				house.ocupada = false;
				house.jogador = null;
				$('#'+house.casa).css('background', 'transparent')
				$('#'+house.casa).css('box-shadow', '')
				$('#'+house.casa).show();
				$('#'+house.casa).find('.handcap').show();
				$('#'+house.casa).unbind('click').on('click', function(ev){
					var casa =  $(this).attr("id");
					if(!self.options.haveQuery)
						self.humanPlay( casa );
				})
			}
		},
		statusArc:function( mode )
		{
			//está função serve apenas para mostrar aquela janelinha que aparece abaixo da peça dizendo o estado do sistema, se ele fez um jogada ou se está pensando
			var self = this;
			if(mode == 'display')
			{
				if(self.options.lastPlay != null)
				{
					$('.'+ self.options.notTurn +'-bar').find('.player-status').popover('show');
					$('#'+ self.options.notTurn +'-status').empty().append(''+self.options.lastPlay);
				}
			}
			else if(mode == 'loading')
			{
				$('.'+ self.options.notTurn +'-bar').find('.player-status').popover('hide');
				$('.'+ self.options.turn +'-bar').find('.player-status').popover('show');
				$('#'+ self.options.turn +'-status').empty().append(self.templates.loaderTemplate({
					msg:"O que fazer...",
					fontSize:"14px",
					widthH:"25px",
					heightH:"25px",
					width:"90px"
				}));
				$('.popover-status-'+self.options.turn).css({
					marginLeft:"-45px",
					marginTop:"-2px"
				})
			}
			else if(mode == 'newPlay')
			{
				$('#'+ self.options.turn +'-status').empty().append(self.options.lastPlay);
				var ml = "";//para exibir de forma correndo com base no tamanho ta mensagem a ser exibida, é necessário fazer isso. Caso contrário, a mensagem fica dispersa
				if(self.options.lastPlay !=  "PASS" && self.options.lastPlay != "resign" && self.options.lastPlay != "Novo Início")
					ml = "-8px";
				else if(self.options.lastPlay == "PASS")
					ml = "-18px";
				else if(self.options.lastPlay == "resign")
					ml = "-19px"
				else
					ml = "-35px"
				$('.popover-status-'+self.options.turn).css({
					marginLeft: ml,
					marginTop:"-2px"
				})
			}
		},
		territoryArc:function( wolf )
		{
			// o techo abaixo ainda está em desenvolvimento....
			var self = this;
			var territoryEdges = [];
			var eated = [];
			var id = ""
			var territories = [];
			var nonTerritory = [];
			for(var i = 0; i < wolf.liberties.length; i++)
			{
				var libertieW = wolf.liberties[i];
				if(libertieW.ocupada)
				{
					if(libertieW.jogador == self.options.turn)
					{
						wolf.connected.push( libertieW );
						libertieW.connected.push( wolf );
						//--------------------------versão 1.06-----------------------------------

						var result = self.getTerritoryByContains( libertieW.casa, self.options.turn );
						if(result != -1)
						{
							if(id.search( result.territory.id ) == -1)
							{
								id += result.territory.id;
								territories.push({territory:(self.options.territory.splice(result.indice,1))[0]});
							}
						}
						else
							nonTerritory.push( libertieW );

					//--------------------------versão 1.05----------------------------------	
						// var founded = false;
						// for(var j = 0; j < self.options.territory.length; j++)
						// {
						// 	if(self.options.territory[j].jogador == self.options.turn)
						// 	{
						// 		if(self.options.territory[j].id.search(libertieW.casa) != -1 && id.search(self.options.territory[j].id) == -1)
						// 		{
						// 			id += self.options.territory[j].id;
						// 			territory.push({liber:libertieW,terry:(self.options.territory.splice(j,1))[0]});
						// 			founded = true;
						// 			break;
						// 		}
						// 	}
						// }
						// if(!founded)
						//	nonTerritory.push( libertieW );
					//------------------------------------------------fim
							
					}

					for(var j = 0; j < libertieW.liberties.length; j++)
					{
						var libertie = libertieW.liberties[j];
						if(libertie.casa == wolf.casa)
						{
							libertieW.liberties.splice(j, 1);
							wolf.liberties.splice(i, 1);
							i--;
							break;
						}
					}
				}
			}
			var finalTerry = {jogador:self.options.turn,id:wolf.casa,members:[wolf]}
			if(territories.length > 0)
			{
				for(var i = 0; i < territories.length; i++)
				{
					finalTerry.id += territories[i].territory.id;
					for(var j = 0; j < territories[i].territory.members.length; j++)
					{
						finalTerry.members.push(territories[i].territory.members[j]);
					}
				}
				for(var i = 0; i < nonTerritory.length; i++)
				{
					finalTerry.id += nonTerritory[i].casa;
					finalTerry.members.push(nonTerritory[i]);
				}
				self.options.territory.push( finalTerry );
			}
			else if( wolf.connected.length > 0)
			{
				for(var i = 0; i < wolf.connected.length; i++)
				{
					finalTerry.id += wolf.connected[i].casa;
					finalTerry.members.push(wolf.connected[i]);
				}
				self.options.territory.push( finalTerry );
			}
		},
		umberArc:function()
		{
			var self = this;
			//alert("As vezes para proseguir, é necessário morrer.");
			//-----------------------------------------------------------ID do estado-----------------
			var blackStones =  self.getStones("black");//necessário saber quais peças da cor X está no tabuleiro
			var whiteStones =  self.getStones("white");
			
			var stateID =  "";//é formado por todas as casas que estão ocupádas seguidos pela cor e por fim, o jogador que efetuara a jogada
			for(var i = 0; i < blackStones.length; i++)
				stateID += blackStones[i].casa +"-b-"//adiciono ao nome do estado o identificador da casa e o -b-, idicando que ali tem uma peça preta
			for(var i = 0; i < whiteStones.length; i++)
				stateID += whiteStones[i].casa +"-w-"//mesma coisa do for acim porém, -w-, identifica a cor branca
			stateID += self.options.turn;//adiciono ao nome do estado o jogador
			//OBS.: O estado é único, ou seja, é impossível haver dois estados distintos que gerem o mesmo ID do estado
			//----------------------------------------------------Fim Id Do Estado----------------------
			var requestState = {method:"getState",params:{stateID : stateID}}//requisição que será enviado ao servidor node.js (diretório: servidor, arquivo: aplicationManager.js)
			$.api( requestState, function(response)
			{//$.api é a função tal qual envia uma request X ao servidor node.js, quando o servidor responder, a função callback será convocada
				var played =  response;//é o estado e a jogada que foi feita. Será nulo se em nenhum momento anterior caiu neste estado
				var newPlay = null;//será a jogada que o algoritmo genético irá retornar (umberMind);
				var afterScore = null;// é a pontuação da partida após a jogada feita.
				var beforeScore = null;// é a pontuação da partida antes da jogada - Sempre vai ser o mesmo para o estado
				var historyLog = "";
				if(played != null)
				{
					beforeScore = played.beforeScore;
					afterScore = played.afterScore;
					historyLog = played.historyLog;
				}
				self.options.possiblesPlays = [];
				self.options.possiblesPlaysAux = [];
				// É necessário gerar, apenas jogadas válidas e para tal é necessário conhecer todas as possíveis jogadas. 
				// Além disso, é necessário gerar jogadas diferentes das que já foram jogadas para o estado atual
				for(var i = 0; i < self.options.state.length; i++)
				{
					var isValid = self.validatePlay(self.options.state[i]);
					if(isValid == true && historyLog.search(self.options.state[i].casa) == -1)
					{	
						self.options.possiblesPlays.push(self.options.state[i]);
						self.options.possiblesPlaysAux.push(self.options.state[i]);
					}
					else if(isValid == "not-free")
						console.log("A casa já tem peça :(");
					else if(isValid == "ko")
						console.log("Está jogada não pode ser feita neste turno....");
					else if(isValid == "suicide")
						console.log("Está jogada é suicidio...");
					else if(historyLog.search(self.options.state[i].casa) != -1)
						console.log(self.options.state[i].casa)
				}
				var genesis = []; // população inicial do algoritmo genético (umberMind)
				if(self.options.possiblesPlays.length > 1 && self.options.possiblesPlays.length <= self.options.maxFolks)// se o número de jogadas for menor que o minimo (self.options.maxFolks), usarei todas elas.
					for(var i = 0; i < self.options.possiblesPlays.length; i++)
					{
						genesis.push(self.options.possiblesPlays[i]);
						self.options.possiblesPlays.splice(i, 1);//removo a possível jogada do array de jogadas possíveis, pois, já será avaliada
						i--;
					}
				else if(self.options.possiblesPlays.length > self.options.maxFolks)
					for(var i = 0; i < self.options.maxFolks; i++)
					{
						var rand = Math.floor(Math.random() * self.options.possiblesPlays.length);//sorteio uma jogada dentre as possíveis
						genesis.push(self.options.possiblesPlays[ rand ]);
						self.options.possiblesPlays.splice(rand, 1);
					}
				else if(self.options.possiblesPlays.length == 1)
					newPlay = self.options.possiblesPlays[0];
				else if(historyLog.search("PASS") == -1)//sei que as possiveis jogadas foram todas já processadas. Então é necessário saber se já processi a jogada "PASS"
				{
					newPlay = 
					{
						casa:"PASS"
					}
				}
				else//se cair aqui, tudo já foi mapeado
					newPlay = "PlayBest";

				//o jogador sempre irá passar quando não houver mais jogadas possíveis.
				//porém, as vezes passar é a melhor do que jogar. Porém, as vezes se passar ao invez de defender pode-se perder território
				//-----------------------------------------------------UMBER MIND (AG)
				//chamo a umberMind passando a população inicial e o número da iteração.
				//console.log(self.options.possiblesPlaysAux);
				if(newPlay == null)
					newPlay = self.umberMind(genesis, 1);
				console.log(newPlay);
				//-----------------------------------------------------fim UMBER MIND
				//em um futuro proximo, ver a viabilidade de armazenar o CONJUNTO de estados.;
				var requestP = {method:'doPlay',params:{casa:newPlay.casa,jogador:self.options.turn}}
				var requestScore = {method:"doCommand", params:{command:"estimate_score"}}
				var requestUndo = {method:"undoPlay", params:{undoN:1}}
				$.api(requestP, function(responseP)//faço o GNUGO fazer a jogada eleita pelo UMBERGO
				{
					$.api(requestScore, function(responseS)//solicito uma estimativa de pontuação, no cenário onde eu aplico a jogada feita pelo UMBERGO
					{
						var newScore = (responseS.result.split("("))[0];//newScore recebe a pontuação da partida após simulada a jogada
						newScore = newScore.toLowerCase();
						var winning = false;
						if(newScore.search(self.options.turn[0])!= -1)//se na pontuação recebida, tiver a letra inicial de um dos jogaores, significa que é uma situação favoravél, ou seja, estou ganhando.
							winning = true;
						$.api(requestUndo, function(responseUndo)//faço o gnugo desfazer a jogada eleita pelo umberGO
						{
							if(played != null)// se o estado não for novo.
							{
								if(newPlay != "PlayBest")//se já tiver processado todas as jogadas possíveis, eu faço a melhor jogada registrada.
								{	
									var oldStateIsBetter = false;// se a jogada já feita for melhor que a nova, eu jogo a antiga.
									var newScoreF = parseFloat((newScore.split("+"))[1])//pego só a parte númerica da pontuação nova
									var afterScoreF = parseFloat((afterScore.split("+"))[1])
									if(winning == played.winning && winning == true)//se tanto na jogada já feita para este estado quanto na nova eu estiver vencendo....									
									{
										if(newScoreF < afterScoreF)//a melhor jogada é a que tiver o score maior
											oldStateIsBetter = true;
									}
									else if(played.winning == true && winning == false)
									{
										oldStateIsBetter = true;
									}
									else if(winning == played.winning && winning == false)
									{
										if(newScoreF > afterScoreF)
											oldStateIsBetter = true;
									}

									if(oldStateIsBetter)
									{
										var requestU = {
											method:"updateState",
											params:
											{
												newState:{
													stateID:played.stateID,
													casa:played.casa,
													winning:played.winning,
													afterScore:played.afterScore,
													beforeScore:played.beforeScore,
													historyLog:played.historyLog+newPlay.casa
												},
												oldState:
												{
													stateID:played.stateID
												}
											}
										}
										$.api(requestU, function( responseU )
										{
											self.options.lastPlay = played.casa;
											self.gnuGO("play")
										})
									}
									else
									{
										var requestU = {
											method:"updateState",
											params:
											{
												newState:{
													stateID : played.stateID,
													casa : newPlay.casa,
													winning : winning,
													afterScore : newScore,
													beforeScore : beforeScore,
													historyLog : played.historyLog+newPlay.casa
												},
												oldState:
												{
													stateID:played.stateID
												}
											}
										}
										$.api(requestU, function( responseU )
										{
											self.options.lastPlay = newPlay.casa;
											self.gnuGO("play")
										})
									}
								}
								else
								{
									self.options.lastPlay = played.casa;
									self.gnuGO("play")
								}
							}
							else
							{
								$.api(requestScore, function(responseS)
								{
									beforeScore = (responseS.result.split("("))[0];
									beforeScore = beforeScore.toLowerCase();
									var request = {
										method:"newState",
										params:{
											stateID:stateID,
											casa:newPlay.casa,
											winning:winning,
											afterScore:newScore,
											beforeScore:beforeScore,
											historyLog:""+newPlay.casa
										}
									}
									$.api(request, function( response )
									{
										self.options.lastPlay = newPlay.casa;
										self.gnuGO("play")
									})
								})
							}
						})
					})
				})
			})
		},
		umberAvaliate:function( cromon )
		{
			var self = this;
			cromon.pontuation = 1;
			for(var i = 0; i < cromon.edges.length; i++)
			{
				var edge = cromon.edges[i];
				if(edge.ocupada && edge.jogador != self.options.turn)
				{
					//inimigo
					for(var j = 0; j < edge.liberties.length; j++)
					{
						if(edge.liberties[j].casa  == cromon.casa)
						{
							cromon.pontuation += 30;
							if(edge.connected.length > 0)
							{
								//é um território inimigo
								//var territoryLiberties = []; -- poderia usar isso como uma variavél global contendo as informações sobre a liberdades do território inimigo
								// e desta forma criar uma estratégia para cercar as liberdades que o inimigo possui.
								//Porém, para o momento irei pontuar apenas se a jogada gerada pode ou não, ocupar uma das liberdades.
								var result =  self.getTerritoryByContains( edge.casa, self.options.notTurn );
								if(result != -1)
								{
									var libertiesCount = 0;
									for(var j = 0; j < result.territory.members.length; j++)
									{	
										libertiesCount += result.territory.members[j].liberties.length;
									}

									var more = 101 - libertiesCount;
									cromon.pontuation += more;
								}
							}
							break;
						}
					}
				}
				else if( edge.ocupada && edge.jogador == self.options.turn)
				{
					//colega
					var result =  self.getTerritoryByContains( edge.casa, self.options.turn );
					if(result != -1)
					{
						cromon.pontuation += result.territory.members.length * 10;
					}
				}
			}
		},
		umberCrossover:function( population )
		{
			var self = this;
			var fertile = self.umberFertile( population, self.options.maxPoints);// A função umberFetilePopulation serve para remover individuos "não ferteis"
			//e devolve uma estutura com os elementos e suas possíveis combinações e também a casa oriunda da combinação.
			//faço isso para evitar que eu fique buscando por uma combinação válida por muito tempo. Em alguns casos uma combinação possível é tão escaça que
			//ultrapassa o máximo de chamadas recursisvas nativo do JS
			
			//-------------------------------------------------Sorteio de quem vai ser o PAI
			// este metodo de sorteio é o da roleta e é descrito no site utilizado como base... http://www.obitko.com/tutorials/genetic-algorithms/
			if(fertile.population.length > 0)	
			{
				var rand = Math.floor(Math.random() * fertile.maxPoints );//de 0 até a pontuação máxima dos possíveis país.
				var max = 0;//é o somatório dos elementos já covereds.
				for(var i = 0; i < fertile.population.length; i++)
				{
					max += fertile.population[i].father.pontuation;
					if(rand <= max)
					{
						var father = fertile.population[i];
						var maxPointsCombinations = 0;//acumula a pontuação das possíveis mães que combinam com o elemento atual.
						for(var j = 0; j < father.combinations.length; j++)
							maxPointsCombinations += father.combinations[j].mother.pontuation;

						var momRand = Math.floor(Math.random() * maxPointsCombinations );//sorteio um número entre 0 e o númeor máximo de pontos das mães
						var momMax = 0;
						for(var j = 0; j < father.combinations.length; j++)
						{
							momMax += father.combinations[j].mother.pontuation;
							if(momRand <= momMax)// se o valor sorteado for menor que somatório até aqui, significa que este elemento é a mãe
								return (self.options.possiblesPlays.splice(father.combinations[j].indice, 1))[0]//Removo o elemento resultante do cruzamento
							//do array de possiveis jogadas e retorno este elemento
						}
					}
				}
			}
			else//caso não haja mais ´possíveis combinações ... o número da população acabapor aqui.... quem sabe na proxima geração :)
				return "A população não é capaz de gerar mais jogadas... :(";
		},
		umberFertile:function(population, maxPoints)
		{
			var self = this;
			var fertile = [];//estrutura contendo individuos que consigam se combinar com outros e conseguem gerar jogadas válidas.
			for(var i = 0; i < population.length; i++)
			{
				var combinations = [];//contém todas as possíveis combinações validas do individuo
				var isFertile = false;//se tievr pelo menos 1 combinação válida
				for(var j = 0; j < population.length; j++)
				{
					if(j != i)//se o elemento "pai" não for o elemento "mãe" (ele com ele mesmo)
					{
						for(var k = 0; k < self.options.possiblesPlays.length; k++)
						{
							var possible = self.options.possiblesPlays[k];
							var casa = population[i].casa[0] + population[j].casa[1];
							if(possible.casa == casa)//Se a combinação do individuo pai com o individuo mãe for possível, ou seja, gerar um jogada válida
							{
								combinations.push({mother:population[j], child:casa, indice:k})//adiciono como uma possível combinação
								isFertile = true;
							}
						}
					}
				}
				if(isFertile)
					fertile.push({father:population[i], combinations:combinations});
				else
					maxPoints -= population[i].pontuation;//se não for fértil, retiro do maximo de pontos a pontuação do elemento estéril.
			}
			return {population:fertile, maxPoints:maxPoints};//retorno os elementos férteis e também o somatório da pontuação deles.
		},
		umberGO:function()
		{
			var self = this;
			self.options.haveQuery = true;
			if(self.options.forfeit < 2)	
			{
				self.statusArc( 'loading' )
				self.umberArc( self.options.turn );
			}
			else
			{
				self.options.haveQuery = false;
				self.scoreMatch()
			}
		},
		umberMind:function( population, geration )
		{
			var self = this;
			var newPopulation = []//será usado para a proxima iteração do algoritmo;
			self.options.maxPoints = 0;//É o somatório da pontuação de todos os individuos. Está variavél é usada para sortear os "pais"
			//---------------------------------avaliar cada menbro da população
			for(var i = 0; i < population.length; i++)
			{
				self.umberAvaliate(population[i]);
				self.options.maxPoints += population[i].pontuation;
			}
			//após avaliar, o techo abaixo de código, ordena o array em ordem decrescente de pontuação
			population.sort(function (a, b) {
			  	if (a.pontuation > b.pontuation) {
			    	return -1;
			  	}
			  	if (a.pontuation < b.pontuation) {
			    	return 1;
			  	}
			  	return 0;
			})
			//-------------------------------fim da avaliação

			//se o número de possiveis jogadas no ato de criar a população genesis for 10 ou menor, todas as possivéis jogadas serão avaliadas :)

			//se não tiver acabado o número de iterações máxima e ainda não tiver acabado o número de possiveis jogadas
			if(geration < self.options.maxGerations && self.options.possiblesPlays.length > 0)
			{
				geration++;
				//Elitismo - Assim como na natureza, os genes mais fortes PERDURAM POR ENTRE AS GERAÇÕES! Os dois melhores perduram.
				newPopulation.push(population[0]);
				newPopulation.push(population[1]);
				//poderia adaptar, para sempre gerar individuos diferentes, dada um número x de interações, todos as possiveis jogadas seriam avalidas.
				//mas para ser fiel ao algoritmo genético, irei criar 10 individuos, podendo ser jogadas novas ou não.
				//o modo como está implementado, pode ser que eu percorra todas as jogadas possíveis ou não :)
				var n = 0;
				if(self.options.possiblesPlays.length <= 10)
					n = self.options.possiblesPlays.length;
				else
					n = 10;

				for(var i = 0; i < n; i++)
				{
					var rand = Math.floor((Math.random() * 100)+1)
					var newCromon = null;
					if(rand <= self.options.criticalChance)
						newCromon = self.umberMutation();// poderia fazer a mutação apenas gerar "jogadas" que o cruzamento não pudesse gerar, ou gerar apenas jogadas possíveis e não avaliadas
					else
					{
						newCromon = self.umberCrossover(population);// poderia alterar o cruzamento para gerar apenas cruzamentos com jogadas possíveis.
					}
					
					if(newCromon == "A população não é capaz de gerar mais jogadas... :(")
						break;
					else
						newPopulation.push(newCromon);
				}
				return self.umberMind( newPopulation, geration);//uma nova iteração para avaliar novas jogadas
			}
			else
				return population[0];//O melhor resultado obtido.
		},
		umberMutation:function()
		{
			var self = this;
			console.log("ARRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGGGGGGGGGGGGGGGGGGGG MUTAAAAAAAAAAAAAAAAÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇAÃAÃAÃAÃAÃAÃAÃAÃAÃAÃAÃAÃAÃoOo0oOo0oOo0oOo0!")
			console.log("Sniff Sniff, Talvez seja bom :), talvez seja ruim :(.... Quem é que sabe ?");
			var rand = Math.floor(Math.random()* (self.options.possiblesPlays.length -1))
			return (self.options.possiblesPlays.splice(rand, 1))[0];
		},
		umberPlay:function( play )
		{
			var self = this;
			self.options.lastPlay = play;
			//só chamar o gnugo com a jogada, as linhas abaixo são desnecessárias
			//self.gnuGO("play")
			self.options.haveQuery = false;
			self.statusArc( 'newPlay' );
		},
		validatePlay:function( house )
		{
			var self = this;
			if(house.ocupada)
			{
				if(house.ocupada == "ko")
					return "ko"
				else
					return "not-free";
			}
			else
			{

				for(var i = 0; i < house.edges.length; i++)
				{
					if(!house.edges[i].ocupada)
						return true;
				}

				//------------------------------------versão 1.06-------------------------------

				var isPossible = false;
				for(var i = 0; i < house.edges.length; i++)
				{
					var edge = house.edges[i];
					if(edge.jogador == self.options.turn)
					{
						if(edge.connected.length > 0)
						{
							var result = self.getTerritoryByContains( edge.casa, self.options.turn );
							var libertiesID = "";
							for(var j = 0; j < result.territory.members.length; j++)
							{
								for(var k = 0; k < result.territory.members[j].liberties.length; k++)
								{
									if(libertiesID.search(result.territory.members[j].liberties[k].casa) == -1)
										libertiesID += result.territory.members[j].liberties[k].casa;
								}
							}
							if(libertiesID != "" && libertiesID != house.casa )
								isPossible = true;

						}else if(edge.liberties.length > 1)
						{
							isPossible = true;
						}
					}
					else if(edge.jogador == self.options.notTurn)
					{
						if(edge.connected.length > 0)
						{
							var result = self.getTerritoryByContains( edge.casa, self.options.notTurn );
							var libertiesID = "";
							for(var j = 0; j < result.territory.members.length; j++)
							{
								for(var k = 0; k < result.territory.members[j].liberties.length; k++)
								{
									if(libertiesID.search(result.territory.members[j].liberties[k].casa) == -1)
										libertiesID += result.territory.members[j].liberties[k].casa;
								}
							}
							if(libertiesID == house.casa )
								isPossible = true;
						}else if(edge.liberties.length == 1)
						{
							isPossible = true;
						}
					}
				}
				if(isPossible == true)
					return isPossible
				else 
					return "suicidio"
			}
				//-------------------------------------------------versão 1.05----------------------------------
				// for(var  i = 0; i < house.edges.length; i++)
				// 	if(!house.edges[i].ocupada || house.edges[i].jogador == self.options.turn)//se for uma jogada aonde é a única "liberdade" de um grupo de peças é suicidio.
				// 		return true
				// //se passar do for quer dizer que a jogada a ser feita é uma jogada onde não há liberdades;
				// //jogadas suicidas são apenas possíveis quando são movimentos de captur ou seja, se a única liberdade de um grupo de 
				// //peças for aquela.
				// for(var  i = 0; i < house.edges.length; i++)
				// {
				// 	var edge =  house.edges[i];
				// 	if(edge.connected.length == 0)
				// 	{
				// 		if(edge.liberties.length >= 1)
				// 			return true;
				// 		else
				// 			//mesmo aqui é possível que a jogada feita seja para remover a única liberdade existente. É necessário validar isso daqui!
				// 			return "suicide";//pode ser uma jogada não suicidade que mesmo que não tenha conexões e não tenha libredades

				// 	}
				// 	else
				// 	{
				// 		return true;
				// 	}
				// }
		}
	}
	$.fn.appAplicationArc = function ( options ) {//ao fazer isso, eu digo que appAplicationArc é uma função global! Todos os arquivos adicionados no index.html posteriormente a este, conhecerão este metodo
		var appAplicationArc = Object.create( aplicationArc );//seguindo o modelo de APP estipulado pelas boas praticas de JS, lá em cima tem a var aplicationArc, está var é convertida como um objeto, assumindo metodos e caracteristicas comuns a POO
		return appAplicationArc.init( options, this, '/templates/aplicationArc.html');//chamo o metodo INIT passando options que pode ser qualquer coisa, o this que é a referencia para o proprio objeto e o elemento HTML que o chamou e também o template, que é onde está estipulado o tabuleiro e afins.
		$.data( this, 'appAplicationArc', appAplicationArc );//
	};
})(jQuery, window, document);









/*
							var afterDiference = "";
								var beforeDiference = "";
								if(newScore.search('b') == -1)
								{
									if(self.options.turn == 'black')
										beforeDiference = "ganhando"
									else
										beforeDiference = "perdendo"
								}
								else
								{
									if(self.options.turn == 'white')
										beforeDiference = "ganhando"
									else
										beforeDiference = "perdendo"
								}

								if(score.search('b') == -1)
								{
									if(self.options.turn == 'black')
										afterDiference = "ganhando"
									else
										afterDiference = "perdendo"
								}
								else
								{
									if(self.options.turn == 'white')
										afterDiference = "ganhando"
									else
										afterDiference = "perdendo"
								}

								score = parseFloat((score.split("+"))[1]);
								newScore = parseFloat((newScore.split("+"))[1]);
								console.log(score)
								console.log(newScore)

								if(afterDiference == beforeDiference && afterDiference == "ganhando")
								{
									if(score < newScore)
									{
										
									}
									else if(score == newScore && newPlay == "PASS")
									{

									}
									else
									{
										console.log("A antiga é melhor.........");
									}
								}
								else if(afterDiference == beforeDiference && afterDiference == "perdendo")	
								{
									if(newScore <= score)
									{
										console.log("A nova jogada pode salvar! :)")
									}
									else if(newScore == score && newPlay == "PASS")
									{

									}
									else
									{
										console.log("A antiga é melhor.........");
									}
								}
								else if(afterDiference == "perdendo" && beforeDiference == "ganhando")
								{
									console.log("A nova jogada fede de ruim!")
								}
								else
								{

								}
*/
