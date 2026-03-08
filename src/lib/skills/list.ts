import { stringlang } from "../lang";

export class Skill {
    name: string;
    score: number;
    external_links: string[];
    tasks: stringlang[];

    constructor(name: string, score: number, external_links: string[] = [], tasks: stringlang[] = []) {
        this.name = name;
        this.score = score;
        this.external_links = external_links;
        this.tasks = tasks;
    };
};

let javascript = new Skill("Javascript", 4, ["https://developer.mozilla.org/en/docs/Web/JavaScript"], [new stringlang("Ajouter de la logique dans un site web", "Add logic into a website"), new stringlang("Manipulation du DOM", "DOM manipulation"), new stringlang("Programmation asynchrone", "Asynchronous programming"), new stringlang("Optimisation des performances côté client", "Client-side performance optimization"), new stringlang("Manipulation de JSON", "JSON manipulation"), new stringlang("Fetch API", "API Fetch"), new stringlang("Intégration de typescript", "Typescript integration")]);

let svelte = new Skill("Svelte", 4, ["https://svelte.dev"], [new stringlang("Créer une application web", "Make a webapp"), new stringlang("Création de composants réutilisables", "Creating reusable components"), new stringlang("Réactivité déclarative", "Reporting responsiveness"), new stringlang("", "Stores (writable, readable, derived)"), new stringlang("SvelteKit (routage, SSR)", "SvelteKit (routing, SSR)")]);

let react = new Skill("React", 3, ["https://react.dev"], [new stringlang("Créer une application web", "Make a webapp"), new stringlang("Création de composants réutilisables", "Creating reusable components")]);

let angular = new Skill("Angular", 3, ["https://angular.dev"], [new stringlang("Créer une application web", "Make a webapp"), new stringlang("Création de composants réutilisables", "Creating reusable components")]);

let python = new Skill("Python", 4, ["https://www.python.org"], [new stringlang("Scripts / automatisation", "Scripting / automatisation"), new stringlang("Manipulation de fichiers et données", "File and data handling"), new stringlang("POO (Programmation Orientée Objet)", "OOP (Object-Oriented Programming)"), new stringlang("Gestion d'environnement (venv, pip)", "Environment management (venv, pip)"), new stringlang("Analyse de données (Pandas, NumPy)", "Data analysis (Pandas, NumPy)"), new stringlang("Tests (pytest)", "Tests (pytest)")]);

let rust = new Skill("Rust", 2, ["https://rust-lang.org"], [new stringlang("Cargo (gestion de dépendances)", "Cargo (dependency management)")]);

let c = new Skill("C++", 2, ["https://isocpp.org"], [new stringlang("Programmation bas niveau", "Low-level programming"), new stringlang("Gestion mémoire (pointeurs, RAII)", "Memory management (pointers, RAII)")]);

let java = new Skill("Java", 2, ["https://www.java.com"], [new stringlang("Création d'un serveur backend avec Maven", "Creating a backend server with Maven")]);

let node_js = new Skill("Node.js", 2, ["https://nodejs.org"], [new stringlang("Création d'un backend en Javascript (Express)", "Creating a backend in JavaScript (Express)"), new stringlang("Authentification (JWT, OAuth)", "Authentification (JWT, OAuth)"), new stringlang("Création/Gestion de base de donnée avec Json", "Database creation/management with Json")]);

let gama = new Skill("GAMA", 3, ["https://gama-platform.org"], [new stringlang("Modélisation multi-agents (intelligence artificielle)", "Multi-agent modeling (artificial intelligence)"), new stringlang("Modélisation de comportements", "Behavior modeling"), new stringlang("Interaction agents / environnement", "Interaction between agents and the environment"), new stringlang("Langage GAML", "GAML language"), new stringlang("Création et visualisation de simulations", "Simulation creation and visualization")]);

let linux = new Skill("Linux", 2, ["https://www.linux.org"], [new stringlang("Configuration système (gestion des paquets, permissions)", "System configuration (package management, permissions)"), new stringlang("Scripts avec Bash", "Scripting with Bash"), new stringlang("Administration distante (ssh)", "Remote administration (ssh)")]);

let git = new Skill("Git", 3, ["https://git-scm.com/"], [new stringlang("Suivi et versionnement d'un projet (seul ou en équipe)", "Project tracking and versioning (alone or in a team)"), new stringlang("Découpage du projet en branches", "Dividing the project into branches"), new stringlang("Résolution de conflits", "Conflict resolution"), new stringlang("Respect d'une nomenclature professionnelle", "Compliance with professional nomenclature")]);

let qt = new Skill("QT", 1, ["https://wiki.qt.io/About_Qt"], [new stringlang("Intégration C++", "C++ integration")]);

let css = new Skill("CSS", 3, ["https://developer.mozilla.org/en-US/docs/Web/CSS"], [new stringlang("Styliser un site web", "Design a website"), new stringlang("Rendre un site web réactif", "Make a responsive website"), new stringlang("Ajouter des animations", "Add animations")]);

let tauri = new Skill("Tauri", 2, ["https://tauri.app/"], [new stringlang("Création d'applications bureau à partir d'une application web", "Creating desktop applications from a web application"), new stringlang("Intégration Rust + frontend web", "Rust integration + web frontend")]);

let machine_learning = new Skill("Machine learning", 4, ["https://www.ibm.com/think/topics/machine-learning"], [new stringlang("Intégration avec python (NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch)", "Python integration (NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch)"), new stringlang("Normaliser, nettoyer et filtrer les données", "Data cleaning"), new stringlang("Création de modèle IA", "AI model creation"), new stringlang("Mesurer les performances d'un modèle", "Measuring model performance")]);

let docker = new Skill("Docker", 2, ["https://www.docker.com/"], [new stringlang("Créer des images", "Create images"), new stringlang("Lancer des conteneurs", "Launch containers")]);

export let skills: Skill[] = [
    javascript,
    svelte,
    react,
    angular,
    css,
    node_js,
    tauri,
    java,
    rust,
    c,
    qt,
    python,
    machine_learning,
    gama,
    linux,
    git,
    docker,
];