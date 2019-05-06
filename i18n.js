import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
//import Expo from 'expo';
import { Localization } from 'expo';
// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // async detection
  detect: (cb) => {
    return Localization.getLocalizationAsync()
      .then(lng => { console.log("detected lng = " + lng);
      cb(Localization.locale.split("_")[0]); 
        
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