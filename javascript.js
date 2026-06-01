// 
// Carrega informações no HTML dinamicamente, baseado no URL e no idioma selecionado.
// Usa SPA para navegar sem recarregar a página
//

import translations from './data/translations.json' with { type: 'json' };
import models from './data/models.json' with { type: 'json' };
import projects from './data/projects.json' with { type: 'json' };
import animationsData from './data/animations.json' with { type: 'json' };

const getBasePath = () => {
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.io')) {
        const pathname = window.location.pathname;
        const repoName = pathname.split('/').filter(Boolean)[0]; 
        return `/${repoName}`;
    }
    
    return "/Portfolio";
};


const BASE_PATH = getBasePath(); // Esperado: Local: "/Portfolio", Remoto: "/NomeDoRepo"
let currentLanguage = "en";

const pages = document.querySelectorAll("main > section");
const main_page = document.getElementById('homepage');

const projectsData = projects.map(project => ({
    ...project,
    images: buildImages(
        "projects",
        project.id,
        project.imagesCount
    )
}));

const modelsData = models.map(model => ({
    ...model,
    images: buildImages(
        "Models",
        model.id,
        model.imagesCount
    )
}));

function buildImages(type, id, imageCount) {
  return {
    card: `${BASE_PATH}/images/${type}/${id}/${id}-card.jpg`,
    gallery: Array.from(
      { length: imageCount },
      (_, i) => `${BASE_PATH}/images/${type}/${id}/${id}-${i + 1}.jpg`
    )
  };
}

function changeURL(path)
{
    path = path || ""; // Faz isso pra evitar que path seja null e não seja string, quebraria tudo
    path = path.replace(/^\/+/, ""); // Remove barra inicial pro split funcionar

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

    pages.forEach(page =>
    {
        page.classList.remove('page-active');
        page.classList.add('page-hidden');
    });

    document.getElementById("project-view").innerHTML = "";
    document.getElementById("model-view").innerHTML = "";

    const newPage = document.getElementById(pageId);

    if (newPage)
    {
        newPage.classList.remove('page-hidden');
        newPage.classList.add('page-active');
    }

    if (base === "projects")
    {
        if (id)
        {
            if (id.toLowerCase() === "namastream")
                LoadNamaStreamView();
            else
                Load_Details_Project(id);
        }
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
    const projects =
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
                <img src="${project.images.card}" alt="${project.name} Preview">
                <h3>${project.name} </h3>
            </a>
        `;
    }

    Object.keys(projects).forEach(type => {  // Object.keys pega as Chaves (game, modding, etc)
        const filteredProjects = projectsData.filter(project => project.type === type.toLowerCase()); // Compara o valor da CHAVE de um array com o param 

        filteredProjects.forEach(project => {
            projects[type].innerHTML += createProjectCard(project);
        });
    });
}

function Load_Models()
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
                            <img src="${model.images.card}" alt="${model.name} Preview">
                        </figure>
                        <div class="model-name">${model.name}</div>
                    </div>
                </a>
            </li>
        `;
    }

    Object.keys(models).forEach(type => {
        const filteredModels = modelsData.filter(model => model.type.toLowerCase() === type.toLowerCase());

        filteredModels.forEach(model => {
            models[type].innerHTML += createModelCard(model);
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
                    <div>Stats: ${project.status} </div>
                    <div id="desc"> ${project.desc} </div>
                    <div id="techs"> Techs: ${project.stack} </div>
                    <a href="${project.link}" id="github"><h1>Github</h1></a>
                </section>
                <section id="right-project-info">
                    <div class="project-title"> ${project.name} </div>
                    <div id="project-image-display"> <img id="image-display" src="${project.images.card}" alt="${project.name} Preview"> </div>
                    <section id="project-images">
                        <img src="${project.images.card}" onclick="ChangeProjectImage('${project.images.card}')" alt="${project.name} Preview">
                        <img src="${project.images.gallery[0]}" onclick="ChangeProjectImage('${project.images.gallery[0]}')" alt="${project.name} Preview">
                        <img src="${project.images.gallery[1]}" onclick="ChangeProjectImage('${project.images.gallery[1]}')" alt="${project.name} Preview">
                        <img src="${project.images.gallery[2]}" onclick="ChangeProjectImage('${project.images.gallery[2]}')" alt="${project.name} Preview">
                        <img src="${project.images.gallery[3]}" onclick="ChangeProjectImage('${project.images.gallery[3]}')" alt="${project.name} Preview">
                        <img src="${project.images.gallery[4]}" onclick="ChangeProjectImage('${project.images.gallery[4]}')" alt="${project.name} Preview">
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

function LoadNamaStreamView()
{
    const projectView = document.getElementById("project-view");
    projectView.innerHTML = `<iframe src="${BASE_PATH}/views/namastream/index.html" style="width: 100%; height: 100vh;"></iframe>`;
}

function ChangeLanguage(targetLanguage) 
{
    currentLanguage = targetLanguage;
    
    const fullPath = window.location.pathname;
    let currentPath = fullPath.replace(BASE_PATH + "/", "");

    if (currentPath.startsWith("en/") || currentPath.startsWith("pt-br/")) // Evita duplicação de langs no path
    {
        currentPath = currentPath.split("/").slice(1).join("/");
    }

    const currentPathWithLang = targetLanguage + "/" + currentPath;

    changeURL(currentPathWithLang);
    ChangeLanguageHTML();
}

function ChangeLanguageHTML() 
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

window.ChangeLanguage = ChangeLanguage;
window.ChangeDisplayImage = ChangeDisplayImage;
window.ChangeProjectImage = ChangeProjectImage;
window.Toggle3D = Toggle3D;
window.Toggle2D = Toggle2D;
window.LoadNamaStreamView = LoadNamaStreamView;

window.addEventListener("DOMContentLoaded", () => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    
    if (redirectPath) {
        sessionStorage.removeItem('redirectPath'); // Limpa pra não ficar em loop
        const cleanPath = redirectPath.replace(BASE_PATH, "");
        changeURL(cleanPath);
    } else {
        // Navegação normal
        const currentPath = window.location.pathname.replace(BASE_PATH, "");
        changeURL(currentPath);
    }
});