import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { CrudserviceService } from '../shared/crudservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Service } from '../shared/service.model';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit, OnDestroy {
  addServiceForm: FormGroup;
  isLoading: boolean = false;
  isError: boolean  = false;
  totolPercentage: number = 0;

  TotalPercentageValuesSub: Subscription;
  UpdateServiceSub : Subscription;
  AddNewServiceSub: Subscription;
  getAllServiceSub: Subscription;
  parameSubcription: Subscription;

  imageURL: string = "/assets/image/noavatar.png";
  fileToUpload: File = null;
  isDisable = false;
  editModeServiceId;
  currentService;
  currentServiceID;

  get TotalPercentageValues(): FormArray {
    return this.addServiceForm.get('words') as FormArray;
  }

  constructor(
    private crud_Service: CrudserviceService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.addServiceForm = this.fb.group({
      'words': this.fb.array([]),
      'image': ['']
    })

    // params subcription for service id
    this.parameSubcription = this.route.params.subscribe(
      (params: Params) =>{
        this.editModeServiceId = params['id'];
    })
    this.editModeServiceId = this.route.snapshot.params['id'];
    
    if(this.editModeServiceId) {
      this.getServices();
    }
    this.getTotalPercentage()
  }

  // form submit
  onSubmit() {
    var uploadData: FormData = new FormData();
    if (this.editModeServiceId) {
      const words = this.addServiceForm.value.words;
      uploadData.append('servicePhotoId', this.editModeServiceId);
      uploadData.append('words', JSON.stringify(words))
      uploadData.append('image', this.fileToUpload);
      this.UpdateServiceSub = this.crud_Service.updateService(uploadData).subscribe(res => {
        alert('Service has been updated successfully');
        this.router.navigate(['/all-service']);
      })
    } else{
      const words = this.addServiceForm.value.words;
      uploadData.append('words', JSON.stringify(words));
      uploadData.append('image', this.fileToUpload);
      this.AddNewServiceSub = this.crud_Service.addNewService(uploadData).subscribe(res => {
        alert('Service has been added successfully');
        this.router.navigate(['/all-service']);
      })
    }
  }

// Add new service 
  AddNew_ServiceWord() {
    this.getTotalPercentage();
    if (this.totolPercentage >= 100) {
      this.isDisable = true;
      alert('Your allocation limit is only upto 100% ! Please manage your allocation')
    } else {
      const control = this.addServiceForm.get('words') as FormArray;
      control.push(this.fb.group({
        word: ['', Validators.required],
        percentage: ['', [Validators.required,Validators.min(1), Validators.max(99)]]
      }))
    }
  }

  // delete formArray 
  deleteServiceWordGroup(index) {
    const add = this.addServiceForm.get('words') as FormArray;
    add.removeAt(index)
  }

  // Upload file
  handleFileInput(file: FileList) {
    this.fileToUpload = <File>file.item(0);
    //show image preview
    var render = new FileReader();
    render.onload = (event: any) => {
      this.imageURL = event.target.result;
    }
    render.readAsDataURL(this.fileToUpload);
  }

// remove uploaded image
  RemoveImage(element) {
    this.fileToUpload = element.item;
    element.value = "";
    this.imageURL = "/assets/image/noavatar.png";
  }

  // get total percenatge of words
  getTotalPercentage() {
    this.TotalPercentageValuesSub = this.TotalPercentageValues.valueChanges.subscribe(data => {
      this.totolPercentage = data.reduce((a, b) => a + +b.percentage, 0);
      if (this.totolPercentage === 100) {
        this.isDisable = true;
      } else {
        this.isDisable = false;
      }
    })
  }

  // get all services
  getServices() {
    this.isLoading = true;
    this.getAllServiceSub = this.crud_Service.getAllService().subscribe((response: Service) => {
      this.isLoading = false;
      this.currentService = response.response.list.filter(element => {
        return element.id == this.editModeServiceId;
      })
      this.currentServiceID = this.currentService[0].words.map(element => {
        const control = this.addServiceForm.get('words') as FormArray;
        control.push(this.fb.group({
          word: [element.word, Validators.required],
          percentage: [element.percentage, [Validators.required, Validators.min(1), Validators.max(99)]]
        }))
      });
    }, error=>{
      this.isError = true;
      this.isLoading = false;
    })
  }
  
  // Unsubscribe to observables
  ngOnDestroy() {
    this.parameSubcription.unsubscribe();
    if (this.UpdateServiceSub) {
      this.UpdateServiceSub.unsubscribe();
    }
    if (this.AddNewServiceSub) {
      this.AddNewServiceSub.unsubscribe();
    }
    if (this.getAllServiceSub) {
      this.getAllServiceSub.unsubscribe();
    }
  }
}
