<script>
	export let key;
	let gameName;

	import { FirebaseApp, Doc } from "sveltefire";

	import firebase from "firebase/app";
	import GameBoard from "./GameBoard.svelte";
</script>

<main>
	<!-- 1. 🔥 Firebase App -->
	<FirebaseApp {firebase}>
		<Doc
			path={`games/${key}`}
			let:data={game}
			bind:data={gameName}
			let:ref={gameRef}
		>
			<GameBoard {game} {gameRef} {key} />
		</Doc>
	</FirebaseApp>
</main>

<!-- Styles -->
<!--<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1,
	em {
		color: #ff3e00;
	}

	hr {
		height: 1px;
		border: none;
		background: rgb(195, 195, 195);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>-->
