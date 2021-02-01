<script>
	// to discourage players from changing their name during the game
	// and causing bugs LMAO
	export let showChangeButton = true;

	import { playerName } from "../../store";

	const changeName = () => {
		$playerName = prompt("Enter your name:") ?? $playerName;
	};
</script>

<header>
	<a href="/"><h1>🎴megauno</h1></a>

	{#if !$playerName}
		<div class="right-side">
			<button on:click={changeName}>Who are you? 🤷</button>
		</div>
	{:else}
		<h2 class="right-side">💁 {$playerName}</h2>
		{#if showChangeButton}
			<button on:click={changeName}>Change</button>
		{/if}
	{/if}
</header>

<style>
	header {
		position: sticky;
		top: 0;
		width: 100%;
		background: aqua;

		display: flex;
		align-items: center;
	}

	header h1 {
		margin: 0;
	}

	header h2 {
		margin: 0;
	}

	header .right-side {
		margin: 0;
		margin-left: auto;
	}
</style>
