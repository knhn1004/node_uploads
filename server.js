const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

const app = express()

// set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})
// init upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  },
}).single('myImage')

// check file type
function checkFileType(file, cb) {
  // allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // check mimetype
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Error: file type not supported')
  }
}

// ejs
app.set('view engine', 'ejs')

// static
app.use(express.static('./public'))

const PORT = 3000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err)
      return res.render('index', {
        msg: err,
      })
    if (!req.file)
      return res.render('index', {
        msg: 'Error: no file selected',
      })
    res.render('index', {
      msg: 'File Uploaded!',
      file: `/uploads/${req.file.filename}`,
    })
    // the file name that you can store in database
    // req.file
  })
})
