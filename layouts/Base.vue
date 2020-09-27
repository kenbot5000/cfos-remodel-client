<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Cafeteria Food Ordering System
            </v-list-item-title>
            <v-list-item-subtitle> Logged in as: {{ username }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item-group>
          <!-- Link to Dashboard -->
          <v-list-item v-for="item in navbarLinks" :key="item.title" :to="item.link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" @click="logout()">
            Log Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ navbarTitle }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer color="primary" class="white--text" app>
      {{ new Date().getFullYear() }} — <strong class="ml-1">CFOS</strong>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      navbarTitle: String,
      drawer: true,
      navbarLinks: [
        {
          link: '/',
          icon: 'mdi-home',
          title: 'Home'
        },
        {
          link: '/user',
          icon: 'mdi-account',
          title: 'Users'
        },
        {
          link: '/menu',
          icon: 'mdi-food',
          title: 'Menu'
        },
        {
          link: '/orders',
          icon: 'mdi-tray-full',
          title: 'Orders'
        }
      ],
      username: String
    }
  },
  async created () {
    this.navbarTitle = this.$store.state.navbarText

    const config = {
      headers: {
        Accept: 'application/json'
      }
    }

    const cookie = this.$cookies.get('active-user')

    if (cookie === undefined) {
      this.$router.push('/login')
      return
    }

    try {
      const res = await axios.get(`/api/user/search?id=${cookie.id}`, config)
      this.username = res.data.res.username
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          this.$router.push('/login')
        }
      }
    }
  },
  methods: {
    logout () {
      this.$cookies.remove('active-user')
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
