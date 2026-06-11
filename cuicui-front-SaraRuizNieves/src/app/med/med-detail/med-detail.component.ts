import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PetService, PetDto } from '../../services/pet.service';
import { MedicacionService, Medicine } from '../../services/med.service';

@Component({
  selector: 'app-med-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './med-detail.component.html',
  styleUrls: ['./med-detail.component.css']
})
export class MedDetailComponent implements OnInit {
  med?: Medicine;
  pets: PetDto[] = [];

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  private medId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private medicacionService: MedicacionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/med']);
      return;
    }

    this.medId = id;
    this.loadMyPetsAndMed();
  }

  
  loadMyPetsAndMed(): void {
    this.isLoading = true;

    this.petService.getMyPets().subscribe({
      next: (pets: PetDto[]) => {
        this.pets = pets.filter((pet) => !pet.dateDisable);
        this.loadMedFromPets();
      },
      error: (err: unknown) => {
        console.error('Error cargando cobayas:', err);
        this.errorMessage = 'No se pudieron cargar las cobayas.';
        this.isLoading = false;
      }
    });
  }

  loadMedFromPets(): void {
    const requests = this.pets.map((pet) =>
      this.medicacionService.getMedicacionesByPetId(pet.id).pipe(
        map((medicines: Medicine[]) =>
          medicines.map((med) => ({
            ...med,
            petId: pet.id,
            petName: pet.petName
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
        const medicines = responses.flat();
        const foundMed = medicines.find((med) => med.id === this.medId);

        if (!foundMed) {
          this.errorMessage = 'No se pudo encontrar la medicación.';
          this.isLoading = false;
          return;
        }

        this.med = { ...foundMed };
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error cargando medicación:', err);
        this.errorMessage = 'No se pudo cargar la medicación.';
        this.isLoading = false;
      }
    });
  }

updateMed(): void {
  if (!this.med || this.isSaving) return;

  this.isSaving = true;
  this.errorMessage = '';
  this.successMessage = '';

  const selectedPet = this.pets.find((pet) => pet.id === this.med?.petId);

const medicineToUpdate = {
  petId: this.med.petId,
  name: this.med.name.trim(),
  dose: this.med.dose.trim(),
  frequency: this.med.frequency.trim(),
  active: this.med.active,
  startDate: this.med.startDate || null,
  endDate: this.med.endDate || null,
  vetName: this.med.vetName?.trim() || null,
  notes: this.med.notes?.trim() || null
};

  this.medicacionService.updateMedicacion(this.med.id, medicineToUpdate).subscribe({
    next: (updatedMed) => {
      this.med = {
        ...this.med!,
        ...updatedMed,
        petId: selectedPet?.id || this.med!.petId,
        petName: selectedPet?.petName || this.med!.petName
      };

      this.successMessage = 'Medicación actualizada correctamente.';
      this.isSaving = false;
    },
    error: (err) => {
      console.error('Error actualizando medicación:', err);
      this.errorMessage = 'No se pudo actualizar la medicación.';
      this.isSaving = false;
    }
  });
}

toggleActive(): void {
  if (!this.med || this.isSaving) return;

  this.isSaving = true;
  this.errorMessage = '';
  this.successMessage = '';

  const request$ = this.med.active
    ? this.medicacionService.endMedicine(this.med.id)
    : this.medicacionService.reactivateMedicine(this.med.id);

  request$.subscribe({
    next: (updatedMed) => {
      this.med = {
        ...this.med!,
        ...updatedMed,
        active: updatedMed.active,
        endDate: updatedMed.endDate
      };

      this.successMessage = this.med.active
        ? 'Medicación reactivada correctamente.'
        : 'Medicación finalizada correctamente.';

      this.isSaving = false;
    },
    error: (err) => {
      console.error('Error cambiando estado de medicación:', err);
      this.errorMessage = 'No se pudo cambiar el estado de la medicación.';
      this.isSaving = false;
    }
  });
}

deleteMed(): void {
  if (!this.med || this.isSaving) return;

  const confirmed = confirm(
    `¿Seguro que quieres eliminar la medicación "${this.med.name}"?`
  );

  if (!confirmed) return;

  this.isSaving = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.medicacionService.deleteMedicine(this.med.id).subscribe({
    next: () => {
      this.router.navigate(['/med']);
    },
    error: (err: unknown) => {
      console.error('Error eliminando medicación:', err);
      this.errorMessage = 'No se pudo eliminar la medicación.';
      this.isSaving = false;
    }
  });
}

  goBack(): void {
    this.router.navigate(['/med']);
  }

  formatDateForView(dateString?: string | null): string {
    if (!dateString) return 'Sin fecha definida';

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }
}