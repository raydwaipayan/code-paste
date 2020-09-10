<template>
  <div>
    {{ error }}
  </div>
</template>

<script>
export default {
  async asyncData(ctx) {
    const id = ctx.params.id

    try {
      const resp = await ctx.$axios.get('/api/getPaste/' + id)
      return {
        code: resp.code,
        lang: resp.lang,
        expiry: resp.expiry
      }
    } catch (error) {
      return {
        error: error.message
      }
    }
  },
  data() {
    return {
      code: '',
      lang: '',
      expiry: '',
      error: ''
    }
  }
}
</script>
