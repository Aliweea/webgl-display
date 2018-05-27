<template>
  <el-menu :default-openeds="['1']">
    <el-submenu index="1">
      <template slot="title"><i class="el-icon-document"></i>文件列表</template>
      <el-menu-item
        v-for="(file, index) in files"
        :index="file.name"
        :key="file.id"
        draggable="true"
        v-dragging="{ item: file, list: files, group: 'file' }">
        <a>
          <span>{{file.name}}</span>
          <el-button type="danger" icon="el-icon-delete" @click="deleteFile(index)"></el-button>
        </a>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Draggable',
  data () {
    return {
      dragElement: null,
      lock: true,
      files: [],
      projectName: this.$route.params.name
    }
  },
  watch: {
  },
  methods: {
    addFile (filename) {
      this.files.push({
        id: this.files.length,
        name: filename.split('.')[0]
      })
    },
    deleteFile (index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(index)
        // 在服务器将对应文件删除
        let self = this
        self.axios.get('/file/delete', {
          params: {
            dir: self.projectName,
            file: self.files[index].name + '.obj'
          }
        }).then(function (res) {
          console.log(res.data)
          let data = res.data
          if (data.success) {
            self.files.splice(index, 1)
            self.$message.success(data.msg)
          } else {
            self.$message.warning(data.msg)
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  },
  created () {
    console.log(this.projectName)
    let self = this
    self.axios.get('/file/index?dir=' + self.projectName)
      .then(function (res) {
        // console.log(res.data)
        let data = res.data
        if (data.success) {
          let fileList = data.files
          for (let i = 0; i < fileList.length; i++) {
            self.addFile(fileList[i])
          }
        } else {
          self.$message.warning(data.msg)
        }
      })
      .catch(function (err) {
        console.log(err.message)
      })
  },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
      this.items = value.list
    })

    this.$dragging.$on('dragend', () => {
      console.log('---------------')
      for (var i in this.items) {
        console.log(this.items[i].id)
      }
    })
  }
}
</script>

<style scoped>
@import "../assets/css/menu.css";

.drag-box-left{
  float: left;
  width: 45%;
}
.drag-box-right{
  float: right;
  width: 45%;
}
.drag-list{
  border: 1px solid #ddd;
  padding:10px;
  margin-bottom: 20px;
  transition: border .3s;
}
.drag-list:hover{
  border: 1px solid #20a0ff;
}
.drag-name{
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
