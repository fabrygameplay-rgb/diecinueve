//server//

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const express = require("express");

const app = express();

//Middleware

app.use(express.json());

app.use(express.static("public"));

//Test route

app.get("/api/test", (req, res) => {
    res.json({message:"Server running"});
});


//map

app.get("/api/places", (req, res) => {
    res.json([
        {
            name: "Clínica Huellas",
            lat: -7.162,
            lng: -78.515
        },
        {
            name: "Refugio Garritas",
            lat: -7.165,
            lng: -78.510
        }
    ]);
});

//Port

app.listen(4000, () => {
    console.log("http://localhost:4000");
});

app.post("/api/report", (req, res) => {
    const { lat, lng, description } = req.body;

    console.log("New Pet:", lat, lng, description);

    res.json({ status: "ok"});
});

app.get("/api/real-places", async(req, res) => {
    const query =
    `[out:json];
    (
    node["amenity"="veterinary"](around:5000, -7.1617, -78.5128);
    node["amenity"="animal_shelter"](around:5000, -7.1617, -78.5128);
    node["amenity"="police"](around:5000, -7.1617, -78.5128);
    node["amenity"="fire_station"](around:5000, -7.1617, -78.5128);
    node["amenity"="hospital"](around:5000, -7.1617, -78.5128);
    );
    out;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
    });

    const data = await response.json();

    const places = data.elements.map(el => ({
    name: el.tags.name || "Sin nombre",
    lat: el.lat,
    lng: el.lon,
    type: el.tags.amenity
    }));

    res.json(places);

});

app.get("/api/search", async (req, res) => {
    const q = req.query.q;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json`;
    const response = await fetch(url, {
        headers: {
            "User-Agent": "PetWatchApp/1.0"
        }
    });

    const data = await response.json();

    res.json(data);
});

app.get("/api/news", async(req, res) => {
    const response = await fetch("https://gnews.io/api/v4/search?q=animales&lang=es&token=TU_API_KEY");
    const data = await response.json();

    res.json(data.articles);
});

app.get("/api/real-places", async (req, res) => {
    try {
        const query = `
        [out:json];
        (
          node["amenity"="veterinary"](around:5000,-7.1617,-78.5128);
          node["amenity"="animal_shelter"](around:5000,-7.1617,-78.5128);
          node["amenity"="police"](around:5000,-7.1617,-78.5128);
          node["amenity"="fire_station"](around:5000,-7.1617,-78.5128);
          node["amenity"="hospital"](around:5000,-7.1617,-78.5128);
        );
        out;   
        `;

        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query
        });

        const data = data.elements.map(el => ({
            name: el.tags.name || "Sin nombre",
            lat: el.lat,
            lng: el.lon,
            type: el.tags.amenity
        }));

        res.json(places);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error gotten from real places"});
    }

});