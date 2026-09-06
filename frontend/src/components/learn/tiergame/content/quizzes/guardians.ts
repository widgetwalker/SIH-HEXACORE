import type { QuizLevel } from "../../types";

/* Guardians (Ages 11-13) Quiz Arena. 4-option questions, grounded in the
   floor-by-floor reasoning their modules already teach. */
export const GUARDIANS_QUIZ_LEVELS: QuizLevel[] = [
  {
    level: 1,
    title: "Earthquake",
    questions: [
      {
        id: "guardians-q-l1-1",
        prompt: "You're at your desk and the floor shakes. What's your very first move, no matter what floor you're on?",
        options: [
          { text: "Drop, Cover, and Hold On", correct: true },
          { text: "Run for the nearest staircase", correct: false },
          { text: "Stand in the doorway", correct: false },
          { text: "Call for help before moving", correct: false },
        ],
        explanation: "Drop, Cover, and Hold On is the first move on every floor — most injuries happen from falling or being hit while trying to move.",
      },
      {
        id: "guardians-q-l1-2",
        prompt: "Why shouldn't you run for the stairs while the building is still shaking?",
        options: [
          { text: "Most injuries happen from falling or being hit by falling objects while moving", correct: true },
          { text: "The stairs are always locked during an earthquake", correct: false },
          { text: "Running is against school rules", correct: false },
          { text: "It wastes time you don't have", correct: false },
        ],
        explanation: "Moving during active shaking is when most injuries actually happen — not from the shaking itself.",
      },
      {
        id: "guardians-q-l1-3",
        prompt: "After the shaking stops, what should you check before moving?",
        options: [
          { text: "Whether anyone's hurt, signs of damage or gas, and if evacuation has been called", correct: true },
          { text: "Just whether your phone still has signal", correct: false },
          { text: "Whether your friends are ready to leave", correct: false },
          { text: "Nothing — you should move immediately regardless", correct: false },
        ],
        explanation: "Checking for injuries, damage, and official instruction comes before moving anywhere.",
      },
      {
        id: "guardians-q-l1-4",
        prompt: "You're on the 3rd floor. The main staircase has a visible crack; the second staircase looks fine. What do you do?",
        options: [
          { text: "Use the second, undamaged staircase", correct: true },
          { text: "Step carefully over the crack since it's closer", correct: false },
          { text: "Wait where you are until someone checks the crack", correct: false },
          { text: "Test the cracked stair slowly to see if it holds", correct: false },
        ],
        explanation: "A damaged structure doesn't announce when it will fail completely — if it looks wrong, treat it as unsafe and use the other one.",
      },
      {
        id: "guardians-q-l1-5",
        prompt: "Why should top-floor students (4th-5th) expect a different evacuation than ground-floor students?",
        options: [
          { text: "They need more time and should watch for possible aftershocks", correct: true },
          { text: "They don't need to evacuate at all", correct: false },
          { text: "They should use the lift since it's faster", correct: false },
          { text: "There's no real difference between floors", correct: false },
        ],
        explanation: "Higher floors mean more time and more chance of encountering an aftershock mid-evacuation — moving steadily matters more.",
      },
    ],
  },
  {
    level: 2,
    title: "Fire & the PASS Method",
    questions: [
      {
        id: "guardians-q-l2-1",
        prompt: "The alarm sounds and you don't know where the fire is. What's your job?",
        options: [
          { text: "Move toward a safe exit calmly and quickly", correct: true },
          { text: "Find the fire's source first", correct: false },
          { text: "Wait for someone to confirm it's real", correct: false },
          { text: "Gather your belongings before leaving", correct: false },
        ],
        explanation: "You don't need to locate the fire — your job is to move toward a safe exit.",
      },
      {
        id: "guardians-q-l2-2",
        prompt: "Before committing to a staircase, what should you check?",
        options: [
          { text: "Touch the door for heat, and look for smoke before opening fully", correct: true },
          { text: "Whether it's the closest one", correct: false },
          { text: "Whether your friends are already using it", correct: false },
          { text: "Nothing, just go", correct: false },
        ],
        explanation: "Checking a door's heat and any visible smoke tells you whether that route is actually safe.",
      },
      {
        id: "guardians-q-l2-3",
        prompt: "What does the PASS method apply to?",
        options: [
          { text: "Small, contained fires you're trained to handle", correct: true },
          { text: "Any fire, no matter the size", correct: false },
          { text: "Only electrical fires", correct: false },
          { text: "Fires that have already spread significantly", correct: false },
        ],
        explanation: "PASS is only for a small fire you're trained to handle — if it's spreading, evacuate and let responders handle it.",
      },
      {
        id: "guardians-q-l2-4",
        prompt: "You're on the 4th or 5th floor when the fire alarm is confirmed real. What should you do?",
        options: [
          { text: "Move immediately — don't wait to see if a smoky staircase clears", correct: true },
          { text: "Wait a few minutes to be sure", correct: false },
          { text: "Take your time since you have the most distance to cover", correct: false },
          { text: "Go to the roof instead of the ground floor", correct: false },
        ],
        explanation: "The longer evacuation from upper floors means moving the moment the alarm is confirmed, switching stairs immediately if one has smoke.",
      },
      {
        id: "guardians-q-l2-5",
        prompt: "Your floor's staircase door is warm. What's the correct response?",
        options: [
          { text: "Don't open it — use the alternate exit or shelter and call for help", correct: true },
          { text: "Open it quickly and see how bad it is", correct: false },
          { text: "Wait by the door for it to cool down", correct: false },
          { text: "Break a window instead", correct: false },
        ],
        explanation: "A warm door means fire may be on the other side — opening it can feed the fire and expose you directly.",
      },
    ],
  },
  {
    level: 3,
    title: "Hazard Mapping",
    questions: [
      {
        id: "guardians-q-l3-1",
        prompt: "What should every floor plan give you before an emergency happens?",
        options: [
          { text: "A primary exit, a secondary exit, and an assembly point", correct: true },
          { text: "Just one clearly marked exit", correct: false },
          { text: "A list of teachers' phone numbers", correct: false },
          { text: "Nothing — you figure it out during the emergency", correct: false },
        ],
        explanation: "Knowing both exits and the assembly point ahead of time means you're not improvising under pressure.",
      },
      {
        id: "guardians-q-l3-2",
        prompt: "Which of these makes a route officially \"blocked\"?",
        options: [
          { text: "Visible fire, smoke, standing water, structural damage, or a stopped crowd", correct: true },
          { text: "A door that's simply shut", correct: false },
          { text: "A hallway with dim lighting", correct: false },
          { text: "A route that's slightly longer than another", correct: false },
        ],
        explanation: "Any of these hazards means the route is closed to you — no need to investigate further.",
      },
      {
        id: "guardians-q-l3-3",
        prompt: "Staircase A is clear. Staircase B has smoke drifting from underneath the door. What do you do?",
        options: [
          { text: "Use Staircase A and tell others nearby that B is unsafe", correct: true },
          { text: "Check Staircase B first to see how bad it is", correct: false },
          { text: "Use whichever one is currently less crowded", correct: false },
          { text: "Wait for a teacher to decide for you", correct: false },
        ],
        explanation: "Smoke under a door already meets the definition of a blocked route — there's nothing useful to learn by getting closer.",
      },
      {
        id: "guardians-q-l3-4",
        prompt: "If both your primary and secondary exits look blocked, what should you already know?",
        options: [
          { text: "A shelter spot on your floor you could use instead", correct: true },
          { text: "That you should always force your way through", correct: false },
          { text: "That this situation can't actually happen", correct: false },
          { text: "To wait exactly where you are, blocked or not", correct: false },
        ],
        explanation: "Knowing a shelter-in-place option ahead of time gives you a real answer if both exits are genuinely blocked.",
      },
      {
        id: "guardians-q-l3-5",
        prompt: "Why does \"a route counts as blocked if it shows a hazard\" matter, rather than waiting for confirmation?",
        options: [
          { text: "Judgment calls need to happen fast, based on what you can currently see", correct: true },
          { text: "Because rules should always be followed exactly, regardless of the situation", correct: false },
          { text: "It doesn't matter — you should always wait for an adult", correct: false },
          { text: "Only responders are allowed to judge if a route is blocked", correct: false },
        ],
        explanation: "Waiting for someone to formally confirm a hazard wastes exactly the time you don't have — visible signs are enough to act on.",
      },
    ],
  },
  {
    level: 4,
    title: "Chemical Spill",
    questions: [
      {
        id: "guardians-q-l4-1",
        prompt: "You smell something strange and see a spilled liquid in a lab. What do you do?",
        options: [
          { text: "Alert an adult immediately and move away from the area", correct: true },
          { text: "Lean in closer to identify the smell", correct: false },
          { text: "Try to clean it up before it spreads", correct: false },
          { text: "Ignore it if it's not directly in your way", correct: false },
        ],
        explanation: "You should never lean in to identify an unknown substance — alert an adult and move away instead.",
      },
      {
        id: "guardians-q-l4-2",
        prompt: "The spill is in your usual hallway or stairwell. What's the right move?",
        options: [
          { text: "Use the alternate exit, even if it takes longer", correct: true },
          { text: "Walk through quickly holding your breath", correct: false },
          { text: "Wait until the fumes look thinner", correct: false },
          { text: "Ask a friend to check first", correct: false },
        ],
        explanation: "Walking through unknown fumes risks your health immediately — the alternate exit is always worth the extra distance.",
      },
      {
        id: "guardians-q-l4-3",
        prompt: "Why is \"holding your breath and going through the short way\" a bad plan?",
        options: [
          { text: "Chemical fumes can affect you before you'd even need to breathe, and holding your breath doesn't fully protect you", correct: true },
          { text: "It actually works fine for any chemical", correct: false },
          { text: "It only matters for fires, not chemical spills", correct: false },
          { text: "Holding your breath makes you move too slowly", correct: false },
        ],
        explanation: "Fumes can affect you through skin and eyes too — holding your breath doesn't protect against everything a spill can put in the air.",
      },
      {
        id: "guardians-q-l4-4",
        prompt: "Who should decide whether a chemical spill is safe to approach?",
        options: [
          { text: "Trained adults or responders", correct: true },
          { text: "Whoever spilled it", correct: false },
          { text: "The closest available student", correct: false },
          { text: "No one needs to decide — it's usually fine", correct: false },
        ],
        explanation: "Identifying and handling unknown chemicals requires training you don't have as a student.",
      },
      {
        id: "guardians-q-l4-5",
        prompt: "What should you always do when reporting a chemical hazard?",
        options: [
          { text: "Tell an adult right away, even if you're not fully sure what it is", correct: true },
          { text: "Wait until you're completely certain before saying anything", correct: false },
          { text: "Only report it if it smells very strong", correct: false },
          { text: "Handle it yourself if it seems minor", correct: false },
        ],
        explanation: "Reporting immediately, even with uncertainty, gives adults the fastest chance to respond correctly.",
      },
    ],
  },
  {
    level: 5,
    title: "Cyclone, Flood & Multi-Hazard",
    questions: [
      {
        id: "guardians-q-l5-1",
        prompt: "Unlike a fire, what does a cyclone usually require you to do?",
        options: [
          { text: "Stay inside, away from windows, in an interior room", correct: true },
          { text: "Evacuate the building immediately", correct: false },
          { text: "Go to the roof for a clear view", correct: false },
          { text: "Head straight to the nearest exit", correct: false },
        ],
        explanation: "A cyclone's biggest danger is flying debris — staying inside away from windows is the standard response, the opposite of a fire evacuation.",
      },
      {
        id: "guardians-q-l5-2",
        prompt: "Why should you never walk or wade through moving water, even shallow water?",
        options: [
          { text: "It can hide strong currents, drop-offs, or live electrical hazards", correct: true },
          { text: "It's only dangerous if it's above waist height", correct: false },
          { text: "It's fine as long as you walk slowly", correct: false },
          { text: "Moving water isn't actually more dangerous than still water", correct: false },
        ],
        explanation: "What you can't see — current, depth changes, or electrical hazards — is what makes moving water dangerous, regardless of how it looks.",
      },
      {
        id: "guardians-q-l5-3",
        prompt: "You're on the ground floor. A cyclone warning is active and water is seeping under the door. What do you do?",
        options: [
          { text: "Move up to a higher safe floor, away from windows", correct: true },
          { text: "Step outside quickly to check how bad the flooding is", correct: false },
          { text: "Stay exactly where you are and wait", correct: false },
          { text: "Head to the parking area to move your things", correct: false },
        ],
        explanation: "Rising water plus an active cyclone point the same direction — get higher and stay clear of windows, don't go check outside.",
      },
      {
        id: "guardians-q-l5-4",
        prompt: "After an earthquake, you smell gas near the stairwell exit and the alarm hasn't sounded. What's the correct response?",
        options: [
          { text: "Avoid switches, move away using a different route, and alert an adult immediately", correct: true },
          { text: "Wait for the alarm before doing anything, since it hasn't gone off yet", correct: false },
          { text: "Flip the hallway light on to see what's happening", correct: false },
          { text: "Investigate the smell to confirm it's really gas", correct: false },
        ],
        explanation: "The alarm not sounding doesn't mean there's no danger — a gas smell alone is confirmation enough to act, and switches can spark it.",
      },
      {
        id: "guardians-q-l5-5",
        prompt: "Why do multi-hazard scenarios (like an earthquake triggering a gas leak) require you to \"re-check your plan\"?",
        options: [
          { text: "Real emergencies don't always come one at a time, and conditions can change mid-response", correct: true },
          { text: "Because your first plan is always wrong", correct: false },
          { text: "Multi-hazard events are extremely rare and not worth preparing for", correct: false },
          { text: "Only responders need to think about more than one hazard", correct: false },
        ],
        explanation: "One hazard can trigger another — staying ready to adjust your plan is part of handling a real emergency well.",
      },
    ],
  },
];
