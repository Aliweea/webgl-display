const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const async = require('async')

const util = require('../public/js/util')
const db = require('../public/js/db')

const objDir = 'server/public/obj/'
const mtlDir = 'server/public/mtl'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = file.originalname.split('.')[1]
    if (type === 'obj') {
      cb(null, objDir + req.body.pname + '/')
    } else {
      cb(null, mtlDir + req.body.pname + '/')
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

router.get('/model/index', (req, res, next) => {
  console.log('/model/index')
  const querySql = 'SELECT * FROM model WHERE pname=? ORDER BY sequence'
  let pname = req.query.pname
  db.connection.query(querySql, [pname], function (err, result) {
    if(err){
      return res.json({
        models: null,
        success: false,
        msg: '[SELECT ERROR] - ' + err.message
      })
    }
    return res.json({
      models: result,
      success: true,
      msg: ''
    })
  })
})

router.post('/model/upload', upload.single('file'), (req, res, next) => {
  console.log('/model/upload')

  const queryCount = 'SELECT COUNT(*) FROM model WHERE pname=?'
  const insertSql = 'INSERT INTO model(name,hasMtl,sequence,pname) VALUES (?,?,?,?)'
  const updateSql = 'UPDATE model SET hasMtl=1 WHERE name=?'
  const querySql = 'SELECT * FROM model WHERE name=?'

  // console.log(req.body)
  let projectName = req.body.pname
  let modelName = req.file.filename.split('.')[0]
  let filetype = req.file.filename.split('.')[1]
  let model = null

  if (filetype === 'obj') {
    async.waterfall([
      function (callback) {
        // 获取order
        db.connection.query(queryCount, [projectName], function (err, result) {
          if(err){
            callback(err)
          }
          console.log(result)
          callback(null, result[0]['COUNT(*)'])
        })
      },
      function (count, callback) {
        // 判断是否存在对应的mtl文件
        try {
          let mtlPath = mtlDir + projectName + '/' + modelName + '.mtl'
          let hasMtl = util.isFileExist(mtlPath)
          // 插入数据
          var sqlParams = [modelName, hasMtl, count, projectName]
          db.connection.query(insertSql, sqlParams, function (err, result) {
            if(err){
              throw err
            }
            // console.log(result)
            callback(null)
          })
        } catch (err) {
          callback(err)
        }
      },
      function (callback) {
        db.connection.query(querySql, [modelName], function (err, result) {
          if(err){
            callback(err)
          }
          console.log(result)
          model = result[0]
          return res.json({
            success: true,
            msg: "文件上传成功",
            model: model
          })
        })
      },
      function (err, result) {
        if (err) {
          return res.json({
            success: false,
            msg: err.message,
            model: model
          })
        }
      }
    ])
  } else if (filetype === 'mtl') {
    // 检查之前是否已经上传obj文件
    db.connection.query(updateSql, [modelName], function (err, result) {
      if(err){
        return res.json({
          success: false,
          msg: '[UPDATE ERROR] - ' + err.message,
          model: model
        })
      }
      console.log(result)
      db.connection.query(querySql, [modelName], function (err, result) {
        if(err){
          return res.json({
            success: false,
            msg: '[SELECT ERROR] - ' + err.message,
            model: model
          })
        }
        console.log(result)
        model = result[0]
        return res.json({
          success: true,
          msg: "文件上传成功",
          model: model
        })
      })
    })
  }
})

router.post('/model/delete', (req, res, next) => {
  console.log('/model/delete')
  const deleteSql = 'DELETE FROM model WHERE id=?'
  console.log(req.body)
  let id = req.body.id
  let pname = req.body.pname
  let name = req.body.name
  async.waterfall([
    function (callback) {
      db.connection.query(deleteSql, [id], function (err, result) {
        if(err){
          return res.json({
            success: false,
            msg: '[UPDATE ERROR] - ' + err.message
          })
        }
        // console.log(result)
        callback(null)
      })
    },
    function (model, callback) {
      let objPath = objDir + pname + '/' + name + '.obj'
      let mtlPath = mtlDir + pname + '/' + name + '.mtl'
      // console.log(objPath)
      if (util.isFileExist(objPath)) {
        console.log('delete ' + objPath)
        fs.unlinkSync(objPath)
      }
      if (util.isFileExist(mtlPath)) {
        conosle.log('delete ' + mtlPath)
        fs.unlinkSync(mtlPath)
      }
      return res.json({
        success: true,
        msg: "模型" + name + "删除成功"
      })
      callback(null)
    }
  ]),
  function (err, result) {
    if (err) {
      res.json({
        success: false,
        msg: err.message
      })
    }
  }
})

router.post('/model/order', (req, res, next) => {
  console.log('/model/order')
  const updateSql = 'UPDATE model SET sequence=? WHERE id=?'
  // console.log(req.body)
  var orders = req.body.orders
  async.eachSeries(orders, function (order, callback) {
    var sqlParams = [order.order, order.id]
    db.connection.query(updateSql, sqlParams, function (err, result) {
      if(err){
        console.log('[UPDATE ERROR] - ' + err.message)
        callback(err)
      }
      // console.log(result)
      callback(null)
    })
  }, function (err) {
    if(err){
      return res.json({
        success: false,
        msg: '[UPDATE ERROR] - ' + err.message
      })
    } else {
      return res.json({
        success: true,
        msg: '模型重排成功'
      })
    }
  })
})

module.exports = router
