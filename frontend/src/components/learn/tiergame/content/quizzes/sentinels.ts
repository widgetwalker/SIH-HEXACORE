import type { QuizLevel } from "../../types";

/* Sentinels (Ages 14-17) Quiz Arena. 4-option questions with a leadership/
   judgment angle, grounded in their modules' emphasis on reasoning and
   helping others, not just following a rule. */
export const SENTINELS_QUIZ_LEVELS: QuizLevel[] = [
  {
    level: 1,
    title: "Earthquake Beyond Basics",
    questions: [
      {
        id: "sentinels-q-l1-1",
        prompt: "Why is Drop, Cover, Hold On still the best response for someone your age, not just younger kids?",
        options: [
          { text: "It has the best statistical outcome for everyone, regardless of age", correct: true },
          { text: "It's only a rule for younger students", correct: false },
          { text: "Older students should try to secure the room instead", correct: false },
          { text: "It doesn't really matter once you're older", correct: false },
        ],
        explanation: "Drop, Cover, Hold On isn't age-specific — it's simply the response most likely to keep anyone safest during shaking.",
      },
      {
        id: "sentinels-q-l1-2",
        prompt: "The main shaking has stopped. Why shouldn't you treat the danger as over?",
        options: [
          { text: "Aftershocks can hit later and bring down already-weakened structures", correct: true },
          { text: "The danger is always fully over once shaking stops", correct: false },
          { text: "Aftershocks only happen in movies, not real earthquakes", correct: false },
          { text: "You should immediately relax and stop paying attention", correct: false },
        ],
        explanation: "Aftershocks can strike minutes or hours later, sometimes strong enough to collapse structures already weakened by the first quake.",
      },
      {
        id: "sentinels-q-l1-3",
        prompt: "How should your evacuation pace change once you're clear of the building?",
        options: [
          { text: "Don't linger in stairwells or near cracked walls, even after the main shaking stops", correct: true },
          { text: "You can relax completely the moment you're outside the classroom", correct: false },
          { text: "Pace doesn't matter once shaking has stopped", correct: false },
          { text: "You should go back to check on the building's condition", correct: false },
        ],
        explanation: "Aftershock risk means moving with purpose past hazard zones like stairwells and cracked walls, not stopping to rest there.",
      },
      {
        id: "sentinels-q-l1-4",
        prompt: "A younger student is frozen near a cracked wall after shaking stops. What's the most effective response?",
        options: [
          { text: "Give a short, clear instruction and physically lead them away", correct: true },
          { text: "Give a detailed explanation of why the wall is dangerous", correct: false },
          { text: "Assume they'll figure it out on their own", correct: false },
          { text: "Point from a distance and continue on your way", correct: false },
        ],
        explanation: "A frozen student needs direction plus action — physically leading removes the decision paralysis a long explanation won't fix.",
      },
      {
        id: "sentinels-q-l1-5",
        prompt: "Why does your tone matter when helping a panicking student, not just your words?",
        options: [
          { text: "Panic spreads through tone as much as through words", correct: true },
          { text: "Tone has no real effect on how someone reacts", correct: false },
          { text: "Only the exact words you use matter", correct: false },
          { text: "You should raise your voice to get their attention fastest", correct: false },
        ],
        explanation: "A calm, brief tone is itself a safety action — it can prevent panic from spreading further, independent of the words used.",
      },
    ],
  },
  {
    level: 2,
    title: "Fire: Reading a Building Under Stress",
    questions: [
      {
        id: "sentinels-q-l2-1",
        prompt: "Why does it matter whether a fire is electrical, oil-based, or unknown?",
        options: [
          { text: "Water is dangerous on live electrical equipment and burning oil", correct: true },
          { text: "It doesn't matter — water works on every type of fire", correct: false },
          { text: "Only the fire's size matters, not its source", correct: false },
          { text: "Only trained adults ever need to know the difference", correct: false },
        ],
        explanation: "Water causes shock risk on electrical fires and can cause violent splash-and-spread on oil fires — treating an unknown source as unknown is the safe default.",
      },
      {
        id: "sentinels-q-l2-2",
        prompt: "Both staircases are smoke-filled during a fire. What's the correct response?",
        options: [
          { text: "Shelter in the safest available room, close the door, and signal for help with your exact location", correct: true },
          { text: "Force your way through the smokier of the two", correct: false },
          { text: "Wait in the hallway between the two staircases", correct: false },
          { text: "Try the lift since both stairs are unusable", correct: false },
        ],
        explanation: "Sheltering with a clear signal to responders is a legitimate strategy, not a failure to evacuate, when both routes are genuinely unsafe.",
      },
      {
        id: "sentinels-q-l2-3",
        prompt: "Why does a working lift not automatically make it a safe option during a fire?",
        options: [
          { text: "Power can fail mid-fire, or the lift can open onto a smoke-filled floor", correct: true },
          { text: "Lifts are actually always safe to use during a fire", correct: false },
          { text: "Lifts are only unsafe if they're already broken", correct: false },
          { text: "It's only a rule for younger students, not you", correct: false },
        ],
        explanation: "A lift being operational right now doesn't guarantee it stays that way, or that it won't open onto danger.",
      },
      {
        id: "sentinels-q-l2-4",
        prompt: "Which radio report gives responders what they actually need?",
        options: [
          { text: "\"Stair B blocked by smoke, 3rd floor, six students sheltering in Room 304\"", correct: true },
          { text: "\"Something's wrong on the 3rd floor\"", correct: false },
          { text: "\"There might be an issue somewhere upstairs\"", correct: false },
          { text: "\"We're not totally sure what's happening\"", correct: false },
        ],
        explanation: "Specific reports — which route, how many people, exact location — speed up rescue; vague ones slow it down.",
      },
      {
        id: "sentinels-q-l2-5",
        prompt: "A student wants to go back for a bag near the fire's origin. What's the right call?",
        options: [
          { text: "Firmly redirect them and keep the whole group moving toward the exit", correct: true },
          { text: "Let them go back briefly while the group waits nearby", correct: false },
          { text: "Argue with them about why it's a bad idea", correct: false },
          { text: "Let them decide since it's their own risk to take", correct: false },
        ],
        explanation: "Firm, immediate redirection prevents the whole group from lingering near the hazard while one person deliberates.",
      },
    ],
  },
  {
    level: 3,
    title: "Hazard Mapping & Route Judgment",
    questions: [
      {
        id: "sentinels-q-l3-1",
        prompt: "Why should you be able to sketch your floor's exits from memory by this age?",
        options: [
          { text: "Memory recall is faster than reading a posted map under stress", correct: true },
          { text: "Posted maps are usually wrong", correct: false },
          { text: "It's just a busywork requirement, not practically useful", correct: false },
          { text: "You'll never actually need to evacuate", correct: false },
        ],
        explanation: "Under stress, being able to recall your exits from memory is faster and more reliable than stopping to read a map.",
      },
      {
        id: "sentinels-q-l3-2",
        prompt: "What's the standard for judging whether a route is currently unsafe?",
        options: [
          { text: "Whether it currently shows a hazard, not whether it's been formally confirmed dangerous", correct: true },
          { text: "Whether an adult has specifically told you it's dangerous", correct: false },
          { text: "Whether you've personally used that route before", correct: false },
          { text: "Whether it's the route most people are using", correct: false },
        ],
        explanation: "Waiting for formal confirmation wastes time — if a route currently shows a hazard, that's the standard for treating it as unsafe.",
      },
      {
        id: "sentinels-q-l3-3",
        prompt: "Staircase A has light haze but no visible flame. Staircase B is clear but two floors longer. What's the better call?",
        options: [
          { text: "Take Staircase B — visible smoke now can become heavy smoke fast", correct: true },
          { text: "Take Staircase A since it's faster and the smoke \"isn't that bad yet\"", correct: false },
          { text: "Wait to see if the haze in A clears up first", correct: false },
          { text: "Flip a coin since both have tradeoffs", correct: false },
        ],
        explanation: "\"Not that bad yet\" is exactly the judgment that fails once conditions change mid-route, with no way back — the extra distance is worth it.",
      },
      {
        id: "sentinels-q-l3-4",
        prompt: "When comparing two imperfect route options, which hazard should generally be treated as most urgent?",
        options: [
          { text: "Fire and smoke, generally ahead of water or crowding", correct: true },
          { text: "Crowding is always the most dangerous hazard", correct: false },
          { text: "All hazards should be treated as exactly equal", correct: false },
          { text: "Whichever hazard is currently the loudest", correct: false },
        ],
        explanation: "Fire and smoke are generally the most immediately lethal hazard to weigh against water or crowding when both routes have issues.",
      },
      {
        id: "sentinels-q-l3-5",
        prompt: "When you're truly uncertain which of two routes is safer, what's the better move?",
        options: [
          { text: "Shelter safely and signal for help rather than guess", correct: true },
          { text: "Pick whichever route feels faster in the moment", correct: false },
          { text: "Ask a stranger nearby which one to use", correct: false },
          { text: "Wait exactly where you are, in the open, until certain", correct: false },
        ],
        explanation: "Guessing wrong on a route can be worse than a safe shelter-and-signal approach when you genuinely can't judge which option is safer.",
      },
    ],
  },
  {
    level: 4,
    title: "Chemical & Lab Incident Response",
    questions: [
      {
        id: "sentinels-q-l4-1",
        prompt: "What's your correct first reaction to a spill or fumes in a lab?",
        options: [
          { text: "Alert others immediately, isolate the area, and evacuate per the lab's plan", correct: true },
          { text: "Try to identify the chemical by its smell first", correct: false },
          { text: "Clean it up quickly before it spreads further", correct: false },
          { text: "Continue working if it's not near your station", correct: false },
        ],
        explanation: "Alerting others and isolating the area comes first — identifying an unknown chemical by smell or proximity isn't a safe method.",
      },
      {
        id: "sentinels-q-l4-2",
        prompt: "When should eyewash stations or emergency showers actually be used?",
        options: [
          { text: "For direct exposure, per your training — not as a general precaution", correct: true },
          { text: "Anytime you're near a spill, just in case", correct: false },
          { text: "Only if a teacher specifically operates them for you", correct: false },
          { text: "They're for use after the incident is fully resolved", correct: false },
        ],
        explanation: "Using emergency equipment incorrectly, as a general precaution rather than for actual exposure, can waste critical time in a real exposure.",
      },
      {
        id: "sentinels-q-l4-3",
        prompt: "Fumes are in your escape route's stairwell. What's the right call?",
        options: [
          { text: "Use an alternate route or shelter and report your location", correct: true },
          { text: "Push through quickly since it's the same as smoke", correct: false },
          { text: "Wait exactly at the stairwell entrance for fumes to clear", correct: false },
          { text: "Try to identify the chemical before deciding what to do", correct: false },
        ],
        explanation: "The same logic as smoke applies — but chemical fumes can carry additional health risks beyond just visibility loss, so avoid pushing through.",
      },
      {
        id: "sentinels-q-l4-4",
        prompt: "A classmate gets a chemical splash on their hand. What's the correct response?",
        options: [
          { text: "Direct them to the eyewash/emergency shower per protocol and get a trained adult immediately", correct: true },
          { text: "Suggest a home remedy you've heard works for burns", correct: false },
          { text: "Tell them it's probably fine and to keep working", correct: false },
          { text: "Wait to see if symptoms appear before doing anything", correct: false },
        ],
        explanation: "Direct skin exposure needs protocol equipment right away — improvised remedies or waiting can make an unknown chemical's effects worse.",
      },
      {
        id: "sentinels-q-l4-5",
        prompt: "Why shouldn't you attempt to identify an unknown chemical yourself, even at your age?",
        options: [
          { text: "Getting close to smell or examine it risks exposure, without giving you reliable information anyway", correct: true },
          { text: "You're fully capable of identifying it, you just haven't been asked to", correct: false },
          { text: "It's only dangerous for younger students to try", correct: false },
          { text: "Identification isn't actually important in an emergency", correct: false },
        ],
        explanation: "Getting closer to identify a spill risks exposure without actually giving you information you can safely act on.",
      },
    ],
  },
  {
    level: 5,
    title: "Multi-Hazard & Leadership",
    questions: [
      {
        id: "sentinels-q-l5-1",
        prompt: "A lull happens in wind during an active cyclone. What should you assume?",
        options: [
          { text: "It could be the eye of the storm, not the end of it", correct: true },
          { text: "The storm has safely passed", correct: false },
          { text: "It's always safe to go check outside briefly", correct: false },
          { text: "Lulls never happen during real cyclones", correct: false },
        ],
        explanation: "A sudden calm during a cyclone is a known warning sign of an eye passing over — not a sign the storm has ended.",
      },
      {
        id: "sentinels-q-l5-2",
        prompt: "Why might crossing unknown floodwater be worse than waiting it out?",
        options: [
          { text: "Floodwater hides depth, current, and possibly live electrical hazards", correct: true },
          { text: "Crossing water is always faster and safer than waiting", correct: false },
          { text: "Floodwater is never actually dangerous to cross", correct: false },
          { text: "Only very deep water poses any real risk", correct: false },
        ],
        explanation: "Even shallow-looking, slow-moving water can knock someone down or hide live electrical hazards from submerged wiring.",
      },
      {
        id: "sentinels-q-l5-3",
        prompt: "After an earthquake, you find a damaged stair AND a gas smell. What's the correct sequence?",
        options: [
          { text: "Protect yourself first, reassess, then check for secondary hazards before choosing a path", correct: true },
          { text: "Just get out as fast as possible, in any direction", correct: false },
          { text: "Deal with the gas smell first, then worry about the stairs", correct: false },
          { text: "Wait exactly where you are until someone else decides", correct: false },
        ],
        explanation: "Skipping straight to \"just get out\" without this sequence is how people walk into a worse hazard than the one they left.",
      },
      {
        id: "sentinels-q-l5-4",
        prompt: "As the most senior student present, how should you direct a group during a hazard?",
        options: [
          { text: "State the hazard, state the action, and move — with confident, brief instructions", correct: true },
          { text: "Explain your full reasoning before anyone moves", correct: false },
          { text: "Let the group decide democratically in the moment", correct: false },
          { text: "Stay quiet so you don't seem like you're in charge", correct: false },
        ],
        explanation: "Confidence in tone matters as much as being right — hesitation itself can cause a crowd to freeze, while brief clear instructions keep people moving.",
      },
      {
        id: "sentinels-q-l5-5",
        prompt: "Why does communicating your exact location matter during a slow-moving disaster like a flood, even if you're not in immediate danger?",
        options: [
          { text: "You shouldn't assume someone already knows where you are", correct: true },
          { text: "It doesn't matter since slow disasters give everyone plenty of time regardless", correct: false },
          { text: "Only fast-moving disasters like fires require communicating your location", correct: false },
          { text: "Responders can always locate you automatically", correct: false },
        ],
        explanation: "Slow-moving disasters give you time to communicate — using it to confirm your location to staff or responders is part of using that time well.",
      },
    ],
  },
];
