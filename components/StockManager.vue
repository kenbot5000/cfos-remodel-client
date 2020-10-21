<template>
  <v-card class="pb-4">
    <v-card-title>
      <h4 class="text-h5">
        All Items
      </h4>
    </v-card-title>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      class="mx-2"
    />
    <v-data-table :headers="headers" :items="menuItems" :search="search">
      <template v-slot:item.stock="{ item }">
        <v-chip v-if="item.stock == 0" color="red" class="white--text">
          OUT OF STOCK
        </v-chip>
        <span v-else>{{ item.stock }}</span>
      </template>
    </v-data-table>
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
      menuItems: [],
      search: ''
    }
  },
  created () {
    this.getAllItems()
  },
  methods: {
    async getAllItems () {
      const menu = await axios.get('/api/menu')
      menu.data.res.filter(function (item) {
        item.active = item.active ? 'Yes' : 'No'
      })
      this.menuItems = menu.data.res
    }
  }
}
</script>

<style>

</style>
