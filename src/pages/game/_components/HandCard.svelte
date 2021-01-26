<script>
	export let faceUp;
	export let card;
	export let discardPileTop;
	export let hand;

	export let cardClickHandler = () => {};

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

	let hovering;

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	// when the handler is triggered in on:click
	// can subscribe to the on:close message in our App.svelte
	// and do what's needed
	const clickHandler = () => dispatch("click");
</script>

<div
	class:faceup-card={faceUp}
	class:selected-card={hovering &&
		faceUp &&
		(discardPileTop.value == card.value || discardPileTop.suit == card.suit)}
	class:red={card.suit == "diamonds" || card.suit == "hearts"}
	class="card"
	on:mouseenter={enter}
	on:mouseleave={leave}
	on:click={hovering &&
		faceUp &&
		(discardPileTop.value == card.value || discardPileTop.suit == card.suit) &&
		cardClickHandler(card, hand)}
>
	{#if faceUp}
		{card.value}{getSuitSymbol(card.suit)}
	{/if}
</div>

<style>
	.card {
		width: 50px;
		height: 90px;
		border: 1px solid black;
		border-radius: 8px;
		background-color: rgb(255, 100, 100);
		margin-left: -30px;
	}

	.faceup-card {
		background-color: #fff;
		text-align: left;
	}

	.selected-card {
		transform: translate(0px, -10px);
	}

	.red {
		color: red;
	}
</style>
