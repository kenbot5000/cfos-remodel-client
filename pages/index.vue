<template>
  <v-container class="px-6">
    <v-row>
      <v-col>
        <v-card min-height="350">
          <v-card-title class="text-h4">
            Menu
          </v-card-title>
          <v-divider />
        </v-card>
      </v-col>
      <v-col>
        <UserCard :users="users" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card min-height="475">
          <v-card-title class="text-h4">
            Orders
          </v-card-title>
          <v-divider />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import UserCard from '../components/UserCard'

export default {
  layout: 'Base',
  components: { UserCard },
  data () {
    return {
      users: []
    }
  },
  created () {
    this.$store.commit('setNavbarText', 'Dashboard')

    // Get all users
    axios.get('/api/user/').then((res) => {
      this.users = res.data
    })
  }
}
</script>

<style>
</style>
