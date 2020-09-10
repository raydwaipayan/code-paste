<template>
  <div>
    <b-container class="center">
      <p class="text-center lead text font-weight-bold py-4">
        Paste and share code snippets easily
      </p>
      <b-row>
        <b-col sm="4" md="3" lg="2" class="my-auto text">
          Url of this paste:
        </b-col>
        <b-col cols="12" sm="10" md="8" lg="6">
          <div class="d-flex flex-row">
            <b-form-input
              v-model="url"
              readonly
              class="bg-transparent border-secondary text"
              trim
            >
            </b-form-input>
            <div
              class="text btn btn-outline-secondary btn-sm d-flex flex-row ml-2 ml-md-4 my-auto"
              @click.prevent="copyUrl()"
            >
              <fa :icon="['fas', 'copy']" size="lg"></fa>
              <p class="my-1 mx-2">Copy</p>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-container class="px-0 my-4">
        <div
          class="btn btn-outline-info d-flex flex-row fix-size"
          @click.prevent="copyCode()"
        >
          <fa :icon="['far', 'clone']" size="lg"></fa>
          <p class="my-auto pl-2">Copy Text</p>
        </div>
        <client-only placeholder="Codemirror Loading...">
          <codemirror ref="cmEditor" :value="code" :options="cmoptions" />
        </client-only>
      </b-container>
      <b-alert
        :show="dismissCountDown"
        variant="info"
        dismissible
        class="position-fixed fixed-bottom m-0 rounded-0"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        {{ info }}
      </b-alert>
    </b-container>
  </div>
</template>

<script>
export default {
  async asyncData(ctx) {
    const id = ctx.params.id
    try {
      const resp = await ctx.$axios.get('/api/pastes/' + id)
      return {
        code: resp.data.code,
        lang: resp.data.lang,
        key: resp.data.key
      }
    } catch (e) {
      ctx.error({ statusCode: 404, message: 'Paste not found' })
    }
  },
  data() {
    return {
      code: '',
      lang: '',
      key: '',
      url: '',
      info: '',
      dismissSecs: 2,
      dismissCountDown: 0,
      cmoptions: {
        readOnly: true
      }
    }
  },
  mounted() {
    this.url = process.env.baseURL + '/pastes/' + this.key
  },
  methods: {
    async copyUrl() {
      await this.$copyText(this.url)
      this.showAlert('URL copied to clipboard')
    },
    async copyCode() {
      await this.$copyText(this.code)
      this.showAlert('Code Copied to clipboard')
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert(message) {
      this.info = message
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>

<style scoped>
.text {
  color: rgb(219, 177, 149);
}
.fix-size {
  max-width: 8.5rem;
}
</style>
