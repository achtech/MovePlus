import  {  Component,  OnInit  }  from  '@angular/core';
import {  CommonModule  }  from  '@angular/common';
import  {  FormsModule }  from  '@angular/forms';
import  {  ChartModule  }  from  'primeng/chart';
import { CardComponent } from '../../theme/shared/components/card/card.component';

import  {  PatientService  }  from  '../patients/patient.service';
import  { SeanceService  }  from  '../seances/seance.service';
import  {  PaymentService  } from  '../payments/payment.service';

@Component({
    selector:  'app-dashboard',
   standalone:  true,
    imports:  [CommonModule, FormsModule, ChartModule, CardComponent],
    templateUrl:  './dashboard.component.html',
   styleUrls:  ['./dashboard.component.scss']
})
export  class  DashboardComponent  implements OnInit  {

    //  ---  OLD STATS  ---
    totalPatients  =  0;

   seancesToday  =  0;
    seancesWeek =  0;
    seancesMonth  =  0;

   paymentsToday  =  0;
    paymentsWeek =  0;
    paymentsMonth  =  0;

   //  ---  RAW  DATA  ---
   allPayments:  any[]  =  [];
    allSeances: any[]  =  [];
    allPatients:  any[]  = [];

    //  ---  EXPENSES  (charges du  cabinet)  par  mois  (Jan..Dec)  ---
   expensesByMonth:  number[]  =  [500,  450,  600,  700,  650, 800,  750,  900,  850,  950,  1000,  1100];

   //  ---  CHARTS  ---
   lineStylesData:  any  =  {  labels:  [],  datasets:  [] };
    lineStylesOptions:  any;
    barSeancesData: any;
    barSeancesOptions:  any;

   //  ---  monthly  series  ---
    validatedByMonth: number[]  =  new  Array(12).fill(0);
    pendingByMonth:  number[] =  new  Array(12).fill(0);

    //  --- toggles  ---
    showValidated  =  true;
   showPending  =  true;
    showExpenses  = true;

    //  ---  lists  for yesterday  /  today  /  tomorrow  ---
   seancesYesterday:  Array<{  patientName:  string;  time:  string;  type:  string }>  =  [];
    seancesTodayList:  Array<{  patientName: string;  time:  string;  type:  string  }>  =  [];
   seancesTomorrow:  Array<{  patientName:  string;  time:  string; type:  string  }>  =  [];

   constructor(
        private  patientService:  PatientService,
       private  seanceService:  SeanceService,
       private  paymentService:  PaymentService
   )  {}

    ngOnInit()  {
       this.initChartOptions();
       this.loadStats();
    }

    // ---------------------------
    //  LOAD  STATS
   //  ---------------------------
    loadStats()  {
       //  Patients
       this.patientService.getPatients().subscribe(patients  =>  {
           this.allPatients  =  patients  ||  [];
           this.totalPatients  =  this.allPatients.length;
       });

       //  Seances
        this.seanceService.getSeances().subscribe(seances =>  {
           this.allSeances  =  seances  ||  [];

           const  now  =  new Date();
            const startOfWeek  =  this.getStartOfWeek(now);
           const  startOfMonth  =  new  Date(now.getFullYear(),  now.getMonth(),  1);

            this.seancesToday =  this.allSeances.filter(s  =>  this.isSameDay(new  Date(s.dateTime),  now)).length;
           this.seancesWeek  =  this.allSeances.filter(s  => new  Date(s.dateTime)  >=  startOfWeek).length;
           this.seancesMonth  =  this.allSeances.filter(s  =>  new  Date(s.dateTime) >=  startOfMonth).length;

           //  compute  lists  for  yesterday/today/tomorrow
           this.computeSeanceDayLists();
       });

        // Payments
        this.paymentService.getPayments().subscribe(payments  =>  {
           this.allPayments  = payments  ||  [];

           const  now  =  new  Date();
           const  startOfWeek  = this.getStartOfWeek(now);
            const startOfMonth  =  new  Date(now.getFullYear(),  now.getMonth(),  1);

           this.paymentsToday  =  this.allPayments
              .filter(p  =>  this.isSameDay(new  Date(p.date),  now))
               .reduce((sum,  p)  => sum  +  (p.amount  ||  0),  0);

           this.paymentsWeek  =  this.allPayments
              .filter(p  =>  new  Date(p.date)  >=  startOfWeek)
               .reduce((sum,  p) =>  sum  +  (p.amount  ||  0),  0);

           this.paymentsMonth  = this.allPayments
               .filter(p  =>  new  Date(p.date)  >=  startOfMonth)
               .reduce((sum, p)  =>  sum  +  (p.amount  ||  0),  0);

            // compute  monthly  series  and  build  chart
           this.computeMonthlyPaymentSeries();
           this.updateLineData();
       });

        //  prepare bar  chart  data  (static  example  or  compute  from seances  if  you  prefer)
       this.barSeancesData  =  {
           labels:  ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'],
           datasets:  [{  label:  'Séances',  data:  [40,35,50,60,70,65,80,90,75,85,95,110],  backgroundColor: '#04a9f5'  }]
        };
       this.barSeancesOptions  =  {  responsive:  true, maintainAspectRatio:  false,  plugins:  {  legend:  {  position:  'top' }  },  scales:  {  y:  {  beginAtZero:  true }  }  };
    }

