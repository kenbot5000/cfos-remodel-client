<template>
  <v-container class="fill-height">
    <!-- Snackbar -->
    <Snackbar ref="snackbar" />

    <!-- Stock Management Component -->
    <v-row>
      <v-col>
        <StockManager ref="stockmanager" />
      </v-col>
    </v-row>

    <!-- Menu forms and dialogs -->
    <v-row>
      <v-col>
        <MenuForm @refresh="refresh($event)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Snackbar from '../components/Snackbar'
import StockManager from '../components/StockManager'
import MenuForm from '../components/MenuForm'

export default {
  layout: 'Base',
  components: {
    Snackbar,
    StockManager,
    MenuForm
  },
  data () {
    return {
      menu: []
    }
  },
  created () {
    this.$store.commit('setNavbarText', 'Dashboard')
  },
  async mounted () {
    try {
      const menu = await axios.get('/api/menu')
      this.menu = menu.data.res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  },
  methods: {
    async refresh (text) {
      const menu = await axios.get('/api/menu')
      this.menu = menu.data.res
      this.$refs.stockmanager.getAllItems()
      this.$refs.snackbar.sendMessage(text)
    }
  },
  sockets: {
    decrement_stock (items) {
      items.forEach(async (item) => {
        // Gets item. Change this to not need an item search
        const getItem = await axios.get(`/api/menu/search?name=${item.name}`)
        const itemToEdit = getItem.data.res
        itemToEdit.stock -= item.count
        await axios.patch(`/api/menu/search?name=${item.name}`, itemToEdit)
      })
      this.refresh('New order arrived. Stock updated')
    }
  }
}
</script>

<style>

</style>
