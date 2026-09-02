import type { TierModuleContent } from "../types";

/* SafeZone — Wardens Tier (Ages 18+).
   Content transcribed verbatim from wardens-age-18-plus.pdf. */

export const WARDENS_MODULE_1: TierModuleContent = {
  id: "wardens-m1",
  number: 1,
  name: "Earthquake: Command Decisions Under Shaking",
  type: "interactive",
  estMinutes: 12,
  icon: "🌍",
  sections: [
    {
      id: "wardens-m1-s1",
      number: 1,
      title: "Your Own Safety Comes First, Still",
      estMinutes: 2,
      body: [
        "Even as a warden, Drop-Cover-Hold applies to you before anything else. You can't lead an evacuation if you're injured in the first ten seconds. Model the behavior — don't try to organize others while shaking is still happening.",
      ],
    },
    {
      id: "wardens-m1-s2",
      number: 2,
      title: "Post-Shaking Assessment",
      estMinutes: 3,
      body: [
        "Once shaking stops, your job shifts to rapid triage: check for injuries near you, scan for obvious structural damage (cracks, leaning fixtures, debris), and decide whether your floor's evacuation routes are usable — all within roughly the first minute.",
      ],
    },
    {
      id: "wardens-m1-s3",
      number: 3,
      title: "Directing an Evacuation",
      estMinutes: 4,
      body: [
        "Give short, directive instructions rather than explanations: \"This way, other stairs\" beats \"I think we should probably avoid that one because it looked cracked.\" Position yourself so you can see both the group and the route ahead. If a route becomes unsafe mid-evacuation, redirect immediately and loudly rather than waiting for people to notice themselves.",
      ],
    },
    {
      id: "wardens-m1-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "You're the floor warden. Shaking has stopped. One staircase shows cracking near the base; people are already starting to head toward it out of habit.",
        correct: {
          label: "Physically position yourself at that stairwell entrance and redirect people to the alternate route immediately — don't wait for someone to get hurt to prove the point.",
          explanation: "Habit-driven movement toward a known-damaged route needs an active physical intervention, not a verbal warning shouted from a distance.",
        },
        wrong: {
          label: "Assume people will notice the crack themselves and self-correct.",
          explanation: "People moving out of habit under stress often don't register hazards they're not actively looking for — assuming self-correction risks an injury you could have prevented.",
          hazardIcon: "🧱",
        },
      },
    },
  ],
};

export const WARDENS_MODULE_2: TierModuleContent = {
  id: "wardens-m2",
  number: 2,
  name: "Fire: Coordinating a Multi-Group Evacuation",
  type: "simulation",
  estMinutes: 12,
  icon: "🔥",
  sections: [
    {
      id: "wardens-m2-s1",
      number: 1,
      title: "Fire Classification Still Matters at This Level",
      estMinutes: 2,
      body: [
        "As a warden, you may be the one deciding whether a fire is small enough to address with a trained extinguisher response or whether it's an evacuate-now situation. Electrical and oil fires must never get water. If there's any doubt about the source or your ability to control it safely, the call is always evacuate and let responders handle it — not attempt heroics.",
      ],
    },
    {
      id: "wardens-m2-s2",
      number: 2,
      title: "Sequencing a Building-Level Evacuation",
      estMinutes: 3,
      body: [
        "Not everyone leaves at once in an ideal evacuation — but you're not always working with ideal conditions. Prioritize routes by hazard proximity: people on the fire floor and the floor above move first, others follow in order. Keep the flow moving; a warden's job includes preventing bottlenecks, not just pointing at exits.",
      ],
    },
    {
      id: "wardens-m2-s3",
      number: 3,
      title: "When a Staircase Fails Mid-Evacuation",
      estMinutes: 3,
      body: [
        "If you learn a staircase you've already sent people toward has become unsafe (smoke reported, structural failure), you need a way to redirect people already in motion — verbally, by relay through other wardens, or by physically blocking the entrance to that route. Waiting for people to reach the blocked point themselves costs time you don't have.",
      ],
    },
    {
      id: "wardens-m2-s4",
      number: 4,
      title: "Sheltering Groups You Can't Evacuate",
      estMinutes: 2,
      body: [
        "If evacuation genuinely isn't possible for a group, your role is: get them into the safest available room, close the door, communicate the exact location to responders, and keep the group calm while waiting. This is a legitimate command decision, not a failure.",
      ],
    },
    {
      id: "wardens-m2-s5",
      number: 5,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "You're coordinating an evacuation. A radio report says the staircase you already sent 15 people toward now has smoke coming up from below.",
        correct: {
          label: "Immediately relay a redirect (in person, by another warden, or by phone/radio) to that group, and personally verify the alternate route is clear before more people are sent.",
          explanation: "People already in motion toward a now-unsafe route need an active redirect - and verifying the alternate yourself prevents sending them into a second problem.",
        },
        wrong: {
          label: "Assume the group will notice the smoke themselves and figure out an alternate on their own.",
          explanation: "A group already committed to a route, moving under evacuation pressure, is unlikely to self-correct before reaching the hazard.",
        },
      },
    },
  ],
};

