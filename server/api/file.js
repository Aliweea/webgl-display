const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')

const upload_dir = 'server/public/obj/'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_dir + req.body.directory + '/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

router.get('/file/index', (req, res, next) => {
  try {
    let myDir = req.query.dir
    const files = fs.readdirSync(upload_dir + myDir)
    res.json({
      files: files,
      success: true,
      msg: ''
    })
  } catch (err) {
    // handle the error
    res.json({
      files: null,
      success: false,
      msg: err.msg
    })
  }
})

router.post('/file/upload', upload.single('file'), (req, res, next) => {
  console.log(req.body.directory)
  console.log(req.file)
  res.json({
    success: true
  })
})

router.get('/file/delete', (req, res, next) => {
  try {
    let dir = req.query.dir
    let file = req.query.file
    let path = upload_dir + deletedDir + '/' + file
    fs.unlinkSync(path)
    res.json({
      success: true,
      msg: "文件" + file + "删除成功"
    })
  } catch (err) {
    res.json({
      success: false,
      msg: err.msg
    })
  }
})

module.exports = router
