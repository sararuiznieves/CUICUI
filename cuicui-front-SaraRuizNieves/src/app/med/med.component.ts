import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PetService, PetDto } from '../services/pet.service';
import {
  MedicacionService,
  Medicine,
  CreateMedicineDto
} from '../services/med.service';

@Component({
  selector: 'app-med',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './med.component.html',
  styleUrls: ['./med.component.css']
})
export class MedComponent implements OnInit {
  showMedModal = false;
  isSaving = false;

  pets: PetDto[] = [];
  medicines: Medicine[] = [];

  newMed = this.getEmptyMedForm();

  constructor(
    private petService: PetService,
    private medicacionService: MedicacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyPets();
  }

  loadMyPets(): void {
    this.petService.getMyPets().subscribe({
      next: (pets: PetDto[]) => {
        this.pets = pets.filter((pet) => !pet.dateDisable);
        this.loadMedicines();
      },
      error: (err: unknown) => {
        console.error('Error cargando cobayas:', err);
      }
    });
  }

loadMedicines(): void {
  if (this.pets.length === 0) {
    this.medicines = [];
    return;
  }

  const requests = this.pets.map((pet) =>
    this.medicacionService.getMedicacionesByPetId(pet.id).pipe(
      map((medicines: any[]) =>
        medicines.map((med: any) => ({
          ...med,
          petId: pet.id,
          petName: pet.petName,
          startDate: med.startDate ?? med.dateStart ?? med.start_date ?? null,
          endDate: med.endDate ?? med.dateEnd ?? med.end_date ?? null
        }))
      ),
      catchError((err) => {
        console.error(`Error cargando medicaciones de ${pet.petName}:`, err);
        return of([]);
      })
    )
  );

  forkJoin(requests).subscribe({
    next: (responses) => {
      this.medicines = responses.flat();
    },
    error: (err: unknown) => {
      console.error('Error cargando medicaciones:', err);
    }
  });
}

  get activeMeds(): Medicine[] {
    return this.medicines.filter((med) => med.active);
  }

  get inactiveMeds(): Medicine[] {
    return this.medicines.filter((med) => !med.active);
  }

  openMedDetail(id: string): void {
    this.router.navigate(['/med/med-detail', id]);
  }

  openMedModal(): void {
    this.showMedModal = true;
  }

  closeMedModal(): void {
    this.showMedModal = false;
    this.resetForm();
    this.isSaving = false;
  }

  createMed(): void {
    if (
      this.isSaving ||
      !this.newMed.petId ||
      !this.newMed.name.trim() ||
      !this.newMed.dose.trim() ||
      !this.newMed.frequency.trim()
    ) {
      return;
    }

    const selectedPet = this.pets.find((pet) => pet.id === this.newMed.petId);

    if (!selectedPet) {
      return;
    }

    this.isSaving = true;

    const medicineToCreate: CreateMedicineDto = {
      name: this.newMed.name.trim(),
      dose: this.newMed.dose.trim(),
      frequency: this.newMed.frequency.trim(),
      active: true,
      startDate: this.newMed.startDate || null,
      endDate: this.newMed.endDate || null,
      vetName: this.newMed.vetName.trim() || null,
      notes: this.newMed.notes.trim() || null
    };

    this.medicacionService
      .createMedicacion(selectedPet.id, medicineToCreate)
      .subscribe({
        next: (createdMedicine: Medicine) => {
          const medicineWithPet: Medicine = {
            ...createdMedicine,
            petId: selectedPet.id,
            petName: selectedPet.petName,
            startDate: createdMedicine.startDate || null,
            endDate: createdMedicine.endDate || this.newMed.endDate || null
          };

          this.medicines = [medicineWithPet, ...this.medicines];
          this.closeMedModal();
        },
error: (err) => {
  console.error('STATUS:', err.status);
  console.error('ERROR COMPLETO:', err);
  console.error('RESPUESTA BACKEND:', err.error);
  this.isSaving = false;
}
      });
  }

formatDateForView(dateString?: string | null): string {
  if (!dateString) return 'Sin fecha definida';

  const normalizedDate = dateString.includes('T')
    ? dateString.split('T')[0]
    : dateString;

  const date = new Date(`${normalizedDate}T00:00:00`);

  if (isNaN(date.getTime())) return 'Sin fecha definida';

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

  private resetForm(): void {
    this.newMed = this.getEmptyMedForm();
  }

  private getEmptyMedForm() {
    return {
      petId: '',
      name: '',
      dose: '',
      frequency: '',
      startDate: this.formatDateForInput(new Date()),
      endDate: '',
      vetName: '',
      notes: ''
    };
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }
}