import { stringlang } from "../lang";

export class Projet {
    name: string;
    version: string;
    date: string;
    github: string;
    description: stringlang;

    constructor(name: string, version: string, date: string, github: string, description: stringlang) {
        this.name = name;
        this.version = version;
        this.date = date;
        this.github = github;
        this.description = description;
    };
};

let moh = new Projet(
    "Memories of Horizon",
    "0.0.3",
    "2020 - 2026",
    "https://github.com/Algolbarth/memories-of-horizon",
    new stringlang(
        "Memories of Horizon est un jeu de cartes roguelike inspiré de Magic: the Gathering et Heartstone battleground. Créez vos decks avec plus de 500 cartes et essayez de survivre à 100 situations différentes. Vous pouvez également utiliser des decks préconstruits si vous préférez. Chaque deck a son propre plan de jeu : augmenter vos statistiques ou diminuer celles de votre adversaire, boire des potions ou manger de la nourriture, équiper des armes ou des armures, invoquer des créatures ou utiliser des actions, utiliser du mana avec des mages ou construire des bâtiments, etc. Avec 12 éléments, vous pouvez combiner toutes les cartes pour créer des synergies ultimes",
        "Memories of Horizon is a roguelike card game inspired by Magic: the Gathering and Heartstone battleground. Create your decks with 500+ cards and try to survive to 100 various situations. You can also use pre-built decks if you prefer. Each deck have his own gameplan : increase your stats or decrease your opponent's one, drink potions or eat food, equip weapons or armors, call creatures or use actions, use mana with mages or construct buildings, etc. With 12 elements, you can combine all the cards to create ultimate synergies."));

let keylogger = new Projet(
    "Keylogger",
    "1.0.0",
    "2023",
    "https://github.com/Algolbarth/keylogger",
    new stringlang(
        "Interface web pour visualiser ses inputs de touche. Un script python permet de récupérer toutes les informations envoyées par votre clavier, qui sont stockées dans un fichier log. Ce fichier peut être ensuite lu via le keylogger pour connaitre vos stats et informations.",
        "Web interface for viewing your keystrokes. A Python script retrieves all the information sent by your keyboard, which is stored in a log file. This file can then be read via the keylogger to view your statistics and information."));

let navigator = new Projet(
    "Navigator",
    "2.0.0",
    "2021 - 2023",
    "https://github.com/Algolbarth/navigator",
    new stringlang(
        "Gestionnaire de favori basé sur la gestion de fichier de linux. Permets de sauvegarder un fichier contenant vos favoris, classer ces derniers dans des dossiers.",
        "Bookmark manager based on Linux file management. Allows you to save a file containing your bookmarks and organize them into folders."));

let plateform = new Projet(
    "Plateform",
    "1.2.0",
    "2023-2024",
    "https://github.com/Algolbarth/plateform",
    new stringlang(
        "Petit jeu de plateforme réalisé en javascript. Reprend le premier niveau de New Super Mario Bros. sur Nintendo DS et un niveau original.",
        "A small platform game created in JavaScript. It includes the first level of New Super Mario Bros. on Nintendo DS and an original level."));

let encryption = new Projet(
    "Encryption",
    "1.0.0",
    "2022",
    "https://github.com/Algolbarth/encryption",
    new stringlang(
        "Interface web de cryptage/décryptage César et Vigenère.",
        "Web interface for Caesar and Vigenère encryption/decryption."));

let future_quest = new Projet(
    "Future-Quest",
    "1.0.0",
    "2023",
    "https://github.com/Algolbarth/future-quest",
    new stringlang(
        "Jeu rogue-like minimaliste où l'on gère un vaisseau et son équipage. Progressez en ajoutant des modules à votre vaisseau, recrutant des nouveaux membres, affrontant des pirates.",
        "A minimalist rogue-like game where you manage a ship and its crew. Progress by adding modules to your ship, recruiting new members, and fighting pirates."));

let arbiter = new Projet(
    "Arbiter",
    "0.0.1",
    "2025",
    "https://github.com/Algolbarth/arbiter",
    new stringlang(
        "Un projet JavaScript expérimental visant à recréer les mécaniques classiques d'un JRPG (Japanese Role-Playing Game) en utilisant l'API Canvas du navigateur. L'objectif est d'explorer la création d'un moteur de jeu simple directement en JavaScript, sans framework externe.",
        "An experimental JavaScript project aimed at recreating the classic mechanics of a JRPG (Japanese Role-Playing Game) using the browser's Canvas API. The goal is to explore the creation of a simple game engine directly in JavaScript, without any external frameworks."));

let camera = new Projet(
    "AI Camera Detection",
    "0.1.0",
    "2026",
    "https://github.com/Algolbarth/ai-camera-detection",
    new stringlang(
        "Utilise une caméra et l'intelligence artificielle YOLO (modèle yolov8s) pour détecter des objets. Prend en charge l'accélération CUDA pour améliorer les performances de l'IA. Enregistre une vidéo avec les objets détectés.",
        "Uses a camera and YOLO artificial intelligence (yolov8s model) to detect object patterns. Supports CUDA acceleration to improve AI performance. Save a video with detection patterns."));

let graph = new Projet(
    "NP-Complete Solving",
    "1.0.0",
    "2022-2023",
    "https://github.com/Algolbarth/projet-graph",
    new stringlang(
        "Ce projet a été développé dans le cadre d'un travail scolaire axé sur les problèmes NP-complets et les algorithmes de théorie des graphes. L'objectif était d'étudier différentes stratégies algorithmiques pour résoudre un problème d'optimisation complexe et de comparer leur comportement en termes de qualité de la solution et de temps d'exécution. Le projet met en œuvre quatre algorithmes basés sur les concepts de la théorie des graphes, chacun utilisant une stratégie différente pour résoudre le même problème NP-complet.",
        "This project was developed as part of a school assignment focused on NP-complete problems and graph theory algorithms. The objective was to study different algorithmic strategies to solve a complex optimization problem and compare their behavior in terms of solution quality and execution time. The project implements four algorithms based on graph theory concepts, each using a different strategy to solve the same NP-complete problem."));

export let projets: Projet[] = [
    moh,
    camera,
    arbiter,
    plateform,
    keylogger,
    future_quest,
    graph,
    encryption,
    navigator,
];