<script>
	export let key;

	import { FirebaseApp, Doc, Collection } from "sveltefire";

	import firebase from "firebase/app";
	import GameBoard from "./GameBoard.svelte";
	import Header from "./../_components/Header.svelte";
</script>

<main>
	<FirebaseApp {firebase}>
		<Header showChangeButton={false} />

		<Doc path={`games/${key}`} let:data={game} let:ref={gameRef} let:error>
			<Collection
				path={gameRef.collection("players")}
				query={(ref) => ref.orderBy("createdAt")}
				let:data={players}
				let:ref={playersRef}
			>
				<GameBoard {game} {gameRef} {players} {playersRef} {key} />
				<span slot="loading">⌛ Loading players...</span>
				<div slot="fallback">
					😔 Player list cannot be read. Error: {error}
				</div>
			</Collection>
			<div slot="loading">⌛ Game loading!</div>
			<div slot="fallback">
				😔 This game cannot be found. Error: {error}
			</div>
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
