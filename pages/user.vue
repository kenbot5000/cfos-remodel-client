<template>
  <v-container>
    <UserManager />
  </v-container>
</template>

<script>
import UserManager from '../components/UserManager'

export default {
  components: {
    UserManager
  },
  layout: 'Base',
  created () {
    this.$store.commit('setNavbarText', 'Users')
  }
}
</script>

<style>

</style>
