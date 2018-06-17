<template>
  <div class="page">
    <div class="aside">
      <div class="drag-box">
        <draggable :models="models"
          @delete="deleteModel"
          @select="selectModel">
        </draggable>
      </div>
      <upload class="upload"
        :pname="pname"
        @upload="addModel2View">
      </upload>
    </div>
    <div class="main">
      <div class="header">
        <toolbar @change-color="changeLightColor"
          @reset="resetCamera"
          @display="display"></toolbar>
      </div>
      <div class="model">
        <viewer ref="viewer"
          :pname="pname"
          v-if="$store.state.endLoad">
        </viewer>
      </div>
    </div>
  </div>
</template>

<script>
import upload from '../../components/Upload/Upload'
import draggable from '../../components/Draggable/Draggable'
import viewer from '../../components/Viewer/Viewer'
import toolbar from '../../components/Toolbar/Toolbar'
import { mapState } from 'vuex'

export default {
  name: 'ProjectPage',
  components: {
    upload, draggable, viewer, toolbar
  },
  data () {
    return {
      pname: this.$route.params.name
    }
  },
  computed: {
    ...mapState({
      models: state => state.models
    })
  },
  methods: {
    addModel2View (model) {
      const self = this
      setTimeout(function () {
        let index = self.models.length
        self.$store.commit('addModel', {
          id: model.id,
          name: model.name,
          hasMtl: model.hasMtl
        })
        self.$refs.viewer.addObject(index, model)
      }, 2000)
    },
    deleteModel (index) {
      this.$refs.viewer.removeObject(index)
      this.$store.dispatch('deleteModel', {
        index: index,
        pname: this.pname
      })
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
    // this.$store.dispatch('loadModels', this.pname)
  },
  beforeRouteEnter (to, from, next) {
    // do something
    // 不能获取组件实例 ‘this’
    next(vm => {
      vm.$store.dispatch('loadModels', vm.pname)
    })
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.$store.dispatch('removeAllModels')
    next()
  }
}
</script>

<style scoped>
.page{
  width: 100%;
  height: 100%;
}
.aside {
  float: left;
  width: 300px;
  height: 100%;
  background-color: #daf9ca;
}
.drag-box {
  height: 60%;
  overflow-y: scroll;
}
.upload {
  height: 40%;
  overflow-y: scroll;
}
.main {
  float: right;
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
