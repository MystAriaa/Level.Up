<?php

$Region_List = ['BR1', 'EUN1','EUW1','JP1','KR','LA1','LA2','OC1','RU','TR1'];

function get_token()
{
	return "YOUR API TOKEN HERE";
}
function get_region()
{
	return [
		"Europe West" => "euw1",
		"Europe Nordic & East" => "eun1",
		"North America" => "na1",
		"Oceania" => "oc1",
		"Russia" => "ru",
		"Turkey" => "tr1",
		"Brazil" => "br",
		"Latin America North" => "la1",
		"Latin America South" => "la2",
		"Japan" => "jp1",
		"Korea" => "kr"
	];
}


//------------------------------------------------------------------------------------------------


function convert_region($region)
{
	$rDict = get_region();

	$keys = array_keys($rDict);
	$values = array_values($rDict);

	for ($i=0; $i < count($keys) ;$i++)
	{
		if ($region == $keys[$i])
		{
			return $values[$i];
		}
	}
	echo "Error convertion region -> region id";
}

function convert_continent($r)
{
	if ($r == "Brazil" || $r == "Latin America North" || $r == "Latin America South" || $r == "North America")
	{
		return "americas";
	}
	elseif ($r == "Japan" || $r == "Korea")
	{
		return "asia";
	}
	elseif ($r == "Europe Nordic & East" || $r == "Europe West" || $r == "Russia" || $r == "Turkey")
	{
		return "europe";
	}
	elseif ($r == "Oceania")
	{
		return "sea";
	}
	else
	{
		echo "Error convertion region -> continent";
	}
}
/*
function convert_queue_id_to_name()
{

}*/

function HTTPrequest($url, $method = "GET")
{
	$curl = curl_init($url);
	
	if ($method == "POST")
	{
		curl_setopt($curl, CURLOPT_POST, 1);
	}
	
	$header = ["User-Agent: Level.Up v2.0 beta", "X-Riot-Token: " . get_token()];
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

	$data = curl_exec($curl);
	if (curl_getinfo($curl, CURLINFO_HTTP_CODE) == 200)
	{
		curl_close($curl);
		$data = json_decode($data, true);
		return $data;
	}
	else
	{	
		curl_close($curl);
		return null;
	}
}

function get_summoner_info_by_name($name, $region)
{
	$name_encoded = urlencode($name);
	$region = convert_region($region);
	$url = "https://" . $region . ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" . $name_encoded;
	return HTTPrequest($url);
}

function get_list_match($puuid, $region, $number)
{
	$name_encoded = urlencode($name);
	$region_continent = convert_continent($region);

	$url = "https://" . $region_continent . ".api.riotgames.com/lol/match/v5/matches/by-puuid/" . $puuid . "/ids?start=0&count=" . $number;
	return HTTPrequest($url);
}

function get_game_info($match_id, $region)
{
	$region_continent = convert_continent($region);
	$url = "https://" . $region_continent . ".api.riotgames.com/lol/match/v5/matches/" . $match_id;
	return HTTPrequest($url);
}

function display_data($data)
{
	$dataKeys = array_keys($data);
	$dataValues = array_values($data);
	for ($i=0; $i < count($data) ;$i++)
	{
		echo($dataKeys[$i]);
		echo " : ";
		echo($dataValues[$i]);
		echo "<br>";
	}
}

?>

