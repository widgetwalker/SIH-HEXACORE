import type { QuizLevel } from "../../types";

/* Wardens (Ages 18+) Quiz Arena. 4-option questions with a command and
   coordination angle, grounded in their modules' focus on leading others
   and handing off to responders. */
export const WARDENS_QUIZ_LEVELS: QuizLevel[] = [
  {
    level: 1,
    title: "Earthquake Command Decisions",
    questions: [
      {
        id: "wardens-q-l1-1",
        prompt: "Even as a warden, what applies to you first when shaking starts?",
        options: [
          { text: "Drop-Cover-Hold, just like everyone else", correct: true },
          { text: "Immediately begin organizing others", correct: false },
          { text: "Move to check the building's structural integrity", correct: false },
          { text: "Radio responders before taking cover", correct: false },
        ],
        explanation: "You can't lead an evacuation if you're injured in the first ten seconds — modeling Drop-Cover-Hold comes before organizing anyone else.",
      },
      {
        id: "wardens-q-l1-2",
        prompt: "Once shaking stops, what's your first responsibility as a warden?",
        options: [
          { text: "Rapid triage — injuries near you, structural damage, and route usability, all within about a minute", correct: true },
          { text: "Immediately calling a full staff meeting", correct: false },
          { text: "Waiting for responders to arrive before doing anything", correct: false },
          { text: "Personally inspecting every floor of the building", correct: false },
        ],
        explanation: "A fast, roughly one-minute triage of injuries, damage, and route usability is what makes the next decisions possible.",
      },
      {
        id: "wardens-q-l1-3",
        prompt: "What kind of instruction works best when directing an evacuation?",
        options: [
          { text: "Short and directive — \"This way, other stairs\"", correct: true },
          { text: "A full explanation of your reasoning", correct: false },
          { text: "A general suggestion, left open to interpretation", correct: false },
          { text: "No instruction — let people find their own way", correct: false },
        ],
        explanation: "Short, directive instructions move people faster than explanations — position yourself so you can see both the group and the route ahead.",
      },
      {
        id: "wardens-q-l1-4",
        prompt: "People are heading toward a stairwell with a cracked base out of habit. What's the correct response?",
        options: [
          { text: "Physically position yourself there and redirect them immediately", correct: true },
          { text: "Assume they'll notice the crack and self-correct", correct: false },
          { text: "Shout a warning once from a distance and move on", correct: false },
          { text: "Let a few people go first to test if it's safe", correct: false },
        ],
        explanation: "People moving out of habit under stress often don't register hazards they're not actively looking for — active physical intervention is needed, not a distant warning.",
      },
      {
        id: "wardens-q-l1-5",
        prompt: "If a route becomes unsafe mid-evacuation, what should you do?",
        options: [
          { text: "Redirect immediately and loudly, rather than waiting for people to notice", correct: true },
          { text: "Wait until the current group finishes using it", correct: false },
          { text: "Let people decide individually whether to keep using it", correct: false },
          { text: "Report it to responders only after the evacuation finishes", correct: false },
        ],
        explanation: "Waiting for people to notice a hazard themselves costs time you don't have — an active, loud redirect is the correct call.",
      },
    ],
  },
  {
    level: 2,
    title: "Fire: Coordinating a Multi-Group Evacuation",
    questions: [
      {
        id: "wardens-q-l2-1",
        prompt: "As a warden, when is attempting to control the fire yourself the right call?",
        options: [
          { text: "Only when it's small, you're trained, and there's no real doubt about safety", correct: true },
          { text: "Whenever you personally feel confident", correct: false },
          { text: "Any time no one else is available to help", correct: false },
          { text: "Never — evacuation is always the only option", correct: false },
        ],
        explanation: "If there's any doubt about the fire's source or your ability to control it safely, the call is always evacuate — not attempt heroics.",
      },
      {
        id: "wardens-q-l2-2",
        prompt: "In a non-ideal evacuation, who should generally move first?",
        options: [
          { text: "People on the fire floor and the floor above", correct: true },
          { text: "Whoever is closest to the main exit", correct: false },
          { text: "Everyone at exactly the same time, regardless of position", correct: false },
          { text: "The floor furthest from the fire, since they're safest", correct: false },
        ],
        explanation: "Prioritizing by hazard proximity — fire floor and the floor above first — is how a warden sequences a non-ideal evacuation.",
      },
      {
        id: "wardens-q-l2-3",
        prompt: "You learn a staircase you already sent 15 people toward now has smoke coming up. What's the priority?",
        options: [
          { text: "Relay a redirect immediately and verify the alternate route yourself before sending more people", correct: true },
          { text: "Assume the group will notice the smoke and reroute themselves", correct: false },
          { text: "Wait for the group to reach the smoke before acting", correct: false },
          { text: "Send a second group the same way to confirm the report", correct: false },
        ],
        explanation: "A group already committed to a route, under evacuation pressure, is unlikely to self-correct before reaching the hazard — an active redirect is required.",
      },
      {
        id: "wardens-q-l2-4",
        prompt: "If evacuation genuinely isn't possible for a group, what's your role?",
        options: [
          { text: "Get them into the safest available room, close the door, and communicate their exact location to responders", correct: true },
          { text: "Consider it a failure of your planning", correct: false },
          { text: "Force an evacuation attempt regardless of the risk", correct: false },
          { text: "Leave the decision entirely to the group", correct: false },
        ],
        explanation: "Sheltering a group you genuinely can't evacuate, with a clear location communicated to responders, is a legitimate command decision, not a failure.",
      },
      {
        id: "wardens-q-l2-5",
        prompt: "Why does a working lift not settle the question of whether to use it during a fire?",
        options: [
          { text: "The call always depends on doubt about safety, not just current operability", correct: true },
          { text: "Lifts should always be used if they're still running", correct: false },
          { text: "It's a rule only for students, not wardens", correct: false },
          { text: "Lifts are never allowed under any circumstance, even by responders", correct: false },
        ],
        explanation: "Even a currently-working lift carries the same core risk — power failure or opening onto a smoke-filled floor — so the same doubt-means-evacuate logic applies.",
      },
    ],
  },
  {
    level: 3,
    title: "Evacuation Planning & Hazard Mapping",
    questions: [
      {
        id: "wardens-q-l3-1",
        prompt: "What should every warden know about their assigned floor before any emergency?",
        options: [
          { text: "Both exit routes, the assembly point, the nearest shelter room, and typical headcount by time of day", correct: true },
          { text: "Just the location of the fire extinguisher", correct: false },
          { text: "Nothing specific — you improvise when needed", correct: false },
          { text: "Only the primary exit, since the secondary rarely matters", correct: false },
        ],
        explanation: "This groundwork is what makes fast decisions possible later — you can't plan a response in the moment you're also trying to execute it.",
      },
      {
        id: "wardens-q-l3-2",
        prompt: "As a warden, what's your added responsibility beyond just noticing hazard signals?",
        options: [
          { text: "Communicating them outward — to other wardens, responders, and the people you're directing", correct: true },
          { text: "Keeping hazard information to yourself until it's confirmed", correct: false },
          { text: "Only reporting hazards after the evacuation is fully complete", correct: false },
          { text: "Deciding privately whether a hazard is worth mentioning", correct: false },
        ],
        explanation: "The same hazard signals apply to everyone, but a warden's added job is passing that information outward so others can act on it too.",
      },
      {
        id: "wardens-q-l3-3",
        prompt: "Your headcount at the assembly point is short by two people. What's the correct response?",
        options: [
          { text: "Report the missing individuals and last-known location to responders immediately — don't re-enter yourself", correct: true },
          { text: "Go back inside to search for them personally", correct: false },
          { text: "Wait to see if they show up before telling anyone", correct: false },
          { text: "Ask other students to go back inside and look", correct: false },
        ],
        explanation: "Responders are equipped and trained for search under active hazard conditions; re-entering yourself risks turning one missing-person situation into two.",
      },
      {
        id: "wardens-q-l3-4",
        prompt: "Why does \"evacuation isn't complete until everyone is accounted for\" matter?",
        options: [
          { text: "Getting people outside isn't the same as confirming everyone made it out", correct: true },
          { text: "Headcounts are optional once people are visibly safe outside", correct: false },
          { text: "It's only relevant for very large buildings", correct: false },
          { text: "Accountability is a responder's job, not a warden's", correct: false },
        ],
        explanation: "A headcount or check-in system is what actually confirms evacuation is complete — being outside isn't the same as being accounted for.",
      },
      {
        id: "wardens-q-l3-5",
        prompt: "What should you do immediately if someone is flagged as missing after evacuation?",
        options: [
          { text: "Flag it to responders right away rather than waiting", correct: true },
          { text: "Wait a while in case they turn up on their own", correct: false },
          { text: "Only mention it if multiple people are missing", correct: false },
          { text: "Assume they left early and are already safe elsewhere", correct: false },
        ],
        explanation: "Immediately flagging a missing person gives responders the earliest possible window to act, rather than losing time waiting.",
      },
    ],
  },
  {
    level: 4,
    title: "Chemical Incidents & First-Aid-Adjacent Response",
    questions: [
      {
        id: "wardens-q-l4-1",
        prompt: "What is your role in a chemical incident, specifically?",
        options: [
          { text: "Containment and evacuation, not identification or cleanup unless specifically trained", correct: true },
          { text: "Personally identifying the chemical involved", correct: false },
          { text: "Cleaning up the spill so others aren't at risk", correct: false },
          { text: "Waiting for the situation to resolve itself", correct: false },
        ],
        explanation: "Containment and evacuation are your role — identification and cleanup are for trained, equipped specialists unless that's specifically your training.",
      },
      {
        id: "wardens-q-l4-2",
        prompt: "What details do responders need from you about a chemical incident?",
        options: [
          { text: "Approximate location, any visible labels, and number of people exposed", correct: true },
          { text: "Your personal theory about what the chemical is", correct: false },
          { text: "Just that \"something happened\" is usually enough", correct: false },
          { text: "Nothing — they'll assess it themselves on arrival", correct: false },
        ],
        explanation: "Specific, factual details — location, visible labels, exposure count — let responders act immediately on arrival.",
      },
      {
        id: "wardens-q-l4-3",
        prompt: "A person with direct chemical exposure refuses to go to the eyewash station, saying it's \"probably fine.\" What's the correct response?",
        options: [
          { text: "Insist calmly, escort them to the station, and call for medical responders regardless of their protest", correct: true },
          { text: "Respect their refusal and move on", correct: false },
          { text: "Wait to see if symptoms develop before acting", correct: false },
          { text: "Let them decide once they've calmed down", correct: false },
        ],
        explanation: "Chemical exposure symptoms can be delayed or invisible at first, so \"it's probably fine\" from the exposed person isn't a reliable safety signal.",
      },
      {
        id: "wardens-q-l4-4",
        prompt: "What are the boundaries of your role in first-aid-adjacent response?",
        options: [
          { text: "Keeping the person calm and others back, relaying accurate information — not diagnosing or treating beyond your training", correct: true },
          { text: "Diagnosing the injury yourself to save time", correct: false },
          { text: "Attempting any treatment that seems reasonable in the moment", correct: false },
          { text: "Leaving the situation entirely to whoever is nearest", correct: false },
        ],
        explanation: "Your value in the first minutes is keeping things orderly and relaying information — not substituting your own judgment for training-based protocol.",
      },
      {
        id: "wardens-q-l4-5",
        prompt: "Why should you not attempt treatment outside your certification, even if you're confident it would help?",
        options: [
          { text: "Your value is in coordination and accurate information, not improvised treatment", correct: true },
          { text: "Confidence alone is a reliable guide for what's medically safe", correct: false },
          { text: "It's fine as long as no one else is available", correct: false },
          { text: "Certification requirements don't really apply during emergencies", correct: false },
        ],
        explanation: "Keeping the process orderly and accurate for arriving responders is more valuable than an improvised treatment attempt outside your training.",
      },
    ],
  },
  {
    level: 5,
    title: "Multi-Hazard Command & Responder Handoff",
    questions: [
      {
        id: "wardens-q-l5-1",
        prompt: "An earthquake damages a staircase, and a gas leak is found nearby. What's the correct sequence?",
        options: [
          { text: "Protect yourself first, reassess before moving, identify secondary hazards, then act", correct: true },
          { text: "Treat \"get out\" as a single undifferentiated instinct, regardless of order", correct: false },
          { text: "Deal with the gas leak before considering your own safety", correct: false },
          { text: "Wait for responders before making any decision at all", correct: false },
        ],
        explanation: "Skipping this sequence for a single \"get out\" instinct is how people end up walking into a worse hazard than the one they started with.",
      },
      {
        id: "wardens-q-l5-2",
        prompt: "What does effective delegation to a Sentinel or fellow warden look like?",
        options: [
          { text: "\"You take the west stair group, report back at the north assembly point\"", correct: true },
          { text: "\"Help out over there\"", correct: false },
          { text: "Giving no instruction and letting them decide", correct: false },
          { text: "Doing every task yourself to avoid miscommunication", correct: false },
        ],
        explanation: "Clear, bounded instructions make good use of a leadership resource — vague delegation like \"help out over there\" wastes it.",
      },
      {
        id: "wardens-q-l5-3",
        prompt: "Responders have just arrived after a multi-hazard event you've been managing. What's your role now?",
        options: [
          { text: "Brief them concisely and transition to following their direction", correct: true },
          { text: "Continue running your own plan independently", correct: false },
          { text: "Step back entirely and let them re-discover the situation themselves", correct: false },
          { text: "Wait for them to ask before providing any information", correct: false },
        ],
        explanation: "A concise handoff — headcount, hazards found, anyone missing or injured — lets trained responders take command efficiently.",
      },
      {
        id: "wardens-q-l5-4",
        prompt: "Why is continuing to run your own evacuation plan after responders arrive a mistake?",
        options: [
          { text: "Two uncoordinated command chains on the same scene can work against each other", correct: true },
          { text: "Wardens should never have any authority once responders exist", correct: false },
          { text: "It's not actually a mistake — your plan is likely more accurate", correct: false },
          { text: "Responders always defer to whoever was managing the scene first", correct: false },
        ],
        explanation: "The handoff itself is the correct command decision once responders arrive — running a second plan in parallel creates conflict, not coordination.",
      },
      {
        id: "wardens-q-l5-5",
        prompt: "Floodwater is rising toward a ground-floor electrical panel while your group waits for evacuation transport. What's the correct call?",
        options: [
          { text: "Move the group away from the panel entirely and wait for trained personnel to isolate the power", correct: true },
          { text: "Try to shut off the panel yourself to prevent a bigger problem", correct: false },
          { text: "Ignore it since the water hasn't reached it yet", correct: false },
          { text: "Ask for a volunteer from the group to check on it", correct: false },
        ],
        explanation: "A live electrical panel near rising water is a firm no-approach rule — the safe response is distance, regardless of good intent.",
      },
    ],
  },
];
