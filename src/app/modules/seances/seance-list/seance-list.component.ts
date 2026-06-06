import  { Component,  OnInit, ViewChild  }  from '@angular/core';
import  {  MatDialog  }  from '@angular/material/dialog';
import  {  SeanceService, Seance  }  from  '../seance.service';
import  {  SeanceFormComponent  } from  '../seance-form/seance-form.component';
import { PatientService, Patient } from '../../patients/patient.service';
import { UserService, User } from '../../users/user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Table } from 'primeng/table';

@Component({
   selector:  'app-seance-list',
   templateUrl:  './seance-list.component.html',
   styleUrls:  ['./seance-list.component.scss'],
   standalone: true,
   imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, TooltipModule, CardComponent, FullCalendarModule]
})
export class  SeanceListComponent  implements  OnInit {
    seances: Seance[]  =  [];
    loading: boolean = true;
    showAgenda: boolean = false;
    patients: Patient[] = [];
    therapists: User[] = [];

    @ViewChild('dt1') dt1: Table | undefined;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true,
        events: [],
        eventColor: '#3788d8',
        eventDisplay: 'block'
    };

   constructor(private  seanceService: SeanceService, private  dialog: MatDialog, private patientService: PatientService, private userService: UserService)  {}

   ngOnInit():  void  {
      this.loadPatients();
      this.loadTherapists();
      this.loadSeances();
    }

    loadPatients(): void {
        this.patientService.getPatients().subscribe(patients => {
            this.patients = patients;
        });
    }

    loadTherapists(): void {
        this.userService.getUsers().subscribe(users => {
            this.therapists = users.filter(user => user.enabled);
        });
    }

    loadSeances(): void  {
       this.seanceService.getSeances().subscribe(data => {
           this.seances  =  data;
           this.loading = false;
           this.updateCalendarEvents();
       });
   }

   getPatientName(patientId: number): string {
       const patient = this.patients.find(p => p.id === patientId);
       return patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${patientId}`;
   }

   getTherapistName(therapistId: number): string {
       const therapist = this.therapists.find(t => t.id === therapistId);
       return therapist ? `${therapist.username} (${therapist.role})` : `Therapist ${therapistId}`;
   }

   updateCalendarEvents(): void {
       const events = this.seances.map(s => ({
           id: s.id?.toString(),
           title: `${s.type} - ${this.getPatientName(s.patientId)} (${this.getTherapistName(s.therapistId)})`,
           start: s.dateTime,
           backgroundColor: this.getStatusColor(s.status),
           borderColor: this.getStatusColor(s.status),
           textColor: '#ffffff',
           extendedProps: {
               status: s.status,
               therapistId: s.therapistId,
               duration: s.duration
           }
       }));

       // Update the events in calendar options
       this.calendarOptions = {
           ...this.calendarOptions,
           events: events
       };
   }

   getStatusColor(status: string): string {
       switch (status.toUpperCase()) {
           case 'COMPLETED':
               return '#28a745'; // Green
           case 'SCHEDULED':
               return '#007bff'; // Blue
           case 'CANCELLED':
               return '#dc3545'; // Red
           default:
               return '#6c757d'; // Gray
       }
   }

   toggleAgenda(): void {
       this.showAgenda = !this.showAgenda;
   }

   addSeance():  void  {
      const  dialogRef  =  this.dialog.open(SeanceFormComponent, {  width:  '500px'  });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadSeances();
      });
    }

   editSeance(seance: Seance):  void  {
      const  dialogRef  =  this.dialog.open(SeanceFormComponent, {
         width:  '500px',
         data: seance
      });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadSeances();
      });
    }

   deleteSeance(id:  number):  void {
       this.seanceService.deleteSeance(id).subscribe(()  =>  this.loadSeances());
   }

   clear(table: any): void {
       table.clear();
   }
}
