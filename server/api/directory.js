const express = require('express')
const router = express.Router()
const fs = require('fs')

const upload_dir = 'server/public/obj/'

router.get('/project/index', (req, res, next) => {
  try {
    let dirs = []
    const files = fs.readdirSync(upload_dir)
    files.forEach(function (item, index) {
        let stat = fs.lstatSync(upload_dir + item)
        if (stat.isDirectory() === true) {
          dirs.push(item)
        }
    })
    res.json({
      dirs: dirs,
      success: true,
      msg: ''
    })
  } catch (err) {
    // handle the error
    res.json({
      dirs: null,
      success: false,
      msg: err.msg
    })
  }
})

router.get('/project/create', (req, res, next) => {
  // console.log(req.query)
  try {
    let newDir = req.query.dir
    fs.mkdirSync(upload_dir + newDir)
    res.json({
      success: true,
      msg: "项目" + newDir + "创建成功"
    })
  } catch (err) {
    res.json({
      success: false,
      msg: err.msg
    })
  }
})

router.get('/project/delete', (req, res, next) => {
  // console.log(req.query)
  try {
    let deletedDir = req.query.dir
    let path = upload_dir + deletedDir
    deleteFolder(path)
    res.json({
      success: true,
      msg: "项目" + deletedDir + "删除成功"
    })
  } catch (err) {
    res.json({
      success: false,
      msg: err.msg
    })
  }
})

function deleteFolder (path) {
  var files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
      var curPath = path + "/" + file
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    });
    fs.rmdirSync(path)
  }
}

module.exports = router
