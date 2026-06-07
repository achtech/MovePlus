import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PackService, Pack } from '../pack.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pack-form-dialog',
  templateUrl: './pack-form-dialog.component.html',
  styleUrls: ['./pack-form-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class PackFormDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private dialogRef: MatDialogRef<PackFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pack
  ) {
    this.form = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      nombreDeSeance: [data?.nombreDeSeance || '', [Validators.required, Validators.min(1)]],
      prixMaison: [data?.prixMaison || '', [Validators.required, Validators.min(0)]],
      prixCabinet: [data?.prixCabinet || '', Validators.min(0)]
    });
  }

  save(): void {
    if (this.form.valid) {
      const pack = this.form.value;
      if (this.data?.id) {
        this.packService.updatePack(this.data.id, pack).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            console.error('Error updating pack:', err);
            alert('Erreur lors de la mise à jour du pack');
          }
        });
      } else {
        this.packService.addPack(pack).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            console.error('Error adding pack:', err);
            alert('Erreur lors de l\'ajout du pack');
          }
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
