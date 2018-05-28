<template>
  <el-container>
    <el-header style="text-align: center">
      <span class="list-title">项目目录</span>
      <el-button type="primary" round
        icon="el-icon-plus"
        @click="addNew">
        新建项目
      </el-button>
    </el-header>

    <el-main>
      <div class="list-box-center">
        <div class="list-item"
          v-for="(item, index) in projects"
          :data-id="index"
          :key="item.name">
          <router-link tag="span"
            :to="'/project/'+ item.name"
          >{{item.name}}</router-link>
          <a :data="item" @click="deleteProj(index)">x</a>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'ProjectList',
  data () {
    return {
      projects: []
    }
  },
  methods: {
    validateInput (input) {
      // 检查是否重名
      for (var i in this.projects) {
        if (input === this.projects[i].name) {
          return '项目名重复，请重新输入'
        }
      }
      return true
    },
    addNew () {
      this.$prompt('请输入项目名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: '项目' + (this.projects.length + 1),
        inputValidator: this.validateInput,
        inputErrorMessage: '项目名重复，请重新输入!'
      }).then(({ value }) => {
        this.projects.push({
          name: value
        })
        // 在服务器创建一个文件夹
        let self = this
        self.axios.get('/project/create', {
          params: {
            dir: value
          }
        }).then(function (res) {
          console.log(res.data)
          let data = res.data
          if (data.success) {
            self.$message.success(data.msg)
          } else {
            self.$message.warning(data.msg)
          }
        }).catch(function (err) {
          console.log(err)
        })
      }).catch(() => {
        this.$message.info('取消输入')
      })
    },
    deleteProj (index) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 在服务器将对应文件夹删除
        let self = this
        self.axios.get('/project/delete', {
          params: {
            dir: self.projects[index].name
          }
        }).then(function (res) {
          console.log(res.data)
          let data = res.data
          if (data.success) {
            self.projects.splice(index, 1)
            self.$message.success(data.msg)
          } else {
            self.$message.warning(data.msg)
          }
        }).catch(function (err) {
          console.log(err.msg)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  },
  created () {
    let self = this
    self.axios.get('/project/index')
      .then(function (res) {
        console.log(res.data)
        let data = res.data
        if (data.success) {
          let dirList = data.dirs
          for (let i = 0; i < dirList.length; i++) {
            self.projects.push({
              id: self.projects.length,
              name: dirList[i]
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
.list-box-left{
  float: left;
  width: 70%;
}
.list-box-center{
  margin-left: 15%;
  margin-right: 15%;
}
.list-box-right{
  float: right;
  width: 70%;
}
.list-title{
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.list-item{
  border: 1px solid #ddd;
  padding:10px;
  margin-bottom: 20px;
  transition: border .3s;
}
.list-item:hover{
  border: 1px solid #20a0ff;
}
</style>
