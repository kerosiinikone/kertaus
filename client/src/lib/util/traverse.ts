import { CodeType } from "../../../../shared";
import lops2019 from "./lops2019";

const getCourseCodes = (): Array<string> => {
  let courseCodes: string[] = [];
  for (let i of lops2019) {
    const codes: string[] = i.kurssit?.map((course) =>
      course.koodi.toLowerCase()
    );
    courseCodes = courseCodes.concat(codes);
  }
  return courseCodes;
};

const getCourseNames = (): Array<string> => {
  let courseNames: string[] = [];
  for (let i of lops2019) {
    const codes: string[] = i.kurssit?.map((course) =>
      course.nimi.toLowerCase()
    );
    courseNames = courseNames.concat(codes);
  }
  return courseNames;
};

const getSubjects = (): Array<string> => {
  let subjects: string[] = [];
  for (let i of lops2019) {
    subjects.push(i.oppiaine.toLowerCase());
  }
  return subjects;
};

export const traverseCourses = (code: string) => {
  let result: string[] = [];
  for (let i of lops2019) {
    if (i.oppiaine.toLowerCase() === code.toLowerCase()) {
      result = i.kurssit.map((c) => c.nimi);
      break;
    }
  }
  return result;
};

const getCourseNameByCode = (code: string): string => {
  let courses: { koodi: string; nimi: string }[] = [];
  for (let i of lops2019) {
    const codes: { koodi: string; nimi: string }[] = i.kurssit;
    courses = courses.concat(codes);
  }
  let foundName = "";
  for (let i of courses) {
    if (i.koodi.toLowerCase() === code.toLowerCase()) {
      foundName = i.nimi;
      break;
    }
  }
  return foundName;
};

export type ContainsType = {
  subject?: string;
  contains: boolean;
  subjectType?: CodeType;
  courses?: string[];
};

export const contains = (code: string): ContainsType => {
  if (getSubjects().includes(code))
    return {
      contains: true,
      subjectType: CodeType.SUBJECT,
      courses: traverseCourses(code),
    };
  if (getCourseCodes().includes(code))
    return {
      subject: getCourseNameByCode(code),
      contains: true,
      subjectType: CodeType.COURSE,
      courses: [],
    };
  if (getCourseNames().includes(code))
    return { contains: true, subjectType: CodeType.COURSE, courses: [] };
  return { contains: false };
};

/* CACHE and REFACTOR */
