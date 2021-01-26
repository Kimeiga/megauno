<script>
	export let game;
	export let gameRef;
	export let key; // game id
	let title;
	let playerNameLocal;
	let submit = false;
	let players;
	let playersRef;

	import Deck from "./_components/Deck.svelte";
	import DiscardPile from "./_components/DiscardPile.svelte";
	import Hand from "./_components/Hand.svelte";

	import { metatags } from "@roxi/routify";
	metatags.title = `Game ${game.title}`;
	metatags.description = "The game";

	import { Collection } from "sveltefire";

	import { playerName, gamesIAmIn } from "../../store";
	// playerName.useLocalStorage();
	// gamesIAmIn.useLocalStorage();
	import firebase from "firebase/app";

	const db = firebase.firestore();

	$: {
		// debounce(function () {
		// send new title to firestore
		if (title) {
			db.collection("games").doc(key).update({
				title: title,
			});
		}

		// }, 250);
	}

	function onData(e) {
		players = e.detail.data;
	}
	function onRef(e) {
		playersRef = e.detail.ref;
	}

	const debounce = (func, wait) => {
		// Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)

		// Returns a function, that, as long as it continues to be invoked, will not
		// be triggered. The function will be called after it stops being called for
		// `wait` milliseconds.
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

	function endTurn(playersRef) {
		let newPlayerIndex = (game.currentPlayerIndex + 1) % players.length;

		playersRef
			.orderBy("createdAt")
			.get()
			.then((querySnapshot) => {
				// console.log(querySnapshot.docs[0].ref.id);
				let newPlayerID = querySnapshot.docs[newPlayerIndex].ref.id;
				let newPlayerName = querySnapshot.docs[newPlayerIndex].data().name;
				gameRef.update({
					started: true,
					currentPlayerID: newPlayerID,
					currentPlayerName: newPlayerName,
					currentPlayerIndex: newPlayerIndex,
				});
			});
	}

	const suits = ["spades", "diamonds", "clubs", "hearts"];
	const values = [
		"A",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"J",
		"Q",
		"K",
	];

	function getDeck() {
		var deck = new Array();

		for (var i = 0; i < suits.length; i++) {
			for (var x = 0; x < values.length; x++) {
				var card = { value: values[x], suit: suits[i] };
				deck.push(card);
			}
		}

		return deck;
	}

	function shuffle(deck) {
		// for 1000 turns
		// switch the values of two random cards
		for (var i = 0; i < 1000; i++) {
			var location1 = Math.floor(Math.random() * deck.length);
			var location2 = Math.floor(Math.random() * deck.length);
			var tmp = deck[location1];

			deck[location1] = deck[location2];
			deck[location2] = tmp;
		}
	}

	async function startGame(playersRef) {
		playersRef
			.orderBy("createdAt")
			.limit(1)
			.get()
			.then((querySnapshot) => {
				// console.log(querySnapshot.docs[0].ref.id);
				let firstPlayerID = querySnapshot.docs[0].ref.id;
				let firstPlayerName = querySnapshot.docs[0].data().name;
				gameRef.update({
					started: true,
					currentPlayerID: firstPlayerID,
					currentPlayerName: firstPlayerName,
					currentPlayerIndex: 0,
				});
			});

		// give cards to everyone
		let deck = getDeck();
		shuffle(deck);

		// give 7 cards to everyone, assume deck has enough
		players.forEach((player) => {
			let newHand = deck.splice(0, 7);
			playersRef.doc(player.id).update({ hand: newHand });
		});

		// put the rest in the deck
		let discardPile = deck.splice(0, 1);
		gameRef.update({ deck, discardPile });
	}

	function cardClickHandler(card, hand) {
		// only run if its the current player
		if (game.currentPlayerName !== $playerName) {
			return;
		}

		// current player clicked one of the cards in their hand to play it
		// get rid of the card from their hand
		let removedCard;
		for (var i = 0; i < hand.length; i++) {
			if (hand[i].suit === card.suit && hand[i].value === card.value) {
				removedCard = hand[i];
				hand.splice(i, 1);
				break;
			}
		}

		playersRef.doc(game.currentPlayerID).update({ hand: hand });
		// add it on to the top of the discard pile

		let newDiscardPile = [...game.discardPile, removedCard];

		gameRef.update({
			discardPile: newDiscardPile,
		});

		endTurn(playersRef);
	}

	function deckClickHandler() {
		// only run if its the current player
		if (game.currentPlayerName !== $playerName) {
			return;
		}

		let cardToTake = game.deck[game.deck.length - 1];

		// put the top card of the deck into the current player's hand
		gameRef.update({
			deck: game.deck.splice(0, game.deck.length - 1),
		});

		// players.forEach((player) => {
		// 	if (player.name == $playerName){

		// 	}
		// })
		// playersRef.doc(game.currentPlayerID).get
		playersRef
			.doc(game.currentPlayerID)
			.update({ hand: firebase.firestore.FieldValue.arrayUnion(cardToTake) });

		// end turn

		endTurn(playersRef);
	}
</script>

{JSON.stringify(game)}

<h1 contenteditable="true" bind:innerHTML={title}>{game.title}</h1>
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
	on:data={onData}
	on:ref={onRef}
	log
>
	<!-- {Object.entries(players[0])} -->

	<span slot="loading">Loading players...</span>

	{#if !players.length}
		<p>No players yet...</p>
	{/if}

	{#each players as player}
		<p>
			{#if $playerName == player.name}
				{#if player.id == game.currentPlayerID}
					Current Player: You: {player.name}
				{:else}
					You: {player.name}
				{/if}
			{:else if player.id == game.currentPlayerID}
				Current Player: {player.name}
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
		<button on:click={startGame(playersRef)}>Start game!</button>
	{/if}

	<!-- game started area -->

	{#if game.started}
		{#if $playerName == game.currentPlayerName}
			<h3>It's your turn!</h3>
			<button on:click={endTurn(playersRef)}>End Turn</button>
		{/if}
		{game.deck.length}
		<Deck deck={game.deck} {deckClickHandler} />
		<DiscardPile deck={game.discardPile} />

		{#each players as player}
			<Hand
				deck={player.hand}
				playerName={player.name}
				faceUp={player.name == $playerName}
				discardPileTop={game.discardPile[game.discardPile.length - 1]}
				{cardClickHandler}
			/>
		{/each}
	{/if}
</Collection>
