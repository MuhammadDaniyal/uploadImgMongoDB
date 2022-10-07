require('./db/connect')  // require & connect with database
const express = require('express')
const multer = require('multer')
const app = express()
const path = require('path')
const fs = require('fs')
const User = require('./models/imgModel')
const cors = require('cors');
const bodyParser = require('body-parser')
const port = process.env.PORT || '8000'

app.use(cors())
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())

app.use(express.json())

// storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads') // img ky save hona ki destination btae hy folder ma
    },
    // particular img ka  file name kya hoga yeh define krrhy
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// configure multer use storage engine
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) { // check the file its image or not
        checkFileType(file, cb)
    }
})


// check file type - extension also mimetype because extension name easily rename hoka upload hojati islya check krrha
function checkFileType(file, cb) {
    // Allowed extension
    const filetype = /jpeg|jpg|png|gif/
    // check extension
    const extName = filetype.test(path.extname(file.originalname).toLowerCase())
    // check mimetype -> "image/jpg" "application/json"
    const mimetype = filetype.test(file.mimetype)

    if (extName && mimetype) {
        return cb(null, true)
    } else {
        return cb("Error: upload images only")
    }

}

// multer middleware upload image configure
app.post('/upload', upload.single('testImg'), async (req, res) => {
    try {
        if(!req.file){
            res.send('Error: select the image')
        } else{

            const imgDoc = User({
                name: req.body.name,
                img: {
                    data: fs.readFileSync('./uploads/' + req.file.filename),
                    contentType: 'image/*'
                }
            })
            await imgDoc.save()
            // console.log(req.file);
            res.send('image save')
        }
    } catch (error) {
        console.log(error);
        res.json({ error })
    }
})

app.get('/getimg', async (req, res) => {
    try {
        const response = await User.find()
        res.json(response)
    } catch (error) {
        res.json({error})
    }
})
app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`Server Listen at ${8000}`);
})