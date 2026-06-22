// 
// Carrega informações no HTML dinamicamente, baseado no URL e no idioma selecionado.
// Usa SPA para navegar sem recarregar a página
//

import translations from './data/translations.json' with { type: 'json' };
import games from './data/games.json' with { type: 'json' };
import mods from './data/mods.json' with { type: 'json' };
import softwares from './data/softwares.json' with { type: 'json' };
import models from './data/models.json' with { type: 'json' };
import animationsData from './data/animations.json' with { type: 'json' };

export const languageState = { current: "en" };
export let currentLanguage = languageState.current;

const getBasePath = () => { // Assim nunca quebra remotamente mesmo que eu troque o nome do repo
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.io')) {
        const pathname = window.location.pathname;
        const repoName = pathname.split('/').filter(Boolean)[0]; 
        return `/${repoName}`;
    }
    
    return "/ErmStudio";
};

const BASE_PATH = getBasePath();
const pages = document.querySelectorAll("main > section");

const gamesData = buildData(games, "games");
const modsData = buildData(mods, "mods");
const softwaresData = buildData(softwares, "softwares");
const modelsData = buildData(models, "models");

function buildData(data, type)
{
    return data.map(item => ({
        ...item, // Copia o objeto inteiro
        images: buildImages(type, item.id, item.imagesCount)
    }));
}

function buildImages(type, id, imageCount) 
{
    const imagePath = `${BASE_PATH}/images/${type}/${id}/${id}`;
    const card = `${imagePath}-card.jpg`;
  
    const images = [];

    for (let i = 1; i <= imageCount; i++)
    {
        images.push(`${imagePath}-${i}.jpg`);
    }

    return { card, images };
}

function changeURL(path)
{
    path = path || ""; // Evita que path não seja string
    path = path.replace(/^\/+/, ""); // Remove a primeira barra

    const parts = path.split("/");

    if (parts[0] === "en" || parts[0] === "pt-br")
    {
        parts.shift();
        path = parts.join("/"); 
    }

    const fullPath = currentLanguage + "/" + path  || "";
    const newUrl = `${BASE_PATH}/${fullPath}`;
    
    if (window.location.pathname !== newUrl)
    {
        history.pushState({},"", newUrl);
    }

    changePage(path);
}

function changePage(path)
{
    const pathparts = path.split("/");
    const base = pathparts[0] || "";
    const id = pathparts[1] || null;

    const websitePages = {
        "": "homepage",
        games: id ? "game-view" : "games",
        softwares: id ? "software-view" : "softwares",
        models: id ? "model-view" : "models",
        contact: "contact",
        animations: "animations"
    };

    const pageId = websitePages[base] ?? "homepage";

    // Esconde todas as páginas
    pages.forEach(page =>
    {
        page.classList.remove("page-active");
        page.classList.add("page-hidden");
    });

    // Limpa as páginas de detalhes
    ["game-view", "software-view", "model-view"].forEach(id =>
    {
        const element = document.getElementById(id);
        if (element) element.innerHTML = "";
    });

    // Mostra a página correta
    const page = document.getElementById(pageId);
    if (page)
    {
        page.classList.remove("page-hidden");
        page.classList.add("page-active");
    }

    // Carrega conteúdo
    switch (base)
    {
        case "games":
            if (id)
                loadCustomView(id);
            else {
                loadGamesGrid();
                loadModsGrid();
            }
            break;     
        case "softwares":
            if (id)
            {
                console.log(id);
                if (id == "namastream")
                {
                    loadCustomView(id);
                }
                else {
                    loadSoftwareDetails(id);
                }
            }
            else
            {
                loadSoftwaresGrid();
            }
            break;

        case "models":
            if (id)
                loadModelDetails(id);
            else
                loadModelsGrid();
            break;
    }
}

function loadGamesGrid()
{
    const grid = document.getElementById("games-grid");
    grid.innerHTML = "";

    gamesData.forEach(element => {
        const card = `
        <a href="games/${element.id}" class="card-game" data-route>
            <img src="${element.images.card}" alt="${element.name} Preview">
            <div class="card-game-info">
                <h3 class="game-title">${element.name}</h3>
                <span class="game-status">${element.status}</span>
            </div>
        </a>`

        grid.innerHTML += card;
    });
}

function loadModsGrid()
{
    const grid = document.getElementById("mods-grid");
    grid.innerHTML = "";

    modsData.forEach(element => {
        const card = `
        <a href="games/${element.id}" class="card-game" data-route>
            <img src="${element.images.card}" alt="${element.name} Preview">
            <div class="card-game-overlay">
            <span class="game-status">${element.status}</span>
            <h3 class="game-title">${element.name}</h3>
            </div>
        </a>`

        grid.innerHTML += card;
    });
}

function loadSoftwaresGrid()
{
    const grid = document.getElementById("softwares-grid");
    grid.innerHTML = "";

    softwaresData.forEach(element => {
        const card = `
        <a href="softwares/${element.id}" class="card-software" data-route>
            <img src="${element.images.card}" alt="${element.name} Preview">
            <div class="card-software-overlay">
                <span class="game-status">${element.status}</span>
                <h3 class="game-title">${element.name}</h3>
            </div>
        </a>`

        grid.innerHTML += card;
    });
}

