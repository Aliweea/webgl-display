<template>
  <transition name="confirm">
    <div class="info-confirm" v-show="showFlag">
      <div class="info-header">
          <span>提示信息</span>
      </div>
      <div class="info-text">
        {{ text }}
      </div>
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
      showFlag: false
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
      this.$emit('confirm')
    },
    cancle () {
      this.hide()
      this.$emit('cancle')
    }
  }
}
</script>
