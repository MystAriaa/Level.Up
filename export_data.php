<?php 
	include "package/mysql_connector.php";
	include "package/riot_connector.php";
	include "package/data_dragon.php";
	include "package/data_traitement.php";
	
	init_datadragon($mysqlClient);
	
	if (isset($_GET["Summoner_Name"]) && isset($_GET["Region"]))
	{
		$sum_info = get_sum_info_and_db($mysqlClient, $_GET["Summoner_Name"], $_GET["Region"]);
		if ($sum_info == null)
		{
			echo "pas de donnée summoner";
		}
		else
		{
			$puuid_truncated = convert_puuid_to_mysql($sum_info["puuid"]);
			$our_registered_games = array_reverse(select_from_table($mysqlClient, $puuid_truncated . "_games", ['game_id',
																												'plateform',
																												'game_duration',
																												'champion_id',
																												'role',
																												'queue_id',
																												'win',
																												'team_id',
																												'nb_kill',
																												'nb_death',
																												'nb_assist',
																												'kda',
																												'kp',
																												'total_damage_dealt',
																												'damage_per_minute',
																												'total_damage_taken',
																												'total_gold',
																												'gold_per_minute',
																												'total_level',
																												'total_experience',
																												'experience_per_minute',
																												'total_minion_killed',
																												'minion_per_minute',
																												'minion_advantage',
																												'vision_score',
																												'vision_score_per_minute',
																												'vision_ward_bought',
																												'vision_advantage'], ""));
			header('Content-Type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename=levelup_data.csv');
			$output = fopen('php://output', 'w');



			fputcsv($output, ['id', 
							'game_id',
							'plateform',
							'game_duration',
							'champion_id',
							'role',
							'queue_id',
							'win',
							'team_id',
							'nb_kill',
							'nb_death',
							'nb_assist',
							'kda',
							'kp',
							'total_damage_dealt',
							'damage_per_minute',
							'total_damage_taken',
							'total_gold',
							'gold_per_minute',
							'total_level',
							'total_experience',
							'experience_per_minute',
							'total_minion_killed',
							'minion_per_minute',
							'minion_advantage',
							'vision_score',
							'vision_score_per_minute',
							'vision_ward_bought',
							'vision_advantage']);
			$count = 0;
			foreach ($our_registered_games as $game)
			{
				fputcsv($output, [$count, $game['game_id'],
											$game['plateform'],
											$game['game_duration'],
											$game['champion_id'],
											$game['role'],
											$game['queue_id'],
											$game['win'],
											$game['team_id'],
											$game['nb_kill'],
											$game['nb_death'],
											$game['nb_assist'],
											$game['kda'],
											$game['kp'],
											$game['total_damage_dealt'],
											$game['damage_per_minute'],
											$game['total_damage_taken'],
											$game['total_gold'],
											$game['gold_per_minute'],
											$game['total_level'],
											$game['total_experience'],
											$game['experience_per_minute'],
											$game['total_minion_killed'],
											$game['minion_per_minute'],
											$game['minion_advantage'],
											$game['vision_score'],
											$game['vision_score_per_minute'],
											$game['vision_ward_bought'],
											$game['vision_advantage']]);
				$count++;
			}




			fputcsv($output, [""]);



			fputcsv($output, ['id', 'Champion', "K", "D", "A", "Win or Lose", "Ward", "Pink", "SV", "Farm", "Time", "Total Kills", "Kill Participation"]);
			$count = 0;
			foreach ($our_registered_games as $game)
			{
				$r = "Lose";
				if ($game["win"] == 1)
				{
					$r = "Win";
				}
				else
				{
					$r = "Lose";
				}
				fputcsv($output, [$count, get_champion_info($mysqlClient, ["c_key" => $game["champion_id"]], "c_name"), $game["nb_kill"], $game["nb_death"], $game["nb_assist"], $r, "", $game['vision_ward_bought'] ,$game["vision_score"], $game["total_minion_killed"], round($game["game_duration"]/60, 2), "", $game['kp']*100]);
				$count++;
			}
		}
	}
?>