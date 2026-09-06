import type { QuizModule } from "../../types";

/* Rangers (Ages 8-10) Quiz Arena. One quiz per real module, 5 levels of
   5 questions each, 3-option questions throughout. Difficulty increases
   level to level within each module. */
export const RANGERS_QUIZ_MODULES: QuizModule[] = [
  {
    moduleId: "rangers-m1",
    name: "Earthquake: Drop, Cover, Hold On",
    icon: "🌍",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "rangers-m1-l1-1",
            prompt: "The floor starts to shake at your desk. What's your first move?",
            options: [
              { text: "Drop, cover, and hold on", correct: true },
              { text: "Run for the stairs immediately", correct: false },
              { text: "Stand in the doorway and watch", correct: false },
            ],
            explanation: "Drop, cover, hold on comes before anything else — most injuries happen from falling or moving during the shaking, not the shaking itself.",
          },
          {
            id: "rangers-m1-l1-2",
            prompt: "No desk is nearby when the shaking starts. What do you do?",
            options: [
              { text: "Crouch against an interior wall, away from windows", correct: true },
              { text: "Stand next to a window for a better view", correct: false },
              { text: "Run to find a desk in another room", correct: false },
            ],
            explanation: "An interior wall away from windows is the next-best cover when there's no desk nearby.",
          },
          {
            id: "rangers-m1-l1-3",
            prompt: "The shaking has stopped. What's the first thing to check?",
            options: [
              { text: "Whether anyone near you is hurt", correct: true },
              { text: "Whether your bag is still in your locker", correct: false },
              { text: "Whether class will continue as normal", correct: false },
            ],
            explanation: "Checking on people near you comes before anything else once the shaking stops.",
          },
          {
            id: "rangers-m1-l1-4",
            prompt: "You need to evacuate after an earthquake. Which do you use?",
            options: [
              { text: "The stairs", correct: true },
              { text: "The lift, since it's faster", correct: false },
              { text: "Whichever is closest, lift or stairs", correct: false },
            ],
            explanation: "A lift can stop working or open onto a damaged floor — stairs are always the safe choice.",
          },
          {
            id: "rangers-m1-l1-5",
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
        questions: [
          {
            id: "rangers-m1-l2-1",
            prompt: "Where should you crouch if there's no desk nearby?",
            options: [
              { text: "Against an interior wall, away from windows", correct: true },
              { text: "Next to a window", correct: false },
              { text: "In the doorway", correct: false },
            ],
            explanation: "An interior wall away from windows protects you when there's no desk to get under.",
          },
          {
            id: "rangers-m1-l2-2",
            prompt: "What's the very last of the three earthquake steps?",
            options: [
              { text: "Hold On", correct: true },
              { text: "Look Around", correct: false },
              { text: "Stand Up", correct: false },
            ],
            explanation: "Drop, Cover, and Hold On — holding on keeps your cover from shifting away from you.",
          },
          {
            id: "rangers-m1-l2-3",
            prompt: "Why do you cover your head and neck?",
            options: [
              { text: "To protect against falling objects", correct: true },
              { text: "It's just a habit, no real reason", correct: false },
              { text: "To stay warm", correct: false },
            ],
            explanation: "Falling objects are one of the biggest risks during shaking, so covering your head and neck matters.",
          },
          {
            id: "rangers-m1-l2-4",
            prompt: "After shaking stops, what's the very first check?",
            options: [
              { text: "Is anyone near you hurt?", correct: true },
              { text: "Is your bag still there?", correct: false },
              { text: "Is class still happening?", correct: false },
            ],
            explanation: "Checking for injuries near you comes before anything else.",
          },
          {
            id: "rangers-m1-l2-5",
            prompt: "Which do you use to evacuate after an earthquake?",
            options: [
              { text: "The stairs", correct: true },
              { text: "The lift", correct: false },
              { text: "Either one, doesn't matter", correct: false },
            ],
            explanation: "Stairs are always the safe choice — a lift can fail or open onto a damaged floor.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "rangers-m1-l3-1",
            prompt: "You're at your desk and feel shaking start. What's the very first thing you do?",
            options: [
              { text: "Drop to your hands and knees", correct: true },
              { text: "Stand up to see what's happening", correct: false },
              { text: "Grab your bag", correct: false },
            ],
            explanation: "Dropping down low right away is the first move, before anything else.",
          },
          {
            id: "rangers-m1-l3-2",
            prompt: "Shaking has stopped. You smell something odd in the air. What do you check?",
            options: [
              { text: "Whether it's gas or damage", correct: true },
              { text: "Whether your friends noticed it too", correct: false },
              { text: "Ignore it and keep walking", correct: false },
            ],
            explanation: "An odd smell could mean gas or damage — it's one of the things you check right after shaking stops.",
          },
          {
            id: "rangers-m1-l3-3",
            prompt: "Your classroom door won't open easily. What's the calm response?",
            options: [
              { text: "Try again gently, tell your teacher if it's stuck", correct: true },
              { text: "Force it open right away", correct: false },
              { text: "Wait silently and do nothing", correct: false },
            ],
            explanation: "A gentle retry plus telling your teacher is safer than forcing the door or freezing up.",
          },
          {
            id: "rangers-m1-l3-4",
            prompt: "A friend is heading for the lift after an earthquake. What do you tell them?",
            options: [
              { text: "Use the stairs instead", correct: true },
              { text: "That's fine, lifts are safe", correct: false },
              { text: "Wait for the lift together", correct: false },
            ],
            explanation: "Stairs are always the safer choice after an earthquake, even if the lift looks fine.",
          },
          {
            id: "rangers-m1-l3-5",
            prompt: "Why do you check for injuries before moving anywhere?",
            options: [
              { text: "So you know if someone needs help before you go", correct: true },
              { text: "It doesn't really matter", correct: false },
              { text: "Just to pass time", correct: false },
            ],
            explanation: "Checking first means you can help someone who needs it before evacuating.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "rangers-m1-l4-1",
            prompt: "Two staircases are available after an earthquake. One has a visible crack. What do you do?",
            options: [
              { text: "Use the other, undamaged staircase", correct: true },
              { text: "Use the cracked one since it's closer", correct: false },
              { text: "Wait exactly where you are", correct: false },
            ],
            explanation: "Visible damage means that route is unsafe — always use the undamaged one instead.",
          },
          {
            id: "rangers-m1-l4-2",
            prompt: "Why shouldn't you decide the lift is fine just because the power seems to be working?",
            options: [
              { text: "A lift can still fail or open onto a damaged floor", correct: true },
              { text: "Power working means it's always safe", correct: false },
              { text: "It doesn't matter either way", correct: false },
            ],
            explanation: "Even a working lift can fail mid-use or open onto danger — stairs stay the safe default.",
          },
          {
            id: "rangers-m1-l4-3",
            prompt: "A teacher hasn't given instructions yet, but shaking clearly stopped. What do you do?",
            options: [
              { text: "Wait calmly for instructions before moving", correct: true },
              { text: "Start evacuating on your own immediately", correct: false },
              { text: "Ignore the teacher and do your own thing", correct: false },
            ],
            explanation: "Waiting calmly for instructions keeps the whole class moving together and safely.",
          },
          {
            id: "rangers-m1-l4-4",
            prompt: "Why is \"most injuries happen from falling or being hit, not from the shaking itself\" an important fact?",
            options: [
              { text: "It explains why staying still and covered matters more than reacting fast", correct: true },
              { text: "It means shaking isn't actually dangerous", correct: false },
              { text: "It has nothing to do with what you should do", correct: false },
            ],
            explanation: "Knowing where the real danger comes from is why Drop-Cover-Hold works better than running.",
          },
          {
            id: "rangers-m1-l4-5",
            prompt: "You're holding onto a desk during shaking and it starts to slide. What do you do?",
            options: [
              { text: "Keep holding on and stay low", correct: true },
              { text: "Let go and stand up", correct: false },
              { text: "Grab a different object across the room", correct: false },
            ],
            explanation: "Staying low and holding on is safer than standing up or moving across the room mid-shake.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "rangers-m1-l5-1",
            prompt: "Shaking has stopped. Your friend says \"let's go check if the stairs are okay.\" What's the safer plan?",
            options: [
              { text: "Look for visible damage first, rather than testing it by walking on it", correct: true },
              { text: "Just walk on it to see if it holds", correct: false },
              { text: "Ignore the stairs entirely and stay in the room", correct: false },
            ],
            explanation: "Checking for visible damage first avoids testing a stair that might already be unsafe.",
          },
          {
            id: "rangers-m1-l5-2",
            prompt: "Why does \"never run for the stairs while still shaking\" apply even if the stairs look close and easy?",
            options: [
              { text: "Moving during shaking is when most injuries happen, regardless of distance", correct: true },
              { text: "It only applies to far-away stairs", correct: false },
              { text: "It's just a suggestion, not a real rule", correct: false },
            ],
            explanation: "The risk of moving during shaking doesn't depend on how close the stairs are.",
          },
          {
            id: "rangers-m1-l5-3",
            prompt: "A classmate insists on going back for their bag once you're already evacuating. What's correct?",
            options: [
              { text: "Tell them to keep moving with the group, not go back", correct: true },
              { text: "Let them go back quickly", correct: false },
              { text: "Go back with them to be safe", correct: false },
            ],
            explanation: "Keeping the group moving together is safer than letting anyone go back for belongings.",
          },
          {
            id: "rangers-m1-l5-4",
            prompt: "Why does checking \"is there damage or a gas smell\" come before deciding to evacuate?",
            options: [
              { text: "These signs tell you whether it's actually safe to move", correct: true },
              { text: "It's just an extra step with no real purpose", correct: false },
              { text: "You should evacuate immediately no matter what", correct: false },
            ],
            explanation: "Checking for damage or gas first tells you whether the route you're about to take is actually safe.",
          },
          {
            id: "rangers-m1-l5-5",
            prompt: "What's the most important reason to stay calm and follow the same steps every time an earthquake happens?",
            options: [
              { text: "A clear, practiced response is what keeps you and others safest under stress", correct: true },
              { text: "It's simply the school rule, without a real safety reason", correct: false },
              { text: "Calm behavior doesn't actually change anything", correct: false },
            ],
            explanation: "A practiced, calm response is exactly what prevents panic-driven mistakes under stress.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "rangers-m2",
    name: "Fire Evacuation: Smart Exits",
    icon: "🔥",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "rangers-m2-l1-1",
            prompt: "The fire alarm sounds. What's your job right now?",
            options: [
              { text: "Walk calmly toward your class's exit", correct: true },
              { text: "Find out exactly where the fire is first", correct: false },
              { text: "Wait until you're sure it's not a drill", correct: false },
            ],
            explanation: "You don't need to know where the fire is — your job is just to move toward the exit.",
          },
          {
            id: "rangers-m2-l1-2",
            prompt: "Before opening a door on your way out, what should you do?",
            options: [
              { text: "Touch it with the back of your hand", correct: true },
              { text: "Open it quickly to see what's on the other side", correct: false },
              { text: "Kick it open just in case", correct: false },
            ],
            explanation: "Touching the door first tells you if fire might be right on the other side, without opening it.",
          },
          {
            id: "rangers-m2-l1-3",
            prompt: "You open a door and see smoke. What do you do?",
            options: [
              { text: "Get low and find a different route", correct: true },
              { text: "Hold your breath and walk through quickly", correct: false },
              { text: "Wait by the door for the smoke to clear", correct: false },
            ],
            explanation: "Smoke disorients people fast — getting low and finding another way is always safer than walking through.",
          },
          {
            id: "rangers-m2-l1-4",
            prompt: "What does P-A-S-S on a fire extinguisher stand for?",
            options: [
              { text: "Pull, Aim, Squeeze, Sweep", correct: true },
              { text: "Push, Alert, Stop, Signal", correct: false },
              { text: "Prepare, Assess, Start, Spray", correct: false },
            ],
            explanation: "P-A-S-S is Pull, Aim, Squeeze, Sweep — but it's a tool for trained adults on small fires, not for you.",
          },
          {
            id: "rangers-m2-l1-5",
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
        level: 2,
        questions: [
          {
            id: "rangers-m2-l2-1",
            prompt: "What's your job the moment the fire alarm sounds?",
            options: [
              { text: "Walk calmly toward the exit", correct: true },
              { text: "Grab your things first", correct: false },
              { text: "Wait to see if others move first", correct: false },
            ],
            explanation: "Moving calmly toward the exit is the job, right from the moment the alarm sounds.",
          },
          {
            id: "rangers-m2-l2-2",
            prompt: "How do you check a door before opening it fully?",
            options: [
              { text: "Touch it with the back of your hand", correct: true },
              { text: "Listen closely against it", correct: false },
              { text: "Smell around the edges", correct: false },
            ],
            explanation: "Touching with the back of your hand safely tells you if there's heat on the other side.",
          },
          {
            id: "rangers-m2-l2-3",
            prompt: "Why do you get low if you see smoke?",
            options: [
              { text: "Clean air is near the floor", correct: true },
              { text: "It just looks better", correct: false },
              { text: "It helps you move faster", correct: false },
            ],
            explanation: "Smoke rises, so the cleanest air is close to the floor.",
          },
          {
            id: "rangers-m2-l2-4",
            prompt: "Who is the PASS method actually for?",
            options: [
              { text: "Trained adults handling a small, contained fire", correct: true },
              { text: "Any student who wants to help", correct: false },
              { text: "Everyone, in every kind of fire", correct: false },
            ],
            explanation: "PASS is for trained adults on small fires only — your job is always to evacuate.",
          },
          {
            id: "rangers-m2-l2-5",
            prompt: "What does a warm door usually mean?",
            options: [
              { text: "Fire may be on the other side", correct: true },
              { text: "The heater is on nearby", correct: false },
              { text: "Nothing important", correct: false },
            ],
            explanation: "A warm door is a warning sign that fire could be right behind it.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "rangers-m2-l3-1",
            prompt: "The alarm sounds while you're mid-lesson. What's the right response?",
            options: [
              { text: "Stop what you're doing and walk calmly toward the exit", correct: true },
              { text: "Finish what you're working on first", correct: false },
              { text: "Wait for a second alarm to confirm it's real", correct: false },
            ],
            explanation: "The alarm alone is enough — stop and move toward the exit right away.",
          },
          {
            id: "rangers-m2-l3-2",
            prompt: "You touch a door and it feels warm. What's the very next step?",
            options: [
              { text: "Use the alternate exit", correct: true },
              { text: "Open it slowly to check", correct: false },
              { text: "Wait a moment and touch it again", correct: false },
            ],
            explanation: "A warm door means don't open it — go straight to the alternate exit.",
          },
          {
            id: "rangers-m2-l3-3",
            prompt: "Smoke is filling the hallway you'd normally use. What do you do?",
            options: [
              { text: "Get low and use a different route", correct: true },
              { text: "Cover your mouth and walk through fast", correct: false },
              { text: "Stop and wait for it to clear", correct: false },
            ],
            explanation: "A different route is always safer than walking through smoke, even quickly.",
          },
          {
            id: "rangers-m2-l3-4",
            prompt: "You see a fire extinguisher on the wall during an evacuation. What do you do?",
            options: [
              { text: "Keep walking to the exit — it's not your tool to use", correct: true },
              { text: "Stop and try to use it yourself", correct: false },
              { text: "Take it with you outside", correct: false },
            ],
            explanation: "The extinguisher is for trained adults — your job stays the same: evacuate.",
          },
          {
            id: "rangers-m2-l3-5",
            prompt: "Why does your teacher want you to walk in a line during a fire drill?",
            options: [
              { text: "It keeps the class moving calmly and together", correct: true },
              { text: "It just looks neater", correct: false },
              { text: "It's slower on purpose", correct: false },
            ],
            explanation: "Moving together in a calm line keeps everyone accounted for and safe.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "rangers-m2-l4-1",
            prompt: "Your usual exit has smoke near it, but the alternate exit is much farther. What do you do?",
            options: [
              { text: "Take the alternate exit anyway", correct: true },
              { text: "Take the smoky exit since it's faster", correct: false },
              { text: "Wait to see if the smoke clears", correct: false },
            ],
            explanation: "Distance matters less than safety — the alternate exit is always the right call over smoke.",
          },
          {
            id: "rangers-m2-l4-2",
            prompt: "Why shouldn't you hold your breath and walk through smoke, even briefly?",
            options: [
              { text: "Smoke can disorient you fast, holding your breath doesn't prevent that", correct: true },
              { text: "Holding your breath actually works fine", correct: false },
              { text: "It's only a problem in very thick smoke", correct: false },
            ],
            explanation: "Disorientation from smoke happens quickly, regardless of whether you're holding your breath.",
          },
          {
            id: "rangers-m2-l4-3",
            prompt: "A classmate wants to test whether a warm door is 'just a little warm, so probably fine.' What do you say?",
            options: [
              { text: "Any warmth means don't open it, use another way", correct: true },
              { text: "A little warm is probably okay", correct: false },
              { text: "Open it just a crack to check", correct: false },
            ],
            explanation: "Any warmth at all is the signal to not open the door — there's no safe amount of warm.",
          },
          {
            id: "rangers-m2-l4-4",
            prompt: "Why is \"you don't need to know where the fire is\" actually useful advice?",
            options: [
              { text: "It means you can act immediately instead of wasting time investigating", correct: true },
              { text: "It means the fire location never matters at all", correct: false },
              { text: "It's not actually useful advice", correct: false },
            ],
            explanation: "Not needing to locate the fire means you can move toward safety right away, without delay.",
          },
          {
            id: "rangers-m2-l4-5",
            prompt: "You're walking out and someone behind you is moving very slowly. What's the best response?",
            options: [
              { text: "Stay calm, keep the line moving steadily together", correct: true },
              { text: "Push past them to move faster", correct: false },
              { text: "Stop completely and wait right there", correct: false },
            ],
            explanation: "Staying calm and moving steadily together keeps the whole group safe without causing a pile-up.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "rangers-m2-l5-1",
            prompt: "You touch your usual exit door and it's cool, but you can hear a crackling sound behind it. What do you do?",
            options: [
              { text: "Trust the sound over the temperature and use the alternate exit", correct: true },
              { text: "Trust the cool temperature and open it", correct: false },
              { text: "Ignore the sound since the door feels fine", correct: false },
            ],
            explanation: "Any warning sign — sound or heat — is reason enough to choose the alternate exit.",
          },
          {
            id: "rangers-m2-l5-2",
            prompt: "Why is \"evacuate and let responders handle the fire\" the right rule even for a fire that looks small?",
            options: [
              { text: "A fire's size can be hard to judge accurately, and it can grow fast", correct: true },
              { text: "Small fires are never actually dangerous", correct: false },
              { text: "The rule only applies to large fires", correct: false },
            ],
            explanation: "Judging fire size accurately is hard, and even a small fire can grow quickly — evacuation is always the safe default.",
          },
          {
            id: "rangers-m2-l5-3",
            prompt: "Two classmates argue: one says wait by the exit for stragglers, one says keep moving outside. Who's right?",
            options: [
              { text: "Keep moving outside — stopping near the building isn't safer", correct: true },
              { text: "Wait by the exit for everyone", correct: false },
              { text: "Both are equally fine", correct: false },
            ],
            explanation: "Moving all the way outside to the meeting spot is safer than lingering near the building.",
          },
          {
            id: "rangers-m2-l5-4",
            prompt: "Why does \"touch the door, don't just look at it\" matter as a safety check?",
            options: [
              { text: "Heat isn't always visible, but it's a reliable warning sign", correct: true },
              { text: "Looking at a door tells you everything you need to know", correct: false },
              { text: "It doesn't actually matter which method you use", correct: false },
            ],
            explanation: "You can't see heat, but you can feel it — that's why touching the door matters more than just looking.",
          },
          {
            id: "rangers-m2-l5-5",
            prompt: "What's the underlying reason every single fire rule points toward \"evacuate, don't investigate\"?",
            options: [
              { text: "You can't reliably judge fire danger from a distance, so treating any sign as serious is safest", correct: true },
              { text: "Investigating is only risky for younger students", correct: false },
              { text: "There isn't really a shared reason behind the rules", correct: false },
            ],
            explanation: "Every fire rule shares the same logic: since you can't safely judge how dangerous a sign really is, treat it as serious and evacuate.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "rangers-m3",
    name: "Know Your Building: Exit Mapping",
    icon: "🗺️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "rangers-m3-l1-1",
            prompt: "Every classroom should have how many exits you know?",
            options: [
              { text: "Two — a primary and a backup", correct: true },
              { text: "Just one, the main door", correct: false },
              { text: "None — you just follow the crowd", correct: false },
            ],
            explanation: "Knowing both a primary and a backup exit means you always have a plan if one is blocked.",
          },
          {
            id: "rangers-m3-l1-2",
            prompt: "Which of these means a route is blocked?",
            options: [
              { text: "Smoke, fire, water on the floor, or a stopped crowd", correct: true },
              { text: "A door that's simply closed", correct: false },
              { text: "A hallway that's a little dark", correct: false },
            ],
            explanation: "Fire, smoke, water, or a crowd that's stopped moving all mean that route is closed to you.",
          },
          {
            id: "rangers-m3-l1-3",
            prompt: "You see smoke coming from under a door on your usual route. What do you do?",
            options: [
              { text: "Use your backup exit and tell your teacher", correct: true },
              { text: "Open the door to check how bad it is", correct: false },
              { text: "Wait by the door until someone else decides", correct: false },
            ],
            explanation: "Smoke under a door already tells you the route is blocked — no need to open it and check.",
          },
          {
            id: "rangers-m3-l1-4",
            prompt: "Why should you know where your class meets outside?",
            options: [
              { text: "So your teacher can be sure everyone's accounted for", correct: true },
              { text: "So you can leave early", correct: false },
              { text: "It doesn't really matter", correct: false },
            ],
            explanation: "A known meeting spot is how your teacher knows everyone made it out safely.",
          },
          {
            id: "rangers-m3-l1-5",
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
        level: 2,
        questions: [
          {
            id: "rangers-m3-l2-1",
            prompt: "What's a \"backup exit\" for?",
            options: [
              { text: "Using it if your primary exit is blocked", correct: true },
              { text: "Using it whenever you feel like it", correct: false },
              { text: "It's just extra, not really needed", correct: false },
            ],
            explanation: "A backup exit gives you a real plan if your usual route is ever blocked.",
          },
          {
            id: "rangers-m3-l2-2",
            prompt: "Standing water on the floor near an exit means what?",
            options: [
              { text: "That route counts as blocked", correct: true },
              { text: "It's fine as long as you walk carefully", correct: false },
              { text: "It only matters if it's very deep", correct: false },
            ],
            explanation: "Standing water is one of the signs that means a route is blocked.",
          },
          {
            id: "rangers-m3-l2-3",
            prompt: "A crowd ahead has completely stopped moving. What does that tell you?",
            options: [
              { text: "That route may be blocked — consider another way", correct: true },
              { text: "Nothing important, just wait", correct: false },
              { text: "Push through to keep moving", correct: false },
            ],
            explanation: "A stopped crowd is one of the signals that a route may not be usable.",
          },
          {
            id: "rangers-m3-l2-4",
            prompt: "Why is knowing your meeting spot ahead of time useful?",
            options: [
              { text: "You won't have to figure it out during an actual emergency", correct: true },
              { text: "It's only useful for teachers, not students", correct: false },
              { text: "It doesn't actually help during an emergency", correct: false },
            ],
            explanation: "Knowing it ahead of time means one less thing to figure out under stress.",
          },
          {
            id: "rangers-m3-l2-5",
            prompt: "What should you do the moment you notice smoke under a door on your route?",
            options: [
              { text: "Treat that route as blocked and use the backup", correct: true },
              { text: "Open the door slightly to look", correct: false },
              { text: "Wait to see if more smoke appears", correct: false },
            ],
            explanation: "Smoke under a door is enough on its own — treat the route as blocked right away.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "rangers-m3-l3-1",
            prompt: "You're new to a classroom and haven't checked the exits yet. What should you do first?",
            options: [
              { text: "Find out where both exits are before anything happens", correct: true },
              { text: "Wait until an emergency to figure it out", correct: false },
              { text: "Assume it's the same as your last classroom", correct: false },
            ],
            explanation: "Learning your exits ahead of time means you're ready no matter what happens.",
          },
          {
            id: "rangers-m3-l3-2",
            prompt: "Your primary exit has visible fire. What's the right move?",
            options: [
              { text: "Use your backup exit immediately", correct: true },
              { text: "Wait to see if the fire goes down", correct: false },
              { text: "Try to get past it quickly", correct: false },
            ],
            explanation: "Visible fire means that route is closed — go straight to your backup.",
          },
          {
            id: "rangers-m3-l3-3",
            prompt: "You reach your backup exit and it also looks blocked by a crowd that's stopped moving. What do you do?",
            options: [
              { text: "Tell a teacher and look for another safe option", correct: true },
              { text: "Push through the crowd to get past", correct: false },
              { text: "Stand and wait without telling anyone", correct: false },
            ],
            explanation: "Telling a teacher when both routes seem blocked gets you help finding a safe option.",
          },
          {
            id: "rangers-m3-l3-4",
            prompt: "Why does a route with a little bit of smoke still count as \"blocked,\" not just \"risky\"?",
            options: [
              { text: "Any visible smoke is treated as a real hazard, not a minor one", correct: true },
              { text: "Only thick smoke actually counts as blocked", correct: false },
              { text: "Smoke doesn't really affect whether a route is safe", correct: false },
            ],
            explanation: "Any visible smoke means the route is treated as blocked, not just \"a bit risky.\"",
          },
          {
            id: "rangers-m3-l3-5",
            prompt: "What should you tell your teacher if you notice a blocked route?",
            options: [
              { text: "What you saw and which exit is affected", correct: true },
              { text: "Nothing, just quietly avoid it yourself", correct: false },
              { text: "Only mention it if someone asks", correct: false },
            ],
            explanation: "Telling your teacher what you saw helps keep the whole class informed and safe.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "rangers-m3-l4-1",
            prompt: "Your primary exit looks fine, but you haven't actually checked your backup exit in a while. What should you do?",
            options: [
              { text: "Make sure you still know where the backup exit is", correct: true },
              { text: "Assume it's still the same as before", correct: false },
              { text: "Ignore it since you probably won't need it", correct: false },
            ],
            explanation: "Knowing your backup exit is worth keeping current, since you may genuinely need it someday.",
          },
          {
            id: "rangers-m3-l4-2",
            prompt: "Why does \"a route counts as blocked if it shows a hazard\" matter more than waiting for someone to confirm it?",
            options: [
              { text: "Waiting for confirmation wastes time you might not have", correct: true },
              { text: "Confirmation is always available quickly anyway", correct: false },
              { text: "It doesn't actually matter which you do", correct: false },
            ],
            explanation: "Acting on what you can see, rather than waiting for confirmation, saves time you may not have.",
          },
          {
            id: "rangers-m3-l4-3",
            prompt: "A hallway looks a little dark, but you don't see fire, smoke, or water. Is it blocked?",
            options: [
              { text: "No — dim lighting alone doesn't mean blocked", correct: true },
              { text: "Yes, any unusual sign means blocked", correct: false },
              { text: "Only if it's completely dark", correct: false },
            ],
            explanation: "Dim lighting alone isn't one of the actual hazard signs — fire, smoke, water, or a stopped crowd are.",
          },
          {
            id: "rangers-m3-l4-4",
            prompt: "Why is knowing exits \"before any emergency\" different from knowing them \"during\" one?",
            options: [
              { text: "During an emergency, you have far less time to figure things out calmly", correct: true },
              { text: "There's actually no real difference", correct: false },
              { text: "Knowing them during an emergency is always just as easy", correct: false },
            ],
            explanation: "Preparation ahead of time removes the pressure of figuring it out in the moment.",
          },
          {
            id: "rangers-m3-l4-5",
            prompt: "You and a friend both know different exits are best. What's the safest way to decide?",
            options: [
              { text: "Check current conditions and use whichever is actually clear", correct: true },
              { text: "Whoever is more confident is automatically right", correct: false },
              { text: "Flip a coin between the two", correct: false },
            ],
            explanation: "Current conditions — not confidence or guessing — should decide which exit is actually safe right now.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "rangers-m3-l5-1",
            prompt: "Both your primary and backup exits show hazard signs. What's the right move?",
            options: [
              { text: "Tell a teacher immediately and look for a safe place to wait", correct: true },
              { text: "Pick whichever one looks slightly less bad", correct: false },
              { text: "Wait exactly where you are and do nothing", correct: false },
            ],
            explanation: "When both known exits are unsafe, getting a teacher involved and finding safety beats guessing between two bad options.",
          },
          {
            id: "rangers-m3-l5-2",
            prompt: "Why is memorizing your exits considered part of being ready, not just something that happens automatically?",
            options: [
              { text: "You have to deliberately learn and remember them ahead of time", correct: true },
              { text: "Everyone naturally knows their exits without trying", correct: false },
              { text: "It only matters for teachers to know, not students", correct: false },
            ],
            explanation: "Knowing your exits takes deliberate preparation — it's not something you pick up automatically.",
          },
          {
            id: "rangers-m3-l5-3",
            prompt: "A younger student doesn't know their exits. What's the most helpful thing you could do?",
            options: [
              { text: "Help point out both exits so they know for next time", correct: true },
              { text: "Assume it's not your job to help", correct: false },
              { text: "Tell them to figure it out during an emergency", correct: false },
            ],
            explanation: "Sharing what you know about the exits helps everyone around you be more prepared too.",
          },
          {
            id: "rangers-m3-l5-4",
            prompt: "Why does the definition of \"blocked\" stay the same no matter which hazard caused it — fire, water, or a stopped crowd?",
            options: [
              { text: "The response is the same either way: don't use that route", correct: true },
              { text: "Different hazards actually need completely different definitions", correct: false },
              { text: "Only fire actually counts as truly blocking a route", correct: false },
            ],
            explanation: "Whatever the specific hazard, the correct response is identical — treat the route as closed and use another.",
          },
          {
            id: "rangers-m3-l5-5",
            prompt: "What's the real value of knowing a shelter spot on your floor, even if you never expect to need it?",
            options: [
              { text: "It gives you a real plan if both exits are ever genuinely blocked", correct: true },
              { text: "It's not actually useful information", correct: false },
              { text: "Only wardens need to know about shelter spots", correct: false },
            ],
            explanation: "Knowing a shelter option means you have an answer even in the rare case both exits fail.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "rangers-m4",
    name: "Chemical Spill: Stay Back, Tell an Adult",
    icon: "🧪",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "rangers-m4-l1-1",
            prompt: "You notice a strange smell and a puddle near the sink. What do you do?",
            options: [
              { text: "Step away and tell your teacher immediately", correct: true },
              { text: "Get closer to see what spilled", correct: false },
              { text: "Wipe it up yourself with a paper towel", correct: false },
            ],
            explanation: "Stepping away and telling a teacher is always the right call with something you can't identify.",
          },
          {
            id: "rangers-m4-l1-2",
            prompt: "Should you ever sniff or touch an unknown spill to figure out what it is?",
            options: [
              { text: "No, never", correct: true },
              { text: "Yes, just a quick sniff is fine", correct: false },
              { text: "Only if it looks harmless", correct: false },
            ],
            explanation: "You can't tell if something is dangerous by smell or touch — always leave identification to trained adults.",
          },
          {
            id: "rangers-m4-l1-3",
            prompt: "Fumes are coming from your usual exit hallway. What do you do?",
            options: [
              { text: "Use the alternate exit, even if it's farther", correct: true },
              { text: "Hold your breath and walk through fast", correct: false },
              { text: "Wait for the fumes to clear before moving", correct: false },
            ],
            explanation: "Walking through unknown fumes risks your health immediately — the alternate exit is always worth the extra distance.",
          },
          {
            id: "rangers-m4-l1-4",
            prompt: "A strange smell in a science room means what?",
            options: [
              { text: "Tell an adult right away and step back", correct: true },
              { text: "Try to identify the chemical yourself", correct: false },
              { text: "Ignore it if class is about to end anyway", correct: false },
            ],
            explanation: "Any strange smell or spill gets the same response: tell an adult and step back.",
          },
          {
            id: "rangers-m4-l1-5",
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
        level: 2,
        questions: [
          {
            id: "rangers-m4-l2-1",
            prompt: "What's the very first thing to do if you spot an unknown spill?",
            options: [
              { text: "Step back away from it", correct: true },
              { text: "Take a photo of it first", correct: false },
              { text: "Ask a classmate what they think it is", correct: false },
            ],
            explanation: "Stepping back keeps you safe while you figure out who to tell.",
          },
          {
            id: "rangers-m4-l2-2",
            prompt: "Why shouldn't you try to clean up a spill yourself, even with a paper towel?",
            options: [
              { text: "You don't know what it is or how it might react", correct: true },
              { text: "Cleaning is only a teacher's job in general", correct: false },
              { text: "Paper towels never work on spills", correct: false },
            ],
            explanation: "Not knowing what the substance is means cleaning it yourself could be genuinely unsafe.",
          },
          {
            id: "rangers-m4-l2-3",
            prompt: "Fumes are near your normal exit. What matters more — speed or safety?",
            options: [
              { text: "Safety — take the alternate route", correct: true },
              { text: "Speed — take the fastest route regardless", correct: false },
              { text: "Neither matters much here", correct: false },
            ],
            explanation: "Safety comes first — the extra time using an alternate route is always worth it.",
          },
          {
            id: "rangers-m4-l2-4",
            prompt: "You're not sure if a smell is \"strange enough\" to report. What should you do?",
            options: [
              { text: "Report it anyway", correct: true },
              { text: "Only report it if you're completely sure", correct: false },
              { text: "Wait to see if anyone else notices first", correct: false },
            ],
            explanation: "It's always better to report something uncertain than to stay quiet about a real hazard.",
          },
          {
            id: "rangers-m4-l2-5",
            prompt: "Why is identifying chemicals left to trained adults specifically?",
            options: [
              { text: "They have training and equipment students don't have", correct: true },
              { text: "Adults are simply older, not more trained", correct: false },
              { text: "There's no real reason, it's just tradition", correct: false },
            ],
            explanation: "Training and proper equipment are what make it safe for adults to identify chemicals — students don't have either.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "rangers-m4-l3-1",
            prompt: "You're walking past the science room and notice an unusual smell coming from inside. What do you do?",
            options: [
              { text: "Tell a teacher what you noticed", correct: true },
              { text: "Go inside to check it out", correct: false },
              { text: "Ignore it since it's not your classroom", correct: false },
            ],
            explanation: "Telling a teacher applies no matter whose classroom the smell is coming from.",
          },
          {
            id: "rangers-m4-l3-2",
            prompt: "A classmate got a small splash of an unknown liquid on their sleeve. What's the right response?",
            options: [
              { text: "Tell a teacher right away", correct: true },
              { text: "Tell them to just wipe it off and continue", correct: false },
              { text: "Wait to see if it causes a problem", correct: false },
            ],
            explanation: "Any contact with an unknown chemical, even on clothing, is worth reporting immediately.",
          },
          {
            id: "rangers-m4-l3-3",
            prompt: "Why shouldn't you wait until you're \"completely sure\" before reporting a spill?",
            options: [
              { text: "Waiting for certainty can delay help you might genuinely need", correct: true },
              { text: "Being sure doesn't actually matter either way", correct: false },
              { text: "Adults prefer to only hear about confirmed problems", correct: false },
            ],
            explanation: "Reporting early, even without full certainty, gives adults the best chance to respond in time.",
          },
          {
            id: "rangers-m4-l3-4",
            prompt: "You see a spill but no strange smell. Should you still be cautious?",
            options: [
              { text: "Yes — not all spills have a noticeable smell", correct: true },
              { text: "No, only smelly spills matter", correct: false },
              { text: "Only if it's a large puddle", correct: false },
            ],
            explanation: "Some chemicals don't have a strong smell — the spill itself is enough reason to be cautious.",
          },
          {
            id: "rangers-m4-l3-5",
            prompt: "What should you do while waiting for an adult to arrive after reporting a spill?",
            options: [
              { text: "Stay back and keep others away from it too", correct: true },
              { text: "Stand right next to it to guard the spot", correct: false },
              { text: "Go back to what you were doing nearby", correct: false },
            ],
            explanation: "Staying back and keeping others away protects everyone until help arrives.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "rangers-m4-l4-1",
            prompt: "Someone says a spill \"probably just water\" so it's fine to walk through. What's the safe response?",
            options: [
              { text: "Treat it as unknown until an adult confirms it", correct: true },
              { text: "Trust the guess and walk through", correct: false },
              { text: "Only avoid it if it smells bad", correct: false },
            ],
            explanation: "\"Probably water\" is still a guess — treating any unidentified liquid as unknown is the safe default.",
          },
          {
            id: "rangers-m4-l4-2",
            prompt: "Why does \"never lean in to sniff it\" apply even to a spill that looks completely clear?",
            options: [
              { text: "You can't tell how dangerous a chemical is just by how it looks", correct: true },
              { text: "Clear liquids are always safe to smell", correct: false },
              { text: "The rule is only about colored liquids", correct: false },
            ],
            explanation: "Appearance alone doesn't tell you whether something is dangerous — the rule applies to any unknown spill.",
          },
          {
            id: "rangers-m4-l4-3",
            prompt: "Your usual exit has fumes, but it's much closer than the alternate. Which matters more?",
            options: [
              { text: "Using the alternate exit, despite the extra distance", correct: true },
              { text: "Using the closer exit to save time", correct: false },
              { text: "Waiting exactly where you are", correct: false },
            ],
            explanation: "The extra distance to the alternate exit is always worth it compared to walking through unknown fumes.",
          },
          {
            id: "rangers-m4-l4-4",
            prompt: "Why might a spill be dangerous even if nobody touches it directly?",
            options: [
              { text: "Fumes from it can affect people nearby without direct contact", correct: true },
              { text: "Spills are only dangerous through direct touch", correct: false },
              { text: "There's no danger unless someone steps in it", correct: false },
            ],
            explanation: "Fumes alone can be a health risk, which is why keeping distance matters even without touching the spill.",
          },
          {
            id: "rangers-m4-l4-5",
            prompt: "What's the shared idea behind every chemical-spill rule you've learned?",
            options: [
              { text: "Distance and reporting are always safer than investigating yourself", correct: true },
              { text: "Every spill needs a different, special response", correct: false },
              { text: "Only reporting matters, distance doesn't", correct: false },
            ],
            explanation: "Every rule points the same direction: keep your distance and let a trained adult handle it.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "rangers-m4-l5-1",
            prompt: "You notice a spill, tell a teacher, but they seem to not have heard you clearly. What do you do?",
            options: [
              { text: "Make sure they've understood, or tell another adult", correct: true },
              { text: "Assume you did your part and move on", correct: false },
              { text: "Handle it yourself since no one responded", correct: false },
            ],
            explanation: "Confirming an adult actually understood the report matters more than just having said something once.",
          },
          {
            id: "rangers-m4-l5-2",
            prompt: "Why does treating every unidentified spill the same way — step back, report — work better than judging each one individually?",
            options: [
              { text: "You genuinely can't judge chemical danger accurately without training", correct: true },
              { text: "It's simpler, even though judging each one would be more accurate", correct: false },
              { text: "It doesn't actually work better, it's just a rule", correct: false },
            ],
            explanation: "Without training, you can't reliably tell which spills are dangerous — treating all of them the same way is the only safe approach.",
          },
          {
            id: "rangers-m4-l5-3",
            prompt: "A younger student almost touches an unknown spill out of curiosity. What's the best thing to do?",
            options: [
              { text: "Stop them calmly and tell an adult", correct: true },
              { text: "Let them touch it, it's probably fine", correct: false },
              { text: "Warn them but not follow up further", correct: false },
            ],
            explanation: "Stopping them and telling an adult protects the younger student and gets the spill properly handled.",
          },
          {
            id: "rangers-m4-l5-4",
            prompt: "Why is \"step away and tell an adult\" a complete plan on its own, without needing to know what the chemical is?",
            options: [
              { text: "The correct response doesn't depend on identifying the chemical first", correct: true },
              { text: "You should always identify it before doing anything else", correct: false },
              { text: "It's only a complete plan for certain chemicals", correct: false },
            ],
            explanation: "The safe response — distance plus reporting — works regardless of what the chemical actually turns out to be.",
          },
          {
            id: "rangers-m4-l5-5",
            prompt: "What makes chemical spills different from hazards like fire or water, in terms of how you can judge the danger?",
            options: [
              { text: "You often can't tell how dangerous a chemical is just by looking at it", correct: true },
              { text: "Chemical spills are actually easier to judge than fire", correct: false },
              { text: "There's no real difference in how you judge them", correct: false },
            ],
            explanation: "Fire and water are visibly dangerous, but a chemical's danger often isn't obvious just from looking — that's exactly why the rule is always report, never investigate.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "rangers-m5",
    name: "Cyclone & Flood: Stay In, Stay Up",
    icon: "🌊",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "rangers-m5-l1-1",
            prompt: "A cyclone warning is active. Where should you be?",
            options: [
              { text: "Inside, in an interior room away from windows", correct: true },
              { text: "Outside, watching from a safe distance", correct: false },
              { text: "Near a window so you can see incoming debris", correct: false },
            ],
            explanation: "Flying debris is the biggest cyclone danger — staying inside, away from windows, is the plan.",
          },
          {
            id: "rangers-m5-l1-2",
            prompt: "Water is coming in under the door during a cyclone. What do you do?",
            options: [
              { text: "Move to a higher floor and tell an adult", correct: true },
              { text: "Step outside to check how deep it is", correct: false },
              { text: "Try to block it with towels and stay put", correct: false },
            ],
            explanation: "Rising water plus an active cyclone means getting higher and telling an adult, not investigating outside.",
          },
          {
            id: "rangers-m5-l1-3",
            prompt: "Why is moving water dangerous even if it looks shallow?",
            options: [
              { text: "It can hide strong currents or electrical hazards", correct: true },
              { text: "It's actually never dangerous if it's shallow", correct: false },
              { text: "It only matters if it's above your knees", correct: false },
            ],
            explanation: "Shallow-looking water can still hide currents or live electrical hazards underneath.",
          },
          {
            id: "rangers-m5-l1-4",
            prompt: "Shaking just stopped and you smell gas near the exit, but the alarm hasn't sounded. What do you do?",
            options: [
              { text: "Avoid light switches, move away using a different route, and tell a teacher immediately", correct: true },
              { text: "Flip the hallway light on to see better", correct: false },
              { text: "Wait for the alarm before doing anything", correct: false },
            ],
            explanation: "A gas smell is reason enough to act immediately — a light switch can spark right next to a leak, and the alarm not sounding doesn't mean it's safe.",
          },
          {
            id: "rangers-m5-l1-5",
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
      {
        level: 2,
        questions: [
          {
            id: "rangers-m5-l2-1",
            prompt: "What's the safest kind of room during a cyclone?",
            options: [
              { text: "An interior room with no windows", correct: true },
              { text: "A room with a large window view", correct: false },
              { text: "The rooftop, for a better vantage point", correct: false },
            ],
            explanation: "An interior room without windows keeps flying debris away from you.",
          },
          {
            id: "rangers-m5-l2-2",
            prompt: "Water starts entering the ground floor. What's the right move?",
            options: [
              { text: "Move up to a higher floor", correct: true },
              { text: "Stay on the ground floor and wait", correct: false },
              { text: "Go outside to see the source", correct: false },
            ],
            explanation: "Moving higher keeps you away from rising water on the ground floor.",
          },
          {
            id: "rangers-m5-l2-3",
            prompt: "What can moving water hide, even if it looks calm?",
            options: [
              { text: "Strong currents or electrical hazards", correct: true },
              { text: "Nothing, calm water is always safe", correct: false },
              { text: "Only leaves and debris", correct: false },
            ],
            explanation: "Even calm-looking water can hide dangerous currents or live electrical hazards.",
          },
          {
            id: "rangers-m5-l2-4",
            prompt: "You smell gas after shaking stops. Should you flip a light switch to see better?",
            options: [
              { text: "No, never near a gas smell", correct: true },
              { text: "Yes, if the hallway is dark", correct: false },
              { text: "Only briefly", correct: false },
            ],
            explanation: "A light switch can create a spark right next to a gas leak — never use one when you smell gas.",
          },
          {
            id: "rangers-m5-l2-5",
            prompt: "Why should you stay alert even after the \"first\" danger seems to pass?",
            options: [
              { text: "A second hazard can follow the first one", correct: true },
              { text: "Nothing else can happen once the first danger is over", correct: false },
              { text: "It doesn't really matter after the first hazard", correct: false },
            ],
            explanation: "Multi-hazard situations happen — staying alert after the first danger can catch a second one early.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "rangers-m5-l3-1",
            prompt: "The wind outside sounds very strong. What's your first move?",
            options: [
              { text: "Head to an interior room away from windows", correct: true },
              { text: "Go check how strong it really is", correct: false },
              { text: "Wait near a window to watch", correct: false },
            ],
            explanation: "Strong wind means heading to a safe interior room right away.",
          },
          {
            id: "rangers-m5-l3-2",
            prompt: "You need to cross a hallway with a small amount of water on the floor during a flood warning. What do you do?",
            options: [
              { text: "Avoid it and find another way, or wait for an adult", correct: true },
              { text: "Walk through quickly since it's shallow", correct: false },
              { text: "Test it with your foot first", correct: false },
            ],
            explanation: "Even a small amount of water during a flood warning should be avoided — its depth and hazards aren't obvious.",
          },
          {
            id: "rangers-m5-l3-3",
            prompt: "A cyclone warning is active and you're on a lower floor with rising water nearby. What's the plan?",
            options: [
              { text: "Move higher and tell an adult", correct: true },
              { text: "Stay exactly where you are", correct: false },
              { text: "Go check the water's source", correct: false },
            ],
            explanation: "Moving higher and alerting an adult addresses both the cyclone and the rising water at once.",
          },
          {
            id: "rangers-m5-l3-4",
            prompt: "You smell gas near an exit after an earthquake, and no alarm has sounded. What's the correct sequence?",
            options: [
              { text: "Avoid switches, move away a different way, tell an adult now", correct: true },
              { text: "Wait for the alarm first", correct: false },
              { text: "Flip on lights to see where the smell is coming from", correct: false },
            ],
            explanation: "The gas smell alone is enough to act immediately, without waiting for an alarm.",
          },
          {
            id: "rangers-m5-l3-5",
            prompt: "Why might a single emergency actually involve more than one hazard?",
            options: [
              { text: "One hazard, like an earthquake, can trigger another, like a gas leak", correct: true },
              { text: "Multiple hazards never really happen together", correct: false },
              { text: "It's rare enough to not think about", correct: false },
            ],
            explanation: "Hazards can trigger each other — staying alert to a second one is part of handling an emergency well.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "rangers-m5-l4-1",
            prompt: "The cyclone wind suddenly goes quiet. Is it safe to go check outside?",
            options: [
              { text: "No — a lull can happen mid-storm, stay inside", correct: true },
              { text: "Yes, quiet wind means it's over", correct: false },
              { text: "Only for a very quick look", correct: false },
            ],
            explanation: "A sudden quiet moment doesn't mean the storm has ended — stay inside until told it's safe.",
          },
          {
            id: "rangers-m5-l4-2",
            prompt: "Why is \"never walk through moving water\" true even for water that only looks a few centimeters deep?",
            options: [
              { text: "Even shallow moving water can hide hazards or knock you off balance", correct: true },
              { text: "Shallow water is always completely safe", correct: false },
              { text: "It's only a rule for deep water", correct: false },
            ],
            explanation: "Depth alone doesn't tell you what's hidden in moving water — treat any of it as a hazard.",
          },
          {
            id: "rangers-m5-l4-3",
            prompt: "Water is rising on the ground floor, but a friend says \"let's just wait it out here.\" What's the better plan?",
            options: [
              { text: "Move to a higher floor instead of waiting on the ground floor", correct: true },
              { text: "Wait it out on the ground floor together", correct: false },
              { text: "Go check the water outside", correct: false },
            ],
            explanation: "Moving higher addresses the actual rising-water risk — waiting on the ground floor doesn't.",
          },
          {
            id: "rangers-m5-l4-4",
            prompt: "Why does a gas smell near an exit matter even if you can't see or hear anything unusual otherwise?",
            options: [
              { text: "Smell alone is a reliable enough warning sign to act on", correct: true },
              { text: "Smell alone never means anything is actually wrong", correct: false },
              { text: "You should wait for a visible sign too", correct: false },
            ],
            explanation: "A gas smell by itself is enough of a warning — you don't need additional signs to act.",
          },
          {
            id: "rangers-m5-l4-5",
            prompt: "Why does \"stay alert for a second hazard\" apply even right after you've just handled the first one successfully?",
            options: [
              { text: "Successfully handling one hazard doesn't mean a second one can't follow", correct: true },
              { text: "Once one hazard is handled, nothing else can go wrong", correct: false },
              { text: "It only applies before you've handled the first hazard", correct: false },
            ],
            explanation: "Handling the first hazard well doesn't rule out a second one — staying alert continues afterward too.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "rangers-m5-l5-1",
            prompt: "You're on a middle floor. A cyclone warning is active, water is rising below, and it's unclear if going up or staying put is better. What's the right call?",
            options: [
              { text: "Move higher and away from windows, and tell an adult what you're seeing", correct: true },
              { text: "Stay exactly on your current floor no matter what", correct: false },
              { text: "Go check the ground floor to assess the water", correct: false },
            ],
            explanation: "Moving higher and away from windows addresses both hazards at once, and telling an adult keeps them informed too.",
          },
          {
            id: "rangers-m5-l5-2",
            prompt: "Why does \"a lull might be the eye of the storm\" matter even for a cyclone you were told would be a mild one?",
            options: [
              { text: "A storm's true strength can be uncertain, so the same caution applies", correct: true },
              { text: "It only matters for storms confirmed to be severe", correct: false },
              { text: "Mild storms never have a real eye of the storm", correct: false },
            ],
            explanation: "You can't be fully certain how a storm will behave, so treating every lull with the same caution is the safer approach.",
          },
          {
            id: "rangers-m5-l5-3",
            prompt: "Why is \"never walk through moving water\" true even if you're a strong swimmer?",
            options: [
              { text: "The danger comes from hidden hazards and current, not swimming ability", correct: true },
              { text: "Strong swimmers are actually safe to cross moving water", correct: false },
              { text: "It's only a rule for people who can't swim well", correct: false },
            ],
            explanation: "Swimming skill doesn't protect against hidden drop-offs or electrical hazards — the rule applies to everyone.",
          },
          {
            id: "rangers-m5-l5-4",
            prompt: "After an earthquake, you notice a gas smell AND a cracked wall near your exit. What's the right sequence?",
            options: [
              { text: "Avoid both hazards, use a different route, and alert an adult right away", correct: true },
              { text: "Deal with the crack first, then worry about the smell", correct: false },
              { text: "Investigate which hazard is worse before deciding", correct: false },
            ],
            explanation: "With two hazards present, avoiding both and alerting an adult is safer than weighing which one matters more.",
          },
          {
            id: "rangers-m5-l5-5",
            prompt: "What's the common thread between the cyclone, flood, and gas-leak rules you've learned in this module?",
            options: [
              { text: "Acting on what you can currently see or smell, without waiting for full certainty", correct: true },
              { text: "Each hazard actually requires a completely unrelated response", correct: false },
              { text: "Waiting for an adult's permission before doing anything at all", correct: false },
            ],
            explanation: "Every rule in this module comes back to the same idea: act on what you notice right now, rather than waiting for certainty.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "rangers-m6",
    name: "Multi-Hazard Drill: When Plans Change",
    icon: "⚠️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "rangers-m6-l1-1",
            prompt: "Why do multi-hazard drills exist?",
            options: [
              { text: "One emergency can lead to another, like a quake causing a gas smell", correct: true },
              { text: "They're just extra practice with no real reason", correct: false },
              { text: "Only for very large schools", correct: false },
            ],
            explanation: "Multi-hazard drills train you to stay alert even after the first danger seems over.",
          },
          {
            id: "rangers-m6-l1-2",
            prompt: "After shaking stops, you smell gas. What should you avoid touching?",
            options: [
              { text: "Light switches", correct: true },
              { text: "Door handles", correct: false },
              { text: "Your own bag", correct: false },
            ],
            explanation: "Light switches can create a spark right next to a gas leak.",
          },
          {
            id: "rangers-m6-l1-3",
            prompt: "You smell gas near the exit and the alarm hasn't sounded. Do you wait for it?",
            options: [
              { text: "No, act right away", correct: true },
              { text: "Yes, always wait for the alarm", correct: false },
              { text: "Only if the smell gets stronger", correct: false },
            ],
            explanation: "The smell alone is reason enough to act — you don't need to wait for the alarm.",
          },
          {
            id: "rangers-m6-l1-4",
            prompt: "What should you do if you notice a second hazard after handling the first one?",
            options: [
              { text: "Tell an adult and adjust your plan", correct: true },
              { text: "Ignore it since you already handled one hazard", correct: false },
              { text: "Assume someone else already noticed", correct: false },
            ],
            explanation: "Telling an adult and adjusting your plan is exactly what a multi-hazard situation calls for.",
          },
          {
            id: "rangers-m6-l1-5",
            prompt: "Why should you move away from a gas smell using a different route rather than the closest one?",
            options: [
              { text: "The closest route might be right where the smell is coming from", correct: true },
              { text: "Different routes are always faster", correct: false },
              { text: "It doesn't actually matter which route you choose", correct: false },
            ],
            explanation: "Moving away from the smell means avoiding the route closest to where the gas actually is.",
          },
        ],
      },
      {
        level: 2,
        questions: [
          {
            id: "rangers-m6-l2-1",
            prompt: "What's an example of one hazard leading to another?",
            options: [
              { text: "An earthquake causing a gas leak", correct: true },
              { text: "A fire drill happening on a sunny day", correct: false },
              { text: "Two students both feeling nervous", correct: false },
            ],
            explanation: "An earthquake triggering a gas leak is a classic example of a multi-hazard situation.",
          },
          {
            id: "rangers-m6-l2-2",
            prompt: "What should you do with flames or lighters if you smell gas?",
            options: [
              { text: "Never use them", correct: true },
              { text: "Use them carefully to see better", correct: false },
              { text: "It doesn't matter either way", correct: false },
            ],
            explanation: "Any open flame near a gas leak is a serious ignition risk — never use one.",
          },
          {
            id: "rangers-m6-l2-3",
            prompt: "Should you assume danger is over just because the \"first\" hazard has passed?",
            options: [
              { text: "No, stay alert for a second one", correct: true },
              { text: "Yes, danger only comes once", correct: false },
              { text: "Only during drills, not real emergencies", correct: false },
            ],
            explanation: "Staying alert after the first hazard is exactly what multi-hazard training is about.",
          },
          {
            id: "rangers-m6-l2-4",
            prompt: "Who should you tell if you notice a second hazard, like a gas smell after shaking?",
            options: [
              { text: "A teacher or adult, right away", correct: true },
              { text: "Only your closest friend", correct: false },
              { text: "No one, just handle it yourself", correct: false },
            ],
            explanation: "Telling a teacher or adult right away means the hazard gets handled properly.",
          },
          {
            id: "rangers-m6-l2-5",
            prompt: "What matters more when a second hazard appears: your original plan, or the new situation?",
            options: [
              { text: "The new situation — adjust your plan", correct: true },
              { text: "Your original plan, no matter what", correct: false },
              { text: "Neither matters much", correct: false },
            ],
            explanation: "Re-checking your plan against the current situation is the whole point of multi-hazard training.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "rangers-m6-l3-1",
            prompt: "Shaking has just stopped and you're about to head to your usual exit. You notice a faint gas smell there. What do you do?",
            options: [
              { text: "Change your route and tell an adult", correct: true },
              { text: "Use the usual exit anyway since it's closest", correct: false },
              { text: "Wait exactly where you are and do nothing", correct: false },
            ],
            explanation: "Noticing the smell means changing your plan on the spot — the usual exit isn't automatically still safe.",
          },
          {
            id: "rangers-m6-l3-2",
            prompt: "A fire drill and a real storm happen to overlap. What should guide your response?",
            options: [
              { text: "Follow instructions for whichever hazard is actually happening", correct: true },
              { text: "Only follow the fire drill since it started first", correct: false },
              { text: "Ignore both until things calm down", correct: false },
            ],
            explanation: "Responding to the actual, current hazards matters more than which one started first.",
          },
          {
            id: "rangers-m6-l3-3",
            prompt: "Why does a gas smell near an exit change your evacuation plan, even mid-evacuation?",
            options: [
              { text: "A new hazard means your route needs to be re-checked", correct: true },
              { text: "You should never change plans once you've started moving", correct: false },
              { text: "Gas smells don't actually require any change", correct: false },
            ],
            explanation: "A newly discovered hazard is exactly the kind of thing that should update your plan, even mid-evacuation.",
          },
          {
            id: "rangers-m6-l3-4",
            prompt: "Why doesn't waiting for the alarm make sense once you've already smelled gas?",
            options: [
              { text: "The smell itself is already enough information to act on", correct: true },
              { text: "The alarm always goes off before any smell appears", correct: false },
              { text: "You should never act without the alarm, ever", correct: false },
            ],
            explanation: "The smell is a direct warning sign — there's no reason to wait for a separate confirmation.",
          },
          {
            id: "rangers-m6-l3-5",
            prompt: "What's the main skill this module is training, more than any single hazard fact?",
            options: [
              { text: "Noticing when conditions change and adjusting your plan", correct: true },
              { text: "Memorizing one fixed plan for every situation", correct: false },
              { text: "Reacting as fast as possible without checking anything", correct: false },
            ],
            explanation: "Staying observant and willing to adjust is the core skill multi-hazard training builds.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "rangers-m6-l4-1",
            prompt: "You're mid-evacuation from a fire drill when you notice a strange smell that could be gas. What do you do?",
            options: [
              { text: "Reroute away from the smell and tell an adult, without stopping the evacuation", correct: true },
              { text: "Stop the evacuation entirely to investigate the smell", correct: false },
              { text: "Ignore it since you're already handling the fire drill", correct: false },
            ],
            explanation: "Adjusting your route while still evacuating handles both hazards without needlessly stopping.",
          },
          {
            id: "rangers-m6-l4-2",
            prompt: "Why is \"don't touch light switches near a gas smell\" a rule that applies even in a well-lit hallway?",
            options: [
              { text: "The spark risk exists regardless of how well-lit the hallway already is", correct: true },
              { text: "It only matters in dark hallways", correct: false },
              { text: "Lighting has nothing to do with the rule", correct: false },
            ],
            explanation: "The danger is the spark, not the lighting — the rule applies no matter how bright the hallway already is.",
          },
          {
            id: "rangers-m6-l4-3",
            prompt: "A classmate says \"we already checked for hazards once, we're done.\" What's the issue with that thinking?",
            options: [
              { text: "A new hazard can appear after the first check", correct: true },
              { text: "Nothing — one check is always enough", correct: false },
              { text: "Checking twice is actually against the rules", correct: false },
            ],
            explanation: "Conditions can change, which is exactly why staying alert doesn't stop after one check.",
          },
          {
            id: "rangers-m6-l4-4",
            prompt: "Why does telling an adult about a second hazard matter even if you've already started handling it yourself?",
            options: [
              { text: "Adults can coordinate a wider response than you can alone", correct: true },
              { text: "Telling an adult is only needed if you haven't done anything yet", correct: false },
              { text: "It doesn't actually add anything useful", correct: false },
            ],
            explanation: "An adult can act on a wider scale — telling them matters even if you've already started reacting yourself.",
          },
          {
            id: "rangers-m6-l4-5",
            prompt: "What makes \"re-checking your plan\" different from \"panicking and changing everything randomly\"?",
            options: [
              { text: "Re-checking is based on what you actually observe, not just fear", correct: true },
              { text: "There's no real difference between the two", correct: false },
              { text: "Panicking is actually the safer approach", correct: false },
            ],
            explanation: "A calm re-check based on real observations is very different from reacting out of panic alone.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "rangers-m6-l5-1",
            prompt: "After an earthquake, you're leading a small group toward the usual exit when you smell gas. What's the best sequence of actions?",
            options: [
              { text: "Redirect the group away from the smell, use a different route, and tell an adult as soon as you're clear", correct: true },
              { text: "Keep going toward the usual exit since you're already close", correct: false },
              { text: "Stop the group to debate whether it's really gas", correct: false },
            ],
            explanation: "Redirecting immediately and reporting once clear avoids wasting time near a suspected hazard.",
          },
          {
            id: "rangers-m6-l5-2",
            prompt: "Why does this module emphasize gas leaks and fires \"combining\" with earthquakes, specifically?",
            options: [
              { text: "Earthquakes commonly damage gas lines or wiring, creating a realistic second hazard", correct: true },
              { text: "It's a completely random example with no real basis", correct: false },
              { text: "Gas leaks and fires never actually relate to earthquakes", correct: false },
            ],
            explanation: "Earthquake damage to gas lines or wiring is a realistic way one hazard leads directly to another.",
          },
          {
            id: "rangers-m6-l5-3",
            prompt: "Why would \"just get out\" as a single instinct sometimes be worse than following the full sequence (protect yourself, reassess, check for a second hazard, then act)?",
            options: [
              { text: "Skipping straight to \"get out\" can mean moving straight into a second, undetected hazard", correct: true },
              { text: "The full sequence is always slower with no real benefit", correct: false },
              { text: "There's no real difference between the two approaches", correct: false },
            ],
            explanation: "Skipping the sequence means you might not notice a second hazard until it's too late — the extra steps prevent that.",
          },
          {
            id: "rangers-m6-l5-4",
            prompt: "You handled a gas-smell situation correctly and reported it. Ten minutes later, you notice something else unusual. What's the right mindset?",
            options: [
              { text: "Stay just as alert as before — the first correct response doesn't mean you're done watching", correct: true },
              { text: "Assume you've already done your part and can stop paying attention", correct: false },
              { text: "Only stay alert if an adult specifically tells you to", correct: false },
            ],
            explanation: "Staying alert doesn't end after one correct response — a multi-hazard situation can keep evolving.",
          },
          {
            id: "rangers-m6-l5-5",
            prompt: "What's the biggest difference between how you'd handle a single, simple hazard versus a multi-hazard situation?",
            options: [
              { text: "A multi-hazard situation needs you to keep re-checking, not just execute one fixed plan", correct: true },
              { text: "There's actually no meaningful difference between the two", correct: false },
              { text: "Multi-hazard situations only ever need faster reactions, not different thinking", correct: false },
            ],
            explanation: "The core difference is ongoing awareness — re-checking your plan as things change, rather than running one fixed response.",
          },
        ],
      },
    ],
  },
];
