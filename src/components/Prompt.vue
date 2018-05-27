<template>
  <transition name="confirm">
    <div class="info-confirm" v-show="showFlag">
      <div class="info-header">
          <span>{{myTip}}</span>
      </div>
      <div class="info-text">
        {{ msg }}
      </div>
      <input class="info-input" v-model="myText"/>
      <div class="info-button">
        <a href="#" @click.prevent="confirm">{{ confirmBtnText }}</a>
        <a href="#" @click.prevent="cancle">{{ cancleBtnText }}</a>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    tip: {
      type: String,
      default: '提示消息'
    },
    msg: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancleBtnText: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      showFlag: false,
      myTip: this.tip,
      myText: this.text
    }
  },
  methods: {
    hide () {
      this.showFlag = false
    },
    show () {
      this.showFlag = true
    },
    confirm () {
      this.hide()
      this.$emit('confirm', this.myText)
    },
    cancle () {
      this.hide()
      this.$emit('cancle')
    },
    updateTip (newTip) {
      this.myTip = newTip
    }
  }
}
</script>

<style scoped>
.info-confirm{
  float: left;
  width: 45%;
}
.info-header{
  float: right;
  width: 45%;
}
.info-text{
  border: 1px solid #ddd;
  padding:10px;
  margin-bottom: 20px;
  transition: border .3s;
}
.info-input{
  border: 1px solid #ddd;
  padding:10px;
  margin-bottom: 20px;
  transition: border .3s;
}
.info-button{
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
