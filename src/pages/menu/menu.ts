import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {User} from "../../providers";
import {SocialSharing} from "@ionic-native/social-sharing";


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = '';
  userData : any = {};
  constructor(public navCtrl: NavController,
              public user:User,
              public share:SocialSharing,
              public storage:Storage,
              public util:UtilProvider) {
    storage.get('startedTripData').then(startedTripData=>{
      if (startedTripData){
        this.rootPage = 'TrackLocationPage';
      }else {
        this.rootPage = 'HomePage'
      }
    })
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  openPage(page) {
    this.nav.setRoot(page);
  }

  edit_profile() {
    this.navCtrl.push('EditProfilePage');
  }
  help() {
    this.navCtrl.push('HelpPage');
  }

  logout() {
    this.util.presentConfirm('Are you Sure?','You want to logout.').then(()=>{
      this.util.presentLoader();
      let data = new FormData();
      data.append('user_id',this.userData.id);
      data.append('login_type','2');
      this.user.logout(data).subscribe(res=>{
        let resp : any = res;
        this.util.presentToast(resp.message);
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
        if (resp.status){
          this.storage.set('userData',null);
          this.navCtrl.setRoot('LoginPage');
        }
      },error => {
        console.log(error);
        this.util.dismissLoader();
      })
    }).catch(()=>{})
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }

  openMenu() {
    this.getUserData();
  }

  shareApp() {
    this.share.share('Rescue Any Car : Check the great app which I am using : ','','','https://play.google.com/store/apps/details?id=com.alpha.rescuedriver');
  }
}
