<template>
  <el-menu :default-openeds="['1']">
    <el-submenu index="1">
      <template slot="title"><i class="el-icon-document"></i>文件列表</template>
      <el-menu-item
        v-for="(file, index) in files"
        :index="file.title"
        :key="file.id"
        draggable="true"
        v-dragging="{ item: file, list: files, group: 'file' }">
        <a>
          <span>{{file.id}}{{file.title}}</span>
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
      files: [
        {id: 1, title: '这里是列表1的标题'},
        {id: 2, title: '这里是列表2的标题'},
        {id: 3, title: '这里是列表3的标题'},
        {id: 4, title: '这里是列表4的标题'},
        {id: 5, title: '这里是列表5的标题'},
        {id: 6, title: '这里是列表6的标题'},
        {id: 7, title: '这里是列表7的标题'}
      ],
      order: []
    }
  },
  watch: {
    order: {
      handler (order) {

      },
      deep: true
    }
  },
  methods: {
    addFile (filename) {
      this.files.push({
        id: this.files.length,
        title: filename
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
        this.files.splice(index, 1)
        // 在服务器将对应文件删除
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
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
.drag-title{
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
