import { Component } from '@angular/core';
import { MatDialog  } from  '@angular/material/dialog';
import { PatientService,  Patient  }  from '../patient.service';
import { PatientFormComponent }  from  '../patient-form/patient-form.component';
import { PatientDetailDialogComponent } from '../patient-detail-dialog/patient-detail-dialog.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';
 
@Component({
     selector: 'app-patient-list',
     templateUrl: './patient-list.component.html',
     styleUrls: ['./patient-list.component.scss'],
     standalone: true,
     imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, TooltipModule, CardComponent, TranslateModule]
 }) 
 export  class PatientListComponent  {
    patients:  Patient[]  =  [];
    loading: boolean = true;

     constructor(private patientService:  PatientService,  private  dialog: MatDialog)  {
       runAfterBrowserHydration(() => this.loadPatients());
     }

     loadPatients(): void  {
        this.patientService.getPatients().subscribe(data  => {
            this.patients  =  data;
            this.loading = false;
        });
    }
 
    addPatient():  void  {
       const  dialogRef  =  this.dialog.open(PatientFormComponent, FORM_DIALOG_OPTIONS);
       dialogRef.afterClosed().subscribe(result  =>  {
           if  (result)  this.loadPatients();
       });
     }

     editPatient(patient: Patient):  void  {
        const dialogRef  =  this.dialog.open(PatientFormComponent,  { ...FORM_DIALOG_OPTIONS, data:  patient });
        dialogRef.afterClosed().subscribe(result  =>  {
           if  (result) this.loadPatients();
        });
    }
    
   showPatientDetails(patient: Patient): void 
     {
   this.dialog.open(PatientDetailDialogComponent,  {
       width: '80vw',
       height:  '80vh',
       maxWidth: '90vw',
       panelClass: 'middle-dialog datta-dialog',
       data: {  patient  }
   });
}

 
    deletePatient(id:  number):  void  {
       this.patientService.deletePatient(id).subscribe(()  =>  this.loadPatients());
    }

    clear(table: any): void {
        table.clear();
    }
 }
