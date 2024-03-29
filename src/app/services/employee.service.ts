import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../model/employee";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 private apiServerUrl= environment.apiBaseUrl;
  constructor(private http:HttpClient) { }
  public getEmployee():Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`);
  }
  public addEmployee(employee:Employee):Observable<Employee>{
    return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`,employee);
  }
  public updateEmployee(employee:Employee):Observable<Employee>{
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`,employee);
  }
  public deleteEmployee(id: number | undefined):Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${id}`);
  }
  public getOneEmployee(id: number | undefined):Observable<Employee>{
    return this.http.get<Employee>(`${this.apiServerUrl}/employee/find/${id}`);
  }
}
