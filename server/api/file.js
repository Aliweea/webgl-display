const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const util = require('../public/js/util')

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

router.post('/file/upload', upload.single('file'), (req, res, next) => {
  // console.log(req.body.directory)
  // console.log(req.file)
  let filepath = upload_dir + req.body.directory + '/' + req.file.filename
  res.json({
    center: util.findCenter(filepath),
    success: true
  })
})

router.get('/file/index', (req, res, next) => {
  try {
    let myDir = req.query.dir
    let files = fs.readdirSync(upload_dir + myDir)
    // console.log(req.query.dir)
    // console.log(files)
    let models = []
    for (var i = 0; i < files.length; i++) {
      let filepath = upload_dir + myDir + '/' + files[i]
      // console.log(filepath)
      console.log(util.findCenter(filepath))
      models.push({
        name: files[i],
        center: util.findCenter(filepath)
      })
    }
    res.json({
      models: models,
      success: true,
      msg: ''
    })
  } catch (err) {
    // handle the error
    res.json({
      models: null,
      success: false,
      msg: err.msg
    })
  }
})

router.get('/file/delete', (req, res, next) => {
  // console.log(req.query)
  try {
    let dir = req.query.dir
    let file = req.query.file
    let path = upload_dir + dir + '/' + file
    // console.log(path)
    fs.unlinkSync(path)
    res.json({
      success: true,
      msg: "文件" + file + "删除成功"
    })
  } catch (err) {
    res.json({
      success: false,
      msg: err.message
    })
  }
})

module.exports = router
