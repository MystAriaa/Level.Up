<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="static/css/levelup_dashboard_style.css" />
	<link rel="shortcut icon" href="static/assets/favicon.ico">
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
	<?php include "package/mysql_connector.php";?>
	<?php include "package/riot_connector.php";?>
	<?php include "package/data_dragon.php";?>
	<?php include "package/data_traitement.php";?>
	
	<?php init_datadragon($mysqlClient); ?>

	<?php
	if (isset($_GET["Summoner_Name"]) && isset($_GET["Region"]))
	{
		$sum_info = get_sum_info_and_db($mysqlClient, $_GET["Summoner_Name"], $_GET["Region"]);
		if ($sum_info == null)
		{
			echo "pas de donnée summoner";
		}
		else
		{
			init_new_summoner_table($mysqlClient, $sum_info["puuid"]);

			init_new_summoner_filter($mysqlClient, $sum_info["puuid"]);
			
			if (isset($_GET["Flag_Update"]))
			{
				if ($_GET["Flag_Update"] == "True")
				{
					get_game_list_and_db($mysqlClient, $sum_info["puuid"], $_GET["Region"]);
					//-------------------------------------------------------------------------------------------
					get_game_info_and_db($mysqlClient, $sum_info["puuid"], $_GET["Region"]);
					//-------------------------------------------------------------------------------------------
					calc_average_and_db($mysqlClient, $sum_info["puuid"]);
				}
			}

			if (isset($_GET["selected_queue"]) || isset($_GET["selected_champion"]))
			{
				$dictIndex = ["puuid" => "'".$sum_info["puuid"]."'"];
				$dataDict = ["ranked" => 0, "champion" => 0];
				if (isset($_GET["selected_queue"]))
				{
					if ($_GET["selected_queue"] == "Only ranked games")
					{
						$dataDict["ranked"] = 1;
					}
					else
					{
						$dataDict["ranked"] = 0;
					}
				}
				if (isset($_GET["selected_champion"]))
				{
					if ($_GET["selected_champion"] == "Ø")
					{
						$dataDict["champion"] = 0;
					}
					else
					{
						$dataDict["champion"] = get_champion_info($mysqlClient, ["c_id" => $_GET["selected_champion"]], "c_key");
					}	
				}
				update_from_table($mysqlClient, "summoner_filter", $dictIndex, $dataDict);
				calc_average_and_db($mysqlClient, $sum_info["puuid"]);
			}
			
			$summoner_stats = select_from_table($mysqlClient,"summoner_stats",["winrate","kda","kp","minion_per_minute","vision_score_per_minute","average_kill","average_assist","average_death","nb_total_game"], " WHERE puuid ='" . $sum_info["puuid"] . "';")[0];
			
		}
		$summoner_filter_info = select_from_table($mysqlClient, "summoner_filter", ["ranked","champion"], " WHERE puuid='" . $sum_info["puuid"] . "'")[0];
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
	}
	?>

	<script>
		function drawChart() {
			var winrate_data = google.visualization.arrayToDataTable([
			['0', '1'],
			['Win', <?php echo $summoner_stats["winrate"]*100; ?>],
			['Loose', 100-<?php echo $summoner_stats["winrate"]*100; ?>]
			]);
			var cs_data = google.visualization.arrayToDataTable([
			['0', '1'],
			['Gain', <?php echo $summoner_stats["minion_per_minute"]; ?>],
			['Lost', 12-<?php echo $summoner_stats["minion_per_minute"]; ?>]
			]);
			var vs_data = google.visualization.arrayToDataTable([
			['0', '1'],
			['In', <?php echo $summoner_stats["vision_score_per_minute"]; ?>],
			['Out', 3.5-<?php echo $summoner_stats["vision_score_per_minute"]; ?>]
			]);
			var kp_data = google.visualization.arrayToDataTable([
			['0', '1'],
			['In', <?php echo $summoner_stats["kp"]*100; ?>],
			['Out', 100-<?php echo $summoner_stats["kp"]*100; ?>]
			]);

			var pie_options = {
				legend: 'none',
				pieHole: 0.6,
				backgroundColor: 'transparent',
				chartArea:{left:'2%',top:'2%',width:'96%',height:'96%'},
				tooltip: { trigger: 'none' },
				pieSliceText: 'none',
			};

			var chart0 = new google.visualization.PieChart(document.getElementById('Winrate_chart'));
			chart0.draw(winrate_data, pie_options);
			var chart1 = new google.visualization.PieChart(document.getElementById('VS_chart'));
			chart1.draw(vs_data, pie_options);
			var chart2 = new google.visualization.PieChart(document.getElementById('CS_chart'));
			chart2.draw(cs_data, pie_options);
			var chart3 = new google.visualization.PieChart(document.getElementById('KP_chart'));
			chart3.draw(kp_data, pie_options);
		}

		$(document).ready(function() {
			document.getElementById('Winrate_text').innerHTML = 'Winrate<br><?php echo $summoner_stats["winrate"]*100; ?>%';
			document.getElementById('CS_text').innerHTML = 'CS/min<br><?php echo $summoner_stats["minion_per_minute"]; ?>';
			document.getElementById('VS_text').innerHTML = 'VS/min<br><?php echo $summoner_stats["vision_score_per_minute"]; ?>';
			document.getElementById('KP_text').innerHTML = 'KP<br><?php echo $summoner_stats["kp"]*100; ?>%';
			document.getElementById('KDA_part1').innerHTML = '<?php echo $summoner_stats["average_kill"]; ?> / <?php echo $summoner_stats["average_death"]; ?> / <?php echo $summoner_stats["average_assist"]; ?>';
			document.getElementById('KDA_part2').innerHTML = '<?php echo round($summoner_stats["kda"],2); ?>';
			if (<?php echo $summoner_stats["kda"]; ?> < 1)
			{
				document.getElementById('KDA_part2').style.color = '#FF0000';
			}
			else if (1 <= <?php echo $summoner_stats["kda"]; ?> && <?php echo $summoner_stats["kda"]; ?> < 3)
			{
				document.getElementById('KDA_part2').style.color = '#0080FF';
			}
			else if (<?php echo $summoner_stats["kda"]; ?> >= 3)
			{
				document.getElementById('KDA_part2').style.color = '#FFD700';
			}

			google.charts.load("current", {packages:["corechart"]});
			google.charts.setOnLoadCallback(drawChart);
		})
	</script>
