<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="dark" class="px-sm-5">
      <b-navbar-brand :href="getUrl()">
        <b-row class="brand">
          <b-col class="text-center">
            <fa :icon="['far', 'file-code']"></fa>
            Code Paste
          </b-col>
        </b-row>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Details" right>
            <b-dropdown-item href="https://github.com/raydwaipayan/code-paste">
              <fa :icon="['fab', 'github']"> </fa>
              Source
            </b-dropdown-item>
            <b-dropdown-item href="https://github.com/raydwaipayan/code-paste">
              About
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    getUrl() {
      return process.env.baseURL
    }
  }
}
</script>
<style scoped>
.brand {
  color: #db4ed0;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
