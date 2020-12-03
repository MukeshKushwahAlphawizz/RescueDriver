import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";

@IonicPage()
@Component({
  selector: 'page-change-vehicle-details',
  templateUrl: 'change-vehicle-details.html',
})
export class ChangeVehicleDetailsPage {
  vehicleImage: any = '';
  document_type: any = '';
  profile_id: any = '';
  documentToUpload: any = '';
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public navParams: NavParams) {
    this.vehicleImage = navParams.data.vehicleImage;
    this.document_type = navParams.data.document_type;
    this.profile_id = navParams.data.profile_id;
    console.log('document_type',this.document_type);
  }

  ionViewDidLoad() {
  }

  change() {
    this.navCtrl.pop();
    /*let vehicleRegistration : any = '';
    let drivingLicence : any = '';
    let insuranceDoc : any = '';
    let vehicleImage : any = '';
    let backgroundCheck : any = '';
    if (this.document_type == 1){
     vehicleRegistration = this.documentToUpload;
    }else if (this.document_type == 2){
      drivingLicence = this.documentToUpload;
    }else if (this.document_type == 3){
      insuranceDoc = this.documentToUpload;
    }else if (this.document_type == 4){
      vehicleImage = this.documentToUpload;
    }else if (this.document_type == 5){
      backgroundCheck = this.documentToUpload;
    }

    this.util.presentLoader();
    let formData = new FormData();
    formData.append('profile_id',this.profile_id);
    formData.append('document_type',this.document_type);
    formData.append('vehicle_registration',vehicleRegistration);
    formData.append('driving_licence',drivingLicence);
    formData.append('insurance_doc',insuranceDoc);
    formData.append('vehicle_image',vehicleImage);
    formData.append('background_check',backgroundCheck);
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
