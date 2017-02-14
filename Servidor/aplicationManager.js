
// ------------------------------------------------------------------------ Funções----------------------------------------
//trata todas as requisições que chegam até aqui
function apiArc(request, conn)
{
	if(request.data.method == "getState")
	{
		mongoDBIterator( "umberDB", "UmStates", "find", request.data.params, conn)
	}
	else if( request.data.method == "newState")
	{
		mongoDBIterator( "umberDB", "UmStates", "insert", request.data.params, conn)
	}
	else if( request.data.method == "updateState")
	{
		mongoDBIterator( "umberDB", "UmStates", "update", request.data.params, conn)
	}else if( request.data.method == "getBoard")
	{
		lastRequest = "getBoard"
		getBoard( request.data );
	}else if(request.data.method == "generatePlay")
	{
		lastRequest = "generatePlay_"+request.data.params.jogador;
		generatePlay( request.data )
	}
	else if(request.data.method == "doCommand")
	{
		doCommand( request.data );
	}
	else if(request.data.method == "doPlay")
	{
		doPLay( request.data );
	}
	else if(request.data.method == "undoPlay")
	{
		undoPlay( request.data )
	}
}
//envia um commando para o gnugo
function doCommand( request )
{
	console.log(request.params.command)
	if(request.params.command == "final_score")
		client.importantCommand = true;

	if(request.params.command == "estimate_score")
		client.importantCommand = true;

	if(request.params.command == "is_legal")
		client.importantCommand = true;

	client.write(request.params.command+""+end);
}
//atualiza o GNUGO com a jogada feita no frontend
function doPLay( request )
{
	console.log("play "+request.params.jogador+" "+request.params.casa)
	client.write("play "+request.params.jogador+" "+request.params.casa+""+end);
}
//faz com que o gnugo gere um jogada.
function generatePlay( request )
{
	client.write("genmove "+request.params.jogador+end)
	client.importantCommand = true;
}
//desfaz a ultima jogada feita
function undoPlay( request )
{
	client.write("gg-undo "+request.params.undoN+end)
}

//contém todas as funções inerentes a manipulação e comunicação com o mongodb
function mongoDBIterator( dataBase, collection, operation, req, conn)
{	
	var dbOperations =
	{
		init : function( dataBase, collection, operation, req, conn)
		{
			var self = this;
			self.dataBase = dataBase;
			self.collection = collection;
			self.operation = operation;
			self.req = req;
			self.result = null;
			
			return self.setup( );
		},
		setup: function()
		{
			var self = this;
			return self.connectionArc();
		},
		connectionArc: function()//estabelece conexão com o mongo db e a base de dados presente no mongo que será utilizada
		{
			var self = this;

			var MongoClient = require('mongodb').MongoClient;
			MongoClient.connect("mongodb://127.0.0.1:27017/"+ self.dataBase +"", function(err, db) {
			  	if(!err) {
			  		self.dataBase = db;
					if(self.operation == "find")
						self.findItem();
					else if( self.operation == "insert")
						self.insertItem();
					else if(self.operation == "remove")
						self.removeItem();
					else if(self.operation == "update")
						self.updateItem();
			  	}
			  	else
			  	{
			  		console.log(err)
			  	}
			});
		},
		findItem : function()//busca um estado segundo o id do mesmo
		{
			var self = this;
			return 	self.dataBase.collection( self.collection ).findOne( self.req, function(err, result){
				self.dataBase.close();
				if(!err)
					responseArc( result, false, conn )
				else
					responseArc( err, "erro", conn )
			});
		},
		insertItem : function()//insere um novo estado no banco de dados
		{
			var self = this;
			return 	self.dataBase.collection( self.collection ).insert( self.req, function(err, result){
				self.dataBase.close();
				if(!err)
					responseArc( result, false, conn )
				else
					responseArc( err, "erro", conn )
			});
		},
		removeItem : function()//remove um elemento da base de dados
		{
			var self = this;
			return 	self.dataBase.collection( self.collection ).remove( self.req, function(err, result){
				self.dataBase.close();
				if(!err)
					responseArc( result, false, conn )
				else
					responseArc( err, "erro", conn )
			});
		},
		updateItem:function()//atualiza um objeto presente da base de dados
		{
			var self = this;
			return 	self.dataBase.collection( self.collection ).update( self.req.oldState, self.req.newState, function(err, result){
				if(!err)
					responseArc( result, false, conn )
				else
					responseArc( err, "erro", conn )

				self.dataBase.close();
			});
		}
	}
	return dbOperations.init(dataBase, collection, operation, req);
}
//toda e qualquer resposta de iteração com o mongodb passa por aqui...
function responseArc (result, err, conn)
{
	if(!err)
	{
		conn.send(JSON.stringify(result));//converto a resposta do mongo db para o formato JSON
	}
	else
		console.log( err )
}
//----------------------------------------------------------------------fim funções---------------------------------------

