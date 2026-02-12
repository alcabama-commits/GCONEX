
import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  User, 
  X,
  Lock,
  Info,
  CheckCircle2
} from 'lucide-react';
// Fixing date-fns imports by using specific paths for better compatibility in environments where named root exports might fail
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import getDay from 'date-fns/getDay';
// Importing Spanish locale directly from its specific path
import es from 'date-fns/locale/es';
import { Booking } from './types';

// Logo oficial transparente
const LOGO_URL = "https://i.postimg.cc/63ny6hs7/Logo-G-conexion-2023PNG.png";

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    reason: ''
  });

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => {
      const day = addDays(start, i);
      return {
        date: day,
        label: format(day, 'EEE d', { locale: es }),
        isToday: isSameDay(day, new Date()),
        isAvailableDay: getDay(day) === 1 || getDay(day) === 2 // Lunes = 1, Martes = 2
      };
    });
  }, [currentDate]);

  const timeSlots = [{ hour: 21, label: '21:00' }];

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const openBookingModal = (day: Date, time: string) => {
    const dayOfWeek = getDay(day);
    if (dayOfWeek !== 1 && dayOfWeek !== 2) return;
    setSelectedSlot({ date: day, time });
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !formData.name.trim()) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: '',
      reason: formData.reason || 'Ministración',
      type: 'personal',
      date: format(selectedSlot.date, 'yyyy-MM-dd'),
      startTime: selectedSlot.time,
      endTime: '22:00',
    };

    setBookings([...bookings, newBooking]);
    setIsBookingModalOpen(false);
    setFormData({ name: '', reason: '' });
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header con el logo transparente y prominente */}
      <header className="bg-white border-b border-red-100 sticky top-0 z-30 px-6 py-8 flex flex-col items-center justify-center shadow-md">
        <img 
          src={LOGO_URL} 
          alt="Grupo de Conexión" 
          className="h-28 md:h-32 w-auto object-contain mb-4 transition-transform hover:scale-105 duration-300 drop-shadow-sm" 
        />
        <h1 className="text-2xl font-black text-red-700 uppercase tracking-tighter text-center">
          Agenda de Ministraciones
        </h1>
        <div className="mt-3 flex items-center gap-2 px-4 py-1.5 bg-red-600 rounded-full shadow-lg shadow-red-100">
          <span className="text-[11px] text-white font-black uppercase tracking-[0.25em]">Grupo de Conexión</span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        {/* Banner Informativo Lunes y Martes */}
        <div className="mb-10 bg-gradient-to-br from-red-50 to-white border-2 border-red-100 rounded-[3rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-red-50">
          <div className="bg-red-600 p-5 rounded-[2rem] text-white shadow-lg shadow-red-200">
            <CalendarIcon size={36} strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-red-800 uppercase tracking-tight">Horarios Disponibles</h2>
            <p className="text-red-600 font-bold text-lg mt-1">Lunes y Martes • 9:00 PM a 10:00 PM</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-2xl border-2 border-red-50 font-black text-red-700 text-sm shadow-sm ring-4 ring-red-50">
            1 CUPO POR DÍA
          </div>
        </div>

        {/* Navegación del Calendario */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <button onClick={handlePrevWeek} className="p-3 bg-white hover:bg-red-600 hover:text-white rounded-2xl border-2 border-red-50 text-red-600 transition-all shadow-sm">
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-[0.1em] px-4 min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            <button onClick={handleNextWeek} className="p-3 bg-white hover:bg-red-600 hover:text-white rounded-2xl border-2 border-red-50 text-red-600 transition-all shadow-sm">
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="hidden sm:block text-xs font-black text-red-600 uppercase border-b-4 border-red-600 pb-1 hover:text-red-800 hover:border-red-800 transition-all"
          >
            Hoy
          </button>
        </div>

        {/* Cuadrícula del Calendario */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-red-100 border-4 border-red-50 overflow-hidden">
          <div className="grid grid-cols-7 border-b-2 border-red-50 bg-red-50/20">
            {weekDays.map((day) => (
              <div 
                key={day.date.toString()} 
                className={`py-10 text-center border-r last:border-r-0 border-red-50 ${day.isToday ? 'bg-red-50' : ''}`}
              >
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${day.isAvailableDay ? 'text-red-600' : 'text-slate-400'}`}>
                  {format(day.date, 'EEE', { locale: es })}
                </span>
                <div className={`mt-3 text-4xl font-black ${day.isToday ? 'text-red-600 scale-110' : 'text-slate-800'}`}>
                  {format(day.date, 'd')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 min-h-[350px] flex flex-col justify-center">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="grid grid-cols-7 h-56">
                {weekDays.map((day) => {
                  const dayStr = format(day.date, 'yyyy-MM-dd');
                  const booking = bookings.find(b => b.date === dayStr && b.startTime === slot.label);
                  const isSelectable = day.isAvailableDay;
                  
                  return (
                    <div 
                      key={`${dayStr}-${slot.hour}`} 
                      className={`border-r last:border-r-0 border-red-50 relative group transition-all p-3
                        ${!isSelectable ? 'bg-slate-50/40 cursor-not-allowed opacity-40' : 'hover:bg-red-50/40'}`}
                    >
                      {!isSelectable ? (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                          <Lock size={40} strokeWidth={1.5} />
                        </div>
                      ) : booking ? (
                        <div className="h-full w-full p-6 rounded-[2.5rem] bg-red-600 text-white shadow-xl shadow-red-200 flex flex-col items-center justify-center text-center animate-in">
                          <CheckCircle2 size={32} className="mb-3" />
                          <div className="font-black text-base uppercase leading-tight line-clamp-3">{booking.name}</div>
                          <div className="text-[10px] font-black mt-3 opacity-90 uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full">RESERVADO</div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => openBookingModal(day.date, slot.label)}
                          className="h-full w-full rounded-[2.5rem] border-4 border-dashed border-red-100 flex flex-col items-center justify-center gap-4 group-hover:border-red-600 group-hover:bg-white transition-all group-hover:shadow-2xl group-hover:shadow-red-100"
                        >
                          <div className="bg-red-50 text-red-600 p-4 rounded-3xl group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:scale-110">
                            <Plus size={32} strokeWidth={4} />
                          </div>
                          <span className="text-[12px] font-black text-red-400 group-hover:text-red-700 uppercase tracking-widest">9:00 PM</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-10 flex items-start gap-4 text-slate-500 bg-red-50/30 p-8 rounded-[2.5rem] border-2 border-red-50 shadow-inner">
          <Info size={24} className="mt-1 flex-shrink-0 text-red-500" />
          <p className="text-sm font-semibold leading-relaxed italic">
            Atención: El sistema bloquea automáticamente el espacio una vez que un usuario ingresa su nombre. 
            Si necesitas cancelar o cambiar tu cita, por favor contacta al administrador del grupo de Conexión.
          </p>
        </div>
      </main>

      {/* Modal de Reserva */}
      {isBookingModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-xl">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-md overflow-hidden animate-in">
            <div className="bg-red-600 p-12 text-white relative text-center">
              <img src={LOGO_URL} alt="Logo" className="h-24 w-auto mx-auto mb-8 brightness-0 invert" />
              <h3 className="text-3xl font-black uppercase tracking-tighter">Confirmar Espacio</h3>
              <p className="text-red-100 text-sm mt-4 font-black uppercase tracking-widest flex items-center justify-center gap-3">
                <CalendarIcon size={18} />
                {format(selectedSlot.date, "EEEE d 'de' MMMM", { locale: es })} • 21:00
              </p>
              <button 
                onClick={() => setIsBookingModalOpen(false)} 
                className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors"
              >
                <X size={36} strokeWidth={4} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-12 space-y-10">
              <div className="space-y-4">
                <label className="text-[12px] font-black text-red-600 uppercase tracking-[0.25em] ml-3">
                  Tu Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-red-300" size={24} />
                  <input 
                    required
                    autoFocus
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-slate-50 border-4 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-black text-slate-800 placeholder:text-slate-300 uppercase tracking-tight text-lg"
                    placeholder="ESCRIBE AQUÍ..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-2xl shadow-red-200 active:scale-95 text-xl"
                >
                  SEPARAR CUPO
                </button>
                <p className="text-center text-[11px] text-slate-400 font-black uppercase mt-10 tracking-[0.15em] leading-relaxed">
                  Este espacio será <span className="text-red-600">bloqueado inmediatamente</span> al confirmar.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
