import Vue from 'vue'
import vuex from 'vuex'
import axios from 'axios'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    models: [],
    endLoad: false
  },
  mutations: {
    startLoad (state) {
      state.endLoad = false
    },
    endLoad (state) {
      state.endLoad = true
    },
    setModels (state, models) {
      state.models = models
    },
    addModel (state, model) {
      state.models.push({
        id: model.id,
        name: model.name,
        hasMtl: model.hasMtl
      })
    },
    addObject (state, payload) {
      // console.log(index, object)
      Vue.set(state.models[payload.index], 'obj', payload.obj)
    },
    removeModel (state, index) {
      state.models.splice(index, 1)
    }
  },
  actions: {
    loadModels ({ commit, state }, pname) {
      commit('startLoad')
      axios.get('/model/index', {
        params: {
          pname: pname
        }
      }).then(function (res) {
        // console.log(res.data)
        let data = res.data
        if (data.success) {
          let models = data.models
          for (let i = 0; i < models.length; i++) {
            commit('addModel', {
              id: models[i].id,
              name: models[i].name,
              hasMtl: models[i].hasMtl
            })
          }
          commit('endLoad')
        } else {
          self.$message.warning(data.msg)
        }
      }).catch(function (err) {
        console.log(err.message)
      })
    },
    orderModels ({ commit, state }, items) {
      commit('setModels', items)
      var orders = []
      for (var i in items) {
        orders.push({
          id: items[i].id,
          order: i
        })
      }
      axios.post('/model/order', {
        orders: orders
      }).then(function (res) {
        let data = res.data
        if (data.success) {
          console.log(data.msg)
        } else {
          self.$message.warning(data.msg)
        }
      }).catch(function (err) {
        console.log(err.message)
      })
    },
    deleteModel ({ commit, state }, payload) {
      // 在服务器将对应文件删除
      axios.post('/model/delete', {
        id: state.models[payload.index].id,
        name: state.models[payload.index].name,
        pname: payload.pname
      }).then(function (res) {
        // console.log(res.data)
        let data = res.data
        if (data.success) {
          console.log(data.msg)
          commit('removeModel', payload.index)
        } else {
          console.log(data.msg)
        }
      }).catch(function (err) {
        console.log(err.message)
      })
    },
    removeAllModels ({ commit, state }) {
      commit('setModels', [])
    }
  }
})
