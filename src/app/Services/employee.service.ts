import { Injectable } from '@angular/core';
import { API_URL } from '../ApiUrl';

@Injectable({
  providedIn: 'root'
})


export class EmployeeService {

  api_url = API_URL + 'employee';

  

}
