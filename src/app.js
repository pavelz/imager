var express = require("express");
var cors = require("cors");
var formidable = require("formidable");
var fs = require("fs");
var im = require("imagemagick-stream");

var app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send("Image Converter")
});

app.post('/convert', (req, res) => {

    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => {
        let ff = files.file.path;
        const read = fs.createReadStream(ff);
        const write = fs.createWriteStream(ff + '.' + fields.fileType);
        let conv = im().outputFormat(fields.fileType);
        read.pipe(conv).pipe(write);

        write.on('finish', () => {
            const rr = fs.readFileSync(ff + '.' + fields.fileType);
            res.set('content-type', 'image/' + fields.fileType);
            res.type(fields.fileType);
            res.end(rr, 'binary');
        })
    });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
