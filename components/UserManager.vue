<template>
  <v-container>
    <Snackbar ref="snackbar" />

    <!-- Card views -->
    <v-row>
      <v-col v-for="user in users" :key="user._id">
        <UserCardView :user="user" @snackbar-message="sendMessage" />
      </v-col>
    </v-row>

    <!-- Control Panel -->
    <v-row>
      <v-col>
        <v-card class="px-4 v-flex">
          <v-card-title>
            Manage Users
            <v-spacer />
            <v-btn color="primary" @click="addCard = true">
              Add User
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="addCard" width="500">
      <v-card class="pa-4">
        <v-card-title>
          Add User
        </v-card-title>
        <v-form class="mx-4">
          <v-text-field v-model="addForm.firstname" placeholder="First Name" />
          <v-text-field v-model="addForm.lastname" placeholder="Last Name" />
          <v-text-field v-model="addForm.username" placeholder="Username" />
          <v-text-field v-model="addForm.password" placeholder="Password" />
        </v-form>
        <v-card-actions>
          <v-btn color="primary" @click="submitAdd">
            Submit
          </v-btn>
          <v-btn color="error" @click="addCard = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      users: [],

      // Add User Form
      addCard: false,
      addForm: []
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
    },
    async submitAdd () {
      const addCopy = { ...this.addForm }
      const res = await axios.post('/api/user/', addCopy)
      if (res.status === 201) {
        this.sendMessage('User added successfully!')
        this.getAllUsers()
      }
    }
  }
}
</script>

<style></style>
