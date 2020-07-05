var Region_List = ['BR1', 'EUN1','EUW1','JP1','KR','LA1','LA2','OC1','RU','TR1'];
var champion_id_name = [[1,"Annie"],[2,"Olaf"],[3,"Galio"],[4,"TwistedFate"],[5,"XinZhao"],[6,"Urgot"],[7,"LeBlanc"],[8,"Vladimir"],[9,"Fiddlesticks"],[10,"Kayle"],[11,"Master Yi"],[12,"Alistar"],[13,"Ryze"],[14,"Sion"],[15,"Sivir"],[16,"Soraka"],[17,"Teemo"],[18,"Tristana"],[19,"Warwick"],[20,"Nunu"],[21,"MissFortune"],[22,"Ashe"],[23,"Tryndamere"],[24,"Jax"],[25,"Morgana"],[26,"Zilean"],[27,"Singed"],[28,"Evelynn"],[29,"Twitch"],[30,"Karthus"],[31,"Cho'Gath"],[32,"Amumu"],[33,"Rammus"],[34,"Anivia"],[35,"Shaco"],[36,"Dr.Mundo"],[37,"Sona"],[38,"Kassadin"],[39,"Irelia"],[40,"Janna"],[41,"Gangplank"],[42,"Corki"],[43,"Karma"],[44,"Taric"],[45,"Veigar"],[48,"Trundle"],[50,"Swain"],[51,"Caitlyn"],[53,"Blitzcrank"],[54,"Malphite"],[55,"Katarina"],[56,"Nocturne"],[57,"Maokai"],[58,"Renekton"],[59,"JarvanIV"],[60,"Elise"],[61,"Orianna"],[62,"Wukong"],[63,"Brand"],[64,"LeeSin"],[67,"Vayne"],[68,"Rumble"],[69,"Cassiopeia"],[72,"Skarner"],[74,"Heimerdinger"],[75,"Nasus"],[76,"Nidalee"],[77,"Udyr"],[78,"Poppy"],[79,"Gragas"],[80,"Pantheon"],[81,"Ezreal"],[82,"Mordekaiser"],[83,"Yorick"],[84,"Akali"],[85,"Kennen"],[86,"Garen"],[89,"Leona"],[90,"Malzahar"],[91,"Talon"],[92,"Riven"],[96,"Kog'Maw"],[98,"Shen"],[99,"Lux"],[101,"Xerath"],[102,"Shyvana"],[103,"Ahri"],[104,"Graves"],[105,"Fizz"],[106,"Volibear"],[107,"Rengar"],[110,"Varus"],[111,"Nautilus"],[112,"Viktor"],[113,"Sejuani"],[114,"Fiora"],[115,"Ziggs"],[117,"Lulu"],[119,"Draven"],[120,"Hecarim"],[121,"Kha'Zix"],[122,"Darius"],[126,"Jayce"],[127,"Lissandra"],[131,"Diana"],[133,"Quinn"],[134,"Syndra"],[136,"AurelionSol"],[141,"Kayn"],[142,"Zoe"],[143,"Zyra"],[145,"Kai'sa"],[150,"Gnar"],[154,"Zac"],[157,"Yasuo"],[161,"Vel'Koz"],[163,"Taliyah"],[164,"Camille"],[201,"Braum"],[202,"Jhin"],[203,"Kindred"],[222,"Jinx"],[223,"TahmKench"],[235,"Senna"],[236,"Lucian"],[238,"Zed"],[240,"Kled"],[245,"Ekko"],[246,"Qiyana"],[254,"Vi"],[266,"Aatrox"],[267,"Nami"],[268,"Azir"],[350,"Yuumi"],[412,"Thresh"],[420,"Illaoi"],[421,"Rek'Sai"],[427,"Ivern"],[429,"Kalista"],[432,"Bard"],[497,"Rakan"],[498,"Xayah"],[516,"Ornn"],[517,"Sylas"],[518,"Neeko"],[523,"Aphelios"],[555,"Pyke"],[875,"Sett"]];
var expected_value_SV = [1,2,1,1,2,1.5];       //[TOP,JUNGLE,MID,ADC,SUPPORT,NOT SPECIFIED]
var expected_value_KDA = [2,2,2,2,2,2];
var expected_value_KP = [50,60,50,50,60,50];
var expected_value_CS = [8,7,8,8,0,8];
var expected_value_Death = [5,4,3,3,3,4];

