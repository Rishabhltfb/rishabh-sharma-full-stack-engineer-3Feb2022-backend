import express from "express";

const app = express();
const port = 5100;

app.get("/", (req, res) => {
    res.send("Hey Rishabh");
});

app.listen(port, () => console.log(`Server listening at port ${port}`));
