import _ from "lodash";
import { describe, expect, test } from "vitest";
import lops2019 from "../../raw/lops2019";
import { CodeType, Intensities } from "../../shared/index";
import { generatePrompt } from "../../api/src/lib/openai/helpers";
import { requestSchedule } from "../../api/src/lib/openai/completions";

describe("prompt tests", async () => {
  test("given parameters should form the correct prompt for individual subjects", () => {
    const subject = _.sample(lops2019.raw).oppiaine;
    const subjectType = CodeType.SUBJECT;
    const topics = lops2019.raw
      .find((s) => s.oppiaine === subject)
      .kurssit.map((c) => c.nimi);

    const intensity = _.sample(Intensities) as Intensities;
    const timePeriod = `${_.random(1, 7, false)} päivää`;

    const correctPrompt = `Aiheet: ${topics.join(
      ", "
    )}. Aikataulun pituus: ${timePeriod.toLowerCase()}. Suhteellinen tehtävien määrä: ${intensity.toLowerCase()}.`;

    const prompt = generatePrompt({
      subject,
      timePeriod,
      courses: topics,
      intensity,
      subjectType,
    });

    expect(prompt).toBe(correctPrompt);
  });

  const subject = _.sample(_.sample(lops2019.raw).kurssit).nimi;
  const subjectType = CodeType.COURSE;
  const intensity = _.sample(Intensities) as Intensities;
  const timePeriod = `${_.random(1, 7, false)} päivää`;

  test("given parameters should form the correct prompt for courses", () => {
    const correctPrompt = `Aihe: ${subject.toLowerCase()}. Aikataulun pituus: ${timePeriod.toLowerCase()}. Suhteellinen tehtävien määrä: ${intensity.toLowerCase()}.`;

    const prompt = generatePrompt({
      subject,
      timePeriod,
      intensity,
      subjectType,
    });

    expect(prompt).toBe(correctPrompt);
  });

  test("a failed prompt retries", async () => {
    await expect(
      async () =>
        await requestSchedule({
          subject,
          timePeriod,
          intensity,
          subjectType,
        })
    ).rejects.toThrowError("Maximum Retries");
  });
});
