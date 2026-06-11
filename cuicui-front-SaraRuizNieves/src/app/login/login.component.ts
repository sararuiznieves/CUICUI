import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { UsuarioService } from '../services/usuario.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isCreatingUser: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService, 
    private router: Router
  ) {
    // Crear formulario reactivo
this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required]],
  confirmPassword: [''],  // 👈 nuevo campo
  name: ['', [Validators.required]]
}, { validators: this.passwordMatchValidator });

  }

  // Método que se ejecuta automáticamente al cargar el componente

  ngOnInit() {
    // Verificar si ya hay una sesión activa guardada en localStorage
    const savedUserSessionId = localStorage.getItem('userSessionId');
    if (savedUserSessionId) {
      console.log('Sesión activa encontrada: ' + savedUserSessionId);
      // Si hay sesión activa, redirigir directamente al /home
      this.router.navigate(['/home']);
    }
  }

  // Método para alternar al modo de "Crear Usuario"
  toggleCreateUser(): void {
    this.isCreatingUser = !this.isCreatingUser;

    // Agregar o quitar validadores del email dinámicamente
    const emailControl = this.loginForm.get('email');
    if (this.isCreatingUser) {
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl?.clearValidators(); 
    }
    emailControl?.updateValueAndValidity(); 
    
   
    this.errorMessage = null;
  }

// Método validador de la contraseña
passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
}

  // Método para manejar la creación de usuario
  onCreateUser(): void {
    if (this.loginForm.valid && this.loginForm.get('email') != null) {
      const userData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
        name: this.loginForm.get('name')?.value,
      };

    
      this.usuarioService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Usuario creado exitosamente:', response);

        
          alert('Usuario creado. Ahora puedes iniciar sesión.');
          this.isCreatingUser = false;
          this.loginForm.reset();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.errorMessage = 'Error al crear usuario. Por favor, intentalo de nuevo.';
        },
      });
    } else {
      this.errorMessage = 'campos incorrectos';
    }
  }

  // Método que se ejecuta al enviar el formulario de Login
  onSubmit() {
  if (this.isCreatingUser) {
    if (this.loginForm.valid) {
      this.onCreateUser();
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  } else {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl?.valid && passwordControl?.valid) {
      const email = emailControl.value;
      const password = passwordControl.value;

      console.log('Intentando login con:', { email, password });

this.usuarioService.login({
  email: email,
  password: password
}).subscribe({
  next: (response) => {
    localStorage.setItem('userSessionId', response.sessionId);
    localStorage.setItem('email', response.email);
    localStorage.setItem('name', response.name);
    
    if (response.avatar && response.avatar !== 'null' && response.avatar !== 'undefined') {
  localStorage.setItem('avatar', response.avatar);
} else if (!localStorage.getItem('avatar')) {
  localStorage.setItem('avatar', '/avatar/1.png');
}

    this.router.navigate(['/home']);
  },
  error: (error) => {
    console.error('Error al iniciar sesión:', error);
    this.errorMessage =
      error.status === 401 ? 'Usuario o contraseña incorrectos' : 'Error de servidor';
  },
      });
    } else {
      this.errorMessage = 'Por favor, introduce un email y una contraseña válidos.';
    }
  }
}
}