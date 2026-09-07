import type { QuizModule } from "../../types";

/* Explorers (Ages 5-7) Quiz Arena. One quiz per real module, 5 levels of
   5 questions each, 2-option true/false-style questions throughout -
   matches the reading level and format already used in the Explorers
   modules. Difficulty increases level to level within each module. */
export const EXPLORERS_QUIZ_MODULES: QuizModule[] = [
  {
    moduleId: "explorers-m1",
    name: "Earthquake: Drop, Cover, Hold Tight!",
    icon: "🌍",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "explorers-m1-l1-1",
            prompt: "The ground starts to shake. What do you do first?",
            options: [
              { text: "Drop, cover, and hold on", correct: true },
              { text: "Run outside fast", correct: false },
            ],
            explanation: "When the ground shakes, drop down low right away so you don't fall.",
          },
          {
            id: "explorers-m1-l1-2",
            prompt: "Where is the best place to cover?",
            options: [
              { text: "Under a sturdy desk or table", correct: true },
              { text: "Next to a big window", correct: false },
            ],
            explanation: "A desk or table can protect you from falling things. Windows can break.",
          },
          {
            id: "explorers-m1-l1-3",
            prompt: "The shaking stopped. What should you do?",
            options: [
              { text: "Walk calmly and hold your buddy's hand", correct: true },
              { text: "Run to grab your backpack", correct: false },
            ],
            explanation: "Walking calmly and staying with your buddy keeps everyone safe.",
          },
          {
            id: "explorers-m1-l1-4",
            prompt: "Should you run for the door while the ground is shaking?",
            options: [
              { text: "No, stay down and hold on", correct: true },
              { text: "Yes, run as fast as you can", correct: false },
            ],
            explanation: "Running while the ground shakes is how people fall and get hurt.",
          },
          {
            id: "explorers-m1-l1-5",
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
        questions: [
          {
            id: "explorers-m1-l2-1",
            prompt: "Where should you crawl to during shaking?",
            options: [
              { text: "Under a sturdy desk or table", correct: true },
              { text: "Next to a tall bookshelf", correct: false },
            ],
            explanation: "A sturdy desk protects you — a tall bookshelf could tip over.",
          },
          {
            id: "explorers-m1-l2-2",
            prompt: "What do you hold onto?",
            options: [
              { text: "The table leg", correct: true },
              { text: "Nothing, just stay still", correct: false },
            ],
            explanation: "Holding the table leg keeps your cover from shaking away from you.",
          },
          {
            id: "explorers-m1-l2-3",
            prompt: "What part of your body do you protect with your arms?",
            options: [
              { text: "Your head and neck", correct: true },
              { text: "Your feet", correct: false },
            ],
            explanation: "Covering your head and neck protects the parts most at risk from falling things.",
          },
          {
            id: "explorers-m1-l2-4",
            prompt: "A book falls near you while you're covered. What do you do?",
            options: [
              { text: "Stay covered and hold on", correct: true },
              { text: "Reach out to grab it", correct: false },
            ],
            explanation: "Reaching out means letting go of your cover — stay put until shaking stops.",
          },
          {
            id: "explorers-m1-l2-5",
            prompt: "Is it okay to peek out and look around while the ground is shaking?",
            options: [
              { text: "No, stay covered", correct: true },
              { text: "Yes, look around", correct: false },
            ],
            explanation: "Staying covered protects you until the shaking is completely done.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "explorers-m1-l3-1",
            prompt: "The shaking just stopped. Do you jump up right away?",
            options: [
              { text: "No, wait and listen first", correct: true },
              { text: "Yes, jump up fast", correct: false },
            ],
            explanation: "Waiting and listening lets your teacher tell you it's safe to move.",
          },
          {
            id: "explorers-m1-l3-2",
            prompt: "Your teacher says \"line up.\" What do you do?",
            options: [
              { text: "Line up calmly", correct: true },
              { text: "Run to be first", correct: false },
            ],
            explanation: "Lining up calmly keeps everyone moving safely together.",
          },
          {
            id: "explorers-m1-l3-3",
            prompt: "You see a book on the floor while walking out. What do you do?",
            options: [
              { text: "Step around it and keep walking", correct: true },
              { text: "Stop to pick it up", correct: false },
            ],
            explanation: "Stopping to pick things up can slow down everyone behind you.",
          },
          {
            id: "explorers-m1-l3-4",
            prompt: "Should you hold your buddy's hand while walking out?",
            options: [
              { text: "Yes", correct: true },
              { text: "No, walk alone", correct: false },
            ],
            explanation: "Holding hands with your buddy keeps you together and safe.",
          },
          {
            id: "explorers-m1-l3-5",
            prompt: "If you feel scared, what should you do?",
            options: [
              { text: "Stay calm and listen to your teacher", correct: true },
              { text: "Cry and stop walking", correct: false },
            ],
            explanation: "Staying calm and listening helps you and everyone around you.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "explorers-m1-l4-1",
            prompt: "You're on the playground and feel shaking. What's safest?",
            options: [
              { text: "Move away from trees and buildings, then drop and cover", correct: true },
              { text: "Run inside to hide under your desk", correct: false },
            ],
            explanation: "Outside, move away from things that can fall, like trees or walls, then drop and cover.",
          },
          {
            id: "explorers-m1-l4-2",
            prompt: "A friend is standing up during the shaking. What should you tell them?",
            options: [
              { text: "Drop, cover, and hold on", correct: true },
              { text: "Stand still and wait", correct: false },
            ],
            explanation: "Standing still doesn't protect you — dropping and covering does.",
          },
          {
            id: "explorers-m1-l4-3",
            prompt: "You're near a window when shaking starts. What do you do?",
            options: [
              { text: "Move away from the window and cover", correct: true },
              { text: "Stay by the window to see outside", correct: false },
            ],
            explanation: "Windows can break during shaking — move away and take cover.",
          },
          {
            id: "explorers-m1-l4-4",
            prompt: "Which is the very last step, after Drop and Cover?",
            options: [
              { text: "Hold On", correct: true },
              { text: "Look Around", correct: false },
            ],
            explanation: "Drop, Cover, and Hold On — holding on keeps your cover with you.",
          },
          {
            id: "explorers-m1-l4-5",
            prompt: "How long can shaking feel, even if it's actually short?",
            options: [
              { text: "It can feel like a long time", correct: true },
              { text: "It always feels like just one second", correct: false },
            ],
            explanation: "Shaking can feel longer than it really is — keep holding on until it's fully done.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "explorers-m1-l5-1",
            prompt: "Two friends disagree: one says run outside right away, one says drop, cover, hold on. Who is right?",
            options: [
              { text: "The friend who says drop, cover, hold on", correct: true },
              { text: "The friend who says run outside", correct: false },
            ],
            explanation: "Running during shaking is how people get hurt — drop, cover, hold on comes first.",
          },
          {
            id: "explorers-m1-l5-2",
            prompt: "The shaking stopped, but the room still looks messy. What do you do?",
            options: [
              { text: "Stay calm and wait for your teacher's direction", correct: true },
              { text: "Start cleaning up immediately", correct: false },
            ],
            explanation: "Your teacher decides what happens next — wait for their direction.",
          },
          {
            id: "explorers-m1-l5-3",
            prompt: "You're not near a desk when shaking starts. What's the next best thing?",
            options: [
              { text: "Crouch by an inside wall, away from windows", correct: true },
              { text: "Stand in the middle of the room", correct: false },
            ],
            explanation: "An inside wall away from windows is the next-best cover when there's no desk.",
          },
          {
            id: "explorers-m1-l5-4",
            prompt: "Someone says \"the shaking stopped so it's totally safe now.\" Is that always true?",
            options: [
              { text: "No, wait for a grown-up to say it's safe", correct: true },
              { text: "Yes, it's always totally safe", correct: false },
            ],
            explanation: "Only a grown-up can tell you it's really safe to move around again.",
          },
          {
            id: "explorers-m1-l5-5",
            prompt: "Why do we practice earthquake drills even when nothing is happening?",
            options: [
              { text: "So we know exactly what to do if it really happens", correct: true },
              { text: "Just for fun, it doesn't really matter", correct: false },
            ],
            explanation: "Practicing means you already know what to do, so you don't have to think it through in the moment.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "explorers-m2",
    name: "Fire Safety: Get Out and Stay Out!",
    icon: "🔥",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "explorers-m2-l1-1",
            prompt: "You hear the fire alarm. What do you do?",
            options: [
              { text: "Walk calmly outside with your class", correct: true },
              { text: "Hide under your desk", correct: false },
            ],
            explanation: "For a fire alarm you always walk outside — hiding is only for earthquakes.",
          },
          {
            id: "explorers-m2-l1-2",
            prompt: "You see smoke in the hallway. What do you do?",
            options: [
              { text: "Get low and crawl", correct: true },
              { text: "Stand up tall to see better", correct: false },
            ],
            explanation: "Clean air is near the floor, so getting low helps you breathe better.",
          },
          {
            id: "explorers-m2-l1-3",
            prompt: "Should you go back inside for your favorite toy?",
            options: [
              { text: "No, never go back inside", correct: true },
              { text: "Yes, if it's quick", correct: false },
            ],
            explanation: "Toys can be replaced — going back inside during a fire is never safe.",
          },
          {
            id: "explorers-m2-l1-4",
            prompt: "Once you're outside, where do you go?",
            options: [
              { text: "Your class's meeting spot", correct: true },
              { text: "Wherever looks fun", correct: false },
            ],
            explanation: "Going straight to your class's meeting spot means your teacher knows you're safe.",
          },
          {
            id: "explorers-m2-l1-5",
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
        level: 2,
        questions: [
          {
            id: "explorers-m2-l2-1",
            prompt: "What do you do when you hear the alarm?",
            options: [
              { text: "Line up and walk outside", correct: true },
              { text: "Cover your ears and wait", correct: false },
            ],
            explanation: "The alarm means it's time to walk outside with your class right away.",
          },
          {
            id: "explorers-m2-l2-2",
            prompt: "Should you stop to put your shoes on first?",
            options: [
              { text: "No, just go", correct: true },
              { text: "Yes, always put shoes on first", correct: false },
            ],
            explanation: "Getting out quickly matters more than stopping for shoes.",
          },
          {
            id: "explorers-m2-l2-3",
            prompt: "Who do you stay with while walking out?",
            options: [
              { text: "Your class", correct: true },
              { text: "Whoever is closest to the door", correct: false },
            ],
            explanation: "Staying with your class means your teacher can keep track of you.",
          },
          {
            id: "explorers-m2-l2-4",
            prompt: "What do you do with your hands while walking out?",
            options: [
              { text: "Keep them free, don't carry things", correct: true },
              { text: "Carry as many toys as you can", correct: false },
            ],
            explanation: "Free hands help you move quickly and safely.",
          },
          {
            id: "explorers-m2-l2-5",
            prompt: "Where do you walk to?",
            options: [
              { text: "Outside, to your meeting spot", correct: true },
              { text: "To the bathroom first", correct: false },
            ],
            explanation: "The meeting spot outside is always where you go during a fire drill.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "explorers-m2-l3-1",
            prompt: "You see smoke by the door. What do you do?",
            options: [
              { text: "Get low and crawl", correct: true },
              { text: "Stand up to see better", correct: false },
            ],
            explanation: "Getting low keeps you in the cleaner air near the floor.",
          },
          {
            id: "explorers-m2-l3-2",
            prompt: "A friend wants to hide in the closet. What do you tell them?",
            options: [
              { text: "No, we walk outside together", correct: true },
              { text: "That's a good hiding spot", correct: false },
            ],
            explanation: "Hiding is never the answer for a fire — always go outside.",
          },
          {
            id: "explorers-m2-l3-3",
            prompt: "You're the last one out of the room. What do you do?",
            options: [
              { text: "Follow your class outside", correct: true },
              { text: "Wait inside for everyone else", correct: false },
            ],
            explanation: "Everyone keeps moving outside together — no one waits inside.",
          },
          {
            id: "explorers-m2-l3-4",
            prompt: "Is it okay to open a door if it looks hot?",
            options: [
              { text: "No, find another way", correct: true },
              { text: "Yes, open it carefully", correct: false },
            ],
            explanation: "A hot door means danger on the other side — always find another way.",
          },
          {
            id: "explorers-m2-l3-5",
            prompt: "What do you do once you're outside?",
            options: [
              { text: "Go to the meeting spot and stay there", correct: true },
              { text: "Walk around and explore", correct: false },
            ],
            explanation: "Staying at the meeting spot is how your teacher knows you're safe.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "explorers-m2-l4-1",
            prompt: "Your favorite toy is still inside. What do you do?",
            options: [
              { text: "Leave it, never go back inside", correct: true },
              { text: "Run back quickly to get it", correct: false },
            ],
            explanation: "Toys can be replaced — you should never go back inside during a fire.",
          },
          {
            id: "explorers-m2-l4-2",
            prompt: "The alarm is loud and scary. What helps most?",
            options: [
              { text: "Staying calm and walking with your class", correct: true },
              { text: "Covering your ears and stopping", correct: false },
            ],
            explanation: "Staying calm and moving with your class keeps everyone safest.",
          },
          {
            id: "explorers-m2-l4-3",
            prompt: "You're walking outside and it feels crowded. What do you do?",
            options: [
              { text: "Stay calm and keep walking with your line", correct: true },
              { text: "Push ahead to go faster", correct: false },
            ],
            explanation: "Pushing can cause falls — staying calm in line is always safer.",
          },
          {
            id: "explorers-m2-l4-4",
            prompt: "Someone says fire drills are just pretend, so you don't need to try. Are they right?",
            options: [
              { text: "No, always practice like it's real", correct: true },
              { text: "Yes, drills don't really matter", correct: false },
            ],
            explanation: "Practicing like it's real is how you know exactly what to do if it ever happens.",
          },
          {
            id: "explorers-m2-l4-5",
            prompt: "What should you do if you get separated from your class while walking out?",
            options: [
              { text: "Find a grown-up and tell them", correct: true },
              { text: "Look for your class by yourself", correct: false },
            ],
            explanation: "A grown-up can help reunite you with your class quickly and safely.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "explorers-m2-l5-1",
            prompt: "You smell smoke but don't hear the alarm yet. What do you do?",
            options: [
              { text: "Tell a grown-up right away", correct: true },
              { text: "Wait for the alarm before saying anything", correct: false },
            ],
            explanation: "Telling a grown-up right away means help can come before the alarm even sounds.",
          },
          {
            id: "explorers-m2-l5-2",
            prompt: "Two friends disagree about which way to go outside. What's the safest choice?",
            options: [
              { text: "Follow your teacher's directions", correct: true },
              { text: "Pick whichever way looks faster", correct: false },
            ],
            explanation: "Your teacher knows the safe route — always follow their directions.",
          },
          {
            id: "explorers-m2-l5-3",
            prompt: "Why do we always walk, never run, during a fire drill?",
            options: [
              { text: "Running can make people trip and get hurt", correct: true },
              { text: "Walking is just a rule with no real reason", correct: false },
            ],
            explanation: "Walking calmly keeps everyone from tripping or bumping into each other.",
          },
          {
            id: "explorers-m2-l5-4",
            prompt: "You're at the meeting spot and notice a classmate isn't there yet. What do you do?",
            options: [
              { text: "Tell your teacher", correct: true },
              { text: "Go back inside to look for them", correct: false },
            ],
            explanation: "Telling your teacher lets a grown-up handle finding your classmate safely.",
          },
          {
            id: "explorers-m2-l5-5",
            prompt: "Why is it important to always go toward the grown-ups and outside, and never hide?",
            options: [
              { text: "Hiding makes it hard for people to know you're safe", correct: true },
              { text: "It doesn't matter which way you go", correct: false },
            ],
            explanation: "Going toward grown-ups and outside is how everyone knows you made it out safely.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "explorers-m3",
    name: "Storm Safety: Find Your Safe Spot",
    icon: "🌊",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "explorers-m3-l1-1",
            prompt: "A big storm is happening. Where should you go?",
            options: [
              { text: "An inside room with no windows", correct: true },
              { text: "Outside to watch", correct: false },
            ],
            explanation: "Storms can break windows and blow things around — staying inside away from windows is safest.",
          },
          {
            id: "explorers-m3-l1-2",
            prompt: "What should you do with your arms in your safe spot?",
            options: [
              { text: "Cover your head", correct: true },
              { text: "Wave them around", correct: false },
            ],
            explanation: "Covering your head protects you if something falls or breaks nearby.",
          },
          {
            id: "explorers-m3-l1-3",
            prompt: "The wind stopped. Can you come out now?",
            options: [
              { text: "Only when a grown-up says it's okay", correct: true },
              { text: "Yes, right away", correct: false },
            ],
            explanation: "Storms can seem finished and then come back — wait for a grown-up.",
          },
          {
            id: "explorers-m3-l1-4",
            prompt: "Which room is a good safe spot?",
            options: [
              { text: "A hallway or bathroom with no windows", correct: true },
              { text: "A room next to a big window", correct: false },
            ],
            explanation: "Rooms without windows keep you safer from flying glass and debris.",
          },
          {
            id: "explorers-m3-l1-5",
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
        level: 2,
        questions: [
          {
            id: "explorers-m3-l2-1",
            prompt: "Where's the safest place during a storm?",
            options: [
              { text: "An inside room with no windows", correct: true },
              { text: "Right next to a window", correct: false },
            ],
            explanation: "No windows means no flying glass to worry about.",
          },
          {
            id: "explorers-m3-l2-2",
            prompt: "What does your body do in your safe spot?",
            options: [
              { text: "Sit down low", correct: true },
              { text: "Stand up tall", correct: false },
            ],
            explanation: "Sitting low keeps you steady and safe.",
          },
          {
            id: "explorers-m3-l2-3",
            prompt: "What do your arms do?",
            options: [
              { text: "Cover your head", correct: true },
              { text: "Wave outside", correct: false },
            ],
            explanation: "Covering your head protects you from anything that might fall.",
          },
          {
            id: "explorers-m3-l2-4",
            prompt: "Can storms be strong enough to break windows?",
            options: [
              { text: "Yes", correct: true },
              { text: "No, never", correct: false },
            ],
            explanation: "Strong storms can break windows — that's why we stay away from them.",
          },
          {
            id: "explorers-m3-l2-5",
            prompt: "Who tells you it's safe to come out?",
            options: [
              { text: "A grown-up", correct: true },
              { text: "You decide by yourself", correct: false },
            ],
            explanation: "A grown-up knows when the storm has really passed.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "explorers-m3-l3-1",
            prompt: "You hear big wind outside. What do you do?",
            options: [
              { text: "Go to your safe spot", correct: true },
              { text: "Go look outside", correct: false },
            ],
            explanation: "Big wind means it's time to move to your safe spot right away.",
          },
          {
            id: "explorers-m3-l3-2",
            prompt: "Your safe spot is a hallway. Is that a good choice?",
            options: [
              { text: "Yes, no windows there", correct: true },
              { text: "No, hallways aren't safe", correct: false },
            ],
            explanation: "A hallway with no windows is exactly the kind of room to use.",
          },
          {
            id: "explorers-m3-l3-3",
            prompt: "The storm sounds quieter now. What do you do?",
            options: [
              { text: "Stay in your safe spot and wait", correct: true },
              { text: "Go outside since it's quieter", correct: false },
            ],
            explanation: "Quieter doesn't mean finished — wait for a grown-up to say it's okay.",
          },
          {
            id: "explorers-m3-l3-4",
            prompt: "Should you bring toys with sharp parts to your safe spot?",
            options: [
              { text: "No, just get to safety", correct: true },
              { text: "Yes, bring everything", correct: false },
            ],
            explanation: "Getting to your safe spot matters more than bringing toys.",
          },
          {
            id: "explorers-m3-l3-5",
            prompt: "What if your safe spot has a window in it?",
            options: [
              { text: "Find a different room with no window", correct: true },
              { text: "It's fine, use it anyway", correct: false },
            ],
            explanation: "A safe spot should always have no windows nearby.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "explorers-m3-l4-1",
            prompt: "A friend wants to watch the storm from a window. What do you say?",
            options: [
              { text: "Let's go to our safe spot instead", correct: true },
              { text: "Okay, let's watch together", correct: false },
            ],
            explanation: "Watching from a window is never safe during a storm — head to your safe spot.",
          },
          {
            id: "explorers-m3-l4-2",
            prompt: "The wind stopped for a little while. Is the storm definitely over?",
            options: [
              { text: "Not always — wait for a grown-up to say so", correct: true },
              { text: "Yes, it's always over", correct: false },
            ],
            explanation: "Storms can pause and then come back — only a grown-up can say it's over.",
          },
          {
            id: "explorers-m3-l4-3",
            prompt: "You're scared during the storm. What helps?",
            options: [
              { text: "Sitting in your safe spot and staying calm", correct: true },
              { text: "Running around the house", correct: false },
            ],
            explanation: "Staying in your safe spot and staying calm is what keeps you protected.",
          },
          {
            id: "explorers-m3-l4-4",
            prompt: "Why do we sit low in our safe spot?",
            options: [
              { text: "It's steadier and safer", correct: true },
              { text: "It's just more comfortable", correct: false },
            ],
            explanation: "Sitting low helps protect you if something falls or breaks nearby.",
          },
          {
            id: "explorers-m3-l4-5",
            prompt: "Which room is better for a storm: a bathroom with no windows, or a bedroom with a big window?",
            options: [
              { text: "The bathroom with no windows", correct: true },
              { text: "The bedroom with a big window", correct: false },
            ],
            explanation: "No windows means no flying glass — the bathroom is the safer choice.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "explorers-m3-l5-1",
            prompt: "The storm seems finished, then the wind picks up again. What does that mean?",
            options: [
              { text: "Storms can come back, so stay in your safe spot", correct: true },
              { text: "It means the storm is definitely over", correct: false },
            ],
            explanation: "Storms can seem finished and then come back — always stay put until told it's safe.",
          },
          {
            id: "explorers-m3-l5-2",
            prompt: "Someone says \"we can leave once it stops raining.\" Is that always right?",
            options: [
              { text: "No, wait for a grown-up to say it's safe", correct: true },
              { text: "Yes, rain stopping always means it's safe", correct: false },
            ],
            explanation: "Rain stopping doesn't always mean the storm is fully over — wait for a grown-up.",
          },
          {
            id: "explorers-m3-l5-3",
            prompt: "Why is \"stay away from windows\" one of the most important storm rules?",
            options: [
              { text: "Windows can break during strong storms", correct: true },
              { text: "Windows are never actually dangerous", correct: false },
            ],
            explanation: "Storms are strong enough to break windows, so staying away keeps you safe.",
          },
          {
            id: "explorers-m3-l5-4",
            prompt: "You're in your safe spot and hear something bang against the house. What do you do?",
            options: [
              { text: "Stay put and stay calm", correct: true },
              { text: "Go check what made the noise", correct: false },
            ],
            explanation: "Staying put keeps you safe — a grown-up will check on things once it's safe.",
          },
          {
            id: "explorers-m3-l5-5",
            prompt: "What's the one thing you should always wait for before leaving your safe spot?",
            options: [
              { text: "A grown-up telling you it's okay", correct: true },
              { text: "The first quiet moment you notice", correct: false },
            ],
            explanation: "Only a grown-up can tell you the storm has really passed.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "explorers-m4",
    name: "After It's Over: Find Your Grown-Up",
    icon: "🧑‍🤝‍🧑",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "explorers-m4-l1-1",
            prompt: "The emergency is over. Where do you wait?",
            options: [
              { text: "Your class's meeting spot", correct: true },
              { text: "The parking lot, walking around", correct: false },
            ],
            explanation: "Staying at your class spot is how your grown-up finds you.",
          },
          {
            id: "explorers-m4-l1-2",
            prompt: "Should you go looking for your grown-up by yourself?",
            options: [
              { text: "No, wait for them to find you", correct: true },
              { text: "Yes, go look everywhere", correct: false },
            ],
            explanation: "Grown-ups know to look for you at your class's meeting spot.",
          },
          {
            id: "explorers-m4-l1-3",
            prompt: "Who do you stay with after an earthquake, fire, or storm?",
            options: [
              { text: "Your class and teacher", correct: true },
              { text: "Whoever you see first", correct: false },
            ],
            explanation: "Staying with your class and teacher keeps you safe and easy to find.",
          },
          {
            id: "explorers-m4-l1-4",
            prompt: "How should you act while you wait?",
            options: [
              { text: "Calm and patient", correct: true },
              { text: "Worried and running around", correct: false },
            ],
            explanation: "Staying calm helps you and the people around you.",
          },
          {
            id: "explorers-m4-l1-5",
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
        level: 2,
        questions: [
          {
            id: "explorers-m4-l2-1",
            prompt: "Where do you wait after an emergency?",
            options: [
              { text: "Your class's meeting spot", correct: true },
              { text: "Wherever you feel like", correct: false },
            ],
            explanation: "The meeting spot is the one place your grown-up knows to look.",
          },
          {
            id: "explorers-m4-l2-2",
            prompt: "Who finds you at the meeting spot?",
            options: [
              { text: "Your grown-up", correct: true },
              { text: "No one, you find them", correct: false },
            ],
            explanation: "Your grown-up comes to the meeting spot to find you.",
          },
          {
            id: "explorers-m4-l2-3",
            prompt: "Should you stay with your teacher?",
            options: [
              { text: "Yes", correct: true },
              { text: "No, go off on your own", correct: false },
            ],
            explanation: "Staying with your teacher keeps you safe until your grown-up arrives.",
          },
          {
            id: "explorers-m4-l2-4",
            prompt: "How should you act while waiting?",
            options: [
              { text: "Calm and patient", correct: true },
              { text: "Loud and running around", correct: false },
            ],
            explanation: "Staying calm and patient is the safest way to wait.",
          },
          {
            id: "explorers-m4-l2-5",
            prompt: "Is it okay to leave the meeting spot to look around?",
            options: [
              { text: "No, stay put", correct: true },
              { text: "Yes, look around a bit", correct: false },
            ],
            explanation: "Staying put means you're always where your grown-up expects to find you.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "explorers-m4-l3-1",
            prompt: "You don't see your grown-up yet. What do you do?",
            options: [
              { text: "Keep waiting calmly at the spot", correct: true },
              { text: "Start walking to look for them", correct: false },
            ],
            explanation: "Waiting calmly means you're easy to find the moment they arrive.",
          },
          {
            id: "explorers-m4-l3-2",
            prompt: "A friend wants to go look for their family. What do you tell them?",
            options: [
              { text: "Let's stay here, they'll find us", correct: true },
              { text: "Let's go look together", correct: false },
            ],
            explanation: "Staying at the meeting spot is always the safest choice.",
          },
          {
            id: "explorers-m4-l3-3",
            prompt: "Your teacher is doing a headcount. What do you do?",
            options: [
              { text: "Stay still and answer when called", correct: true },
              { text: "Walk around while they count", correct: false },
            ],
            explanation: "Staying still helps your teacher make sure everyone is safe.",
          },
          {
            id: "explorers-m4-l3-4",
            prompt: "Why does your teacher need to know where you are?",
            options: [
              { text: "So they can tell your grown-up you're safe", correct: true },
              { text: "It doesn't really matter", correct: false },
            ],
            explanation: "Your teacher keeps track of you so your grown-up knows you're okay.",
          },
          {
            id: "explorers-m4-l3-5",
            prompt: "What's the safest thing to do if you feel worried while waiting?",
            options: [
              { text: "Tell your teacher how you feel", correct: true },
              { text: "Keep it to yourself and wander off", correct: false },
            ],
            explanation: "Telling your teacher means they can help you feel better while you wait.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "explorers-m4-l4-1",
            prompt: "You see a grown-up who isn't your family near the meeting spot. What do you do?",
            options: [
              { text: "Stay with your teacher and class", correct: true },
              { text: "Go with them if they seem nice", correct: false },
            ],
            explanation: "Always stay with your teacher and class, no matter who else is around.",
          },
          {
            id: "explorers-m4-l4-2",
            prompt: "Why shouldn't you wander even a little bit from the meeting spot?",
            options: [
              { text: "Your grown-up won't know where to look for you", correct: true },
              { text: "It's fine as long as you can still see the spot", correct: false },
            ],
            explanation: "Even a little wandering can mean your grown-up doesn't see you right away.",
          },
          {
            id: "explorers-m4-l4-3",
            prompt: "Your grown-up is taking a while to arrive. What's the best thing to do?",
            options: [
              { text: "Stay calm, your teacher is with you", correct: true },
              { text: "Get upset and cry loudly", correct: false },
            ],
            explanation: "Your teacher is looking after you until your grown-up gets there.",
          },
          {
            id: "explorers-m4-l4-4",
            prompt: "What job does your teacher have at the meeting spot?",
            options: [
              { text: "Keeping track of everyone until families arrive", correct: true },
              { text: "No real job, just standing around", correct: false },
            ],
            explanation: "Your teacher's job is to keep everyone together and safe until families come.",
          },
          {
            id: "explorers-m4-l4-5",
            prompt: "Two students want to sit somewhere quieter, away from the group. Good idea?",
            options: [
              { text: "No, stay with the group", correct: true },
              { text: "Yes, that's fine", correct: false },
            ],
            explanation: "Staying with the group means your teacher can always see you.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "explorers-m4-l5-1",
            prompt: "Why is \"stay with your class and teacher\" the same rule for every kind of emergency?",
            options: [
              { text: "It's always the way your grown-up knows where to find you", correct: true },
              { text: "It only matters for some emergencies", correct: false },
            ],
            explanation: "No matter what happened, staying with your class is always how you get found.",
          },
          {
            id: "explorers-m4-l5-2",
            prompt: "A friend is scared and wants to run to find their own house. What do you do?",
            options: [
              { text: "Tell a teacher right away", correct: true },
              { text: "Help them run there", correct: false },
            ],
            explanation: "Telling a teacher is the fastest way to keep your friend safe.",
          },
          {
            id: "explorers-m4-l5-3",
            prompt: "What's the very last step of any emergency plan, after everyone is safe outside?",
            options: [
              { text: "Waiting together until families arrive", correct: true },
              { text: "Going back inside to check on things", correct: false },
            ],
            explanation: "Waiting together at the meeting spot is always the final step.",
          },
          {
            id: "explorers-m4-l5-4",
            prompt: "Why do we practice \"find your grown-up\" drills even when nothing bad is happening?",
            options: [
              { text: "So everyone knows exactly what to do if it's ever real", correct: true },
              { text: "Just for fun, it doesn't matter", correct: false },
            ],
            explanation: "Practicing now means you won't have to figure it out during a real emergency.",
          },
          {
            id: "explorers-m4-l5-5",
            prompt: "What's the most important job you have while you wait?",
            options: [
              { text: "Staying calm and staying put", correct: true },
              { text: "Figuring out the plan yourself", correct: false },
            ],
            explanation: "Staying calm and staying put is exactly what keeps you safe and easy to find.",
          },
        ],
      },
    ],
  },
];
