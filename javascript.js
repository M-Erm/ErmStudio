// 
// Carrega informações no HTML dinamicamente, baseado no URL e no idioma selecionado.
// Usa SPA para navegar sem recarregar a página
//

const getBasePath = () => {
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.io')) {
        const pathname = window.location.pathname;
        const repoName = pathname.split('/').filter(Boolean)[0]; 
        return `/${repoName}`;
    }
    
    return "/Portfolio";
};

const getImagePath = () => {
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.io')) {
        const pathname = window.location.pathname;
        const repoName = pathname.split('/').filter(Boolean)[0];
        return `/${repoName}`;
    }
    
    return "";
};

const BASE_PATH = getBasePath(); // Esperado: Local: "/Portfolio", Remoto: "/NomeDoRepo"
const IMAGE_PATH = getImagePath();
let currentLanguage = "en";

const pages = document.querySelectorAll("main > section");
const main_page = document.getElementById('homepage');

const translations = {

    "en": {
        models: "MODELS",
        projects: "PROJECTS",
        animations: "ANIMATIONS",
        contact: "CONTACT",
        featured_projects: "FEATURED PROJECTS",
        featured_animations: "FEATURED ANIMATIONS",
        newest_animation: "NEWEST ANIMATION",
        whoami: "Who Am I",
        officialsns: "Official SNS",
        disclaimer: "HoloParty Models Disclaimer All rights to the original characters and intellectual property belong to COVER Corp. These models are not officially affiliated with  Hololive Production or COVER Corp. The models are created for use in HoloParty, an independent fan-made game project. This projects are not an official Hololive product.",
        miscellaneous: "Miscellaneous",
        games: "Games",
        gamemodding: "Game Modding",
        college: "College",
        video_animations: "VIDEO ANIMATIONS",
        holoparty_animations: "HOLOPARTY ANIMATIONS",
        model_animations: "MODEL ANIMATIONS",
        about: "ABOUT",
        about_me: "I am a Software Engineer who likes Game Development, 3D Modeling and Animation.\n I like developing projects, understanding how things happen and the different ways to create something.",
        q:"Q: Do you Have A Job Preference?",
        Q2:"Q: Since When do you program?",
        Q3:"Q: What Languages do you speak?",
        A1:"A: Yes. Programming, but I would totally work with 3D!",
        A2:"A: Made my first program using python when I was 15 years old. But it was very simple, ~200 lines",
        A3:"A: Portuguese, English, Japanese and Spanish.",
    },

    "pt-br": {
        models: "MODELOS",
        projects: "PROJETOS",
        animations: "ANIMAÇÕES",
        contact: "CONTATO",
        featured_projects: "PROJETOS EM DESTAQUE",
        featured_animations: "ANIMAÇÕES EM DESTAQUE",
        newest_animation: "ANIMAÇÃO MAIS RECENTE",
        whoami: "Quem sou eu?",
        officialsns: "Redes Oficiais",
        disclaimer: "Aviso Legal sobre modelos Holoparty",
        miscellaneous: "Variados",
        games: "Jogos",
        gamemodding: "Modificação de Jogos",
        college: "Faculdade",
        video_animations: "VIDEOS DE ANIMAÇÕES",
        holoparty_animations: "ANIMAÇÕES HOLOPARTY",
        model_animations: "ANIMAÇÕES DESTE MODELO",
        about: "SOBRE MIM",
        about_me: "Eu sou um Desenvolvedor de Software que gosta de Desenvolvimento de Jogos, Modelagem 3D e Animação.\n Gosto de desenvolver projetos, entender como as coisas acontecem e as diversas formas de se fazer algo.",
        q:"Q: Você tem uma preferência de trabalho?",
        Q2:"Q: Desde quando você programa?",
        Q3:"Q: Quais linguages você fala?",
        A1:"A: Sim. Programação, mas eu totalmente trabalharia com 3D!",
        A2:"A: Fiz meu primeiro programa usando python quando eu tinha 15 anos. Mas era bem simples, ~200 linhas.",
        A3:"Português, Inglês, Japonês e Espanhol.",
    }
};