function loadModelsGrid()
{
    const modelGrids = // Objeto
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
                            <img src="${model.images.card}" alt="${model.name} Preview">
                        </figure>
                        <div class="model-name">${model.name}</div>
                    </div>
                </a>
            </li>
        `;
    }

    Object.keys(modelGrids).forEach(grid => {
        const filteredModels = modelsData.filter(model => model.type.toLowerCase() === grid.toLowerCase());

        filteredModels.forEach(model => {
            modelGrids[grid].innerHTML += createModelCard(model);
        });
    });
}

function loadCustomView(id)
{
    const softwareView = document.getElementById("software-view");
    softwareView.innerHTML = `<iframe id="${id}-iframe" src="${BASE_PATH}/views/${id}/index.html" style="width: 100%; height: 100vh;"></iframe>`;
}

function loadSoftwareDetails(id)
{
    console.log("Carregando view de Software");
    const softwareInfo = document.getElementById("software-view");
    const software = softwaresData.find((software) => software.id === id);

    if (!software)
    {
        softwareInfo.innerHTML = "<p> Projeto não existe ? </p>";
        return;
    }

    const software_view = `
        <div id="software-view-container">
            <div id="software-panel">
                <section id="software-info">
                    <div>Stats: ${software.status} </div>
                    <div id="desc"> ${software.desc} </div>
                    <div id="techs"> Stack: ${software.stack} </div>
                    <a href="${software.link}" id="github"><h1>Github</h1></a>
                </section>
                <section id="right-software-info">
                    <div class="software-title"> ${software.name} </div>
                    <div id="software-image-display"> <img id="image-display" src="${software.images.card}" alt="${software.name} Preview"> </div>
                    <section id="software-images">
                        <img src="${software.images.card}" onclick="changeProjectImage('${software.images.card}')" alt="${software.name} Preview">
                        <img src="${software.images.images[0]}" onclick="changeProjectImage('${software.images.images[0]}')" alt="${software.name} Preview">
                        <img src="${software.images.images[1]}" onclick="changeProjectImage('${software.images.images[1]}')" alt="${software.name} Preview">
                        <img src="${software.images.images[2]}" onclick="changeProjectImage('${software.images.images[2]}')" alt="${software.name} Preview">
                        <img src="${software.images.images[3]}" onclick="changeProjectImage('${software.images.images[3]}')" alt="${software.name} Preview">
                        <img src="${software.images.images[4]}" onclick="changeProjectImage('${software.images.images[4]}')" alt="${software.name} Preview">
                    </section>
                </section>
            </div>
        </div>
    ` ;

    softwareInfo.innerHTML = software_view;
}

function loadModelDetails(id)
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
                    <button class="view-3d-model" onclick="toggle3D()">3D</button>
                </div>
            </div>

            <div id="threed-view" style="display: none;">
            <button class="view-3d-model" onclick="toggle2D()">2D</button>
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

function changeProjectImage(newImage)
{
    const displayImage = document.getElementById("image-display");
    displayImage.src = newImage;
}

function changeDisplayImage(newimage)
{
    const displayImage = document.getElementById("display-image");
    displayImage.src = newimage;
}

function toggle3D()
{
    document.getElementById("twod-view").style.display = "none";
    document.getElementById("threed-view").style.display = "block";
}

function toggle2D()
{
    document.getElementById("twod-view").style.display = "flex";
    document.getElementById("threed-view").style.display = "none";
}

function changeLanguageURL(targetLanguage)
{
    languageState.current = targetLanguage;
    currentLanguage = targetLanguage;

    const iframe = document.getElementById('namastream-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'LANGUAGE_CHANGED', language: targetLanguage }, '*');
    }

    const fullPath = window.location.pathname;
    let currentPath = fullPath.replace(BASE_PATH + "/", "");

    if (currentPath.startsWith("en/") || currentPath.startsWith("pt-br/")) // Evita duplicação de langs no path
    {
        currentPath = currentPath.split("/").slice(1).join("/");
    }

    const currentPathWithLang = targetLanguage + "/" + currentPath;

    changeURL(currentPathWithLang);
    changeLanguageHTML();
}

function changeLanguageHTML() 
{
    const words = document.querySelectorAll("[data-i18n]"); 
    words.forEach(word =>
    {
        const value = word.getAttribute("data-i18n");
        if (translations[currentLanguage] && translations[currentLanguage][value]) // translations[] porque se usar o "." ele procura "currentLanguage" literalmente como chave 
        {
            word.textContent = translations[currentLanguage][value];
        }
    });
}

document.addEventListener("click", (click) =>
{
    const link = click.target.closest("a[data-route]"); // Exemplo de retorno: <a href="softwares/software-01" data-route>Project 01</a>
    if (!link) return;

    click.preventDefault();

    const path = link.getAttribute("href");
    changeURL(path);
});

window.addEventListener("popstate", () =>
{
    changeURL(window.location.pathname.replace(BASE_PATH, "")); // Pega o path da URL atual, remove a primeira parte e chama changeURL
});

// Sem isso as funções não funcionam no HTML
window.changeLanguage = changeLanguageURL;
window.changeDisplayImage = changeDisplayImage;
window.changeProjectImage = changeProjectImage;
window.toggle3D = toggle3D;
window.toggle2D = toggle2D;
window.loadCustomView = loadCustomView;

window.addEventListener("DOMContentLoaded", () => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    
    if (redirectPath) {9
        sessionStorage.removeItem('redirectPath'); // Limpa pra poder cliar um novo na próxima vez
        const fallbackPath = redirectPath.replace(BASE_PATH, "");
        changeURL(fallbackPath);
    } else {
        // Navegação normal
        const currentPath = window.location.pathname.replace(BASE_PATH, "");
        changeURL(currentPath);
    }
});

window.addEventListener('message', (event) => { // Event listener pro youtube hover do iframe do namastream
    if (event.data?.type === 'NAMASTREAM_READY') {
        const iframe = document.getElementById('namastream-iframe');
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'LANGUAGE_CHANGED',
                language: currentLanguage
            }, '*');
        }
    }
});