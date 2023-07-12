<?php

function get_data_dragon_last_version()
{
	$curl = curl_init("https://ddragon.leagueoflegends.com/api/versions.json");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($curl);
	if (curl_getinfo($curl, CURLINFO_HTTP_CODE) == 200)
	{
		curl_close($curl);
		$data = json_decode($data, true);
		return $data[0];
	}
	else
	{	
		curl_close($curl);
		return null;
	}
}

function get_data_dragon_version($mysqlConnection)
{
	return select_from_table($mysqlConnection, "datadragon_version", ["d_version"])[0]["d_version"];
}

function fetch_champion_data_dict($mysqlConnection)
{
	$dict = [];
	$url = "http://ddragon.leagueoflegends.com/cdn/" . get_data_dragon_version($mysqlConnection) . "/data/en_US/champion.json";
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($curl);
	if (curl_getinfo($curl, CURLINFO_HTTP_CODE) == 200)
	{
		curl_close($curl);
		$data = json_decode($data, true)["data"];

		try
		{
			drop_table($mysqlConnection, "datadragon_champion");
		}
		catch(Exception $e)
		{
			echo "Can't delete datadragon_champion";
		}
		create_table($mysqlConnection, "datadragon_champion", ["c_key" => "INT(5)", "c_id" => "VARCHAR(20)", "c_name" => "VARCHAR(20)"]);
			

		foreach ($data as $value) //($data as $key => $value)
		{
			$champ_key = $value["key"];
			$champ_id = $value["id"];
			$champ_name = $value["name"];
			insert_into_table($mysqlConnection, "datadragon_champion", ["c_key" => $value["key"], "c_id" => "'" . $value["id"] . "'", "c_name" => "'" . str_replace("'"," ",$value["name"]) . "'"]);
		}
	}
	else
	{	
		curl_close($curl);
		return null;
	}
}


function get_champion_id_by_name($mysqlConnection, $name)
{
	$d = select_from_table($mysqlConnection, "datadragon_champion", ["c_id", "c_key", "c_name"], " WHERE c_name = '" . $name . "'");
	return $d[0]["c_id"];
}

function get_champion_info($mysqlConnection, $cond, $info)
//  ($mysqlConnection, ["c_key" => 52], "c_id") == get id by key
{
	$condKey = array_keys($cond);
	$condValue = array_values($cond);
	$d = select_from_table($mysqlConnection, "datadragon_champion", ["c_id", "c_key", "c_name"], " WHERE " . $condKey[0] . " = '" . $condValue[0] . "'");
	return $d[0][$info];
}


function get_champion_img($mysqlConnection, $value, $mode = "id")
// echo "<img src=" . get_champion_img("1", "key") . ">";
{
	if ($mode == "key")
	{
		$url = "https://ddragon.leagueoflegends.com/cdn/" . get_data_dragon_version($mysqlConnection) . "/img/champion/" . get_champion_info($mysqlConnection, ["c_key" => $value], "c_id") . ".png";
	}
	elseif ($mode == "id")
	{
		$url = "https://ddragon.leagueoflegends.com/cdn/" . get_data_dragon_version($mysqlConnection) . "/img/champion/" . $value . ".png";
	}
	elseif ($mode == "name")
	{
		$url = "https://ddragon.leagueoflegends.com/cdn/" . get_data_dragon_version($mysqlConnection) . "/img/champion/" . get_champion_info($mysqlConnection, ["c_name" => $value], "c_id") . ".png";
	}
	else
	{
		$url = "https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png";
	}
	
	return $url;
}

function get_summoner_img($mysqlConnection, $value)
{
	return ("https://ddragon.leagueoflegends.com/cdn/" . get_data_dragon_version($mysqlConnection) . "/img/profileicon/" . $value . ".png");
}



function get_queue_json()
{
	$curl = curl_init("https://static.developer.riotgames.com/docs/lol/queues.json");
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

function save_queue_in_db($mysqlConnection)
{
	foreach (get_queue_json() as $queue)
	{
		$fetch = select_from_table($mysqlConnection, "queue_info", ["id"], " WHERE queue_id='".$queue["queueId"]."'")[0];
		if ($fetch == null)
		{
			$dict_data = [
				"queue_id" => $queue["queueId"],
				"map" => "'".str_replace("'"," ",$queue["map"])."'",
				"description" => "'".str_replace("'"," ",$queue["description"])."."."'",
				"note" => "'".str_replace("'"," ",$queue["notes"])."."."'"
			];
			insert_into_table($mysqlConnection, "queue_info", $dict_data);
		}
	}
}


function init_datadragon($mysqlConnection)
{
	$registered_version = select_from_table($mysqlConnection, "datadragon_version", ["d_version"])[0]["d_version"];
	$online_version = get_data_dragon_last_version();

	if ($registered_version != $online_version)
	{
		update_from_table($mysqlConnection, "datadragon_version", ["id" => "0"], ["d_version" => "'".$online_version."'"]);
		fetch_champion_data_dict($mysqlConnection);
	}

	save_queue_in_db($mysqlConnection);
}

function convert_queue_id($mysqlConnection, $queue_id)
{
	$fetch = select_from_table($mysqlConnection, "queue_info", ["description"], " WHERE queue_id=".$queue_id)[0];
	return $fetch["description"];
}

?>
