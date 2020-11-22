<template>
  <v-card width="400" class="pa-2">
    <v-card-title>{{ userData.username }}</v-card-title>
    <v-simple-table dense class="mb-5">
      <tbody>
        <tr>
          <th>ID</th>
          <td>{{ userData._id }}</td>
        </tr>
        <tr>
          <th>Username</th>
          <td>{{ userData.username }}</td>
        </tr>
        <tr>
          <th>Password</th>
          <td>{{ obfuscatedPassword }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-card-actions>
      <v-dialog v-model="editDialog" width="400">
        <template #activator="{ on, attrs }">
          <v-btn color="secondary" v-bind="attrs" v-on="on">
            Edit
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Edit</v-card-title>
          <v-form class="mx-4">
            <v-text-field v-model="userData._id" label="ID" readonly />
            <v-text-field v-model="userForm.username" label="Username" />
            <v-text-field
              v-model="userForm.password"
              label="Password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
            />
          </v-form>
          <v-card-actions>
            <v-btn color="primary" @click="submitChanges()">
              Submit
            </v-btn>
            <v-btn color="error" @click="editDialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    user: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      userData: this.user,
      userForm: { ...this.user },
      editDialog: false,
      show: false
    }
  },
  computed: {
    obfuscatedPassword () {
      return '*'.repeat(this.userData.password.length)
    }
  },
  methods: {
    async submitChanges () {
      const res = await axios.patch(`/api/user/search?id=${this.userData._id}`, this.userForm)
      if (res.status === 200) {
        const updatedUser = await axios.get(`/api/user/search?id=${this.userData._id}`)
        this.userData = updatedUser.data.res
        this.$emit('snackbar-message', 'Item successfully edited!')
      }
    }
  }
}
</script>

<style>

</style>
