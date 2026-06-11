import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;

  avatar: string | null = null;
  showAvatarSelector = false;
  showPasswordForm = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  avatars: string[] = [
    '/avatar/1.png',
    '/avatar/2.png',
    '/avatar/3.png',
    '/avatar/4.png',
    '/avatar/5.png',
    '/avatar/6.png',
    '/avatar/7.png',
    '/avatar/8.png'
  ];

  constructor(
  private fb: FormBuilder,
  private usuarioService: UsuarioService) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const name = localStorage.getItem('name') || '';
    const email = localStorage.getItem('email') || '';
    const storedAvatar = localStorage.getItem('avatar');

    this.avatar =
    storedAvatar && storedAvatar !== 'null' && storedAvatar !== 'undefined'
      ? storedAvatar
      : '/avatar/1.png';

    this.userForm.patchValue({
      name,
      email
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleAvatarSelector(): void {
    this.showAvatarSelector = !this.showAvatarSelector;
  }

  selectAvatar(selectedAvatar: string): void {
    this.avatar = selectedAvatar;
    localStorage.setItem('avatar', selectedAvatar);
    this.showAvatarSelector = false;
    this.successMessage = 'Avatar actualizado correctamente.';
    this.errorMessage = null;
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm.reset();
    this.successMessage = null;
    this.errorMessage = null;
  }

saveChanges(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    this.errorMessage = 'Revisa los campos de nombre y correo.';
    this.successMessage = null;
    return;
  }

  const { name, email } = this.userForm.value;

  this.usuarioService.updateUser({
    name,
    email,
    avatar: this.avatar || '/avatar/1.png'
  }).subscribe({
    next: (response) => {
      localStorage.setItem('name', response.name);
      localStorage.setItem('email', response.email);
      localStorage.setItem('avatar', response.avatar || '/avatar/1.png');

      this.successMessage = 'Cambios guardados correctamente.';
      this.errorMessage = null;
    },
    error: (error) => {
      console.error(error);

      if (error.status === 409) {
        this.errorMessage = 'Correo electrónico ya en uso';
      } else {
        this.errorMessage = 'Error al guardar cambios';
      }

      this.successMessage = null;
    }
  });
}

changePassword(): void {
  if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.errors?.['passwordMismatch']) {
      this.errorMessage = 'Las contraseñas no coinciden.';
    } else {
      this.errorMessage = 'Revisa los campos de contraseña.';
    }

    this.successMessage = null;
    return;
  }

  const { newPassword } = this.passwordForm.value;

  this.usuarioService.changePassword({ newPassword }).subscribe({
    next: () => {
      this.successMessage = 'Contraseña actualizada correctamente.';
      this.errorMessage = null;
      this.passwordForm.reset();
      this.showPasswordForm = false;
    },
    error: (error) => {
      console.error('Error al cambiar contraseña:', error);
      console.error('Status:', error.status);
      console.error('Body:', error.error);

      this.errorMessage =
        error.status === 401
          ? 'Tu sesión ha caducado. Vuelve a iniciar sesión.'
          : 'Error al cambiar contraseña.';
      this.successMessage = null;
    }
  });
}

deleteUser(): void {
  const confirmDelete = confirm(
    '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
  );

  if (!confirmDelete) return;

  this.usuarioService.deleteUser().subscribe({
    next: () => {
      // limpiar sesión
      localStorage.clear();

      // redirigir a login
      window.location.href = '/login';
    },
    error: (error) => {
      console.error('Error al eliminar usuario:', error);
      this.errorMessage = 'Error al eliminar la cuenta.';
    }
  });
}

get nameControl() {
  return this.userForm.get('name');
}

get emailControl() {
  return this.userForm.get('email');
}

get newPasswordControl() {
  return this.passwordForm.get('newPassword');
}

get confirmPasswordControl() {
  return this.passwordForm.get('confirmPassword');
}
}