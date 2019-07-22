import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { StatusCount, DeviceDetails } from 'app/models/IOTClass';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IOTService {

    baseAddress: string;


    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.baseAddress = _authService.baseAddress;
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error || error.message || 'Server Error');
    }
    GetStatusCount(): Observable<StatusCount | string> {
        return this._httpClient.get<StatusCount>(`${this.baseAddress}api/IOT/GetStatusCount`)
            .pipe(catchError(this.errorHandler));
    }
    GetDeviceDetails(): Observable<DeviceDetails[] | string> {
        return this._httpClient.get<DeviceDetails[]>(`${this.baseAddress}api/IOT/GetDeviceDetails`)
            .pipe(catchError(this.errorHandler));
    }
}
