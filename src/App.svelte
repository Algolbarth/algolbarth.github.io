<script lang="ts">
  import Contact from "./lib/contact.svelte";
  import Menu from "./lib/menu.svelte";
  import Projets from "./lib/projects/page.svelte";
  import Skills from "./lib/skills/page.svelte";
  import Taskbar from "./lib/taskbar.svelte";

  let page: string = "menu";
  let lang: string = "en";
</script>

<div class="page">
  <Taskbar bind:current_page={page} bind:lang />

  {#if page == "menu"}
    <Menu bind:lang bind:page />
  {:else if page == "skills"}
    <Skills bind:lang />
  {:else if page == "projets"}
    <Projets bind:lang />
  {:else if page == "contact"}
    <Contact />
  {/if}
</div>

<style>
  div.page {
    position: fixed;
    top: 0;
    left: 0;

    margin: 0;
    padding: 0;

    width: 100vw;
    min-height: 100vh;

    display: grid;
    grid-template-rows: 1fr 9fr;
  }
</style>
