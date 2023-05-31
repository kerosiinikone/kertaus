"use client";

import AIWrapper from "@/components/AIWrapper";
import { Periods } from "../../../shared/index";

export interface Subject {
  name: string;
  shorthand: string;
}

const MOCKUP_LIST: Subject[] = [
  { name: "Pitkä Matematiikka", shorthand: "MAA" },
  { name: "Lyhyt Matematiikka", shorthand: "MAB" },
  { name: "Fysiikka", shorthand: "FY" },
  { name: "Kemia", shorthand: "KE" },
  { name: "Äidinkieli ja kirjallisuus", shorthand: "ÄI" },
  { name: "Omavalintainen aine", shorthand: "Muu" },
];

const REVISION_PERIOD: Periods[] = [
  Periods.FIVE,
  Periods.WEEK,
  Periods.TWOWEEKS,
  Periods.OTHER,
];

export default function AILandingPage() {
  const MOCKUP_SUBMIT = (input: any) => {};

  return (
    <div className="flex md:flex-col flex-row items-center">
      <AIWrapper
        submit={MOCKUP_SUBMIT}
        periods={REVISION_PERIOD}
        subjectList={MOCKUP_LIST}
      />
    </div>
  );
}
