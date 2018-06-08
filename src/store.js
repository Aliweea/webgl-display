export default {
  fetch (key) {
    return JSON.parse(window.localStorage.getItem(key) || null)
  },
  save (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}
