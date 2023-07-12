<?php

try
{
	$mysqlClient = new PDO('','','');
}
catch(Exception $e)
{
	echo "Can't connect to database !";
	die('Erreur : ' . $e->getMessage());
}



//----------------------------------------------------------------------------------------------------------

function convert_puuid_to_mysql($puuid)
{
	$maxLength = 64-6;
	return str_replace("-","Z",substr($puuid, 0, $maxLength));
}

function convert_into_dict_mysql_query($mysqlQuery, $txtDict)
//Change le resultat classique d'une query mySQL de la forme [['1','name1'],['2','name2']] en un array de dictionnaire [['id':'1','user_name':'name1'],['id':'2','user_name':'name2']]
{
	$resultDict = [];
	foreach ($mysqlQuery as $i)
	{
		for ($j=0; $j < count($i) ;$j++)
		{
			$Dict[$txtDict[$j]] = $i[$j];
		}
		array_push($resultDict,$Dict);
	}

	return $resultDict;
}


function select_from_table($mysqlConnection, $table, $arrayData, $additional = "")
//Fonction général d'un SELECT d'une TABLE (* non fonctionnel)
{
	$mysqlQuery = 'SELECT ';
	foreach ($arrayData as $data)
	{
		$mysqlQuery .= $data . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= " FROM " . $table . $additional . ";";
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
	$Result = $mysqlResult->fetchAll();
	return convert_into_dict_mysql_query($Result,$arrayData);
}

function insert_into_table($mysqlConnection, $table, $dictData)
//Fonction général d'un INSERT dans une TABLE
//dictData est un dict de la forme ['id':'1','user_name':'name1']
{
	$dataKeys = array_keys($dictData);
	$dataValues = array_values($dictData);
	$mysqlQuery = "INSERT INTO " . $table . " (";
	foreach ($dataKeys as $key)
	{
		$mysqlQuery .= $key . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= ") VALUE (";
	foreach ($dataValues as $value)
	{
		$mysqlQuery .= $value . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= ");";
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
}

function delete_from_table($mysqlConnection, $table, $cond)
//["game_id" => 'EUW1_gdfvwfbwdr']
{
	$cond_keys = array_keys($cond);
	$cond_values = array_values($cond);
	$mysqlQuery = "DELETE FROM " . $table . " WHERE ";
	foreach ($cond_keys as $key)
	{
		$mysqlQuery .= $key . "=";
	}
	foreach ($cond_values as $value)
	{
		$mysqlQuery .= $value . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= ";";
	
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
}

function update_from_table($mysqlConnection, $table, $dictIndex, $dictData)
//Fonction général d'un UPDATE dans une TABLE
//dictData est un dict de la forme ['id':'1','user_name':'name1']
//dictIndex est un dict de taile 1 de la forme ['id':'1']
{
	$dataKeys = array_keys($dictData);
	$dataValues = array_values($dictData);
	$indexKeys = array_keys($dictIndex);
	$mysqlQuery = "UPDATE " . $table . " SET ";
	for ($i=0; $i < count($dataValues); $i++)
	{
		$mysqlQuery .= $dataKeys[$i] . "=";
		$mysqlQuery .= $dataValues[$i] . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= " WHERE ";
	foreach ($indexKeys as $key)
	{
		$mysqlQuery .= $key . "=";
	}
	foreach ($dictIndex as $value)
	{
		$mysqlQuery .= $value . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= ";";
	
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
}

function create_table($mysqlConnection, $table, $dictData)
//Fonction général d'un UPDATE dans une TABLE
//dictData est un dict de la forme ['user_id':'INT(15)','user_name':'VARCHAR(30)']
{
	$dataKeys = array_keys($dictData);
	$dataValues = array_values($dictData);

	$maxLength = 64;
    $table = substr($table, 0, $maxLength);

	$mysqlQuery = "CREATE TABLE IF NOT EXISTS " . $table . " (id INT AUTO_INCREMENT PRIMARY KEY, ";
	for($i=0; $i < count($dictData) ;$i++)
	{
		$mysqlQuery .= $dataKeys[$i] . " ";
		$mysqlQuery .= $dataValues[$i] . ", ";
	}
	$mysqlQuery = substr($mysqlQuery, 0, -2);
	$mysqlQuery .= ");";
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
}

function drop_table($mysqlConnection, $table)
{
	$mysqlQuery = "DROP TABLE IF EXISTS " . $table . ";";
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
}


//Examples :
//select_from_table($mysqlConnection, $table, $arrayData)
//insert_into_table($mysqlClient, "test_table", ["user_name" => "name3"]);
//delete_from_table($mysqlClient, "test_table", ["user_name" => "name3"]);
//update_from_table($mysqlClient, "test_table", ["id" => "1"], ["user_name" => "WHAOU"]);
//create_table($mysqlClient, "test_table2", ['user_id' => 'INT(15)','user_name' =>'VARCHAR(30)']);
//drop_table($mysqlClient, "test_table2");

//$mysqlQuery = select_from_table($mysqlClient, "test_table", ["id","user_name"]);



function init_new_summoner_table($mysqlConnection, $puuid)
{
    $puuid_truncated = convert_puuid_to_mysql($puuid);

	$mysqlQuery = "SHOW TABLES LIKE '" . $puuid_truncated . "_games';";
	$mysqlResult = $mysqlConnection->prepare($mysqlQuery);
	$mysqlResult->execute();
	$Result = $mysqlResult->fetchAll();

	if ($Result == null)
	{
		$table_format = [
			'game_id' => 'VARCHAR(20)', 
			'plateform' => 'VARCHAR(5)', 
			'game_duration' => 'INT(10)', 
			'champion_id' => 'INT(5)', 
			'role' => 'VARCHAR(10)', 
			'queue_id' => 'INT(5)',
			'win' => 'TINYINT(1)',
			'team_id' => 'INT(5)',
			'nb_kill' => 'INT(5)',
			'nb_death' => 'INT(5)',
			'nb_assist' => 'INT(5)',
			'kda' => 'FLOAT(8,5)',
			'kp' => 'FLOAT(5,3)',
			'total_damage_dealt' => 'INT(10)',
			'damage_per_minute' => 'FLOAT(20,3)',
			'total_damage_taken' => 'INT(10)',
			'total_gold' => 'INT(10)',
			'gold_per_minute' => 'FLOAT(7,3)',
			'total_level' => 'INT(2)',
			'total_experience' => 'INT(6)',
			'experience_per_minute' => 'FLOAT(10,3)',
			'total_minion_killed' => 'INT(5)',
			'neutral_minion_killed' => 'INT(5)',
			'minion_per_minute' => 'FLOAT(5,1)',
			'minion_advantage' => 'INT(4)',
			'vision_score' => 'INT(4)',
			'vision_score_per_minute' => 'FLOAT(4,2)',
			'vision_ward_bought' => 'INT(5)',
			'vision_advantage' => 'FLOAT(4,2)'
		];
		create_table($mysqlConnection, $puuid_truncated . "_games", $table_format);
	}

	$f = select_from_table($mysqlConnection, "summoner_stats", ["puuid"], " WHERE puuid = '" . $puuid . "'");
	if ($f == null)
	{
		$data = ["puuid" => "'".$puuid."'", "winrate" => "0", "kda" => "0", "kp" => "0", "minion_per_minute" => "0", "vision_score_per_minute" => "0", "average_death" => "0","average_kill" => "0","average_assist" => "0", "nb_total_game" => "0"];
		insert_into_table($mysqlConnection, "summoner_stats", $data);
	}
}


function init_new_summoner_filter($mysqlConnection, $puuid)
{
	$isAlreadyRegistered = select_from_table($mysqlConnection, "summoner_filter", ["id"], " WHERE puuid='" . $puuid . "'");
	if ($isAlreadyRegistered == null)
	{
		insert_into_table($mysqlConnection, "summoner_filter", ["puuid" => "'".$puuid."'", "ranked" => 0, "champion" => 0]);
	}
}







?>
