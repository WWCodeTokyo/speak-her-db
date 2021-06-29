<template>
  <v-form
    class="my-3"
    @submit.prevent="handleSubmit()"
  >
    <name-input
      v-model="form.name"
      :english-errors="englishErrors"
      :japanese-errors="japaneseErrors"
      @touch-english="handleTouchNameEn()"
      @touch-japanese="$v.form.name.ja.$touch()"
    />
    <v-row dense>
      <v-col
        cols="12"
        md="6"
        xs="12"
      >
        <v-text-field
          v-model="form.email"
          :label="$t('nominateSpeaker.email')"
          outlined
          :error-messages="emailErrors($v.form.email)"
          @input="handleEmailInput()"
          @blur="handleEmailInput()"
        />
      </v-col>
      <pronoun-input
        v-model="form.pronouns"
        :error-messages="pronounsErrors"
      />
    </v-row>
    <job-input
      v-model="form.job"
      :job-title-errors="jobTitleErrors"
      :company-errors="companyErrors"
    />
    <secondary-affiliation-input
      v-model="form.affiliation"
      :secondary-title-errors="secondaryTitleErrors"
      :secondary-affiliation-errors="secondaryAffiliationErrors"
    />
    <location-input
      v-model="form.location"
      :city-errors="cityErrors"
      :prefecture-errors="prefectureErrors"
      @touch-city="$v.form.location.city.$touch()"
      @touch-prefecture="$v.form.location.prefecture.$touch()"
    />
    <v-textarea
      id="speaker-bio"
      v-model="form.speaker_bio"
      :label="$t('nominateSpeaker.bio.label')"
      :hint="$t('nominateSpeaker.bio.hint')"
      persistent-hint
      outlined
      :error-messages="speakerBioErrors"
      @input="delayTouch($v.form.speaker_bio)"
      @blur="delayTouch($v.form.speaker_bio)"
    />
    <topics-input v-model="form.topics" />
    <v-row dense>
      <language-input
        v-model="form.languages"
        :errors="languagesErrors"
        @input="$v.form.languages.$touch()"
        @blur="$v.form.languages.$touch()"
      />
      <v-col
        cols="12"
        md="6"
        xs="12"
      >
        <v-text-field
          v-model="form.photo_url"
          :label="$t('nominateSpeaker.photoURL')"
          :error-messages="urlErrors($v.form.photo_url)"
          outlined
          @input="delayTouch($v.form.photo_url)"
          @blur="delayTouch($v.form.photo_url)"
        />
      </v-col>
    </v-row>
    <urls-input
      v-model="form.urls"
      :fb-errors="urlErrors($v.form.urls.facebook, 'facebook')"
      :linkedin-errors="urlErrors($v.form.urls.linkedin, 'linkedin')"
      :twitter-errors="urlErrors($v.form.urls.twitter, 'twitter')"
      :website-errors="urlErrors($v.form.urls.website, 'website')"
      :prior-presentation-errors="urlErrors($v.form.urls.priorPresentation)"
      @touch-fb="delayTouch($v.form.urls.facebook)"
      @touch-linkedin="delayTouch($v.form.urls.linkedin)"
      @touch-twitter="delayTouch($v.form.urls.twitter)"
      @touch-website="delayTouch($v.form.urls.website)"
      @touch-prior-presentation="delayTouch($v.form.urls.priorPresentation)"
    />
    <v-checkbox
      v-model="isSelfNomination"
      class="mt-0"
      :label="$t('nominateSpeaker.selfNomination')"
      :hide-details="true"
      @click.capture="handleSelfNomination()"
    />
    <submitter-input
      v-model="form.submitter"
      :name-errors="submitterNameErrors"
      :email-errors="emailErrors($v.form.submitter.email)"
      @touch-name="$v.form.submitter.name.$touch()"
      @touch-email="delayTouch($v.form.submitter.email)"
    />
    <v-checkbox
      v-model="form.consent"
      class="mt-0"
      :label="$t('nominateSpeaker.consent')"
      :error-messages="consentErrors"
      @input="$v.form.consent.$touch()"
      @blur="$v.form.consent.$touch()"
    />
    <v-btn
      class="mr-5"
      @click="resetForm(); clearAlert()"
    >
      {{ $t('actions.resetForm') }}
    </v-btn>
    <v-btn
      color="primary"
      type="submit"
    >
      {{ $t('actions.submit') }}
    </v-btn>
    <variable-alert
      :type="alert.type"
      :message="alert.message"
    />
  </v-form>
