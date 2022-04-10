import {Component, OnInit} from '@angular/core';
import {Employee} from "./model/employee";
import {EmployeeService} from "./services/employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'employeemangerapp';
   employees!:Employee[];
   formAdd!:FormGroup;
   formEdit!:FormGroup;
   employeeId?:number;
   deletedEmployee?:Employee;
   editedEmployee?:Employee;
   keySearch:string ="";
   constructor(private serviceEmployee:EmployeeService,
               private fb:FormBuilder,
               private activatedRoute:ActivatedRoute) {
     //this.employeeId = this.activatedRoute.snapshot.params['id'];
   }
  getEmployees():void{
     this.serviceEmployee.getEmployee()
       .subscribe((response)=>{
         this.employees = response
       },
         (error:HttpErrorResponse) => {
           alert(error.message);
         }
       )
  }

  ngOnInit(): void {
    this.getEmployees();
     this.formAdd = this.fb.group({
       name:['',Validators.required],
       email:['',Validators.required],
       jobTitle:['',Validators.required],
       phone:['',Validators.required],
       imageUrl:['',Validators.required]
     });

      this.getEditEmployee(this.employeeId);

  }
  public openModal(mode:String,employee?:Employee):void{
     const button = document.createElement('button');
     const container = document.getElementById("main-container");
     button.type ='button';
     button.style.display ='none';
     button.setAttribute("data-bs-toggle","modal");
     if(mode==="add"){
       button.setAttribute("data-bs-target","#addEmployeeModal");
     }
     if(mode==="edit"){
       this.editedEmployee=employee;
       button.setAttribute("data-bs-target","#editEmployeeModal");

       this.getEditEmployee(employee?.id);
     }
     if(mode==="delete"){
       this.deletedEmployee =employee;
       button.setAttribute("data-bs-target","#deleteEmployeeModal");
     }
     container?.appendChild(button);
     button.click();
  }

  getEditEmployee(id: number | undefined){
   this.serviceEmployee.getOneEmployee(id)
     .subscribe((employee)=>{
       this.formEdit = this.fb.group({
         id:[employee.id,Validators.required],
         name:[employee.name,Validators.required],
         email:[employee.email,Validators.required],
         jobTitle:[employee.jobTitle,Validators.required],
         phone:[employee.phone,Validators.required],
         imageUrl:[employee.imageUrl,Validators.required]
       })
     })
  }

  onSaveEmployee() {
    this.serviceEmployee.addEmployee(this.formAdd?.value)
      .subscribe((response)=>{
        alert("Success!");
        //this.formAdd.reset();
        this.getEmployees();
      }),
      (error:HttpErrorResponse)=>{
        alert(error.message);
      }
  }

  onUpdateEmployee() {
    this.serviceEmployee.updateEmployee(this.formEdit.value)
      .subscribe((response)=>{
         alert("Success !!");
         this.getEmployees();
       }),
      (error:HttpErrorResponse)=>{
       alert(error.message);
      }
  }

  deleteEmployee(id?:number) {
     this.serviceEmployee.deleteEmployee(id)
       .subscribe((response)=>{
         //alert("success");
         this.getEmployees();
       })

  }

  noDeleteEmployee() {
    this.getEmployees();
  }
  public onSearchEmployee(key:string):void{
     const results:Employee[]=[];
     for(const employee of  this.employees){
       if(employee.name.toLowerCase().indexOf(key.toLowerCase())!=-1
       ||employee.email.toLowerCase().indexOf(key.toLowerCase())!=-1
       || employee.phone.toLowerCase().indexOf(key.toLowerCase())!=-1
       ||employee.jobTitle.toLowerCase().indexOf(key.toLowerCase())!=-1){
         results.push(employee);
       }


    }
    this.employees =results;
     if(this.employees.length===0 ||!key){
       this.getEmployees();
     }
  }
}
