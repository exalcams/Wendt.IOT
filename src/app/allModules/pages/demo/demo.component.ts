import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails, TransDetails } from 'app/models/master';
import { fuseAnimations } from '@fuse/animations';
import { ExcelService } from 'app/services/excel.service';
import { IOTService } from 'app/services/iot.service';
import { DeviceDetails } from 'app/models/IOTClass';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DemoComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  public isVisible: boolean;
  defaultValue: string;
  DeviceDetailsList: DeviceDetails[] = [];
  @ViewChild('myCanvas') canvas: ElementRef;
  widget5: any = {};
  // private LinItemList: LineItems[];
  TransDetailsList: TransDetails[] = [];
  TransDetailsDataSource: MatTableDataSource<TransDetails>;
  @ViewChild(MatPaginator) TransDetailsPaginator: MatPaginator;
  @ViewChild(MatSort) TransDetailsSort: MatSort;
  @ViewChild('TransDetailsTable') TransDetailsTable: ElementRef;
  TransDetailsColumns: string[] = ['Location', 'StartDate', 'EndDate', 'TubID', 'Usage', 'Status'];
  constructor(
    private _router: Router,
    private excelService: ExcelService,
    private _iotService: IOTService,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public snackBar: MatSnackBar) {
    matIconRegistry.addSvgIcon('pdficon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/pdf.svg'));
    matIconRegistry.addSvgIcon('questionmarkicon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/noun-help-922772.svg'));
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('Dashboard') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.isVisible = false;
    this.defaultValue = 'All';
    this.GetDeviceDetails();

  }

  GetDeviceDetails(): void {
    this._iotService.GetDeviceDetails().subscribe(
      (data) => {
        this.DeviceDetailsList = data as DeviceDetails[];
        console.log(this.DeviceDetailsList);
      },
      (err) => {
        console.error(err);
      }
    );
  }

}




