// boardgames-full.js

let allGames = [];
const GAMES_URL = "data/boardgames.json";
const containerId = "full-games-list";

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


function renderGames(games) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    if (games.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted);">Ігри не знайдено за заданими критеріями.</p>`;
        return;
    }

    games.forEach(item => {
        const card = document.createElement("div");
        card.className = "game-card-full";

        // Встановлюємо фонове зображення
        if (item.image) {
            card.style.backgroundImage = `url(${item.image})`;
        }

        card.innerHTML = `
            <div class="card-overlay">
                <strong>${item.title}</strong>
                <p>${item.description}</p>
                ${formatTags(item.tags)}

                <div class="game-meta-footer">
                    ${formatPlayers(item.players)}
                    ${formatTime(item.time)}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// --- Функції фільтрації та сортування ---

function filterAndSortGames() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;

    // 1. Фільтрація
    let filteredGames = allGames.filter(game => {
        const searchText = `${game.title.toLowerCase()} ${game.description.toLowerCase()} ${game.tags ? game.tags.join(' ').toLowerCase() : ''}`;
        return searchText.includes(searchInput);
    });

    // 2. Сортування
    filteredGames.sort((a, b) => {
        switch (sortValue) {
            case 'title-asc':
                return a.title.localeCompare(b.title, 'uk', { sensitivity: 'base' });
            case 'title-desc':
                return b.title.localeCompare(a.title, 'uk', { sensitivity: 'base' });
            case 'players-asc':
                return (a.players.min || Infinity) - (b.players.min || Infinity);
            case 'time-asc':
                return (a.time.min || Infinity) - (b.time.min || Infinity);
            default:
                return 0;
        }
    });

    // 3. Відображення
    renderGames(filteredGames);
}

// --- Ініціалізація ---

async function initFullGamesPage() {
    try {
        const response = await fetch(GAMES_URL);
        const data = await response.json();
        allGames = data;

        // Початкове відображення (відсортоване за замовчуванням)
        filterAndSortGames(); 

        // Додавання обробників подій для пошуку та сортування
        document.getElementById('search-input').addEventListener('input', filterAndSortGames);
        document.getElementById('sort-select').addEventListener('change', filterAndSortGames);

    } catch (error) {
        console.error("Помилка завантаження даних ігор:", error);
        document.getElementById(containerId).innerHTML = `<p style="text-align: center; color: var(--danger);">Помилка завантаження каталогу ігор.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", initFullGamesPage);
