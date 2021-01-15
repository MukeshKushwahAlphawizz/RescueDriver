import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import {Config, Events} from "ionic-angular/index";
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../providers/util/util";
import {FCMPluginOnIonic} from "../../plugins/cordova-plugin-fcm-with-dependecy-updated/ionic";

@Component({
  template: `
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = '';

  constructor(private translate: TranslateService, platform: Platform,
              private statusBar: StatusBar,
              private storage: Storage,
              private config: Config,
              private events: Events,
              private util: UtilProvider,
              public fcm : FCMPluginOnIonic,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleLightContent();
      this.splashScreen.hide();

      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }

      this.storage.get('userData').then(userData=>{
        if (userData){
          this.rootPage = 'MenuPage';
        }else {
          this.rootPage = 'LoginPage';
        }
      })

    });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    this.translate.use('en'); // Set your language here

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  getFirebaseToken() {
    this.fcm.requestPushPermission().then(succ=>{
      console.log('app component >> permission asked !!!');
      this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped){
          console.log("Received in background",JSON.stringify(data));
        } else {
          console.log("Received in foreground",JSON.stringify(data));
        }
        console.log("check type >>>>",data.types);
        if (data.types === '1'){
          this.util.presentAlert('Booking',data.body);
          this.events.publish('bookingRequest',true);
        }
      });
    })

    this.fcm.getToken().then(token=>{
      console.log('app component token >>',token);
    })
  }
}
