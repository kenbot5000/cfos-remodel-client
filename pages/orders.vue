<template>
  <v-container>
    <v-card>Orders</v-card>
  </v-container>
</template>

<script>
export default {
  layout: 'Base',
  created () {
    this.$store.commit('setNavbarText', 'Orders')
  }
}
</script>

<style>

</style>
