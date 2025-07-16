import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface EventPayload {
  type: string;
  data: any;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private eventSource: EventSource | null = null;
  private subjects: Map<string, Subject<EventPayload>> = new Map();

  constructor(private zone: NgZone) {}

  listenToEvent(eventType: string, url: string): Observable<EventPayload> {
    if (!this.eventSource) {
      this.eventSource = new EventSource(url);

      this.eventSource.onerror = (error) => {
        console.error('❌ Error en SSE:', error);
        this.subjects.forEach(subject => subject.error(error));
      };
    }

    if (!this.subjects.has(eventType)) {
      const subject = new Subject<EventPayload>();

      this.eventSource.addEventListener(eventType, (event: MessageEvent) => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data);
            subject.next({ type: eventType, data });
          } catch (err) {
            console.error('❌ Error al parsear evento', eventType, err);
          }
        });
      });

      this.subjects.set(eventType, subject);
    }

    return this.subjects.get(eventType)!.asObservable();
  }

  close(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.subjects.clear();
    console.log('🔌 Conexión SSE cerrada');
  }
}
