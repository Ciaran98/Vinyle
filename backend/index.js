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
const cors = require('cors');
app.use(cors());
mongoose.connect(uri);
const Album = mongoose.model('Album',{
    name:String,
    hints:[],
    albumArt:Buffer
})

// Route - Get Random Album
app.get('/getRandom', async (req,res)=>{
    const data = await Album.findOne();
    jimp.read(data.albumArt).then(image =>{
        image.getBuffer(jimp.MIME_BMP,(err,imgBuffer)=>{
            res.send({
                image:imgBuffer,
                name:data.name,
                hints:[data.hints]
            });
        })
        
    });


});

// Route - Add new album to database
app.post('/postNewAlbum',(req,res)=>{
    
    let img = fs.readFileSync('C:/Users/ciara/Desktop/image.jpg',);
    const newAlbum = new Album({
        "name":req.body.name,
        "hints":[req.body.hints[0],
        req.body.hints[1],
        req.body.hints[2],
        req.body.hints[3]
        ],
        "albumArt":img
    });
    console.log(req.body.hints)
    newAlbum.save().then(() =>
    console.log('Record Saved'));
    
    res.send('True');
})
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
});
