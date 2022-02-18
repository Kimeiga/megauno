<script>
  // to discourage players from changing their name during the game
  // and causing bugs LMAO
  export let showChangeButton = true;

  import { username } from "../../store";

  const changeName = () => {
    $username = prompt("Enter your name:") ?? $username;
  };
</script>

<header>
  <a href="/"><h1>aioaio</h1></a>

  {#if !$username}
    <div class="right-side">
      <button on:click={changeName}>Who are you? 🤷</button>
    </div>
  {:else}
    <h2 class="right-side">💁 {$username}</h2>
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
