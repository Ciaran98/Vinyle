const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
app = express();
app.use(serveStatic(path.join(__dirname, "dist")));
const port = process.env.PORT || 8080;
app.listen(port);

const mongoose = require("mongoose");
const conf = require("./src/config");
const mongoPass = process.env.MONGO_PASS || conf.MongoPass;
const uri = `mongodb+srv://VinyleDatabase:${mongoPass}@vinylecluster.ommzx.mongodb.net/?retryWrites=true&w=majority`;
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
mongoose.connect(uri);
const Album = mongoose.model("Album", {
  name: String,
  runDate: Number,
  albumIndex: Number,
});

// Route to get today's vinyle album
app.get("/getToday", async (req, res) => {
  let dateToday = new Date().setHours(0, 0, 0, 0);
  try {
    const data = await Album.findOne({ runDate: dateToday });
    res.send({
      name: data.name,
    });
  } catch (err) {
    console.error(err);
  }
});
// Route to get a vinyle album from a specific date
app.get("/getVinyleFromDate", async (req, res) => {
  let dateSelected = req.query.time;
  try {
    const data = await Album.findOne({ runDate: dateSelected });
    res.send({
      name: data.name,
    });
  } catch (err) {
    console.error(err);
  }
});
// Route - Add new album to database
app.post("/postNewAlbum", (req, res) => {
  const newAlbum = new Album({
    name: req.body.name,
    runDate: req.body.runDate,
    albumIndex: req.body.albumIndex,
  });
  newAlbum.save().then(() => console.log("Record Saved"));

  res.send("True");
});
