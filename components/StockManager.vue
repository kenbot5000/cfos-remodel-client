<template>
  <v-card class="pb-4">
    <v-card-title>
      <h4 class="text-h5">
        All Items
      </h4>
    </v-card-title>
    <v-data-table :headers="headers" :items="menuItems" />
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headers: [
        { text: 'Item name', value: 'name' },
        { text: 'Food Category', value: 'category' },
        { text: 'Temperature (Hot or Cold Dish)', value: 'temp' },
        { text: 'Flavor', value: 'flavor' },
        { text: 'Price', value: 'price' },
        { text: 'Active?', value: 'active' },
        { text: 'Stock', value: 'stock' }
      ],
      menuItems: []
    }
  },
  async created () {
    const menu = await axios.get('/api/menu')
    this.menuItems = menu.data.res
  }
}
</script>

<style>

</style>