</head>

<body class="body">
	<div class="body_header">
		<div class="header_logo">
			<img src="static/assets/Title-web2.png" alt="levelup_logo" width="220" height="50" style="position: relative; top: 10px;">
		</div>
		<div class="header_middle">
			<form method="GET" action="/levelup/dashboard.php" class="header_bar_form">
				<input type="text" name="Summoner_Name" required class="header_input_name" placeholder="Summoner Name">
				<SELECT name="Region" size="1" class="header_input_region">
					<OPTION>Europe West
					<OPTION>North America
					<OPTION>Europe Nordic & East
					<OPTION>Korea
					<OPTION>Japan
					<OPTION>Russia    
					<OPTION>Turkey
					<OPTION>Brazil
					<OPTION>Latin America North
					<OPTION>Latin America South
					<OPTION>Oceania
				</SELECT>
				
				<button class="header_input_button">Get Stats !</button>
			</form>
		</div>
		<div class="csv_export">
			<form method="GET" action="/levelup/export_data.php" >
				<button class="csv_export_button">Export Data</button>
				<input type="hidden" name="Summoner_Name" value="<?php echo $_GET["Summoner_Name"]; ?>">
				<input type="hidden" name="Region" value="<?php echo $_GET["Region"]; ?>">
			</form>
		</div>
		<div class="update_data">
			<form method="GET" action="/levelup/dashboard.php" >
				<button class="update_data_button">Update Info</button>
				<input type="hidden" name="Flag_Update" value="True">
				<input type="hidden" name="Summoner_Name" value="<?php echo $_GET["Summoner_Name"]; ?>">
				<input type="hidden" name="Region" value="<?php echo $_GET["Region"]; ?>">
			</form>
		</div>
	</div>


	<div class="body_body">
		<div class="summoner_icon">
			<?php echo "<img style='width: 100%; height: 100%;' src=" . get_summoner_img($mysqlClient, $sum_info["profile_icon"]) . ">"; ?>
		</div>
		<div class="summoner_name">
			<?php echo $sum_info["summoner_name"]; ?>
		</div>
		<div class="average_value">
			<p class="Winrate_text" id="Winrate_text"></p>
			<div class="Winrate_chart" id="Winrate_chart"></div>
			<p class="CS_text" id="CS_text"></p>
			<div class="CS_chart" id="CS_chart"></div>
			<p class="VS_text" id="VS_text"></p>
			<div class="VS_chart" id="VS_chart"></div>
			<p class="KDA_part1" id="KDA_part1"></p> 
			<p class="KDA_part2" id="KDA_part2"></p>
			<div class="KP_chart" id="KP_chart"></div>
			<p class="KP_text" id="KP_text"></p>
			<p class="total_game"><?php echo count(select_from_table($mysqlClient, convert_puuid_to_mysql($sum_info["puuid"]) . "_games", ["win"], $additional_condition_filter)); ?> total registered games</p>
		</div>
		<div class="filter_option">
			<form method="GET" action="/levelup/dashboard.php" class="filter_form">
				<input type="hidden" name="Summoner_Name" value="<?php echo $_GET["Summoner_Name"]; ?>">
				<input type="hidden" name="Region" value="<?php echo $_GET["Region"]; ?>">
				<SELECT name="selected_queue" size="1" class="ranked_selection">
					<OPTION>Normal and ranked games
					<OPTION>Only ranked games
				</SELECT>
				<SELECT name="selected_champion" size="1" class="champion_selection">
					<OPTION>Ø
					<?php
					$e = select_from_table($mysqlClient, "datadragon_champion", ["c_id"]);
					foreach ($e as $a)
					{
						echo "<OPTION>" . $a["c_id"];
					}?>
				</SELECT>
				<button class="filter_button">Filter</button>
			</form>
		</div>
		<div class="match_list">
			<?php
				$puuid_truncated = convert_puuid_to_mysql($sum_info["puuid"]);
				$our_registered_games = array_reverse(select_from_table($mysqlClient, $puuid_truncated . "_games", ["win","champion_id","nb_kill","nb_death","nb_assist","kda","total_level","game_duration","total_gold","total_minion_killed","neutral_minion_killed","vision_score","gold_per_minute","vision_score_per_minute","game_duration","queue_id"], $additional_condition_filter));
				foreach ($our_registered_games as $game)
				{	
					if ($game["win"] == 1)
					{
						$s = "border-color: #3266CC; background-color: #1C232F;";
						$ss= "border-color: #3266CC;";
					}
					else
					{
						$s = "border-color: #DC3912; background-color: #311D18;";
						$ss = "border-color: #DC3912;";
					}
					?>
					<div class="match" style="<?php echo $s; ?>">
						<div class="champion_icon">
							<img style='width: 100%; height: 100%;' src="<?php echo get_champion_img($mysqlClient, $game["champion_id"], $mode = "key"); ?>">
						</div>
						<div class="game_info">
							<div class ="score">
								<p><?php echo ($game["nb_kill"]." / ".$game["nb_death"]." / ".$game["nb_assist"]); ?></p>
							</div>
							<div class="kda">
								<p><?php echo round($game["kda"],2); ?></p>
							</div>
							<div class="level" style="<?php echo $ss; ?>">
								<p style="position: absolute; top: -15px; right: 5px;"><?php echo $game["total_level"]; ?></p>
							</div>
							<div class="stats">
							<p>Gold: <?php echo $game["total_gold"]; ?> (<?php echo round($game["gold_per_minute"],1); ?>)<br>
							CS: <?php echo $game["total_minion_killed"]+$game["neutral_minion_killed"]; ?> (<?php echo round(($game["total_minion_killed"]+$game["neutral_minion_killed"])/($game["game_duration"]/60),2); ?>)<br>
							VS: <?php echo $game["vision_score"]; ?> (<?php echo $game["vision_score_per_minute"]; ?>)</p>
							</div>
							<div class="queue">
								<p><?php echo convert_queue_id($mysqlClient, $game["queue_id"]); ?></p>
							</div>
							<div class="duration">
								<p><?php echo date("i:s",$timestamp = $game["game_duration"]); ?></p>
							</div>
						</div>
					</div>
					<?php
				}
				?>
		</div>







		<?php $list_games = select_from_table($mysqlClient, $puuid_truncated . "_games", ["kp","game_duration","champion_id","total_minion_killed","neutral_minion_killed","vision_score_per_minute","nb_death","nb_kill","nb_death","nb_assist"],$additional_condition_filter);?>
		<script>
			$(document).ready(function() {
				google.charts.load('current', {'packages':['line']});
				google.charts.setOnLoadCallback(drawChartData);
			});

			function drawChartData() {
				var a = <?php echo json_encode($list_games);?>;
				<?php
				$array = [];
				foreach ($list_games as $game)
				{
					array_push($array,get_champion_img($mysqlClient, $game["champion_id"], $mode = "key"));
				}
				?>
				var champion_img_link = <?php echo json_encode($array);?>;
				var t = "<div style='background-color: #191919; text-align: center;'><img width=100px src=";
				var tt = ">";

				var dataTable = new google.visualization.DataTable();
				dataTable.addColumn('number', '#game');
				dataTable.addColumn('number', 'KP');
				dataTable.addColumn({type: 'string', role: 'tooltip', p: {html:true}});
				
				rows = [];
				for (let i = 0; i < a.length; i++)
				{
					rows.push([i,a[i]["kp"]*100,t.concat(champion_img_link[i],tt,"<p style='font-size: 20px;'>", a[i]["nb_kill"]," / ", a[i]["nb_death"]," / ", a[i]["nb_assist"],"<br>",a[i]["kp"]*100,"</p></div>")]);
				}
				dataTable.addRows(rows);

				var options = {
					title: 'Evolution of Kill Participation (KP %)',
					fontSize: 25,
					titlePosition: 'in',
					titleTextStyle: {
						color: 'white',
						fontSize: 20,
					},
					backgroundColor: '#191919',
					chartArea: {
						backgroundColor: '#191919',
						width: '90%',
						height: '90%'
					},
					vAxis: {
	   					minValue:0,
						maxValue:100,
						textStyle: {color: 'white'},
						minorGridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						}
					},
					hAxis: {
						textStyle: {color: 'white'},
						baselineColor: {color: 'none'},
						gridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						}
					},
					legend: {position: 'none'},
					trendlines: {
						0: {color: 'red',
							tooltip: false,
							pointsVisible: false,
							visibleInLegend: false,
							pointSize: 1,}
					},
					tooltip: {
						isHtml: true,
						ignoreBounds: true,
						showColorCode: true,
					},
					pointSize: 10,
				};

				var chart = new google.visualization.AreaChart(document.getElementById('chart_kp'));
				chart.draw(dataTable, options);