var maxRequestCall = ["0","15","30","45","60","75","90"];

var flag_only_ranked = false;
var RoleValue;

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// ACCOUNT INFO
var Region = 'EUW1';
var NbMatch = 5;

var SummonerName;
var SummonerId;
var AccountId;
var PuuId;
var ProfileIconId;
var RevisionDate;
var SummonerLevel;
var Rank;
var Winrate;

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// MATCHES INFO

var gameId = [];
var champion = [];
var queue = [];
var season = [];
var timestamp = [];
var role = [];
var lane = [];

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// STAT MATCH
var allMatchData = [];
var allMatchDataSorted = [];

var gameIdBis = [];
var gameDuration = [];
var gameCreation = [];
var win = [];
var kills = [];
var deaths = [];
var assists = [];
var visionScore = [];
var visionWardsBoughtInGame = [];
var wardsPlaced = [];
var wardsKilled = [];
var totalMinionsKilled = [];

var totalKills = [];
var VSmin = [];
var CSmin = [];
var KDA = [];
var gameCreationConverted = [];

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
function ajaxGet(url, callback) 
{
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 1500) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
            //SI ERROR
            display_error();
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
};

function ajaxGetSync(url, callback)
{
	var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// URL CREATORS

function create_url_get_info_AWS(Region,nameofsummoner)
{
	var url = "https://0wq0m4gpw1.execute-api.eu-west-3.amazonaws.com/rgapi/summoner/";
	url += Region;
	url += "/";
	url += nameofsummoner;
	return url
}

function create_url_get_matches_AWS(AccountId,Region,NbGame,OffsetBegin)
{
	var url = "https://0wq0m4gpw1.execute-api.eu-west-3.amazonaws.com/rgapi/matchlist/";
	url += Region;
	url += "/";
	url += AccountId;
	url += "/";
	url += OffsetBegin;
	url += "/";
	url += NbGame;
	return url
}

function create_url_get_info_match_AWS(MatchId,Region)
{
	var url = "https://0wq0m4gpw1.execute-api.eu-west-3.amazonaws.com/rgapi/match/";
	url += Region;
	url += "/";
	url += MatchId;
	return url
}

function create_url_get_rank_AWS(SummonerId,Region)
{
	var url = "https://0wq0m4gpw1.execute-api.eu-west-3.amazonaws.com/rgapi/rank/";
	url += Region;
	url += "/";
	url += SummonerId;
	return url
}

function create_graph_options(titre)
{
	var graph_options =
	{
	    title: titre,
	    curveType: 'none',
	    legend: 
	    { 
	    	position: 'bottom' 
	    },
	    width: 900,
	    height: 450,
		backgroundColor: '#191919',
		fontSize: 25,
		pointSize: 0,
	    vAxis: 
	    {
	        gridlines : 
	        {
	            count : 0
	        },
	        textStyle: {color: 'white'}
	    },
		hAxis: 
		{
	        gridlines : 
	        {
	            count : 0
	        },
	        textStyle: {color: 'white'}
	    },
	    titleTextStyle: 
	    {
	    	color: 'white'
	    },
	};
	return graph_options
}

function create_array_per_min(data_array,game_duration_array)
{
	var converted_array = [];
	for (i = 0; i < data_array.length; i++)
	{
		converted_array.push(data_array[i]/(game_duration_array[i]/60));
	}
	return converted_array;
}

function create_array_KP(kill,assist,totalkill)
{
	var converted_array = [];
	for (i = 0; i < kill.length; i++)
	{
		converted_array.push(100*(kill[i]+assist[i])/totalkill[i]);
	}
	return converted_array;
}

function create_array_KDA(kill,death,assist)
{
	var converted_array = [];
	for (i = 0; i < kill.length; i++)
	{
		converted_array.push((kill[i]+assist[i])/Math.max(1,death[i]));
	}
	return converted_array;
}

function average(array)
{
	var x = 0;
	for (var i = 0; i < array.length; i++)
	{
		x += array[i]
	}
	x = x/array.length;
	return (Math.round((x + Number.EPSILON) * 100) / 100);
}

function calc_winrate()
{
	var ratio = 0;
	for (var i = 0; i < win.length; i++)
	{
		if (win[i] == "Win")
		{
			ratio += 1;
		}
	}
	ratio = (ratio/win.length)*100;
	return ratio;
}

function reset_all_data()
{
	gameId = [];
	champion = [];
	queue = [];
	season = [];
	timestamp = [];
	role = [];
	lane = [];
	allMatchData = [];
	allMatchDataSorted = [];
	gameIdBis = [];
	gameDuration = [];
	win = [];
	kills = [];
	deaths = [];
	assists = [];
	visionScore = [];
	visionWardsBoughtInGame = [];
	wardsPlaced = [];
	wardsKilled = [];
	totalMinionsKilled = [];
	totalKills = [];
	gameCreation = [];
	gameCreationConverted = [];
	VSmin = [];
	CSmin = [];
	KDA = [];

	var elementToRemove = document.getElementById("icon_image");
	if (elementToRemove != null)
	{
		document.getElementById("Summoner_icon").removeChild(document.getElementById("icon_image"));
	}
	elementToRemove = document.getElementById("icon_rank_role");
	if (elementToRemove != null)
	{
		document.getElementById("rank_role_icon_box").removeChild(document.getElementById("icon_rank_role"));
	}
	elementToRemove = document.getElementById("rank_emblem");
	if (elementToRemove != null)
	{
		document.getElementById("Rank_icon").removeChild(document.getElementById("rank_emblem"));
	}
	elementToRemove = document.getElementById("timeoutid");
	if (elementToRemove != null)
	{
		document.getElementById("error_box").removeChild(document.getElementById("timeoutid"));
	}
	elementToRemove = document.getElementById("errorid");
	if (elementToRemove != null)
	{
		document.getElementById("error_box").removeChild(document.getElementById("errorid"));
	}
}

function create_csv_data_file()
{
	var csv_file = "GameID,Champion,QueueID,SeasonID,Timestamp,Date,Role,Lane,Estimated Position,Game Duration,Win,Kill,Death,Assist,KDA,CS,CS/min,VS,VS/min,Pink Ward,Ward Placed,Ward Killed,Total TeamKill" + "\n";
	for (var i = 0; i < gameId.length; i++)
	{
		csv_file += String(gameId[i])+",";
		csv_file += String(champion[i])+",";
		csv_file += String(queue[i])+",";
		csv_file += String(season[i])+",";
		csv_file += String(timestamp[i])+",";
		csv_file += String(gameCreationConverted[i])+",";
		csv_file += String(role[i])+",";
		csv_file += String(lane[i])+",";
		csv_file += String(convert_map_role_lane(role[i],lane[i]))+",";
		csv_file += String(gameDuration[i])+",";
		csv_file += String(win[i])+",";
		csv_file += String(kills[i])+",";
		csv_file += String(deaths[i])+",";
		csv_file += String(assists[i])+",";
		csv_file += String(KDA[i])+",";
		csv_file += String(totalMinionsKilled[i])+",";
		csv_file += String(CSmin[i])+",";
		csv_file += String(visionScore[i])+",";
		csv_file += String(VSmin[i])+",";
		csv_file += String(visionWardsBoughtInGame[i])+",";
		csv_file += String(wardsPlaced[i])+",";
		csv_file += String(wardsKilled[i])+",";
		csv_file += String(totalKills[i]);
		csv_file += "\n";
	}
	return csv_file;
}

function downloadCSV(text) {
  var element = document.getElementById('download_csv');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', "exported_Data.csv");
  element.style.display = 'inline';
}
function downloadJSON(text) {
  var element = document.getElementById('download_json');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', "exported_data_match.json");
  element.style.display = 'inline';
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// AFFICHAGE

function convert_region(region1)
{
	var region2;
	region2 = region1;
	if (region1 === "BR")
	{
		region2 = "br1";
	}
	if (region1 === "EUN")
	{
		region2 = "eun1";
	}
	if (region1 === "EUW")
	{
		region2 = "euw1";
	}
	if (region1 === "JP")
	{
		region2 = "jp1";
	}
	if (region1 === "OC")
	{
		region2 = "oc1";
	}
	if (region1 === "TR")
	{
		region2 = "tr1";
	}
	if (region1 === "NA")
	{
		region2 = "na1";
	}
	if (region1 === "KR")
	{
		region2 = "kr";
	}
	if (region1 === "LA1")
	{
		region2 = "la1";
	}
	if (region1 === "LA2")
	{
		region2 = "la2";
	}
	if (region1 === "RU")
	{
		region2 = "ru";
	}
	return region2
}

function convert_champion_id_to_name(id)
{
	for (var i = 0; i < champion_id_name.length; i++)
	{
		if (id == champion_id_name[i][0])
		{
			return champion_id_name[i][1];
			break;
		}
	}
}

function convert_champion_name_to_id(name)
{
	for (var i = 0; i < champion_id_name.length; i++)
	{
		if (name == champion_id_name[i][1])
		{
			return champion_id_name[i][0];
			break;
		}
	}
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year;
  return time;
}

function convert_game_creation_to_date(array)
{
	var converted_array = [];
	for (var i = 0; i < array.length; i++)
	{
		converted_array.push(timeConverter(array[i]));
		
	}
	return converted_array;
}

function convert_map_role_lane(role,lane)
{	
	var converted_role = "Error role";
	if(lane == 'MID')
	{
		converted_role = "Mid";
	}
	else if(lane == 'TOP')
	{
		converted_role = "Top";
	}
	else if(lane == 'JUNGLE' && role == 'NONE')
	{
		converted_role = "Jungle";
	}
	else if(role == "DUO_CARRY")
	{
		converted_role = "ADC";
	}
	else if(role == "DUO_SUPPORT")
	{
		converted_role = "Support";
	}
	else
	{
		converted_role = "Error role";
	}
	return converted_role;
}

function display_error()
{
	div = document.createElement('div');
	div.setAttribute("id", "errorid");
	var tableString = "<img src='assets/error_error.png'>";

	div.innerHTML = tableString;
	document.getElementById("error_box").appendChild(div);
}
function display_timeout()
{
	div = document.createElement('div');
	div.setAttribute("id", "timeoutid");
	var tableString = "<img src='assets/error_timeout.png'>";

	div.innerHTML = tableString;
	document.getElementById("error_box").appendChild(div);
}

function create_table_game(nbLigne,nbColonne)
{
	var tableString = "</br><table class='table_match'>",
    body = document.body;
    div = document.createElement('div');

    tableString += "<tr><td>Game ID</td><td>Champion ID</td><td>Queue ID</td><td>Season ID</td><td>Timestamp</td><td>Role</td><td>Lane</td></tr>";

	for (i = 0; i < nbLigne; i += 1) 
	{
	    tableString += "<tr>";

	    for (j = 0; j < nbColonne; j += 1) 
	    {
	    	if (j === 0)
	    	{
				tableString += "<td>" + gameId[i] + "</td>";
	    	}
	    	if (j === 1)
	    	{
	    		tableString += "<td>" + champion[i] + "</td>";
	    	}
	    	if (j === 2)
	    	{
	    		tableString += "<td>" + queue[i] + "</td>";
	    	}
	    	if (j === 3)
	    	{
	    		tableString += "<td>" + season[i] + "</td>";
	    	}
	    	if (j === 4)
	    	{
	    		tableString += "<td>" + timestamp[i] + "</td>";
	    	}
	    	if (j === 5)
	    	{
	    		tableString += "<td>" + role[i] + "</td>";
	    	}
	    	if (j === 6)
	    	{
	    		tableString += "<td>" + lane[i] + "</td>";
	    	}
	    }
	    tableString += "</tr>";
	}
	tableString += "</table>";
	div.innerHTML = tableString;
	body.appendChild(div);
}

function create_table_info_game(NbLigne,NbColonne)
{
	var tableString = "</br><table class='table_match'>",
    body = document.body;
    div = document.createElement('div');

    tableString += "<tr><td>Game ID</td><td>Game Duration</td><td>Kills</td><td>Deaths</td><td>Assists</td><td>Vision Score</td><td>Pink ward</td><td>Droped ward</td><td>Kill ward</td><td>CS</td></tr>";

	for (i = 0; i < NbLigne; i += 1) 
	{
	    tableString += "<tr>";

	    for (j = 0; j < NbColonne; j += 1) 
	    {
	    	if (j === 0)
	    	{
				tableString += "<td>" + gameId[i] + "</td>";
	    	}
	    	if (j === 1)
	    	{
				tableString += "<td>" + gameDuration[i] + "</td>";
	    	}
	    	if (j === 2)
	    	{
	    		tableString += "<td>" + kills[i] + "</td>";
	    	}
	    	if (j === 3)
	    	{
	    		tableString += "<td>" + deaths[i] + "</td>";
	    	}
	    	if (j === 4)
	    	{
	    		tableString += "<td>" + assists[i] + "</td>";
	    	}
	    	if (j === 5)
	    	{
	    		tableString += "<td>" + visionScore[i] + "</td>";
	    	}
	    	if (j === 6)
	    	{
	    		tableString += "<td>" + visionWardsBoughtInGame[i] + "</td>";
	    	}
	    	if (j === 7)
	    	{
	    		tableString += "<td>" + wardsPlaced[i] + "</td>";
	    	}
	    	if (j === 8)
	    	{
	    		tableString += "<td>" + wardsKilled[i] + "</td>";
	    	}
	    	if (j === 9)
	    	{
	    		tableString += "<td>" + totalMinionsKilled[i] + "</td>";
	    	}
	    }
	    tableString += "</tr>";
	}
	tableString += "</table>";
	div.innerHTML = tableString;
	body.appendChild(div);
}

function create_icon_display(nbicon)
{
	var tableString = "<img style='max-width:150px;width:100%;' src='http://ddragon.leagueoflegends.com/cdn/10.13.1/img/profileicon/";
    div = document.createElement('div');
    div.setAttribute("id", "icon_image");

	tableString += nbicon;
	tableString += ".png' class='icon_image'>";

	div.innerHTML = tableString;
	document.getElementById("Summoner_icon").appendChild(div);
}

function select_rank_role_icon_display(rank,role)
{
	var tableString = "<img src='assets/ranked-position/Position_";
    div = document.createElement('div');
	div.setAttribute("id", "icon_rank_role");

    if(role == "Ø Role")
    {
    	tableString += "Fill";
    }
    else
    {
	    tableString += rank;
	    tableString += "-";
		tableString += role;
    }
    tableString += ".png' style='max-width:50px;width:100%;position: relative;left:425px;'>";
	div.innerHTML = tableString;
	document.getElementById("rank_role_icon_box").appendChild(div);
}

function select_rank_emblem_display(rank)
{
	var tableString = "<img src='assets/ranked-emblems/Emblem_";
    div = document.createElement('div');
    div.setAttribute("id", "rank_emblem");

    if(rank == "Unranked")
    {
    	tableString += "Unranked";
    }
    else
    {
	    tableString += rank;
    }
    tableString += ".png' style='width:75px;height:75px;position:relative;bottom:10px;'>";
	div.innerHTML = tableString;
	document.getElementById("Rank_icon").appendChild(div);
}

function option_champion_add(x)
{
	var AZChampion = [];
	for (var i = 0; i < champion_id_name.length; i++)
	{	
		AZChampion.push(champion_id_name[i][1])
	}
	AZChampion.sort();
	var select = document.getElementById("Champion"+x);
	var option;
	for (var j = 0; j < AZChampion.length; j++)
	{	
		option = document.createElement('option');
		option.appendChild(document.createTextNode(AZChampion[j]));
		select.appendChild(option);
	}
}

function display_average_value()
{
	document.getElementById("KDA_value").textContent = average(KDA)+" KDA";
	document.getElementById("CS_value").textContent = average(CSmin)+" CS/min";
	document.getElementById("VS_value").textContent = average(VSmin)+" VS/min";
	document.getElementById("winrate_value").textContent = String(Winrate)+"%";
}

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

function drawChart(data,expected_value,name_abscisse,name_ordonne,slot,options) 
{
	var data_array = [[name_abscisse,name_ordonne,"Expected threshold"]];
	for (var i = 0; i < data.length; i++)
	{
		data_array.push([i,data[i],expected_value]);
	}

	var data = google.visualization.arrayToDataTable(data_array);

    var chart = new google.visualization.LineChart(document.getElementById("chart_slot_"+slot));

    chart.draw(data, options);
}

function drawPieChart()
{
        var data = google.visualization.arrayToDataTable([['Win/Lose','WinRatio'],['Win',Winrate],['Lose',(100-Winrate)]]);

        var options = {
          title: 'Win Rate',
          pieHole: 0.6,
          legend: {position: 'none'},
          backgroundColor: { fill:'transparent' },
          chartArea: {width:100,height:100},
          pieSliceText: "none",
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
}

function drawBarChart(array,expected_value,slot)
{
	var data = google.visualization.arrayToDataTable([
    ['Variablr', 'Value','Filler'],
    ['Value', average(array), expected_value - average(array)]
	]);

    var options = {
    	legend: {position: 'none'},
    	bar: { groupWidth: '100%' },
    	isStacked: true,
    	backgroundColor: { fill:'transparent' },
    	chartArea: {width:150,height:50},
    	theme: 'maximized',
    	hAxis: {
            viewWindowMode:'explicit',
            viewWindow: {
              max:expected_value,
              min:0
            }},
    };
    var element = document.getElementById("barchart"+slot);
  	element.style.display = 'inline';
    var chart = new google.visualization.BarChart(document.getElementById("barchart"+slot));
    chart.draw(data, options);
}


function display_table()
{
	create_table_game(gameId.length,7);
	create_table_info_game(gameId.length,10);
}

function display_graph()
{
	TriGamePerDate();
    traitementInfoMatch();

    gameCreationConverted=(convert_game_creation_to_date(gameCreation));
    Winrate = Math.trunc(calc_winrate());
    VSmin = create_array_per_min(visionScore,gameDuration);
    VSmin.reverse();
    KDA = create_array_KDA(kills,deaths,assists);
    KDA.reverse();
    KP = create_array_KP(kills,assists,totalKills);
    KP.reverse();
    CSmin = create_array_per_min(totalMinionsKilled,gameDuration);
    CSmin.reverse();

    if(VSmin.length == [])
    {
    	return;
    }

	if(RoleValue == "Top")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(VSmin,expected_value_SV[0],"Nombre de game","VS","5",create_graph_options("Evolution of the vision score per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KDA,expected_value_KDA[0],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KP,expected_value_KP[0],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(CSmin,expected_value_CS[0],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[0],"Nombre de game","Deaths","4",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(VSmin,expected_value_SV[0],"1");
		drawBarChart(CSmin,expected_value_CS[0],"2");
	}
	if(RoleValue == "Jungle")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(VSmin,expected_value_SV[1],"Nombre de game","VS","1",create_graph_options("Evolution of the vision score per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KDA,expected_value_KDA[1],"Nombre de game","KDA","3",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KP,expected_value_KP[1],"Nombre de game","KP","2",create_graph_options("Evolution of KP per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(CSmin,expected_value_CS[1],"Nombre de game","CS","4",create_graph_options("Evolution of CS per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[1],"Nombre de game","Deaths","5",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(VSmin,expected_value_SV[1],"1");
		drawBarChart(CSmin,expected_value_CS[1],"2");
	}
	if(RoleValue == "Mid")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(VSmin,expected_value_SV[2],"Nombre de game","VS","5",create_graph_options("Evolution of the vision score per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KDA,expected_value_KDA[2],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KP,expected_value_KP[2],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(CSmin,expected_value_CS[2],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[2],"Nombre de game","Deaths","4",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(VSmin,expected_value_SV[2],"1");
		drawBarChart(CSmin,expected_value_CS[2],"2");	
	}
	if(RoleValue == "ADC")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(VSmin,expected_value_SV[3],"Nombre de game","VS","5",create_graph_options("Evolution of the vision score per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KDA,expected_value_KDA[3],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KP,expected_value_KP[3],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(CSmin,expected_value_CS[3],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[3],"Nombre de game","Deaths","4",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(VSmin,expected_value_SV[3],"1");
		drawBarChart(CSmin,expected_value_CS[3],"2");
	}
	if(RoleValue == "Support")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(VSmin,expected_value_SV[4],"Nombre de game","VS","1",create_graph_options("Evolution of the vision score per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KDA,expected_value_KDA[4],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KP,expected_value_KP[4],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[4],"Nombre de game","Deaths","5",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(VSmin,expected_value_SV[4],"1");
		drawBarChart(CSmin,expected_value_CS[4],"2");
	}
	if(RoleValue == "Ø Role")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(VSmin,expected_value_SV[5],"Nombre de game","VS","2",create_graph_options("Evolution of the vision score per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KDA,expected_value_KDA[5],"Nombre de game","KDA","3",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(KP,expected_value_KP[5],"Nombre de game","KP","4",create_graph_options("Evolution of KP per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(CSmin,expected_value_CS[5],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[5],"Nombre de game","Deaths","5",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(VSmin,expected_value_SV[5],"1");
		drawBarChart(CSmin,expected_value_CS[5],"2");
	}
	drawPieChart();
	
	select_rank_role_icon_display(Rank,RoleValue);
	select_rank_emblem_display(Rank)
	display_average_value();

	downloadCSV(create_csv_data_file());
	downloadJSON(JSON.stringify(allMatchDataSorted));
}

function delayedcall15by15(id1,id2)
{
	for (var i = id1; i < id2; i++)
    	{
    		if(gameId[i] != undefined)
    		{
    			ajaxGet(create_url_get_info_match_AWS(gameId[i],convert_region(Region)),Stocking);
    		}
    	}
}

function thingstodelayed()
{
	if (NbMatch === "Max Request")
    {
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[0],maxRequestCall[1])},1100)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[1],maxRequestCall[2])},2200)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[2],maxRequestCall[3])},3300)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[3],maxRequestCall[4])},4400)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[4],maxRequestCall[5])},5400)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[5],maxRequestCall[6])},6400)
    	setTimeout(display_graph, 8000);
    }
    else
    {
    	for (var i = 0; i < gameId.length; i++)
    	{
    		ajaxGet(create_url_get_info_match_AWS(gameId[i],convert_region(Region)),Stocking);
    	}
    	setTimeout(display_graph, 1500);
	}
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// TRAITEMENT GET AJAX
function Stocking(reponse)
{
	let structure = JSON.parse(reponse);
	allMatchData.push(structure);
}

