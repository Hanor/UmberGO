$.drawBoard = function( self )
{
	var idsC = 0;
	for(var i = 0; i <81; i++ )
	{
		self.options.state.push(new $.houseStruct());
	}
	for(var i = 0; i < 9; i++)
	{
		var letra = self.options.letras[i];
		self.$elem.find('.tabuleiro').append(self.templates.boardTemplate({
			top:(i*100)-10,
			left:(i*100),
			letra:letra,
			numero:i+1
		}))
		for(var j = 0; j < 9; j++)
		{
			if( (i == 2 && j == 2) || (i == 4 && j == 2) || (i == 6 && j == 2) || (i == 2 && j == 4) || (i == 2 && j == 6) || (i == 4 && j == 4) || (i == 4 && j == 6) || (i == 6 && j == 4) || (i == 6 && j == 6))
			{
				//handcap
				self.$elem.find('.tabuleiro').append(self.templates.pieceTemplate({
					id:letra+(j+1),
					top:(100*i)-20,
					left:(100*j)-20,
					handcap:true
				}))
			}
			else
			{
				self.$elem.find('.tabuleiro').append(self.templates.pieceTemplate({
					id:letra+(j+1),
					top:(100*i)-20,
					left:(100*j)-20
				}))
			}
			if(i < 8 && j < 8)
			{
				self.$elem.find('.tabuleiro').append('<div id=house'+idsC+' class = "house"></div>');
			}
			self.options.state[idsC].casa = letra+(j+1);
			if(j+1 < 9)
			{
				self.options.state[idsC].edges.push(self.options.state[idsC+1]);
				self.options.state[idsC].liberties.push(self.options.state[idsC+1]);
			}
			if(j-1 >= 0)
			{
				self.options.state[idsC].edges.push(self.options.state[idsC-1]);
				self.options.state[idsC].liberties.push(self.options.state[idsC-1]);
			}

			if(i+1 < 9)
			{
				self.options.state[idsC].edges.push(self.options.state[idsC+9]);
				self.options.state[idsC].liberties.push(self.options.state[idsC+9]);
			}
			if(i-1 >= 0)
			{
				self.options.state[idsC].edges.push(self.options.state[idsC-9]);
				self.options.state[idsC].liberties.push(self.options.state[idsC-9]);
			}
			idsC++;
		}
	}

	$('#info-board').css({
		marginTop:(($('body').height())/2)-100+'px'
	})
	var margin = (($('body').width() - 1140)/2);
	$('.window').css('margin-left', margin+'px')
}

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

$.interfaceEvents = function ( self )
{

	//-----------------------------------------eventos de mouse over-----------------------

	$('.play-umber-go').on('mouseover', function()
	{
		$(this).tooltip('show');
	})
	$('.play-gnu-go').on('mouseover', function()
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

	$('.black-bar').find('.player-status').on('mouseover', function()
	{
		$(this).tooltip('show');
	})

	$('.black-bar').find('.player-status').on('mouseleave', function()
	{
		$(this).tooltip('hide');
	})

	$('.white-bar').find('.player-status').on('mouseover', function()
	{
		$(this).tooltip('show');
	})

	$('.white-bar').find('.player-status').on('mouseleave', function()
	{
		$(this).tooltip('hide');
	})
	$('.do-command').on('mouseover', function()
	{
		$(this).tooltip('show');
		$(this).css({
			'text-shadow':'1px 1px 8px rgba(255,255,255,0.9)',
			'background': 'rgba(0,128,128,0.8)',
			'box-shadow': '1px 1px 10px rgba(0,128,128,1)',
		})
	})
	$('.do-command').on('mouseleave', function()
	{
		if(!self.options.command)
		{
			$(this).tooltip('hide');
			$(this).css({
				'text-shadow':'',
				'background': '',
				'box-shadow': '',
			})
		}
	})

	//----------------------------------Mouse-Over-Fim-------------------------------------------------

	//----------------------------------Popover (Janelas de estado que abrem quando se clica com o mouse)
	$('.do-command').popover({
		html:true,
		title:'Digite o comando',
		content: self.templates.commandsTemplate(),
		placement:'bottom'
	})
	$('.white-bar').find('.player-status').popover({
		html:true,
		placement:'bottom',
		template:self.templates.statusPopoverTemplate({colorP:"popover-status-white"}),
		content: "<div id = white-status></div>"
	})
	$('.black-bar').find('.player-status').popover({
		html:true,
		placement:'bottom',
		template:self.templates.statusPopoverTemplate({colorP:"popover-status-black"}),
		content: "<div id = black-status></div>"
	})
	//-----------------------------------Popover Fim---------------------------------------------------

	//-----------------------------------Eventos de click das opções-----------------------------------
	$('.new-game').on('click', function()
	{
		if(!self.options.haveQuery)
			self.newMatch();
	})
	$('.see-score').on('click', function()
	{
		if(!self.options.haveQuery)
			self.scoreMatch()
	})
	$('.play-gnu-go').on('click', function(ev)
	{
		if(!self.options.haveQuery)
			self.gnuGO( "generatePlay" );
	})
	$('.play-umber-go').on('click', function(ev)
	{
		if(!self.options.haveQuery)
			self.umberGO();
	})
	$('.do-command').on('click', function(){
		if(!self.options.haveQuery && !self.options.command)
			self.commandGnuGo();
		else
		{
			$(this).popover('hide');
			$(this).css({
				'text-shadow':'',
				'background': '',
				'box-shadow': '',
			})
			self.options.command = false;
		}
	})

	//-------------------------------------fim dos eventos de click --------------------
}

$.matchEnd =  function ( self )
{
	if(!self.options.haveQuery)
		self.scoreMatch();
}

$.houseStruct = function  ()
{
	this.casa = null;
	this.ocupada = false;
	this.jogador = null; //255 para branco e 0 para preto - Modificado para 'black' ou 'white'
	this.edges = []; // conjunto de todas as edges possiveis da peça em questão.
	this.pontuation = 0; // pontuação da peça de acordo com sua adequação
	this.covered = false;
	this.liberties = [];
	this.connected = [];
}