
export interface Booking {
  id: string;
  name: string;
  email: string;
  reason: string;
  date: string; // ISO format YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'personal' | 'familiar' | 'sanidad' | 'liberacion';
}

export interface TimeSlot {
  hour: number;
  label: string;
}

export interface DayInfo {
  date: Date;
  label: string;
  isToday: boolean;
}

export type MinistracionType = 'personal' | 'familiar' | 'sanidad' | 'liberacion';

export const MINISTRACION_LABELS: Record<MinistracionType, string> = {
  personal: 'Cuidado Personal',
  familiar: 'Restauración Familiar',
  sanidad: 'Sanidad Interior',
  liberacion: 'Ministración de Liberación'
};
