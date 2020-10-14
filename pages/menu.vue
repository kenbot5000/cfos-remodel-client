<template>
  <v-container class="fill-height">
    <!-- DIALOGS -->
    <!-- Add menu item dialog -->
    <v-dialog v-model="addDialog" width="500">
      <v-card>
        <v-card-title>
          Add menu item
        </v-card-title>
        <v-form class="mx-4">
          <v-text-field v-model="addForm.name" label="Item Name" />
          <v-text-field v-model="addForm.price" label="Item Price" />
          <v-text-field v-model="addForm.stock" label="Stock" />
          <v-radio-group v-model="addForm.active">
            <v-radio label="Set as Active" value="true" />
            <v-radio label="Set as Inactive" value="false" />
          </v-radio-group>
        </v-form>
        <v-card-actions>
          <v-btn color="success" @click="submitAddForm">
            Add to Menu
          </v-btn>
          <v-btn color="error" @click="addDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" width="500">
      <v-card>
        <v-card-title>
          Edit menu item
        </v-card-title>
        <v-form class="mx-4">
          <v-select v-model="selectedItem" :items="itemNames" label="Select item to edit" @input="selectItem(selectedItem)" />
          <v-text-field v-model="editForm.id" disabled label="Item ID" />
          <v-text-field v-model="editForm.name" label="Item Name" />
          <v-text-field v-model="editForm.price" label="Price" />
          <v-text-field v-model="editForm.stock" label="Stock" />
          <v-radio-group v-model="editForm.active">
            <v-radio label="Set as Active" value="true" />
            <v-radio label="Set as Inactive" value="false" />
          </v-radio-group>
        </v-form>
        <v-card-actions>
          <v-btn color="success" @click="submitEditForm">
            Submit Changes
          </v-btn>
          <v-btn color="error" @click="editDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>Delete an Item</v-card-title>
        <v-form class="mx-4">
          <v-select v-model="selectedItem" :items="itemNames" label="Select item to edit" @input="selectItemToDelete(selectedItem)" />
          <v-checkbox v-model="confirmDelete" label="I'm sure I want to delete this!" />
        </v-form>
        <v-card-actions>
          <v-btn color="error" :disabled="!confirmDelete" @click="deleteItem">
            Delete this Item
          </v-btn>
          <v-btn color="warning" @click="deleteDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snackbar -->
    <Snackbar ref="snackbar" />

    <!-- Stock Management Component -->
    <v-row>
      <v-col>
        <StockManager />
      </v-col>
    </v-row>

    <!-- Manage Menu Card -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-h5">
            Manage Menu
            <v-spacer />
            <div class="v-flex">
              <v-btn color="success" @click="addDialog = true">
                Add New Item
              </v-btn>
              <v-btn color="info" @click="refresh">
                Refresh
              </v-btn>
              <v-btn color="warning" @click="editDialog = true">
                Edit an Item
              </v-btn>
              <v-btn color="error" @click="deleteDialog = true">
                Delete an Item
              </v-btn>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="fill-height">
      <!-- Inactive Items -->
      <v-col>
        <v-card class="pb-4 fill-height">
          <v-card-title>
            <h4 class="text-h5">
              Inactive Items
            </h4>
          </v-card-title>
          <v-simple-table class="mx-3">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Toggle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in inactiveMenu" :key="item._id">
                  <td>{{ item._id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.price }}</td>
                  <td v-if="item.stock !== 0">
                    {{ item.stock }}
                  </td>
                  <td v-if="item.stock === 0" class="error white--text font-weight-bold">
                    OUT OF STOCK
                  </td>
                  <td>
                    <v-btn color="secondary" @click="setActiveStatus(item, true)">
                      Set as Active
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      <!-- Active Items -->
      <v-col>
        <v-card class="pb-4 fill-height">
          <v-card-title>
            <h4 class="text-h5">
              Active Items
            </h4>
          </v-card-title>
          <v-simple-table class="mx-3">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Toggle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activeMenu" :key="item._id">
                  <td>{{ item._id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.price }}</td>
                  <td v-if="item.stock !== 0">
                    {{ item.stock }}
                  </td>
                  <td v-if="item.stock === 0" class="error white--text font-weight-bold">
                    OUT OF STOCK
                  </td>
                  <td>
                    <v-btn color="warning" @click="setActiveStatus(item, false)">
                      Set as Inactive
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Snackbar from '../components/Snackbar'
import StockManager from '../components/StockManager'

export default {
  layout: 'Base',
  components: {
    Snackbar,
    StockManager
  },
  data () {
    return {
      menu: [],
      snackbar: false,
      snackbarMessage: '',
      // Add Dialog
      addDialog: false,
      addForm: {
        name: '',
        price: 0,
        stock: 0,
        active: 'false'
      },
      editDialog: false,
      selectedItem: '',
      editForm: {
        name: '',
        price: 0,
        stock: 0,
        active: 'false'
      },
      deleteDialog: false,
      itemToDelete: '',
      confirmDelete: false
    }
  },
  computed: {
    activeMenu () {
      return this.menu.filter(function (el) {
        return el.active === true
      })
    },
    inactiveMenu () {
      return this.menu.filter(function (el) {
        return el.active === false
      })
    },
    itemNames () {
      return this.menu.map(item => item.name)
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
    async submitAddForm () {
      const newItem = {
        name: this.addForm.name,
        price: this.addForm.price,
        stock: Number(this.addForm.stock),
        active: (this.addForm.active === 'true')
      }
      const res = await axios.post('/api/menu', newItem)
      if (res.status === 201) {
        this.$refs.snackbar.sendMessage('Item successfully created!')
        this.refresh(false)
      }
    },
    async submitEditForm () {
      this.editForm.active = (this.editForm.active === 'true')
      const res = await axios.patch(`/api/menu/search?id=${this.editForm.id}`, this.editForm)
      if (res.status === 200) {
        this.$refs.snackbar.sendMessage('Item edited successfully.')
        this.editForm = {
          name: '',
          price: 0,
          active: false
        }
        this.refresh(false)
      }
    },
    async refresh (showDefaultMessage = true) {
      const menu = await axios.get('/api/menu')
      this.menu = menu.data.res
      if (showDefaultMessage) {
        this.$refs.snackbar.sendMessage('Data has been refreshed.')
      }
    },
    async setActiveStatus (item, active) {
      item.active = active
      const res = await axios.patch(`/api/menu/search?id=${item._id}`, item)
      if (res.status === 200) {
        this.$refs.snackbar.sendMessage('Item moved successfully.')
      }
      this.refresh(false)
    },
    selectItem (selectedItem) {
      const searchedItem = this.menu.filter(item => item.name === selectedItem)[0]
      this.editForm.id = searchedItem._id
      this.editForm.name = searchedItem.name
      this.editForm.price = searchedItem.price
      this.editForm.active = searchedItem.active
    },
    selectItemToDelete (selectedItem) {
      const searchedItem = this.menu.filter(item => item.name === selectedItem)[0]
      this.itemToDelete = searchedItem._id
    },
    async deleteItem () {
      const res = await axios.delete(`/api/menu/search?id=${this.itemToDelete}`)
      if (res.status === 204) {
        this.$refs.snackbar.sendMessage('Item deleted successfully')
        this.confirmDelete = false
        this.refresh(false)
      }
    }
  }
}
</script>

<style>

</style>
