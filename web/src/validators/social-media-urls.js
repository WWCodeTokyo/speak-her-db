import { helpers } from 'vuelidate/lib/validators';

const linkedinUrl = (value) => {
  const regex = /^http(s*):\/\/(www.)?linkedin.com\/((in\/[^/]+\/?)|(pub\/[^/]+\/((\w|\d)+\/?){3}))$/;
  return !helpers.req(value) || regex.test(value);
};

/*
linkedin profile url format examples:
http://uk.linkedin.com/pub/some-name/1/1b3/b45/
http://www.linkedin.com/in/aname/
http://www.linkedin.com/in/another-name
http://linkedin.com/in/name
http://nl.linkedin.com/in/name
*/

const facebookUrl = (value) => {
  const regex = /^http(s*):\/\/(www.)?facebook.com\/[a-zA-Z0-9.]+\/?$/;
  return !helpers.req(value) || regex.test(value);
};

/*
facebook profile url format examples:
https://www.facebook.com/aname
https://www.facebook.com/aname/
https://www.facebook.com/another.name
*/

const twitterUrl = (value) => {
  const regex = /^http(s*):\/\/(www.)?twitter.com\/([a-zA-Z0-9_]+)+\/?$/;
  return !helpers.req(value) || regex.test(value);
};

/*
twitter profile url format examples:
https://twitter.com/aname
https://twitter.com/aname/
*/

export { linkedinUrl, facebookUrl, twitterUrl };
