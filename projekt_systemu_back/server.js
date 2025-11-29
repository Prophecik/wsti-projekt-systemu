import express from "express";
import cors from "cors";
import "dotenv/config";

import ticketsRouter from "./routes/tickets.js";
import { startImap } from "./imap/imapService.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketsRouter);

app.get("/", (req, res) => {
    res.send("Backend działa");
});

app.listen(3000, () => {
    console.log("Server działa na porcie 3000");
});


startImap();
