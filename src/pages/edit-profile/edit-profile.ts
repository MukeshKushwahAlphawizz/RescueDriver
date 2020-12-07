import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {ActionSheetController} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  userData:any = '';
  fullName: any = '';
  mobileNumber: any = '';
  bio: any = '';
  profileImg: any = '';
  profileImgToShow: any = '';
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util : UtilProvider,
              public user : User,
              public actionSheetCtrl:ActionSheetController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  deleteAccount() {
    this.util.presentConfirm('Are you sure?','You want to delete your account').then(()=>{
      this.util.presentLoader();
      let data = {
        user_type:2,
        profile_id:this.userData.id
      }
      this.user.deleteAccount(data).subscribe(res=>{
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
    }).catch(()=>{
    })
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.fullName = this.userData.username;
      this.mobileNumber = this.userData.phone_number;
      this.bio = this.userData.bio;
      this.profileImgToShow = this.userData.image;
    })
  }

  save() {
    if (this.fullName.toString().trim() ===''){
      this.util.presentToast('Enter FullName');
      return;
    }
    if (this.mobileNumber.toString().trim() ===''){
      this.util.presentToast('Enter Mobile Number');
      return;
    }
    this.util.presentLoader();

    let formData = new FormData();
    formData.append('full_name',this.fullName);
    formData.append('mobile',this.mobileNumber);
    formData.append('bio',this.bio.trim());
    formData.append('user_image',this.profileImg);
    formData.append('profile_id',this.userData.id);
    this.user.updateProfile(formData).subscribe(res=>{
      let resp : any = res;
      this.util.presentAlert('',resp.message);
      if (resp.status){
        this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          this.navCtrl.pop();
        });
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
    },error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }

  openPicker() {
    let select = 'Choose or take a picture';
    let takePicture = 'Take a picture';
    let choosePicture = 'Choose picture';
    let actionSheet = this.actionSheetCtrl.create({
      title: select,
      buttons: [
        {
          text: takePicture,
          handler: () => {
            this.util.takePicture().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        },
        {
          text: choosePicture,
          handler: () => {
            this.util.aceesGallery().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }
}
