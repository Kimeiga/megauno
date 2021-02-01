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
	import { autojoin, playerName } from "../store.js";
	import Header from "./_components/Header.svelte";
</script>

<main>
	<!-- 1. 🔥 Firebase App -->
	<FirebaseApp {firebase}>
		<Header />

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
					Game created at
					<em>{new Date(game.createdAt).toLocaleString()}</em>
				</p>

				<button
					on:click={() => {
						$goto(`/game/${game.id}`);
					}}>Go to Game</button
				>
			{/each}
			<span slot="loading">Loading games...</span>
			<hr />
			<button
				on:click={() => {
					gamesRef
						.add({
							title: "Game Title",
							createdAt: Date.now(),
							started: false,
						})
						.then((docRef) => {
							$autojoin = true;
							$goto(`/game/${docRef.id}`); // don't use "autojoin" in url because it can do weird things on reload
						});
				}}
			>
				Create Game
			</button>
		</Collection>
	</FirebaseApp>
</main>
