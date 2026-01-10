import  {  Injectable  } from  '@angular/core';
import {  Observable, of  } from  'rxjs';

export interface  Seance  {
   id?:  number;
   patientId:  number;
   therapistId:  number;
   dateTime:  string;
   duration:  number;
   type:  string;
   notes:  string;
   status:  string;
}

@Injectable({  providedIn:  'root' })
export  class  SeanceService {
    private seances: Seance[] = [
        { id: 1, patientId: 1, therapistId: 2, dateTime: '2026-01-15T10:00:00', duration: 60, type: 'Massage', notes: 'Relaxation session', status: 'COMPLETED' },
        { id: 2, patientId: 2, therapistId: 2, dateTime: '2026-01-16T14:00:00', duration: 45, type: 'Physio', notes: 'Back exercises', status: 'SCHEDULED' },
        { id: 3, patientId: 3, therapistId: 2, dateTime: '2026-01-17T09:00:00', duration: 30, type: 'Consultation', notes: 'Initial assessment', status: 'CANCELLED' }
    ];

   constructor()  {}

   getSeances():  Observable<Seance[]>  {
      return  of(this.seances);
   }

   addSeance(seance:  Seance):  Observable<Seance>  {
      seance.id = this.seances.length + 1;
      this.seances.push(seance);
      return  of(seance);
   }

   updateSeance(id:  number,  seance: Seance):  Observable<Seance>  {
       const index = this.seances.findIndex(s => s.id === id);
       if (index !== -1) {
           this.seances[index] = { ...seance, id };
           return of(this.seances[index]);
       }
       return of(null as any);
   }

   deleteSeance(id:  number):  Observable<void>  {
      this.seances = this.seances.filter(s => s.id !== id);
      return  of(void 0);
   }
}
