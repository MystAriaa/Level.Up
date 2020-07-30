var Region_List = ['BR1', 'EUN1','EUW1','JP1','KR','LA1','LA2','OC1','RU','TR1'];
var champion_id_name = [[1,"Annie"],[2,"Olaf"],[3,"Galio"],[4,"TwistedFfate"],[5,"Xinzhao"],[6,"Urgot"],[7,"Leblanc"],[8,"Vladimir"],[9,"Fiddlesticks"],[10,"Kayle"],[11,"Master Yi"],[12,"Alistar"],[13,"Ryze"],[14,"Sion"],[15,"Sivir"],[16,"Soraka"],[17,"Teemo"],[18,"Tristana"],[19,"Warwick"],[20,"Nunu"],[21,"MissFortune"],[22,"Ashe"],[23,"Tryndamere"],[24,"Jax"],[25,"Morgana"],[26,"Zilean"],[27,"Singed"],[28,"Evelynn"],[29,"Twitch"],[30,"Karthus"],[31,"Chogath"],[32,"Amumu"],[33,"Rammus"],[34,"Anivia"],[35,"Shaco"],[36,"DrMundo"],[37,"Sona"],[38,"Kassadin"],[39,"Irelia"],[40,"Janna"],[41,"Gangplank"],[42,"Corki"],[43,"Karma"],[44,"Taric"],[45,"Veigar"],[48,"Trundle"],[50,"Swain"],[51,"Caitlyn"],[53,"Blitzcrank"],[54,"Malphite"],[55,"Katarina"],[56,"Nocturne"],[57,"Maokai"],[58,"Renekton"],[59,"JarvanIV"],[60,"Elise"],[61,"Orianna"],[62,"Wukong"],[63,"Brand"],[64,"LeeSin"],[67,"Vayne"],[68,"Rumble"],[69,"Cassiopeia"],[72,"Skarner"],[74,"Heimerdinger"],[75,"Nasus"],[76,"Nidalee"],[77,"Udyr"],[78,"Poppy"],[79,"Gragas"],[80,"Pantheon"],[81,"Ezreal"],[82,"Mordekaiser"],[83,"Yorick"],[84,"Akali"],[85,"Kennen"],[86,"Garen"],[89,"Leona"],[90,"Malzahar"],[91,"Talon"],[92,"Riven"],[96,"KogMaw"],[98,"Shen"],[99,"Lux"],[101,"Xerath"],[102,"Shyvana"],[103,"Ahri"],[104,"Graves"],[105,"Fizz"],[106,"Volibear"],[107,"Rengar"],[110,"Varus"],[111,"Nautilus"],[112,"Viktor"],[113,"Sejuani"],[114,"Fiora"],[115,"Ziggs"],[117,"Lulu"],[119,"Draven"],[120,"Hecarim"],[121,"KhaZix"],[122,"Darius"],[126,"Jayce"],[127,"Lissandra"],[131,"Diana"],[133,"Quinn"],[134,"Syndra"],[136,"AurelionSol"],[141,"Kayn"],[142,"Zoe"],[143,"Zyra"],[145,"Kaisa"],[150,"Gnar"],[154,"Zac"],[157,"Yasuo"],[161,"Velkoz"],[163,"Taliyah"],[164,"Camille"],[201,"Braum"],[202,"Jhin"],[203,"Kindred"],[222,"Jinx"],[223,"TahmKench"],[235,"Senna"],[236,"Lucian"],[238,"Zed"],[240,"Kled"],[245,"Ekko"],[246,"Qiyana"],[254,"Vi"],[266,"Aatrox"],[267,"Nami"],[268,"Azir"],[350,"Yuumi"],[412,"Thresh"],[420,"Illaoi"],[421,"Reksai"],[427,"Ivern"],[429,"Kalista"],[432,"Bard"],[497,"Rakan"],[498,"Xayah"],[516,"Ornn"],[517,"Sylas"],[518,"Neeko"],[523,"Aphelios"],[555,"Pyke"],[875,"Sett"],[876,'Lillia']];
var expected_value_SV = [1,2,1,1,2,1.5];       //[TOP,JUNGLE,MID,ADC,SUPPORT,NOT SPECIFIED]
var expected_value_KDA = [2,2,2,2,2,2];
var expected_value_KP = [50,60,50,50,60,50];
var expected_value_CS = [8,7,8,8,0,8];
var expected_value_Death = [5,4,3,3,3,4];

