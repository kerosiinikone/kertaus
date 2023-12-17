import { CodeType } from "../../../../shared";
import lops2019 from "../../../../data/lops2019";

interface CodesWithCourse {
  subject?: string;
  course?: {
    koodi: string;
    nimi: string;
  };
}

export type ContainsType = {
  subject?: string;
  contains: boolean;
  subjectType?: CodeType;
  courses?: string[];
};

export const traverseCourses = (code: string) => {
  for (let i of lops2019.raw) {
    if (i.oppiaine.toLowerCase() === code.toLowerCase()) {
      return i.kurssit.map((c) => c.nimi);
    }
  }
  return [];
};

const getCourseNameByCode = (code: string): CodesWithCourse => {
  let courses: CodesWithCourse[] = [];
  for (let i of lops2019.raw) {
    const ICourses: { koodi: string; nimi: string }[] = i.kurssit;
    const codesWithCourseId = ICourses.map((course) => {
      return {
        subject: i.oppiaine,
        course,
      };
    });
    courses = courses.concat(codesWithCourseId);
  }
  let foundItem: CodesWithCourse = {};
  for (let i of courses) {
    if (
      i.course?.koodi.toLowerCase() === code.toLowerCase() ||
      i.course?.nimi.toLowerCase() === code.toLowerCase()
    ) {
      foundItem = i;
      break;
    }
  }
  return foundItem;
};

export const getDetails = (code: string): ContainsType => {
  let returnObject: ContainsType = { contains: false };
  const foundItem = getCourseNameByCode(code);

  if (lops2019.subjects.includes(code))
    returnObject = {
      contains: true,
      subjectType: CodeType.SUBJECT,
      courses: traverseCourses(code),
    };
  if (lops2019.codes.includes(code)) {
    returnObject = {
      subject: `${foundItem.subject}: ${foundItem.course?.nimi}`,
      contains: true,
      subjectType: CodeType.COURSE,
      courses: [],
    };
  }
  if (lops2019.courseNames.includes(code)) {
    returnObject = {
      subject: `${foundItem.subject}: ${foundItem.course?.nimi}`,
      contains: true,
      subjectType: CodeType.COURSE,
      courses: [],
    };
  }
  return returnObject;
};
