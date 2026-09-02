import type { TierModuleContent } from "../types";

/* SafeZone — Guardians Tier (Ages 11–13), Module 1.
   Content transcribed verbatim from guardians-age-11-13.pdf. */
export const GUARDIANS_MODULE_1: TierModuleContent = {
  id: "guardians-m1",
  number: 1,
  name: "Earthquake: Drop, Cover, Hold On",
  type: "interactive",
  estMinutes: 11,
  icon: "🌍",
  sections: [
    {
      id: "guardians-m1-s1",
      number: 1,
      title: "The Moment It Starts",
      estMinutes: 3,
      body: [
        "Picture this: you're at your desk. The floor shakes. Books slide off shelves. This is not a drill anymore — it's happening right now.",
        "Your very first move, no matter what floor you're on: Drop, Cover, and Hold On.",
        "Drop to your hands and knees before the shaking knocks you down.",
        "Cover your head and neck under a sturdy desk or table. If there's no cover, crouch next to an interior wall, away from windows.",
        "Hold On to the furniture you're under so it doesn't shift away from you.",
        "Do not run for the stairs while the building is still shaking. Most injuries happen from people falling or being hit by falling objects while trying to move.",
      ],
    },
    {
      id: "guardians-m1-s2",
      number: 2,
      title: "After the Shaking Stops",
      estMinutes: 3,
      body: [
        "The shaking has stopped. Before you move, check three things:",
        "1. Is anyone near you hurt?",
        "2. Is there smoke, a gas smell, or visible damage to the walls/ceiling?",
        "3. Has an adult, alarm, or official instruction told you to evacuate?",
        "If evacuation is called for, use the staircase your floor plan marks as safe — never the lift. Lifts can stop working or open onto a damaged floor.",
      ],
    },
    {
      id: "guardians-m1-s3",
      number: 3,
      title: "Floor-by-Floor Reality Check",
      estMinutes: 3,
      body: [
        "Your evacuation looks different depending on where you are:",
        "Ground floor: your exit is closest, but it might still be blocked by debris — don't assume it's automatically clear.",
        "Middle floors (1st–3rd): check the staircase for cracks or debris before stepping onto it. If it looks damaged, don't test it — use the other one.",
        "Top floors (4th–5th): expect more time and possible aftershocks. Move steadily, don't sprint, and stay together with your group.",
      ],
    },
    {
      id: "guardians-m1-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario:
          "You're on the 3rd floor. Shaking has stopped. The main staircase has a visible crack running through one step. The second staircase looks undamaged.",
        correct: {
          label: "Use the second, undamaged staircase — never \"test\" a stair that shows visible damage.",
          explanation:
            "A damaged structure doesn't announce when it will fail completely. If it looks wrong, treat it as unsafe.",
        },
        wrong: {
          label: "Step carefully over the crack because it's the closer stair.",
          explanation:
            "Visible damage means the stair's true condition is unknown — stepping on it is a gamble, not a shortcut.",
        },
        keyRule: "A damaged structure doesn't announce when it will fail completely. If it looks wrong, treat it as unsafe.",
      },
    },
  ],
};
