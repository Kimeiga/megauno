<script>
	export let deck;

	function getSuitSymbol(suit) {
		if (suit == "spades") {
			return "♠";
		} else if (suit == "hearts") {
			return "♥";
		} else if (suit == "clubs") {
			return "♣";
		} else if (suit == "diamonds") {
			return "♦";
		}
	}
</script>

<h4>discardPile</h4>
<div class="deck">
	{#each deck as card (card.value + card.suit + card.deckNumber)}
		<div class="faceup-card">
			{card.value}{getSuitSymbol(card.suit)}
		</div>
	{/each}
</div>

<style>
	/* .deck {
		display: flex;
		max-height: 100px;
		max-width: 50px;
		flex-direction: column;
	}

	.facedown-card {
		height: 90px;
		width: 50px;
		border: 1px solid black;
		border-radius: 3px;
		background-color: rgba(255, 0, 0, 0.4);
		flex: 0 0 90px;
		background: red;
		transition: transform 0.25s;
	} */

	.deck {
		display: flex;
		flex-direction: column-reverse;
		max-height: 20px;
		padding-bottom: 60px;
		justify-content: space-evenly;
	}

	.faceup-card {
		width: 50px;
		height: 90px;
		border: 1px solid black;
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: -60px;
	}
</style>
