import type { QuizLevel } from "../../types";

/* Explorers (Ages 5-7) Quiz Arena. 2-option questions, short sentences,
   one idea per question - matches the reading level and "thumbs up/down"
   pattern already used in the Explorers modules. */
export const EXPLORERS_QUIZ_LEVELS: QuizLevel[] = [
  {
    level: 1,
    title: "Shaky Ground",
    questions: [
      {
        id: "explorers-q-l1-1",
        prompt: "The ground starts to shake. What do you do first?",
        options: [
          { text: "Drop, cover, and hold on", correct: true },
          { text: "Run outside fast", correct: false },
        ],
        explanation: "When the ground shakes, drop down low right away so you don't fall.",
      },
      {
        id: "explorers-q-l1-2",
        prompt: "Where is the best place to cover?",
        options: [
          { text: "Under a sturdy desk or table", correct: true },
          { text: "Next to a big window", correct: false },
        ],
        explanation: "A desk or table can protect you from falling things. Windows can break.",
      },
      {
        id: "explorers-q-l1-3",
        prompt: "The shaking stopped. What should you do?",
        options: [
          { text: "Walk calmly and hold your buddy's hand", correct: true },
          { text: "Run to grab your backpack", correct: false },
        ],
        explanation: "Walking calmly and staying with your buddy keeps everyone safe.",
      },
      {
        id: "explorers-q-l1-4",
        prompt: "Should you run for the door while the ground is shaking?",
        options: [
          { text: "No, stay down and hold on", correct: true },
          { text: "Yes, run as fast as you can", correct: false },
        ],
        explanation: "Running while the ground shakes is how people fall and get hurt.",
      },
      {
        id: "explorers-q-l1-5",
        prompt: "Who tells you what to do after the shaking stops?",
        options: [
          { text: "Your teacher or grown-up", correct: true },
          { text: "No one — you decide by yourself", correct: false },
        ],
        explanation: "Your teacher or grown-up will tell you exactly where to go next.",
      },
    ],
  },
  {
    level: 2,
    title: "Fire Drill",
    questions: [
      {
        id: "explorers-q-l2-1",
        prompt: "You hear the fire alarm. What do you do?",
        options: [
          { text: "Walk calmly outside with your class", correct: true },
          { text: "Hide under your desk", correct: false },
        ],
        explanation: "For a fire alarm you always walk outside — hiding is only for earthquakes.",
      },
      {
        id: "explorers-q-l2-2",
        prompt: "You see smoke in the hallway. What do you do?",
        options: [
          { text: "Get low and crawl", correct: true },
          { text: "Stand up tall to see better", correct: false },
        ],
        explanation: "Clean air is near the floor, so getting low helps you breathe better.",
      },
      {
        id: "explorers-q-l2-3",
        prompt: "Should you go back inside for your favorite toy?",
        options: [
          { text: "No, never go back inside", correct: true },
          { text: "Yes, if it's quick", correct: false },
        ],
        explanation: "Toys can be replaced — going back inside during a fire is never safe.",
      },
      {
        id: "explorers-q-l2-4",
        prompt: "Once you're outside, where do you go?",
        options: [
          { text: "Your class's meeting spot", correct: true },
          { text: "Wherever looks fun", correct: false },
        ],
        explanation: "Going straight to your class's meeting spot means your teacher knows you're safe.",
      },
      {
        id: "explorers-q-l2-5",
        prompt: "During a fire drill, should you walk or run?",
        options: [
          { text: "Walk", correct: true },
          { text: "Run", correct: false },
        ],
        explanation: "Walking keeps everyone safe and calm — running can cause falls.",
      },
    ],
  },
  {
    level: 3,
    title: "Big Storm",
    questions: [
      {
        id: "explorers-q-l3-1",
        prompt: "A big storm is happening. Where should you go?",
        options: [
          { text: "An inside room with no windows", correct: true },
          { text: "Outside to watch", correct: false },
        ],
        explanation: "Storms can break windows and blow things around — staying inside away from windows is safest.",
      },
      {
        id: "explorers-q-l3-2",
        prompt: "What should you do with your arms in your safe spot?",
        options: [
          { text: "Cover your head", correct: true },
          { text: "Wave them around", correct: false },
        ],
        explanation: "Covering your head protects you if something falls or breaks nearby.",
      },
      {
        id: "explorers-q-l3-3",
        prompt: "The wind stopped. Can you come out now?",
        options: [
          { text: "Only when a grown-up says it's okay", correct: true },
          { text: "Yes, right away", correct: false },
        ],
        explanation: "Storms can seem finished and then come back — wait for a grown-up.",
      },
      {
        id: "explorers-q-l3-4",
        prompt: "Which room is a good safe spot?",
        options: [
          { text: "A hallway or bathroom with no windows", correct: true },
          { text: "A room next to a big window", correct: false },
        ],
        explanation: "Rooms without windows keep you safer from flying glass and debris.",
      },
      {
        id: "explorers-q-l3-5",
        prompt: "Should you sit high up or low down in your safe spot?",
        options: [
          { text: "Sit low", correct: true },
          { text: "Stand as tall as you can", correct: false },
        ],
        explanation: "Sitting low keeps you steadier and safer.",
      },
    ],
  },
  {
    level: 4,
    title: "Finding Family",
    questions: [
      {
        id: "explorers-q-l4-1",
        prompt: "The emergency is over. Where do you wait?",
        options: [
          { text: "Your class's meeting spot", correct: true },
          { text: "The parking lot, walking around", correct: false },
        ],
        explanation: "Staying at your class spot is how your grown-up finds you.",
      },
      {
        id: "explorers-q-l4-2",
        prompt: "Should you go looking for your grown-up by yourself?",
        options: [
          { text: "No, wait for them to find you", correct: true },
          { text: "Yes, go look everywhere", correct: false },
        ],
        explanation: "Grown-ups know to look for you at your class's meeting spot.",
      },
      {
        id: "explorers-q-l4-3",
        prompt: "Who do you stay with after an earthquake, fire, or storm?",
        options: [
          { text: "Your class and teacher", correct: true },
          { text: "Whoever you see first", correct: false },
        ],
        explanation: "Staying with your class and teacher keeps you safe and easy to find.",
      },
      {
        id: "explorers-q-l4-4",
        prompt: "How should you act while you wait?",
        options: [
          { text: "Calm and patient", correct: true },
          { text: "Worried and running around", correct: false },
        ],
        explanation: "Staying calm helps you and the people around you.",
      },
      {
        id: "explorers-q-l4-5",
        prompt: "Your grown-up isn't there yet. What do you do?",
        options: [
          { text: "Stay put and wait", correct: true },
          { text: "Walk around to find them", correct: false },
        ],
        explanation: "Staying put means your grown-up doesn't have to search all over for you.",
      },
    ],
  },
  {
    level: 5,
    title: "Super Safety Star",
    questions: [
      {
        id: "explorers-q-l5-1",
        prompt: "The ground is shaking. What do you do?",
        options: [
          { text: "Drop, cover, and hold on", correct: true },
          { text: "Look for your backpack", correct: false },
        ],
        explanation: "Drop, cover, and hold on comes first, every time the ground shakes.",
      },
      {
        id: "explorers-q-l5-2",
        prompt: "The fire alarm rings. What do you do?",
        options: [
          { text: "Walk outside calmly with your class", correct: true },
          { text: "Hide under your desk", correct: false },
        ],
        explanation: "A fire alarm always means walk outside — hiding is only for earthquakes.",
      },
      {
        id: "explorers-q-l5-3",
        prompt: "A big storm is outside. Where do you go?",
        options: [
          { text: "An inside room with no windows", correct: true },
          { text: "Outside on the porch", correct: false },
        ],
        explanation: "Storms mean staying inside, away from windows.",
      },
      {
        id: "explorers-q-l5-4",
        prompt: "The emergency is over. What do you do?",
        options: [
          { text: "Wait at your class spot", correct: true },
          { text: "Look for your family outside", correct: false },
        ],
        explanation: "Waiting at your class spot is how your grown-up finds you.",
      },
      {
        id: "explorers-q-l5-5",
        prompt: "You feel scared during an emergency. What helps most?",
        options: [
          { text: "Staying calm and listening to your teacher", correct: true },
          { text: "Running around and shouting", correct: false },
        ],
        explanation: "Staying calm and listening is the safest thing you can do, every time.",
      },
    ],
  },
];
