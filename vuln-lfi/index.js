import express from "express";
import * as fs from "fs";
import cors from "cors";

const app = express();

app.use(express.static("public"));

app.use(cors());

app.get("/view", (req, res) => {
  const file = req.query.book;
  fs.readFile(`./books/${file}`, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error lah");
    return res.send(data);
  });
});

app.listen(5000, "0.0.0.0", () =>
  console.log(`Server started on http://localhost:5000`)
);
