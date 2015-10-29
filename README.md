# UmberGO
Algoritmo Genético feito em JavaScript para aprender de forma automática a jogar GO.

#Abstract

Author: Hanor Sátiro Cintra
Language: Português-br

Este é um algorimo genético batizado de UmberGO, o umbergo possui como finalidade aprender a jogar go sem a programação de regras, ou seja, ele aprendera a jogar go com base nas decisões já tomadas.

Este projeto foi dividido em duas grandes esferas, o FrontEnd e o BackEnd. No frontend é onde está toda a parte de manipulação da interface e também onde está presente o UMBERGO. O arquivo de controle de eventos da interface possui o nome de common.js e está na pasta /js/core/. A parte do UmberGO e o "coração" deste projeto está no arquivo aplicationArc.js que está no diretório /js/handler/, neste arquivo está toda a parte de algoritmo genético UmberGO e suas respectivas funções, neste projeto foi usado o mongoDB para armazenar o conjunto de jogadas e estados já realizados e o GNUGO (software livre do jogo go) para treinamento e para verificar o SCORE da partida. O backEnd é composto do Node.js, mongoDB e Gnugo. No backend, o arquivo aplicationManager.js dentro da pasta servidor é o controlador e servidor da aplicação, ou seja, ele recebe requisições do frontend e faz o dévido processamento delas. A parte de servidor feita com Node.js é responsavél por comunicar-se com o  mongoDB, fazendo operações de C.R.U.D no banco de dados, e além disso, se comunica com GNUGO que roda em modo Servidor via socket. A comunicação do FrontEnd com o BackEnd ocorre por meio de WebSocket.

Além disso tudo explanado acima, o frontend roda em um servidor Apache Http.

#Instruçoçes de instalação e utilização

Para ser possível executar este projeto, é necessário que seja feito os seugintes passos:

1 - Intalar o Apache HTTP
	1.1 - Após a instalação do apache HTTP é necessário no arquivo de configuração do apache mudar o documentroot para o endereço onde está o index.html (pasta raiz).
	1.2 - Se o apache ainda não estiver rodando, é necessário fazer ele rodar.
2 - Instalar o MongoDB
	2.1 - Após instalar o mongoDB é necessário certificar-se que ele está operacional.
3 - Intalar o Node.js
	3.1 - Após ter instalado o node.js é necessário fazer os seguintes passos:
		3.1.1 - Abra um prompt de comando ou terminal  e digite: npm install mongodb --save
		3.1.2 - Ainda com o prompt de comando ou terminal aberto digite: npm install websocket --save
		----Se algo nos passos 3.1.1 e 3.1.2 falhar, é um erro de configuração do modulo do node.js NPM.----
	3.2 - Se chegou até aqui o node está instalado e pronto para rodar o que é necessário
4 - Abra dois prompts de comando ou terminais
	4.1 - No primeiro prompt de comando ou terminal, vá até a pasta onde está este projeto e mova-se para a pasta gnugo. Quando estiver na pasta do gnugo digite o seguinte comando: gnugo --mode gtp --gtp-listen qualquernúmerodeportalivre
	---ao digitar o comando acima, o gnugo estara rodando em modo servidor de protocolo de texto e o servidor podera se comunicar com ele via socket
	4.2 - No Segundo prompt de comando ou terminal, vá até a pasta onde está este projeto e mova-se para a pasta servidor. Quando estiver na pasta do servidor, digite o seguinte comando: node aplicationManager.js
	---- após digitar este comando o servidor se conectara ao mongodb e ao gnugo, além disso, ficara aguardando conexão de cliente. Por enquanto este projeto é mono cliente.

5 - Se chegoua té aqui, pode desfrutar do jogo e do UMBER GO :)






