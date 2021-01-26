<script>
	export let deck;

	export let deckClickHandler = () => {};
</script>

<h4>deck</h4>

<div class="deck" on:click={deckClickHandler}>
	{#each deck as card (card.value + card.suit)}
		<div class="facedown-card" />
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

	.facedown-card {
		width: 50px;
		height: 90px;
		border: 1px solid black;
		border-radius: 8px;
		background-color: rgb(255, 100, 100);
		margin-bottom: -60px;
	}
</style>
