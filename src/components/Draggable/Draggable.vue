<template>
  <div>
    <el-row class="el-menu-item">
      <el-col :span="4">
        <router-link tag="i" to="/"
          class="el-icon-back" style="color: #c7b3e5;"></router-link>
      </el-col>
      <el-col :span="16" class="title">模型列表</el-col>
      <el-col :span="4">
        <i class="el-icon-delete" @click="ifShow = !ifShow" style="color: #c7b3e5;"></i>
      </el-col>
    </el-row>
    <el-row class="el-menu-item"
      v-for="(item, index) in items"
      :index="item.name"
      :key="item.id"
      draggable="true"
      v-dragging="{ item: item, list: items, group: 'item' }">
      <el-col :span="16" :offset="4">
        <span @click="selectModel(index)">{{item.name}}</span>
      </el-col>
      <el-col :span="4">
        <transition name="el-zoom-in-center">
          <i class="el-icon-close"
            @click="deleteModel(index)"
            v-show="ifShow"
            style="color: #c7b3e5;"></i>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Draggable',
  props: {
    models: {
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {
      dragElement: null,
      lock: true,
      items: this.models,
      selected: null,
      clicked: null,
      ifShow: false
    }
  },
  watch: {
    models: {
      handler: function (val, oldVal) {
        this.items = val
      },
      deep: true
    }
  },
  methods: {
    deleteModel (index) {
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
    },
    selectModel (index) {
      // console.log('select')
      this.selected = this.models[index].name
      this.$emit('select', index)
    }
  },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
      this.items = value.list
    })
    this.$dragging.$on('dragend', () => {
      this.$emit('order', this.items)
    })
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
}
.el-col {
  border-radius: 4px;
}
</style>
