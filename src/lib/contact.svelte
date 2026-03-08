<div class="cv">
    <div>
        <button
            class="social github"
            on:click={() => {
                window.open("https://github.com/Algolbarth");
            }}
        >
            <img class="logo" src="/github.png" alt="github" />
            <br />
            Github
        </button>

        <button
            class="social linkedin"
            on:click={() => {
                window.open("https://www.linkedin.com/in/poirier-paul");
            }}
        >
            <img class="logo" src="/linkedin.png" alt="linkedin" />
            <br />
            LinkedIn
        </button>

        <button
            class="social mail"
            on:click={() => {
                window.location.href = "mailto:paul.poirier@live.fr";
            }}
        >
            <img class="logo" src="/mail.png" alt="mail" />
            <br />
            paul.poirier@live.fr
        </button>

        <button
            class="social phone"
            on:click={() => {
                window.location.href = "tel:+330783900537";
            }}
        >
            <img class="logo" src="/phone.png" alt="phone" />
            <br />
            +33 7 83 90 05 37
        </button>

        <button
            class="social location"
            on:click={() => {
                window.open("https://www.google.com/maps/place/Nantes");
            }}
        >
            <img class="logo" src="/location.png" alt="location" />
            <br />
            France, Nantes
        </button>
    </div>

    <div>
        <object data="/cv.pdf#toolbar=0" type="application/pdf" title="cv" id="cv"></object>
    </div>
</div>

<style>
    div.cv {
        width: 100%;
        display: grid;
        grid-template-columns: 6fr 4fr;
    }

    button.social {
        position: fixed;
        width: 25vmin;
        height: 25vmin;
        border-radius: 50%;
        transition: 0.3s ease-in-out;
    }

    button.social:hover {
        transform: scale(1.2);
        transition: 0.1s ease-in-out;
    }

    button.github {
        background: black;
        top: 15vh;
        left: 5vw;
    }

    button.linkedin {
        background: #0a66c2;
        top: 15vh;
        left: 30vw;
    }

    button.location {
        background: #ed4040;
        top: 40vh;
        left: 17.5vw;
    }

    button.phone {
        background: #00a1f0;
        top: 65vh;
        left: 5vw;
    }

    button.mail {
        background: #52b1e5;
        top: 65vh;
        left: 30vw;
    }

    img.logo {
        height: 3em;
    }

    object#cv {
        width: 500px;
        max-width: 50vw;
        height: 725px;
        max-height: 83vh;
        border: solid white;
        border-width: 0.5vh;
        margin: 3vh;
    }
</style>
