import { Injectable } from '@angular/core';
import { API_URL } from '../ApiUrl';
import { EmployeeModel } from '../Models/EmployeeModel';
import { PaginatedModel } from '../Models/PaginatedModel';
import { ResponseModel } from '../Models/ResponseModel';
import axios from 'axios';

const api_url = API_URL + 'employee';

export async function CreateEmployeeAsync(
  data: EmployeeModel
): Promise<ResponseModel> {
  let result: ResponseModel = {
    error: '',
    data: undefined,
    message: '',
    statusCode: '',
  };

  await axios
    .post(api_url, data)
    .then((response) => {
      result.data = response.data.data;
      result.statusCode = response.data.statusCode;
      console.log(response.data);
      console.log(result);
    })
    .catch((error) => {
      handleError(error, result);
    });

  return result;
}

export async function UpdateEmployeeAsync(
  data: EmployeeModel
): Promise<ResponseModel> {
  let result: ResponseModel = {
    error: '',
    data: undefined,
    message: '',
    statusCode: '',
  };

  await axios
    .put(api_url + `/${data.id}`, data)
    .then((response) => {
      result.data = response.data;
      console.log(response);
    })
    .catch((error) => {
      handleError(error, result);
    });

  return result;
}

export async function DeleteEmployeeAsync(id: number): Promise<ResponseModel> {
  let result: ResponseModel = {
    error: '',
    data: undefined,
    message: '',
    statusCode: '',
  };

  await axios
    .delete(api_url + `/${id}`)
    .then((response) => {
      result.data = response.data;
      console.log(response);
    })
    .catch((error) => {
      handleError(error, result);
    });

  return result;
}

export async function GetEmployeeByIdAsync(id: number): Promise<ResponseModel> {
  let result: ResponseModel = {
    error: '',
    data: undefined,
    message: '',
    statusCode: '',
  };

  await axios
    .get(api_url + `/${id}`)
    .then((response) => {
      result.data = response.data;
      console.log(response);
    })
    .catch((error) => {
      handleError(error, result);
    });

  return result;
}

export async function GetEmployeeAsync(
  data: any,
  sortColumn: string,
  sortOrder: string,
  page: number,
  pageSize: number
): Promise<PaginatedModel> {
  let result: ResponseModel = {
    error: '',
    data: undefined,
    message: '',
    statusCode: '',
  };
  let paginatedResult: PaginatedModel = {
    dataArray: null,
    totalPages: 0,
  };
  await axios
    .post(
      api_url +
        `/paginated?page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      data
    )
    .then((response) => {
      paginatedResult.dataArray = response.data.data.dataArray;
      paginatedResult.totalPages = response.data.data.totalPages;
      console.log(response);
      // console.log(paginatedResult)
    })
    .catch((error) => {
      handleError(error, result);
    });

  return paginatedResult;
}

const handleError = (error: any, result: ResponseModel) => {
  if (error.response) {
    result.error = error.response.data;
    result.statusCode = error.response.status;
    result.message = error.message;
  } else if (error.request) {
    result.error = error.message;
    result.statusCode = error.request.code;
    result.message = error.message;
  } else {
    result.error = 'No response received from server';
    result.statusCode = error.response ? error.response.status : '';
  }
};
