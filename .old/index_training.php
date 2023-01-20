<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="" />
	<link rel="shortcut icon" href="assets/favicon.ico">
	<title>Level.Up</title>
</head>

<body>

	<?php include('header.php'); ?>

	<?php 
		echo "Hello php";


		$isAllowedToEnter = "Oui";

		// SI on a l'autorisation d'entrer
		if ($isAllowedToEnter == "Oui") {
			// instructions à exécuter quand on est autorisé à entrer
		} // SINON SI on n'a pas l'autorisation d'entrer
		elseif ($isAllowedToEnter == "Non") {
			// instructions à exécuter quand on n'est pas autorisé à entrer
		} // SINON (la variable ne contient ni Oui ni Non, on ne peut pas agir)
		else {
			echo "Euh, je ne comprends pas ton choix, tu peux me le rappeler s'il te plaît ?";
		}

		$recipe = [
			'title' => 'Escalope milanaise',
			'recipe' => '',
			'author' => 'mathieu.nebra@exemple.com',
			'is_enabled' => true,
		];

		function isValidRecipe(array $recipe) : bool
		{
			if (array_key_exists('is_enabled', $recipe)) {
				$isEnabled = $recipe['is_enabled'];
			} else {
				$isEnabled = false;
			}

			return $isEnabled;
		}

		isset($p);
	?>

	<form action="submit_contact.php" method="GET">
		<div>
			<label for="email">Email</label>
			<input type="email" name="email">
		</div>
		<div>
			<label for="message">Votre message</label>
			<textarea placeholder="Exprimez vous" name="message"></textarea>
		</div>
		<button type="submit">Envoyer</button>
	</form>

</body>

</html>