<template>
  <el-container>
    <el-aside>
      <div class="drag-box"><draggable></draggable></div>
      <upload @upload="this.refs.draggable.addNew(filename)"></upload>

    </el-aside>

    <el-container>
      <el-header style="text-align: center">
        <h1>{{name}}</h1>

      </el-header>
    </el-container>
  </el-container>
</template>

<script>
import upload from '../Upload'
import draggable from '../Draggable'

export default {
  name: 'ProjectPage',
  data () {
    return {
      name: this.$route.params.name,
      dragElement: null,
      lock: true
    }
  },
  methods: {
  },
  components: {
    upload, draggable
  }
}
</script>

<style scoped>
.drag-box{
  height: 400px;
  width: 300px;
  overflow: scroll;
}
</style>
