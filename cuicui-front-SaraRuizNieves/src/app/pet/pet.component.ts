import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetService, PetDto } from '../services/pet.service';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})

export class PetComponent {
  createPetForm: FormGroup;
  mascotas: PetDto[] = [];
  isCollapsed = true;
  selectedImageFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';
selectedImageBase64: string | null = null;
selectedImageName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private petService: PetService
  ) {
    this.createPetForm = this.fb.group({
      petName: ['', Validators.required],
      breed: [''],
      dateBirth: [''],
      gender: [''],
      dateAdoption: ['']
    });
  }

  ngOnInit(): void {
  this.loadMyPets();
}

loadMyPets(): void {
  this.petService.getMyPets().subscribe({
    next: (pets) => {
      console.log('Mascotas cargadas:', pets);
      this.mascotas = pets;
    },
    error: (err) => {
      console.error('Error cargando mascotas:', err);
    }
  });
}

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.errorMessage = '';
  }

getPetCardStyle(mascota: any): { [key: string]: string } {
  const imageUrl = mascota?.photo
    ? `http://localhost:8080/pets/${mascota.photo}`
    : '/default-placeholder.jpg';

  console.log('Foto mascota:', mascota.petName, imageUrl);

  return {
    'background-image': `url("${imageUrl}")`,
    'background-size': 'cover',
    'background-position': 'center',
    'background-repeat': 'no-repeat'
  };
}

  setGender(gender: 'Macho' | 'Hembra'): void {
    this.createPetForm.patchValue({ gender });
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

  this.selectedImageFile = file;
  this.selectedImageName = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string;
    this.selectedImageBase64 = result.split(',')[1];
  };
  reader.readAsDataURL(file);
}

  createPet(): void {
    if (this.createPetForm.invalid) {
      this.createPetForm.markAllAsTouched();
      return;
    }

    const formValue = this.createPetForm.value;

    const body = {
      petName: formValue.petName ?? '',
      breed: formValue.breed ?? '',
      dateBirth: formValue.dateBirth ?? null,
      gender: formValue.gender ?? '',
      dateAdoption: formValue.dateAdoption ?? null,
      photo: this.selectedImageBase64 ?? null,
      photoName: this.selectedImageName ?? null
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.petService.createPet(body).subscribe({
      next: (newPet) => {
          console.log('Mascota creada:', newPet);
        this.mascotas = [newPet, ...this.mascotas];
        this.createPetForm.reset();
        this.selectedImageFile = null;
        this.selectedImageBase64 = null;
        this.selectedImageName = null;
        this.isSubmitting = false;
        this.isCollapsed = true;
      },
      error: (error) => {
        console.error('Error al crear mascota', error);
        this.errorMessage = 'No se pudo crear la mascota';
        this.isSubmitting = false;
      }
    });
  }
}