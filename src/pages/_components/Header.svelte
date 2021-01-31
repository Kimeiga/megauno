<script>
	let playerNameLocal;

	let submit = false;
	import { playerName, gamesIAmIn } from "../../store";
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
</script>

<header>
	<h1>megauno</h1>

	{#if !submit && !$playerName}
		<div class="right-side" id="who-are-you">
			<h2>Who are you?</h2>
			<form on:submit|preventDefault={handleSubmit}>
				<input
					type="text"
					bind:value={playerNameLocal}
					on:keyup|preventDefault={handleKeyup}
				/>
				<button type="submit"> Submit </button>
			</form>
		</div>
	{:else}
		<h2 class="right-side">You = {$playerName}</h2>
		<button
			on:click={() => {
				submit = false;
				$playerName = "";
			}}>Change</button
		>
	{/if}
</header>

<style>
	header {
		position: sticky;
		top: 0;
		width: 100%;
		background: aqua;

		display: flex;
		align-items: baseline;
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

	#who-are-you {
		display: flex;
		flex-direction: column;
	}

	#who-are-you * {
		display: block;
	}
</style>