function TriGamePerDate()
{
	allMatchDataSorted.push(allMatchData[0]);
	var j = 0; 
	var flag = false;
	for (var i = 0; i < allMatchData.length; i++)
	{
		j = 0;
		while (allMatchData[i].gameCreation > allMatchDataSorted[j].gameCreation)
		{
			j++;
			if (j >= allMatchDataSorted.length)
			{
				allMatchDataSorted.push(allMatchData[i]);
				flag = true
				break;
			}
		}
		if (flag == false)
		{
			allMatchDataSorted.splice(j, 0, allMatchData[i])
		}
		else
		{
			flag = false;
		}
		if (i == 0)
		{
			allMatchDataSorted.pop();
		}
	}
	allMatchDataSorted.reverse();
}

function traitementInfoMatch()
{
	for (var i = 0; i < allMatchDataSorted.length; i++)
	{
		var ParticipantId;

		var structure = allMatchDataSorted[i];
		if (structure === undefined || structure.participantIdentities === undefined || structure.participantIdentities.length === 0)
		{
			display_timeout();
		}
		else
		{
			for (var j = 0; j < structure.participantIdentities.length; j++)
			{
				if (structure.participantIdentities[j].player.accountId == AccountId)
				{
					ParticipantId = j;
				}
			}

			gameIdBis.push(structure.gameId);
			gameDuration.push(structure.gameDuration);
			gameCreation.push(structure.gameCreation);

			kills.push(structure.participants[ParticipantId].stats.kills)
			deaths.push(structure.participants[ParticipantId].stats.deaths);
			assists.push(structure.participants[ParticipantId].stats.assists);
			visionScore.push(structure.participants[ParticipantId].stats.visionScore);
			visionWardsBoughtInGame.push(structure.participants[ParticipantId].stats.visionWardsBoughtInGame);
			wardsPlaced.push(structure.participants[ParticipantId].stats.wardsPlaced);
			wardsKilled.push(structure.participants[ParticipantId].stats.wardsKilled);
			totalMinionsKilled.push(structure.participants[ParticipantId].stats.totalMinionsKilled);

			if (structure.participants[ParticipantId].teamId == 100)
			{
				win.push(structure.teams[0].win);
				var sumkill = 0;
				for (var k = 0; k < 5; k++)
				{
					sumkill += structure.participants[k].stats.kills
				}
				totalKills.push(sumkill);
			}
			if (structure.participants[ParticipantId].teamId == 200)
			{
				win.push(structure.teams[1].win);
				var sumkill = 0;
				for (var k = 5; k < 10; k++)
				{
					sumkill += structure.participants[k].stats.kills
				}
				totalKills.push(sumkill);
			}
		}
	}

}