var maxRequestCall = ["0","15","30","45","60","75","90"];

var flag_only_ranked = false;
var RoleValue;

var gameSelected = [];
var flipflop_game_select = false;

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

var gameId = []; var saved_gameId = [];
var champion = []; var saved_champion = [];
var queue = []; var saved_queue = [];
var season = []; var saved_season = [];
var timestamp = []; var saved_timestamp = [];
var role = []; var saved_role = [];
var lane = []; var saved_lane = [];

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// STAT MATCH
 var allMatchData = []; var saved_allMatchData = [];
 var allMatchDataSorted = []; var saved_allMatchDataSorted = [];

 var gameIdBis = []; var saved_gameIdBis = [];
 var gameDuration = []; var saved_gameDuration = [];
 var gameCreation = []; var saved_gameCreation = [];
 var win = []; var saved_win = [];
 var kills = []; var saved_kills = [];
 var deaths = []; var saved_deaths = [];
 var assists = []; var saved_assists = [];
 var visionScore = []; var saved_visionScore = [];
 var visionWardsBoughtInGame = []; var saved_visionWardsBoughtInGame = [];
 var wardsPlaced = []; var saved_wardsPlaced = [];
 var wardsKilled = []; var saved_wardsKilled = [];
 var totalMinionsKilled = []; var saved_totalMinionsKilled = [];

var totalKills = []; var saved_totalKills = [];
var vsmin = []; var saved_vsmin = [];
var csmin = []; var saved_csmin = [];
var kda = []; var saved_kda = [];
var kp = []; var saved_kp = [];
var gameCreationConverted = []; var saved_gameCreationConverted = [];

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