</template>

<script>
import NameInput from '@/components/nomination/NameInput.vue';
import JobInput from '@/components/nomination/JobInput.vue';
import SecondaryAffiliationInput from '@/components/nomination/SecondaryAffiliationInput.vue';
import LocationInput from '@/components/nomination/LocationInput.vue';
import UrlsInput from '@/components/nomination/UrlsInput.vue';
import SubmitterInput from '@/components/nomination/SubmitterInput.vue';
import TopicsInput from '@/components/nomination/TopicsInput.vue';
import LanguageInput from '@/components/nomination/LanguageInput.vue';
import PronounInput from '@/components/nomination/PronounInput.vue';
import VariableAlert from '@/components/alerts/VariableAlert.vue';

import { validationMixin } from 'vuelidate';
import {
  required, email, minLength, maxLength, url,
} from 'vuelidate/lib/validators';
import japanese from '@/validators/japanese';
import { linkedinUrl, facebookUrl, twitterUrl } from '@/validators/social-media-urls';

const isTrue = (value) => value;
const touchMap = new WeakMap();
const VALIDATION_DELAY = 1000;
const BIO_LENGTH = 30;
const NAME_LENGTH = 150;
const JOB_FIELDS_LENGTH = 200;
const PRONOUNS_LENGTH = 50;

