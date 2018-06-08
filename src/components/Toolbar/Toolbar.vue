<template>
  <el-row :gutter="20" class="toolbar">
    <el-col :span="4">
      <span>ambientLight</span>
      <el-color-picker v-model="ambientColor" class="toolbar-label"></el-color-picker>
    </el-col>
    <el-col :span="4">
      <span>pointLight</span>
      <el-color-picker v-model="pointColor"  class="toolbar-label"></el-color-picker>
    </el-col>
    <el-col :span="4">
      <span>directionalLight</span>
      <el-color-picker v-model="directionalColor" class="toolbar-label"></el-color-picker>
    </el-col>
    <el-col :span="4">
      <el-button @click="resetCamera">resetCamera</el-button>
    </el-col>
    <el-col :span="4">
      <el-button @click="display">displayModel</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    lights: {
      type: Array,
      default () {
        return [
          {
            type: 'AmbientLight',
            color: 0x666666,
            intensity: 1
          },
          {
            type: 'PointLight',
            position: { x: 1, y: 1, z: 1 },
            color: 0xff0000,
            intensity: 1,
            distance: 500,
            decay: 1
          },
          {
            type: 'DirectionalLight',
            position: { x: 0, y: 1, z: 0 },
            color: 0xdfebff,
            intensity: 1.75
          }
        ]
      }
    }
  },
  data () {
    return {
      ambientColor: null,
      pointColor: null,
      directionalColor: null
    }
  },
  watch: {
    ambientColor (val) {
      val = val.substring(1)
      this.$emit('change-color', 'ambient', parseInt(val, 16))
    },
    pointColor (val) {
      val = val.substring(1)
      this.$emit('change-color', 'point', parseInt(val, 16))
    },
    directionalColor (val) {
      val = val.substring(1)
      this.$emit('change-color', 'directional', parseInt(val, 16))
    }
  },
  methods: {
    resetCamera () {
      this.$emit('reset')
    },
    display () {
      this.$emit('display')
    }
  },
  mounted () {
    this.lights.forEach(item => {
      if (!item.type) return
      const type = item.type.toLowerCase()
      if (type === 'ambient' || type === 'ambientlight') {
        const color = item.color || 0x666666
        this.ambientColor = '#' + color.toString(16)
      } else if (type === 'point' || type === 'pointlight') {
        const color = item.color || 0xffffff
        this.pointColor = '#' + color.toString(16)
      } else if (type === 'directional' || type === 'directionallight') {
        const color = item.color || 0xdfebff
        this.directionalColor = '#' + color.toString(16)
      }
    })
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  /* flex-wrap: nowrap; */
  justify-content: center;
  align-items: center;
}
.toolbar-label {
  vertical-align: middle;
}
.el-col {
  border-radius: 4px;
}
</style>
