import { Response } from "express";

export interface ScheduleSchema {
  aihe: string;
  teoria: string;
  tehtavat: number;
  kesto: number;
}

export interface ContextType {
  res: Response;
}

export enum Periods {
  "WEEK" = "1 viikko",
  "TWOWEEKS" = "2 viikkoa",
  "FIVE" = "5 päivää",
  "OTHER" = "Muu",
}

export enum Intensities {
  "EASY" = "Helppo",
  "INTERMEDIATE" = "Keskitaso",
  "HARD" = "Korkea",
}

export enum CodeType {
  COURSE,
  SUBJECT,
}

export interface Subject {
  name: string;
  shorthand: string;
}

export interface CourseType {
  name: string;
}

export interface PromptInput {
  subject: string;
  courses?: CourseType[];
  timePeriod: string;
  intensity: Intensities;
  subjectType: CodeType;
}
