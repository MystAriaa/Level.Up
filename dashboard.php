<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="static/css/levelup_dashboard_style.css" />
	<link rel="shortcut icon" href="static/assets/favicon.ico">
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</head>

<body class="body">
	<?php
	if (isset($_GET["Summoner_Name"]) && isset($_GET["Region"]))
	{
		echo($_GET["Summoner_Name"]);
		echo($_GET["Region"]);
	}

	$mysqlConnection = new PDO('mysql:host=localhost;dbname=levelup_database;charset=utf8','root','root');

	?>
	
	<div class="bandeau_bottom">
		<p class="disclaimer">Level.Up isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
	</div>
</body>

</html>