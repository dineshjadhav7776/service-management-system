import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Service } from './service.model';

@Injectable({
  providedIn: 'root'
})
export class CrudserviceService {

  serviceID = new Subject<any>();

  constructor(private _http: HttpClient) { }

  getAllService(): Observable<any> {
      return this._http.get('http://139.162.53.200:2000/api/servicePhoto?isPagination=&pageNo=1&pageSize=5');
  }
  addNewService(ServiceData): Observable<any> {
    return this._http.post('http://139.162.53.200:2000/api/servicePhoto/',ServiceData)
  }
  removeService(ServiceId : string): Observable<any> {
    return this._http.delete('http://139.162.53.200:2000/api/servicePhoto/'+ ServiceId)
  }
  updateService(ServiceData): Observable<any> {
    return this._http.put('http://139.162.53.200:2000/api/servicePhoto', ServiceData)
  }
  getCurrentServiceId(id : string): void {
    this.serviceID.next(id)
  }
}
