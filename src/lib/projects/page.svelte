<script lang="ts">
    import { Projet, projets } from "./list";
    import Preview from "./preview.svelte";
    import View from "./view.svelte";

    export let lang: string;

    let view: Projet | undefined;
</script>

<div class="projets">
    <div class="table">
        {#each projets as projet}
            <Preview bind:projet bind:view bind:lang />
        {/each}
    </div>
</div>

{#if view != undefined}
    <View bind:projet={view} bind:view bind:lang />
{/if}

<style>
    div.projets {
        height: 90vh;
        overflow-y: auto;
        scroll-snap-type: y mandatory;
        margin-top: 1vh;
    }

    div.table {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
    }
</style>