const projectsData = [
    {
        id: "project-01",
        title: "HoloParty",
        category: "game",
        stats: ["In Development"],
        techs: ["Unity, Blender, C#"],
        images:
        {
            card: `${IMAGE_PATH}/images/projects/holoparty/holoparty-card.jpg`,
            img1: `${IMAGE_PATH}/images/projects/holoparty/holoparty-1.jpg`,
            img2: `${IMAGE_PATH}/images/projects/holoparty/holoparty-2.jpg`,
            img3: `${IMAGE_PATH}/images/projects/holoparty/holoparty-3.jpg`,
            img4: `${IMAGE_PATH}/images/projects/holoparty/holoparty-4.jpg`
        },
        desc: "HoloParty is A Co-op Multiplayer Unofficial Hololive game with fun minigames!",
        link: "Not Open Source"
    },
    {
        id: "project-02",
        title: "Project-02",
        category: "game",
        stats: ["In Development"],
        techs: [""],
        images: 
        {
            card: `${IMAGE_PATH}/images/Projects/project-02/project-02-card.png`,
            img1: `${IMAGE_PATH}/images/projects/project-02/project-02-1.png`,
            img2: `${IMAGE_PATH}/images/projects/project-02/project-02-2.png`,
            img3: `${IMAGE_PATH}/images/projects/project-02/project-02-3.png`,
            img4: `${IMAGE_PATH}/images/projects/project-02/project-02-4.png`
        },
        desc: "",
        link: "Not Open Source"
    },
    {
        id: "project-03",
        title: "Risk of Idols",
        category: "modding",
        stats: ["In Development"],
        techs: ["Unity, C#"],
        images:
        {
            card: `/images/projects/ror2/ror2-card.png`,
            img1: `${IMAGE_PATH}/images/projects/ror2/ror2-1.png`,
            img2: `${IMAGE_PATH}/images/projects/ror2/ror2-2.png`,
            img3: `${IMAGE_PATH}/images/projects/ror2/ror2-3.png`,
            img4: `${IMAGE_PATH}/images/projects/ror2/ror2-4.png`
        },
        desc: "A Risk of Rain 2 Mod.",
        link: "https://github.com/M-Erm/Risk-of-Idols"
    },
    {
        id: "project-04",
        title: "NamaStream",
        category: "miscellaneous",
        stats: ["Deployed"],
        techs: ["Html, CSS, JavaScript, Typescript, WebExtensions API, Youtube API, Twitch API, Cloudflare Workers"],
        images: 
        {
            card: `${IMAGE_PATH}/images/projects/namastream/namastream-card.png`,
            img1: `${IMAGE_PATH}/images/projects/namastream/namastream-1.png`,
            img2: `${IMAGE_PATH}/images/projects/namastream/namastream-2.png`,
            img3: `${IMAGE_PATH}/images/projects/namastream/namastream-3.png`,
            img4: `${IMAGE_PATH}/images/projects/namastream/namastream-4.png`
        },
        desc: "A Firefox new tab extension that replaces your browser's default new tab with a real-time dashboard of VTuber live streams and upcoming schedules — powered by the YouTube Data API.",
        link: "https://github.com/M-Erm/namastream"
    },
    {
        id: "project-05",
        title: "Unity BootStrapper",
        category: "miscellaneous",
        stats: ["In Development"],
        techs: ["Html, CSS, JavaScript"],
        images: 
        {
            card: `${IMAGE_PATH}/images/projects/bootstrapper/bootstrapper-card.png`,
            img1: `${IMAGE_PATH}/images/projects/bootstrapper/bootstrapper-1.png`,
            img2: `${IMAGE_PATH}/images/projects/bootstrapper/bootstrapper-2.png`,
            img3: `${IMAGE_PATH}/images/projects/bootstrapper/bootstrapper-3.png`,
            img4: `${IMAGE_PATH}/images/projects/bootstrapper/bootstrapper-4.png`
        },
        desc: "A Project BootStrapper for Unity.",
        link: "https://github.com/M-Erm/Project-BootStrapper"
    },
    {
        id: "project-06",
        title: "Websocket Server",
        category: "miscellaneous",
        stats: ["In Development"],
        techs: ["Html, CSS, JavaScript"],
        images: 
        {
            card: `${IMAGE_PATH}/images/projects/websocket/websocket-card.png`,
            img1: `${IMAGE_PATH}/images/projects/websocket/websocket-1.png`,
            img2: `${IMAGE_PATH}/images/projects/websocket/websocket-2.png`,
            img3: `${IMAGE_PATH}/images/projects/websocket/websocket-3.png`,
            img4: `${IMAGE_PATH}/images/projects/websocket/websocket-4.png`
        },
        desc: "A Websocket Server implementation.",
        link: "https://github.com/M-Erm/"
    },
    {
        id: "project-07",
        title: "Event System",
        category: "miscellaneous",
        stats: ["In Development"],
        techs: [""],
        images: 
        {
            card: `${IMAGE_PATH}/images/projects/event/event-card.png`,
            img1: `${IMAGE_PATH}/images/projects/event/event-1.png`,
            img2: `${IMAGE_PATH}/images/projects/event/event-2.png`,
            img3: `${IMAGE_PATH}/images/projects/event/event-3.png`,
            img4: `${IMAGE_PATH}/images/projects/event/event-4.png`
        },
        desc: "An Event System implementation.",
        link: "https://github.com/M-Erm/"
    },
    {
        id: "project-08",
        title: "C Calculator",
        category: "college",
        stats: ["Finished"],
        techs: ["C"],
        images:
        {
            card: `${IMAGE_PATH}/images/projects/cc/cc-card.png`,
            img1: `${IMAGE_PATH}/images/projects/cc/cc-1.png`,
            img2: `${IMAGE_PATH}/images/projects/cc/cc-2.png`,
            img3: `${IMAGE_PATH}/images/projects/cc/c-3.png`,
            img4: `${IMAGE_PATH}/images/projects/cc/cc-4.png`
        },
        desc: "A C Calculator.",
        link: "https://github.com/migueluva2026-lang/Calculadora-C"
    },
    {
        id: "project-09",
        title: "Python Statistics",
        category: "college",
        stats: ["Finished"],
        techs: ["Python, pandas, matplotlb"],
        images:
        {
            card: `${IMAGE_PATH}/images/projects/statistics/statistics-card.png`,
            img1: `${IMAGE_PATH}/images/projects/statistics/statistics-1.png`,
            img2: `${IMAGE_PATH}/images/projects/statistics/statistics-2.png`,
            img3: `${IMAGE_PATH}/images/projects/statistics/statistics-3.png`,
            img4: `${IMAGE_PATH}/images/projects/statistics/statistics-4.png`
        },
        desc: "College Statistics Project developed in Python (pandas and matplotlib)",
        link: "https://github.com/migueluva2026-lang/1P-Estatistica"
    },
    {
        id: "project-10",
        title: "Java Rock Paper Scissors",
        category: "college",
        stats: ["Finished"],
        techs: ["Java"],
        images:
        {
            card: `${IMAGE_PATH}/images/projects/rps/rps-card.png`,
            img1: `${IMAGE_PATH}/images/projects/rps/rps-1.png`,
            img2: `${IMAGE_PATH}/images/projects/rps/rps-2.png`,
            img3: `${IMAGE_PATH}/images/projects/rps/rps-3.png`,
            img4: `${IMAGE_PATH}/images/projects/rps/rps-4.png`
        },
        desc: "College Project developed in Java",
        link: "https://github.com/migueluva2026-lang/Paradigmas-Linguagens-Programacao"
    }
]

