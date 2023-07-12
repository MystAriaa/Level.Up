<?php

function get_sum_info_and_db($mysqlClient, $sum_name, $sum_region)
{
	$fetch_sum_info = get_summoner_info_by_name($sum_name, $sum_region);
	if ($fetch_sum_info == null)
	{
		return null;
	}
	$our_registered_sum_info = select_from_table($mysqlClient, "summoner_info", ["puuid"], " WHERE summoner_name = '" . $_GET["Summoner_Name"] . "'");
	if (!isset($our_registered_sum_info))
	{
		insert_into_table($mysqlClient, "summoner_info", ["puuid" => "'".$fetch_sum_info["puuid"]."'", "summoner_name" => "'".$fetch_sum_info["name"]."'", "profile_icon" => $fetch_sum_info["profileIconId"]]);
		return (["puuid" => $fetch_sum_info["puuid"], "summoner_name" => $fetch_sum_info["name"], "profile_icon" => $fetch_sum_info["profileIconId"]]);
	}
	else
	{
		if ($our_registered_sum_info == null)
		{
			insert_into_table($mysqlClient, "summoner_info", ["puuid" => "'".$fetch_sum_info["puuid"]."'", "summoner_name" => "'".$fetch_sum_info["name"]."'", "profile_icon" => $fetch_sum_info["profileIconId"]]);
			return (["puuid" => $fetch_sum_info["puuid"], "summoner_name" => $fetch_sum_info["name"], "profile_icon" => $fetch_sum_info["profileIconId"]]);
		}

		if ($fetch_sum_info["puuid"] != $our_registered_sum_info[0]["puuid"] || $fetch_sum_info["profileIconId"] != $our_registered_sum_info[0]["profile_icon"])
		{
			update_from_table($mysqlClient, "summoner_info", ["summoner_name" => "'".$fetch_sum_info["name"]."'"], ["puuid" => "'".$fetch_sum_info["puuid"]."'", "profile_icon" => "'".$fetch_sum_info["profileIconId"]."'"]);
			return (["puuid" => $fetch_sum_info["puuid"], "summoner_name" => $fetch_sum_info["name"], "profile_icon" => $fetch_sum_info["profileIconId"]]);
		}
	}
	return null;
}


function get_game_list_and_db($mysqlClient, $puuid, $region)
{
	$puuid_truncated = convert_puuid_to_mysql($puuid);
	$dict_match = array_reverse(array_values(get_list_match($puuid, $region, "10")));
	$our_registered_games = select_from_table($mysqlClient, $puuid_truncated . "_games", ["game_id"]);
	$our_reg_games = [];
	foreach($our_registered_games as $game)
	{
		array_push($our_reg_games, $game["game_id"]);
	}

	foreach ($dict_match as $match)
	{
		if (!(in_array($match, $our_reg_games)))
		{
			insert_into_table($mysqlClient, $puuid_truncated . "_games", ["game_id" => "'".$match."'"]);
		}
	}
}
					

function get_game_info_and_db($mysqlClient, $puuid, $Region)
{
	$puuid_truncated = convert_puuid_to_mysql($puuid);
	$our_registered_games = select_from_table($mysqlClient, $puuid_truncated . "_games", ["game_id","game_duration"]);

	foreach($our_registered_games as $game)
	{
		if ($game["game_duration"] == null && $game["game_id"] != null)
		{
			$game_info = get_game_info($game["game_id"], $Region);
			
			if ($game_info["info"]["queueId"] == 400 || $game_info["info"]["queueId"] == 420 || $game_info["info"]["queueId"] == 430 || $game_info["info"]["queueId"] == 440)
			{
				$notre_participant = [];
				foreach ($game_info["info"]["participants"] as $participant)
				{
					if ($participant["puuid"] == $puuid)
					{
						$notre_participant = $participant;
					}
				}
				$dict_index = ["game_id" => "'".$game["game_id"]."'"];

				if ($notre_participant["win"])
				{
					$win = 1;
				}
				else
				{
					$win = 0;
				}
				$data_dict = [
				"plateform" => "'".$game_info["info"]["platformId"]."'",
				"game_duration" => $game_info["info"]["gameDuration"],
				"champion_id" => $notre_participant["championId"],
				"role" => "'".$notre_participant["role"]."'",
				"queue_id" => $game_info["info"]["queueId"],
				"win" => $win,
				"team_id" => $notre_participant["teamId"],
				"nb_kill" => $notre_participant["kills"],
				"nb_death" => $notre_participant["deaths"],
				"nb_assist" => $notre_participant["assists"],
				"kda" => $notre_participant["challenges"]["kda"],
				"kp" => $notre_participant["challenges"]["killParticipation"],
				"total_damage_dealt" => $notre_participant["totalDamageDealt"],
				"damage_per_minute" => $notre_participant["challenges"]["damagePerMinute"],
				"total_damage_taken" => $notre_participant["totalDamageTaken"],
				"total_gold" => $notre_participant["goldEarned"],
				"gold_per_minute" => $notre_participant["challenges"]["goldPerMinute"],
				"total_level" => $notre_participant["champLevel"],
				"total_experience" => $notre_participant["champExperience"],
				"experience_per_minute" => ($notre_participant["champExperience"] / ($game_info["info"]["gameDuration"]/60)),
				"total_minion_killed" => $notre_participant["totalMinionsKilled"],
				"neutral_minion_killed" => $notre_participant["neutralMinionsKilled"],
				"minion_per_minute" => ($notre_participant["totalMinionsKilled"] / ($game_info["info"]["gameDuration"]/60)),
				"minion_advantage" => 0,
				"vision_score" => $notre_participant["visionScore"],
				"vision_score_per_minute" => $notre_participant["challenges"]["visionScorePerMinute"],
				"vision_ward_bought" => $notre_participant["visionWardsBoughtInGame"],
				"vision_advantage" => $notre_participant["challenges"]["visionScoreAdvantageLaneOpponent"]
				];
				if ($notre_participant["challenges"]["visionScoreAdvantageLaneOpponent"] == null)
				{
					$data_dict["vision_advantage"] = 0;
				}
				if ($notre_participant["challenges"]["killParticipation"] == null)
				{
					$data_dict["kp"] = 0;
				}
				if ($notre_participant["challenges"]["kda"] == null)
				{
					$data_dict["kda"] = 0;
				}
				update_from_table($mysqlClient, $puuid_truncated . "_games", $dict_index, $data_dict);
			}
			else
			{
				delete_from_table($mysqlClient, $puuid_truncated . "_games", ["game_id" => "'". $game["game_id"] ."'"]);
			}
			
		}
	}
}



