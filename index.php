<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="static/css/levelup_index_style.css" />
	<link rel="shortcut icon" href="static/assets/favicon.ico">
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</head>

<body class="body">
	<div class="middle">
		<img src='static/assets/Title-web2.png' class="logo">
		<form method="GET" action="/levelup/dashboard.php" class="bar_form">
			<input type="text" name="Summoner_Name" required class="input_name" placeholder="Summoner Name">
			<SELECT name="Region" size="1" class="input_region">
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
			
			<button class="input_button">Get Stats !</button>
		</form>
		
		<p class="accueil_text">Level.Up is a personal performance analysis tool for League of Legends.<br>Level.Up easily brings you key statistics and their evolutions through your games to improve on different aspects of the game.</p>
	</div>
	
	<div class="bandeau_bottom">
		<p class="disclaimer">Level.Up isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
	</div>
</body>

</html>
