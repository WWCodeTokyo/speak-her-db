<template>
  <v-input
    :error-messages="errors"
  >
    <div
      ref="recaptcha"
      class="g-recaptcha"
      :data-sitekey="siteKey"
    />
  </v-input>
</template>

<script>
export default {
  data() {
    return {
      siteKey: '6LeDFM4ZAAAAAN1WKNFnfD5i6PRjdytIw7hfVHmj',
      id: 0,
      errors: [],
    };
  },
  computed: {
  },
  mounted() {
    if (window.grecaptcha) {
      // eslint-disable-next-line no-undef
      this.id = grecaptcha.render(this.$refs.recaptcha, { sitekey: this.siteKey });
    }
  },
  methods: {
    // TODO: how to trigger this?
    validate() {
      // eslint-disable-next-line no-undef
      const response = grecaptcha.getResponse(this.id);
      if (response.length === 0) {
        this.errors.append(this.$t('recaptcha.required'));
      }
    },
  },
};
</script>
