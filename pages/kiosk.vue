<template>
  <v-app>
    <!-- Starting Dialog -->
    <v-main class="accent">
      <v-dialog v-model="mainDialog" width="500" persistent>
        <v-card>
          <v-card-title>
            Order Something!
          </v-card-title>
          <v-card-subtitle>Start here:</v-card-subtitle>
          <v-form class="mx-4">
            <v-text-field v-model="student_no" label="Student Number" outlined @input="searchStudent" />
            <v-text-field
              v-model="name"
              label="Name"
              outlined
              :disabled="!nameFound"
              :readonly="nameFound"
              :loading="searchLoad"
            />
          </v-form>
          <v-card-actions>
            <v-btn color="success" x-large :disabled="!nameFound" @click="begin">
              Begin
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Final Dialog -->
      <v-dialog v-model="finalDialog" width="500" persistent>
        <v-card>
          <v-card-title>
            Before you go...
          </v-card-title>
          <v-card-subtitle>Take a picture of the following data: You might need it!</v-card-subtitle>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Reference No.</v-list-item-subtitle>
                <v-list-item-title>{{ order._id }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Name of Student</v-list-item-subtitle>
                <v-list-item-title>{{ order.student.lname }}, {{ order.student.fname }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Amount to Pay</v-list-item-subtitle>
              <v-list-item-title>{{ order.total.toFixed(2) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn color="success" block @click="finalize">
              I'm Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container>
        <v-snackbar v-model="snackbar" timeout="2000">
          {{ snackbarMessage }}
        </v-snackbar>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Your Order</v-card-title>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Reference No.</v-list-item-subtitle>
                    <v-list-item-title>{{ order._id }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Name of Student</v-list-item-subtitle>
                    <v-list-item-title>{{ order.student.lname }}, {{ order.student.fname }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Student Number</v-list-item-subtitle>
                    <v-list-item-title>{{ order.student.student_no }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Amount</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in order.items" :key="item._id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.count }}</td>
                        <td>{{ item.price.toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle>Total</v-list-item-subtitle>
                    <v-list-item-title>{{ order.total.toFixed(2) }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-card-actions>
                <v-btn block color="success" @click="showFinalDialog">
                  Finalize!
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Buy</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activeMenu" :key="item._id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.price }}</td>
                  <td v-if="item.stock > 0">
                    {{ item.stock }}
                  </td>
                  <td v-if="item.stock === 0" class="danger--text">
                    OUT OF STOCK
                  </td>
                  <td>
                    <v-btn color="primary" :disabled="item.stock <= 0" @click="buy(item.name)">
                      Buy This!
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-row />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      mainDialog: true,
      student_no: '',
      name: '',
      nameFound: false,
      order: {
        student: Object,
        total: 0,
        items: [],
        active: false
      },
      menu: [],
      snackbar: false,
      snackbarMessage: '',
      finalDialog: false
    }
  },
  computed: {
    activeMenu () {
      return this.menu.filter(function (item) {
        return item.active === true
      })
    }
  },
  created () {
    this.getAllMenuItems()
  },
  methods: {
    async getAllMenuItems () {
      const activeMenuItems = await axios.get('/api/menu/')
      this.menu = activeMenuItems.data.res
    },
    searchStudent () {
      try {
        this.searchLoad = true
        this.name = ''
        setTimeout(async () => {
          const res = await axios.get(`/api/student/${this.student_no}`)
          if (res.status === 200) {
            this.name = `${res.data.res.lname}, ${res.data.res.fname}`
            this.nameFound = true
            this.searchLoad = false
          } else {
            this.name = ''
            this.nameFound = false
            this.searchLoad = false
          }
        }, 2500)
      } catch (err) {
        this.name = ''
        this.nameFound = false
        this.searchLoad = false
      }
    },
    async begin () {
      const res = await axios.post('/api/order/', { student_no: Number(this.student_no) })
      if (res.status === 201) {
        this.mainDialog = false
        this.order = res.data.res
      }
    },
    async buy (itemname) {
      const res = await axios.post(`/api/order/${this.order._id}`, { name: itemname })
      if (res.status === 200) {
        const updateStockIndex = this.menu.findIndex((searchItem) => {
          return searchItem.name === itemname
        })
        this.menu[updateStockIndex].stock -= 1
        this.refresh()
      }
    },
    async refresh () {
      const res = await axios.get(`/api/order/${this.order._id}`)
      this.order = res.data.res
      this.snackbar = true
      this.snackbarMessage = 'Added to your order!'
    },
    showFinalDialog () {
      this.finalDialog = true
    },
    async finalize () {
      const res = await axios.patch(`/api/order/${this.order._id}`, { active: true })
      if (res.status === 204) {
        this.finalDialog = false
        this.mainDialog = true
        this.name = ''
        this.nameFound = false
        this.student_no = 0
        // Calls socket to update
        this.$socket.emit('finalize_order', this.order.items)
      }
    }
  }
}
</script>

<style>

</style>
