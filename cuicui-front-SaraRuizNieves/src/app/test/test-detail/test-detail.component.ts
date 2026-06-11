import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PetService, PetDto } from '../../services/pet.service';
import { Test, TestService } from '../../services/test.service';

@Component({
  selector: 'app-test-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {
  test?: Test;
  pets: PetDto[] = [];

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.loadMyPets();

    const testId = this.route.snapshot.paramMap.get('id');

    if (!testId) {
      this.router.navigate(['/test']);
      return;
    }

    this.loadTest(testId);
  }

  loadMyPets(): void {
    this.petService.getMyPets().subscribe({
      next: (pets: PetDto[]) => {
        this.pets = pets.filter((pet) => !pet.dateDisable);
      },
      error: (err: unknown) => {
        console.error('Error cargando cobayas:', err);
      }
    });
  }

  loadTest(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.testService.getById(id).subscribe({
      next: (test: Test) => {
        this.test = test;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error cargando prueba:', err);
        this.errorMessage = 'No se pudo cargar la prueba.';
        this.isLoading = false;
      }
    });
  }

updateTest(): void {
  if (!this.test?.id) return;

  if (!this.test.petId || !this.test.name.trim()) {
    this.errorMessage =
      'La cobaya y el nombre de la prueba son obligatorios.';
    return;
  }

  this.isSaving = true;

  this.errorMessage = '';
  this.successMessage = '';

  const formData = new FormData();

  formData.append('petId', this.test.petId);

  formData.append('name', this.test.name.trim());

  formData.append('type', this.test.type || '');

  formData.append('testDate', this.test.testDate || '');

  formData.append('result', this.test.result || '');

  formData.append('vetName', this.test.vetName || '');

  formData.append('notes', this.test.notes || '');

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  this.testService
    .updateWithFile(this.test.id, formData)
    .subscribe({
      next: (updatedTest: Test) => {

        const selectedPet = this.pets.find(
          pet => pet.id === updatedTest.petId
        );

        this.test = {
          ...updatedTest,
          petName:
            selectedPet?.petName ||
            updatedTest.petName ||
            this.test?.petName
        };

        this.successMessage =
          'Prueba actualizada correctamente.';

        this.isSaving = false;
      },

      error: (err: unknown) => {
        console.error(
          'Error actualizando prueba:',
          err
        );

        this.errorMessage =
          'No se pudo actualizar la prueba.';

        this.isSaving = false;
      }
    });
}

onFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;

  this.selectedFile =
    input.files?.[0] ?? null;
}

  deleteTest(): void {
    if (!this.test?.id) return;

    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la prueba "${this.test.name}"?`
    );

    if (!confirmed) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.testService.delete(this.test.id).subscribe({
      next: () => {
        this.router.navigate(['/test']);
      },
      error: (err: unknown) => {
        console.error('Error eliminando prueba:', err);
        this.errorMessage = 'No se pudo eliminar la prueba.';
        this.isSaving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/test']);
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

  getTestFileUrl(): string {
  if (this.test?.filePath) {
    return `http://localhost:8080/tests/${this.test.filePath}`;
  }

  return '';
}
}