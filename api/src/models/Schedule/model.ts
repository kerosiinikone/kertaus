import { z } from "zod";
import { CodeType, User } from "../../../../shared/index.js";

type ScheduleRawOutput = {
  aikataulu: {
    aiheet: string[] | string;
    teoriat: string[] | string;
    tehtavananto: number | string;
    kesto: number | string;
  }[];
};

type ScheduleFlexibleSchema = {
  id?: string;
  content: ScheduleRawOutput;
  authorId?: string;
  author?: User;
  name?: string;
};

export const ScheduleZodSchema = z.object({
  content: z.object({
    aikataulu: z.array(
      z.object({
        aiheet: z.array(z.string()),
        teoriat: z.string(),
        tehtavananto: z.number(),
        kesto: z.number(),
      })
    ),
  }),
  authorId: z.string().length(24).nullable(),
  author: z
    .object({
      email: z.string(),
      id: z.string().length(24),
    })
    .nullable(),
  name: z.string().nullable(),
});

export default class ScheduleModel implements ScheduleFlexibleSchema {
  content: ScheduleRawOutput;
  authorId?: string;
  author?: User;
  name?: string;

  constructor({ content, authorId, author = null }: ScheduleFlexibleSchema) {
    this.content = content;
    this.authorId = authorId;
    this.author = author;
    this.name = null; // First

    this.parseContent();
    this.validate();
  }

  constructScheduleName(
    subject: string,
    subjectType: CodeType,
    name: string | undefined
  ) {
    this.name = name
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : subjectType === CodeType.COURSE
      ? subject.split(": ")[1]
      : subject;
  }

  private parseContent() {
    const { aikataulu } = this.content;

    try {
      const parsedContent = aikataulu.map(
        ({ tehtavananto, teoriat, kesto, aiheet }) => {
          return {
            aiheet: typeof aiheet == "string" ? aiheet.split(", ") : aiheet,
            teoriat: typeof teoriat != "string" ? teoriat.join(", ") : teoriat,
            tehtavananto:
              typeof tehtavananto == "string"
                ? parseFloat(tehtavananto)
                : tehtavananto,
            kesto: typeof kesto == "string" ? parseFloat(kesto) : kesto,
          };
        }
      );
      this.content.aikataulu = parsedContent;
    } catch (error) {
      console.log(this);
      throw new Error("Parsing Error, try again");
    }
  }

  private validate() {
    try {
      ScheduleZodSchema.parse(this);
    } catch (error) {
      throw new Error("Validation Failed"); // Better Errors
    }
  }
}
