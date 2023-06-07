import { contains } from "./traverse";

const BAD_INPUT = "Väärä aine tai kurssi";

export const getValidatedInput = (input: { subject: string }) => {
  const result = contains(input.subject.toLowerCase());
  if (!result) throw new Error(BAD_INPUT);
  return { success: true, result };
};
