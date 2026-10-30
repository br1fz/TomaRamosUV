export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

export interface ScheduleSlot {
  day: DayOfWeek;
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "10:00"
  blockIndex: number; // 0: 08:30-10:00, 1: 10:15-11:45, 2: 12:00-13:30, 3: 14:00-15:30, 4: 15:45-17:15, 5: 17:30-19:00
  room: string;
}

export interface CourseSection {
  id: string; // e.g. "CIN311-1"
  sectionNumber: number; // 1, 2
  professor: string;
  schedule: ScheduleSlot[];
  totalQuota: number;
  availableQuota: number;
  isFull: boolean;
  waitlistCount?: number;
}

export interface Subject {
  code: string; // "CIN 311"
  name: string; // "Estructuras de Datos"
  credits: number; // 5
  semester: number; // 5
  prerequisites: string[]; // ["CIN 211"]
  prereqStatus: 'APPROVED' | 'PENDING';
  sections: CourseSection[];
  color: string; // Hex color for timetable badges
  textColor: string;
  badgeBg: string;
}

export interface Student {
  name: string;
  rut: string;
  email: string;
  career: string;
  careerCode: string;
  campus: string;
  curriculumPlan: string;
  semester: number;
  avatarUrl: string;
  academicStatus: 'REGULAR ACTIVO' | 'SUSPENDIDO';
  priorityGroup: string;
}

export type QueueStatus = 'NOT_STARTED' | 'WAITING' | 'ADMITTED' | 'EXPIRED' | 'COMPLETED';

export interface QueueMetrics {
  status: QueueStatus;
  position: number;
  aheadCount: number;
  estimatedWaitSeconds: number;
  initialWaitSeconds: number;
  progressPercentage: number;
  soundAlertEnabled: boolean;
  token: string;
  admittedAt?: number;
  transactionSecondsRemaining: number; // 10:00 countdown (600 seconds)
}

export interface ScheduleConflict {
  hasConflict: boolean;
  attemptedSubject: Subject;
  attemptedSection: CourseSection;
  conflictingSubject: Subject;
  conflictingSection: CourseSection;
  day: DayOfWeek;
  timeSlot: string;
  message: string;
}

export interface EnrolledCourseItem {
  subject: Subject;
  section: CourseSection;
}

export interface OfficialVoucher {
  id: string;
  verificationCode: string;
  student: Student;
  enrolledCourses: EnrolledCourseItem[];
  totalCredits: number;
  timestamp: string;
  hashSHA256: string;
}

export type AppViewMode = 'DESKTOP' | 'MOBILE' | 'FREE';
export type AppStep = 'HOME' | 'LOGIN' | 'QUEUE' | 'ENROLLMENT' | 'SCHEDULE_VIEW' | 'VOUCHER';