//----------------------------------------------------------------------------------------
				var dataTable = new google.visualization.DataTable();
				dataTable.addColumn('number', '#game');
				dataTable.addColumn('number', 'CS/min');
				dataTable.addColumn({type: 'string', role: 'tooltip', p: {html:true}});

				rows = [];
				for (let i = 0; i < a.length; i++)
				{
					rows.push([i,(a[i]["total_minion_killed"]+a[i]["neutral_minion_killed"])/(a[i]["game_duration"]/60),t.concat(champion_img_link[i],tt,"<p style='font-size: 20px;'>", a[i]["nb_kill"]," / ", a[i]["nb_death"]," / ", a[i]["nb_assist"],"<br>",(a[i]["total_minion_killed"]+a[i]["neutral_minion_killed"])/(a[i]["game_duration"]/60),"</p></div>")]);
				}
				dataTable.addRows(rows);

				var options = {
					title: 'Evolution of minion farming per minute',
					fontSize: 25,
					titlePosition: 'in',
					titleTextStyle: {
						color: 'white',
						fontSize: 20,
					},
					backgroundColor: '#191919',
					chartArea: {
						backgroundColor: '#191919',
						width: '90%',
						height: '90%'
					},
					vAxis: {
						textStyle: {color: 'white'},
						minorGridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						},
						minValue:0,
					},
					hAxis: {
						textStyle: {color: 'white'},
						baselineColor: {color: 'none'},
						gridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						}
					},
					legend: {position: 'none'},
					trendlines: {
						0: {color: 'red',
							tooltip: false,
							pointsVisible: false,
							visibleInLegend: false,
							pointSize: 1,}
					},
					tooltip: {
						isHtml: true,
						ignoreBounds: true,
						showColorCode: true,
					},
					pointSize: 10,
				};

				var chart = new google.visualization.AreaChart(document.getElementById('chart_cs'));
				chart.draw(dataTable, options);
