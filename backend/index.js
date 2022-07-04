const express = require('express');
const port = 3000;
const fs = require('fs')
const app = express();
const mongoose = require('mongoose')
const conf = require('../backend/config.json')
const jimp = require('jimp');
const uri = `mongodb+srv://VinyleDatabase:${conf.MongoPass}@vinylecluster.ommzx.mongodb.net/?retryWrites=true&w=majority`;
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'30mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use("/albums",express.static('public'));
const cors = require('cors');
app.use(cors());
mongoose.connect(uri);
const Album = mongoose.model('Album',{
    name:String,
    hints:[],
    albumArt:String,
    startDate:Number,
    endDate:Number
})

// Route - Get Random Album
app.get('/getRandom', async (req,res)=>{
    let date = Date.now();
    const data = await Album.findOne({$and: [{startDate:{$lte:date}},{endDate:{$gte:date}}]});
    res.send({
        image:data.albumArt,
        name:data.name,
        hints:data.hints
    });

});
// Route - Add new album to database
app.post('/postNewAlbum',(req,res)=>{
    const newAlbum = new Album({
        "name":req.body.name,
        "hints":[req.body.hints[0],
        req.body.hints[1],
        req.body.hints[2],
        req.body.hints[3]
        ],
        "albumArt":req.body.albumArt,
        "startDate":req.body.startDate,
        "endDate":req.body.endDate
    });
    newAlbum.save().then(() =>
        console.log('Record Saved')
    );
    
    res.send('True');
})
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
});
