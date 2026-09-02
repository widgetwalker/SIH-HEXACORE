import type { TierModuleContent } from "../types";

/* SafeZone — Sentinels Tier (Ages 14–17).
   Content transcribed verbatim from sentinels-age-14-17.pdf. */

export const SENTINELS_MODULE_1: TierModuleContent = {
  id: "sentinels-m1",
  number: 1,
  name: "Earthquake: Beyond Drop-Cover-Hold",
  type: "interactive",
  estMinutes: 12,
  icon: "🌍",
  sections: [
    {
      id: "sentinels-m1-s1",
      number: 1,
      title: "The Physics of Why You Don't Run",
      estMinutes: 3,
      body: [
        "During shaking, floors move unpredictably and objects fall without warning. Running increases your chance of being struck or falling down stairs that are themselves moving.",
        "Drop, Cover, Hold On isn't just a rule for younger kids — it's the response with the best statistical outcome for everyone, including you.",
      ],
    },
    {
      id: "sentinels-m1-s2",
      number: 2,
      title: "Aftershock Awareness",
      estMinutes: 3,
      body: [
        "Once the main shaking stops, don't treat the danger as over. Aftershocks can hit minutes or hours later, sometimes strong enough to bring down already-weakened structures. This changes your evacuation math: move with purpose, but don't linger in stairwells or near cracked walls once you're clear.",
      ],
    },
    {
      id: "sentinels-m1-s3",
      number: 3,
      title: "Your Role With Younger Students",
      estMinutes: 3,
      body: [
        "If you're near an 8–10 year old (Ranger tier) during this, your job is to give one short, clear instruction at a time — not a lecture. \"Damaged stairs, this way\" beats a long explanation. Panic spreads through tone as much as words; staying calm and brief is itself a safety action.",
      ],
    },
    {
      id: "sentinels-m1-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "You're on the 4th floor. Shaking has stopped. A younger student is frozen near a cracked stairwell wall, unsure what to do.",
        correct: {
          label: "Give a short direction (\"Not this way — follow me to the other stairs\"), and physically lead rather than just pointing from a distance.",
          explanation: "A frozen student needs direction plus action, not just information — leading them physically removes the decision paralysis.",
        },
        wrong: {
          label: "Assume they'll figure it out and continue on your own.",
          explanation: "Panic freeze doesn't resolve itself quickly — leaving them to \"figure it out\" can mean they stay frozen near the hazard.",
        },
      },
    },
  ],
};

export const SENTINELS_MODULE_2: TierModuleContent = {
  id: "sentinels-m2",
  number: 2,
  name: "Fire: Reading a Building Under Stress",
  type: "simulation",
  estMinutes: 12,
  icon: "🔥",
  sections: [
    {
      id: "sentinels-m2-s1",
      number: 1,
      title: "Why \"Which Fire\" Matters",
      estMinutes: 2,
      body: [
        "An electrical fire, a cooking-oil fire, and an unknown-source fire all demand different first reactions. Water is safe on ordinary combustibles but dangerous on live electrical equipment (shock risk) and on burning oil (violent splash and spread). If you don't know the source, treat it as unknown: alarm, evacuate, don't improvise.",
      ],
    },
    {
      id: "sentinels-m2-s2",
      number: 2,
      title: "Compound Fire Scenarios",
      estMinutes: 3,
      body: [
        "Fire + one staircase blocked: use the other designated stair. Don't go back to \"check\" the blocked one — that wastes time your group doesn't have.",
        "Fire + both staircases smoke-filled: shelter in the safest available room, close the door, signal from a window if possible, and call for help with your exact floor and room. This is a legitimate strategy, not a failure to evacuate.",
        "Fire + a working lift: the lift being operational doesn't make it safe. Power can fail mid-fire, or the lift can open directly onto a smoke-filled floor. Stairs stay the default.",
      ],
    },
    {
      id: "sentinels-m2-s3",
      number: 3,
      title: "Communicating Up and Down the Chain",
      estMinutes: 3,
      body: [
        "As a Sentinel, part of your role is passing accurate information: which stair is blocked, how many people are with you, and your exact location if sheltering. Vague reports (\"something's wrong on the 3rd floor\") slow down responders. Specific ones (\"Stair B blocked by smoke, 3rd floor, six students sheltering in Room 304\") speed up rescue.",
      ],
    },
    {
      id: "sentinels-m2-s4",
      number: 4,
      title: "When Someone Panics Near You",
      estMinutes: 2,
      body: [
        "Give instructions in short sentences. Don't argue or over-explain \"why\" mid-evacuation — that's a conversation for after you're safe. Physically guide if needed, keep exits clear, never push.",
      ],
    },
    {
      id: "sentinels-m2-s5",
      number: 5,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "You're evacuating with a group. One student insists on going back for a bag near the fire's origin.",
        correct: {
          label: "Firmly redirect them toward the exit — \"Leave it, we go now\" — and keep moving as a group.",
          explanation: "Firm, immediate redirection prevents the whole group from lingering near the hazard while one person deliberates.",
        },
        wrong: {
          label: "Let them go back \"just for a second\" while the rest of you wait near the hazard.",
          explanation: "Waiting near a fire's origin for \"just a second\" keeps the entire group in the danger zone longer than necessary.",
        },
      },
    },
  ],
};

