import type { QuizLevel } from "../../types";

/* Rangers (Ages 8-10) Quiz Arena. 3-option questions, simple sentences,
   grounded in the same hazards their modules already cover. */
export const RANGERS_QUIZ_LEVELS: QuizLevel[] = [
  {
    level: 1,
    title: "Earthquake",
    questions: [
      {
        id: "rangers-q-l1-1",
        prompt: "The floor starts to shake at your desk. What's your first move?",
        options: [
          { text: "Drop, cover, and hold on", correct: true },
          { text: "Run for the stairs immediately", correct: false },
          { text: "Stand in the doorway and watch", correct: false },
        ],
        explanation: "Drop, cover, hold on comes before anything else — most injuries happen from falling or moving during the shaking, not the shaking itself.",
      },
      {
        id: "rangers-q-l1-2",
        prompt: "No desk is nearby when the shaking starts. What do you do?",
        options: [
          { text: "Crouch against an interior wall, away from windows", correct: true },
          { text: "Stand next to a window for a better view", correct: false },
          { text: "Run to find a desk in another room", correct: false },
        ],
        explanation: "An interior wall away from windows is the next-best cover when there's no desk nearby.",
      },
      {
        id: "rangers-q-l1-3",
        prompt: "The shaking has stopped. What's the first thing to check?",
        options: [
          { text: "Whether anyone near you is hurt", correct: true },
          { text: "Whether your bag is still in your locker", correct: false },
          { text: "Whether class will continue as normal", correct: false },
        ],
        explanation: "Checking on people near you comes before anything else once the shaking stops.",
      },
      {
        id: "rangers-q-l1-4",
        prompt: "You need to evacuate after an earthquake. Which do you use?",
        options: [
          { text: "The stairs", correct: true },
          { text: "The lift, since it's faster", correct: false },
          { text: "Whichever is closest, lift or stairs", correct: false },
        ],
        explanation: "A lift can stop working or open onto a damaged floor — stairs are always the safe choice.",
      },
      {
        id: "rangers-q-l1-5",
        prompt: "Your classroom door won't open easily after the shaking stops. What do you do?",
        options: [
          { text: "Stay calm, try gently again, and tell your teacher if it's stuck", correct: true },
          { text: "Climb out a window instead", correct: false },
          { text: "Kick the door repeatedly until it breaks", correct: false },
        ],
        explanation: "Staying calm and getting a teacher involved is far safer than climbing out a window or forcing the door.",
      },
    ],
  },
  {
    level: 2,
    title: "Fire Evacuation",
    questions: [
      {
        id: "rangers-q-l2-1",
        prompt: "The fire alarm sounds. What's your job right now?",
        options: [
          { text: "Walk calmly toward your class's exit", correct: true },
          { text: "Find out exactly where the fire is first", correct: false },
          { text: "Wait until you're sure it's not a drill", correct: false },
        ],
        explanation: "You don't need to know where the fire is — your job is just to move toward the exit.",
      },
      {
        id: "rangers-q-l2-2",
        prompt: "Before opening a door on your way out, what should you do?",
        options: [
          { text: "Touch it with the back of your hand", correct: true },
          { text: "Open it quickly to see what's on the other side", correct: false },
          { text: "Kick it open just in case", correct: false },
        ],
        explanation: "Touching the door first tells you if fire might be right on the other side, without opening it.",
      },
      {
        id: "rangers-q-l2-3",
        prompt: "You open a door and see smoke. What do you do?",
        options: [
          { text: "Get low and find a different route", correct: true },
          { text: "Hold your breath and walk through quickly", correct: false },
          { text: "Wait by the door for the smoke to clear", correct: false },
        ],
        explanation: "Smoke disorients people fast — getting low and finding another way is always safer than walking through.",
      },
      {
        id: "rangers-q-l2-4",
        prompt: "What does P-A-S-S on a fire extinguisher stand for?",
        options: [
          { text: "Pull, Aim, Squeeze, Sweep", correct: true },
          { text: "Push, Alert, Stop, Signal", correct: false },
          { text: "Prepare, Assess, Start, Spray", correct: false },
        ],
        explanation: "P-A-S-S is Pull, Aim, Squeeze, Sweep — but it's a tool for trained adults on small fires, not for you.",
      },
      {
        id: "rangers-q-l2-5",
        prompt: "Your classroom door is warm to the touch. What do you do?",
        options: [
          { text: "Don't open it — use the alternate exit", correct: true },
          { text: "Open it quickly to see how bad it is", correct: false },
          { text: "Wait a few minutes and check again", correct: false },
        ],
        explanation: "A warm door means fire could be right behind it — always use the alternate exit instead.",
      },
    ],
  },
  {
    level: 3,
    title: "Know Your Building",
    questions: [
      {
        id: "rangers-q-l3-1",
        prompt: "Every classroom should have how many exits you know?",
        options: [
          { text: "Two — a primary and a backup", correct: true },
          { text: "Just one, the main door", correct: false },
          { text: "None — you just follow the crowd", correct: false },
        ],
        explanation: "Knowing both a primary and a backup exit means you always have a plan if one is blocked.",
      },
      {
        id: "rangers-q-l3-2",
        prompt: "Which of these means a route is blocked?",
        options: [
          { text: "Smoke, fire, water on the floor, or a stopped crowd", correct: true },
          { text: "A door that's simply closed", correct: false },
          { text: "A hallway that's a little dark", correct: false },
        ],
        explanation: "Fire, smoke, water, or a crowd that's stopped moving all mean that route is closed to you.",
      },
      {
        id: "rangers-q-l3-3",
        prompt: "You see smoke coming from under a door on your usual route. What do you do?",
        options: [
          { text: "Use your backup exit and tell your teacher", correct: true },
          { text: "Open the door to check how bad it is", correct: false },
          { text: "Wait by the door until someone else decides", correct: false },
        ],
        explanation: "Smoke under a door already tells you the route is blocked — no need to open it and check.",
      },
      {
        id: "rangers-q-l3-4",
        prompt: "Why should you know where your class meets outside?",
        options: [
          { text: "So your teacher can be sure everyone's accounted for", correct: true },
          { text: "So you can leave early", correct: false },
          { text: "It doesn't really matter where you meet", correct: false },
        ],
        explanation: "A known meeting spot is how your teacher knows everyone made it out safely.",
      },
      {
        id: "rangers-q-l3-5",
        prompt: "When should you already know where your exits are?",
        options: [
          { text: "Before any emergency happens, not just during one", correct: true },
          { text: "Only once the fire alarm is already ringing", correct: false },
          { text: "You never really need to know, just follow others", correct: false },
        ],
        explanation: "Knowing your exits ahead of time means you don't have to think it through under pressure.",
      },
    ],
  },
  {
    level: 4,
    title: "Chemical Spill",
    questions: [
      {
        id: "rangers-q-l4-1",
        prompt: "You notice a strange smell and a puddle near the sink. What do you do?",
        options: [
          { text: "Step away and tell your teacher immediately", correct: true },
          { text: "Get closer to see what spilled", correct: false },
          { text: "Wipe it up yourself with a paper towel", correct: false },
        ],
        explanation: "Stepping away and telling a teacher is always the right call with something you can't identify.",
      },
      {
        id: "rangers-q-l4-2",
        prompt: "Should you ever sniff or touch an unknown spill to figure out what it is?",
        options: [
          { text: "No, never", correct: true },
          { text: "Yes, just a quick sniff is fine", correct: false },
          { text: "Only if it looks harmless", correct: false },
        ],
        explanation: "You can't tell if something is dangerous by smell or touch — always leave identification to trained adults.",
      },
      {
        id: "rangers-q-l4-3",
        prompt: "Fumes are coming from your usual exit hallway. What do you do?",
        options: [
          { text: "Use the alternate exit, even if it's farther", correct: true },
          { text: "Hold your breath and walk through fast", correct: false },
          { text: "Wait for the fumes to clear before moving", correct: false },
        ],
        explanation: "Walking through unknown fumes risks your health immediately — the alternate exit is always worth the extra distance.",
      },
      {
        id: "rangers-q-l4-4",
        prompt: "A strange smell in a science room means what?",
        options: [
          { text: "Tell an adult right away and step back", correct: true },
          { text: "Try to identify the chemical yourself", correct: false },
          { text: "Ignore it if class is about to end anyway", correct: false },
        ],
        explanation: "Any strange smell or spill gets the same response: tell an adult and step back.",
      },
      {
        id: "rangers-q-l4-5",
        prompt: "Who should handle identifying an unknown chemical spill?",
        options: [
          { text: "A trained adult", correct: true },
          { text: "Whoever is closest to it", correct: false },
          { text: "You, carefully", correct: false },
        ],
        explanation: "Identifying and handling unknown chemicals is a job for trained adults, not students.",
      },
    ],
  },
  {
    level: 5,
    title: "Cyclone, Flood & Multi-Hazard",
    questions: [
      {
        id: "rangers-q-l5-1",
        prompt: "A cyclone warning is active. Where should you be?",
        options: [
          { text: "Inside, in an interior room away from windows", correct: true },
          { text: "Outside, watching from a safe distance", correct: false },
          { text: "Near a window so you can see incoming debris", correct: false },
        ],
        explanation: "Flying debris is the biggest cyclone danger — staying inside, away from windows, is the plan.",
      },
      {
        id: "rangers-q-l5-2",
        prompt: "Water is coming in under the door during a cyclone. What do you do?",
        options: [
          { text: "Move to a higher floor and tell an adult", correct: true },
          { text: "Step outside to check how deep it is", correct: false },
          { text: "Try to block it with towels and stay put", correct: false },
        ],
        explanation: "Rising water plus an active cyclone means getting higher and telling an adult, not investigating outside.",
      },
      {
        id: "rangers-q-l5-3",
        prompt: "Why is moving water dangerous even if it looks shallow?",
        options: [
          { text: "It can hide strong currents or electrical hazards", correct: true },
          { text: "It's actually never dangerous if it's shallow", correct: false },
          { text: "It only matters if it's above your knees", correct: false },
        ],
        explanation: "Shallow-looking water can still hide currents or live electrical hazards underneath.",
      },
      {
        id: "rangers-q-l5-4",
        prompt: "Shaking just stopped and you smell gas near the exit, but the alarm hasn't sounded. What do you do?",
        options: [
          { text: "Avoid light switches, move away using a different route, and tell a teacher immediately", correct: true },
          { text: "Flip the hallway light on to see better", correct: false },
          { text: "Wait for the alarm before doing anything", correct: false },
        ],
        explanation: "A gas smell is reason enough to act immediately — a light switch can spark right next to a leak, and the alarm not sounding doesn't mean it's safe.",
      },
      {
        id: "rangers-q-l5-5",
        prompt: "Why do emergencies sometimes require you to change your plan partway through?",
        options: [
          { text: "One hazard can lead to another, like an earthquake causing a gas leak", correct: true },
          { text: "Plans never actually need to change once you've started", correct: false },
          { text: "Only adults need to worry about changing plans", correct: false },
        ],
        explanation: "Real emergencies don't always stay in one category — staying alert to a second hazard is part of staying safe.",
      },
    ],
  },
];
