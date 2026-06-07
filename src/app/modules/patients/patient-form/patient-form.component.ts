import {  Component,  Inject  } from  '@angular/core';
import  { FormBuilder,  FormGroup,  Validators, ReactiveFormsModule  } from  '@angular/forms';
import  { MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule  }  from '@angular/material/dialog';
import  {  PatientService, Patient  }  from  '../patient.service';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-patient-form',
   templateUrl:  './patient-form.component.html',
   styleUrls: ['./patient-form.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class  PatientFormComponent  {
   form:  FormGroup;

   constructor(
       private fb:  FormBuilder,
       private  patientService: PatientService,
       private  dialogRef:  MatDialogRef<PatientFormComponent>,
      @Inject(MAT_DIALOG_DATA)  public  data:  Patient
   )  {
      this.form  =  this.fb.group({
          firstName:  [data?.firstName  || '',  Validators.required],
          lastName:  [data?.lastName  ||  '', Validators.required],
           birthDate: [data?.birthDate  ||  '',  Validators.required],
          phone:  [data?.phone ||  '',  Validators.required],
          email:  [data?.email  || '',  [Validators.required,  Validators.email]],
          address:  [data?.address  || ''],
           medicalNotes: [data?.medicalNotes  ||  '']
       });
   }

   save():  void {
       if  (this.form.valid)  {
          const  patient =  this.form.value;
          if  (this.data?.id)  {
              this.patientService.updatePatient(this.data.id, patient).subscribe(()  =>  this.dialogRef.close(true));
          }  else  {
             this.patientService.addPatient(patient).subscribe(()  =>  this.dialogRef.close(true));
          }
       }
   }

   cancel():  void  {
      this.dialogRef.close(false);
    }
}
