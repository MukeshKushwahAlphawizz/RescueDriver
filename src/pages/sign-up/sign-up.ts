import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {Platform} from "ionic-angular/index";
import {FCM} from "@ionic-native/fcm";


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signUpForm: FormGroup;
  error_messages: any = {};
  firebaseToken: any = '';
  show: boolean = false;
  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public util:UtilProvider,
              public user : User,
              public fcm : FCM,
              public storage : Storage,
              public platform : Platform,
              public navParams: NavParams) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
    });
    this.setupSignUpForm();
  }

  signUp() {
    let requestData :any = {
      fullName:this.signUpForm.value.fullName,
      email:this.signUpForm.value.email,
      address:this.signUpForm.value.address,
      mobileNumber:this.signUpForm.value.mobileNumber,
      password:this.signUpForm.value.password,
      fcm_token:this.firebaseToken
    }
    this.navCtrl.push('VehicleDetailsPage',{requestData:requestData});
  }

  ionViewDidLoad() {
  }

  setupSignUpForm() {
    this.error_messages = {
      fullName: [
        { type: "required", message: 'FullName is required' },
      ],
      address: [
        { type: "required", message: 'Address is required' },
      ],
      mobileNumber: [
        { type: "required", message: 'Mobile number is required' },
        { type: "minlength", message: '*Minimum length should be 10' },
        { type: "maxlength", message: '*Maximum length should be 12' }
      ],
      email: [
        { type: "required", message: 'Email is required' },
        { type: "pattern", message: '*Enter valid email' },
      ],
      password: [
        { type: "required", message: 'Password is required' },
        { type: "minlength", message: '*Minimum length should be 8' },
      ]
    };
    this.signUpForm = this.formBuilder.group(
      {
        fullName: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        address: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
          ])
        ),
        mobileNumber: new FormControl(
          "", Validators.compose([Validators.required,
            Validators.minLength(10),
            Validators.maxLength(12)
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
          ])
        )
      },
    );
  }

  getFirebaseToken() {
    this.fcm.subscribeToTopic('marketing');
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('token >>>',this.firebaseToken);
    });

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      // console.log('onTokenRefresh called !!!',token);
    });
    this.fcm.unsubscribeFromTopic('marketing');
  }

  back() {
    this.navCtrl.pop();
  }
}
