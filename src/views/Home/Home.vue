<template>
  <div class="container">
    <div class="header">
      <span class="title">项目目录</span>
    </div>

    <div class="body">
      <el-button class="header-button" @click="dialogFormVisible = true">新建项目</el-button>

      <el-table class="table" :data="projects" stripe>
        <el-table-column prop="name" label="名称" width="180">
          <template slot-scope="{row, $index}">
            <div v-show="!row.editable">{{row.name}}</div>
            <el-input v-show="row.editable" v-model='row.name'></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="350">
          <template slot-scope="{row, $index}">
            <div v-show="!row.editable">{{row.description}}</div>
            <el-input v-show="row.editable" v-model='row.description'></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="{row, $index}">
            <router-link :to="'/project/'+ row.name">
              <el-button type="text" size="middle"> 查看 </el-button>
            </router-link>
            <el-button
              class="button"
              v-show="!row.editable"
              @click.native.prevent="editProject($index)"
              type="text" size="middle">修改
            </el-button>
            <el-button
              class="button"
              v-show="row.editable"
              @click.native.prevent="editComfirm($index, row)"
              type="text" size="middle">保存
            </el-button>
            <el-button
              class="button"
              @click.native.prevent="deleteProject($index)"
              type="text" size="middle">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Form -->
    <el-dialog
      title="创建项目"
      :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          class="form-item"
          label="项目名称"
          :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
          <div class="message-errormsg">{{form.name_err}}</div>
        </el-form-item>
        <el-form-item
          class="form-item"
          label="项目描述"
          :label-width="formLabelWidth">
          <textarea rows="5" v-model="form.description"></textarea>
          <div class="message-errormsg">{{form.desc_err}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const NAME_LEN = 100
const DESC_LEN = 500

export default {
  name: 'ProjectList',
  data () {
    return {
      projects: [],
      dialogFormVisible: false,
      form: {
        name: '',
        name_err: '',
        description: '',
        desc_err: ''
      },
      formLabelWidth: '80px',
      oldName: '',
      oldDesc: ''
    }
  },
  watch: {
    'form.name': 'checkName',
    'form.description': 'checkDesc'
  },
  methods: {
    checkName () {
      // console.log('check name')
      let input = this.form.name
      // 检查是否为空
      if (input === '') {
        this.form.name_err = '项目名不能为空'
        return
      }
      // 检查长度是否超限
      if (input.length > NAME_LEN) {
        this.form.name_err = '长度不能超过' + NAME_LEN
        return
      }
      // 检查是否重名
      for (var i in this.projects) {
        if (input === this.projects[i].name) {
          this.form.name_err = '项目名重复，请重新输入'
          return
        }
      }
      this.form.name_err = ''
    },
    checkDesc () {
      // console.log('check description')
      // 检查长度是否超限
      if (this.form.description.length > DESC_LEN) {
        this.form.desc_err = '长度不能超过' + DESC_LEN
        return
      }
      this.form.desc_err = ''
    },
    addProject () {
      // 检查error
      if (this.form.name_err !== '' || this.form.desc_err !== '') {
        return
      }
      if (this.form.name === '') {
        this.$message.error('项目名不能为空')
        return
      }

      const self = this
      // 在服务器创建一个文件夹，并把数据插入数据库
      self.axios.post('/project/create', {
        name: self.form.name,
        description: self.form.description
      }).then(function (res) {
        // console.log(res.data)
        let data = res.data
        if (data.success) {
          // self.$message.success(data.msg)
          self.projects.push({
            id: data.project.id,
            name: data.project.name,
            description: data.project.description
          })
          self.hideDialog()
        } else {
          self.$message.error(data.msg)
        }
      }).catch(function (err) {
        self.$message.error(err)
      })
    },
    hideDialog () {
      this.dialogFormVisible = false
      this.form.name = ''
      this.form.name_err = ''
      this.form.description = ''
      this.form.desc_err = ''
    },
    editProject (index) {
      this.oldName = this.projects[index].name
      this.oldDesc = this.projects[index].description
      this.projects[index].editable = true
    },
    editComfirm (index, row) {
      // 检查是否有改变
      if (this.oldName === row.name && this.oldDesc === row.description) {
        console.log('未修改')
        this.projects[index].editable = false
        return
      }

      let self = this
      self.axios.post('/project/edit', {
        id: self.projects[index].id,
        oldName: self.oldName,
        newName: row.name,
        newDesc: row.description
      }).then(function (res) {
        // console.log(res.data)
        let data = res.data
        if (data.success) {
          self.$message.success(data.msg)
          self.projects[index].editable = false
        } else {
          self.$message.warning(data.msg)
        }
      }).catch(function (err) {
        this.$message.error(err.message)
      })
    },
    deleteProject (index) {
      let self = this
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 在服务器将对应文件夹删除
        self.axios.post('/project/delete', {
          id: self.projects[index].id,
          name: self.projects[index].name
        }).then(function (res) {
          // console.log(res.data)
          let data = res.data
          if (data.success) {
            self.projects.splice(index, 1)
            self.$message.success(data.msg)
          } else {
            self.$message.warning(data.msg)
          }
        }).catch(function (err) {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  },
  mounted () {
    let self = this
    self.axios.get('/project/index')
      .then(function (res) {
        // console.log(res.data)
        // data里有success, msg, projects
        let data = res.data
        if (data.success) {
          let projectList = data.projects
          for (let i = 0; i < projectList.length; i++) {
            self.projects.push({
              id: projectList[i].id,
              name: projectList[i].name,
              description: projectList[i].description,
              editable: false
            })
          }
        } else {
          self.$message.warning(data.msg)
        }
      })
      .catch(function (err) {
        console.log(err)
      })
  }
}
</script>

<style scoped>
.container {
  text-align: center;
  margin: auto;
  padding: 0px 0px 30px 0px;
  background-color: #f3d7b5;
  width: 800px;
  min-height: 640px;
}
.header{
  text-align: center;
  padding: 15px;
}
.header-button{
  float: right;
  margin: 10px 0px;
}
.title{
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.body {
  margin: auto;
  width: 90%;
}
.button {
  margin: 10px 0px;
}
.table {
  text-align: left;
  margin: auto;
  min-height: 500px;
}
.form-item{
  margin-bottom: 0px;
}
.message-errormsg {
  color: #f56c6c;
  min-height: 40px;
  font-size: 14px;
  margin-top: 2px;
}
textarea {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
</style>
