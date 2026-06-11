import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService, PetDto } from '../../services/pet.service';
import { MedicacionService, Medicine } from '../../services/med.service';
import { VisitService, VisitDto } from '../../services/visit.service';
import { Test, TestService } from '../../services/test.service';

interface Visit {
  id: string;
  petId: string;
  reason?: string;
  visitDate: string;
  notes?: string;
}

@Component({
  standalone: true,
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PetDetailComponent implements OnInit {
  mascota?: PetDto;

  activeMedicines: Medicine[] = [];
  futureVisits: VisitDto[] = [];
  registeredTests: Test[] = [];

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  removeCurrentPhoto = false;

  selectedImageFile: File | null = null;
  selectedImageBase64: string | null = null;
  selectedImageName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private medicacionService: MedicacionService,
    private visitService: VisitService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('id');

    if (!petId) {
      this.router.navigate(['/pet']);
      return;
    }

    this.loadPet(petId);
  }

  loadPet(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.petService.getPetById(id).subscribe({
      next: (data: PetDto) => {
        this.mascota = data;
        this.isLoading = false;

        this.loadActiveMedicines();
        this.loadFutureVisits();
        this.loadRegisteredTests();
      },
      error: (err: unknown) => {
        console.error('Error al recuperar la mascota:', err);
        this.errorMessage = 'No se pudo cargar la mascota.';
        this.isLoading = false;
      }
    });
  }

  loadActiveMedicines(): void {
    if (!this.mascota?.id) return;

    this.medicacionService.getMedicacionesByPetId(this.mascota.id).subscribe({
      next: (medicines: Medicine[]) => {
        this.activeMedicines = medicines.filter((med) => med.active);
      },
      error: (err: unknown) => {
        console.error('Error cargando medicaciones activas:', err);
        this.activeMedicines = [];
      }
    });
  }

loadFutureVisits(): void {
  if (!this.mascota?.id) return;

  this.visitService.getMyVisits().subscribe({
    next: (visits: VisitDto[]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.futureVisits = visits
        .filter((visit) => visit.petId === this.mascota?.id)
        .filter((visit) => !visit.finished)
        .filter((visit) => {
          const visitDate = new Date(`${visit.date}T00:00:00`);
          return visitDate >= today;
        })
        .sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
        });
    },
    error: (err: unknown) => {
      console.error('Error cargando próximas visitas:', err);
      this.futureVisits = [];
    }
  });
}

loadRegisteredTests(): void {
  if (!this.mascota?.id) return;

  this.testService.getByPet(this.mascota.id).subscribe({
    next: (tests: Test[]) => {
      this.registeredTests = tests
        .sort((a, b) => {
          const dateA = a.testDate ?? '';
          const dateB = b.testDate ?? '';
          return dateB.localeCompare(dateA);
        })
        .slice(0, 4);
    },
    error: (err: unknown) => {
      console.error('Error cargando pruebas:', err);
      this.registeredTests = [];
    }
  });
}

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedImageFile = null;
      this.selectedImageBase64 = null;
      this.selectedImageName = null;
      return;
    }

    this.removeCurrentPhoto = false;
    this.selectedImageFile = file;
    this.selectedImageName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.selectedImageBase64 = result.split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  updatePet(): void {
    if (!this.mascota) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const body = {
      id: this.mascota.id,
      petName: this.mascota.petName ?? '',
      breed: this.mascota.breed ?? '',
      gender: this.mascota.gender ?? '',
      dateBirth: this.mascota.dateBirth ?? null,
      dateAdoption: this.mascota.dateAdoption ?? null,
      photo: this.selectedImageBase64,
      photoName: this.selectedImageName,
      removePhoto: this.removeCurrentPhoto
    };

    this.petService.updatePet(body).subscribe({
      next: (updatedPet) => {
        this.mascota = updatedPet;
        this.successMessage = 'Mascota actualizada correctamente.';
        this.isSaving = false;
        this.selectedImageFile = null;
        this.selectedImageBase64 = null;
        this.selectedImageName = null;
        this.removeCurrentPhoto = false;
      },
      error: (err: unknown) => {
        console.error('Error al actualizar la mascota:', err);
        this.errorMessage = 'No se pudo actualizar la mascota.';
        this.isSaving = false;
      }
    });
  }

  removePhoto(): void {
    this.selectedImageFile = null;
    this.selectedImageBase64 = null;
    this.selectedImageName = null;
    this.removeCurrentPhoto = true;

    if (this.mascota) {
      this.mascota.photo = undefined;
    }
  }
goBack(): void {
  this.router.navigate(['/pet']);
}
  markPetAsDeceased(): void {
    if (!this.mascota?.id) return;

    const defaultDate = new Date().toISOString().split('T')[0];

    const dateDisable = window.prompt(
      'Introduce la fecha de deceso (YYYY-MM-DD):',
      defaultDate
    );

    if (!dateDisable) return;

    const confirmed = window.confirm(
      `¿Confirmas marcar a ${this.mascota.petName} como fallecida con fecha ${dateDisable}?`
    );

    if (!confirmed) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.petService.markPetAsDeceased(this.mascota.id, dateDisable).subscribe({
      next: (updatedPet) => {
        this.mascota = updatedPet;
        this.successMessage = 'La mascota ha sido marcada como fallecida.';
        this.isSaving = false;
      },
      error: (err: unknown) => {
        console.error('Error al marcar como fallecida:', err);
        this.errorMessage = 'No se pudo marcar la mascota como fallecida.';
        this.isSaving = false;
      }
    });
  }

  deletePet(): void {
    if (!this.mascota?.id) return;

    const firstConfirm = window.confirm(
      `¿Seguro que quieres eliminar completamente a ${this.mascota.petName}?`
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      'Última confirmación: esta acción es permanente y no se puede deshacer.'
    );

    if (!secondConfirm) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.petService.deletePet(this.mascota.id).subscribe({
      next: () => {
        this.router.navigate(['/pet']);
      },
      error: (err: unknown) => {
        console.error('Error al eliminar la mascota:', err);
        this.errorMessage = 'No se pudo eliminar la mascota.';
        this.isSaving = false;
      }
    });
  }

  getPetImage(): string {
    if (this.selectedImageBase64) {
      return `data:image/*;base64,${this.selectedImageBase64}`;
    }

    if (this.mascota?.photo) {
      return `http://localhost:8080/pets/${this.mascota.photo}?t=${Date.now()}`;
    }

    return '/default-placeholder.jpg';
  }

getAge(): string {
  if (!this.mascota?.dateBirth) return '';

  const birth = new Date(`${this.mascota.dateBirth}T00:00:00`);

  const referenceDate = this.mascota.dateDisable
    ? new Date(`${this.mascota.dateDisable}T00:00:00`)
    : new Date();

  let years = referenceDate.getFullYear() - birth.getFullYear();
  let months = referenceDate.getMonth() - birth.getMonth();

  if (referenceDate.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0) {
    return `${months} mes${months !== 1 ? 'es' : ''}`;
  }

  if (months === 0) {
    return `${years} año${years !== 1 ? 's' : ''}`;
  }

  return `${years} año${years !== 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
}

  formatDate(dateString?: string | null): string {
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

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isDeceased(): boolean {
    return !!this.mascota?.dateDisable;
  }
}