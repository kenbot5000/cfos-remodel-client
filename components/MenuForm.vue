<template>
  <div>
    <v-dialog v-model="addDialog" width="500">
      <v-card>
        <v-card-title>
          Add menu item
        </v-card-title>
        <v-form class="mx-4">
          <v-text-field v-model="addForm.name" label="Item Name" required />
          <v-text-field v-model="addForm.category" label="Category" hint="Case sensitive." />
          <v-select v-model="addForm.temp" :items="itemTemperatures" label="Temperature" />
          <v-text-field v-model.number="addForm.price" label="Item Price" />
          <v-text-field v-model="addForm.stock" label="Stock" />
          <v-text-field v-model="addForm.flavorString" label="Flavors" hint="Use commas to separate flavors; Case sensitive" />
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
          <v-text-field v-model="editForm.name" label="Item Name" required />
          <v-text-field v-model="editForm.category" label="Category" />
          <v-select v-model="editForm.temp" :items="itemTemperatures" label="Temperature" />
          <v-text-field v-model="editForm.price" label="Price" />
          <v-text-field v-model="editForm.stock" label="Stock" />
          <v-text-field v-model="editForm.flavorString" label="Flavors" hint="Use commas to separate flavors; Case sensitive" />
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
          <v-select v-model="itemToDelete" :items="itemNames" label="Select item to edit" />
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

    <!-- Dialog controls -->
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      // Adding new item
      addDialog: false,
      itemTemperatures: ['Hot', 'Cold', 'Others'],
      addForm: {},

      // Edit item
      itemNames: [],
      editDialog: false,
      editForm: {},
      selectedItem: {},

      // Delete item
      deleteDialog: false,
      itemToDelete: '',
      confirmDelete: false
    }
  },
  watch: {
    // Clears forms when closing dialogs
    addDialog (state) {
      if (!state) { this.addForm = {} }
    },
    editDialog (state) {
      if (!state) { this.editForm = {} }
    },
    deleteDialog (state) {
      if (!state) {
        this.itemToDelete = ''
        this.confirmDelete = false
      }
    }
  },
  async mounted () {
    const res = await axios.get('/api/menu')
    this.itemNames = res.data.res.map(item => item.name)
  },
  methods: {
    async localRefresh () {
      const res = await axios.get('/api/menu')
      this.itemNames = res.data.res.map(item => item.name)
    },
    async submitAddForm () {
      // Formats flavor
      this.addForm.flavor = this.addForm.flavorString.split(',')

      const newItem = {
        name: this.addForm.name,
        category: this.addForm.category,
        temp: this.addForm.temp,
        flavor: this.addForm.flavor,
        price: this.addForm.price,
        active: (this.addForm.active === 'true'),
        stock: Number(this.addForm.stock)
      }
      const res = await axios.post('/api/menu', newItem)
      if (res.status === 201) {
        this.localRefresh()
        this.$emit('refresh', 'Item successfully created.')
      }
    },
    // Searches for an item.
    async selectItem (selectedItem) {
      const res = await axios.get(`/api/menu/search?name=${selectedItem}`)
      this.editForm = res.data.res
      this.editForm.id = res.data.res._id
      this.editForm.active = res.data.res.active ? 'true' : 'false'
      this.editForm.flavorString = this.editForm.flavor
    },
    async submitEditForm () {
      const editedItem = this.editForm
      editedItem.active = (this.editForm.active === 'true')
      try {
        this.editForm.flavor = this.editForm.flavorString.split(',')
      } catch (err) {
        this.editForm.flavor = this.editForm.flavorString
      }
      const res = await axios.patch(`/api/menu/search?id=${editedItem.id}`, editedItem)
      this.editForm.active = res.data.res.active ? 'true' : 'false'
      if (res.status === 200) {
        this.localRefresh()
        this.$emit('refresh', 'Item successfully edited.')
      }
    },
    async deleteItem () {
      const res = await axios.delete(`/api/menu/search?id=${this.itemToDelete}`)
      if (res.status === 204) {
        this.localRefresh()
        this.$emit('refresh', 'Item successfully delted.')
      }
    }
  }
}
</script>

<style>

</style>
