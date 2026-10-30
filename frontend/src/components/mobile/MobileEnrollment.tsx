import React, { useState } from 'react';
import {
  Clock,
  Check,
  Users,
  ShieldCheck,
  Calendar,
  BookOpen,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';
import { TIME_BLOCKS, DAYS_OF_WEEK } from '../../data/subjects';
import type { DayOfWeek } from '../../types';

export const MobileEnrollment: React.FC = () => {
  const {
    subjects,
    enrolledCourses,
    selectSection,
    removeSubject,
    joinWaitlist,
    waitlistedSubjects,
    confirmEnrollment,
    totalCredits,
    queueMetrics,
  } = useQueue();

  const [activeTab, setActiveTab] = useState<'asignaturas' | 'horario'>('asignaturas');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Lunes');

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isEnrolled = (subjectCode: string, sectionId: string) => {
    return enrolledCourses.some(
      (e) => e.subject.code === subjectCode && e.section.id === sectionId
    );
  };

  return (
    <div className="pb-24 animate-fadeIn text-slate-100">
      {/* Transactional Countdown Banner */}
      <div className="bg-[#13262F] border-b border-[#31C4D7]/30 px-4 py-2.5 flex items-center justify-between text-xs sticky top-14 z-20">
        <div className="flex items-center gap-1.5 text-[#31C4D7] font-bold">
          <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Tiempo de Reserva:</span>
        </div>
        <span className="font-mono font-black text-sm text-[#31C4D7]">
          {formatCountdown(queueMetrics.transactionSecondsRemaining)}
        </span>
      </div>

      {/* View Toggle Tabs (Asignaturas / Mi Horario) */}
      <div className="p-4 pb-2">
        <div className="grid grid-cols-2 gap-1 bg-[#14151A] p-1 rounded-2xl border border-[#2D323E]">
          <button
            onClick={() => setActiveTab('asignaturas')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'asignaturas'
                ? 'bg-[#20232A] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Asignaturas ({subjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('horario')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'horario'
                ? 'bg-[#20232A] text-[#31C4D7] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mi Horario ({enrolledCourses.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {activeTab === 'asignaturas' ? (
          /* SUBJECTS LIST */
          <div className="space-y-4">
            {subjects.map((sub) => {
              const enrolledItem = enrolledCourses.find((e) => e.subject.code === sub.code);
              const isWaitlisted = waitlistedSubjects[sub.code];

              return (
                <div
                  key={sub.code}
                  className={`bg-[#20232A] border rounded-2xl overflow-hidden transition-all ${
                    enrolledItem
                      ? 'border-[#31C4D7] shadow-lg'
                      : 'border-[#2D323E] hover:border-slate-600'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 bg-[#1a1d24] border-b border-[#2D323E]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black"
                          style={{ backgroundColor: sub.color, color: sub.textColor }}
                        >
                          {sub.code}
                        </span>
                        <h3 className="font-bold text-sm text-white leading-tight">{sub.name}</h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {sub.credits} SCT
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-medium">
                        ✓ {sub.prerequisites[0]}
                      </span>
                      {enrolledItem && (
                        <button
                          onClick={() => removeSubject(sub.code)}
                          className="text-red-400 text-[11px] font-bold hover:underline"
                        >
                          Desmarcar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="p-3 space-y-2.5">
                    {sub.sections.map((sec) => {
                      const isSelected = isEnrolled(sub.code, sec.id);
                      const isFull = sec.availableQuota <= 0;

                      return (
                        <div
                          key={sec.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-[#13262F] border-[#31C4D7]/50'
                              : 'bg-[#14151A] border-[#2D323E]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-white">
                              Sección {sec.sectionNumber} • {sec.professor}
                            </span>
                            <span
                              className={`text-[11px] font-bold font-mono ${
                                isFull ? 'text-red-400' : 'text-slate-300'
                              }`}
                            >
                              {sec.availableQuota}/{sec.totalQuota} cupos
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-0.5 mb-3">
                            {sec.schedule.map((s, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#31C4D7]" />
                                <span>
                                  <strong>{s.day}</strong> {s.startTime}-{s.endTime} ({s.room})
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Action Button */}
                          {isFull ? (
                            isWaitlisted ? (
                              <div className="w-full py-2 bg-amber-950/40 text-amber-300 border border-amber-700/50 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>En Lista de Espera (Turno #{isWaitlisted})</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => joinWaitlist(sub.code)}
                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Anotarse en Lista de Espera (Turno #4)</span>
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => selectSection(sub, sec)}
                              className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                                isSelected
                                  ? 'bg-[#31C4D7] text-[#14151A]'
                                  : 'bg-[#20232A] hover:bg-[#2c313c] text-white border border-[#2D323E]'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Sección Seleccionada</span>
                                </>
                              ) : (
                                <span>Seleccionar Sección {sec.sectionNumber}</span>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MOBILE TIMETABLE VIEW (DAY SELECTOR) */
          <div className="space-y-4">
            {/* Day Selector Pills */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                    selectedDay === day
                      ? 'bg-[#31C4D7] text-[#14151A] shadow-md'
                      : 'bg-[#20232A] text-slate-400 hover:text-white border border-[#2D323E]'
                  }`}
                >
                  {day.substring(0, 3).toUpperCase()}
                </button>
              ))}
            </div>

            {/* Blocks for selected day */}
            <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-4 divide-y divide-[#2D323E]">
              {TIME_BLOCKS.map((block) => {
                const match = enrolledCourses.find((item) =>
                  item.section.schedule.some(
                    (s) => s.day === selectedDay && s.blockIndex === block.index
                  )
                );
                const slot = match?.section.schedule.find(
                  (s) => s.day === selectedDay && s.blockIndex === block.index
                );

                return (
                  <div key={block.index} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono font-semibold">Bloque {block.index + 1}</span>
                      <span>{block.time}</span>
                    </div>

                    {match && slot ? (
                      <div
                        className="p-3 rounded-xl text-white shadow-sm"
                        style={{ backgroundColor: match.subject.color }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs">{match.subject.code}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/20 rounded">
                            Sec. {match.section.sectionNumber}
                          </span>
                        </div>
                        <p className="text-xs font-semibold mt-0.5">{match.subject.name}</p>
                        <div className="flex items-center justify-between text-[11px] text-white/90 mt-2 pt-1 border-t border-white/20">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {slot.room}
                          </span>
                          <span>{match.section.professor}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-slate-600 text-xs border border-dashed border-[#2D323E] rounded-xl">
                        Sin actividad programada
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar for Mobile Confirmation */}
      <div className="fixed bottom-16 left-0 right-0 bg-[#14151A]/95 backdrop-blur-md border-t border-[#2D323E] p-3 z-20 flex items-center justify-between gap-3 max-w-md mx-auto">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">
            Créditos:
          </span>
          <span className="text-sm font-extrabold text-[#31C4D7] font-mono">
            {totalCredits} / 30 SCT
          </span>
        </div>

        <button
          onClick={confirmEnrollment}
          disabled={enrolledCourses.length === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
            enrolledCourses.length > 0
              ? 'bg-[#31C4D7] text-[#14151A] hover:bg-[#28b2c4]'
              : 'bg-[#20232A] text-slate-500 cursor-not-allowed border border-[#2D323E]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confirmar Carga</span>
        </button>
      </div>
    </div>
  );
};
