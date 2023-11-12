import type { Request, Response } from "express";

export interface User {
  email?: string;
  id?: string;
}

export interface ScheduleModelSchema {
  id?: string;
  content: ScheduleSchema;
  authorId?: string;
  author?: User;
  name?: string;
}

export interface ScheduleSchema {
  aikataulu: {
    aiheet: string[];
    teoriat: string;
    tehtavananto: number;
    kesto: number;
  }[];
}

export interface ContextType {
  res: Response;
  req: Request;
}

export enum Periods {
  "WEEK" = "7 päivää",
  "TWOWEEKS" = "14 päivää",
  "FIVE" = "5 päivää",
}

export enum Intensities {
  "EASY" = "Helppo",
  "INTERMEDIATE" = "Keskitaso",
  "HARD" = "Korkea",
}

export enum CodeType {
  COURSE = "COURSE",
  SUBJECT = "SUBJECT",
}

export interface Subject {
  name: string;
  shorthand: string;
}

export interface PromptInput {
  subject: string;
  courses?: string[];
  timePeriod: string;
  intensity: Intensities;
  subjectType: CodeType;
}
