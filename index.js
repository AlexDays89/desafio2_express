import express from "express";
import dotenv from "dotenv";
import fs from "fs";

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.post("/canciones", (req, res) => {
    const { titulo, artista, tono } = req.body;
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const id = canciones.length + 1;
    const nuevaCancion = { id, titulo, artista, tono };
    canciones.push(nuevaCancion);
    fs.writeFileSync("canciones.json", JSON.stringify(canciones));
    res.send(nuevaCancion);
});

app.get("/canciones", (req, res) => {
    fs.readFile("repertorio.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al leer el archivo");
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const index = canciones.findIndex((c) => c.id == id);
    if (index == -1) {
        res.status(404).send("Canción no encontrada");
    } else {
        canciones[index] = { id, titulo, artista, tono };
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
        res.send(canciones[index]);
    }
});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const index = canciones.findIndex((c) => c.id == id);
    if (index == -1) {
        res.status(404).send("Canción no encontrada");
    } else {
        canciones.splice(index, 1);
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
        res.send("Canción eliminada");
    }
});
