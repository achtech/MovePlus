 import  {  Component, OnInit  }  from  '@angular/core';
import  {  MatDialog  } from  '@angular/material/dialog';
 import  { PatientService,  Patient  }  from '../patient.service';
 import  {  PatientFormComponent }  from  '../patient-form/patient-form.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
 
@Component({
     selector: 'app-patient-list',
     templateUrl: './patient-list.component.html',
     styleUrls: ['./patient-list.component.scss'],
     standalone: true,
     imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule]
 }) 
 export  class PatientListComponent  implements  OnInit  {
    displayedColumns:  string[] =  ['firstName',  'lastName',  'phone', 'email',  'actions'];
    patients:  Patient[]  =  [];

     constructor(private patientService:  PatientService,  private  dialog: MatDialog)  {}
 
    ngOnInit():  void  {
       this.loadPatients();
     }

     loadPatients(): void  {
        this.patientService.getPatients().subscribe(data  => this.patients  =  data);
    }
 
    addPatient():  void  {
       const  dialogRef  =  this.dialog.open(PatientFormComponent, {  width:  '400px'  });
       dialogRef.afterClosed().subscribe(result  =>  {
           if  (result)  this.loadPatients();
       });
     }

     editPatient(patient: Patient):  void  {
        const dialogRef  =  this.dialog.open(PatientFormComponent,  { width:  '400px',  data:  patient });
        dialogRef.afterClosed().subscribe(result  =>  {
           if  (result) this.loadPatients();
        });
    }
 
    deletePatient(id:  number):  void  {
       this.patientService.deletePatient(id).subscribe(()  =>  this.loadPatients());
    }
 }