const modelsData =  [
    {
        id: "model-01",
        name: "Fuwawa Abyssgard",
        category: "HoloParty",
        desc: "Unofficial Fuwawa Abyssgard - from Hololive.",
        about: "This model was created as a Holoparty 3D asset.",
        model3d: "",
        sketchfab: "https://sketchfab.com/M-erm",
        images: 
        {
            posed: `${IMAGE_PATH}/images/models/fuwawa/fuwawa-posed.png`,
            img1: `${IMAGE_PATH}/images/models/fuwawa/fuwawa-1.png`,
            img2: `${IMAGE_PATH}/images/models/fuwawa/fuwawa-2.png`,
            img3: `${IMAGE_PATH}/images/models/fuwawa/fuwawa-3.png`,
            img4: `${IMAGE_PATH}/images/models/fuwawa/fuwawa-4.png`,
        }
    },
    {
        id: "model-02",
        name: "Mococo Abyssgard",
        category: "HoloParty",
        desc: "Unofficial Mococo Abyssgard - from Hololive. HoloParty 3D Model.",
        about: "This model was created as a Holoparty 3D asset.",
        model3d: "/3D-Models/mococo_abyssgard.glb",
        sketchfab: "https://sketchfab.com/M-erm",
        images: 
        {
            posed: `${IMAGE_PATH}/images/models/mococo/mococo-posed.png`,
            img1: `${IMAGE_PATH}/images/models/mococo/mococo-1.png`,
            img2: `${IMAGE_PATH}/images/models/mococo/mococo-2.png`,
            img3: `${IMAGE_PATH}/images/models/mococo/mococo-3.png`,
            img4: `${IMAGE_PATH}/images/models/mococo/mococo-4.png`,
        }
    },
    {
        id: "model-03",
        name: "?????",
        category: "Miscellaneous",
        desc: "",
        about: "",
        model3d: "",
        sketchfab: "",
        images: 
        {
            posed: "",
            img1: "",
            img2: "",
            img3: "",
            img4: "",
        }
    }
]

