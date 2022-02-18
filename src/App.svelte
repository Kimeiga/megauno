<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";

  import { username } from "store.js";
  username.useLocalStorage();
</script>

<Router {routes} />

<style global>
  /* @import "../assets/global.css"; */
  body {
    margin: 0;
  }
</style>
