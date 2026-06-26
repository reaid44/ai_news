import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "Running",
        message: "Trading News Backend v0.01"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
