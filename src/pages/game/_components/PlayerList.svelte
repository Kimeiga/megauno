<script>
	export let players;
	export let key;
	export let game;
	export let joinGame;

	import { playerName, gamesIAmIn } from "../../../store";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
</script>

{#if !players.length}
	<p>No players yet...</p>
{:else}
	<h3>Players:</h3>
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
{/if}

{#if !$gamesIAmIn.includes(key) && game.started == false}
	<button on:click={joinGame}>Join game!</button>
{:else if players.length > 0 && game.started == false}
	<button
		on:click={() => {
			dispatch("startGame");
		}}>Start game!</button
	>
{/if}