export const WARDENS_MODULE_3: TierModuleContent = {
  id: "wardens-m3",
  number: 3,
  name: "Evacuation Planning & Building Hazard Mapping",
  type: "interactive",
  estMinutes: 11,
  icon: "🗺️",
  sections: [
    {
      id: "wardens-m3-s1",
      number: 1,
      title: "What a Warden Should Know Before Any Emergency",
      estMinutes: 3,
      body: [
        "Every warden should be able to state, for their assigned floor: both exit routes, the assembly point, the nearest shelter-in-place room, and roughly how many people are typically present at different times of day. This groundwork is what makes fast decisions possible later.",
      ],
    },
    {
      id: "wardens-m3-s2",
      number: 2,
      title: "Reading Real-Time Hazard Signals",
      estMinutes: 3,
      body: [
        "The same signals apply as for other tiers (smoke, fire, standing water, structural damage, stalled crowds) — but your added responsibility is communicating these signals outward: to other wardens, to responders, and to the people you're directing.",
      ],
    },
    {
      id: "wardens-m3-s3",
      number: 3,
      title: "Accountability at the Assembly Point",
      estMinutes: 2,
      body: [
        "Evacuation isn't complete when people are outside — it's complete when everyone is accounted for. Wardens should have a way to check who made it out (headcount, roll call, or check-in system) and immediately flag anyone missing to responders rather than waiting.",
      ],
    },
    {
      id: "wardens-m3-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "Your floor has evacuated. At the assembly point, your headcount is short by two people.",
        correct: {
          label: "Immediately report the missing individuals and last-known location to emergency responders — do not re-enter the building yourself to search.",
          explanation: "Responders are equipped and trained for search under active hazard conditions; a warden re-entering adds a second person at risk instead of resolving the first.",
        },
        wrong: {
          label: "Go back inside to look for them personally.",
          explanation: "Re-entering a building you just evacuated risks turning one missing-person situation into two, without the equipment or authority to do it safely.",
          hazardIcon: "⚠️",
        },
      },
    },
  ],
};

export const WARDENS_MODULE_4: TierModuleContent = {
  id: "wardens-m4",
  number: 4,
  name: "Chemical Incidents & First-Aid-Adjacent Response",
  type: "video-quiz",
  estMinutes: 11,
  icon: "🧪",
  sections: [
    {
      id: "wardens-m4-s1",
      number: 1,
      title: "Containing Without Contacting",
      estMinutes: 3,
      body: [
        "Your role in a chemical incident is containment and evacuation, not identification or cleanup unless you are specifically trained and equipped for it. Isolate the area, keep people from walking through it, and get trained responders the details they need (approximate location, any visible labels, number of people exposed).",
      ],
    },
    {
      id: "wardens-m4-s2",
      number: 2,
      title: "Coordinating Emergency Equipment Use",
      estMinutes: 2,
      body: [
        "If someone has direct exposure, guide them to eyewash/emergency shower stations per the facility's protocol and get medical help immediately. As a warden, your job is to keep this process orderly, not to substitute your own judgment for training-based protocol.",
      ],
    },
    {
      id: "wardens-m4-s3",
      number: 3,
      title: "First-Aid-Awareness Boundaries",
      estMinutes: 3,
      body: [
        "You are not expected to diagnose or treat beyond your training. Your value in the first minutes is: keeping the person calm, keeping others from crowding, relaying accurate information to arriving responders, and not attempting treatments outside your certification.",
      ],
    },
    {
      id: "wardens-m4-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "A chemical spill has occurred and one person has visible skin contact but is refusing to go to the eyewash station because \"it's probably fine.\"",
        correct: {
          label: "Insist calmly, escort them to the station per protocol, and call for medical responders regardless of their protest — exposure risk isn't something to leave to guesswork.",
          explanation: "Chemical exposure symptoms can be delayed or invisible at first, so \"it's probably fine\" from the exposed person isn't a reliable safety signal.",
        },
        wrong: {
          label: "Respect their refusal and move on without escalating.",
          explanation: "Deferring to a refusal on direct chemical exposure can let a treatable injury go untreated during the window when treatment matters most.",
        },
      },
    },
  ],
};

