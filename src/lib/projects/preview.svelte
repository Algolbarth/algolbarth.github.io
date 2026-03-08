<script lang="ts">
    import type { Projet } from "./list";

    export let projet: Projet;
    export let view: Projet | undefined;
    export let lang: string;

    function openView() {
        view = projet;
    }
</script>

<div class="preview">
    <button on:click={openView}>
        <div class="content">
            <div class="infobar">
                <div class="name">
                    {projet.name}
                </div>

                <div class="date">
                    {projet.date}
                </div>
            </div>

            <div class="version">
                v{projet.version}
            </div>

            <hr />

            <div class="description">
                {projet.description.print(lang)}
            </div>
        </div>
    </button>
</div>

<style>
    div.preview {
        scroll-snap-align: start;
        height: 30vh;
    }

    button {
        width: 48vw;
        border: solid;
        margin: 1vh;
        height: 26vh;

        box-shadow: 1vh 1vh rgb(0 0 0 / 0.7);
        transform: translate(0, 0);
        transition: all 0.5s ease-in-out;
    }

    button:hover {
        transform: translate(1vh, 1vh);
        transition: all 0.5s ease-in-out;
        box-shadow: none;
    }

    div.content {
        text-align: left;
        width: 46vw;
        height: 100%;
        padding: 1%;
    }

    div.infobar {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    div.date {
        text-align: right;
    }

    div.description {
        height: 60%;
        overflow-y: hidden;
    }
</style>
