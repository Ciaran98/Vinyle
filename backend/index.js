const express = require("express");
const port = 3000;
const app = express();
const mongoose = require("mongoose");
const conf = require("../backend/config.json");
const uri = `mongodb+srv://VinyleDatabase:${conf.MongoPass}@vinylecluster.ommzx.mongodb.net/?retryWrites=true&w=majority`;
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/albums", express.static("public"));
const cors = require("cors");
app.use(cors());
mongoose.connect(uri);
const Album = mongoose.model("Album", {
  name: String,
  albumArt: String,
  runDate: Number,
});

// Route - Get Random Album
app.get("/getToday", async (req, res) => {
  let dateToday = new Date().setHours(0, 0, 0, 0);
  try {
    const data = await Album.findOne({ runDate: dateToday });
    res.send({
      image: data.albumArt,
      name: data.name,
    });
  } catch (err) {
    console.error(err);
  }
});
app.get("/getVinyleFromDate", async (req, res) => {
  let dateSelected = req.query.time;
  try {
    const data = await Album.findOne({ runDate: dateSelected });
    res.send({
      image: data.albumArt,
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
    albumArt: req.body.albumArt,
    runDate: req.body.runDate,
  });
  newAlbum.save().then(() => console.log("Record Saved"));

  res.send("True");
});
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
