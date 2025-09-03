import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});