
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
import { format, startOfISOWeek, addDays, isSameDay, getDay, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale/es';

const LOGO_URL = "https://i.postimg.cc/63ny6hs7/Logo-G-conexion-2023PNG.png";

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const handlePrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));

  const weekDays = useMemo(() => {
    const start = startOfISOWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const day = addDays(start, i);
      return {
        date: day,
        label: format(day, 'EEE d', { locale: es }),
        isToday: isSameDay(day, new Date()),
        isAvailableDay: getDay(day) === 1 || getDay(day) === 2 // Lunes y Martes
      };
    });
  }, [currentDate]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot || !formData.name.trim()) return;

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      date: format(selectedSlot.date, 'yyyy-MM-dd'),
      startTime: '21:00',
    };

    setBookings([...bookings, newBooking]);
    setIsBookingModalOpen(false);
    setFormData({ name: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b-2 border-red-100 sticky top-0 z-30 px-6 py-8 flex flex-col items-center shadow-lg">
        <img src={LOGO_URL} alt="Logo" className="h-20 md:h-24 w-auto object-contain mb-4 drop-shadow-md" />
        <h1 className="text-xl md:text-2xl font-black text-red-700 uppercase tracking-tighter text-center">
          Agenda de Ministraciones
        </h1>
        <div className="mt-3 px-4 py-1 bg-red-600 rounded-full">
          <span className="text-[10px] text-white font-black uppercase tracking-widest">Grupo de Conexión</span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="mb-8 bg-white border-2 border-red-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="bg-red-600 p-4 rounded-2xl text-white shadow-lg">
            <CalendarIcon size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-black text-red-800 uppercase">Horarios Disponibles</h2>
            <p className="text-red-600 font-bold text-sm">Lunes y Martes • 9:00 PM</p>
          </div>
          <div className="bg-red-50 px-6 py-2 rounded-xl border border-red-100 font-black text-red-700 text-[10px]">
            1 CUPO POR DÍA
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevWeek} className="p-2 bg-white rounded-xl border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest px-4 w-36 text-center">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            <button onClick={handleNextWeek} className="p-2 bg-white rounded-xl border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="text-[10px] font-black text-red-600 uppercase border-b-2 border-red-600 pb-0.5">Ir a Hoy</button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {weekDays.map((day) => (
              <div key={day.date.toString()} className={`py-6 text-center border-r last:border-r-0 border-slate-100 ${day.isToday ? 'bg-red-50/50' : ''}`}>
                <span className={`text-[9px] font-black uppercase opacity-60 ${day.isAvailableDay ? 'text-red-600' : 'text-slate-400'}`}>
                  {format(day.date, 'EEE', { locale: es })}
                </span>
                <div className={`mt-1 text-xl font-black ${day.isToday ? 'text-red-600' : 'text-slate-800'}`}>
                  {format(day.date, 'd')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 grid grid-cols-7 gap-3 min-h-[160px]">
            {weekDays.map((day) => {
              const dayStr = format(day.date, 'yyyy-MM-dd');
              const booking = bookings.find(b => b.date === dayStr);
              const isSelectable = day.isAvailableDay;

              return (
                <div key={dayStr} className="h-32 relative group">
                  {!isSelectable ? (
                    <div className="h-full w-full rounded-2xl bg-slate-100/50 flex items-center justify-center text-slate-200">
                      <Lock size={20} />
                    </div>
                  ) : booking ? (
                    <div className="h-full w-full p-3 rounded-2xl bg-red-600 text-white shadow-lg flex flex-col items-center justify-center text-center animate-in">
                      <CheckCircle2 size={18} className="mb-1" />
                      <div className="font-black text-[9px] uppercase line-clamp-2 leading-tight">{booking.name}</div>
                      <div className="text-[7px] font-bold mt-2 opacity-75 uppercase tracking-tighter">RESERVADO</div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setSelectedSlot({date: day.date, time: '21:00'}); setIsBookingModalOpen(true); }}
                      className="h-full w-full rounded-2xl border-2 border-dashed border-red-200 flex flex-col items-center justify-center gap-2 hover:border-red-600 hover:bg-white transition-all hover:shadow-xl"
                    >
                      <Plus size={18} className="text-red-600" />
                      <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">9:00 PM</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {isBookingModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in">
            <div className="bg-red-600 p-8 text-white relative text-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Reservar Cupo</h3>
              <p className="text-red-100 text-[10px] mt-2 font-black uppercase tracking-widest">
                {format(selectedSlot.date, "EEEE d 'de' MMMM", { locale: es })} • 21:00
              </p>
              <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-red-600 uppercase tracking-widest ml-2">Tu Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300" size={16} />
                  <input required autoFocus type="text" value={formData.name} onChange={e => setFormData({name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-red-600 outline-none font-black text-slate-800 placeholder:text-slate-300 uppercase text-xs"
                    placeholder="ESCRIBE AQUÍ..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-100 transition-all">
                CONFIRMAR RESERVA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
