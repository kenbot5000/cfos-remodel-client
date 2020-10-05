<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height primary darken-2">
        <v-card width="500" class="mx-auto pa-5 mt-n10">
          <h4 class="text-h4 text-center mt-3">
            CFOS Login
          </h4>
          <v-form @submit.prevent="login">
            <v-text-field v-model="user.username" label="Username" :rules="[rules.required]" required />
            <v-text-field
              v-model="user.password"
              label="Password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
            /><span v-if="hasError" class="error--text">{{ error }}</span>
            <v-card-actions class="d-flex align-right">
              <v-btn large block color="success" type="submit">
                Log In
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      // Form settings
      show: false,
      rules: {
        required: value => !!value || 'Required.'
      },
      // User data
      user: {
        username: '',
        password: ''
      },
      error: String,
      hasError: false
    }
  },
  methods: {
    async login () {
      try {
        const text = this.user.username
        const res = await axios.get(`/api/user/search?username=${text}`)
        if (this.user.password === res.data.res.password) {
          const cookie = { id: res.data.res._id }
          this.$cookies.set('active-user', cookie, {
            path: '/',
            maxAge: 60 * 60 * 16
          })

          this.$store.commit('setNavbarText', 'Dashboard')
          this.$router.push('/')
        } else {
          this.error = 'Incorrect password.'
          this.hasError = true
        }
      } catch (err) {
        if (err.response.status === 404) {
          this.error = 'User does not exist.'
          this.hasError = true
        } else if (err.response.status === 400) {
          this.error = 'All fields are required.'
          this.hasError = true
        } else {
          this.error = 'Unknown error'
          this.hasError = true
        }
      }
    }
  }
}
</script>

<style>

</style>
