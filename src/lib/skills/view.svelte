<script lang="ts">
    import { stringlang } from "../lang";
    import type { Skill } from "./list";

    export let skill: Skill;
    export let view: Skill | undefined;
    export let lang: string;

    function close() {
        view = undefined;
    }

    let mastery: stringlang = new stringlang("Maîtrise", "Mastery");
    let mastery_list: stringlang[] = [new stringlang("Découverte / Notions de base", "Beginner / Basic awareness"), new stringlang("Connaissances élémentaires", "Basic"), new stringlang("Maîtrise opérationnelle", "Intermediate"), new stringlang("Maîtrise avancée", "Advanced"), new stringlang("Expertise", "Expert")];
</script>

<div class="shadow"></div>

<div class="view">
    <div class="infobar">
        <div>
            <img src={"/skills/" + skill.name + ".png"} alt="logo" />
            <span style="font-size: 5vmin;font-weight: bold;">{skill.name}</span>
        </div>

        <div style="display: grid;justify-content:right;align-items:center;">
            <button class="close" on:click={close}>X</button>
        </div>
    </div>

    <hr />

    <div class="score">
        <u>{mastery.print(lang)} :</u>

        <br />

        {#each Array(5) as _, index}
            {#if index < skill.score}
                <span style="color:gold">★</span>
            {:else}
                <span style="color:white">★</span>
            {/if}
        {/each}

        {mastery_list[skill.score - 1].print(lang)}
    </div>

    <br />

    <div class="score">
        <u>Compétences :</u>

        <br />

        {#each skill.tasks as task}
            <span style="color:green;">+ {task.print(lang)}</span>

            <br />
        {/each}
    </div>

    <br />

    <div class="doc">
        <u>Documentation :</u>

        <br />

        {#each skill.external_links as external_link}
            <button
                class="doc"
                on:click={() => {
                    window.open(external_link);
                }}
            >
                {external_link}
            </button>

            <br />
        {/each}
    </div>
</div>

<style>
    div.shadow {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
    }

    div.view {
        position: fixed;
        top: 10vh;
        left: 10vw;
        width: 76vw;
        height: 76vh;
        background: #202020;
        border: solid;
        padding-top: 2vh;
        padding-bottom: 2vh;
        padding-left: 2vw;
        padding-right: 2vw;
    }

    div.infobar {
        display: grid;
        grid-template-columns: 4fr 1fr;
        align-items: center;
    }

    img {
        height: 5vmin;
        transform: translate(0, 1vmin);
    }

    button.close {
        background: red;
        border: solid;
        width: 5vmin;
        height: 5vmin;
        font-size: 3vmin;
        font-weight: bold;
    }

    button.close:hover {
        background: darkred;
    }

    button.doc {
        color: rgb(104, 255, 255);
    }

    button.doc:hover {
        color: darkturquoise;
    }
</style>
