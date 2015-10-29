//nofuturo separar em quadrantes de jogadas mais eficazes. Deste modo a melhor jogada final eleita pelo AG, será uma das melhores jogadas possiveis, pois, determinados
//setores, são mais faceis de obter terirrotrios ou capturar peças;

//-----------------------------------------------------------------------ESTRUTURA DOS DADOS

function place  ()
{
	this.casa = null;
	this.ocupada = false;
	this.jogador = null; //255 para branco e 0 para preto - Modificado para 'black' ou 'white'
	this.adjacencias = []; // conjunto de todas as adjacencias possiveis da peça em questão.
	this.pontuation = 0; // pontuação da peça de acordo com sua adequação
	this.percorrido = false;
}

//-------------------------------------------------------------------------fim----------------------------------------


function umberProt(tabulerio, played)
{
	var freeHouses = []; //armazena as possiveis jogadas
	for(var i = 0; i < tabulerio.places.length; i++) // for para identificar quais jogadas são possiveis
	{
		if(!tabulerio.places[i].ocupada && !isDead( tabulerio.places[i], 'black' ))// este if checa se a casa não está ocupada e se não é um territorio inimigo
		{
			freeHouses.push( tabulerio.places[i] )// se não for territorio inimigo e não for ocupada, é adicionada ao vetor de possiveis jogadas;
		}
		
		resetWalks( tabulerio );//usado para resetar as adjacencias que foram percorridas - Basicamente todas sãop percorridas
	}

	var n = 10; // numero máximo de individuos da população
	var genesis = []; //população inical gerada aleatoriamente entre as possiveis jogadas
	if(freeHouses.length < 10)//se o numero de casas livres for menor que 10, a população tera este tamanho
	{
		for(var i = 0; i < freeHouses.length; i++)
		{
			var cromon  = new place();
			cromon.casa = freeHouses[i].casa;
			cromon.ocupada = true;
			cromon.jogador = 'black';
			cromon.adjacencias = freeHouses[i].adjacencias;
			genesis.push(cromon);
		}
	}
	else
	{
		for(var i = 0; i < n; i++)
		{
			var cromon  = new place();
			var rand = Math.floor(Math.random() * freeHouses.length); // sorteia uma casa dentre as possiveis
			var jogada = freeHouses[ rand ];
			cromon.casa = jogada.casa;
			cromon.ocupada = true;
			cromon.jogador = 'black'; // partindo do ´preço posto que serei as peças pretas
			cromon.adjacencias = jogada.adjacencias;
			genesis.push(cromon);
			freeHouses.splice(rand , 1);//removo o elemento escolhido para que ele não seja novamente escolhido.
		}
	}

	var iteration = 1;// numero da geração
	var solutionCromon = null;
	var play;
	var results =[]
	if(genesis.length > 0)
		play = umberArcAg( genesis, iteration, tabulerio, results);// chamo a função do algoritmo genetico...
	else
		play = 'forfeit'

	return play;
}


function umberArcAg( population, iteration, tabulerio, results)
{

	// Limito o numero de gerações ao maximo de 49, faço isso apenas como mecanismo de limitação
	if(iteration != 50)
	{
		var bestOf = null; // bestOf será populada com o melhor individo da população
		//pontua cada individuo dá população
		
		var maxPoints = 0; // É o somatório da adequação de cada individuo da população.

		// no for abaixo, é percorrido a população atual e cada individuo dela recebe pontos de adequação
		
		//critérios para a adequação peso 100%
		
		// 1° Score que resultada a jogada - peso:0,50 -- não sera usado
		// 2° Territorio gerado ou Wall - peso:0.85
		// 3° quadrante da possivel jogada - quanto mais proximo da borda 0.35 * (1/numero de adjacencias) será adicionado; 
		//Variando de 0.0875 em casos de estar no meio, até 0.175 quanod mais proximo a borda)

		for(var i = 0; i < population.length; i++)
		{
			theCromon(population[i]);
			maxPoints += population[i].pontuation;
			resetWalks(tabulerio)
		}
		//ordena do mais pontuado ao menos pontuado
		population.sort(function (a, b) {
		  	if (a.pontuation > b.pontuation) {
		    	return -1;
		  	}
		  	if (a.pontuation < b.pontuation) {
		    	return 1;
		  	}
		  	return 0;
		})

		results.push({geration:iteration, best:population[0]}) //individuo melhor da população salvo :) - Melhor jogada da população.
		var newPopulation = [];
		
		newPopulation.push(population[0]);// o melhor da população
		newPopulation.push(population[1]);// o segundo melhor da população
		// geração da nova populãção
		
		var badBlocks = []; // para armazenar os itens que geram individuos invalidos

		for(var i = 0; i < 8; i++)//deve ser feito o ajuste da nova população de acordo com o tamanho da população.
		{
			cromoGenerate();
			function cromoGenerate ()
			{
				var newCromo = [];
				var father = getTheFather(population, maxPoints);
				var mother = getTheMother(population, maxPoints, father);

				//validar aqui se a posição gerada pelos pais é uma jogada valida
				//________________________________________________________________________________________________________________________________________

				// cruzamento aletório uniforme
				var onlyOne = 0;
				var casa = '';
				for(var j = 0; j < 2; j++)
				{
					if(j == 1)
						casa +='_';
					var rand = Math.floor((Math.random() * 2) + 1); // sorteio se pego o indice do pai ou da mãe
					if(rand == 1)
					{	
						onlyOne ++;
						if(onlyOne!= 2)// garantindo que não seja pego apenas indices do pai
						{
							var house = father.casa.split('_');
							casa += house[j];
						}
						else
						{
							var house = mother.casa.split('_');
							casa += house[j];
						}
					}
					else
					{
						onlyOne --;
						if(onlyOne!= -2)// garantindo que não seja pego apenas indices da mãe
						{
							var house = mother.casa.split('_');
							casa += house[j];
						}
						else
						{
							var house = father.casa.split('_');
							casa += house[j];
						}
					}
				}

				// mutação -  Deve ser melhorada, pois cada individo TEM chance de ser mutado... e não apenas um da população.
				var randMutation = Math.floor((Math.random()*100)+1);

				if(randMutation == 1)
				{
					casa = '' + Math.floor((Math.random()*9)) + '_' + Math.floor((Math.random()*9))
					//console.log('ARRAUAHUAHU MUTAÇÃO FERA! GODZILLA! POSEIDON! @SÁTIRO');
				}
				newPopulation.push(getElementByHouse( tabulerio , casa));
			}
		}
		iteration++;
		
		return umberArcAg(newPopulation, iteration, tabulerio, results);
	}
	else
	{
		return results;
	}
}

