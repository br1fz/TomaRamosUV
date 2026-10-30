import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  Student,
  Subject,
  CourseSection,
  EnrolledCourseItem,
  QueueMetrics,
  ScheduleConflict,
  OfficialVoucher,
  AppViewMode,
  AppStep,
} from '../types';
import { INITIAL_STUDENT, INITIAL_SUBJECTS } from '../data/subjects';
import { checkScheduleConflict } from '../utils/conflictDetector';
import { playTurnArrivedCelebrationSound, playConflictAlert, playSuccessChime } from '../utils/audio';
import { sessionChannel } from '../utils/broadcast';

interface QueueContextType {
  student: Student;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  step: AppStep;
  setStep: (step: AppStep) => void;
  queueMetrics: QueueMetrics;
  subjects: Subject[];
  enrolledCourses: EnrolledCourseItem[];
  totalCredits: number;
  activeConflict: ScheduleConflict | null;
  clearConflict: () => void;
  sessionTransferred: boolean;
  clearSessionTransferred: () => void;
  waitlistedSubjects: Record<string, number>;
  voucher: OfficialVoucher | null;
  isEnrollmentCompleted: boolean;
  showTurnCelebration: boolean;
  dismissTurnCelebration: () => void;
  // Controls
  login: (email: string, rut: string) => void;
  logout: () => void;
  setSoundAlert: (enabled: boolean) => void;
  testAudioAlert: () => void;
  selectSection: (subject: Subject, section: CourseSection) => boolean;
  removeSubject: (subjectCode: string) => void;
  joinWaitlist: (subjectCode: string) => void;
  confirmEnrollment: () => boolean;
  advanceQueueInstant: () => void;
  simulateConcurrencyClash: () => void;
  resetSimulation: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const INITIAL_QUEUE_METRICS: QueueMetrics = {
  status: 'NOT_STARTED',
  position: 18,
  aheadCount: 17,
  estimatedWaitSeconds: 72, // ~15 students/minute = 4s/student -> 18 * 4 = 72s
  initialWaitSeconds: 72,
  progressPercentage: 15,
  soundAlertEnabled: true,
  token: 'tok_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  transactionSecondsRemaining: 600, // 10:00 minutes
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student] = useState<Student>(INITIAL_STUDENT);
  const [viewMode, setViewMode] = useState<AppViewMode>('DESKTOP');
  const [step, setStep] = useState<AppStep>('HOME');
  const [queueMetrics, setQueueMetrics] = useState<QueueMetrics>(INITIAL_QUEUE_METRICS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseItem[]>([]);
  const [activeConflict, setActiveConflict] = useState<ScheduleConflict | null>(null);
  const [sessionTransferred, setSessionTransferred] = useState<boolean>(false);
  const [waitlistedSubjects, setWaitlistedSubjects] = useState<Record<string, number>>({});
  const [voucher, setVoucher] = useState<OfficialVoucher | null>(null);
  const [isEnrollmentCompleted, setIsEnrollmentCompleted] = useState<boolean>(false);
  const [showTurnCelebration, setShowTurnCelebration] = useState<boolean>(false);

  // Queue speed multiplier ref
  const speedRef = useRef<number>(1);
  const isAdmittedRef = useRef<boolean>(false);

  // Calculate total credits
  const totalCredits = enrolledCourses.reduce((acc, curr) => acc + curr.subject.credits, 0);

  // Listen to cross-tab single session lock
  useEffect(() => {
    const unsubscribe = sessionChannel.subscribe((event) => {
      if (event.type === 'SESSION_TRANSFERRED' && event.rut === student.rut) {
        setSessionTransferred(true);
      }
    });
    return unsubscribe;
  }, [student.rut]);

  // Queue progression timer
  useEffect(() => {
    if (step !== 'QUEUE' || queueMetrics.status !== 'WAITING') return;

    const interval = setInterval(() => {
      setQueueMetrics((prev) => {
        if (prev.position <= 1) {
          clearInterval(interval);
          isAdmittedRef.current = true;

          // Sound alert if enabled: friendly celebration chime
          if (prev.soundAlertEnabled) {
            playTurnArrivedCelebrationSound();
          }

          // Trigger "Uy! Al fin me toca!" modal
          setShowTurnCelebration(true);
          setStep('ENROLLMENT');

          return {
            ...prev,
            position: 0,
            aheadCount: 0,
            estimatedWaitSeconds: 0,
            progressPercentage: 100,
            status: 'ADMITTED',
            admittedAt: Date.now(),
            transactionSecondsRemaining: 600,
          };
        }

        const newPos = prev.position - 1;
        const newAhead = Math.max(0, newPos - 1);
        const estSec = newPos * 4;
        const prog = Math.min(98, Math.round(((18 - newPos) / 18) * 100));

        return {
          ...prev,
          position: newPos,
          aheadCount: newAhead,
          estimatedWaitSeconds: estSec,
          progressPercentage: prog,
        };
      });
    }, 2000 / speedRef.current);

    return () => clearInterval(interval);
  }, [step, queueMetrics.status]);

  // Protected 10:00 minutes transactional countdown
  useEffect(() => {
    if (step !== 'ENROLLMENT' || queueMetrics.status !== 'ADMITTED') return;

    const timer = setInterval(() => {
      setQueueMetrics((prev) => {
        if (prev.transactionSecondsRemaining <= 1) {
          clearInterval(timer);
          return {
            ...prev,
            transactionSecondsRemaining: 0,
            status: 'EXPIRED',
          };
        }
        return {
          ...prev,
          transactionSecondsRemaining: prev.transactionSecondsRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, queueMetrics.status]);

  const login = (_email: string, rut: string) => {
    // Notify other tabs that this student logged in
    sessionChannel.notifyNewLogin(rut);
    setQueueMetrics({
      ...INITIAL_QUEUE_METRICS,
      token: 'tok_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'WAITING',
    });
    setStep('QUEUE');
  };

  const logout = () => {
    setStep('HOME');
    setEnrolledCourses([]);
    setVoucher(null);
    setIsEnrollmentCompleted(false);
    setShowTurnCelebration(false);
    setQueueMetrics(INITIAL_QUEUE_METRICS);
    setSessionTransferred(false);
  };

  const setSoundAlert = (enabled: boolean) => {
    setQueueMetrics((prev) => ({ ...prev, soundAlertEnabled: enabled }));
  };

  const testAudioAlert = () => {
    playTurnArrivedCelebrationSound();
  };

  const dismissTurnCelebration = () => {
    setShowTurnCelebration(false);
  };

  const selectSection = (subject: Subject, section: CourseSection): boolean => {
    // 1. Quota check
    if (section.availableQuota <= 0) {
      return false;
    }

    // 2. Schedule conflict check
    const conflict = checkScheduleConflict(subject, section, enrolledCourses);
    if (conflict) {
      setActiveConflict(conflict);
      playConflictAlert();
      return false;
    }

    // 3. Credit limit check (max 30 credits standard)
    const existingSame = enrolledCourses.find((e) => e.subject.code === subject.code);
    const existingCredits = existingSame ? existingSame.subject.credits : 0;
    const prospectiveCredits = totalCredits - existingCredits + subject.credits;

    if (prospectiveCredits > 30) {
      alert('Ha superado el límite curricular semestral de 30 créditos.');
      return false;
    }

    // 4. Update enrollments (replace if same subject was selected with another section)
    const filtered = enrolledCourses.filter((item) => item.subject.code !== subject.code);
    setEnrolledCourses([...filtered, { subject, section }]);
    setActiveConflict(null);
    return true;
  };

  const removeSubject = (subjectCode: string) => {
    setEnrolledCourses((prev) => prev.filter((item) => item.subject.code !== subjectCode));
  };

  const joinWaitlist = (subjectCode: string) => {
    setWaitlistedSubjects((prev) => ({
      ...prev,
      [subjectCode]: 4, // Student takes Turno #4 as requested
    }));
  };

  const confirmEnrollment = (): boolean => {
    if (enrolledCourses.length === 0) {
      alert('Debe inscribir al menos una asignatura antes de confirmar.');
      return false;
    }

    // Atomic quota decrement simulation
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        const enrolledSec = enrolledCourses.find((e) => e.subject.code === sub.code);
        if (!enrolledSec) return sub;

        return {
          ...sub,
          sections: sub.sections.map((sec) => {
            if (sec.id === enrolledSec.section.id) {
              return {
                ...sec,
                availableQuota: Math.max(0, sec.availableQuota - 1),
              };
            }
            return sec;
          }),
        };
      })
    );

    // Generate Official Voucher
    const verificationCode = `UV-2026-ICI-5125-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const hash = 'SHA256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newVoucher: OfficialVoucher = {
      id: `VOUCHER-${Date.now()}`,
      verificationCode,
      student,
      enrolledCourses,
      totalCredits,
      timestamp: new Date().toLocaleString('es-CL', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }),
      hashSHA256: hash,
    };

    setVoucher(newVoucher);
    setIsEnrollmentCompleted(true);
    setStep('SCHEDULE_VIEW');
    playSuccessChime();
    return true;
  };

  const advanceQueueInstant = () => {
    setQueueMetrics((prev) => ({
      ...prev,
      position: 1,
      aheadCount: 0,
      estimatedWaitSeconds: 2,
    }));
  };

  const simulateConcurrencyClash = () => {
    sessionChannel.notifyNewLogin(student.rut);
    setSessionTransferred(true);
  };

  const clearConflict = () => {
    setActiveConflict(null);
  };

  const clearSessionTransferred = () => {
    setSessionTransferred(false);
  };

  const resetSimulation = () => {
    setSubjects(INITIAL_SUBJECTS);
    setEnrolledCourses([]);
    setActiveConflict(null);
    setSessionTransferred(false);
    setWaitlistedSubjects({});
    setVoucher(null);
    setIsEnrollmentCompleted(false);
    setShowTurnCelebration(false);
    setQueueMetrics(INITIAL_QUEUE_METRICS);
    setStep('HOME');
  };

  return (
    <QueueContext.Provider
      value={{
        student,
        viewMode,
        setViewMode,
        step,
        setStep,
        queueMetrics,
        subjects,
        enrolledCourses,
        totalCredits,
        activeConflict,
        clearConflict,
        sessionTransferred,
        clearSessionTransferred,
        waitlistedSubjects,
        voucher,
        isEnrollmentCompleted,
        showTurnCelebration,
        dismissTurnCelebration,
        login,
        logout,
        setSoundAlert,
        testAudioAlert,
        selectSection,
        removeSubject,
        joinWaitlist,
        confirmEnrollment,
        advanceQueueInstant,
        simulateConcurrencyClash,
        resetSimulation,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
