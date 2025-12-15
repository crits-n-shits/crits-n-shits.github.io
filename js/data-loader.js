async function loadGames(url, containerId) {
    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById(containerId);

    data.forEach(item => {
        const row = document.createElement("div");
        row.className = "game-row";
        row.style.backgroundImage = `url('${item.image}')`;

        row.innerHTML = `
            <div class="game-content">
                <strong>${item.title}</strong>
                <span>${item.description}</span>
            </div>
        `;

        container.appendChild(row);
    });
}

async function loadMasters() {
    const response = await fetch("data/masters.json");
    const data = await response.json();

    const container = document.getElementById("masters-list");

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

async function loadGallery() {
    const response = await fetch("data/gallery.json");
    const data = await response.json();

    const container = document.getElementById("gallery-list");

    data.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.alt || "Фото клуба";

        container.appendChild(img);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadGames("data/boardgames.json", "boardgames-list");
    loadGames("data/rpg.json", "rpg-list");
    loadGames("data/wargames.json", "wargames-list");
    loadMasters();
    loadGallery();
});

