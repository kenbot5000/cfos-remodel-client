<template>
  <v-card>Yes</v-card>
</template>

<script>
export default {
  layout: 'Base',
  created () {
    this.$store.commit('setNavbarText', 'Users')
  }
}
</script>

<style>

</style>