   //  ---------------------------
    //  SEANCE  LISTS
   //  ---------------------------
    computeSeanceDayLists()  {
       //  ensure  patients  are loaded;  if  not  yet,  map  patientId  to  fallback name
        const  patientMap  = new  Map<number,  string>();
        this.allPatients.forEach(p =>  {
           const  id  =  (p  as  any).id;
           const  name  =  `${(p as  any).firstName  ||  ''}  ${(p  as  any).lastName  || ''}`.trim();
            patientMap.set(id, name  ||  '—');
        });

        const  now  = new  Date();
        const  yesterday =  new  Date(now);  yesterday.setDate(now.getDate()  -  1);
       const  tomorrow  =  new  Date(now);  tomorrow.setDate(now.getDate() +  1);

        const formatTime  =  (iso:  string)  =>  {
           const  d  =  new Date(iso);
            if (isNaN(d.getTime()))  return  '—';
           return  d.toLocaleTimeString([],  {  hour:  '2-digit',  minute:  '2-digit' });
        };

       const  mapSeance  =  (s:  any) =>  ({
           patientName:  patientMap.get(s.patientId)  ||  `Patient  #${s.patientId}`,
           time:  formatTime(s.dateTime),
           type:  s.type  ||  '—'
       });

       //  filter  and  map
       this.seancesYesterday  =  this.allSeances
           .filter(s  =>  this.isSameDay(new  Date(s.dateTime),  yesterday))
           .map(mapSeance);

       this.seancesTodayList  =  this.allSeances
           .filter(s  =>  this.isSameDay(new  Date(s.dateTime), now))
            .map(mapSeance);

        this.seancesTomorrow  =  this.allSeances
           .filter(s  => this.isSameDay(new  Date(s.dateTime),  tomorrow))
           .map(mapSeance);

        // optional:  sort  by  time
       const  sortByTime  =  (a:  any,  b:  any)  => (a.time  >  b.time  ?  1  :  -1);
       this.seancesYesterday.sort(sortByTime);
       this.seancesTodayList.sort(sortByTime);
        this.seancesTomorrow.sort(sortByTime);
   }

    //  ---------------------------
   //  CHART  HELPERS
    //  ---------------------------
   initChartOptions()  {
        this.lineStylesOptions =  {
           responsive:  true,
           maintainAspectRatio:  false,
           plugins:  {
               legend:  {  position:  'top'  },
               tooltip: {  mode:  'index',  intersect:  false  }
           },
           interaction:  {  mode:  'nearest',  axis: 'x',  intersect:  false  },
           scales:  {
               x:  {  grid:  { display:  false  }  },
               y:  {  beginAtZero:  true, ticks:  {  precision:  0  }  }
           }
       };

        this.lineStylesData.labels =  ['Jan',  'Fév',  'Mar',  'Avr',  'Mai',  'Juin',  'Juil', 'Août',  'Sep',  'Oct',  'Nov',  'Déc'];
    }

    computeMonthlyPaymentSeries()  {
       //  reset
        this.validatedByMonth =  new  Array(12).fill(0);
        this.pendingByMonth =  new  Array(12).fill(0);

       this.allPayments.forEach(p  =>  {
           const  d  =  new  Date(p.date);
           if  (isNaN(d.getTime()))  return;
           const  m  = d.getMonth();  //  0..11
           const  amount  =  Number(p.amount  ||  0);
           if  (p.status  === 'PENDING')  {
               this.pendingByMonth[m]  +=  amount;
           }  else  {
               this.validatedByMonth[m]  += amount;
            }
       });
    }

    updateLineData()  {
       const  labels  =  this.lineStylesData.labels;
       const  datasets:  any[]  =  [];

       if  (this.showValidated)  {
           datasets.push({
               label:  'Paiements  validés (€)',
               data:  this.validatedByMonth,
               fill:  false,
               borderColor:  '#04a9f5',
               backgroundColor: 'rgba(4,169,245,0.06)',
               tension:  0.3,
               borderWidth:  3,
               pointRadius:  4,
               pointBackgroundColor: '#04a9f5'
            });
       }

       if  (this.showPending)  {
           datasets.push({
               label:  'Paiements  en  attente (€)',
               data:  this.pendingByMonth,
               fill:  false,
               borderColor:  '#FFA726',
               backgroundColor: 'rgba(255,167,38,0.06)',
               borderDash:  [10,  6],
               tension:  0.3,
               borderWidth:  3,
              pointRadius:  4,
               pointBackgroundColor:  '#FFA726'
           });
        }

        if  (this.showExpenses)  {
           datasets.push({
               label: 'Charges  du  cabinet  (€)',
               data:  this.expensesByMonth,
               fill:  true,
              backgroundColor:  'rgba(117,117,117,0.18)',
               borderColor:  '#757575',
               tension:  0.3,
               borderWidth:  2,
              pointRadius:  4,
               pointBackgroundColor:  '#757575'
           });
        }

        this.lineStylesData  =  { labels,  datasets  };
    }

   onToggleChange()  {
        this.updateLineData();
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
       const  d  =  new Date(date);
        const  day  = d.getDay();
        const  diff  = d.getDate()  -  day  +  (day  ===  0  ? -6  :  1);
        return new  Date(d.setDate(diff));
    }
}
