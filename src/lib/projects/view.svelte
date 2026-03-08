<script lang="ts">
    import { stringlang } from "../lang";
    import type { Projet } from "./list";

    export let projet: Projet;
    export let view: Projet | undefined;
    export let lang: string;

    function close() {
        view = undefined;
    }

    let github: stringlang = new stringlang("Dépôt Github", "Github Repository");
</script>

<div class="shadow"></div>

<div class="view">
    <div class="infobar">
        <div>
            <span style="font-size: 5vmin;font-weight: bold;">{projet.name}</span>
            v{projet.version}

            <br />

            <button
                class="github"
                on:click={() => {
                    window.open(projet.github);
                }}
            >
                {github.print(lang)}
            </button>
        </div>

        <div style="display: grid;justify-content:right;align-items:center;">
            <button class="close" on:click={close}>X</button>
        </div>
    </div>

    <hr />

    <div class="description">
        {projet.description.print(lang)}
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
    }

    button.github {
        background: black;
        color: white;
        padding: 0.5em;
        border: solid;
        border-color: black;
    }

    button.github:hover {
        border-color: white;
    }

    button.close {
        background: red;
        border: solid;
        width: 5vmin;
        height: 5vmin;
        font-size: 3vmin;
    }

    button.close:hover {
        background: darkred;
    }

    div.description {
        overflow-y: scroll;
    }
</style>