const animationsData = [
    {
        id: "animation-01",
        name: "Gigi x Cc",
        category: "video",
        link: ""
    },
    {
        id: "animation-02",
        name: "Mococo Walk",
        category: "ingame",
        link: ""
    },
    {
        id: "animation-03",
        name: "Fuwawa Walk",
        category: "ingame",
        link: ""
    },
]

function changeURL(path) 
{
    path = path || ""; // Se path for null ou undefined, atribui string vazia
    path = path.replace(/^\/+/, ""); // Regex (Se achar / ->(,) remove ela -> "" )

    const parts = path.split("/");

    if (parts[0] === "en" || parts[0] === "pt-br")
    {
        parts.shift();
        path = parts.join("/"); 
    }

    const pathWithLang = currentLanguage + "/" + path  || "";
    const newUrl = `${BASE_PATH}/${pathWithLang}`;
    
    if (window.location.pathname !== newUrl)
    {
        history.pushState({},"", newUrl);
    }

    changePage(path);
}

function changePage(path) 
{
    let pageId = "homepage";
    const pathparts = path.split("/"); 
    const base = pathparts[0] || "";
    const id = pathparts[1] || null;

    if (base ==="")  // Dá valor ao pageId de acordo com o valor recebido. Útil para ativar página
        pageId = "homepage";
    else if (base ==="projects")
        pageId = id ? "project-view" : "projects"; 
    else if (base ==="models")
        pageId = id ? "model-view" : "models";
    else if (base ==="contact")
        pageId = "contact";
    else if (base ==="animations")
        pageId = "animations";

    pages.forEach(page => // Esconde todas as páginas 
    {
        page.classList.remove('page-active');
        page.classList.add('page-hidden');
    });

    document.getElementById("project-view").innerHTML = "";
    document.getElementById("model-view").innerHTML = "";

    const target = document.getElementById(pageId);

    if (target) // Ativa página target
    {
        target.classList.remove('page-hidden');
        target.classList.add('page-active');
    }

    if (base === "projects")
    {
        if (id)
            Load_Details_Project(id);
        else
            Load_Projects();
    }
    if (base === "models")
    {
        if (id)
            Load_Details_Models(id);
        else
            Load_Models();
    }
}

