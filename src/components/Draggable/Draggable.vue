<template>
  <el-menu :default-openeds="['1']">
    <el-submenu index="1">
      <template slot="title"><i class="el-icon-document"></i>文件列表</template>
      <el-menu-item
        v-for="(item, index) in items"
        :index="item.name"
        :key="item.id"
        draggable="true"
        v-dragging="{ item: item, list: items, group: 'item' }">
        <a>
          <span>{{item.name}}</span>
          <el-button type="danger" icon="el-icon-delete" @click="deleteFile(index)"></el-button>
        </a>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Draggable',
  props: ['projectName', 'files'],
  data () {
    return {
      dragElement: null,
      lock: true,
      items: this.files
    }
  },
  methods: {
    deleteFile (index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(index)
        this.$emit('delete', index)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
      this.items = value.list
    })

    this.$dragging.$on('dragend', () => {
      // console.log('---------------')
      // for (var i in this.items) {
      //   console.log(this.items[i].id)
      // }
      this.$emit('order', this.items)
    })
  }
}
</script>

<style scoped>
@import "./menu.css";

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