//----------------------------------------------------------------------------------------
				var dataTable = new google.visualization.DataTable();
				dataTable.addColumn('number', '#game');
				dataTable.addColumn('number', 'VS/min');
				dataTable.addColumn({type: 'string', role: 'tooltip', p: {html:true}});

				rows = [];
				for (let i = 0; i < a.length; i++)
				{
					rows.push([i,a[i]["vision_score_per_minute"],t.concat(champion_img_link[i],tt,"<p style='font-size: 20px;'>", a[i]["nb_kill"]," / ", a[i]["nb_death"]," / ", a[i]["nb_assist"],"<br>",a[i]["vision_score_per_minute"],"</p></div>")]);
				}
				dataTable.addRows(rows);

				var options = {
					title: 'Evolution of vision score per minute (VS/min)',
					fontSize: 25,
					titlePosition: 'in',
					titleTextStyle: {
						color: 'white',
						fontSize: 20,
					},
					backgroundColor: '#191919',
					chartArea: {
						backgroundColor: '#191919',
						width: '90%',
						height: '90%'
					},
					vAxis: {
						textStyle: {color: 'white'},
						minorGridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						},
						minValue:0,
					},
					hAxis: {
						textStyle: {color: 'white'},
						baselineColor: {color: 'none'},
						gridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						}
					},
					legend: {position: 'none'},
					trendlines: {
						0: {color: 'red',
							tooltip: false,
							pointsVisible: false,
							visibleInLegend: false,
							pointSize: 1,}
					},
					tooltip: {
						isHtml: true,
						ignoreBounds: true,
						showColorCode: true,
					},
					pointSize: 10,
				};

				var chart = new google.visualization.AreaChart(document.getElementById('chart_vs'));
				chart.draw(dataTable, options);
