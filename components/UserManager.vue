<template>
  <v-container>
    <Snackbar ref="snackbar" />
    <v-row>
      <v-col v-for="user in users" :key="user._id">
        <UserCardView :user="user" @snackbar-message="sendMessage" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-4 v-flex">
          <v-card-title>
            Manage Users
            <v-spacer />
            <v-btn color="primary">
              Add User
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Snackbar from '../components/Snackbar'
import UserCardView from '../components/UserCardView'

export default {
  components: {
    Snackbar,
    UserCardView
  },
  data () {
    return {
      users: []
    }
  },
  mounted () {
    this.getAllUsers()
  },
  methods: {
    async getAllUsers () {
      const res = await axios.get('/api/user/')
      this.users = res.data
    },
    sendMessage (msg) {
      this.$refs.snackbar.sendMessage(msg)
    }
  }
}
</script>

<style></style>
