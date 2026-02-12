
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
import { format, startOfWeek, addDays, isSameDay, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Booking, MinistracionType } from './types';

const LOGO_URL = "https://i.postimg.cc/63ny6hs7/Logo-G-conexion-2023PNG.png";

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      name: 'Ejemplo de Reserva',
      email: '',
      reason: 'Ministración',
      date: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      startTime: '21:00',
      endTime: '22:00',
      type: 'personal'
    }
  ]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);

  // Form states
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
        isAvailableDay: getDay(day) === 1 || getDay(day) === 2 // 1 = Monday, 2 = Tuesday
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
      {/* Header with more prominence for the logo */}
      <header className="bg-white border-b border-red-100 sticky top-0 z-30 px-6 py-6 flex flex-col items-center justify-center shadow-sm">
        <img src={LOGO_URL} alt="Grupo de Conexión" className="h-24 w-auto object-contain mb-2 transition-transform hover:scale-105 duration-300" />
        <h1 className="text-xl font-black text-red-700 uppercase tracking-tighter text-center">
          Agenda de Ministraciones
        </h1>
        <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full">
          <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Grupo de Conexión</span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        {/* Banner Informativo */}
        <div className="mb-10 bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-red-50">
          <div className="bg-red-600 p-4 rounded-3xl text-white">
            <CalendarIcon size={32} strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-black text-red-800 uppercase tracking-tight">Horarios Disponibles</h2>
            <p className="text-red-600 font-bold mt-1">Lunes y Martes de 9:00 PM a 10:00 PM</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-red-100 font-black text-red-700 text-sm shadow-sm">
            SOLO 1 CUPO POR DÍA
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={handlePrevWeek} className="p-3 hover:bg-red-600 hover:text-white rounded-2xl border border-red-100 text-red-600 transition-all shadow-sm">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest px-4">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            <button onClick={handleNextWeek} className="p-3 hover:bg-red-600 hover:text-white rounded-2xl border border-red-100 text-red-600 transition-all shadow-sm">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-black text-red-600 uppercase border-b-2 border-red-600 pb-0.5 hover:text-red-800 hover:border-red-800 transition-all"
          >
            Volver a Hoy
          </button>
        </div>

        {/* Weekly View Grid */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-red-100 border border-slate-100 overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
            {weekDays.map((day) => (
              <div 
                key={day.date.toString()} 
                className={`py-8 text-center border-r last:border-r-0 border-slate-100 ${day.isToday ? 'bg-red-50/50' : ''}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${day.isAvailableDay ? 'text-red-600' : 'text-slate-400'}`}>
                  {format(day.date, 'EEE', { locale: es })}
                </span>
                <div className={`mt-2 text-3xl font-black ${day.isToday ? 'text-red-600 underline decoration-4 underline-offset-8' : 'text-slate-800'}`}>
                  {format(day.date, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Slots View */}
          <div className="p-2 min-h-[300px] flex flex-col justify-center">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="grid grid-cols-7 h-48">
                {weekDays.map((day) => {
                  const dayStr = format(day.date, 'yyyy-MM-dd');
                  const booking = bookings.find(b => b.date === dayStr && b.startTime === slot.label);
                  const isSelectable = day.isAvailableDay;
                  
                  return (
                    <div 
                      key={`${dayStr}-${slot.hour}`} 
                      className={`border-r last:border-r-0 border-slate-100 relative group transition-all p-2
                        ${!isSelectable ? 'bg-slate-50/40 cursor-not-allowed' : 'hover:bg-red-50/30'}`}
                    >
                      {!isSelectable ? (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <Lock size={32} />
                        </div>
                      ) : booking ? (
                        <div className="h-full w-full p-4 rounded-[2rem] bg-red-600 text-white shadow-lg shadow-red-200 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                          {/* Fixed: Added missing CheckCircle2 import */}
                          <CheckCircle2 size={24} className="mb-2" />
                          <div className="font-black text-sm uppercase leading-tight line-clamp-2">{booking.name}</div>
                          <div className="text-[10px] font-bold mt-2 opacity-80 uppercase tracking-widest">RESERVADO</div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => openBookingModal(day.date, slot.label)}
                          className="h-full w-full rounded-[2rem] border-2 border-dashed border-red-200 flex flex-col items-center justify-center gap-3 group-hover:border-red-600 group-hover:bg-white transition-all group-hover:shadow-xl group-hover:shadow-red-50"
                        >
                          <div className="bg-red-50 text-red-600 p-3 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <Plus size={24} strokeWidth={3} />
                          </div>
                          <span className="text-[10px] font-black text-red-400 group-hover:text-red-600 uppercase tracking-widest">9:00 PM</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex items-start gap-3 text-slate-400 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <Info size={20} className="mt-0.5 flex-shrink-0 text-red-300" />
          <p className="text-xs font-medium leading-relaxed italic">
            Importante: Solo se habilitan los lunes y martes a las 9:00 PM. Si el espacio aparece con un nombre, ya ha sido reservado por otro miembro del grupo. 
            Por favor, busca la fecha disponible más cercana para tu ministración.
          </p>
        </div>
      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-500">
            <div className="bg-red-600 p-10 text-white relative text-center">
              <img src={LOGO_URL} alt="Logo" className="h-20 w-auto mx-auto mb-6 brightness-0 invert" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">Reservar Ministración</h3>
              <p className="text-red-100 text-xs mt-3 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <CalendarIcon size={14} />
                {format(selectedSlot.date, "EEEE d 'de' MMMM", { locale: es })} • 21:00
              </p>
              <button 
                onClick={() => setIsBookingModalOpen(false)} 
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
              >
                <X size={28} strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] ml-2">
                  Tu Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-red-300" size={20} />
                  <input 
                    required
                    autoFocus
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-black text-slate-800 placeholder:text-slate-300 uppercase tracking-tight"
                    placeholder="ESCRIBE AQUÍ..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] ml-2">
                  Breve Motivo (Opcional)
                </label>
                <textarea 
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 resize-none"
                  placeholder="EJ. SALUD, FAMILIA..."
                  rows={2}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.15em] hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95 text-lg"
                >
                  Confirmar Cupo
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-8 tracking-widest leading-relaxed">
                  Al confirmar, este espacio será <span className="text-red-600">bloqueado automáticamente</span> para tu atención.
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
