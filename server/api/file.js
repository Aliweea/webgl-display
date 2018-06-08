const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const util = require('../public/js/util')

const objDir = 'server/public/obj/'
const mtlDir = 'server/public/mtl'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = file.originalname.split('.')[1]
    if (type === 'obj') {
      cb(null, objDir + req.body.directory + '/')
    } else {
      cb(null, mtlDir + req.body.directory + '/')
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

router.post('/file/upload', upload.single('file'), (req, res, next) => {
  try {
    let myDir = req.body.directory
    let filename = req.file.filename.split('.')[0]
    let mtlPath = mtlDir + myDir + '/' + filename + '.mtl'
    res.json({
      hasMtl: util.isFileExist(mtlPath),
      success: true
    })
  } catch (err) {
    console.log(err.message)
  }
})

router.get('/file/index', (req, res, next) => {
  try {
    let myDir = req.query.dir
    let files = fs.readdirSync(objDir + myDir)
    // console.log(files)
    let models = []
    for (let i = 0; i < files.length; i++) {
      let filename = files[i].split('.')[0]
      let mtlPath = mtlDir + myDir + '/' + filename + '.mtl'
      let hasMtl = util.isFileExist(mtlPath)
      // console.log(hasMtl)
      models.push({
        name: filename,
        hasMtl: hasMtl
      })
    }
    res.json({
      models: models,
      success: true,
      msg: ''
    })
  } catch (err) {
    // handle the error
    console.log(err.message)
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
    let name = req.query.name
    let objPath = objDir + dir + '/' + name + '.obj'
    let mtlPath = mtlDir + dir + '/' + name + '.mtl'
    // console.log(objPath)
    if (util.isFileExist(objPath)) {
      fs.unlinkSync(objPath)
    }
    if (util.isFileExist(mtlPath)) {
      fs.unlinkSync(mtlPath)
    }
    res.json({
      success: true,
      msg: "模型" + name + "删除成功"
    })
  } catch (err) {
    console.log(err.message)
    res.json({
      success: false,
      msg: err.message
    })
  }
})

module.exports = router
