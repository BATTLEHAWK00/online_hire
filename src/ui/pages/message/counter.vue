<template>
  <div>{{ timer }}秒后若未跳转,请点击这里</div>
</template>

<script>
export default {
  name: "counter",
  data() {
    return {
      timer: 3
    }
  },
  mounted() {
    setInterval(() => this.timer > 0 ? this.timer-- : null, 1000)
  },
}
</script>

<style scoped>

</style>