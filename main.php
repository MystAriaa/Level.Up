<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="main_style.css" />
    <link rel="shortcut icon" href="assets/favicon.ico">

    <!--Load the AJAX API Google chart-->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</head>

<body class="page">
    <div class="bandeau_top" id="bandeau_top">
    	<a href="main.php">
        	<img src='assets/Title-web2.png' class="mini_logo" href="main.php" >
    	</a>
        <input type="text" id="Summoner_Name" value="" placeholder="Account name" class="input_name">
        <SELECT id="Region" size="1" class="input_region">
            <OPTION>EUW
            <OPTION>NA
            <OPTION>KR
            <OPTION>EUN
            <OPTION>BR
            <OPTION>JP1     
            <OPTION>LA1
            <OPTION>LA2
            <OPTION>OC
            <OPTION>RU
            <OPTION>TR
        </SELECT>

        <SELECT id="NbGame" size="1" class="input_nbgame">
            <OPTION>5  
            <OPTION>10
            <OPTION>15
            <OPTION>Max Request
        </SELECT>

        <button id="Main_Button" class="GetStats">Get stats</button>
        
        </br>

        <SELECT id="Role" size="1" class="input_role">
            <OPTION>Ø Role
            <OPTION>Top
            <OPTION>Jungle
            <OPTION>Mid
            <OPTION>ADC
            <OPTION>Support 
        </SELECT>
        <SELECT id="Champion" size="1" class="input_champion">
    	    <OPTION>Ø Champion
        </SELECT>
        <div  class="input_ranked">
        	<input type="checkbox" id="OnlyRankedBox" class="checkbox">
       		<label>Ranked Games</label>
        </div>

        <div id="rank_role_icon_box" class="rank_role_icon_box">
    	</div>

        <div>
            <p id="Summoner_Id" class="Summoner_Id"></p>
            <p id="Account_Id" class="Account_Id"></p>
            <a id ="download_csv" class="download_csv">Export data as CSV</a>
            <a id ="download_json" class="download_json">Export match data as JSON</a>
            <button id="Select_Game_Button" class="Select_Game_Button">Show Graph</button>
        </div>

        <div class="Error_Menu">
            <div class="error_box" id="error_box">
            </div>
        </div>
    </div>

    <div id="Summoner_icon" class="Summoner_icon">
    </div>

    <div class="Summoner_Info">
        <p id="Account_Name" class="Account_name"></p>
        <!--<div id="Rank_icon" class="Rank_icon">-->
        </div>
    </div>

    </br></br>
    <div id="donutchart" class="donutchart"></div>
    <p id ="winrate_value" class="winrate_value"></p>
    <div id="barchart1" class="barchart1"></div>
    <p id ="CS_value" class="CS_value"></p>
    <div id="barchart2" class="barchart2"></div>
    <p id ="VS_value" class="VS_value"></p>
    <p id ="KDA_value" class="KDA_value"></p>

    <div class="middle2" id="accueil">
        <img src='assets/Title-web2.png' class="logo2">
       
            <div class="bar_form2">
                <input type="text" name="Summoner_Name" id="Summoner_Name_Bis" required class="input_name2" placeholder="Summoner Name">
                <SELECT name="Region" id="Region_Bis" size="1" class="input_region2">
                    <OPTION>EUW
                    <OPTION>NA
                    <OPTION>KR
                    <OPTION>EUN
                    <OPTION>BR
                    <OPTION>JP1     
                    <OPTION>LA1
                    <OPTION>LA2
                    <OPTION>OC
                    <OPTION>RU
                    <OPTION>TR
                </SELECT>
                <SELECT name="NbGame" id="NbGame_Bis" size="1" class="input_nbgame2">
                    <OPTION>5  
                    <OPTION>10
                    <OPTION>15
                    <!--<OPTION>Max Request-->
                </SELECT>
                <button id="Button_Bis" class="input_button2">Get Stats !</button> 
            </div>
            <div class="other_form2">
                <input type="checkbox" name="Only_Ranked" id="Only_Ranked_Bis" class="input_ranked2" value="checked">
                <label for="checkbox" class="label2">Ranked Games</label>
                <SELECT name="Role" id="Role_Bis" size="1" class="input_role2">
                    <OPTION>Ø Role
                    <OPTION>Top
                    <OPTION>Jungle
                    <OPTION>Mid
                    <OPTION>ADC
                    <OPTION>Support     
                </SELECT>
                <SELECT name="Champion" id="Champion_Bis" size="1" class="input_champion2">
                    <OPTION>Ø Champion
                </SELECT>
            </div> 
        
        <p class="accueil_text2">Level.Up is a personal performance analysis tool for League of Legends.<br>Level.Up easily brings you key statistics and their evolutions through your games to improve on different aspects of the game.</p>
    </div>


    </br></br></br></br>

    <div class="second_body">
    	<div id="pre_gamelist" class="pre_gamelist">
	    </div>

	    <div class="chart_list">
		    <div id="chart_slot_1" class="chart_box"></div>
		    <div id="chart_slot_2" class="chart_box"></div>
		    <div id="chart_slot_3" class="chart_box"></div>
		    <div id="chart_slot_4" class="chart_box"></div>
		    <div id="chart_slot_5" class="chart_box"></div>
	    </div>

	    <div id="pre_stats_table" class="pre_stats_table">
	    </div>
    </div>
    

    <div class="bandeau_bottom">
        <p id ="disclaimer" class="disclaimer">Level.Up isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
    </div>

    <script src="js_CallStats.js"></script>

</body>

</html>