<template>
  <v-card class="fluid fill-height">
    <v-card-title class="text-h4">
      Users
    </v-card-title>
    <v-divider />
    <v-list>
      <v-list-item v-for="user in users" :key="user.username">
        <v-list-item-content>
          <v-list-item-title class="text-h5" v-text="user.username" />
        </v-list-item-content>
        <v-list-item-action>
          <v-btn color="warning">
            Edit
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn color="error">
            Delete
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['users'],
  data () {
    return {
      highlightedUser: Object
    }
  }
}
</script>

<style>

</style>
