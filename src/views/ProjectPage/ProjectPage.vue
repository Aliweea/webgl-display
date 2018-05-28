<template>
  <el-container>
    <el-aside>
      <div class="drag-box">
        <draggable :porject-name="projectName"
          :files="files"
          @order="orderFiles"
          @delete="deleteFile"></draggable>
      </div>
      <upload :porject-name="projectName" @upload="addFile"></upload>
    </el-aside>
    <el-main>
      <!-- <viewer></viewer> -->
    </el-main>
  </el-container>
</template>

<script>
import upload from '../../components/Upload/Upload'
import draggable from '../../components/Draggable/Draggable'
import viewer from '../../components/Viewer/Viewer'

export default {
  name: 'ProjectPage',
  data () {
    return {
      projectName: this.$route.params.name,
      files: []
    }
  },
  components: {
    upload, draggable, viewer
  },
  methods: {
    addFile (model) {
      this.files.push({
        id: this.files.length,
        name: model.name.split('.')[0],
        center: model.center
      })
    },
    deleteFile (index) {
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
    },
    orderFiles (items) {
      this.files = items
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
          let models = data.models
          for (let i = 0; i < models.length; i++) {
            self.addFile(models[i])
          }
        } else {
          self.$message.warning(data.msg)
        }
      })
      .catch(function (err) {
        console.log(err.message)
      })
  }
}
</script>

<style scoped>
.drag-box{
  height: 400px;
  width: 300px;
  overflow-y: scroll;
}
</style>
