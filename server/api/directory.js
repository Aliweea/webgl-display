const express = require('express')
const router = express.Router()
const fs = require('fs')
const async = require('async')

const db = require('../public/js/db')

const obj_dir = 'server/public/obj/'
const mtl_dir = 'server/public/mtl/'

router.get('/project/index', (req, res, next) => {
  console.log('project/index')
  const querySql = 'SELECT * FROM project'
  db.connection.query(querySql, function (err, result) {
    if(err){
      return res.json({
        projects: null,
        success: false,
        msg: '[SELECT ERROR] - ' + err.message
      })
    }
    return res.json({
      projects: result,
      success: true,
      msg: ''
    })
  })
})

router.post('/project/create', (req, res, next) => {
  console.log('project/create')
  const addSql = 'INSERT INTO project(name,description) VALUES(?,?)';
  const querySql = 'SELECT * From project WHERE name=?'

  console.log(req.body)
  let name = req.body.name
  let description = req.body.description

  try {
    if (!fs.existsSync(obj_dir + name)) {
      fs.mkdirSync(obj_dir + name)
    }
    if (!fs.existsSync(mtl_dir + name)) {
      fs.mkdirSync(mtl_dir + name)
    }
  } catch (err) {
    console.log(err.message)
    return res.json({
      success: false,
      msg: err.message,
      project: null
    })
  }

  db.connection.query(addSql, [name, description], function (err, result) {
    if(err){
      console.log(err.message)
      return res.json({
        success: false,
        msg: '[INSERT ERROR] - ' + err.message,
        project: null
      })
    }
    db.connection.query(querySql, [name], function (err, result) {
      if(err){
        console.log(err.message)
        return res.json({
          success: false,
          msg: '[SELECT ERROR] - ' + err.message,
          project: null
        })
      }
      return res.json({
        success: true,
        msg: "项目" + result[0].name + "创建成功",
        project: result[0]
      })
    })
  })
})

router.post('/project/edit', (req, res, next) => {
  console.log('project/edit')
  const updateSql = 'UPDATE project SET name=?, description=? WHERE id=?'

  console.log(req.body)
  let id = req.body.id
  let oldName = req.body.oldName
  let newName = req.body.newName
  let newDesc = req.body.newDesc

  let sqlParams = [newName, newDesc, id]
  db.connection.query(updateSql, sqlParams, function (err, result) {
    if(err){
      return res.json({
        success: false,
        msg: '[UPDATE ERROR] - ' + err.message
      })
    }
    try {
      if (oldName !== newName) {
        fs.renameSync(obj_dir + oldName, obj_dir + newName)
        fs.renameSync(mtl_dir + oldName, mtl_dir + newName)
      }
      return res.json({
        success: true,
        msg: "项目" + oldName + "编辑成功"
      })
    } catch (err) {
      console.log(err)
      return res.json({
        success: false,
        msg: err.message
      })
    }
  })
})

router.post('/project/delete', (req, res, next) => {
  console.log('/project/delete')
  // console.log(req.body)
  const deleteSql = 'DELETE FROM project WHERE id=?'
  let id = req.body.id
  let name = req.body.name

  db.connection.query(deleteSql, [id], function (err, result) {
    if(err){
      return res.json({
        success: false,
        msg: '[DELETE ERROR] - ' + err.message
      })
    }
    try {
      deleteFolder(obj_dir + name)
      deleteFolder(mtl_dir + name)
      return res.json({
        success: true,
        msg: "项目" + name + "删除成功"
      })
    } catch (err) {
      return res.json({
        success: false,
        msg: err.message
      })
    }
  })
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
