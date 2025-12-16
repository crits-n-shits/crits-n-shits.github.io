// data-loader.js

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function formatPlayers(players) {
    if (!players) return "";
    if (players.min === players.max) {
        return `👥 ${players.min}`;
    }
    return `👥 ${players.min}–${players.max}`;
}

function formatTime(time) {
    if (!time) return "";
    if (time.min === time.max) {
        return `⏱ ${time.min} хв`;
    }
    return `⏱ ${time.min}–${time.max} хв`;
}

function formatTags(tags) {
    if (!tags || tags.length === 0) return '';
    return `
        <div class="game-tags">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
}

async function loadGames(url, containerId, count = -1) {
    const response = await fetch(url);
    const data = await response.json();

    let itemsToDisplay = data;
    
    if (count > 0) {
        itemsToDisplay = shuffleArray([...data]).slice(0, count);
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    itemsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.className = "game-row";
        
        card.innerHTML = `
            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="game-image">` : ''}
            <div class="game-content">
                <div>
                    <strong>${item.title}</strong>
                    <p>${item.description}</p>
                    ${formatTags(item.tags)}
                </div>
                
                <div class="game-meta-footer">
                    ${formatPlayers(item.players)}
                    ${formatTime(item.time)}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

let mastersData = [];
let currentMasterIndex = 0;
const MASTERS_VISIBLE = 3;

async function loadMasters() {
    const response = await fetch("data/masters.json");
    mastersData = await response.json();

    renderMasters();
    updateMasterArrows();
}

function renderMasters() {
    const container = document.getElementById("masters-list");
    if (!container) return;
    container.innerHTML = "";

    const visibleMasters = mastersData.slice(currentMasterIndex, currentMasterIndex + MASTERS_VISIBLE);

    visibleMasters.forEach(master => {
        const card = document.createElement("div");
        card.className = "master-card";

        card.innerHTML = `
            <div class="master-portrait">
                <img src="${master.image}" alt="${master.name}">
            </div>
            <div class="master-info">
                <strong class="master-name">${master.name}</strong>
                <p class="master-systems">${master.systems.join(", ")}</p>
                <p class="master-description">${master.description || ''}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

function updateMasterArrows() {
    const prevBtn = document.getElementById("masters-prev");
    const nextBtn = document.getElementById("masters-next");
    const arrowsContainer = document.querySelector(".masters-arrows");
    
    if (!arrowsContainer) return;

    if (mastersData.length <= MASTERS_VISIBLE) {
        arrowsContainer.style.display = "none";
    } else {
        arrowsContainer.style.display = "flex";
        if (prevBtn) prevBtn.disabled = currentMasterIndex === 0;
        if (nextBtn) nextBtn.disabled = currentMasterIndex >= mastersData.length - MASTERS_VISIBLE;
    }
}

function mastersPrev() {
    if (currentMasterIndex > 0) {
        currentMasterIndex--;
        renderMasters();
        updateMasterArrows();
    }
}

function mastersNext() {
    if (currentMasterIndex < mastersData.length - MASTERS_VISIBLE) {
        currentMasterIndex++;
        renderMasters();
        updateMasterArrows();
    }
}

async function loadGallery(count = -1) {
    const response = await fetch("data/gallery.json");
    const data = await response.json();

    let itemsToDisplay = data;
    
    if (count > 0) {
        itemsToDisplay = shuffleArray([...data]).slice(0, count);
    }
    
    const container = document.getElementById("gallery-list");
    if (!container) return;
    container.innerHTML = "";

    itemsToDisplay.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.alt || "Фото клубу";
        container.appendChild(img);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadGames("data/boardgames.json", "boardgames-list", 3);
    loadGames("data/rpg.json", "rpg-list", 3);
    loadGames("data/wargames.json", "wargames-list", 3);
    loadMasters();
    loadGallery(5);
});
