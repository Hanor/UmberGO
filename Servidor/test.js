var net = require("net");
var client = new net.Socket();
var end = "\r\n"
client.connect(21548,'127.0.0.1', function(){
	client.write('boardsize 4'+end);
})
var ended = false;
client.on('data', function(data)
{
	data = data.toString();
	data = data.replace("\n\r","");
	data = data.replace("\r","");
	data = data.replace("\n","");
	data = data.replace("=","");
	data = data.replace(" ","");
	data = data.replace("=","");
	if(data == "PASS" || data == "resign")
	{
		client.write('showboard'+end)
	}
	else
		newMove();
})
var who = true;
function newMove()
{
	if(who)
	{
		client.write('genmove white'+end);
		who = false;
	}
	else
	{
		client.write('genmove black'+end);
		who = true;
	}
}


