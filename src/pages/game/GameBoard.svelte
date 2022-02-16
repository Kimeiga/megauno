<script>
	export let game;
	export let gameRef;
	export let players;
	export let playersRef;
	export let key; // game id
	let title;
	let playerID;

	let expression;
	let expressionValue;

	const startingHandSize = 7;

	metatags.title = `Game ${game.title}`;
	metatags.description = "The game";

	import Deck from "./_components/Deck.svelte";
	import DiscardPile from "./_components/DiscardPile.svelte";
	import Hand from "./_components/Hand.svelte";
	import { metatags } from "@roxi/routify";
	import { playerName, gamesIAmIn, autojoin } from "../../store";
	import firebase from "firebase/app";
	import PlayerList from "./_components/PlayerList.svelte";
	import { onDestroy, onMount } from "svelte";
	import Inspect from "svelte-inspect";

	import { evaluate } from "mathjs";

	const db = firebase.firestore();

	$: if (title) {
		db.collection("games").doc(key).update({
			title: title,
		});
	}

	onMount(() => {
		if ($autojoin) {
			// if you aren't already in the game, join immediately
			// (this is for people who are creating the game from scratch)
			joinGame();
			$autojoin = false;
		}

		// if you are in the game
		if ($gamesIAmIn[key]) {
			// get player id again
			players.forEach((player) => {
				if (player.name === $playerName) {
					playerID = player.id;
				}
			});
			playersRef.doc(playerID).update({ disconnected: false });
		}
	});

	onDestroy(() => {
		if (playerID) {
			playersRef.doc(playerID).update({ disconnected: true });
		}
	});

	function validateExpression() {
		// `\d(1,2){+-*/%^}\d(1,2)`
		// `{+-*/%^}\d(1,2)`
		// '1+2+3'
		// '3+3'
		// '6'

		// '4+5/6'
		if (expression) expressionValue = evaluate(expression);
	}

	const joinGame = async () => {
		// if they don't have a name prompt them for a name
		if (!$playerName) {
			let newName = prompt("Enter your name:");
			if (newName) {
				$playerName = newName;
			} else {
				// they just exited out of the dialog or entered nothing
				// just go back as if nothing happened
				return;
			}
		}

		// before we add this player, if there is already a player in the
		// game that is named this (and who is not disconnected)
		// add them with a "1" at the end (increment)
		await players.forEach((player) => {
			if ($playerName == player.name) {
				// name collision
				if (!player.disconnected) {
					debugger;
					// if they are disconnected, you can claim them
					// if they are not, your name needs to be changed
					let tempName = $playerName.slice(0, $playerName.length - 1);
					let lastCharNumber = parseInt(
						$playerName[$playerName.length - 1]
					);
					if (!isNaN(lastCharNumber)) {
						// last character is number
						tempName += lastCharNumber++;
						$playerName = tempName;
					} else {
						// we have to add a 1 to the end
						$playerName += "1";
					}
				}
			}
		});

		const newPlayer = await playersRef.add({
			name: $playerName,
			createdAt: Date.now(),
			disconnected: false,
			hand: [],
		});

		playerID = newPlayer.id;
		// const docSnap = await playersRef.get()

		// playersRef
		// 	.add({
		// 		name: $playerName,
		// 		createdAt: Date.now(),
		// 		disconnected: false,
		// 	})
		// 	.then(function (docRef) {
		// 		playerID = docRef.id;
		// 		console.log(playerID);
		// 	})
		// 	.catch((e) => console.error(e));
		$gamesIAmIn[key] = $playerName;

		if (game.started) {
			// you are joining a game in progress and need to be dealt in!!
			// give startingHandSize cards to you
			let deck = game.deck;

			if (deck.length >= startingHandSize) {
				let newHand = deck.splice(0, startingHandSize);
				playersRef.doc(playerID).update({ hand: newHand });
				gameRef.update({ deck });
			} else if (deck.length > 0) {
				// give the deck to me, reshuffle the discard pile into the deck, and deal me the remaining cards
				let newHand = deck;
				deck = [];
				debugger;
				console.log(game.discardPile);

				reshuffleDiscardPileIntoDeck(deck);

				if (deck.length >= startingHandSize - newHand.length) {
					newHand += deck.splice(
						0,
						startingHandSize - newHand.length
					);
					playersRef.doc(playerID).update({ hand: newHand });
					gameRef.update({ deck });
				} else {
					// oh no we have to introduce new cards (by addings cards from another deck haha)\
					let numberOfDecks = game.numberOfDecks;
					// keep adding decks if its not enough
					while (
						deck.length <
						(players.length + 1) * startingHandSize + 1
					) {
						deck = addADeck(deck, numberOfDecks);
						numberOfDecks++;
					}
					// gameRef.update({ numberOfDecks: numberOfDecks, deck });
					console.log(playerID);

					newHand.push(
						...deck.splice(0, startingHandSize - newHand.length)
					);
					playersRef.doc(playerID).update({ hand: newHand });
					gameRef.update({ deck, numberOfDecks: numberOfDecks });
				}
			}
		}
	};

	// when the deck runs out of cards, take all the discard pile except the top card and reshuffle it into the deck
	const reshuffleDiscardPileIntoDeck = (deck) => {
		// let deck = game.deck;
		let discardPile = game.discardPile;
		let topOfDiscardPile = discardPile.pop();

		if (!discardPile.length) {
			// if the discard pile was just one card, we have to return, there's nothing we can do
			return;
		}

		shuffle(discardPile);
		deck = discardPile;

		gameRef.update({ deck, discardPile: topOfDiscardPile });
	};

	function addADeck(deck, currentDeckNumber) {
		let newDeck = getDeck(currentDeckNumber + 1);
		shuffle(newDeck);
		deck = deck.concat(newDeck);
		return deck;
	}

	function endTurn() {
		let newPlayerIndex = (game.currentPlayerIndex + 1) % players.length;

		playersRef
			.orderBy("createdAt")
			.get()
			.then((querySnapshot) => {
				// console.log(querySnapshot.docs[0].ref.id);
				let newPlayerID = querySnapshot.docs[newPlayerIndex].ref.id;
				let newPlayerName =
					querySnapshot.docs[newPlayerIndex].data().name;
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
	// const suits = ["spades"];
	// const values = ["A", "2"];

	function getDeck(deckNumber) {
		var deck = new Array();

		for (var i = 0; i < suits.length; i++) {
			for (var x = 0; x < values.length; x++) {
				var card = { value: values[x], suit: suits[i], deckNumber };
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

	async function startGame() {
		debugger;
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
		let deck = getDeck(1);
		shuffle(deck);

		let numberOfDecks = 1;

		// // keep adding decks if its not enough
		// while (deck.length < (players.length + 1) * startingHandSize + 1) {
		// 	deck = addADeck(deck, numberOfDecks);
		// 	numberOfDecks++;
		// }

		// give startingHandSize cards to everyone, assume deck has enough
		players.forEach((player) => {
			let newHand = deck.splice(0, startingHandSize);
			playersRef.doc(player.id).update({ hand: newHand });
		});

		// put the rest in the deck
		let discardPile = deck.splice(0, 1);
		gameRef.update({ deck, discardPile, numberOfDecks });
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
		playersRef.doc(game.currentPlayerID).update({
			hand: firebase.firestore.FieldValue.arrayUnion(cardToTake),
		});

		// end turn

		endTurn(playersRef);
	}
</script>

<h1 contenteditable="true" bind:textContent={title}>{game.title}</h1>

<PlayerList
	{players}
	{playersRef}
	{key}
	{game}
	{joinGame}
	on:startGame={startGame}
/>

<!-- game started area -->

{#if game.started}
	{#if $playerName == game.currentPlayerName && $gamesIAmIn[key]}
		<h3>It's your turn!</h3>
		<button on:click={endTurn(playersRef)}>End Turn</button>
	{/if}
	<Deck deck={game.deck} {deckClickHandler} />
	Deck size: {game.deck.length}
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

	<input type="text" bind:value={expression} on:keyup={validateExpression} />

	<button on:click={validateExpression}>Evaluate expression</button>

	<p>{expressionValue}</p>
{/if}
<hr />
<Inspect {title} {game} {players} {key} {playerID} />