function traitementMatches(reponse)
{
    var structure = JSON.parse(reponse);
    
    for (var i = 0; i < structure.matches.length; i++)
    {
    	if (flag_only_ranked)
    	{
    		if(structure.matches[i].queue == 420)
    		{
    			if(RoleValue == convert_map_role_lane(structure.matches[i].role,structure.matches[i].lane) || RoleValue == "Ø Role")
    			{
    				gameId.push(structure.matches[i].gameId);
					champion.push(convert_champion_id_to_name(structure.matches[i].champion));
					queue.push(structure.matches[i].queue);
					season.push(structure.matches[i].season);
					timestamp.push(structure.matches[i].timestamp);
					role.push(structure.matches[i].role);
					lane.push(structure.matches[i].lane);
    			}			
    		}
    	}
    	else
    	{
    		if(RoleValue == convert_map_role_lane(structure.matches[i].role,structure.matches[i].lane) || RoleValue == "Ø Role")
    		{
    			if(ChampionValue == convert_champion_id_to_name(structure.matches[i].champion) || ChampionValue == "Ø Champion")
				{
					gameId.push(structure.matches[i].gameId);
					champion.push(convert_champion_id_to_name(structure.matches[i].champion));
					queue.push(structure.matches[i].queue);
					season.push(structure.matches[i].season);
					timestamp.push(structure.matches[i].timestamp);
					role.push(structure.matches[i].role);
					lane.push(structure.matches[i].lane);
				}			
			}
    	}
    }
}

