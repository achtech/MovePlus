import {  Injectable  }  from '@angular/core';
import {  Observable, of  }  from 'rxjs';

export  interface Patient  {
   id?:  number;
   firstName:  string;
   lastName:  string;
   birthDate:  string;
   phone:  string;
   email:  string;
   address:  string;
   medicalNotes:  string;
}

@Injectable({  providedIn:  'root'  })
export  class  PatientService  {
   private patients: Patient[] = [
       { id: 1, firstName: 'John', lastName: 'Doe', birthDate: '1990-01-01', phone: '123456789', email: 'john@example.com', address: '123 Main St', medicalNotes: 'No allergies' },
       { id: 2, firstName: 'Jane', lastName: 'Smith', birthDate: '1985-05-15', phone: '987654321', email: 'jane@example.com', address: '456 Oak Ave', medicalNotes: 'Back pain' },
       { id: 3, firstName: 'Bob', lastName: 'Johnson', birthDate: '1978-12-10', phone: '555666777', email: 'bob@example.com', address: '789 Pine Rd', medicalNotes: 'Knee injury' }
   ];

   constructor() {}

   getPatients():  Observable<Patient[]>  {
       return of(this.patients);
    }

    addPatient(patient: Patient):  Observable<Patient>  {
       patient.id = this.patients.length + 1;
       this.patients.push(patient);
       return of(patient);
   }

   updatePatient(id:  number,  patient:  Patient): Observable<Patient>  {
       const index = this.patients.findIndex(p => p.id === id);
       if (index !== -1) {
           this.patients[index] = { ...patient, id };
           return of(this.patients[index]);
       }
       return of(null as any);
    }

    deletePatient(id: number):  Observable<void>  {
       this.patients = this.patients.filter(p => p.id !== id);
       return of(void 0);
    }
}
