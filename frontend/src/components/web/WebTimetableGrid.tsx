import React from 'react';
import { Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';
import { TIME_BLOCKS, DAYS_OF_WEEK } from '../../data/subjects';
import type { DayOfWeek } from '../../types';

export const WebTimetableGrid: React.FC = () => {
  const { enrolledCourses, activeConflict } = useQueue();

  // Find enrolled course section in a specific day and blockIndex
  const getEnrollmentAt = (day: DayOfWeek, blockIndex: number) => {
    for (const item of enrolledCourses) {
      const slot = item.section.schedule.find(
        (s) => s.day === day && s.blockIndex === blockIndex
      );
      if (slot) {
        return { item, slot };
      }
    }
    return null;
  };

  // Check if this cell is part of an active collision attempt
  const isConflictCell = (day: DayOfWeek, blockIndex: number) => {
    if (!activeConflict) return false;
    return (
      activeConflict.day === day &&
      activeConflict.attemptedSection.schedule.some((s) => s.blockIndex === blockIndex)
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-[#004A77]" />
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Horario Semanal Interactivo (08:30 a 19:00 hrs)
            </h3>
            <p className="text-xs text-slate-500">
              Visualización en tiempo real de bloques curriculares seleccionados
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            Asignatura Inscrita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            Tope de Horario
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
            Bloque Libre
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px] text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-2.5 px-3 text-slate-500 font-bold text-left w-32 border-r border-slate-200">
                Bloque / Hora
              </th>
              {DAYS_OF_WEEK.map((day) => (
                <th key={day} className="py-2.5 px-3 text-slate-800 font-bold text-center border-r border-slate-200 last:border-r-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {TIME_BLOCKS.map((block) => (
              <tr key={block.index} className="hover:bg-slate-50/50 transition-colors">
                {/* Time Column */}
                <td className="py-3 px-3 bg-slate-50/80 font-mono font-semibold text-slate-600 border-r border-slate-200 text-center whitespace-nowrap">
                  <div className="text-[11px] font-bold text-slate-800">Bloque {block.index + 1}</div>
                  <div className="text-[10px] text-slate-500">{block.time}</div>
                </td>

                {/* Day Columns */}
                {DAYS_OF_WEEK.map((day) => {
                  const match = getEnrollmentAt(day, block.index);
                  const conflict = isConflictCell(day, block.index);

                  return (
                    <td
                      key={day}
                      className={`p-1.5 border-r border-slate-200 last:border-r-0 align-top h-20 transition-all ${
                        conflict
                          ? 'bg-red-50/90 ring-2 ring-red-500 animate-pulse'
                          : match
                          ? 'bg-slate-50/30'
                          : 'bg-white'
                      }`}
                    >
                      {conflict && (
                        <div className="h-full p-2 rounded-xl bg-red-100 border border-red-300 text-red-900 flex flex-col justify-center items-center text-center shadow-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600 mb-0.5 animate-bounce" />
                          <span className="font-bold text-[11px]">¡Conflicto!</span>
                          <span className="text-[10px] text-red-700">Tope de bloque</span>
                        </div>
                      )}

                      {!conflict && match && (
                        <div
                          className="h-full p-2 rounded-xl text-white shadow-sm flex flex-col justify-between transition-transform hover:scale-[1.02]"
                          style={{ backgroundColor: match.item.subject.color }}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-black text-[11px] tracking-wide">
                                {match.item.subject.code}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-white/25 rounded">
                                Sec. {match.item.section.sectionNumber}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium leading-tight truncate mt-0.5">
                              {match.item.subject.name}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-white/90 pt-1 border-t border-white/20 mt-1">
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                              {match.slot.room}
                            </span>
                            <span className="truncate max-w-[80px]" title={match.item.section.professor}>
                              {match.item.section.professor.replace('Prof. ', '')}
                            </span>
                          </div>
                        </div>
                      )}

                      {!conflict && !match && (
                        <div className="h-full rounded-lg border border-dashed border-slate-200/80 flex items-center justify-center text-[10px] text-slate-300 select-none">
                          Libre
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
