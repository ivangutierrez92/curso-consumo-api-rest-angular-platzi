import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from './../models/product.model';
import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/v1/products`;

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      retry(3),
      map((products) =>
        products.map((item) => {
          return {
            ...item,
            taxes: 0.19 * item.price,
          };
        })
      )
    );
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          return throwError(() => new Error('Algo está fallando en el server'));
        }
        if (error.status === 404) {
          return throwError(() => new Error('El producto no fue encontrado'));
        }
        if (error.status === 401) {
          return throwError(() => new Error('No estás autorizado'));
        }
        console.log(error);
        return throwError(() => new Error('Ups, algo salió mal'));
      })
    );
  }

  getProductByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(this.apiUrl, {
      params: { limit, offset },
      context: checkTime(),
    });
  }

  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(
      `${environment.API_URL}/api/v1/categories/${categoryId}/products`,
      { params }
    );
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }
  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
