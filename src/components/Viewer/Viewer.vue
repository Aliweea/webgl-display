<template>
  <div class="viewer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

import { OBJLoader } from './js/OBJLoader'
import { MTLLoader } from './js/MTLLoader'
import { mapState } from 'vuex'

const OrbitControls = require('three-orbitcontrols')

const modelDir = './obj/'

export default {
  name: 'Viewer',
  components: {
    toolbar
  },
  props: {
    pname: {
      type: String,
      default: ''
    },
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
    },
    controllable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      size: {
        width: this.width,
        height: this.height
      },
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(45, 1, 0.1, 10000),
      mouse: new THREE.Vector2(),
      allLights: [],
      ambientLight: null,
      pointLight: null,
      directionalLight: null,
      wrapper: new THREE.Object3D(),
      renderer: null,
      controls: null,
      boxHelper: new THREE.BoxHelper(),
      loader: new OBJLoader(),
      mtlLoader: new MTLLoader(),
      raycaster: new THREE.Raycaster(),
      intersected: null,
      selected: null,
      unSelectedOpacity: 0.0,
      reqId: null, // requestAnimationFrame id
      backgroundColor: 0xEEEEEE,
      backgroundAlpha: 1
    }
  },
  computed: {
    ...mapState({
      models: state => state.models
    })
  },
  watch: {
    intersected (val, oldVal) {
      if (val !== null) {
        const models = this.models
        for (let i = 0; i < models.length; i++) {
          if (val === models[i].obj) {
            this.$emit('select', models[i].name)
            break
          }
        }
      }
    },
    lights: {
      deep: true,
      handler (val, oldVal) {
        this.updateLights()
      }
    },
    size: {
      deep: true,
      handler (val, oldVal) {
        // console.log('size change')
        if (!this.wrapper.children.length) return
        this.updateCamera()
        this.updateRenderer()
      }
    },
    controllable () {
      this.updateControls()
    }
  },
  methods: {
    onResize () {
      // console.log('on resize')
      if (this.width === undefined || this.height === undefined) {
        this.$nextTick(() => {
          this.size = {
            width: this.$el.clientWidth,
            height: this.$el.clientHeight
          }
        })
      }
    },
    onMouseMove (event) {
      // console.log('mouse move')
      event.preventDefault()
      // const rect = this.$el.getBoundingClientRect()
      // var x = event.clientWidth - rect.left
      // var y = event.clientHeight - rect.top
      // // this.mouse.x = (x / this.size.width) * 2 - 1
      // // this.mouse.y = -(y / this.size.height) * 2 + 1
      // this.mouse.x = (x / (rect.right - rect.left)) * 2 - 1
      // this.mouse.y = -(y / (rect.bottom - rect.top)) * 2 + 1

      // this.raycaster.setFromCamera(this.mouse, this.camera)
      // var intersects = this.raycaster.intersectObject(this.wrapper, true)
      // if (intersects.length > 0) {
      //   console.log(intersects)
      //   if (self.intersected !== intersects[0].object) {
      //     if (self.intersected) {
      //       self.intersected.material.emissive.setHex(self.intersected.currentHex)
      //     }
      //     self.intersected = intersects[0].object
      //     self.intersected.currentHex = self.intersected.material.emissive.getHex()
      //     self.intersected.material.emissive.setHex(0xff0000)
      //   }
      // } else {
      //   if (self.intersected) {
      //     self.intersected.material.emissive.setHex(self.intersected.currentHex)
      //   }
      //   self.intersected = null
      // }
    },
    onDoubleClick (event) {
      // console.log('mouse down')
      event.preventDefault()
      this.unSelect()
      // var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000})
      // var radius = 50
      // var segments = 16
      // var rings = 16
      // var sphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(radius, segments, rings), sphereMaterial)
      // sphere.position.set(new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5))
      // this.scene.add(sphere)
      // console.log(this.camera.position)
      // console.log(this.scene.position)
      // console.log(sphere.position)
    },
    update () {
      this.updateRenderer()
      this.updateCamera()
      this.updateLights()
      this.updateControls()
    },
    updateRenderer () {
      // console.log('update renderer')
      const renderer = this.renderer
      renderer.setSize(this.size.width, this.size.height)
      renderer.setPixelRatio(window.devicePixelRatio || 1)
      renderer.setClearColor(new THREE.Color(this.backgroundColor).getHex())
      renderer.setClearAlpha(this.backgroundAlpha)
      renderer.shadowMap.enabled = true
    },
    updateCamera () {
      // console.log('update camera')
      const camera = this.camera
      camera.aspect = this.size.width / this.size.height

      const mod = this.wrapper
      const boxHelper = this.boxHelper.setFromObject(mod)

      if (boxHelper.geometry.boundingSphere === null) {
        boxHelper.geometry.computeBoundingSphere()
      }
      const center = boxHelper.geometry.boundingSphere.center
      const radius = boxHelper.geometry.boundingSphere.radius
      // console.log(radius)

      var cameraPos = new THREE.Vector3(center.x + mod.position.x,
        center.y + mod.position.y, radius * 2.2 + center.z + mod.position.z)
      var lookPos = new THREE.Vector3(center.x + mod.position.x,
        center.y + mod.position.y, center.z + mod.position.z)

      camera.position.copy(cameraPos)
      camera.lookAt(lookPos)
      camera.updateProjectionMatrix()

      if (this.controls) {
        this.controls.target = lookPos
      }
    },
    updateLights () {
      // console.log('update lights')
      this.scene.remove.apply(this.scene, this.allLights)
      this.allLights = []
      this.lights.forEach(item => {
        if (!item.type) return
        const type = item.type.toLowerCase()
        let light = null
        if (type === 'ambient' || type === 'ambientlight') {
          const color = item.color || 0x666666
          const intensity = item.intensity || 1
          light = new THREE.AmbientLight(color, intensity)
          this.ambientLight = light
        } else if (type === 'point' || type === 'pointlight') {
          const color = item.color || 0xffffff
          const intensity = item.intensity || 1
          const distance = item.distance || 0
          const decay = item.decay || 1
          light = new THREE.PointLight(color, intensity, distance, decay)
          if (item.position) {
            light.position.copy(item.position)
          }
          this.pointLight = light
        } else if (type === 'directional' || type === 'directionallight') {
          const color = item.color || 0xdfebff
          const intensity = item.intensity || 1
          light = new THREE.DirectionalLight(color, intensity)
          if (item.position) {
            light.position.copy(item.position)
          }
          if (item.target) {
            light.target.copy(item.target)
          }
          this.directionalLight = light
        } else if (type === 'hemisphere' || type === 'hemispherelight') {
          const skyColor = item.skyColor || 0xffffff
          const groundColor = item.groundColor || 0xffffff
          const intensity = item.intensity || 1
          light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
          if (item.position) {
            light.position.copy(item.position)
          }
        }
        this.allLights.push(light)
        this.scene.add(light)
      })
    },
    updateControls () {
      // console.log('update controls')
      if (this.controllable && this.controls) return
      if (this.controllable) {
        this.controls = new OrbitControls(this.camera, this.$el)
        this.controls.type = 'orbit'
        this.controls.addEventListener('change', this.render)
      } else {
        if (this.controls) {
          this.controls.dispose()
          this.controls = null
        }
      }
    },
    animate (time) {
      this.reqId = requestAnimationFrame(this.animate)
      this.render()
      TWEEN.update(time)
    },
    render () {
      this.renderer.render(this.scene, this.camera)
    },
    load () {
      let models = this.models
      if (!models.length) return
      if (this.wrapper.children.length) {
        this.wrapper.children = []
      }
      models.forEach((model, index) => {
        this.addObject(index, model)
      })
    },
    addObject (index, model) {
      if (!model) return
      const onLoad = (object) => {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.transparent = true
          }
        })
        this.wrapper.add(object)
        this.updateCamera()
        // console.log(index, object)
        this.$store.commit('addObject', {
          index: index,
          obj: object
        })
        this.$emit('on-load')
      }
      const onProgress = (xhr) => {
        this.$emit('on-progress', xhr)
      }
      const onError = (err) => {
        console.log(err)
        this.$emit('on-error', err)
      }
      this.loader.setPath(modelDir + this.pname + '/')
      if (model.hasMtl) {
        this.mtlLoader.setPath(modelDir + this.pname + '/')
        this.mtlLoader.load(model.name + '.mtl', (materials) => {
          materials.preload()
          this.loader.setMaterials(materials)
          this.loader.load(model.name + '.obj', onLoad, onProgress, onError)
        }, onProgress, onError)
      } else {
        // console.log(index, model)
        this.loader.load(model.name + '.obj', onLoad, onProgress, onError)
      }
    },
    removeObject (index) {
      this.wrapper.remove(this.models[index].obj)
      this.updateCamera()
    },
    selectModel (name) {
      let self = this
      this.selected = name
      this.models.forEach(function (element) {
        if (element.name !== name) {
          element.obj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material.opacity = self.unSelectedOpacity
            }
          })
        } else {
          element.obj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material.opacity = 1
            }
          })
        }
      })
    },
    unSelect () {
      this.models.forEach(function (element) {
        element.obj.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = 1
          }
        })
      })
    },
    setupTween (obj) {
      // console.log('setup tween')
      var cell = { opacity: 0 }
      var tween = new TWEEN.Tween(cell)
        .to({ opacity: 1 }, 2000)
        .onUpdate(function () {
          obj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material.opacity = cell.opacity
            }
          })
        })
      tween.start()
    },
    displayModel () {
      const models = this.models
      const objects = this.wrapper.children
      objects.forEach(obj => {
        obj.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = 0
          }
        })
      })
      var self = this
      for (let i = 0; i < models.length; i++) {
        let obj = models[i].obj
        setTimeout(function () {
          self.setupTween(obj)
        }, i * 3000 + 1000)
      }
    },
    changeLightColor (type, color) {
      if (type === 'ambient' || type === 'ambientlight') {
        // console.log(this.ambientLight.color.getHex())
        this.ambientLight.color.setHex(color)
      } else if (type === 'point' || type === 'pointlight') {
        this.pointLight.color.setHex(color)
      } else if (type === 'directional' || type === 'directionallight') {
        this.directionalLight.color.setHex(color)
      }
    }
  },
  mounted () {
    if (this.width === undefined || this.height === undefined) {
      this.size = {
        width: this.$el.clientWidth,
        height: this.$el.clientHeight
      }
    }
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, canvas: this.$refs.canvas })

    this.scene.background = new THREE.Color(this.backgroundColor)
    this.scene.add(this.wrapper)

    this.load()
    this.update()

    this.$el.addEventListener('mousemove', this.onMouseMove, false)
    this.$el.addEventListener('dblclick', this.onDoubleClick, false)
    window.addEventListener('resize', this.onResize, false)
    this.animate()
  }
}
</script>

<style scoped>
.viewer {
  width: 100%;
  height: 100%;
  margin: 0;
  border: 0;
  padding: 0;
  color: #EEEEEE;
}
.canvas {
  width: 100%;
  height: 100%;
}
</style>
