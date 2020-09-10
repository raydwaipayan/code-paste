<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="dark" class="px-sm-5">
      <b-navbar-brand href="#">
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
          <b-nav-item href="#">
            Status
          </b-nav-item>
          <b-nav-item-dropdown text="More" right>
            <b-dropdown-item href="#">
              <fa :icon="['fab', 'github']"> </fa>
              Source
            </b-dropdown-item>
            <b-dropdown-item href="#">
              About
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<style scoped>
.brand {
  color: #db4ed0;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