function getElementByHouse( tabulerio, casa )
{
	//acha e rretorna uma casa qualquer
	for(var i = 0; i < tabulerio.places.length; i++)
		if(tabulerio.places[i].casa == casa)
			return tabulerio.places[i];
}

function getTheFather(population, maxPoints)
{
	// tanto nesta função quanto na função getTheMother, sorteio um número entre 1 e o valor da adequação total da  população
	var rand = (Math.random() * maxPoints )
	var max = 0;
	for(var k = 0; k < population.length; k++)
	{
		max += population[k].pontuation;
		// este metodo é o da roleta e é descrito no site utilizado como base... http://www.obitko.com/tutorials/genetic-algorithms/
		if(rand <= max)
		{
			return population[k];
		}
	}
}

function getTheMother(population, maxPoints, father)
{
	var rand = (Math.random() * maxPoints)
	var max = 0;
	// a unica diferença da função getTheFather, é que aqui eu checo se o elemento selecionado não é = ao pai.
	for(var k = 0; k <  population.length; k++)
	{
		max += population[k].pontuation;
		if(rand <= max)
		{
			if(father != population[k])
			{
				return population[k];
			}
			else
			{
				return getTheMother(population,maxPoints,father)
			}
		}
	}
}

function resetWalks( tabulerio )
{
	for(var j = 0; j < tabulerio.places.length; j++)
	{
		tabulerio.places[j].percorrido = false;// redefine que a casa não foi percorrida
	}
}

function theCromon(cromon, path)
{
	//dados os critérios previstos como possiveis e finais de pontuação.
	//Apenas a intercalação e o quadrante da jogada importaram como metricas de pontuação :)
	if(!path)
	{
		path = cromon;
		cromon.pontuation = 0;
	}

	path.percorrido = true;

	cromon.pontuation += (((1/(path.adjacencias.length))+1) * 0.35) //0.35 % da pontuação destinada a proximidade das bordas, se o número de adjacencias for menor, significa 
	//que está proximo a base e portanto deve possui uma nota maior
	for(var i = 0; i < path.adjacencias.length; i++)
	{
		if(!path.adjacencias[i].percorrido)
		{
			if(path.adjacencias[i].ocupada && path.adjacencias[i].player == cromon.player)//checa se a adjacencia possui uma peça da mesma cor!
			{
				cromon.pontuation += 0.85;//por ajacencia válida e intercalada.
				theCromon(cromon, path.adjacencias[i]);
			}
		}
	}
}

function isDead( cromon, player )
{	
	cromon.percorrido = true;

	var liberties = cromon.adjacencias.length; // ao termino das iterações se o numero de liberdades for 0 é uma area morta.

	for(var i = 0; i < cromon.adjacencias.length; i++)
	{
		var adj = cromon.adjacencias[i];
		if(!adj.percorrido)//para não percorre eternamente as adjacencias
		{
			if(adj.ocupada && adj.player != player) // se a casa tiver ocupada por uma peça de outro jogador não é uma liberdade.
			{
				liberties --;
			}
			else
			{
				if(isDead(adj, 'black'))// se retornar true quer dizer que é uma area morta, portanto a possivel liberdade é uma rua sem saida
				{
					liberties --;
				}
			}
		}
	}
	if(liberties > 0)
		return false;//no caso de não ser uma zona de morte
	else
		return true;
}
/* Discovery - Analisando os elementos como um todo e observando apenas elementos dá base que possuam aceitabilidade vgood... implica que todo e qualquer
fruto deste experimento possuirá caracteristicas que o fará ser vgood
1 - Fazer com que elementos vgood sejam criados.
2 - Fazer com que elementos vgood sejam interpretaveis e cruzados entre si, afim de verificar se é possivel chegar em elementos distintos aos da base
mas que também iriam compor o cenário de elementos v-good.

3 -  poderia ser maximado o desempenho se a pontuação fosse concebida aos atributos e não dada uma pontuação total.

4 - Algoritmos Geneticos, não seguem todas as leis da biologia. Pois os genes podem ser recessivos e podem vir do passado. 

5 - Elitismo - APlicado para salvar 2 individuos  da população com o maior numero de matches
 */