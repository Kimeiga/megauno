<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";

  // import { playerName, gamesIAmIn } from "store.js";
  // playerName.useLocalStorage();
  // gamesIAmIn.useLocalStorage();
</script>

<Router {routes} />

<style global>
  /* @import "../assets/global.css"; */
  body {
    margin: 0;
  }
</style>
