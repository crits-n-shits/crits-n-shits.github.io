// rpg-full.js
let allRpg = [];
const RPG_DATA_URL = "data/rpg.json";
const listContainer = document.getElementById("rpg-list-full");

async function initRpgPage() {
    try {
        const response = await fetch(RPG_DATA_URL);
        allRpg = await response.json();

        updateDisplay();

        document.getElementById('rpg-search').addEventListener('input', updateDisplay);
        document.getElementById('rpg-sort').addEventListener('change', updateDisplay);
    } catch (e) {
        console.error("Помилка:", e);
        listContainer.innerHTML = "<p>Не вдалося завантажити список ігор.</p>";
    }
}

function updateDisplay() {
    const query = document.getElementById('rpg-search').value.toLowerCase();
    const sortMode = document.getElementById('rpg-sort').value;

    // Фільтрація
    let filtered = allRpg.filter(game => {
        const content = `${game.title} ${game.description} ${game.tags?.join(' ')}`.toLowerCase();
        return content.includes(query);
    });

    // Сортування
    filtered.sort((a, b) => {
        switch (sortMode) {
            case 'title-asc': return a.title.localeCompare(b.title, 'uk');
            case 'players-asc': return (a.players.min || 0) - (b.players.min || 0);
            case 'players-desc': return (b.players.max || 0) - (a.players.max || 0);
            case 'time-asc': return (a.time.min || 0) - (b.time.min || 0);
            case 'time-desc': return (b.time.max || 0) - (a.time.max || 0);
            default: return 0;
        }
    });

    renderCards(filtered);
}

function renderCards(games) {
    listContainer.innerHTML = "";

    if (games.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center; padding: 50px;'>Нічого не знайдено...</p>";
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card-full';
        if (game.image) card.style.backgroundImage = `url(${game.image})`;

        card.innerHTML = `
            <div class="card-content">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <div class="game-tags">
                    ${(game.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
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

document.addEventListener("DOMContentLoaded", initRpgPage);