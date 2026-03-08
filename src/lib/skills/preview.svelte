<script lang="ts">
    import type { Skill } from "./list";

    export let skill: Skill;
    export let view: Skill | undefined;

    function openView() {
        view = skill;
    }
</script>

<button on:click={openView}>
    <div class="logo">
        <img src={"/skills/" + skill.name + ".png"} alt={skill.name} />
    </div>

    <div class="score">
        {#each Array(5) as _, index}
            {#if index < skill.score}
                <span style="color:gold">★</span>
            {:else}
                <span style="color:white">★</span>
            {/if}
        {/each}
    </div>

    <div class="name">{skill.name}</div>
</button>

<style>
    button {
        height: 28vh;
        margin: 1vh;
        scroll-snap-align: start;
        display: grid;
        grid-template-rows: 5fr 1fr 1fr;
    }

    img {
        max-height: 20vh;
        filter: drop-shadow(0px 1vh 10px rgba(0, 0, 0, 1));
        transition: all 0.3s ease-in-out;
    }

    img:hover {
        transform: translateY(-1vh);
        transition: all 0.3s ease-in-out;
    }
</style>
