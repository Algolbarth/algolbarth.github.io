<script lang="ts">
    import { stringlang } from "./lang";

    export let lang: string;
    export let page: string;

    let hi = new stringlang("Bienvenue sur le site de ", "Welcome on ");
    let website = new stringlang("", "website");
    let it_engineer = new stringlang("Ingénieur informatique", "IT Engineer");
    let fullstack = new stringlang("Dévelopeur fullstack", "Fullstack developer");
    let software = new stringlang("Concepteur de logiciel", "Software designer");
    let hobby = new stringlang("Artiste/Créateur de jeux amateur", "Hobbyst Artist/Game maker");
    let mtg = new stringlang("Membre actif de Magic: the Gathering", "Magic: the Gathering Community Member");
    let location = new stringlang("Je cherche actuellement un emploi sur Nantes.", "I am currently looking for a job in France.");
    let mindset = new stringlang("Je suis passionné par les nouvelles technologies et les possibilités de la programmation.", "I am fascinated by the infinite possibilities of programmation and new technologies.");
    let time = new stringlang("Je passe mon temps à apprendre de nouvelles compétences pour créer.", "I spend my time to learn new skills for create things.");
    let projets = new stringlang("Pour consulter mon travail, c'est ici.", "See my projects here.");
</script>

<div class="menu">
    <div class="part title">
        <img class="banner" src="/logo.jpg" alt="logo" />
    </div>

    <div class="part presentation">
        <img src="/karn.jpg" alt="logo" />

        <div class="texte">
            {hi.print(lang)} <span style="color:red">Paul Poirier</span>
            {website.print(lang)}

            <br />
            <br />

            {it_engineer.print(lang)}
            <br />
            {fullstack.print(lang)}
            <br />
            {software.print(lang)}
            <br />
            {hobby.print(lang)}
            <br />
            {mtg.print(lang)}

            <br />
            <br />

            <button
                on:click={() => {
                    page = "contact";
                }}
            >
                {location.print(lang)}
            </button>
            <br />
            {mindset.print(lang)}

            <br />
            <br />

            {time.print(lang)}
            <br />
            <button
                on:click={() => {
                    page = "projets";
                }}
            >
                {projets.print(lang)}
            </button>
        </div>
    </div>
</div>

<style>
    div.menu {
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        height: 90vh;
    }

    div.part {
        height: 100%;
        scroll-snap-align: start;
    }

    img.banner {
        width: 100%;
        height: 100%;
    }

    div.presentation {
        position: relative;
        width: 100%;
    }

    div.texte {
        position: absolute;
        top: 50%;
        left: 10%;
        transform: translate(-10%, -50%);
        color: white;
        font-size: 3vmin;
        font-weight: bold;
        background: rgba(0, 0, 0, 0.75);
        border-radius: 5vmin;
        padding: 3vmin;
        width: 50vw;
        height: 70vh;
    }

    div.presentation img {
        display: block;
        width: 100%;
        max-height: 100%;
    }

    button {
        color: orange;
    }

    button:hover {
        color: darkorange;
    }
</style>
