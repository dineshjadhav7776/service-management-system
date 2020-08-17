import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudserviceService } from '../shared/crudservice.service'
import { Service } from '../shared/service.model'
import { Router } from '@angular/router';
import { Subscription, Subscribable } from 'rxjs';

@Component({
  selector: 'app-all-service',
  templateUrl: './all-service.component.html',
  styleUrls: ['./all-service.component.css']
})
export class AllServiceComponent implements OnInit , OnDestroy {
  serviceInfo;
  p: number = 0;
  isError = false;
  imageInfo;
  isLoading = false;
  fetchUrl: false;
  imageURL: string = "http://139.162.53.200:2000/";
  editMode = false;
  defoultImage: string = "/assets/image/error.jpg";
  NoImage: string = "/assets/image/no_image.png";

  getAllServiceSub: Subscription;
  removeServiceSub: Subscription;

  constructor(
    private crud_Service: CrudserviceService,
    private router: Router) { }

  ngOnInit(): void {
    this.getServices();
  }

  // delete service
  onDelete(id) {
    if(confirm('Are you sure to delete this Service ?')) {
      this.removeServiceSub = this.crud_Service.removeService(id).subscribe((res : Service) => {
        this.getServices();
      })
    }
  }

  // get all services
  getServices() {
    this.isLoading = true;
    this.getAllServiceSub = this.crud_Service.getAllService().subscribe((response : Service) => {
      if(response){
        this.isLoading = false;
        this.serviceInfo = response.response.list;
        this.imageInfo = this.serviceInfo.map(element =>{    
          return element.photo;  
        })
      }
    }, error =>{
      this.isLoading = false;
      this.isError = true;
    })
  }

  ngOnDestroy() {
    if (this.getAllServiceSub) {
      this.getAllServiceSub.unsubscribe();
    }
    if (this.removeServiceSub) {
      this.removeServiceSub.unsubscribe();
    }
  }
}
