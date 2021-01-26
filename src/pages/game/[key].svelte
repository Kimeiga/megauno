<script>
	import { metatags } from "@roxi/routify";
	metatags.title = "My Routify app";
	metatags.description = "Description coming soon...";

	import { FirebaseApp, User, Doc, Collection } from "sveltefire";

	import firebase from "firebase/app";
	import { playerName, gamesIAmIn } from "../../store";
	playerName.useLocalStorage();
	gamesIAmIn.useLocalStorage();

	const db = firebase.firestore();

	$: {
		console.log(`${title}`);
		// debounce(function () {
		// send new title to firestore
		if (title) {
			db.collection("games")
				.doc(key)
				.update({
					title: title,
				})
				.then(console.log("then"))
				.catch(console.log("no"));
		}
		// }, 250);
	}

	// Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// `wait` milliseconds.
	const debounce = (func, wait) => {
		let timeout;

		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	const handleSubmit = () => {
		submit = true;
		$playerName = playerNameLocal;
	};

	const handleKeyup = () => {
		submit = false;

		if (event.code == "Enter") {
			event.preventDefault();
			handleSubmit();
		}
	};

	export let key;
	let title;
	let playerNameLocal;
	let submit = false;
</script>

<main>
	<!-- 1. 🔥 Firebase App -->
	<FirebaseApp {firebase}>
		<Doc path={`games/${key}`} let:data={game} let:ref={gameRef}>
			<h1 contenteditable="true" bind:innerHTML={title}>{game.title}</h1>
			<p>{Object.entries(game)}</p>
			{#if !submit && !$playerName}
				<h2>Who are you?</h2>
				<form on:submit|preventDefault={handleSubmit}>
					<input
						type="text"
						bind:value={playerNameLocal}
						on:keyup|preventDefault={handleKeyup}
					/>
					<button type="submit"> Submit </button>
				</form>
			{:else}
				<h2>You are {$playerName}</h2>
				<button
					on:click={() => {
						submit = false;
						$playerName = "";
					}}>Change Name</button
				>
			{/if}

			<Collection
				path={gameRef.collection("players")}
				query={(ref) => ref.orderBy("createdAt")}
				let:data={players}
				let:ref={playersRef}
				log
			>
				{#if !players.length}
					<p>No players yet...</p>
				{/if}

				{#each players as player}
					<p>
						{#if $playerName == player.name}
							You: {player.name}
						{:else}
							{player.name}
						{/if}
					</p>
				{/each}

				{#if !$gamesIAmIn.includes(key) && game.started == false}
					<button
						on:click={() => {
							playersRef.add({
								name: $playerName,
								createdAt: Date.now(),
							});
							$gamesIAmIn = [key, ...$gamesIAmIn];
						}}> Join game! </button>
				{:else if players.length > 0 && game.started == false}
					<button
						on:click={() => {
							gameRef.update({ started: true });
						}}>Start game!</button
					>
				{/if}

				<span slot="loading">Loading players...</span>
			</Collection>
		</Doc>
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