export default {
  components: {
    NameInput,
    JobInput,
    SecondaryAffiliationInput,
    LocationInput,
    UrlsInput,
    SubmitterInput,
    TopicsInput,
    LanguageInput,
    VariableAlert,
    PronounInput,
  },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        en: {
          required,
          maxLength: maxLength(NAME_LENGTH),
        },
        ja: {
          japanese,
          maxLength: maxLength(NAME_LENGTH),
        },
      },
      job: {
        title: {
          maxLength: maxLength(JOB_FIELDS_LENGTH),
        },
        company: {
          maxLength: maxLength(JOB_FIELDS_LENGTH),
        },
      },
      affiliation: {
        secondary_title: {
          maxLength: maxLength(JOB_FIELDS_LENGTH),
        },
        secondary_affiliation: {
          maxLength: maxLength(JOB_FIELDS_LENGTH),
        },
      },
      email: {
        required,
        email,
      },
      pronouns: {
        maxLength: maxLength(PRONOUNS_LENGTH),
      },
      languages: { required },
      speaker_bio: {
        required,
        minLength: minLength(BIO_LENGTH),
      },
      location: {
        city: { required },
        prefecture: { required },
      },
      consent: {
        isTrue,
      },
      submitter: {
        name: { required },
        email: { required, email },
      },
      photo_url: { url },
      urls: {
        facebook: {
          url,
          facebookUrl,
        },
        twitter: {
          url,
          twitterUrl,
        },
        linkedin: {
          url,
          linkedinUrl,
        },
        website: { url },
        priorPresentation: { url },
      },
    },
  },
  data() {
    return {
      alert: {
        type: '',
        message: '',
      },
      isSelfNomination: false,
      form: {
        name: {
          en: '',
          ja: '',
        },
        email: '',
        pronouns: '',
        photo_url: '',
        job: {
          title: '',
          company: '',
        },
        affiliation: {
          secondary_title: '',
          secondary_affiliation: '',
        },
        speaker_bio: '',
        location: {
          city: '',
          prefecture: '',
        },
        urls: {
          linkedin: '',
          twitter: '',
          facebook: '',
          website: '',
          priorPresentation: '',
        },
        submitter: {
          name: '',
          email: '',
        },
        topics: [],
        languages: [],
        consent: false,
      },
    };
  },
  computed: {
    englishErrors() {
      const errors = [];
      if (!this.$v.form.name.en.$dirty) { return errors; }
      if (!this.$v.form.name.en.required) { errors.push(this.$t('validations.enNameRequired')); }
      if (!this.$v.form.name.en.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [NAME_LENGTH])); }
      return errors;
    },
    japaneseErrors() {
      const errors = [];
      if (!this.$v.form.name.ja.$dirty) { return errors; }
      if (!this.$v.form.name.ja.japanese) { errors.push(this.$t('validations.jaNameCharacters')); }
      if (!this.$v.form.name.ja.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [NAME_LENGTH])); }
      return errors;
    },
    jobTitleErrors() {
      const errors = [];
      if (!this.$v.form.job.title.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [JOB_FIELDS_LENGTH])); }
      return errors;
    },
    companyErrors() {
      const errors = [];
      if (!this.$v.form.job.company.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [JOB_FIELDS_LENGTH])); }
      return errors;
    },
    secondaryTitleErrors() {
      const errors = [];
      if (!this.$v.form.affiliation.secondary_title.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [JOB_FIELDS_LENGTH])); }
      return errors;
    },
    secondaryAffiliationErrors() {
      const errors = [];
      if (!this.$v.form.affiliation.secondary_affiliation.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [JOB_FIELDS_LENGTH])); }
      return errors;
    },
    pronounsErrors() {
      const errors = [];
      if (!this.$v.form.pronouns.maxLength) { errors.push(this.$t('validations.tooManyCharacters', [PRONOUNS_LENGTH])); }
      return errors;
    },
    languagesErrors() {
      const errors = [];
      if (!this.$v.form.languages.$dirty) { return errors; }
      if (!this.$v.form.languages.required) { errors.push(this.$t('validations.languagesRequired')); }
      return errors;
    },
    speakerBioErrors() {
      const errors = [];
      if (!this.$v.form.speaker_bio.$dirty) { return errors; }
      if (!this.$v.form.speaker_bio.required) { errors.push(this.requiredError(this.$t('nominateSpeaker.bio.label'))); }
      if (!this.$v.form.speaker_bio.minLength) { errors.push(this.$t('validations.bioLength', [BIO_LENGTH])); }
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.form.location.city.$dirty) { return errors; }
      if (!this.$v.form.location.city.required) { errors.push(this.requiredError(this.$t('nominateSpeaker.city'))); }
      return errors;
    },
    prefectureErrors() {
      const errors = [];
      if (!this.$v.form.location.prefecture.$dirty) { return errors; }
      if (!this.$v.form.location.prefecture.required) { errors.push(this.requiredError(this.$t('nominateSpeaker.prefecture'))); }
      return errors;
    },
    submitterNameErrors() {
      const errors = [];
      if (!this.$v.form.submitter.name.$dirty) { return errors; }
      if (!this.$v.form.submitter.name.required) { errors.push(this.requiredError(this.$t('nominateSpeaker.submitterName'))); }
      return errors;
    },
    consentErrors() {
      const errors = [];
      if (!this.$v.form.consent.$dirty) { return errors; }
      if (!this.$v.form.consent.isTrue) { errors.push(this.$t('validations.consentRequired')); }
      return errors;
    },
  },
  mounted() {
    // Prevent enter from submitting the form inside the bio text area
    const ENTER = 13;
    document.getElementById('speaker-bio').addEventListener('keypress', (event) => {
      if (event.keyCode === ENTER) {
        event.preventDefault();
      }
    });
  },
  methods: {
    // helper to complete i18n for required field errors
    requiredError(field) {
      return this.$t('validations.fieldRequired', [field]);
    },
    // must pass in this.$v.form.[field]
    emailErrors(field) {
      const errors = [];
      if (!field.$dirty) { return errors; }
      if (!field.email) { errors.push(this.$t('validations.emailValid')); }
      if (!field.required) { errors.push(this.requiredError(this.$t('nominateSpeaker.email'))); }
      return errors;
    },
    // must pass in this.$v.form.[field]
    urlErrors(field, urlName) {
      const errors = [];
      if (!field.$dirty) { return errors; }
      if (!field.url) { errors.push(this.$t('validations.URLValid')); }
      if (urlName === 'linkedin' && !field.linkedinUrl) { errors.push(this.$t('validations.wrongSocialMediaUrl')); }
      if (urlName === 'facebook' && !field.facebookUrl) { errors.push(this.$t('validations.wrongSocialMediaUrl')); }
      if (urlName === 'twitter' && !field.twitterUrl) { errors.push(this.$t('validations.wrongSocialMediaUrl')); }
      return errors;
    },
    resetForm() {
      this.$set(this.form, 'name', { en: '', ja: '' });
      this.$set(this.form, 'email', '');
      this.$set(this.form, 'job', { title: '', company: '' });
      this.$set(this.form, 'affiliation', { secondary_title: '', secondary_affiliation: '' });
      this.$set(this.form, 'speaker_bio', '');
      this.$set(this.form, 'location', { city: '', prefecture: '' });
      this.$set(this.form, 'submitter', { name: '', email: '' });
      this.$set(this.form, 'urls', {
        linkedin: '',
        twitter: '',
        facebook: '',
        website: '',
      });
      this.$set(this.form, 'photo_url', '');
      this.$set(this.form, 'languages', []);
      this.$set(this.form, 'topics', []);
      this.$set(this.form, 'consent', false);
      this.$v.$reset();

      this.isSelfNomination = false;
    },
    handleTouchNameEn() {
      this.$v.form.name.en.$touch();

      if (this.isSelfNomination) {
        this.$set(this.form, 'submitter', { name: this.form.name.en, email: this.form.email });
        this.$v.form.submitter.name.$touch();
      }
    },
    handleEmailInput() {
      this.delayTouch(this.$v.form.email);

      if (this.isSelfNomination) {
        this.$set(this.form, 'submitter', { name: this.form.name.en, email: this.form.email });
        this.$v.form.submitter.email.$touch();
      }
    },
    handleSelfNomination() {
      this.isSelfNomination = !this.isSelfNomination;
      if (!this.isSelfNomination) {
        this.$set(this.form, 'submitter', { name: '', email: '' });
        return;
      }

      this.$set(this.form, 'submitter', { name: this.form.name.en, email: this.form.email });
      this.$v.form.submitter.name.$touch();
      this.$v.form.submitter.email.$touch();
    },
    handleSubmit() {
      // Check validity
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.setAlert('warning', this.$t('validations.invalidForm'));
        return;
      }

      this.clearAlert();

      const payload = this.parseFormData();
      if (process.env.NODE_ENV === 'development') {
        console.log(payload);
      }
      this.$db('People').create(payload, { typecast: true }, this.afterSave);
      this.resetForm();
    },
    // parse the data into the payload format expected by Airtable
    parseFormData() {
      /* eslint-disable camelcase */

      // for existing topics we should send just the id
      const topics = this.form.topics.map((elem) => {
        if (typeof elem === 'object' && elem !== null) {
          return elem.id;
        }
        return elem;
      });

      // for existing languages we should send just the id
      const languages = this.form.languages.map((elem) => {
        if (typeof elem === 'object' && elem !== null) {
          return elem.id;
        }
        return elem;
      });

      // translate the fields into airtable format
      const payloadFields = {
        topics,
        email: this.form.email,
        speaker_bio: this.form.speaker_bio,
        languages,
        pronouns: this.form.pronouns,
        photo_url: this.form.photo_url,
        name_en: this.form.name.en,
        name_ja: this.form.name.ja,
        job_title: this.form.job.title,
        company: this.form.job.company,
        secondary_title: this.form.affiliation.secondary_title,
        secondary_affiliation: this.form.affiliation.secondary_affiliation,
        city: this.form.location.city,
        location_id: [this.form.location.prefecture],
        linkedin_url: this.form.urls.linkedin,
        facebook_url: this.form.urls.facebook,
        twitter_url: this.form.urls.twitter,
        website_url: this.form.urls.website,
        prior_presentation_url: this.form.urls.priorPresentation,
        submitter_name: this.form.submitter.name,
        submitter_email: this.form.submitter.email,
        consent: this.form.consent,
      };

      // Airtable expects an array of objects with the key `fields`
      return [{ fields: payloadFields }];
      /* eslint-enable camelcase */
    },
    afterSave(err, records) {
      if (err) {
        console.error(err);
        this.setAlert('error', this.$t('nominateSpeaker.error', [err]));
      } else {
        console.log(`Successfully saved ${records.length} records!`);
        this.setAlert('success', this.$t('nominateSpeaker.thanks'));
      }
    },
    // delay validation so it's less aggressive
    delayTouch($v) {
      $v.$reset();
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, VALIDATION_DELAY));
    },
    setAlert(type, message) {
      this.$set(this.alert, 'type', type);
      this.$set(this.alert, 'message', message);
    },
    clearAlert() {
      this.$set(this.alert, 'message', '');
    },
  },
};
</script>
