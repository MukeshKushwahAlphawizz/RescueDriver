import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class User {

  loginUrl : string = 'Authentication/login';
  driver_registration : string = 'Authentication/driver_registration';
  forgetPasswordUrl : string = 'Authentication/ForgetPassword';
  deleteAccountUrl : string = 'Authentication/DeleteAccount';
  logoutUrl : string = 'Authentication/logout';
  getContentUrl : string = 'Authentication/getcontent';
  driver_update_profile : string = 'Authentication/driver_update_profile';

  get_booking_request : string = 'Drivers/get_booking_request';
  get_route_details : string = 'Drivers/get_route_details';
  accept_booking_request : string = 'Drivers/accept_booking_request';
  my_history : string = 'Drivers/my_history';
  trip_start_end : string = 'Drivers/trip_start_end';
  update_user_lat_lang : string = 'Users/update_user_lat_lang';
  get_notification_list : string = 'Users/get_notification_list';
  clear_notification : string = 'Users/clear_notification';
  driver_document_upload : string = 'Authentication/driver_document_upload';

  constructor(public api: Api) { }

  login(accountInfo: any) {
    let res = this.api.post(this.loginUrl, accountInfo).share();
    return res;
  }

  signup(accountInfo: any) {
    let res = this.api.post(this.driver_registration, accountInfo).share();
    return res;
  }

  forgetPassword(data: any) {
    let res = this.api.post(this.forgetPasswordUrl, data).share();
    return res;
  }
  deleteAccount(data: any) {
    let res = this.api.post(this.deleteAccountUrl, data).share();
    return res;
  }
  logout(data: any) {
    let res = this.api.post(this.logoutUrl, data).share();
    return res;
  }
  getContent(data: any) {
    let res = this.api.post(this.getContentUrl, data).share();
    return res;
  }
  updateProfile(data: any) {
    let res = this.api.post(this.driver_update_profile, data).share();
    return res;
  }
  getAllBookings(data: any) {
    let res = this.api.post(this.get_booking_request, data).share();
    return res;
  }
  getRouteDetails(data: any) {
    let res = this.api.post(this.get_route_details, data).share();
    return res;
  }
  getHistory(data: any) {
    let res = this.api.post(this.my_history, data).share();
    return res;
  }
  tripStartEnd(data: any) {
    let res = this.api.post(this.trip_start_end, data).share();
    return res;
  }

  updateLatLng(data: any) {
    let res = this.api.post(this.update_user_lat_lang, data).share();
    return res;
  }

  getAllNotificationList(data: any) {
    let res = this.api.post(this.get_notification_list, data).share();
    return res;
  }

  clearNotification(data: any) {
    let res = this.api.post(this.clear_notification, data).share();
    return res;
  }
  acceptBooking(data: any) {
    let res = this.api.post(this.accept_booking_request, data).share();
    return res;
  }
  driverDocumentUpload(data: any) {
    let res = this.api.post(this.driver_document_upload, data).share();
    return res;
  }
}
