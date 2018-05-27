<template>
  <el-container>
    <el-aside>
      <div class="drag-box"><draggable ref="drag"></draggable></div>
      <upload @upload="addNew"></upload>
    </el-aside>

    <el-main>
    </el-main>
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
    addNew (filename) {
      console.log('add new')
      this.$refs.drag.addFile(filename)
    }
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
