import { Component, OnInit } from '@angular/core';
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
import { FORM_DIALOG_OPTIONS, PATIENT_DETAIL_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { DeleteConfirmService } from '../../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../../core/services/dialog-refresh.service';
 
@Component({
     selector: 'app-patient-list',
     templateUrl: './patient-list.component.html',
     styleUrls: ['./patient-list.component.scss'],
     standalone: true,
     imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, TooltipModule, CardComponent, TranslateModule]
 }) 
 export  class PatientListComponent implements OnInit {
    patients:  Patient[]  =  [];
    loading: boolean = true;

     constructor(
       private patientService: PatientService,
       private dialog: MatDialog,
       private deleteConfirm: DeleteConfirmService,
       private dialogRefresh: DialogRefreshService
     ) {}

     ngOnInit(): void {
       this.loadPatients();
     }

     loadPatients(): void  {
        this.loading = true;
        this.patientService.getPatients().subscribe(data  => {
            this.patients  =  [...data];
            this.loading = false;
        });
    }
 
    addPatient():  void  {
       this.dialogRefresh.onSave(
         this.dialog.open(PatientFormComponent, FORM_DIALOG_OPTIONS),
         () => this.loadPatients()
       );
     }

     editPatient(patient: Patient):  void  {
        this.dialogRefresh.onSave(
          this.dialog.open(PatientFormComponent, { ...FORM_DIALOG_OPTIONS, data: patient }),
          () => this.loadPatients()
        );
    }
    
   showPatientDetails(patient: Patient): void {
     this.dialog.open(PatientDetailDialogComponent, {
       ...PATIENT_DETAIL_DIALOG_OPTIONS,
       data: { patient }
     });
   }

 
    deletePatient(id:  number):  void  {
       this.deleteConfirm.confirmAndDelete(
         () => this.patientService.deletePatient(id),
         () => this.loadPatients()
       );
    }

    clear(table: any): void {
        table.clear();
    }
 }
