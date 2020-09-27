<template>
  <v-container class="px-6">
    <v-row>
      <v-col>
        <v-card min-height="475">
          <v-card-title class="text-h4">
            Orders
          </v-card-title>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Student Number
                  </th>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in activeOrders" :key="order._id">
                  <td>{{ order.student.student_no }}</td>
                  <td>{{ order.student.lname }}, {{ order.student.fname }}</td>
                  <td>
                    <v-btn color="success" @click="viewOrder(order)">
                      View Order
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card min-height="350">
          <v-card-title class="text-h4">
            Today's Menu
          </v-card-title>
          <v-divider />
          <v-data-table :headers="menuHeaders" :items="activeMenu" :items-per-page="5" class="mx-4" />
        </v-card>
      </v-col>
      <v-col>
        <UserCard :users="users" />
      </v-col>
    </v-row>
    <v-dialog v-model="showOrderDialog" max-width="500">
      <v-card v-if="showOrderDialog">
        <v-card-title>Order Details</v-card-title>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                Student Name
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ currentlyViewingOrder.student.lname }}, {{ currentlyViewingOrder.student.fname }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                Student Number
              </v-list-item-subtitle>
              <v-list-item-title>
                {{ currentlyViewingOrder.student.student_no }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-simple-table class="my-2" height="200" fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in currentlyViewingOrder.items" :key="item._id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.price.toFixed(2) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-list-item class="primary">
            <v-list-item-content>
              <v-list-item-subtitle class="text-h6 white--text">
                Total
              </v-list-item-subtitle>
              <v-list-item-title class="white--text text-h5">
                {{ currentlyViewingOrder.total.toFixed(2) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="success">
            Complete Order
          </v-btn>
          <v-btn color="error" @click="showOrderDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      users: [],
      activeMenu: [],
      // Menu data table
      menuHeaders: [
        {
          text: 'Item name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Price',
          value: 'price'
        }
      ],
      activeOrders: [],
      // Order dialog
      showOrderDialog: false,
      currentlyViewingOrder: Object
    }
  },
  created () {
    this.$store.commit('setNavbarText', 'Dashboard')
  },
  mounted () {
    // Get all users
    axios.get('/api/user/').then((res) => {
      this.users = res.data
    })

    // Get all active menu items
    axios.get('/api/menu').then((res) => {
      let results = res.data.res.filter(item => item.active === true)
      results = results.map((item) => {
        item.price = item.price.toFixed(2)
        return item
      })
      this.activeMenu = results
    })

    // Get all orders. TODO: Make order filter out to active
    axios.get('/api/order').then((res) => {
      this.activeOrders = res.data.res
    })
  },
  methods: {
    viewOrder (order) {
      this.showOrderDialog = true
      this.currentlyViewingOrder = order
    }
  },
  head () {
    return {
      title: 'Dashboard'
    }
  }
}
</script>

<style>
</style>
