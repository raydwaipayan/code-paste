<template>
  <b-container>
    <b-row>
      <b-col class="text">
        <p class="text-center lead">
          Paste and share code snippets easily
        </p>
        <b-container class="py-2">
          <div>
            <b-alert
              :show="dismissCountDown"
              variant="danger"
              dismissible
              class="position-fixed fixed-top m-0 rounded-0"
              @dismissed="dismissCountDown = 0"
              @dismiss-count-down="countDownChanged"
            >
              {{ error }}
            </b-alert>
          </div>
          <b-container class="text-center">
            <input
              id="file"
              type="file"
              name="file"
              class="inputfile"
              @change="handleLoad"
            />
            <label class="btn btn-outline-success" for="file"
              >Upload or paste below</label
            >
          </b-container>
          <b-dropdown :text="computeLang()" size="sm" variant="outline-info">
            <div v-for="(item, index) in languages" :key="index">
              <b-dropdown-item
                href="#"
                @click.prevent="handleLangChange(index)"
                >{{ item }}</b-dropdown-item
              >
            </div>
          </b-dropdown>
          <client-only placeholder="Codemirror Loading...">
            <codemirror ref="cmEditor" :value="code" @input="onCmCodeChange" />
          </client-only>
          <b-container class="px-0 darker">
            <div
              v-b-toggle.windows
              class="d-flex shadow-sm my-3 py-2 px-2 darker"
              variant="light"
              @click="activeAdv = !activeAdv"
            >
              <span class="font-weight-bolder h5"> Advanced options </span>
              <fa
                :icon="['fa', activeAdv ? 'chevron-up' : 'chevron-down']"
                class="m-1"
              />
            </div>
            <b-collapse v-model="activeAdv">
              <b-row class="pl-4">
                <b-col class="col-6">
                  <div class="d-flex flex-row">
                    <p class="my-auto">Expiry:</p>
                    <b-dropdown
                      :text="computeExpiry()"
                      variant="outline-danger"
                      size="sm"
                      class="ml-2"
                    >
                      <b-dropdown-item
                        v-for="(item, index) in expiryTimes"
                        :key="index"
                        @click.prevent="handleExpiryChange(index)"
                      >
                        {{ item }}
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
                </b-col>
              </b-row>
              <b-row class="pl-4 py-3">
                <b-col sm="4" md="3" lg="2" class="my-auto">
                  Paste Name:
                </b-col>
                <b-col cols="10" sm="7" md="6" lg="4">
                  <b-form-input
                    v-model="pasteName"
                    maxlength="30"
                    :state="nameState()"
                    placeholder="Default: Random"
                    class="bg-transparent border-secondary"
                    aria-describedby="input-live-help input-live-feedback"
                    trim
                  >
                  </b-form-input>
                  <b-form-invalid-feedback id="input-live-feedback">
                    Enter at least 5 letters
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-collapse>
          </b-container>
          <b-container class="text-center my-2">
            <b-button
              variant="success"
              class="mx-auto"
              @click.prevent="createPaste()"
              >Create Paste
            </b-button>
          </b-container>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>
.text {
  color: rgb(219, 177, 149);
}
.cb {
  background-color: #db4ed0;
}
.darker {
  background-color: #212121;
}
.pu-2 {
  padding-top: 2vh;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>

<script>
export default {
  async asyncData(ctx) {
    const resp = await ctx.$axios.get('/api/getExpiry')
    return { expiryTimes: resp.data.expiryTimes }
  },
  data() {
    return {
      code: '',
      pasteName: '',
      error: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      selectedLang: 6,
      maxSize: 1024 * 1024,
      activeAdv: false,
      languages: [
        'c++',
        'c',
        'dockerfile',
        'go',
        'python',
        'javascript',
        'others'
      ],
      selectedExpiry: 0,
      expiryTimes: []
    }
  },
  methods: {
    computeLang() {
      return 'Language: ' + this.languages[this.selectedLang]
    },
    computeExpiry() {
      return this.expiryTimes[this.selectedExpiry]
    },
    async createPaste() {
      if (this.code.length === 0) {
        this.showAlert('Error!! Nothing to share!')
        return
      }

      let resp
      try {
        resp = await this.$axios.$post('/api/create', {
          code: this.code,
          lang: this.languages[this.selectedLang],
          customKey: this.pasteName,
          expiryIndex: this.selectedExpiry
        })
      } catch (error) {
        this.showAlert('Something went wrong!! Try again later.')
      }
      window.location = resp.url
    },
    handleLoad(el) {
      const file = el.target.files[0]
      if (file.size > this.maxSize) {
        this.showAlert('Error!! File exceeded max size')
        return
      }
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (e) => (this.code = e.target.result)
    },
    handleLangChange(idx) {
      this.selectedLang = idx
      let calcLang = this.languages[idx]
      if (['c++', 'c'].includes(calcLang)) calcLang = 'clike'
      if (calcLang === 'others') calcLang = 'javascript'

      const instance = this.$refs.cmEditor.cminstance
      instance.setOption('mode', calcLang)
    },
    handleExpiryChange(idx) {
      this.selectedExpiry = idx
    },
    nameState() {
      return this.pasteName.length === 0 || this.pasteName.length > 4
    },
    onCmCodeChange(newCode) {
      this.code = newCode
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert(message) {
      this.error = message
      this.dismissCountDown = this.dismissSecs
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>