export const WARDENS_MODULE_5: TierModuleContent = {
  id: "wardens-m5",
  number: 5,
  name: "Cyclone & Flood: Shelter Command",
  type: "interactive",
  estMinutes: 11,
  icon: "🌊",
  sections: [
    {
      id: "wardens-m5-s1",
      number: 1,
      title: "Deciding to Shelter vs. Relocate",
      estMinutes: 3,
      body: [
        "As a warden, you may need to decide whether your group stays in place (interior room, away from windows) or moves to a higher floor because of flood risk — often based on incomplete information. Default to the safer, more conservative option when uncertain, and update the decision as official information arrives.",
      ],
    },
    {
      id: "wardens-m5-s2",
      number: 2,
      title: "Managing a Group Through a Long-Duration Event",
      estMinutes: 3,
      body: [
        "Cyclones and floods often mean hours, not minutes, of waiting. Your responsibility expands to: conserving supplies, checking on vulnerable individuals, and maintaining calm communication rather than letting uncertainty turn into panic.",
      ],
    },
    {
      id: "wardens-m5-s3",
      number: 3,
      title: "Electrical and Water Hazard Judgment",
      estMinutes: 2,
      body: [
        "Never let anyone approach an electrical panel or outlet that floodwater has reached or may reach — this is a firm rule, not a judgment call to relax under pressure. Isolate the area and wait for trained personnel.",
      ],
    },
    {
      id: "wardens-m5-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "Floodwater is rising toward a ground-floor electrical panel while your group waits for evacuation transport.",
        correct: {
          label: "Move the group away from the panel's area entirely and keep everyone clear until trained personnel isolate the power.",
          explanation: "A live electrical panel near rising water is a firm no-approach rule - the safe response is distance, not intervention.",
        },
        wrong: {
          label: "Try to shut off the panel yourself to \"prevent a bigger problem.\"",
          explanation: "Approaching a panel near floodwater risks electrocution - the exact outcome the firm rule exists to prevent, regardless of good intent.",
          hazardIcon: "⚡",
        },
      },
    },
  ],
};

export const WARDENS_MODULE_6: TierModuleContent = {
  id: "wardens-m6",
  number: 6,
  name: "Multi-Hazard Compound Command & Responder Handoff",
  type: "simulation",
  estMinutes: 12,
  icon: "⚠️",
  sections: [
    {
      id: "wardens-m6-s1",
      number: 1,
      title: "Why This Is the Capstone Module",
      estMinutes: 2,
      body: [
        "Everything in this tier converges here: personal safety, group direction, hazard judgment, and accountability — all while conditions can change mid-response.",
      ],
    },
    {
      id: "wardens-m6-s2",
      number: 2,
      title: "Sequencing Multiple Hazards",
      estMinutes: 3,
      body: [
        "Example: an earthquake damages a staircase, which is then found to have a gas leak nearby. The correct sequence is always: protect yourself first, reassess before moving, identify secondary hazards before choosing a route, then act — not \"get out\" as a single undifferentiated instinct.",
      ],
    },
    {
      id: "wardens-m6-s3",
      number: 3,
      title: "Delegating to Other Wardens/Sentinels",
      estMinutes: 3,
      body: [
        "You won't be everywhere. Part of command is trusting trained Sentinels (14–17 tier) or fellow wardens with clear, bounded instructions: \"You take the west stair group, report back at the north assembly point.\" Vague delegation (\"help out over there\") wastes the leadership resource you have.",
      ],
    },
    {
      id: "wardens-m6-s4",
      number: 4,
      title: "Handing Off to Professional Responders",
      estMinutes: 2,
      body: [
        "When responders arrive, your job shifts to information transfer, not continued command: give them your headcount status, known hazards, and any missing/injured persons — then follow their direction rather than continuing to run your own plan in parallel.",
      ],
    },
    {
      id: "wardens-m6-s5",
      number: 5,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "Responders have just arrived on scene after a multi-hazard event (earthquake + gas smell + partial structural damage) that you've been managing for ten minutes.",
        correct: {
          label: "Brief them concisely (headcount, hazards found, anyone missing/injured) and transition to following their direction.",
          explanation: "A concise handoff lets trained responders take command efficiently with the exact information they need to act on immediately.",
        },
        wrong: {
          label: "Continue running your own evacuation plan independently of what responders are now coordinating.",
          explanation: "Two uncoordinated command chains on the same scene can work against each other - the handoff itself is the correct command decision once responders arrive.",
        },
      },
    },
  ],
};