//----------------------------------------------------------------------------------------
				var dataTable = new google.visualization.DataTable();
				dataTable.addColumn('number', '#game');
				dataTable.addColumn('number', 'Death');
				dataTable.addColumn({type: 'string', role: 'tooltip', p: {html:true}});

				rows = [];
				for (let i = 0; i < a.length; i++)
				{
					rows.push([i,a[i]["nb_death"],t.concat(champion_img_link[i],tt,"<p style='font-size: 20px;'>", a[i]["nb_kill"]," / ", a[i]["nb_death"]," / ", a[i]["nb_assist"],"<br>",a[i]["nb_death"],"</p></div>")]);
				}
				dataTable.addRows(rows);

				var options = {
					title: 'Evolution of death',
					fontSize: 25,
					titlePosition: 'in',
					titleTextStyle: {
						color: 'white',
						fontSize: 20,
					},
					backgroundColor: '#191919',
					chartArea: {
						backgroundColor: '#191919',
						width: '90%',
						height: '90%'
					},
					vAxis: {
						textStyle: {color: 'white'},
						minorGridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						},
						minValue:0,
					},
					hAxis: {
						textStyle: {color: 'white'},
						baselineColor: {color: 'none'},
						gridlines: {count: 0},
						textStyle: {
							fontSize: 12,
							color: 'white',
						}
					},
					legend: {position: 'none'},
					trendlines: {
						0: {color: 'red',
							tooltip: false,
							pointsVisible: false,
							visibleInLegend: false,
							pointSize: 1,}
					},
					tooltip: {
						isHtml: true,
						ignoreBounds: true,
						showColorCode: true,
					},
					pointSize: 10,
				};

				var chart = new google.visualization.AreaChart(document.getElementById('chart_death'));
				chart.draw(dataTable, options);
			}
		</script>

		<div class="chart_list">
			<div class="chart" id="chart_kp"></div>
			<div class="chart" id="chart_cs"></div>
			<div class="chart" id="chart_vs"></div>
			<div class="chart" id="chart_death"></div>
		</div>

	</div>


	


	<div class="bandeau_bottom">
		<p class="disclaimer">Level.Up isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
	</div>
</body>

</html>
