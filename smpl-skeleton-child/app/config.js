/*---------------------


----------------------*/
var BASE_URL = "http://apps.enarod.org/api/";
var SITE_BASE = "http://enarod.org/";
var RECAPTCHA_SITEKEY =  "6LdlmgwTAAAAANGizfOV2FPzeLXvH10AjLN--NH2";

/**
 * Add local overrides
 */
if (document.location.href.match(/^http:\/\/local\.enarod\.org/)) {
  BASE_URL = "http://dev.enarod.org/api/";
  SITE_BASE = "http://local.enarod.org/";
}
if (document.location.href.match(/^http:\/\/devb\.enarod\.org/)) {
  BASE_URL = "http://dev.enarod.org/api/";
  SITE_BASE = "http://devb.enarod.org/";
}