function Load_Projects()
{
    const projects = // Array 
    {
        Game: document.querySelector('#projects-games .projects-grid'),
        Modding: document.querySelector('#projects-modding .projects-grid'),
        Miscellaneous: document.querySelector('#projects-misc .projects-grid'),
        College: document.querySelector('#projects-college .projects-grid')
    }

    const cards = document.querySelectorAll(".card-project");

    cards.forEach(card => 
    {
        card.remove();
    });

    function createProjectCard(project) {
        return `
            <a href="projects/${project.id}" class="card-project" data-route>
                <img src="${project.images.card}" alt="${project.title} Preview">
                <h3>${project.title} </h3>
            </a>
        `;
    }

    Object.keys(projects).forEach(category => {  // Object.keys pega as Chaves (game, modding, etc) e foreach percorre elas e filtra 
        const filteredProjects = projectsData.filter(project => project.category === category.toLowerCase()); // Compara o valor da CHAVE de um array com o nome do outro

        filteredProjects.forEach(project => {
            projects[category].innerHTML += createProjectCard(project);
        });
    });
}

function Load_Models() // Filtra: Valor de Model.category comparado com nome da Chave Category e chama func
{
    const models = //Array
    {
        HoloParty: document.querySelector('#models-holoparty .models-grid'),
        Miscellaneous: document.querySelector("#models-misc .models-grid")
    }
    
    const cards = document.querySelectorAll(".card-model");

    cards.forEach(card => {
        card.remove();
    });

    function createModelCard(model) { 
        return ` 
            <li class="card-model" >
                <a href="models/${model.id}" data-route> 
                    <div class="img-box">
                        <figure>
                            <img src="${model.images.posed}" alt="${model.name} Preview">
                        </figure>
                        <div class="model-name">${model.name}</div>
                    </div>
                </a>
            </li>
        `;
    }

    Object.keys(models).forEach(category =>{ //Faz 2 coisas diferentes: Object.keys retorna array de chaves, foreach filtra cada chave e filteredModels tem algo tipo Games = games
        const filteredModels = modelsData.filter(model => model.category.toLowerCase() === category.toLowerCase());

        filteredModels.forEach(model => {
            models[category].innerHTML += createModelCard(model);
        });
    });
}

function Load_Details_Project(id)
{
    const projectInfo = document.getElementById("project-view");

    const project = projectsData.find((project) => project.id === id);

    if (!project)
    {
        projectInfo.innerHTML = "<p>Projeto não existe?</p>";
        return;
    }

    const project_view = `
        <div id="project-view-container">
            <div id="project-panel">
                <section id="project-info">
                    <div>Stats: ${project.stats} </div>
                    <div id="desc">${project.desc}</div>
                    <div id="techs">Techs: ${project.techs} </div>
                    <a href="${project.link}" id="github"><h1>Github</h1></a>
                </section>
                <section id="right-project-info">
                    <div class="project-title"> ${project.title} </div>
                    <div id="project-image-display"> <img id="image-display" src="${project.images.card}" alt="${project.title} Preview"> </div>
                    <section id="project-images">
                        <img src="${project.images.card}" onclick="ChangeProjectImage('${project.images.card}')" alt="${project.title} Preview">
                        <img src="${project.images.img1}" onclick="ChangeProjectImage('${project.images.img1}')" alt="${project.title} Preview">
                        <img src="${project.images.img2}" onclick="ChangeProjectImage('${project.images.img2}')" alt="${project.title} Preview">
                        <img src="${project.images.img3}" onclick="ChangeProjectImage('${project.images.img3}')" alt="${project.title} Preview">
                    </section>
                </section>
            </div>
        </div>
    ` ;

    projectInfo.innerHTML = project_view;
}

