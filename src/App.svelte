<script>
  import Router from "svelte-spa-router";
  import Dashboard from "./pages/Dashboard.svelte";

  const routes = {
    "/": Dashboard
  };
</script>

<Router {routes} />
