import { Component } from '@angular/core';

// El decorador @Component define metadatos del componente (cómo se representa en HTML, qué archivos usa, etc.)
@Component({
  // 'selector' es el nombre de etiqueta HTML que se usará para insertar este componente en otras vistas
  selector: 'app-pages',

  // Archivo HTML que contiene la estructura (vista) del componente
  templateUrl: './pages.component.html',

  // Archivo CSS con los estilos específicos para este componente
  styleUrls: ['./pages.component.css']
})

// Clase del componente, exportada para que Angular pueda instanciarla y usarla en las vistas
export class PagesComponent {
  // Actualmente está vacío, pero aquí iría la lógica del componente (variables, métodos, hooks como ngOnInit, etc.)
}

