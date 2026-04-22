let map = L.map("map").setView([-7.1617, -78.5128], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

fetch("/api/real-places")
    .then(res => res.json())
    .then(data => {
        data.forEach(place => {
            L.marker([place.lat, place.lng])
                .addTo(map)
                .bindPopup(`${place.name} (${place.type})`);
        });
    });

const searchInput = document.getElementById("searchButton");

let searchMarker;

searchInput.addEventListener("keydown", (e) => {
    
    if (e.key === "Enter") {
        fetch(`/api/search?q=${searchInput.value}`)
        
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const place = data[0];

                    map.setView([place.lat, place.lon], 15);

                    if (searchMarker) {
                        map.removeLayer(searchMarker);
                    }

                    searchMarker = L.marker([place.lat, place.lon])
                        .addTo(map)
                        .bindPopup(place.display_name)
                        .openPopup();
                }
            });
    }
});

fetch("/api/news")
    .then(res => res.json())
    .then(articles => {
        const section = document.getElementById("section1");

        articles.forEach(article => {
            const div = document.createElement("div");

            div.innerHTML = `
                <img src="${article.image || "default.jpg"}" class="news">
                <a href="${article.url}" target="_blank">${article.title}</a>
            `;

            section.appendChild(div);
        });
    });

let zoomPaper = document.querySelectorAll(".news");

zoomPaper.forEach(img => {
    img.addEventListener("mouseover", () => {
        img.style.transform = "scale(1.1)";
    });

    img.addEventListener("mouseout", () => {
        img.style.transform = "scale(1)";
    });
});

document.addEventListener("mouseover", (e) => {
    if(e.target.classList.contains("news")) {
        e.target.style.transform = "scale(1.1)";
    }
});

document.addEventListener("mouseout", (e) => {
    if(e.target.classList.contains("news")) {
        e.target.style.transform = "scale(1)"
    }
});