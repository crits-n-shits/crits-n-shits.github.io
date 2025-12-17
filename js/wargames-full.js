// wargames-full.js
let allWargames = [];
const WARGAMES_DATA_URL = "data/wargames.json";
const listContainer = document.getElementById("wargames-list-full");

async function initWargamesPage() {
    try {
        const response = await fetch(WARGAMES_DATA_URL);
        allWargames = await response.json();

        updateDisplay();

        // Слухачі подій для пошуку та сортування
        document.getElementById('wargames-search').addEventListener('input', updateDisplay);
        document.getElementById('wargames-sort').addEventListener('change', updateDisplay);
    } catch (e) {
        console.error("Помилка завантаження варгеймів:", e);
        listContainer.innerHTML = "<p style='text-align:center;'>Не вдалося завантажити каталог варгеймів.</p>";
    }
}

function updateDisplay() {
    const query = document.getElementById('wargames-search').value.toLowerCase();
    const sortMode = document.getElementById('wargames-sort').value;

    // 1. Фільтрація за назвою, описом та тегами
    let filtered = allWargames.filter(game => {
        const searchableText = `${game.title} ${game.description} ${game.tags ? game.tags.join(' ') : ''}`.toLowerCase();
        return searchableText.includes(query);
    });

    // 2. Сортування (враховуючи мін/макс значення)
    filtered.sort((a, b) => {
        switch (sortMode) {
            case 'title-asc': return a.title.localeCompare(b.title, 'uk');
            case 'title-desc': return b.title.localeCompare(a.title, 'uk');
            case 'players-asc': return (a.players.min || 0) - (b.players.min || 0);
            case 'players-desc': return (b.players.max || 0) - (a.players.max || 0);
            case 'time-asc': return (a.time.min || 0) - (b.time.min || 0);
            case 'time-desc': return (b.time.max || 0) - (a.time.max || 0);
            default: return 0;
        }
    });

    renderWargames(filtered);
}

function renderWargames(games) {
    listContainer.innerHTML = "";

    if (games.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center; padding: 50px; color: var(--text-muted);'>За вашим запитом нічого не знайдено.</p>";
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card-full';

        // Встановлюємо картинку як фон
        if (game.image) {
            card.style.backgroundImage = `url(${game.image})`;
        }

        card.innerHTML = `
            <div class="card-content">
                <h3>${game.title}</h3>
                <p>${game.description}</p>

                <div class="game-tags">
                    ${(game.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>

                <div class="game-meta-footer">
                    <span>${formatPlayers(game.players)}</span>
                    <span>${formatTime(game.time)}</span>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Запуск при завантаженні
document.addEventListener("DOMContentLoaded", initWargamesPage);