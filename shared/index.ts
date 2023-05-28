import { Request, Response } from "express";

export interface ScheduleSchema {
  aiheet: string;
  teoriat: string;
  tehtavat: number;
  kesto: number;
}

export interface ContextType {
  res: Response;
  req: Request;
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
