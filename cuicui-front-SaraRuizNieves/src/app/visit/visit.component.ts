import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetService, PetDto } from '../services/pet.service';
import { VisitService, VisitDto } from '../services/visit.service';

type VisitColorKey = 'past' | 'this-week' | 'next-week' | 'next-30-days' | 'later';

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  currentDate = new Date();
  selectedDate = this.formatDate(new Date());

  showVisitModal = false;
  isSaving = false;

  pets: PetDto[] = [];
  visits: VisitDto[] = [];

  newVisit = {
    petId: '',
    vetName: '',
    date: this.formatDate(new Date()),
    time: '',
    notes: ''
  };

  constructor(
    private petService: PetService,
    private visitService: VisitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPets();
    this.loadVisits();
  }

  get monthLabel(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  get calendarDays(): Array<{ date: Date; currentMonth: boolean }> {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ date: Date; currentMonth: boolean }> = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month, -i),
        currentMonth: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true
      });
    }

    while (days.length < 35) {
      const nextDay = days.length - (startDay + daysInMonth) + 1;
      days.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false
      });
    }

    return days;
  }

  get upcomingVisits(): VisitDto[] {
    return [...this.visits]
      .filter((visit) => !visit.finished)
      .sort((a, b) => {
        const aDate = new Date(`${a.date}T${a.time}`);
        const bDate = new Date(`${b.date}T${b.time}`);
        return aDate.getTime() - bDate.getTime();
      });
  }

  loadPets(): void {
    this.petService.getMyPets().subscribe({
      next: (pets: PetDto[]) => {
        this.pets = pets.filter((pet) => !pet.dateDisable);
      },
      error: (err: unknown) => {
        console.error('Error cargando cobayas:', err);
      }
    });
  }

  loadVisits(): void {
    this.visitService.getMyVisits().subscribe({
      next: (visits: VisitDto[]) => {
        this.visits = visits;
      },
      error: (err: unknown) => {
        console.error('Error cargando visitas:', err);
      }
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
  }

  selectDate(date: Date): void {
    this.selectedDate = this.formatDate(date);
  }

  formatDateForTemplate(date: Date): string {
    return this.formatDate(date);
  }

  getVisitCountForSelectedMonth(): number {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();

    return this.visits.filter((visit) => {
      const date = new Date(`${visit.date}T00:00:00`);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length;
  }

hasVisitOnDate(date: Date): boolean {
  const formatted = this.formatDate(date);

  return this.visits.some(
    (visit) => this.normalizeDateString(visit.date) === formatted
  );
}

  openVisitDetail(id: string): void {
    this.router.navigate(['/visit/visit-detail', id]);
  }

getVisitForDate(date: Date): VisitDto | undefined {
  const formatted = this.formatDate(date);

  return this.visits.find(
    (visit) => this.normalizeDateString(visit.date) === formatted
  );
}

openVisitFromCalendar(date: Date): void {
  const visit = this.getVisitForDate(date);

  if (!visit) return;

  this.router.navigate(['/visit/visit-detail', visit.id]);
}

get selectedDateVisits(): VisitDto[] {
  return this.visits
    .filter((visit) => this.normalizeDateString(visit.date) === this.selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));
}
private normalizeDateString(dateString: string): string {
  return dateString.includes('T')
    ? dateString.split('T')[0]
    : dateString;
}

  getVisitColor(dateString: string): VisitColorKey {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const visitDateRaw = new Date(`${dateString}T00:00:00`);
    const visitDate = new Date(
      visitDateRaw.getFullYear(),
      visitDateRaw.getMonth(),
      visitDateRaw.getDate()
    );

    const currentDay = todayStart.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

    const startOfThisWeek = new Date(todayStart);
    startOfThisWeek.setDate(todayStart.getDate() - daysFromMonday);

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);

    const startOfWeekAfterNext = new Date(startOfNextWeek);
    startOfWeekAfterNext.setDate(startOfNextWeek.getDate() + 7);

    const next30Days = new Date(todayStart);
    next30Days.setDate(todayStart.getDate() + 30);

    if (visitDate < todayStart) return 'past';

    if (visitDate >= todayStart && visitDate < startOfNextWeek) {
      return 'this-week';
    }

    if (visitDate >= startOfNextWeek && visitDate < startOfWeekAfterNext) {
      return 'next-week';
    }

    if (visitDate <= next30Days) {
      return 'next-30-days';
    }

    return 'later';
  }

getCalendarDayClass(date: Date): string {
  const formatted = this.formatDate(date);

  const visit = this.visits.find(
    (v) => this.normalizeDateString(v.date) === formatted
  );

  if (!visit) return '';

  const color = this.getVisitColor(
    this.normalizeDateString(visit.date)
  );

  if (color === 'past') return 'day-past';
  if (color === 'this-week') return 'day-this-week';
  if (color === 'next-week') return 'day-next-week';
  if (color === 'next-30-days') return 'day-next-30';

  return 'day-later';
}

  getVisitCardClass(visit: VisitDto): string {
    const color = this.getVisitColor(visit.date);

    if (color === 'past') return 'visit-past';
    if (color === 'this-week') return 'visit-this-week';
    if (color === 'next-week') return 'visit-next-week';
    if (color === 'next-30-days') return 'visit-next-30';
    return 'visit-later';
  }

  getVisitDateLabel(dateString: string): string {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getPetImage(visit: VisitDto): string {
    if (!visit.petPhoto) {
      return '/default-placeholder.jpg';
    }

    if (visit.petPhoto.startsWith('http')) {
      return visit.petPhoto;
    }

    return `http://localhost:8080/pets/${visit.petPhoto}`;
  }

  openVisitModal(): void {
    this.showVisitModal = true;
  }

  closeVisitModal(): void {
    this.showVisitModal = false;
    this.resetForm();
  }

  createVisit(): void {
    if (
      !this.newVisit.petId ||
      !this.newVisit.vetName.trim() ||
      !this.newVisit.date ||
      !this.newVisit.time
    ) {
      console.warn('Formulario incompleto:', this.newVisit);
      return;
    }

    this.isSaving = true;

    const body = {
      petId: this.newVisit.petId,
      vetName: this.newVisit.vetName.trim(),
      date: this.newVisit.date,
      time: this.newVisit.time,
      notes: this.newVisit.notes.trim() || null
    };

    this.visitService.createVisit(body).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeVisitModal();
        this.loadVisits();
      },
      error: (err: unknown) => {
        console.error('Error creando visita:', err);
        this.isSaving = false;
      }
    });
  }

  private resetForm(): void {
    this.newVisit = {
      petId: '',
      vetName: '',
      date: this.formatDate(new Date()),
      time: '',
      notes: ''
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  
}