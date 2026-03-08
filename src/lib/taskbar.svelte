<script lang="ts">
    import { stringlang } from "./lang";

    export let current_page: string;
    export let lang: string;

    class Page {
        name: stringlang;
        url: string;

        constructor(name: stringlang, url: string) {
            this.name = name;
            this.url = url;
        }
    }

    let pages: Page[] = [new Page(new stringlang("Menu", "Home"), "menu"), new Page(new stringlang("Compétences", "Skills"), "skills"), new Page(new stringlang("Projets", "Projects"), "projets"), new Page(new stringlang("Contacts", "Contact"), "contact")];
</script>

<div class="taskbar">
    {#each pages as page}
        <div>
            <button
                class="page"
                on:click={() => {
                    current_page = page.url;
                }}
            >
                {page.name.print(lang)}
            </button>
        </div>
    {/each}

    <div class="lang">
        <div class="flag">
            <button
                on:click={() => {
                    lang = "fr";
                }}
            >
                <img class={"flag " + (lang == "fr" ? "selected" : "")} src="/french.png" alt="french" />
            </button>
        </div>

        <div class="flag">
            <button
                on:click={() => {
                    lang = "en";
                }}
            >
                <img class={"flag " + (lang == "en" ? "selected" : "")} src="/english.png" alt="french" />
            </button>
        </div>
    </div>
</div>

<style>
    div.taskbar {
        display: grid;
        grid-template-columns: repeat(4, 3fr) 1fr;
        background: #121212;
    }

    button.page {
        width: 100%;
        height: 100%;
        position: relative;
        border: none;
        letter-spacing: 0;
        transition: 0.5s ease;
    }

    button.page:hover,
    button.page:active {
        letter-spacing: 0.3vw;
        transition: 0.5s ease;
    }

    button.page:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 2px;
        background-color: gold;
        transition: 0.5s ease;
    }

    button.page:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 0;
        height: 2px;
        background-color: gold;
        transition: 0.5s ease;
    }

    button.page:hover:before,
    button.page:hover:after {
        width: 100%;
    }

    div.lang {
        display: grid;
        justify-content: center;
        align-items: center;
    }

    img.flag {
        width: 2vw;
        border: transparent solid;
    }

    img.flag:hover {
        border-color: gold;
    }

    img.selected {
        border-color: white;
    }
</style>
