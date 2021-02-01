<script>
	import HandCard from "./HandCard.svelte";

	export let deck;
	export let playerName;
	export let faceUp;
	export let discardPileTop;

	export let cardClickHandler;
</script>

<h4>{playerName}'s hand</h4>
<div class="deck">
	{#each deck as card (card.value + card.suit + card.deckNumber)}
		<HandCard {card} {faceUp} {discardPileTop} {cardClickHandler} hand={deck} />
		<!-- <Hoverable let:hovering={active}>
			<div class:active>
				{#if active}
					<p>I am being hovered upon.</p>
				{:else}
					<p>Hover over me!</p>
				{/if}
			</div>
		</Hoverable> -->
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

	/* .deck {
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
	} */

	.deck {
		display: flex;
		max-width: 300px;
		padding-left: 30px;
		justify-content: space-evenly;
	}
</style>
