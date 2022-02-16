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

	function getPowerSymbol(value) {
		if (value == "2") {
			return "2️⃣";
		}
		if (value == "4") {
			return "4️⃣";
		}
		if (value == "6") {
			return "🔄";
		}
		if (value == "8") {
			return "🏳️‍🌈";
		}
		if (value == "10") {
			return "🚫";
		}
		if (value == "Q") {
			return "🔂";
		}
		if (value == "A") {
			return "⏭";
		} else return "";
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
		(discardPileTop.value == card.value ||
			discardPileTop.suit == card.suit)}
	class:red={card.suit == "diamonds" || card.suit == "hearts"}
	class="card"
	on:mouseenter={enter}
	on:mouseleave={leave}
	on:click={hovering &&
		faceUp &&
		(discardPileTop.value == card.value ||
			discardPileTop.suit == card.suit) &&
		cardClickHandler(card, hand)}
>
	{#if faceUp}
		<span class="card-value">{card.value}{getSuitSymbol(card.suit)}</span>
		{#if getPowerSymbol(card.value)}
			<span class="power-symbol">{getPowerSymbol(card.value)}</span>
		{/if}
	{/if}
</div>

<style>
	.card {
		width: 3rem;
		height: 4rem;
		border: 1px solid black;
		border-radius: 8px;
		background-color: rgb(255, 100, 100);
		margin-left: -1rem;
		padding: 0.1rem;
		display: flex;
		justify-content: center;
		position: relative;
	}

	.card-value {
		position: absolute;
		top: 0.2rem;
		left: 0.2rem;
	}

	.power-symbol {
		justify-self: center;
		align-self: center;
		position: relative;
		top: 0.5rem;
		font-size: 1.5rem;
	}

	.faceup-card {
		background-color: #fff;
		text-align: left;
	}

	.selected-card {
		transform: translate(0px, -10px);
		cursor: pointer;
	}

	.red {
		color: red;
	}
</style>
