<script lang="ts">
    import { Skill, skills } from "./list";
    import Preview from "./preview.svelte";
    import View from "./view.svelte";

    export let lang: string;

    let view: Skill | undefined;
</script>

<div class="skills">
    <div class="table">
        {#each skills as skill}
            <Preview bind:skill bind:view />
        {/each}
    </div>
</div>

{#if view != undefined}
    <View bind:skill={view} bind:view bind:lang />
{/if}

<style>
    div.skills {
        height: 90vh;
        overflow-y: auto;
        scroll-snap-type: y mandatory;
        margin-top: 1vh;
    }

    div.table {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
    }
</style>
