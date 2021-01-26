<script>
	import { metatags } from "@roxi/routify";
	metatags.title = "My Routify app";
	metatags.description = "Description coming soon...";

	import { FirebaseApp, User, Doc, Collection } from "sveltefire";

	import firebase from "firebase/app";
	import "firebase/firestore";
	import "firebase/auth";
	import "firebase/performance";
	import "firebase/analytics";

	import { goto } from "@roxi/routify";

	// App.svelte
	import { playerName } from "../store.js";
</script>

<main>
	<!-- 1. 🔥 Firebase App -->
	<FirebaseApp {firebase}>
		<h1>megauno</h1>

		{#if $playerName}
			<h2>You are {$playerName}</h2>
		{/if}

		<Collection
			path={"games/"}
			query={(ref) => ref.orderBy("createdAt")}
			let:data={games}
			let:ref={gamesRef}
			log
		>
			{#each games as game}
				<h2>{game.title}</h2>
				Game id: {game.id}

				<p>
					Document created at
					<em>{new Date(game.createdAt).toLocaleString()}</em>
				</p>

				<button
					on:click={() => {
						$goto(`/game/${game.id}`);
					}}>Join Game</button
				>
			{/each}
			<span slot="loading">Loading games...</span>
			<hr />
			<button
				on:click={() => {
					gamesRef
						.add({
							title: "Game",
							createdAt: Date.now(),
							started: false,
						})
						.then((docRef) => {
							$goto(`/game/${docRef.id}`);
						});
				}}> Create Game </button>
		</Collection>
	</FirebaseApp>
</main>

<!-- Styles -->
<style>
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
</style>
