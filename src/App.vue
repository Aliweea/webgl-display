<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
    height: 100%;
    margin: 0px;
    padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #fdffdf;
  padding: 30px;
  width: calc(100% - 60px);
  min-height: calc(100% - 60px);
}
</style>