function create_graph_options(titre,VAxisMaxValue)
{
	var graph_options =
	{
	    title: titre,
	    curveType: 'none',
	    legend: 
	    { 
	    	position: 'bottom' 
	    },
		backgroundColor: '#191919',
		fontSize: 25,
		pointSize: 0,
	    vAxis: 
	    {
	        gridlines : 
	        {
	            count : 0
	        },
	        textStyle: {color: 'white'},
	        minValue:0,
	        maxValue:VAxisMaxValue,
            viewWindow: {
                min: 0,
                max: VAxisMaxValue
            },
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
	vsmin = [];
	csmin = [];
	kda = [];

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
	elementToRemove = document.getElementById("gamelist");
	if (elementToRemove != null)
	{
		document.getElementById("pre_gamelist").removeChild(document.getElementById("gamelist"));
	}
	/*elementToRemove = document.getElementById("gamelist");
	if (elementToRemove != null)
	{
		document.getElementById("pre_gamelist").removeChild(document.getElementById("gamelist"));
	}*/
	elementToRemove = document.getElementById("stats_table");
	if (elementToRemove != null)
	{
		document.getElementById("pre_stats_table").removeChild(document.getElementById("stats_table"));
	}
}

function create_csv_data_file()
{
	var csv_file = "";
	//var csv_file = "GameID,Champion,QueueID,SeasonID,Timestamp,Date,Role,Lane,Estimated Position,Game Duration,Win,Kill,Death,Assist,KDA,CS,CS/min,VS,VS/min,Pink Ward,Ward Placed,Ward Killed,Total TeamKill" + "\n";
	for (var i = 0; i < gameId.length; i++)
	{
		//csv_file += String(gameId[i])+",";
		csv_file += String(gameCreationConverted[i])+",";
		csv_file += String(champion[i])+",";
		csv_file += String(kills[i])+",";
		csv_file += String(deaths[i])+",";
		csv_file += String(assists[i])+",";
		if (win[i] == "Fail")
		{
			csv_file += "Lose"+",";
		}
		else
		{
			csv_file += String(win[i])+",";
		}	
		csv_file += String(wardsPlaced[i])+",";
		csv_file += String(visionWardsBoughtInGame[i])+",";
		csv_file += String(visionScore[i])+",";
		csv_file += String(totalMinionsKilled[i])+",";
		csv_file += String(csv_files += Utilities.formatDate(gameDuration[i], "GMT", "mm'.'ss"))+","; 
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

function convert_queue(id)
{
	var type;

	if(id == 430)
	{
		type = "Normal Blind";
	}
	else if(id == 420)
	{
		type = "Ranked Solo";
	}
	else if(id == 440)
	{
		type = "Ranked Flex";
	}
	else if(id == 450)
	{
		type = "ARAM";
	}
	else if(id == 400)
	{
		type = "Normal Draft";
	}
	else if(id == 0)
	{
		type = "Custom Game";
	}
	else if(id == 850)
	{
		type = "Coop-IA";
	}
	else
	{
		type = "Special Game";
	}

	return type
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

function create_table_propre()
{
	var tableString = "<table class='table_match'>";
	NbColonne = 17;
	NbLigne = gameId.length;
    body = document.getElementById("pre_stats_table");
    div = document.createElement('div');
    div.class="stats_table";
    div.id = "stats_table";

    tableString += "<tr><td>Game ID</td><td>Date</td><td>Champion</td><td>Kills</td><td>Deaths</td><td>Assists</td><td>Resultat</td><td>Droped ward</td><td>Pink ward</td><td>Vision Score</td><td>CS</td><td>Durée</td><td>Total Kills</td><td>SV/min</td><td>CS/min</td><td>KDA</td><td>KP</td></tr>";

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
				tableString += "<td>" + gameCreationConverted[i] + "</td>";
	    	}
	    	if (j === 2)
	    	{
	    		tableString += "<td>" + champion[i] + "</td>";
	    	}
	    	if (j === 3)
	    	{
	    		tableString += "<td>" + kills[i] + "</td>";
	    	}
	    	if (j === 4)
	    	{
	    		tableString += "<td>" + deaths[i] + "</td>";
	    	}
	    	if (j === 5)
	    	{
	    		tableString += "<td>" + assists[i] + "</td>";
	    	}
	    	if (j === 6)
	    	{
	    		if(win[i] == "Win")
	    		{
	    			tableString += "<td>" + win[i] + "</td>";
	    		}
	    		else
	    		{
	    			tableString += "<td>" + "Lose" + "</td>";
	    		}		
	    	}
	    	if (j === 7)
	    	{
	    		tableString += "<td>" + wardsPlaced[i] + "</td>";
	    	}
	    	if (j === 8)
	    	{
	    		tableString += "<td>" + visionWardsBoughtInGame[i] + "</td>";
	    	}
	    	if (j === 9)
	    	{
	    		tableString += "<td>" + visionScore[i] + "</td>";
	    	}
	    	if (j === 10)
	    	{
	    		tableString += "<td>" + totalMinionsKilled[i] + "</td>";
	    	}
	    	if (j === 11)
	    	{
	    		tableString += "<td>" + gameDuration[i] + "</td>";
	    	}
	    	if (j === 12)
	    	{
	    		tableString += "<td>" + totalKills[i] + "</td>";
	    	}
	    	if (j === 13)
	    	{
	    		tableString += "<td>" + (Math.round((vsmin[i] + Number.EPSILON) * 100) / 100) + "</td>";
	    	}
	    	if (j === 14)
	    	{
	    		tableString += "<td>" + (Math.round((csmin[i] + Number.EPSILON) * 100) / 100) + "</td>";
	    	}
	    	if (j === 15)
	    	{
	    		tableString += "<td>" + (Math.round((kda[i] + Number.EPSILON) * 100) / 100) + "</td>";
	    	}
	    	if (j === 16)
	    	{
	    		tableString += "<td>" + (Math.round((kp[i] + Number.EPSILON) * 100) / 100) + "</td>";
	    	}
	    }
	    tableString += "</tr>";
	}
	tableString += "</table>";
	div.innerHTML = tableString;
	body.appendChild(div);
}

function create_match_display()
{
	var tableString = "<div id='table_gamelist' class='table_gamelist'><button type='checkbox' id='button_check_allgame' class='select_checkbox_allgame'>Select All</button>";

    body = document.getElementById("pre_gamelist");
    div = document.createElement('div');
    div.id = "gamelist";

    for (i = 0; i < gameId.length; i++)
    {
    	if (win[i] == "Win")
    	{
    		tableString += "<div class='game_win'>";
    	}
    	else
    	{
    		tableString += "<div class='game_lose'>";
    	}
    	
    	tableString += "<img src='http://ddragon.leagueoflegends.com/cdn/10.13.1/img/champion/" + champion[i] + ".png' class='logo_champion'>";
    	tableString += "<p class='score_text'>" + kills[i] + "/"+ deaths[i] + "/" + assists[i] + "</p>";
    	tableString += "<p class='kda_text'>" + Math.round((kda[i] + Number.EPSILON) * 100) / 100 + ":1 KDA" + "</p>";
    	tableString += "<p class='cs_text'>" + totalMinionsKilled[i] + " CS" + "</p>";
    	tableString += "<p class='csmin_text'>" + Math.round((csmin[i] + Number.EPSILON) * 100) / 100 + " CS/min" + "</p>";
    	tableString += "<p class='vs_text'>" + visionScore[i] + " VS" + "</p>";
    	tableString += "<p class='vsmin_text'>" + Math.round((vsmin[i] + Number.EPSILON) * 100) / 100 + " VS/min" + "</p>";
    	tableString += "<p class='pink_text'>" + visionWardsBoughtInGame[i] + " Pinks" + "</p>";
    	tableString += "<p class='date_text'>" + gameCreationConverted[i] + "</p>";
    	tableString += "<p class='queue_text'>" + convert_queue(queue[i]) + "</p>";
    	tableString += "<p class='time_text'>" + (Math.floor(gameDuration[i] / 60)) + ":" + (gameDuration[i]-(Math.floor(gameDuration[i] / 60 ))*60) + "</p>";
    	tableString += "<input type='checkbox' value='checked' id='checkbox_game" + i + "' class='select_checkbox'>";

    	tableString += "</div>";
    }
	tableString += "</div>";

	div.innerHTML = tableString;
	body.appendChild(div);

	/*var checkbox = document.getElementById("checkbox_game1");
	checkbox.addEventListener( 'change', function() {
	    if(this.checked) 
	    {
	    	save_checked_game();
	    } 
	    else
	    {
	        save_checked_game();
	    }
	});*/
}

function select_all()
{
	if(flipflop_game_select == false)
	{
		for (var i = 0; i < NbMatch; i++)
		{
			document.getElementById("checkbox_game"+i).checked = true;
		}
	}
	if(flipflop_game_select == true)
	{
		for (var i = 0; i < NbMatch; i++)
		{
			document.getElementById("checkbox_game"+i).checked = false;
		}
	}
	flipflop_game_select = !flipflop_game_select;
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
    tableString += ".png' style='max-width:50px;'>";
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
	document.getElementById("KDA_value").textContent = average(kda)+" KDA";
	document.getElementById("CS_value").textContent = average(csmin)+" CS/min";
	document.getElementById("VS_value").textContent = average(vsmin)+" VS/min";
	document.getElementById("winrate_value").textContent = String(Winrate)+"%";
}

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart','table','bar']});

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

function drawTable() 
{
    var data = new google.visualization.DataTable();
    var dataarray = [];

    data.addColumn('number', 'Game ID');
    data.addColumn('string', 'Date');
    data.addColumn('string', 'Champion');
    data.addColumn('number', 'Kills');
    data.addColumn('number', 'Deaths');
    data.addColumn('number', 'Assists');
    data.addColumn('string', 'Result');
    data.addColumn('number', 'Droped Ward');
    data.addColumn('number', 'Pink Ward');
    data.addColumn('number', 'Vision Score');
    data.addColumn('number', 'CS');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Total Kills');
    data.addColumn('number', 'SV/min');
    data.addColumn('number', 'CS/min');
    data.addColumn('number', 'KDA');
    data.addColumn('number', 'KP');

    for (var i = 0; i < gameId.length; i++)
    {
    	dataarray.push([gameId[i],gameCreationConverted[i],champion[i],kills[i],deaths[i],assists[i],win[i],wardsPlaced[i],visionWardsBoughtInGame[i],visionScore[i],totalMinionsKilled[i],gameDuration[i],totalKills[i],vsmin[i],csmin[i],kda[i],kp[i]]);
    }

    data.addRows(dataarray);

    var table = new google.visualization.Table(document.getElementById('table_div'));

    var formatter = new google.visualization.ColorFormat();
    formatter.addRange(null, null, 'white', '#191919');

    for (var i = 0; i < 17; i++)
    {
    	formatter.format(data, i);
    }

    table.draw(data, {allowHtml: true, width: '60%', height: '100%'});
}


function display_table()
{
	create_table_game(gameId.length,7);
	create_table_info_game(gameId.length,10);
}

function save_data()
{
	for (var i = 0; i < gameId.length; i++)
	{
		saved_gameId.push(gameId[i]);
		saved_champion.push(champion[i]);
		saved_queue.push(queue[i]);
		saved_season.push(season[i]);
		saved_timestamp.push(timestamp[i]);
		saved_role.push(role[i]);
		saved_lane.push(lane[i]);
		saved_allMatchData.push(allMatchData[i]);
		saved_allMatchDataSorted.push(allMatchDataSorted[i]);

		saved_gameIdBis.push(gameIdBis[i]);
		saved_gameDuration.push(gameDuration[i]);
		saved_gameCreation.push(gameCreation[i]);
		saved_win.push(win[i]);
		saved_kills.push(kills[i]);
		saved_deaths.push(deaths[i]);
		saved_assists.push(assists[i]);
		saved_visionScore.push(visionScore[i]);
		saved_visionWardsBoughtInGame.push(visionWardsBoughtInGame[i]);
		saved_wardsPlaced.push(wardsPlaced[i]);
		saved_wardsKilled.push(wardsKilled[i]);
		saved_totalMinionsKilled.push(totalMinionsKilled[i]);

		saved_totalKills.push(totalKills[i]);
		saved_vsmin.push(vsmin[i]);
		saved_csmin.push(csmin[i]);
		saved_kda.push(kda[i]);
		saved_kp.push(kp[i]);
		saved_gameCreationConverted.push(gameCreationConverted[i]);
	}
}

function restore_data()
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
	gameCreation = [];
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
	vsmin = [];
	csmin = [];
	kda = [];
 	kp = [];
	gameCreationConverted = [];

	for (var i = 0; i < saved_gameId.length; i++)
	{
		gameId[i] = saved_gameId[i];
		champion[i] = saved_champion[i];
		queue[i] = saved_queue[i];
		season[i] = saved_season[i];
		timestamp[i] = saved_timestamp[i];
		role[i] = saved_role[i];
		lane[i] = saved_lane[i];
		allMatchData[i] = saved_allMatchData[i];
		allMatchDataSorted[i] = saved_allMatchDataSorted[i];

		gameIdBis[i] = saved_gameIdBis[i];
		gameDuration[i] = saved_gameDuration[i];
		gameCreation[i] = saved_gameCreation[i];
		win[i] = saved_win[i];
		kills[i] = saved_kills[i];
		deaths[i] = saved_deaths[i];
		assists[i] = saved_assists[i];
		visionScore[i] = saved_visionScore[i];
		visionWardsBoughtInGame[i] = saved_visionWardsBoughtInGame[i];
		wardsPlaced[i] = saved_wardsPlaced[i];
		wardsKilled[i] = saved_wardsKilled[i];
		totalMinionsKilled[i] = saved_totalMinionsKilled[i];

		totalKills[i] = saved_totalKills[i];
		vsmin[i] = saved_vsmin[i];
		csmin[i] = saved_csmin[i];
		kda[i] = saved_kda[i];
		kp[i] = saved_kp[i];
		gameCreationConverted[i] = saved_gameCreationConverted[i];
	}
}

function last_traitement()
{
	TriGamePerDate();
    traitementInfoMatch();

    gameCreationConverted=(convert_game_creation_to_date(gameCreation));
    Winrate = Math.trunc(calc_winrate());
    vsmin = create_array_per_min(visionScore,gameDuration);
    
    kda = create_array_KDA(kills,deaths,assists);
    
    kp = create_array_KP(kills,assists,totalKills);
    
    csmin = create_array_per_min(totalMinionsKilled,gameDuration);
    

    select_rank_role_icon_display(Rank,RoleValue);
	//select_rank_emblem_display(Rank);

    create_match_display();

    save_data();

    //console.log(kills);

    var bouton4 = document.getElementById("button_check_allgame");
	bouton4.addEventListener("click",select_all);
}

function display_graph()
{
    if(vsmin.length == [])
    {
    	return;
    }

	if(RoleValue == "Top")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(vsmin,expected_value_SV[0],"Nombre de game","VS","5",create_graph_options("Evolution of the vision score per minute per game",3))});
		google.charts.setOnLoadCallback(function(){ drawChart(kda,expected_value_KDA[0],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(kp,expected_value_KP[0],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game",100))});
		google.charts.setOnLoadCallback(function(){ drawChart(csmin,expected_value_CS[0],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game",11))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[0],"Nombre de game","Deaths","4",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(vsmin,expected_value_SV[0],"1");
		drawBarChart(csmin,expected_value_CS[0],"2");
	}
	if(RoleValue == "Jungle")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(vsmin,expected_value_SV[1],"Nombre de game","VS","1",create_graph_options("Evolution of the vision score per minute per game",3))});
		google.charts.setOnLoadCallback(function(){ drawChart(kda,expected_value_KDA[1],"Nombre de game","KDA","3",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(kp,expected_value_KP[1],"Nombre de game","KP","2",create_graph_options("Evolution of KP per game",100))});
		google.charts.setOnLoadCallback(function(){ drawChart(csmin,expected_value_CS[1],"Nombre de game","CS","4",create_graph_options("Evolution of CS per minute per game",11))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[1],"Nombre de game","Deaths","5",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(vsmin,expected_value_SV[1],"1");
		drawBarChart(csmin,expected_value_CS[1],"2");
	}
	if(RoleValue == "Mid")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(vsmin,expected_value_SV[2],"Nombre de game","VS","5",create_graph_options("Evolution of the vision score per minute per game",3))});
		google.charts.setOnLoadCallback(function(){ drawChart(kda,expected_value_KDA[2],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(kp,expected_value_KP[2],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game",100))});
		google.charts.setOnLoadCallback(function(){ drawChart(csmin,expected_value_CS[2],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game",11))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[2],"Nombre de game","Deaths","4",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(vsmin,expected_value_SV[2],"1");
		drawBarChart(csmin,expected_value_CS[2],"2");	
	}
	if(RoleValue == "ADC")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(vsmin,expected_value_SV[3],"Nombre de game","VS","5",create_graph_options("Evolution of the vision score per minute per game",3))});
		google.charts.setOnLoadCallback(function(){ drawChart(kda,expected_value_KDA[3],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(kp,expected_value_KP[3],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game",100))});
		google.charts.setOnLoadCallback(function(){ drawChart(csmin,expected_value_CS[3],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game",11))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[3],"Nombre de game","Deaths","4",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(vsmin,expected_value_SV[3],"1");
		drawBarChart(csmin,expected_value_CS[3],"2");
	}
	if(RoleValue == "Support")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(vsmin,expected_value_SV[4],"Nombre de game","VS","1",create_graph_options("Evolution of the vision score per minute per game",3))});
		google.charts.setOnLoadCallback(function(){ drawChart(kda,expected_value_KDA[4],"Nombre de game","KDA","2",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(kp,expected_value_KP[4],"Nombre de game","KP","3",create_graph_options("Evolution of KP per game",100))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[4],"Nombre de game","Deaths","5",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(vsmin,expected_value_SV[4],"1");
		drawBarChart(csmin,expected_value_CS[4],"2");
	}
	if(RoleValue == "Ø Role")
	{
		google.charts.setOnLoadCallback(function(){ drawChart(vsmin,expected_value_SV[5],"Nombre de game","VS","2",create_graph_options("Evolution of the vision score per minute per game",3))});
		google.charts.setOnLoadCallback(function(){ drawChart(kda,expected_value_KDA[5],"Nombre de game","KDA","3",create_graph_options("Evolution of KDA per game"))});
		google.charts.setOnLoadCallback(function(){ drawChart(kp,expected_value_KP[5],"Nombre de game","KP","4",create_graph_options("Evolution of KP per game",100))});
		google.charts.setOnLoadCallback(function(){ drawChart(csmin,expected_value_CS[5],"Nombre de game","CS","1",create_graph_options("Evolution of CS per minute per game",11))});
		google.charts.setOnLoadCallback(function(){ drawChart(deaths,expected_value_Death[5],"Nombre de game","Deaths","5",create_graph_options("Evolution of deaths per game"))});
		drawBarChart(vsmin,expected_value_SV[5],"1");
		drawBarChart(csmin,expected_value_CS[5],"2");
	}

	drawPieChart();

	display_average_value();
	create_table_propre();

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
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[0],maxRequestCall[1])},1500)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[1],maxRequestCall[2])},3000)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[2],maxRequestCall[3])},4500)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[3],maxRequestCall[4])},6000)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[4],maxRequestCall[5])},7500)
    	window.setTimeout(function() {delayedcall15by15(maxRequestCall[5],maxRequestCall[6])},9000)
    	setTimeout(last_traitement, 13000);
    }
    else
    {
    	for (var i = 0; i < gameId.length; i++)
    	{
    		ajaxGet(create_url_get_info_match_AWS(gameId[i],convert_region(Region)),Stocking);
    	}
    	setTimeout(last_traitement, 1500);
	}
	//console.log(gameId);
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

    var count = 0;
    
    for (var i = 0; i < structure.matches.length; i++)
    {
    	if (flag_only_ranked)
    	{
    		if(structure.matches[i].queue == 420)
    		{
    			if(RoleValue == convert_map_role_lane(structure.matches[i].role,structure.matches[i].lane) || RoleValue == "Ø Role")
    			{
    				if(ChampionValue == convert_champion_id_to_name(structure.matches[i].champion) || ChampionValue == "Ø Champion")
					{
						if(count < NbMatch || NbMatch == "Max Request")
						{
							gameId.push(structure.matches[i].gameId);
							champion.push(convert_champion_id_to_name(structure.matches[i].champion));
							queue.push(structure.matches[i].queue);
							season.push(structure.matches[i].season);
							timestamp.push(structure.matches[i].timestamp);
							role.push(structure.matches[i].role);
							lane.push(structure.matches[i].lane);
							count++;
						}
					}	
    			}			
    		}
    	}
    	else
    	{
    		if(RoleValue == convert_map_role_lane(structure.matches[i].role,structure.matches[i].lane) || RoleValue == "Ø Role")
    		{
    			if(ChampionValue == convert_champion_id_to_name(structure.matches[i].champion) || ChampionValue == "Ø Champion")
				{
					if(count < NbMatch || NbMatch == "Max Request")
					{
						gameId.push(structure.matches[i].gameId);
						champion.push(convert_champion_id_to_name(structure.matches[i].champion));
						queue.push(structure.matches[i].queue);
						season.push(structure.matches[i].season);
						timestamp.push(structure.matches[i].timestamp);
						role.push(structure.matches[i].role);
						lane.push(structure.matches[i].lane);
						count++;
					}
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
	    	
	    	if (ChampionValue != "Ø Champion")
	    	{
	    		ajaxGet(create_url_get_matches_AWS(AccountId,convert_region(Region),"90","0"),traitementMatches);
	    	}
	    	else
	    	{
	    		ajaxGet(create_url_get_matches_AWS(AccountId,convert_region(Region),NbMatch,"0"),traitementMatches);
	    	}
	    	window.setTimeout(thingstodelayed,1000);
	    }
	    if (NbMatch === "Max Request")
	    {
	    	for (var i = 0; i < (maxRequestCall.length - 1); i++)
	    	{
	    		ajaxGet(create_url_get_matches_AWS(AccountId,convert_region(Region),maxRequestCall[i+1],maxRequestCall[i]),traitementMatches);
	    	}
	    	window.setTimeout(thingstodelayed,3000);
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

function save_checked_game()
{
	gameSelected = [];

	for (var i = 0; i < gameId.length; i++)
	{
		if(document.getElementById("checkbox_game"+i).checked === false)
    	{
    		gameSelected.push(i);
    	}
	}

	for (var i = gameSelected.length - 1; i > -1; i--)
	{
		gameId.splice(gameSelected[i],1);
		champion.splice(gameSelected[i],1);
		queue.splice(gameSelected[i],1);
		season.splice(gameSelected[i],1);
		timestamp.splice(gameSelected[i],1);
		role.splice(gameSelected[i],1);
		lane.splice(gameSelected[i],1);
		allMatchData.splice(gameSelected[i],1);
		allMatchDataSorted.splice(gameSelected[i],1);
		gameIdBis.splice(gameSelected[i],1);
		gameDuration.splice(gameSelected[i],1);
		gameCreation.splice(gameSelected[i],1);
		win.splice(gameSelected[i],1);
		kills.splice(gameSelected[i],1);
		deaths.splice(gameSelected[i],1);
		assists.splice(gameSelected[i],1);
		visionScore.splice(gameSelected[i],1);
		visionWardsBoughtInGame.splice(gameSelected[i],1);
		wardsPlaced.splice(gameSelected[i],1);
		wardsKilled.splice(gameSelected[i],1);
		totalMinionsKilled.splice(gameSelected[i],1);
		totalKills.splice(gameSelected[i],1);
		vsmin.splice(gameSelected[i],1);
		csmin.splice(gameSelected[i],1);
		kda.splice(gameSelected[i],1);
		kp.splice(gameSelected[i],1);
		gameCreationConverted.splice(gameSelected[i],1);
	}

	gameSelected = [];

	elementToRemove = document.getElementById("stats_table");
	if (elementToRemove != null)
	{
		elementToRemove.parentNode.removeChild(elementToRemove);
	}

	display_graph();

	//console.log("saved" + saved_gameId);

	window.setTimeout(restore_data,1000);
}

var bouton1 = document.getElementById("Main_Button");
bouton1.addEventListener("click", clic);

var bouton2 = document.getElementById("Button_Bis");
bouton2.addEventListener("click", first_call);

var bouton3 = document.getElementById("Select_Game_Button");
bouton3.addEventListener("click", save_checked_game);

option_champion_add("");
option_champion_add("_Bis");