function traitementRank(reponse) {
    var structure = JSON.parse(reponse);
    if (structure.length != 0)
    {
    	Rank = structure[0].tier;
    }
    else
    {
    	Rank = "Unranked";
    }
};

function traitementInfo(reponse) {
    var structure = JSON.parse(reponse);
    if (structure === undefined || structure.name === undefined)
	{
		display_error();
	}
	else
	{
		SummonerName= structure.name;
		SummonerId = structure.id;
		AccountId = structure.accountId;
		PuuId = structure.puuid;
		ProfileIconId = structure.profileIconId;
		RevisionDate = structure.revisionDate;
		SummonerLevel = structure.summonerLevel;

	    document.getElementById("Account_Name").textContent = SummonerName;
	    document.getElementById("Summoner_Id").textContent = "Summoner_Id: " + structure.id;
	    document.getElementById("Account_Id").textContent = "Account_Id: " + structure.accountId;

	    create_icon_display(structure.profileIconId);

	    ajaxGet(create_url_get_rank_AWS(SummonerId,convert_region(Region)),traitementRank);
	 
	    if (NbMatch != "Max Request")
	    {
	    	ajaxGet(create_url_get_matches_AWS(AccountId,convert_region(Region),NbMatch,"0"),traitementMatches);
	    	window.setTimeout(thingstodelayed,500);
	    }
	    if (NbMatch === "Max Request")
	    {
	    	for (var i = 0; i < (maxRequestCall.length - 1); i++)
	    	{
	    		ajaxGet(create_url_get_matches_AWS(AccountId,convert_region(Region),maxRequestCall[i+1],maxRequestCall[i]),traitementMatches);
	    	}
	    	window.setTimeout(thingstodelayed,1000);
	    }
	}
};


