
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, '../dataAPI.json'); // ← ton fichier

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); // Allow specific HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow specific headers
  next();
});

function readData() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.get("/api/periods", (req, res) => {
  const data = readData();
  const periods = data.periods.map(period =>({
    year: period.year,
    unit: period.unit,
    total_of_subscribers: period.total_of_subscribers,
    subscribers_unit: period.subscribers_unit,
    market_share: period.market_share
  }));
  res.json(periods);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { app };