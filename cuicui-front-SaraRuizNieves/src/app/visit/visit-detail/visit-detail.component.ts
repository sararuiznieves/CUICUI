import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitDto, VisitService } from '../../services/visit.service';
import { PetDto, PetService } from '../../services/pet.service';

@Component({
  selector: 'app-visit-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visit-detail.component.html',
  styleUrls: ['./visit-detail.component.css']
})
export class VisitDetailComponent implements OnInit {
  visit?: VisitDto;
  pets: PetDto[] = [];

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visitService: VisitService,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    const visitId = this.route.snapshot.paramMap.get('id');
    if (!visitId) {
      this.router.navigate(['/visit']);
      return;
    }

    this.loadPets();
    this.loadVisit(visitId);
  }

  loadPets(): void {
    this.petService.getMyPets().subscribe({
      next: (pets: PetDto[]) => {
        this.pets = pets.filter((pet: PetDto) => !pet.dateDisable);
      },
      error: (err: any) => {
        console.error('Error cargando cobayas:', err);
      }
    });
  }

  loadVisit(id: string): void {
    this.isLoading = true;

    this.visitService.getVisitById(id).subscribe({
      next: (visit: VisitDto) => {
        this.visit = visit;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando visita:', err);
        this.errorMessage = 'No se pudo cargar la visita.';
        this.isLoading = false;
      }
    });
  }

  updateVisit(): void {
    if (!this.visit) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const body = {
      id: this.visit.id,
      petId: this.visit.petId,
      vetName: this.visit.vetName,
      date: this.visit.date,
      time: this.visit.time,
      notes: this.visit.notes || null
    };

    this.visitService.updateVisit(body).subscribe({
      next: (updatedVisit: VisitDto) => {
        this.visit = updatedVisit;
        this.successMessage = 'Visita actualizada correctamente.';
        this.isSaving = false;
      },
      error: (err: any) => {
        console.error('Error actualizando visita:', err);
        this.errorMessage = 'No se pudo actualizar la visita.';
        this.isSaving = false;
      }
    });
  }

finishVisit(): void {
  if (!this.visit?.id) return;

  this.visitService.finishVisit(this.visit.id).subscribe({
    next: () => {
      this.router.navigate(['/visit']);
    },
    error: (err) => {
      console.error('Error finalizando visita:', err);
    }
  });
}
goBack(): void {
  this.router.navigate(['/visit']);
}

getPetImage(): string {
  if (!this.visit?.petPhoto) {
    return '/default-placeholder.jpg';
  }

  if (this.visit.petPhoto.startsWith('http')) {
    return this.visit.petPhoto;
  }

  return `http://localhost:8080/pets/${this.visit.petPhoto}`;
}

getVisitDateLabel(dateString: string): string {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}