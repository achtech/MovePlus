import  {  Component,  OnInit  }  from  '@angular/core';
import  {  CommonModule  }  from  '@angular/common';
import  {  CardModule  }  from  'primeng/card';
import  {  ChartModule  }  from  'primeng/chart';

import  {  PatientService  }  from  '../patients/patient.service';
import  {  SeanceService  }  from  '../seances/seance.service';
import {  PaymentService  }  from  '../payments/payment.service';

@Component({
    selector:  'app-dashboard',
    standalone:  true,
    imports:  [CommonModule,  CardModule,  ChartModule],
    templateUrl:  './dashboard.component.html',
    styleUrls:  ['./dashboard.component.scss']
})
export  class  DashboardComponent  implements  OnInit  {

    //  OLD  FUNCTIONALITY
    totalPatients  =  0;

    seancesToday  =  0;
    seancesWeek  =  0;
    seancesMonth  =  0;

    paymentsToday  =  0;
    paymentsWeek  =  0;
    paymentsMonth  =  0;

    //  NEW  FUNCTIONALITY
    allPayments:  any[]  =  [];
    barSeancesData:  any;
    barSeancesOptions:  any;

    donutPaymentsData:  any;
    donutPaymentsOptions:  any;

    constructor(
        private  patientService:  PatientService,
        private  seanceService:  SeanceService,
        private  paymentService:  PaymentService
    )  {}

    ngOnInit()  {
        this.loadStats();
        this.loadCharts();
    }

   //  ---------------------------
    //  LOAD  STATISTICS
    //  ---------------------------
    loadStats()  {
        //  PATIENTS
        this.patientService.getPatients().subscribe(patients  =>  {
            this.totalPatients  =  patients.length;
        });

        //  SEANCES
        this.seanceService.getSeances().subscribe(seances  =>  {
            const  now  =  new  Date();
            const  startOfWeek  =  this.getStartOfWeek(now);
           const  startOfMonth  =  new  Date(now.getFullYear(),  now.getMonth(),  1);

            this.seancesToday  =  seances.filter(s  =>
                this.isSameDay(new  Date(s.dateTime),  now)
            ).length;

            this.seancesWeek  =  seances.filter(s  =>
                new  Date(s.dateTime)  >=  startOfWeek
            ).length;

            this.seancesMonth  = seances.filter(s  =>
                new  Date(s.dateTime)  >=  startOfMonth
            ).length;
        });

        //  PAYMENTS
        this.paymentService.getPayments().subscribe(payments  =>  {
            this.allPayments  =  payments;

            const  now  =  new  Date();
            const  startOfWeek  =  this.getStartOfWeek(now);
            const  startOfMonth =  new  Date(now.getFullYear(),  now.getMonth(),  1);

            this.paymentsToday  =  payments
                .filter(p  =>  this.isSameDay(new  Date(p.date),  now))
                .reduce((sum,  p)  =>  sum  +  p.amount,  0);

            this.paymentsWeek  =  payments
                .filter(p  =>  new  Date(p.date)  >=  startOfWeek)
                .reduce((sum,  p)  =>  sum +  p.amount,  0);

            this.paymentsMonth  =  payments
                .filter(p  =>  new  Date(p.date)  >=  startOfMonth)
                .reduce((sum,  p)  =>  sum  +  p.amount,  0);
        });
    }

    //  ---------------------------
    //  UTILITIES
    //  ---------------------------
    isSameDay(d1:  Date,  d2:  Date):  boolean  {
        return  d1.getFullYear()  ===  d2.getFullYear() &&
                      d1.getMonth()  ===  d2.getMonth()  &&
                      d1.getDate()  ===  d2.getDate();
    }

    getStartOfWeek(date:  Date):  Date  {
        const  d  =  new  Date(date);
        const  day  =  d.getDay();
        const  diff  =  d.getDate()  -  day  +  (day  ===  0  ?  -6  :  1);
       return  new  Date(d.setDate(diff));
    }

    countPaymentsByMethod(method:  string):  number  {
        return  this.allPayments.filter(p  =>  p.method  ===  method  ||  p.status  ===  method).length;
    }

    //  ---------------------------
    //  CHARTS
    //  ---------------------------
    loadCharts()  {

        //  BAR  CHART  -  SEANCES  PAR  MOIS
        this.barSeancesData  =  {
            labels:  ['Jan',  'Fév',  'Mar',  'Avr',  'Mai',  'Juin', 'Juil',  'Août',  'Sep',  'Oct',  'Nov',  'Déc'],
            datasets:  [
                {
                    label:  'Séances  par  mois',
                    data:  [40,  35,  50,  60,  70,  65,  80,  90,  75,  85,  95,  110],
                    backgroundColor:  '#42A5F5',
                   borderColor:  '#1E88E5',
                    borderWidth:  1
                }
            ]
        };

        this.barSeancesOptions  =  {
            responsive:  true,
            plugins:  {
                legend:  {  position:  'top'  }
           }
        };

        //  DONUT  CHART  -  REPARTITION  DES  PAIEMENTS
        this.donutPaymentsData  =  {
            labels:  ['CASH',  'CARD',  'PENDING'],
            datasets:  [
                {
                    data:  [
                        this.countPaymentsByMethod('CASH'),
                       this.countPaymentsByMethod('CARD'),
                        this.countPaymentsByMethod('PENDING')
                    ],
                    backgroundColor:  ['#66BB6A',  '#42A5F5',  '#FFA726'],
                    hoverBackgroundColor:  ['#81C784',  '#64B5F6',  '#FFB74D']
                }
           ]
        };

        this.donutPaymentsOptions  =  {
            responsive:  true,
            plugins:  {
                legend:  {  position:  'bottom'  }
            }
        };
    }
}
