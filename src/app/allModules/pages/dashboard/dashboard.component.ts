import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { AuthenticationDetails, TransDetails } from 'app/models/master';
import { fuseAnimations } from '@fuse/animations';
import { ExcelService } from 'app/services/excel.service';
import { StatusCount } from 'app/models/IOTClass';
import { IOTService } from 'app/services/iot.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  public isVisible: boolean;
  defaultValue: string;
  statusCount: StatusCount;
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
    this.statusCount = new StatusCount();
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
    this.GetStatusCount();

    this.defaultValue = 'All';

    const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#64a9e4');
    gradient.addColorStop(1, '#f6fbfe');

    this.widget5 = {
      // chartType: 'bar',
      chartType: 'line',
      data: {
        labels: ['WED', 'TUE', 'MON', 'SUN', 'SAT', 'FRI', 'THU'],
        datasets: [
          {
            type: 'line',
            label: '',
            data: [5, 10, 5, 12, 15, 11, 15],
            fill: true,
            lineTension: 0.4,
            borderColor: ['#2c89da'],
            backgroundColor: gradient,
            // pointBackgroundColor: '#71a5e2',
            // pointBorderColor: '#FFFFFF',
            // pointBorderWidth: 5,
            // pointRadius: 10,
            // pointHoverRadius: 10,
          },
          // {
          //   type: 'bar',
          //   plot: {
          //     'aspect': 'cone'
          //   },
          //   label: '',
          //   data: [18, 26, 40, 52, 70, 75, 65, 47, 35, 55, 65],
          //   fill: false,
          //   lineTension: 0.4,
          //   backgroundColor: '#71a5e2',
          //   borderColor: '#71a5e2',
          //   borderWidth: 1
          // },
        ],
      },
      options: {
        responsive: true,
        title: {
          text: '',
          display: true
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            barPercentage: 0.3,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 20,
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    };
    // const Trans: TransDetails = {
    //   Location: 'Bangalore', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
    // };
    // this.TransDetailsList.push(Trans);
    this.TransDetailsList = [
      {
        Location: 'Bangalore', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Chennai', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Hydrabad', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Delhi', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Mumbai', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Pune', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Goa', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Noida', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Kolkata', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Ranchi', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Madurai', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      },
      {
        Location: 'Coimbatore', StartDate: new Date(), EndDate: new Date(), TubID: '#TID123456789', Usage: '5 hours', Status: 'Not in use'
      }

    ];
    this.TransDetailsDataSource = new MatTableDataSource(this.TransDetailsList);
    this.TransDetailsDataSource.paginator = this.TransDetailsPaginator;
    this.TransDetailsDataSource.sort = this.TransDetailsSort;
  }

  GetStatusCount(): void {
    this._iotService.GetStatusCount().subscribe(
      (data) => {
        this.statusCount = data as StatusCount;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  applyFilterTransDetails(filterValue: string): void {
    this.TransDetailsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.TransDetailsDataSource.paginator) {
      this.TransDetailsDataSource.paginator.firstPage();
    }

  }
  exportAsXLSX(): void {
    const currentPageIndex = this.TransDetailsDataSource.paginator.pageIndex;
    const PageSize = this.TransDetailsDataSource.paginator.pageSize;
    const startIndex = currentPageIndex * PageSize;
    const endIndex = startIndex + PageSize;
    const itemsShowed = this.TransDetailsList.slice(startIndex, endIndex);
    this.excelService.exportAsExcelFile(itemsShowed, 'sample');
    // const itemsShowed1 = this.TransDetailsTable.nativeElement;
    // this.excelService.exportTableToExcel(itemsShowed1, 'Sample');
  }

}




