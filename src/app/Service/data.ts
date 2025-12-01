import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Data {
  private navItems = signal<any[]>([]);
  readonly NavItems = this.navItems.asReadonly();
  constructor(private http:HttpClient){}

  setNavItems(items: any[]) {
    this.navItems.set(items);
  }

  getNavItems() {
    return this.NavItems;
  }

  postData(url: any, data: any) {
    return this.http.post(url, data);
  }
  

  updateData(url:any,data:any) {
    return this.http.put(url,data);
  }

  getData(url:any) {
    return this.http.get(url);
  }

getuserData<T>(url: string, params?: Record<string, any>) {
  let httpParams = new HttpParams();
  if (params) {
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null) {
        httpParams = httpParams.set(k, String(params[k]));
      }
    });
  }
  return this.http.get<T>(url, { params: httpParams });
}


  deleteData(url:any,data:any) {
    return this.http.put(url,data);
  }

  delete(url:any) {
    return this.http.delete(url);
  }

  deleterequestData(url:any,data:any) {
    return this.http.delete(url,data);
  }

  UploadpostData(url: string, data: FormData): Observable<HttpEvent<any>> {
    return this.http.post(url, data, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
