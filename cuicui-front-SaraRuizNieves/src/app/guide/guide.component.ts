import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Guide {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
}

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent {

  categories = [
    'Todas',
    'Alimentación',
    'Salud',
    'Hábitat',
    'Información',
  ];

  selectedCategory = 'Todas';

    guides: Guide[] = [
    {
        id: '1',
        title: 'Alimentación para cobayas',
        description: '¿Qué pueden y no pueden comer?',
        source: 'Roedores domésticos',
        url: 'https://roedoresdomesticos.com/cobayas/alimentacion-para-cobayas-que-pueden-y-no-pueden-comer/',
        category: 'Alimentación'
    },
    {
        id: '2',
        title: 'Razas de cobaya',
        description: 'Clasificación por razas/colores',
        source: 'Cobayas España',
        url: 'https://www.cobayasespana.es/informacion/razas-y-colores-de-las-cobayas/',
        category: 'Información'
    },
    {
        id: '3',
        title: 'Cómo construir un refugio para cobayas',
        description: '¡Dales un hogar seguro y acogedor!',
        source: 'Bicheros',
        url: 'https://bicheros.es/como-construir-un-refugio-para-cobayas/',
        category: 'Hábitat'
    },
        {
        id: '4',
        title: 'Fisiología de las cobayas',
        description: 'Conoce cómo funciona el cuerpo de las cobayas',
        source: 'Cobayas España',
        url: 'https://www.cobayasespana.es/informacion/fisiologia/',
        category: 'Información'
    },
        {
        id: '5',
        title: 'Problemas de salud comunes de los cobayas',
        description: 'Algunos puntos clave',
        source: 'MSD Veterinary Manual',
        url: 'https://www.msdvetmanual.com/es/todas-las-dem%C3%A1s-mascotas/cobayas/problemas-de-salud-comunes-de-los-cobayas',
        category: 'Salud'
    },
        {
        id: '6',
        title: '¿Qué pueden comer las cobayas?',
        description: 'Dieta principal y alimentación secundaria',
        source: 'Medivet',
        url: 'https://www.medivetgroup.com/es-es/cuidado-de-mascotas/consejos-sobre-mascotas/que-pueden-comer-las-cobayas/',
        category: 'Alimentación'
    },
        {
        id: '7',
        title: 'Higiene de la cobaya',
        description: 'Tips para mantenerla saludable y segura',
        source: 'Amantes de las plantas',
        url: 'https://amantesdelasplantas.com/zoologia/limpieza-de-cobayas/',
        category: 'Salud'
    }
    ];

  get filteredGuides(): Guide[] {
    if (this.selectedCategory === 'Todas') {
      return this.guides;
    }

    return this.guides.filter(
      guide => guide.category === this.selectedCategory
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  openGuide(url: string): void {
    window.open(url, '_blank');
  }

  openExternalLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
}