//---------------------------------------------------------------------------------------------------------------------------------------------------------
//   TRIGGER
function clic() {
	reset_all_data();
	var TextValue = document.getElementById("Summoner_Name").value;

	Region = document.getElementById("Region").value;
    NbMatch = document.getElementById("NbGame").value;

    RoleValue = document.getElementById("Role").value;
    ChampionValue = document.getElementById("Champion").value;

    if(document.getElementById("OnlyRankedBox").checked)
    {
    	flag_only_ranked = true;
    }
    ajaxGet(create_url_get_info_AWS(convert_region(Region),TextValue),traitementInfo);
}

function first_call()
{
	reset_all_data();
	document.getElementById("accueil").style.visibility = "hidden";
	document.getElementById("bandeau_top").style.visibility = "visible";

	var TextValue = document.getElementById("Summoner_Name_Bis").value;
	Region = document.getElementById("Region_Bis").value;
    NbMatch = document.getElementById("NbGame_Bis").value;
    RoleValue = document.getElementById("Role_Bis").value;
    ChampionValue = document.getElementById("Champion_Bis").value;

    if(document.getElementById("Only_Ranked_Bis").checked)
    {
    	flag_only_ranked = true;
    }

    document.getElementById("Summoner_Name").value = TextValue;
    document.getElementById("Region").value = Region;
    document.getElementById("NbGame").value =  NbMatch;

    document.getElementById("Role").value = RoleValue;
    document.getElementById("Champion").value = ChampionValue;


    ajaxGet(create_url_get_info_AWS(convert_region(Region),TextValue),traitementInfo);
}

var bouton1 = document.getElementById("Main_Button");
bouton1.addEventListener("click", clic);

var bouton2 = document.getElementById("Table_Button");
bouton2.addEventListener("click", display_table);

var bouton3 = document.getElementById("Button_Bis");
bouton3.addEventListener("click", first_call);

option_champion_add("");
option_champion_add("_Bis");