function Load_Details_Models(id)
{
    const modelInfo = document.getElementById("model-view");

    const model = modelsData.find((model) => model.id === id)

    if (!model)
        return;

    const model_view = `
        <div id="model-view-container">
            <div id="twod-view">
                <section id="model-images">
                    <img src="${model.images.posed}" onclick="ChangeDisplayImage('${model.images.posed}')" alt="${model.name} Preview">
                    <img src="${model.images.img1}" onclick="ChangeDisplayImage('${model.images.img1}')" alt="${model.name} Preview">
                    <img src="${model.images.img2}" onclick="ChangeDisplayImage('${model.images.img2}')" alt="${model.name} Preview">
                    <img src="${model.images.img3}" onclick="ChangeDisplayImage('${model.images.img3}')" alt="${model.name} Preview">
                    <img src="${model.images.img4}" onclick="ChangeDisplayImage('${model.images.img4}')" alt="${model.name} Preview">
                </section>
                <div id="twod-model">
                    <img id="display-image" src="${model.images.posed}" alt="${model.name} Preview">
                    <button class="view-3d-model" onclick="Toggle3D()">3D</button>
                </div>
            </div>

            <div id="threed-view" style="display: none;">
            <button class="view-3d-model" onclick="Toggle2D()">2D</button>
                <model-viewer
                    src="${model.model3d}"
                    alt="${model.name} 3D Model"
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    style="width: 100%; height: 600px;">
                </model-viewer>
            </div>

            <section id="model-info">
                <div class="model-info-name">${model.name}</div>
                <div class="model-info-desc">${model.desc}</div>
                <div class="model-info-about">${model.about}</div>
                <a href="${model.sketchfab}" class="sketchfab"> SketchFab </a>
            </section>
        </div>

        <div class="contrast-text" data-i18n="model_animations"> ${model.name} In-Game Animations </div>
        <div style="width: 100vw; min-height: 40vh; background-color: gray;">
            <div class="display-animation"></div>
            <div class="display-animation"></div>
            <div class="display-animation"></div>
        </div>
    `;

    modelInfo.innerHTML = model_view;
}

function ChangeProjectImage(newImage)
{
    const displayImage = document.getElementById("image-display");
    displayImage.src = newImage;
}

function ChangeDisplayImage(newimage)
{
    const displayImage = document.getElementById("display-image");
    displayImage.src = newimage;
}

function Toggle3D()
{
    document.getElementById("twod-view").style.display = "none";
    document.getElementById("threed-view").style.display = "block";
}

function Toggle2D()
{
    document.getElementById("twod-view").style.display = "flex";
    document.getElementById("threed-view").style.display = "none";
}

function ChangeLanguage(targetLanguage)
{
    currentLanguage = targetLanguage;
    
    const fullPath = window.location.pathname;
    let currentPath = fullPath.replace(BASE_PATH + "/", "");    

    if (currentPath.startsWith("en/") || currentPath.startsWith("pt-br/"))
    {
        currentPath = currentPath.split("/").slice(1).join("/");
    }

    const newPath = targetLanguage + "/" + currentPath;

    changeURL(newPath);
    ChangeLanguageHTML();
}

function ChangeLanguageHTML() 
{
    const words = document.querySelectorAll("[data-i18n]"); 

    words.forEach(word =>
    {
        const value = word.getAttribute("data-i18n");
        if (translations[currentLanguage] && translations[currentLanguage][value])
        {
            word.textContent = translations[currentLanguage][value]
        }
    });
}

document.addEventListener("click", (click) =>
{
    const link = click.target.closest("a[data-route]"); // Exemplo de retorno: <a href="projects/project-01" data-route>Project 01</a>
    if (!link) return;

    click.preventDefault();

    const path = link.getAttribute("href");
    changeURL(path);
});

window.addEventListener("popstate", () =>
{
    changeURL(window.location.pathname.replace(BASE_PATH, "")); // Pega o path da URL atual, remove a primeira parte e chama changeURL
});


window.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.replace(BASE_PATH, "");
    changeURL(currentPath);
});