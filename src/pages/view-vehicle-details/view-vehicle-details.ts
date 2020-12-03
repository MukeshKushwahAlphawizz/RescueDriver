import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";

@IonicPage()
@Component({
  selector: 'page-view-vehicle-details',
  templateUrl: 'view-vehicle-details.html',
})
export class ViewVehicleDetailsPage {

  userData:any='';
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public user:User,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  view_details(url,document_type) {
    this.navCtrl.push('ChangeVehicleDetailsPage',{vehicleImage:url,document_type:document_type,profile_id:this.userData.id})
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }

  save() {
    /*this.util.presentLoader();
    let formData = new FormData();
    formData.append('profile_id',this.userData.id);
    formData.append('document_type',this.document_type);
    formData.append('vehicle_registration',this.vehicleRegistration);
    formData.append('driving_licence',this.drivingLicence);
    formData.append('insurance_doc',this.insuranceDoc);
    formData.append('vehicle_image',this.vehicleImage);
    formData.append('background_check',this.backgroundCheck);
    this.user.driverDocumentUpload(formData).subscribe(res=>{
      let resp :any = res;
      if (resp.status){
        this.util.presentToast(resp.message);
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },300);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    });*/
  }
}
