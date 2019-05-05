import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import Expo from 'expo';
// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // async detection
  detect: (cb) => {
    return Expo.DangerZone.Localization.getCurrentLocaleAsync()
      .then(lng => { cb(lng.split("_")[0]); 
        console.log("detected lng = " + lng);
       })
  },
  init: () => {},
  cacheUserLanguage: () => {}
}

i18n
.use(XHR)
  .use(languageDetector)
  .init({
    fallbackLng: 'zh',
    // the translations 
    wait: true,
    ns: ['generals'],
      defaultNS: 'generals',
      backend: {
        // load from i18next-gitbook repo
        loadPath: 'http://139.59.118.93/timescalc/locales/{{lng}}/{{ns}}.json',
        crossDomain: true
      },
      interpolation: {
        escapeValue: false // not needed for react
      }

  });
export default i18n;