export const SENTINELS_MODULE_3: TierModuleContent = {
  id: "sentinels-m3",
  number: 3,
  name: "Floor-by-Floor Hazard Mapping & Route Judgment",
  type: "interactive",
  estMinutes: 11,
  icon: "🗺️",
  sections: [
    {
      id: "sentinels-m3-s1",
      number: 1,
      title: "Building a Mental Map",
      estMinutes: 3,
      body: [
        "By this age, you should be able to sketch your floor's two exits, the assembly point, and one shelter-in-place room from memory. This isn't busywork — under stress, memory recall is faster than reading a posted map.",
      ],
    },
    {
      id: "sentinels-m3-s2",
      number: 2,
      title: "Judging a Route in Real Time",
      estMinutes: 3,
      body: [
        "A route is unsafe if it shows: active fire or smoke, standing or flowing water, visible structural damage, or a crowd that has stopped moving for more than a few seconds. Judgment calls happen fast — the standard is \"does this route currently show a hazard,\" not \"has anyone confirmed it's dangerous yet.\"",
      ],
    },
    {
      id: "sentinels-m3-s3",
      number: 3,
      title: "Choosing Between Two Imperfect Options",
      estMinutes: 3,
      body: [
        "Sometimes neither route looks perfect. Compare: which hazard is more immediately lethal (fire/smoke > water > crowding, generally), and which route gets you further from the hazard's source fastest. When truly uncertain, sheltering safely and signaling for help beats guessing wrong on a route.",
      ],
    },
    {
      id: "sentinels-m3-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "Staircase A has light haze but no visible flame. Staircase B is completely clear but adds two extra floors of walking.",
        correct: {
          label: "Take Staircase B. Any visible smoke means the air quality and visibility in A can worsen fast — the extra distance is worth it.",
          explanation: "Light haze now can become heavy smoke fast; the safe margin from taking B outweighs the extra walking time.",
        },
        wrong: {
          label: "Take A because it's faster and \"the smoke isn't that bad yet.\"",
          explanation: "\"Not that bad yet\" is exactly the judgment that fails once conditions change mid-route, with no way back.",
        },
      },
    },
  ],
};

export const SENTINELS_MODULE_4: TierModuleContent = {
  id: "sentinels-m4",
  number: 4,
  name: "Chemical & Lab Incident Response",
  type: "video-quiz",
  estMinutes: 11,
  icon: "🧪",
  sections: [
    {
      id: "sentinels-m4-s1",
      number: 1,
      title: "First Reaction to a Spill or Fumes",
      estMinutes: 3,
      body: [
        "Alert others immediately, isolate the area (don't let people wander through it), and evacuate per your lab's plan. Don't attempt to identify an unknown chemical by smell or by getting close.",
      ],
    },
    {
      id: "sentinels-m4-s2",
      number: 2,
      title: "Using Emergency Equipment Correctly",
      estMinutes: 3,
      body: [
        "Eyewash stations and emergency showers exist for direct exposure and should be used per your training — not as a general precaution \"just in case.\" Using them incorrectly can waste critical time in an actual exposure.",
      ],
    },
    {
      id: "sentinels-m4-s3",
      number: 3,
      title: "When Fumes Are in Your Escape Route",
      estMinutes: 3,
      body: [
        "Don't push through a fume-filled stairwell. Use an alternate route or shelter and report your location — the same logic as smoke, but chemical fumes can carry additional health risks beyond visibility loss.",
      ],
    },
    {
      id: "sentinels-m4-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "A classmate got a chemical splash on their hand during the spill event.",
        correct: {
          label: "Direct them to the eyewash/emergency shower per posted lab instructions and get a trained adult immediately.",
          explanation: "Direct skin exposure needs the protocol equipment right away — guessing or waiting risks worse injury.",
        },
        wrong: {
          label: "Try to guess a home remedy or ignore it because \"it's probably fine.\"",
          explanation: "Improvised remedies can interact badly with an unknown chemical, and \"probably fine\" isn't a safe assumption for skin exposure.",
        },
      },
    },
  ],
};