function calc_average_and_db($mysqlClient, $puuid)
{
	$summoner_filter_info = select_from_table($mysqlClient, "summoner_filter", ["ranked","champion"], " WHERE puuid='" . $puuid . "'")[0];
	$additional_condition_filter = "";
	if ($summoner_filter_info["ranked"] == 1)
	{
		$additional_condition_filter = " WHERE queue_id=420";
	}
	if ($summoner_filter_info["champion"] != 0)
	{
		$additional_condition_filter = " WHERE champion_id=" . $summoner_filter_info["champion"];
	}
	if ($summoner_filter_info["ranked"] == 1 && $summoner_filter_info["champion"] != 0)
	{
		$additional_condition_filter = " WHERE queue_id=420 and champion_id=" . $summoner_filter_info["champion"];
	}

	$puuid_truncated = convert_puuid_to_mysql($puuid);
	$our_registered_games = select_from_table($mysqlClient, $puuid_truncated . "_games", ["win","kda","kp","total_minion_killed","neutral_minion_killed","vision_score_per_minute","nb_kill","nb_death","nb_assist","game_duration"], $additional_condition_filter);
	$nb_total_game = count($our_registered_games);
	$a_win = 0;
	$a_kda = 0;
	$a_kp = 0;
	$a_minion_per_minute = 0;
	$a_vision_score_per_minute = 0;
	$a_kill = 0;
	$a_death = 0;
	$a_assist = 0;

	foreach ($our_registered_games as $game)
	{
		$a_win += $game["win"];
		$a_kda += $game["kda"];
		$a_kp += $game["kp"];
		$a_minion_per_minute += $game["total_minion_killed"] + $game["neutral_minion_killed"];
		$a_vision_score_per_minute += $game["vision_score_per_minute"];
		$a_kill += $game["nb_kill"];
		$a_death += $game["nb_death"];
		$a_assist += $game["nb_assist"];
	}
	$index_dict = ["puuid" => "'".$puuid."'"];

	if ($nb_total_game == 0)
	{
		$data_dict = [
			"winrate" => 0,
			"kda" => 0,
			"kp" => 0,
			"minion_per_minute" => 0,
			"vision_score_per_minute" => 0,
			"average_kill" => 0,
			"average_death" => 0,
			"average_assist" => 0,
			"nb_total_game" => 0
		];
	}
	else
	{
		$data_dict = [
			"winrate" => $a_win / $nb_total_game,
			"kda" => $a_kda / $nb_total_game,
			"kp" => $a_kp / $nb_total_game,
			"minion_per_minute" => ($a_minion_per_minute / $nb_total_game)/($game["game_duration"]/60),
			"vision_score_per_minute" => $a_vision_score_per_minute / $nb_total_game,
			"average_kill" => $a_kill / $nb_total_game,
			"average_death" => $a_death / $nb_total_game,
			"average_assist" => $a_assist / $nb_total_game,
			"nb_total_game" => $nb_total_game
		];
	}
	
	update_from_table($mysqlClient, "summoner_stats", $index_dict, $data_dict);
}

?>