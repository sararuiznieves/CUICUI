import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PetService, PetDto } from '../services/pet.service';
import { Test, TestService } from '../services/test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  showTestModal = false;
  isSaving = false;

  pets: PetDto[] = [];
  tests: Test[] = [];

  selectedFile: File | null = null;

  newTest = this.getEmptyTestForm();

  constructor(
    private petService: PetService,
    private testService: TestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyPets();
  }

loadMyPets(): void {
  this.petService.getMyPets().subscribe({
    next: (pets: PetDto[]) => {
      this.pets = pets; // sin filtrar
      this.loadTests();
    },
    error: (err: unknown) => {
      console.error('Error cargando cobayas:', err);
    }
  });
}

  loadTests(): void {
    if (this.pets.length === 0) {
      this.tests = [];
      return;
    }

    const requests = this.pets.map((pet) =>
      this.testService.getByPet(pet.id).pipe(
        map((tests: Test[]) =>
          tests.map((test: Test) => ({
            ...test,
            petId: test.petId || pet.id,
            petName: test.petName || pet.petName
          }))
        ),
        catchError((err: unknown) => {
          console.error(`Error cargando pruebas de ${pet.petName}:`, err);
          return of([]);
        })
      )
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        this.tests = responses
          .flat()
          .sort((a, b) => {
            const dateA = a.testDate ?? '';
            const dateB = b.testDate ?? '';
            return dateB.localeCompare(dateA);
          });
      },
      error: (err: unknown) => {
        console.error('Error cargando pruebas:', err);
      }
    });
  }

  get recentTests(): Test[] {
    return this.tests.slice(0, 3);
  }

  openTestDetail(id?: string): void {
    if (!id) return;

    this.router.navigate(['/test/test-detail', id]);
  }

  openTestModal(): void {
    this.showTestModal = true;
  }

  closeTestModal(): void {
    this.showTestModal = false;
    this.resetForm();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  createTest(): void {
    if (!this.newTest.petId || !this.newTest.name.trim()) {
      return;
    }

    this.isSaving = true;

    const selectedPet = this.pets.find((pet) => pet.id === this.newTest.petId);

    if (!selectedPet) {
      this.isSaving = false;
      return;
    }

    const formData = new FormData();

    formData.append('petId', selectedPet.id);
    formData.append('name', this.newTest.name.trim());
    formData.append('type', this.newTest.type.trim());
    formData.append('testDate', this.newTest.testDate);
    formData.append('result', this.newTest.result.trim());
    formData.append('vetName', this.newTest.vetName.trim());
    formData.append('notes', this.newTest.notes.trim());

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.testService.createWithFile(formData).subscribe({
      next: (createdTest: Test) => {
        this.tests = [
          {
            ...createdTest,
            petId: selectedPet.id,
            petName: selectedPet.petName
          },
          ...this.tests
        ];

        this.isSaving = false;
        this.closeTestModal();
      },
      error: (err: unknown) => {
        console.error('Error creando prueba:', err);
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
    this.newTest = this.getEmptyTestForm();
    this.selectedFile = null;
  }

  private getEmptyTestForm() {
    return {
      petId: '',
      name: '',
      type: '',
      testDate: this.formatDateForInput(new Date()),
      result: '',
      vetName: '',
      notes: '',
      fileName: ''
    };
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

readonly imageVersion = Date.now();

getPetImage(test: Test): string {
  const pet = this.pets.find((p) => p.id === test.petId);

  if (pet?.photo) {
    return `http://localhost:8080/pets/${pet.photo}?t=${this.imageVersion}`;
  }

  return '/default-placeholder.jpg';
}

}