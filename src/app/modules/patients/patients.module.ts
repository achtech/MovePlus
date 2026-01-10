import  {  NgModule  } from  '@angular/core';
import  { CommonModule  }  from  '@angular/common';
import  {  PatientsRoutingModule  } from  './patients-routing.module';
import  { PatientListComponent  }  from  './patient-list/patient-list.component';
import  {  PatientFormComponent  } from  './patient-form/patient-form.component';

import {  FormsModule,  ReactiveFormsModule  } from  '@angular/forms';
import  { MatTableModule  }  from  '@angular/material/table';
import  {  MatFormFieldModule  } from  '@angular/material/form-field';
import  { MatInputModule  }  from  '@angular/material/input';
import  {  MatButtonModule  } from  '@angular/material/button';
import  { MatIconModule  }  from  '@angular/material/icon';
import  {  MatDialogModule  } from  '@angular/material/dialog';

@NgModule({
   declarations:  [],
    imports: [
       CommonModule,
       PatientsRoutingModule,
       FormsModule,
      ReactiveFormsModule,
       MatTableModule,
       MatFormFieldModule,
       MatInputModule,
      MatButtonModule,
       MatIconModule,
       MatDialogModule,
       PatientListComponent,
       PatientFormComponent
   ]
})
export class  PatientsModule  {}
