import type { Subject, CourseSection, EnrolledCourseItem, ScheduleConflict } from '../types';

export function checkScheduleConflict(
  candidateSubject: Subject,
  candidateSection: CourseSection,
  currentEnrollments: EnrolledCourseItem[]
): ScheduleConflict | null {
  // Filter out any other section of the same subject (since selecting section 2 replaces section 1)
  const otherEnrollments = currentEnrollments.filter(
    (item) => item.subject.code !== candidateSubject.code
  );

  for (const candidateSlot of candidateSection.schedule) {
    for (const enrolled of otherEnrollments) {
      for (const enrolledSlot of enrolled.section.schedule) {
        if (
          candidateSlot.day === enrolledSlot.day &&
          candidateSlot.blockIndex === enrolledSlot.blockIndex
        ) {
          return {
            hasConflict: true,
            attemptedSubject: candidateSubject,
            attemptedSection: candidateSection,
            conflictingSubject: enrolled.subject,
            conflictingSection: enrolled.section,
            day: candidateSlot.day,
            timeSlot: `${candidateSlot.startTime} - ${candidateSlot.endTime}`,
            message: `Conflicto de Horario: ${candidateSubject.code} (${candidateSubject.name}) Sección ${candidateSection.sectionNumber} colisiona el día ${candidateSlot.day} (${candidateSlot.startTime}-${candidateSlot.endTime} hrs) con ${enrolled.subject.code} (${enrolled.subject.name}) Sección ${enrolled.section.sectionNumber}.`,
          };
        }
      }
    }
  }

  return null;
}