//-----------------------------------------------------------------------variavéis----------------------------------------
var lastRequest = null;
var net = require("net")//digo que vou usar a biblioteca "net" - comunicação do node.js com o gnugo
var WebSocketServer = require('websocket').server;//digo que vou usar a biblioteca de websocket - Esta biblioteca precisa ser instalada via NPM - frontend > backend
var http = require('http');//informo que também irei usar a biblioteca http/

var end = "\n";//sempre que um novo comando for digitado para o gnugo o \n deve ser adicionado ao termino da instrução
var connection = null;//será a conexão com o frontend.

var server = http.createServer(function(request, response) {});
server.listen(3000, function() { });

var wsServer = new WebSocketServer({
    httpServer: server//abro a porta 3000 e espero o cliente se conectar
});

var client = new net.Socket();//crio um "objeto" da biblioteca nativa do node.js de comunicação via socket

//--------------------------------------------------------------------------fim variavéis

//-----------------------------------------------------------------------gerenciamento das conexões-------------------------------------

client.connect(20000, '127.0.0.1', function()//crio uma conexão com o gnugo que está operando em modo protocolo de texto
{
	client.importantCommand = false;//criação da variavél de comando importante
	client.write('boardsize 9'+end)//defino que o tamanho do tabuleiro será de 9x9
})

wsServer.on('request', function(request) {
    connection = request.accept(null, request.origin);
    connection.on('message', function(message) {//sempre que o frontEND me enviar alguma requisição
        var request = JSON.parse(message.utf8Data);
        apiArc( request, connection );//faço o tratamento da requisição e chamo a função responsável pelo tratamento e resposta
    });

    connection.on('close', function(connection) {//quando o frontEND encerrar a conexão
    });
});
client.on('data', function( data )//sempre que o gnugo responder ou me enviar algo, o techo abaixo será executado
{
	var responseGNU = data.toString('utf8');
	responseGNU = responseGNU.replace(/\r\n|\n\n|=| |\?|\n/g,"");//porque o gnugo coloca um monte de \n\r e blablabla sabe Deus porque...
	if(connection != null)//se a conexão ainda existir
	{

		if(responseGNU.search("invalid")!= -1)// se a resposta tiber "invalid" eu mostro que é invalido no console do node.js. Isso é exbido quando uma jogada é irregular,
			console.log( responseGNU )
		console.log(responseGNU)
		if((client.importantCommand && responseGNU != "") || (!client.importantCommand))//se for um comando importante que eu desejo saber a resposta, só respondo quando a resposta correta for recebida!
		{
			var response = {
				result: responseGNU
			}
			client.importantCommand = false;
			connection.send(JSON.stringify(response));//na conexão estabelicida com do frontEnd com o backend, quando do o .send, envio uma resposta pra lá.
			//vale lembrar que o sistema frontend fica bloqueado a cada requisição.
		}
	}
})

//-------------------------------------------------------------------------------fim