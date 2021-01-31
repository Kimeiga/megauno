<script>
	export let players;
	export let playersRef;
	export let key;
	export let game;

	import { playerName, gamesIAmIn } from "../../store";
</script>

{#if !players.length}
	<p>No players yet...</p>
{/if}

{#if !$gamesIAmIn.includes(key) && game.started == false}
	<button
		on:click={() => {
			playersRef.add({
				name: $playerName,
				createdAt: Date.now(),
			});
			$gamesIAmIn = [key, ...$gamesIAmIn];
		}}
	>
		Join game!
	</button>

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
{:else if players.length > 0 && game.started == false}
	<button on:click={startGame(playersRef)}>Start game!</button>
{/if}
