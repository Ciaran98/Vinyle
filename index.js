const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
app = express();
app.use("/", serveStatic(path.join(__dirname, "/dist")));

const port = process.env.PORT || 3000;
app.listen(port);

const mongoose = require("mongoose");
//const conf = require("./src/config");
//const mongoPass = conf.MONGO_PASS;
const mongoPass = process.env.MONGO_PASS;
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

// Route to get a vinyle album from a specific date
app.get("/getVinyleFromDate", async (req, res) => {
  let dateSelected = req.query.time;
  try {
    const data = await Album.findOne({ runDate: dateSelected });
    res.send({
      name: data.name,
      albumIndex: data.albumIndex,
    });
  } catch (err) {
    res.send({
      name: "The Gods We Can Touch",
      albumIndex:1
    });
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
