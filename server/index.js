import express from "express";
import multer from "multer";
import csv from "fast-csv";
import cors from "cors";
import fs from "fs";
import ExcelJs from "exceljs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import exp from "constants";

const server = express();
const port = process?.env?.PORT || 8080;
const multerUpload = multer({ dest: "/temp" });

server.use(cors());
server.use(express.static("public"));

server.get("/", (_, res) => res.status(200).send({ hello: "there" }));

server.post("/upload", multerUpload.single("file"), (req, res) => {
  const fileRows = [];
  let genderData = { Male: 0, Female: 0, Others: 0 };
  csv
    .parseFile(req?.file?.path)
    .on("data", function (row) {
      if (Object.values(row).every((x) => x !== null && x !== "")) {
        fileRows.push(row);
        if (row[2]) {
          genderData[row[2]]++;
        }
      }
    })
    .on("end", async () => {
      fs.unlinkSync(req.file.path);
      const doc = new ExcelJs.Workbook();
      const sheet = doc.addWorksheet("xena_nodejs_task");
      sheet.columns = [
        { header: "Sl", key: "id", width: 10 },
        ...fileRows[0].map((row) => ({
          header: row,
          key: row,
          width: 10,
        })),
      ];
      fileRows.forEach((item, index) => {
        sheet.addRow({ id: index + 1, ...item });
      });
      await doc.xlsx.writeFile("./public/sheet.xlsx");

      // Image
      const canvas = new ChartJSNodeCanvas({
        width: 400,
        height: 400,
      });
      const configuration = {
        type: "pie",
        data: {
          labels: Object.keys(genderData),
          datasets: [{ data: Object.values(genderData) }],
        },
        options: {},
        plugins: [],
      };
      const image = await canvas.renderToBuffer(configuration);
      fs.writeFileSync("./public/chart.png", image);
      res.status(200).send({
        sheet: "http://localhost:8080/sheet.xlsx",
        chart: "http://localhost:8080/chart.png",
      });
    });
});

server.listen(port, () => {
  try {
    return console.log(`Server is listening on ${port}`);
  } catch (error) {
    return console.error(error);
  }
});
