<template>
  <div>
    <div class="aside">
      <div class="drag-box">
        <draggable :models="models"
          @order="orderModels"
          @delete="deleteModel"
          @select="selectModel"
          v-if="models.length">
        </draggable>
      </div>
      <upload class="upload"
        :pname="projectName"
        @upload="addModel2View"
        v-if="projectName">
      </upload>
    </div>
    <div class="main">
      <div class="header">
        <toolbar @change-color="changeLightColor"
          @reset="resetCamera"
          @display="display"></toolbar>
      </div>
      <div class="model">
        <viewer ref="viewer" :pname="projectName" :models="models" v-if="models.length"></viewer>
      </div>
    </div>
  </div>
</template>

<script>
import upload from '../../components/Upload/Upload'
import draggable from '../../components/Draggable/Draggable'
import viewer from '../../components/Viewer/Viewer'
import toolbar from '../../components/Toolbar/Toolbar'

import Store from '../../store'

export default {
  name: 'ProjectPage',
  components: {
    upload, draggable, viewer, toolbar
  },
  data () {
    return {
      projectName: this.$route.params.name,
      models: []
    }
  },
  watch: {
    models: {
      handler (models) {
        Store.save(this.projectName, models)
      },
      deep: true
    }
  },
  methods: {
    addModel (model) {
      this.models.push({
        id: this.models.length,
        name: model.name,
        hasMtl: model.hasMtl
      })
    },
    addModel2View (model) {
      this.addModel(model)
      this.$refs.viewer.addObject(model)
    },
    deleteModel (index) {
      // 在服务器将对应文件删除
      let self = this
      self.axios.get('/file/delete', {
        params: {
          dir: self.projectName,
          name: self.models[index].name
        }
      }).then(function (res) {
        console.log(res.data)
        let data = res.data
        if (data.success) {
          self.models.splice(index, 1)
          self.$message.success(data.msg)
          self.$refs.viewer.removeObject(self.models[index])
        } else {
          self.$message.warning(data.msg)
        }
      }).catch(function (err) {
        console.log(err.message)
      })
    },
    orderModels (items) {
      this.models = items
    },
    selectModel (index) {
      this.$refs.viewer.selectModel(this.models[index].name)
    },
    changeLightColor (type, color) {
      this.$refs.viewer.changeLightColor(type, color)
    },
    resetCamera () {
      this.$refs.viewer.updateCamera()
    },
    display () {
      this.$refs.viewer.displayModel()
    }
  },
  created () {
    console.log(this.projectName)
    var items = Store.fetch(this.projectName)
    if (items !== null) {
      this.models = items
    } else {
      let self = this
      self.axios.get('/file/index?dir=' + self.projectName)
        .then(function (res) {
          console.log(res.data)
          let data = res.data
          if (data.success) {
            let models = data.models
            for (let i = 0; i < models.length; i++) {
              self.addModel(models[i])
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
}
</script>

<style scoped>
.aside {
  position: fixed;
  left: 0px;
  width: 300px;
  height: 100%;
}
.drag-box {
  height: 60%;
  overflow-y: scroll;
}
.upload {
  height: 60%;
  overflow-y: scroll;
}
.main {
  position: absolute;
  border: 0px;
  left: 300px;
  width: calc(100% - 300px);
  height: 100%;
}
.header {
  background-color: #f3d7b5;
  padding: 10px;
}
.model {
  width: 100%;
  height: calc(100% - 80px);
}
</style>
