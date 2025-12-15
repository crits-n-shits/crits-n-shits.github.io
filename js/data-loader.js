// data-loader.js

// Вспомогательная функция для перемешивания массива (Фишер-Йетс)
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

// НОВАЯ ФУНКЦИЯ: Генерация тегов
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
    
    // Логика для выбора случайных игр (только для секции "Настолки")
    if (count > 0 && containerId === "boardgames-list") {
        itemsToDisplay = shuffleArray(data).slice(0, count);
    }
    
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    itemsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.className = "game-row";
        
        // НОВЫЙ ШАБЛОН КАРТОЧКИ
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
        // КОНЕЦ НОВОГО ШАБЛОНА

        container.appendChild(card);
    });
}

async function loadMasters() {
    const response = await fetch("data/masters.json");
    const data = await response.json();

    const container = document.getElementById("masters-list");
    container.innerHTML = ""; 

    data.forEach(master => {
        const card = document.createElement("div");
        card.className = "master-card";

        card.innerHTML = `
            <img src="${master.image}" alt="${master.name}">
            <div>
                <strong>${master.name}</strong>
                <p>${master.systems.join(", ")}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

// ОБНОВЛЕННАЯ ФУНКЦИЯ loadGallery
async function loadGallery(count = -1) {
    const response = await fetch("data/gallery.json");
    const data = await response.json();

    let itemsToDisplay = data;
    
    // Логика для выбора случайных фото
    if (count > 0) {
        itemsToDisplay = shuffleArray(data).slice(0, count);
    }
    
    const container = document.getElementById("gallery-list");
    container.innerHTML = ""; 

    itemsToDisplay.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.alt || "Фото клуба";

        container.appendChild(img);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    // Загружаем 3 случайные настолки
    loadGames("data/boardgames.json", "boardgames-list", 3); 
    
    // Загружаем полный список НРИ и Варгеймов
    loadGames("data/rpg.json", "rpg-list");
    loadGames("data/wargames.json", "wargames-list");
    
    loadMasters();
    
    // Загружаем 3 случайных фото из галереи
    loadGallery(5); 
});