export const SENTINELS_MODULE_5: TierModuleContent = {
  id: "sentinels-m5",
  number: 5,
  name: "Cyclone & Flood: Judgment Over Panic",
  type: "interactive",
  estMinutes: 11,
  icon: "🌊",
  sections: [
    {
      id: "sentinels-m5-s1",
      number: 1,
      title: "Why \"Staying Put\" Is Often Correct",
      estMinutes: 3,
      body: [
        "For cyclones, the instinct to \"get somewhere else\" is often wrong — moving outside during dangerous winds is more dangerous than staying in a protected interior room. A lull in wind is not the all-clear; storm systems can have a calm eye before conditions return.",
      ],
    },
    {
      id: "sentinels-m5-s2",
      number: 2,
      title: "Flood Judgment",
      estMinutes: 3,
      body: [
        "Floodwater hides depth, current, and often live electrical hazards from submerged wiring. Even 15cm of fast-moving water can knock a person down. If evacuation requires crossing unknown water, the safer move is usually to go higher and wait, not to cross.",
      ],
    },
    {
      id: "sentinels-m5-s3",
      number: 3,
      title: "Communicating During Slow-Moving Disasters",
      estMinutes: 2,
      body: [
        "Unlike a fire, cyclones and floods often give you time. Use it: confirm who's with you, check on nearby younger students, and relay your floor/location to a staff member or responder rather than assuming someone already knows where you are.",
      ],
    },
    {
      id: "sentinels-m5-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "Wind has suddenly gone quiet during a cyclone warning. Some students want to go check the courtyard.",
        correct: {
          label: "Stay inside — a lull can be the eye of the storm, not the end of it. Wait for an official all-clear.",
          explanation: "A sudden calm during a cyclone is a known warning sign of an eye passing over, not a sign the storm has ended.",
        },
        wrong: {
          label: "Go outside briefly since \"it seems calm now.\"",
          explanation: "Conditions can return violently and without warning once the eye passes — \"briefly\" isn't a safe window to bet on.",
        },
      },
    },
  ],
};

export const SENTINELS_MODULE_6: TierModuleContent = {
  id: "sentinels-m6",
  number: 6,
  name: "Multi-Hazard Compound Drill & Leading Under Pressure",
  type: "simulation",
  estMinutes: 12,
  icon: "⚠️",
  sections: [
    {
      id: "sentinels-m6-s1",
      number: 1,
      title: "Compound Scenarios Are the Norm, Not the Exception",
      estMinutes: 2,
      body: [
        "Real disasters rarely stay in one category. This module trains you to keep re-evaluating as a situation evolves, rather than locking into your first plan.",
      ],
    },
    {
      id: "sentinels-m6-s2",
      number: 2,
      title: "Earthquake → Damaged Stair → Gas Smell",
      estMinutes: 4,
      body: [
        "Sequence matters: protect yourself during shaking first, THEN assess (don't move during aftershocks toward an unconfirmed route), THEN check for secondary hazards like gas before choosing a path. Skipping straight to \"just get out\" without this sequence is how people walk into a worse hazard than the one they left.",
      ],
    },
    {
      id: "sentinels-m6-s3",
      number: 3,
      title: "Coordinating a Group Decision",
      estMinutes: 3,
      body: [
        "When you're the most senior student present, others will look to you. State the hazard, state the action, and move: \"Stair B has smoke — we're using Stair A, follow me.\" Confidence in tone matters as much as being right — hesitation itself can cause a crowd to freeze.",
      ],
    },
    {
      id: "sentinels-m6-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "After an earthquake, your group reaches a stairwell with a gas smell and a partially cracked wall. Younger students are looking to you for direction.",
        correct: {
          label: "Redirect the group away from both hazards to the alternate stair, giving one clear instruction, and report the gas smell to a responder as soon as you're safe.",
          explanation: "Two independent hazards means the response should avoid both, not weigh which one is \"worse\" — redirect entirely and report once clear.",
        },
        wrong: {
          label: "Debate with the group about whether the smell is \"really gas\" while standing near it.",
          explanation: "Debating near a suspected gas leak wastes time in the exact spot you should be moving away from.",
        },
      },
    },
  ],
};
