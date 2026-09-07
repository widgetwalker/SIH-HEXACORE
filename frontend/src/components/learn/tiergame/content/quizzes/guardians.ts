import type { QuizModule } from "../../types";

/* Guardians (Ages 11-13) Quiz Arena. One quiz per real module, 5 levels of
   5 questions each, 4-option questions throughout, grounded in the
   floor-by-floor reasoning their modules already teach. */
export const GUARDIANS_QUIZ_MODULES: QuizModule[] = [
  {
    moduleId: "guardians-m1",
    name: "Earthquake: Drop, Cover, Hold On",
    icon: "🌍",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "guardians-m1-l1-1",
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
            id: "guardians-m1-l1-2",
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
            id: "guardians-m1-l1-3",
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
            id: "guardians-m1-l1-4",
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
            id: "guardians-m1-l1-5",
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
        questions: [
          {
            id: "guardians-m1-l2-1",
            prompt: "What's the correct order of the three earthquake steps?",
            options: [
              { text: "Drop, then Cover, then Hold On", correct: true },
              { text: "Cover, then Drop, then Hold On", correct: false },
              { text: "Hold On, then Drop, then Cover", correct: false },
              { text: "Drop, then Hold On, then Cover", correct: false },
            ],
            explanation: "Dropping first prevents a fall, then covering protects you, then holding on keeps your cover in place.",
          },
          {
            id: "guardians-m1-l2-2",
            prompt: "If there's no desk nearby, what's the next-best cover?",
            options: [
              { text: "Crouch next to an interior wall, away from windows", correct: true },
              { text: "Stand next to a window for a clear view", correct: false },
              { text: "Run to another room to find a desk", correct: false },
              { text: "Stand in an open doorway", correct: false },
            ],
            explanation: "An interior wall away from windows is the recommended fallback when no desk is available.",
          },
          {
            id: "guardians-m1-l2-3",
            prompt: "Which staircase should you never use to evacuate after an earthquake?",
            options: [
              { text: "The lift", correct: true },
              { text: "A clear, undamaged staircase", correct: false },
              { text: "The staircase closest to your classroom", correct: false },
              { text: "A staircase your floor plan marks as safe", correct: false },
            ],
            explanation: "Lifts can stop working or open onto a damaged floor — never use one after an earthquake.",
          },
          {
            id: "guardians-m1-l2-4",
            prompt: "What are aftershocks, and why do they matter for your evacuation?",
            options: [
              { text: "Later tremors that can hit while you're still moving through the building", correct: true },
              { text: "A type of alarm sound, unrelated to shaking", correct: false },
              { text: "Something that only happens hours after you've evacuated safely", correct: false },
              { text: "A term with no real relevance to evacuation", correct: false },
            ],
            explanation: "Aftershocks can strike while you're still evacuating, which is part of why moving steadily and carefully still matters.",
          },
          {
            id: "guardians-m1-l2-5",
            prompt: "Why does the ground floor's exit sometimes still need checking, even though it's closest?",
            options: [
              { text: "It might still be blocked by debris", correct: true },
              { text: "Ground floor exits are never actually usable", correct: false },
              { text: "It's always automatically clear", correct: false },
              { text: "Ground floor students don't need to check anything", correct: false },
            ],
            explanation: "Being closest doesn't guarantee an exit is clear — debris can block even the nearest route.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "guardians-m1-l3-1",
            prompt: "You're on the 1st floor. Shaking has stopped and you're heading to your designated staircase. What should you check first?",
            options: [
              { text: "Whether the staircase shows cracks or debris before stepping onto it", correct: true },
              { text: "Whether it's the fastest route available", correct: false },
              { text: "Whether your friends are already using it", correct: false },
              { text: "Nothing — just proceed directly", correct: false },
            ],
            explanation: "Checking a staircase for damage before using it applies even on lower, seemingly safer floors.",
          },
          {
            id: "guardians-m1-l3-2",
            prompt: "You're on the 5th floor and the shaking has just stopped. What should guide your pace?",
            options: [
              { text: "Move steadily, don't sprint, and stay together with your group", correct: true },
              { text: "Sprint to save as much time as possible", correct: false },
              { text: "Wait exactly where you are indefinitely", correct: false },
              { text: "Split up to find the fastest individual routes", correct: false },
            ],
            explanation: "Top floors mean more distance and more aftershock risk — steady movement as a group is safer than sprinting or splitting up.",
          },
          {
            id: "guardians-m1-l3-3",
            prompt: "Both staircases on your floor look undamaged after the shaking. What should you still do before choosing one?",
            options: [
              { text: "Follow your floor's normal safe evacuation route", correct: true },
              { text: "Pick randomly since both look fine", correct: false },
              { text: "Wait for someone else to choose first", correct: false },
              { text: "Use the lift since both stairs seem crowded", correct: false },
            ],
            explanation: "Even when both look fine, following your floor's designated safe route keeps evacuation orderly.",
          },
          {
            id: "guardians-m1-l3-4",
            prompt: "A friend on the ground floor assumes they don't need to check anything since they're already near the exit. What's the issue?",
            options: [
              { text: "Being near the exit doesn't guarantee the exit itself is clear", correct: true },
              { text: "There's no issue — ground floor students never need to check", correct: false },
              { text: "Ground floor students should actually move slower than others", correct: false },
              { text: "Being near the exit means checking isn't necessary at all", correct: false },
            ],
            explanation: "Proximity to an exit doesn't replace the need to check whether that exit is actually usable.",
          },
          {
            id: "guardians-m1-l3-5",
            prompt: "Why does the \"three-check\" (injuries, damage/gas, official instruction) apply before moving on any floor?",
            options: [
              { text: "It applies the same way regardless of which floor you're on", correct: true },
              { text: "It only applies to students on upper floors", correct: false },
              { text: "It's optional depending on how urgent things feel", correct: false },
              { text: "It only matters if an adult specifically asks for it", correct: false },
            ],
            explanation: "The same three checks apply universally, no matter which floor you're evacuating from.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "guardians-m1-l4-1",
            prompt: "You're on the 3rd floor. Both staircases look clear, but you remember your floor plan marks only one as the designated safe route. What do you do?",
            options: [
              { text: "Use the designated staircase, since it's part of the planned evacuation", correct: true },
              { text: "Use whichever looks faster right now", correct: false },
              { text: "Alternate between them depending on crowd size", correct: false },
              { text: "Wait for a teacher before choosing either", correct: false },
            ],
            explanation: "Following the planned route keeps evacuation predictable and coordinated, even when both options look clear.",
          },
          {
            id: "guardians-m1-l4-2",
            prompt: "Why is \"a damaged structure doesn't announce when it will fail completely\" an important idea, not just a rule to memorize?",
            options: [
              { text: "It explains why you can't safely judge a cracked structure's real risk by eye", correct: true },
              { text: "It means all structures are equally dangerous at all times", correct: false },
              { text: "It only applies to very old buildings", correct: false },
              { text: "It has no real bearing on evacuation decisions", correct: false },
            ],
            explanation: "Understanding why the rule exists — that visible damage doesn't reveal how close to failure something is — helps you apply it correctly under pressure.",
          },
          {
            id: "guardians-m1-l4-3",
            prompt: "Why does \"most injuries happen from falling or being hit while moving\" matter more than the shaking's actual strength?",
            options: [
              { text: "It's your own movement during shaking that creates the biggest risk, not the shaking alone", correct: true },
              { text: "Shaking strength is actually irrelevant to safety", correct: false },
              { text: "It means strong shaking is always survivable regardless of movement", correct: false },
              { text: "It only applies to very long earthquakes", correct: false },
            ],
            explanation: "The real danger during shaking often comes from how people move, not the shaking's intensity alone — which is exactly why Drop-Cover-Hold works.",
          },
          {
            id: "guardians-m1-l4-4",
            prompt: "You're on the 4th floor and a possible aftershock happens mid-evacuation. What's the correct response?",
            options: [
              { text: "Drop, cover, and hold on again if you can, then continue once it passes", correct: true },
              { text: "Keep moving at full speed regardless", correct: false },
              { text: "Freeze in place without taking any cover", correct: false },
              { text: "Turn back toward your original classroom", correct: false },
            ],
            explanation: "An aftershock mid-evacuation calls for the same Drop-Cover-Hold response, resuming your evacuation once it passes.",
          },
          {
            id: "guardians-m1-l4-5",
            prompt: "Why does official instruction (an adult, alarm, or announcement) matter as one of the three post-shake checks, rather than just deciding yourself?",
            options: [
              { text: "Official instruction can reflect information you don't have, like building-wide damage", correct: true },
              { text: "Official instruction is only a formality with no real value", correct: false },
              { text: "You should always ignore official instruction and decide independently", correct: false },
              { text: "It only matters for students on the ground floor", correct: false },
            ],
            explanation: "Official instruction can carry information beyond what you can personally observe, which is why it's one of the three checks.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "guardians-m1-l5-1",
            prompt: "You're on the 3rd floor. The main staircase has a crack, and you also feel a small aftershock while deciding. What's the correct sequence?",
            options: [
              { text: "Drop, cover, hold on through the aftershock, then use the undamaged staircase once it passes", correct: true },
              { text: "Rush to the undamaged staircase immediately during the aftershock", correct: false },
              { text: "Use the cracked staircase since it's closer and you're in a hurry", correct: false },
              { text: "Wait exactly where you are indefinitely, ignoring both staircases", correct: false },
            ],
            explanation: "An aftershock always takes priority — Drop-Cover-Hold again, then resume your route decision once it's safe to move.",
          },
          {
            id: "guardians-m1-l5-2",
            prompt: "Why does \"if it looks wrong, treat it as unsafe\" work better than trying to judge exactly how damaged something is?",
            options: [
              { text: "You can't reliably judge structural safety by eye, so treating any visible damage as unsafe avoids guessing wrong", correct: true },
              { text: "It's simply the more cautious option, without any real safety basis", correct: false },
              { text: "Judging damage precisely is actually easy for most students", correct: false },
              { text: "The rule only applies to very obviously destroyed structures", correct: false },
            ],
            explanation: "Since you can't reliably judge how close visible damage is to complete failure, treating any of it as unsafe removes the guesswork.",
          },
          {
            id: "guardians-m1-l5-3",
            prompt: "A classmate on the 5th floor wants to sprint down to save time. Why is steady movement actually the better strategy here?",
            options: [
              { text: "Steady movement reduces the risk of falls or injury during a longer, aftershock-prone evacuation", correct: true },
              { text: "Sprinting is always faster with no real downside", correct: false },
              { text: "Steady movement only matters on floors below the 3rd", correct: false },
              { text: "There's no real difference in risk between sprinting and steady movement", correct: false },
            ],
            explanation: "On a longer evacuation with real aftershock risk, steady movement reduces injury risk more than speed helps.",
          },
          {
            id: "guardians-m1-l5-4",
            prompt: "Why does the \"three-check\" rule (injuries, damage/gas, instruction) apply in the same order every single time, rather than skipping a step when you're in a hurry?",
            options: [
              { text: "Skipping a check can mean missing something that changes your evacuation decision entirely", correct: true },
              { text: "The order doesn't actually matter, it's just tradition", correct: false },
              { text: "It only applies when you have plenty of time to spare", correct: false },
              { text: "The checks are redundant with each other", correct: false },
            ],
            explanation: "Each check can surface different critical information — skipping one under time pressure is exactly when you're most likely to miss something important.",
          },
          {
            id: "guardians-m1-l5-5",
            prompt: "What's the deeper reason Drop-Cover-Hold applies identically on every floor, from ground level to the top?",
            options: [
              { text: "The danger from falling or being struck during shaking doesn't depend on which floor you're on", correct: true },
              { text: "It's simply easier to teach one rule for every floor, without a real safety reason", correct: false },
              { text: "Ground floor students actually face a completely different set of risks", correct: false },
              { text: "Only top floors genuinely need Drop-Cover-Hold", correct: false },
            ],
            explanation: "The core risk during shaking — falling or being hit — is the same regardless of floor, which is why the response stays the same everywhere.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "guardians-m2",
    name: "Fire Evacuation: The PASS Method & Smart Exits",
    icon: "🔥",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "guardians-m2-l1-1",
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
            id: "guardians-m2-l1-2",
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
            id: "guardians-m2-l1-3",
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
            id: "guardians-m2-l1-4",
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
            id: "guardians-m2-l1-5",
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
        level: 2,
        questions: [
          {
            id: "guardians-m2-l2-1",
            prompt: "What does PASS stand for?",
            options: [
              { text: "Pull, Aim, Squeeze, Sweep", correct: true },
              { text: "Push, Alert, Stop, Signal", correct: false },
              { text: "Prepare, Assess, Start, Spray", correct: false },
              { text: "Pull, Alert, Squeeze, Stop", correct: false },
            ],
            explanation: "PASS stands for Pull, Aim, Squeeze, Sweep — for trained use on small, contained fires only.",
          },
          {
            id: "guardians-m2-l2-2",
            prompt: "What should you do if you open a door and see smoke?",
            options: [
              { text: "Stay low and look for a second route", correct: true },
              { text: "Hold your breath and push through quickly", correct: false },
              { text: "Close the door and wait there", correct: false },
              { text: "Open it wider to see how far the smoke goes", correct: false },
            ],
            explanation: "Smoke disorients people fast — stay low and find an alternate route instead of pushing through.",
          },
          {
            id: "guardians-m2-l2-3",
            prompt: "If you're on the ground floor and the fire started on your floor, what should you do?",
            options: [
              { text: "Leave immediately by the nearest clear exit", correct: true },
              { text: "Go back for your bag first", correct: false },
              { text: "Wait to see how the fire develops", correct: false },
              { text: "Look for the source before leaving", correct: false },
            ],
            explanation: "Ground-floor students with a fire on their own floor should leave immediately, without going back for belongings.",
          },
          {
            id: "guardians-m2-l2-4",
            prompt: "Why does touching a door with the back of your hand matter, specifically?",
            options: [
              { text: "It checks for heat safely, without exposing your palm to a burn", correct: true },
              { text: "It's just a habit with no particular reason", correct: false },
              { text: "It makes the door easier to open", correct: false },
              { text: "It only matters for metal doors", correct: false },
            ],
            explanation: "Using the back of your hand is a safer way to test for heat than your palm.",
          },
          {
            id: "guardians-m2-l2-5",
            prompt: "You're on the 1st or 2nd floor and the fire is below you. What should you check first?",
            options: [
              { text: "Whether your designated staircase has smoke before committing", correct: true },
              { text: "Whether the lift still works", correct: false },
              { text: "Whether the fire has spread to your floor yet", correct: false },
              { text: "Nothing — just proceed as usual", correct: false },
            ],
            explanation: "Checking your staircase for smoke before committing applies especially when the fire is below you.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "guardians-m2-l3-1",
            prompt: "You're on the ground floor when the alarm sounds, and you don't see or smell any sign of fire. What do you do?",
            options: [
              { text: "Still evacuate calmly through the nearest clear exit", correct: true },
              { text: "Assume it's a false alarm and stay put", correct: false },
              { text: "Wait for visible signs of fire before moving", correct: false },
              { text: "Only leave if a teacher personally tells you to", correct: false },
            ],
            explanation: "The alarm alone is enough reason to evacuate, whether or not you can see or smell fire yourself.",
          },
          {
            id: "guardians-m2-l3-2",
            prompt: "You're on the 2nd floor, fire is reported below you, and your designated staircase has visible smoke. What do you do?",
            options: [
              { text: "Use the alternate staircase", correct: true },
              { text: "Use your designated staircase anyway since it's the plan", correct: false },
              { text: "Wait for the smoke to clear before deciding", correct: false },
              { text: "Try the lift since the stairs seem risky", correct: false },
            ],
            explanation: "Visible smoke on your designated staircase means switching to the alternate is the correct call, plan or not.",
          },
          {
            id: "guardians-m2-l3-3",
            prompt: "You see a small, contained fire and you're trained in PASS. What should you check before attempting to use an extinguisher?",
            options: [
              { text: "Whether the fire is genuinely small and not spreading", correct: true },
              { text: "Whether anyone is watching", correct: false },
              { text: "Whether you have time before class ends", correct: false },
              { text: "Nothing — training alone is enough to proceed", correct: false },
            ],
            explanation: "Even with training, PASS only applies to a fire that's genuinely small and not actively spreading.",
          },
          {
            id: "guardians-m2-l3-4",
            prompt: "You're on the 5th floor. Your first-choice staircase clears of smoke after a minute. Do you use it now?",
            options: [
              { text: "Only if it's genuinely clear now — don't wait around near it beforehand", correct: true },
              { text: "Always wait exactly one minute before switching", correct: false },
              { text: "Never use a staircase that ever had smoke", correct: false },
              { text: "Use whichever staircase is currently less crowded", correct: false },
            ],
            explanation: "Current conditions matter most — if a route is genuinely clear now, it can be used, but don't linger near a smoky one waiting.",
          },
          {
            id: "guardians-m2-l3-5",
            prompt: "Why should you never test a warm door \"just a little\" by opening it slightly?",
            options: [
              { text: "Even a small opening can feed the fire fresh air and cause a flashover", correct: true },
              { text: "A small opening is actually a safe way to check", correct: false },
              { text: "It only matters for fully open doors", correct: false },
              { text: "There's no real risk either way", correct: false },
            ],
            explanation: "Any opening on a heat-warmed door can introduce enough air to trigger a dangerous flashover.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "guardians-m2-l4-1",
            prompt: "You're on the 4th floor. Your first-choice staircase has smoke, but the alternate is two floors further away. What's the correct call?",
            options: [
              { text: "Switch immediately to the alternate, despite the extra distance", correct: true },
              { text: "Wait to see if the smoke clears since the alternate is far", correct: false },
              { text: "Use the smoky staircase quickly to save time", correct: false },
              { text: "Split the group between both staircases", correct: false },
            ],
            explanation: "The longer evacuation from upper floors makes switching immediately, despite the distance, the right call over waiting or risking smoke.",
          },
          {
            id: "guardians-m2-l4-2",
            prompt: "Why does \"evacuate and let responders handle it\" apply even to a fire you personally feel confident about controlling?",
            options: [
              { text: "Confidence alone doesn't guarantee the fire is actually small enough or that you're trained for it", correct: true },
              { text: "Confidence is always a reliable sign the fire is under control", correct: false },
              { text: "The rule only applies to fires you're not confident about", correct: false },
              { text: "Personal confidence should override the PASS training requirement", correct: false },
            ],
            explanation: "Feeling confident isn't the same as the fire actually being small and contained — the training and situation both need to genuinely match.",
          },
          {
            id: "guardians-m2-l4-3",
            prompt: "A working lift is available during a fire evacuation. Why shouldn't you use it, even if the stairs are crowded?",
            options: [
              { text: "Lifts can lose power or open onto a smoke-filled floor during a fire", correct: true },
              { text: "Lifts are only unsafe if they're visibly damaged", correct: false },
              { text: "Crowded stairs are always more dangerous than a lift", correct: false },
              { text: "There's no real reason, it's just a rule", correct: false },
            ],
            explanation: "A lift's risk during a fire — losing power or opening onto danger — doesn't depend on how crowded the stairs currently are.",
          },
          {
            id: "guardians-m2-l4-4",
            prompt: "Why does checking a door's heat matter more than checking for visible smoke around its edges?",
            options: [
              { text: "Heat can indicate fire on the other side even before smoke becomes visible", correct: true },
              { text: "Visible smoke is always a more reliable sign than heat", correct: false },
              { text: "Both checks are actually equally unreliable", correct: false },
              { text: "Heat only matters for metal doors", correct: false },
            ],
            explanation: "Heat can be present before smoke becomes visible, which is why checking for it first matters.",
          },
          {
            id: "guardians-m2-l4-5",
            prompt: "Why is \"don't go back for bags or phones\" a rule that applies even on the ground floor, where you're closest to safety?",
            options: [
              { text: "Any time spent going back is time near a real, active hazard", correct: true },
              { text: "The rule only applies to upper floors", correct: false },
              { text: "Ground floor students have unlimited time to spare", correct: false },
              { text: "It's a rule with no real safety basis", correct: false },
            ],
            explanation: "Proximity to the exit doesn't change the fact that going back means spending extra time near an active fire.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "guardians-m2-l5-1",
            prompt: "You're on the 3rd floor. Your designated staircase has smoke, and while switching to the alternate, you notice it also has a slight haze. What's the right call?",
            options: [
              { text: "Take the alternate anyway — a slight haze is safer than confirmed smoke, and reassess as you move", correct: true },
              { text: "Go back to your original staircase since both have some smoke", correct: false },
              { text: "Stop moving entirely until one route is completely clear", correct: false },
              { text: "Pick whichever route is closer regardless of smoke", correct: false },
            ],
            explanation: "Between two imperfect options, choosing the less compromised one and continuing to reassess is safer than freezing or returning to a confirmed-bad route.",
          },
          {
            id: "guardians-m2-l5-2",
            prompt: "Why does \"if there's any doubt about the fire's source, treat it as unknown\" matter even for a fire you initially assumed was just paper burning?",
            options: [
              { text: "An initial assumption about the source can be wrong, and treating it as unknown avoids a bad guess", correct: true },
              { text: "Paper fires are actually the most dangerous kind", correct: false },
              { text: "Initial assumptions are always reliable enough to act on", correct: false },
              { text: "The rule doesn't actually apply to assumed-safe sources", correct: false },
            ],
            explanation: "An assumption about the fire's source could be wrong — treating an uncertain source as unknown is the safer default regardless of your first guess.",
          },
          {
            id: "guardians-m2-l5-3",
            prompt: "Why does the PASS method's usefulness depend on both training AND the fire's size, rather than either one alone?",
            options: [
              { text: "Being trained doesn't help if the fire is too large, and a small fire is still risky without training", correct: true },
              { text: "Only training actually matters, fire size is irrelevant", correct: false },
              { text: "Only fire size matters, training is just a formality", correct: false },
              { text: "Either condition alone is always sufficient on its own", correct: false },
            ],
            explanation: "Both conditions have to be true together — training alone doesn't help against a large fire, and a small fire is still risky to approach without training.",
          },
          {
            id: "guardians-m2-l5-4",
            prompt: "Why might \"move immediately once the alarm is confirmed real\" be even more important for top-floor students than for ground-floor students?",
            options: [
              { text: "Top floors have the longest evacuation distance, so delay costs them more time", correct: true },
              { text: "Top-floor students actually face less risk overall", correct: false },
              { text: "The rule only technically applies to top floors", correct: false },
              { text: "Distance from the exit doesn't actually affect timing", correct: false },
            ],
            explanation: "The greater distance top-floor students must cover means any delay in moving costs them disproportionately more time.",
          },
          {
            id: "guardians-m2-l5-5",
            prompt: "What's the underlying principle connecting \"check the door,\" \"evacuate over fighting a fire,\" and \"never use the lift\"?",
            options: [
              { text: "Each rule reduces exposure to uncertainty you can't safely judge in the moment", correct: true },
              { text: "The three rules are actually unrelated to each other", correct: false },
              { text: "They all exist purely to slow down evacuation", correct: false },
              { text: "Only trained adults need to understand the connection", correct: false },
            ],
            explanation: "All three rules share the same logic: reduce your exposure to conditions — heat, fire size, or lift failure — that you can't reliably judge in the moment.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "guardians-m3",
    name: "Floor-by-Floor Hazard Mapping",
    icon: "🗺️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "guardians-m3-l1-1",
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
            id: "guardians-m3-l1-2",
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
            id: "guardians-m3-l1-3",
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
            id: "guardians-m3-l1-4",
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
            id: "guardians-m3-l1-5",
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
        level: 2,
        questions: [
          {
            id: "guardians-m3-l2-1",
            prompt: "What are the three things every good floor plan tells you?",
            options: [
              { text: "Primary exit, secondary exit, and assembly point", correct: true },
              { text: "Classroom numbers, bell schedule, and teacher names", correct: false },
              { text: "Only the location of the nearest fire extinguisher", correct: false },
              { text: "Nothing specific — just general building layout", correct: false },
            ],
            explanation: "Primary exit, secondary exit, and assembly point are the three essentials every student should know.",
          },
          {
            id: "guardians-m3-l2-2",
            prompt: "Does a route with standing water count as blocked?",
            options: [
              { text: "Yes", correct: true },
              { text: "No, only fire and smoke count", correct: false },
              { text: "Only if the water is very deep", correct: false },
              { text: "Only if someone official confirms it", correct: false },
            ],
            explanation: "Standing water is explicitly one of the signs that makes a route count as blocked.",
          },
          {
            id: "guardians-m3-l2-3",
            prompt: "A crowd ahead of you has completely stopped moving for a while. What does this suggest?",
            options: [
              { text: "That route may be blocked", correct: true },
              { text: "Nothing important", correct: false },
              { text: "You should push through quickly", correct: false },
              { text: "The crowd is just resting", correct: false },
            ],
            explanation: "A stopped crowd is one of the specific signs that a route may not be usable.",
          },
          {
            id: "guardians-m3-l2-4",
            prompt: "Why should you know a shelter-in-place spot on your floor?",
            options: [
              { text: "In case both your primary and secondary exits are ever blocked", correct: true },
              { text: "It's only relevant for teachers, not students", correct: false },
              { text: "Shelter spots are purely optional information", correct: false },
              { text: "It replaces the need to know your exits", correct: false },
            ],
            explanation: "A known shelter spot gives you a real plan for the rare case both exits are genuinely blocked.",
          },
          {
            id: "guardians-m3-l2-5",
            prompt: "If you see smoke under a door, should you open it to check further?",
            options: [
              { text: "No — the smoke alone is enough to call it blocked", correct: true },
              { text: "Yes, always check further before deciding", correct: false },
              { text: "Only if you're curious", correct: false },
              { text: "Only if a teacher tells you to", correct: false },
            ],
            explanation: "Visible smoke under a door is already conclusive — there's no need to open it and investigate.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "guardians-m3-l3-1",
            prompt: "You've just moved to a new classroom and haven't checked its exits yet. What should you do?",
            options: [
              { text: "Learn both exits and the assembly point as soon as possible", correct: true },
              { text: "Wait until an actual emergency to figure it out", correct: false },
              { text: "Assume it matches your previous classroom", correct: false },
              { text: "Only worry about it if a drill is announced", correct: false },
            ],
            explanation: "Learning your exits as soon as possible means you're never caught unprepared.",
          },
          {
            id: "guardians-m3-l3-2",
            prompt: "Your primary exit shows visible fire. What's the correct next step?",
            options: [
              { text: "Use your secondary exit immediately", correct: true },
              { text: "Wait to see if the fire dies down", correct: false },
              { text: "Move quickly past the fire anyway", correct: false },
              { text: "Ask others what they think before deciding", correct: false },
            ],
            explanation: "Visible fire is an immediate, unambiguous signal to switch to your secondary exit.",
          },
          {
            id: "guardians-m3-l3-3",
            prompt: "You reach your secondary exit and find it also blocked by a stopped crowd. What's the right move?",
            options: [
              { text: "Head to your known shelter-in-place spot and alert a teacher", correct: true },
              { text: "Push through the crowd forcefully", correct: false },
              { text: "Return to your original classroom and wait", correct: false },
              { text: "Stand exactly where you are and do nothing", correct: false },
            ],
            explanation: "When both exits are genuinely blocked, your known shelter spot plus alerting a teacher is the planned response.",
          },
          {
            id: "guardians-m3-l3-4",
            prompt: "Why does even a small amount of visible smoke count as \"blocked,\" rather than just \"a bit risky\"?",
            options: [
              { text: "Smoke can worsen fast, and there's no safety benefit to waiting to find out", correct: true },
              { text: "Only thick, heavy smoke actually counts as blocked", correct: false },
              { text: "Smoke amount doesn't really matter at all", correct: false },
              { text: "It only counts as blocked once someone is affected by it", correct: false },
            ],
            explanation: "Since smoke conditions can worsen quickly, treating any visible amount as blocked avoids waiting to find out how bad it gets.",
          },
          {
            id: "guardians-m3-l3-5",
            prompt: "What should you actually tell a teacher after spotting a blocked route?",
            options: [
              { text: "Specifically which exit is affected and what you saw", correct: true },
              { text: "Just that \"something's wrong\" somewhere", correct: false },
              { text: "Nothing, unless they ask you directly", correct: false },
              { text: "Only mention it after the evacuation is fully done", correct: false },
            ],
            explanation: "Specific information — which exit, what hazard — is far more useful than a vague report.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "guardians-m3-l4-1",
            prompt: "You know your secondary exit but haven't actually walked it in a while. Why does that matter?",
            options: [
              { text: "Conditions or layout details can change, and your memory of it should stay current", correct: true },
              { text: "It doesn't matter as long as you know it exists", correct: false },
              { text: "Secondary exits never actually change over time", correct: false },
              { text: "Only primary exits are worth keeping current knowledge of", correct: false },
            ],
            explanation: "Keeping your knowledge of the secondary exit current matters just as much as knowing the primary one.",
          },
          {
            id: "guardians-m3-l4-2",
            prompt: "Why does acting on \"what a route currently shows\" work better than waiting for someone to officially declare it dangerous?",
            options: [
              { text: "Official confirmation takes time you may not have in a fast-moving hazard", correct: true },
              { text: "Official confirmation is always available instantly anyway", correct: false },
              { text: "There's no real difference between the two approaches", correct: false },
              { text: "Acting on visible signs is actually less reliable than waiting", correct: false },
            ],
            explanation: "Fast-moving hazards don't wait for official confirmation — acting on what you can currently observe is the safer, faster approach.",
          },
          {
            id: "guardians-m3-l4-3",
            prompt: "A hallway is dimly lit but shows no fire, smoke, water, or stopped crowd. Is it \"blocked\" by the module's definition?",
            options: [
              { text: "No — dim lighting alone doesn't meet the definition of blocked", correct: true },
              { text: "Yes, anything unusual counts as blocked", correct: false },
              { text: "Only if it's pitch black", correct: false },
              { text: "It depends entirely on how nervous you feel", correct: false },
            ],
            explanation: "The specific defined hazards — fire, smoke, water, structural damage, stopped crowd — don't include lighting alone.",
          },
          {
            id: "guardians-m3-l4-4",
            prompt: "Why does knowing your exits \"before any emergency\" matter more than being able to figure it out \"during\" one?",
            options: [
              { text: "Stress and time pressure during a real emergency make careful figuring-out much harder", correct: true },
              { text: "There's no real difference in difficulty between the two", correct: false },
              { text: "It's actually easier to figure out routes during a real emergency", correct: false },
              { text: "Emergencies always give you plenty of time to plan calmly", correct: false },
            ],
            explanation: "Real emergencies come with stress and time pressure that make in-the-moment planning much harder than advance preparation.",
          },
          {
            id: "guardians-m3-l4-5",
            prompt: "You and a friend disagree about which of two visible-but-imperfect routes is safer. What should settle the disagreement?",
            options: [
              { text: "Comparing which hazard is currently more severe, based on what you can both see", correct: true },
              { text: "Whoever sounds more confident is automatically right", correct: false },
              { text: "Flipping a coin between the two options", correct: false },
              { text: "Picking whichever route is more familiar, regardless of current conditions", correct: false },
            ],
            explanation: "Comparing the actual, current severity of each hazard — not confidence or familiarity — should decide between two imperfect options.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "guardians-m3-l5-1",
            prompt: "Both your primary and secondary exits show hazard signs, and your known shelter spot is also near one of them. What's the best plan?",
            options: [
              { text: "Reassess for another safe interior space and alert a teacher immediately", correct: true },
              { text: "Use the shelter spot regardless of its location", correct: false },
              { text: "Pick whichever exit looks slightly less bad and go", correct: false },
              { text: "Wait exactly where you are with no further action", correct: false },
            ],
            explanation: "When even your planned shelter spot is compromised, reassessing and alerting a teacher is safer than defaulting to a plan that no longer fits the situation.",
          },
          {
            id: "guardians-m3-l5-2",
            prompt: "Why is memorizing your evacuation plan considered an active responsibility, not something that happens automatically?",
            options: [
              { text: "It requires deliberate effort to learn and keep current, unlike passive knowledge", correct: true },
              { text: "Everyone naturally absorbs this information without trying", correct: false },
              { text: "It's solely the school's responsibility, not the student's", correct: false },
              { text: "It only matters once you're already a warden", correct: false },
            ],
            explanation: "Knowing your plan takes deliberate, ongoing effort — it's not something that happens passively.",
          },
          {
            id: "guardians-m3-l5-3",
            prompt: "A younger Ranger-tier student doesn't know their floor's exits. What's the most useful thing you could do?",
            options: [
              { text: "Help point out both exits so they're prepared going forward", correct: true },
              { text: "Assume it's not something you should get involved in", correct: false },
              { text: "Tell them they'll figure it out if it ever happens", correct: false },
              { text: "Report them to a teacher for not knowing", correct: false },
            ],
            explanation: "Sharing what you know helps build the same preparedness in someone younger, which benefits everyone.",
          },
          {
            id: "guardians-m3-l5-4",
            prompt: "Why does the definition of \"blocked\" stay identical whether the hazard is fire, water, or a stalled crowd?",
            options: [
              { text: "The correct response — treat the route as closed — doesn't change based on which hazard caused it", correct: true },
              { text: "Each different hazard actually needs its own separate definition", correct: false },
              { text: "Only fire genuinely counts as truly blocking a route", correct: false },
              { text: "The definition doesn't really matter in practice", correct: false },
            ],
            explanation: "Regardless of which specific hazard is present, the resulting action is identical: treat that route as closed.",
          },
          {
            id: "guardians-m3-l5-5",
            prompt: "What's the real value of hazard-mapping skills, beyond just memorizing where the exits are?",
            options: [
              { text: "Being able to judge unfamiliar or changing conditions quickly and correctly", correct: true },
              { text: "There's no real value beyond memorizing fixed exit locations", correct: false },
              { text: "It only matters for students who want to become wardens someday", correct: false },
              { text: "Memorizing exits is the entire skill, nothing more", correct: false },
            ],
            explanation: "The real skill is being able to judge changing, real-time conditions — memorizing exits is just the starting point.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "guardians-m4",
    name: "Chemical Spill: Lab Safety Protocol",
    icon: "🧪",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "guardians-m4-l1-1",
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
            id: "guardians-m4-l1-2",
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
            id: "guardians-m4-l1-3",
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
            id: "guardians-m4-l1-4",
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
            id: "guardians-m4-l1-5",
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
        level: 2,
        questions: [
          {
            id: "guardians-m4-l2-1",
            prompt: "What's the very first thing to do after noticing an unknown spill?",
            options: [
              { text: "Alert others nearby and step back", correct: true },
              { text: "Take a photo to document it", correct: false },
              { text: "Ask around if anyone knows what it is", correct: false },
              { text: "Continue what you were doing nearby", correct: false },
            ],
            explanation: "Alerting others and stepping back keeps everyone safe while help is on the way.",
          },
          {
            id: "guardians-m4-l2-2",
            prompt: "Why shouldn't you try to identify a chemical by its color or texture?",
            options: [
              { text: "Appearance doesn't reliably tell you how dangerous something is", correct: true },
              { text: "Color and texture are actually reliable indicators", correct: false },
              { text: "It's fine as long as you don't touch it", correct: false },
              { text: "This only matters for clear liquids", correct: false },
            ],
            explanation: "You can't judge a chemical's danger from how it looks — identification requires proper training and tools.",
          },
          {
            id: "guardians-m4-l2-3",
            prompt: "A spill blocks your usual hallway. What matters more — saving time or avoiding the fumes?",
            options: [
              { text: "Avoiding the fumes, even if it takes longer", correct: true },
              { text: "Saving time, since the detour is inconvenient", correct: false },
              { text: "Neither really matters here", correct: false },
              { text: "It depends on how you're feeling that day", correct: false },
            ],
            explanation: "Avoiding unknown fumes is always worth more than the extra time an alternate route takes.",
          },
          {
            id: "guardians-m4-l2-4",
            prompt: "Why does reporting a spill \"even without full certainty\" matter?",
            options: [
              { text: "Waiting for certainty can delay a response you might genuinely need", correct: true },
              { text: "Certainty doesn't actually change anything about the response", correct: false },
              { text: "Adults prefer only fully confirmed reports", correct: false },
              { text: "Uncertain reports are usually ignored anyway", correct: false },
            ],
            explanation: "Reporting early, even without being fully sure, gives adults the best chance to respond in time.",
          },
          {
            id: "guardians-m4-l2-5",
            prompt: "Who has the training and equipment to safely handle a chemical spill?",
            options: [
              { text: "Trained adults or responders", correct: true },
              { text: "Any student who volunteers", correct: false },
              { text: "Whoever is standing closest", correct: false },
              { text: "No one really needs special training", correct: false },
            ],
            explanation: "Handling chemical spills safely requires specific training and equipment students don't have.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "guardians-m4-l3-1",
            prompt: "You're walking past a lab and notice an unusual smell coming from inside, but it's not your class. What do you do?",
            options: [
              { text: "Tell a teacher what you noticed, regardless of whose lab it is", correct: true },
              { text: "Go inside to investigate", correct: false },
              { text: "Ignore it since it's not your responsibility", correct: false },
              { text: "Wait to see if someone else notices first", correct: false },
            ],
            explanation: "Reporting applies no matter whose lab it is — the important thing is that an adult finds out.",
          },
          {
            id: "guardians-m4-l3-2",
            prompt: "A classmate gets a small splash of an unknown liquid on their sleeve. What's the correct response?",
            options: [
              { text: "Tell a teacher immediately", correct: true },
              { text: "Tell them to wipe it off and continue class", correct: false },
              { text: "Wait to see if it causes any reaction first", correct: false },
              { text: "Try to identify the liquid before deciding what to do", correct: false },
            ],
            explanation: "Any contact with an unidentified chemical, even on clothing, deserves an immediate report to a teacher.",
          },
          {
            id: "guardians-m4-l3-3",
            prompt: "The spill has no obvious smell at all. Should you still treat it cautiously?",
            options: [
              { text: "Yes — not all dangerous chemicals have a strong smell", correct: true },
              { text: "No, only smelly spills matter", correct: false },
              { text: "Only if it looks like a large amount", correct: false },
              { text: "Only if someone nearby seems affected", correct: false },
            ],
            explanation: "Smell isn't a reliable indicator — a spill's danger doesn't depend on whether you can smell it.",
          },
          {
            id: "guardians-m4-l3-4",
            prompt: "Your usual route now has fumes, but the alternate route is well out of your way. What should decide your choice?",
            options: [
              { text: "Avoiding the unknown fumes, regardless of the extra distance", correct: true },
              { text: "Whichever route saves the most time", correct: false },
              { text: "Whether other students are also using the fume-filled route", correct: false },
              { text: "Flipping a coin between the two", correct: false },
            ],
            explanation: "Distance is a worthwhile tradeoff for avoiding fumes you can't identify or judge the danger of.",
          },
          {
            id: "guardians-m4-l3-5",
            prompt: "What should you do while waiting for a trained adult to respond to a spill you reported?",
            options: [
              { text: "Stay back and help keep others away from the area too", correct: true },
              { text: "Stand close by to keep an eye on it", correct: false },
              { text: "Go back to your normal activities nearby", correct: false },
              { text: "Try to identify it while you wait", correct: false },
            ],
            explanation: "Keeping distance and warning others protects everyone until trained help arrives.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "guardians-m4-l4-1",
            prompt: "A classmate says a spill \"is probably just water\" based on how it looks, so it's fine to walk through. What's the safe response?",
            options: [
              { text: "Treat it as unknown until a trained adult confirms otherwise", correct: true },
              { text: "Trust the visual guess and walk through", correct: false },
              { text: "Only avoid it if it has a strong smell", correct: false },
              { text: "Ask a few other students what they think it is", correct: false },
            ],
            explanation: "A visual guess isn't reliable — treating any unidentified liquid as unknown is the only safe default.",
          },
          {
            id: "guardians-m4-l4-2",
            prompt: "Why does \"never lean in to identify it\" apply even to a spill that looks completely clear and odorless?",
            options: [
              { text: "Appearance and smell alone don't reliably indicate a chemical's danger", correct: true },
              { text: "Clear, odorless liquids are always safe by definition", correct: false },
              { text: "The rule is really only about strongly colored liquids", correct: false },
              { text: "Leaning in is fine as long as you don't touch it", correct: false },
            ],
            explanation: "Neither appearance nor smell reliably tells you whether something is dangerous — the rule applies universally to unidentified spills.",
          },
          {
            id: "guardians-m4-l4-3",
            prompt: "Your closer exit has fumes, and the alternate is significantly further and would make you late. What should guide your decision?",
            options: [
              { text: "Health and safety over punctuality — take the alternate", correct: true },
              { text: "Being on time matters more here", correct: false },
              { text: "Whichever choice avoids questions from a teacher", correct: false },
              { text: "Waiting exactly where you are until the fumes clear", correct: false },
            ],
            explanation: "Being late is always the acceptable tradeoff compared to walking through fumes you can't identify.",
          },
          {
            id: "guardians-m4-l4-4",
            prompt: "Why might a spill pose a risk to people nearby even if no one actually steps in it or touches it?",
            options: [
              { text: "Fumes released by a spill can affect people through the air alone", correct: true },
              { text: "Spills are only dangerous through direct physical contact", correct: false },
              { text: "There's no risk unless someone is standing right next to it", correct: false },
              { text: "Fumes only matter for chemicals that are already labeled hazardous", correct: false },
            ],
            explanation: "Airborne fumes alone can pose a health risk, independent of direct contact — that's part of why distance matters.",
          },
          {
            id: "guardians-m4-l4-5",
            prompt: "What's the shared principle behind every rule in this module — distance, reporting, and never self-identifying?",
            options: [
              { text: "Reducing your exposure to something you genuinely can't safely judge yourself", correct: true },
              { text: "Each rule addresses a completely separate, unrelated concern", correct: false },
              { text: "Only the reporting rule actually matters in practice", correct: false },
              { text: "The rules exist mainly to slow down students, not to protect them", correct: false },
            ],
            explanation: "Every rule in this module reduces your exposure to a hazard whose real danger you're not equipped to judge — that's the common thread.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "guardians-m4-l5-1",
            prompt: "You report a spill, but the teacher seems distracted and may not have fully registered it. What's the right next step?",
            options: [
              { text: "Confirm they understood, or tell another adult to be sure", correct: true },
              { text: "Assume you've done your part and move on", correct: false },
              { text: "Handle it yourself since no one seemed to respond", correct: false },
              { text: "Wait quietly to see if anything happens", correct: false },
            ],
            explanation: "A report only helps if it's actually received — following up or telling another adult closes that gap.",
          },
          {
            id: "guardians-m4-l5-2",
            prompt: "Why does treating every unidentified spill identically — distance and report — work better than trying to judge each one's danger individually?",
            options: [
              { text: "Without training, you genuinely can't judge chemical danger accurately case by case", correct: true },
              { text: "It's simpler, even though case-by-case judgment would actually be more accurate", correct: false },
              { text: "It doesn't actually work better, it's purely a school policy", correct: false },
              { text: "Individual judgment is always more reliable than a blanket rule", correct: false },
            ],
            explanation: "Since you lack the training to judge chemical danger accurately, a consistent rule — distance plus reporting — is genuinely the safer approach every time.",
          },
          {
            id: "guardians-m4-l5-3",
            prompt: "A younger Ranger-tier student is about to touch an unidentified spill out of curiosity. What's the best response?",
            options: [
              { text: "Stop them calmly and get a trained adult involved", correct: true },
              { text: "Let them touch it, since it's probably harmless", correct: false },
              { text: "Warn them once, then walk away", correct: false },
              { text: "Tell them to identify it carefully first", correct: false },
            ],
            explanation: "Stopping them and getting an adult involved protects the younger student while ensuring the spill is handled properly.",
          },
          {
            id: "guardians-m4-l5-4",
            prompt: "Why is \"step away and report\" a complete response on its own, without needing to know what the chemical actually is?",
            options: [
              { text: "The correct action doesn't depend on identifying the substance first", correct: true },
              { text: "You should always identify it before doing anything else", correct: false },
              { text: "It's only complete for certain, less dangerous chemicals", correct: false },
              { text: "Reporting alone isn't actually sufficient", correct: false },
            ],
            explanation: "The safe response works the same regardless of what the chemical turns out to be — identification isn't a prerequisite for acting safely.",
          },
          {
            id: "guardians-m4-l5-5",
            prompt: "How does judging a chemical hazard differ from judging a hazard like fire or a cracked staircase?",
            options: [
              { text: "Chemical danger is often invisible, while fire and structural damage are usually visibly obvious", correct: true },
              { text: "Chemical hazards are actually easier to judge visually than fire", correct: false },
              { text: "There's no meaningful difference in how you judge them", correct: false },
              { text: "Only chemical hazards require ever alerting an adult", correct: false },
            ],
            explanation: "Fire and structural damage tend to be visibly obvious, but a chemical's true danger is often invisible — which is exactly why the rule is always report, never investigate.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "guardians-m5",
    name: "Cyclone & Flood Shelter Procedures",
    icon: "🌊",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "guardians-m5-l1-1",
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
            id: "guardians-m5-l1-2",
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
            id: "guardians-m5-l1-3",
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
            id: "guardians-m5-l1-4",
            prompt: "A cyclone bringing flooding means what, specifically?",
            options: [
              { text: "Stay indoors and away from windows, but be ready to move higher if water rises", correct: true },
              { text: "Evacuate outside immediately in every case", correct: false },
              { text: "The two hazards cancel each other out, so no special plan is needed", correct: false },
              { text: "Only worry about the flooding, not the cyclone", correct: false },
            ],
            explanation: "A combined cyclone-and-flood scenario means holding both plans in mind — stay in, but be ready to move up.",
          },
          {
            id: "guardians-m5-l1-5",
            prompt: "Why should you follow official instructions rather than guessing during a cyclone with flooding?",
            options: [
              { text: "Official sources may know things about the storm you can't observe yourself", correct: true },
              { text: "Official instructions are just a formality with no real value", correct: false },
              { text: "You should always ignore official instructions and rely on your own judgment", correct: false },
              { text: "It only matters for adults, not students", correct: false },
            ],
            explanation: "Official sources can have wider information than you can observe from inside a single room.",
          },
        ],
      },
      {
        level: 2,
        questions: [
          {
            id: "guardians-m5-l2-1",
            prompt: "What kind of room is safest during a cyclone?",
            options: [
              { text: "An interior room with no windows", correct: true },
              { text: "A room with a large window", correct: false },
              { text: "The rooftop or balcony", correct: false },
              { text: "Any room, it doesn't matter", correct: false },
            ],
            explanation: "An interior room without windows protects you from the cyclone's biggest danger: flying debris.",
          },
          {
            id: "guardians-m5-l2-2",
            prompt: "Why is a rooftop or balcony a bad place to be during a cyclone, even briefly?",
            options: [
              { text: "It exposes you directly to flying debris", correct: true },
              { text: "It's actually a good vantage point to monitor the storm", correct: false },
              { text: "It's only dangerous during very severe cyclones", correct: false },
              { text: "There's no real danger, just discomfort from wind", correct: false },
            ],
            explanation: "Flying debris is the main cyclone danger, and a rooftop or balcony puts you directly in its path.",
          },
          {
            id: "guardians-m5-l2-3",
            prompt: "What can hide beneath water that looks shallow?",
            options: [
              { text: "Strong currents or live electrical hazards", correct: true },
              { text: "Nothing — shallow water is always safe", correct: false },
              { text: "Only small debris, nothing dangerous", correct: false },
              { text: "It depends only on the water's color", correct: false },
            ],
            explanation: "Depth alone doesn't reveal current or electrical hazards hidden beneath the surface.",
          },
          {
            id: "guardians-m5-l2-4",
            prompt: "If water is rising on the ground floor, what should you do rather than trying to leave through it?",
            options: [
              { text: "Move to a higher safe floor", correct: true },
              { text: "Walk through it carefully to exit", correct: false },
              { text: "Wait exactly on the ground floor", correct: false },
              { text: "Go check how deep it actually is first", correct: false },
            ],
            explanation: "Moving higher is safer than attempting to walk or wade through rising water to leave.",
          },
          {
            id: "guardians-m5-l2-5",
            prompt: "During a combined cyclone-and-flood scenario, what should you stay ready to do?",
            options: [
              { text: "Move to a higher floor if water starts entering the ground level", correct: true },
              { text: "Ignore the flooding since the cyclone matters more", correct: false },
              { text: "Leave the building immediately regardless of wind", correct: false },
              { text: "Nothing — the original plan never needs to change", correct: false },
            ],
            explanation: "Staying ready to move higher if water rises is part of holding both hazards in mind at once.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "guardians-m5-l3-1",
            prompt: "You're in an interior room during a cyclone, and wind sounds start to fade. What do you do?",
            options: [
              { text: "Stay put and continue waiting for official confirmation it's over", correct: true },
              { text: "Step out to check conditions since it sounds calmer", correct: false },
              { text: "Assume the danger has passed and resume normal activity", correct: false },
              { text: "Move toward a window to look outside", correct: false },
            ],
            explanation: "Fading wind sound doesn't mean the cyclone is over — staying put until official confirmation is the safer choice.",
          },
          {
            id: "guardians-m5-l3-2",
            prompt: "You need to cross a hallway with visible standing water during an active flood warning. What's correct?",
            options: [
              { text: "Avoid it and find another route, or wait for guidance", correct: true },
              { text: "Cross quickly since it looks shallow", correct: false },
              { text: "Test the depth with your foot first", correct: false },
              { text: "Cross only if others have already done so safely", correct: false },
            ],
            explanation: "Standing water during an active flood warning should always be avoided, regardless of how shallow it appears.",
          },
          {
            id: "guardians-m5-l3-3",
            prompt: "You're on a middle floor with water rising below and cyclone winds still active outside. What's the priority?",
            options: [
              { text: "Move higher while staying away from windows", correct: true },
              { text: "Choose only one hazard to respond to", correct: false },
              { text: "Wait exactly where you are, addressing neither", correct: false },
              { text: "Go check the ground floor water level yourself", correct: false },
            ],
            explanation: "Moving higher while staying clear of windows addresses both the flood risk and the cyclone risk together.",
          },
          {
            id: "guardians-m5-l3-4",
            prompt: "An announcement gives updated instructions that differ slightly from what you assumed. What should you do?",
            options: [
              { text: "Follow the official update rather than your own assumption", correct: true },
              { text: "Stick with your own assumption since you already decided", correct: false },
              { text: "Ignore the announcement entirely", correct: false },
              { text: "Only follow it if it matches what you expected", correct: false },
            ],
            explanation: "Official updates can reflect information you don't have — following them over your own guess is the safer choice.",
          },
          {
            id: "guardians-m5-l3-5",
            prompt: "Why does \"never go to a rooftop to see the storm\" apply even if the wind currently feels calm where you are?",
            options: [
              { text: "Conditions can change quickly, and rooftops carry the same debris risk regardless", correct: true },
              { text: "Rooftops are only dangerous during the strongest part of a storm", correct: false },
              { text: "Calm-feeling wind means rooftops become safe temporarily", correct: false },
              { text: "It's a rule that doesn't really apply once winds seem calm", correct: false },
            ],
            explanation: "A rooftop's debris risk doesn't depend on how calm things currently feel — conditions can shift quickly during a cyclone.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "guardians-m5-l4-1",
            prompt: "Wind outside has gone completely silent during an active cyclone warning. What should that silence make you consider?",
            options: [
              { text: "It could be a lull, not necessarily the storm's end", correct: true },
              { text: "It reliably means the cyclone has passed", correct: false },
              { text: "Silence has no particular meaning during a cyclone", correct: false },
              { text: "It's safe to briefly check outside", correct: false },
            ],
            explanation: "A sudden silence can be a lull within the storm system rather than its actual end — treat it with the same caution.",
          },
          {
            id: "guardians-m5-l4-2",
            prompt: "Why does \"never walk through moving water\" apply even to water that looks only ankle-deep?",
            options: [
              { text: "Depth alone doesn't reveal hidden currents or electrical hazards", correct: true },
              { text: "Ankle-deep water is always completely safe", correct: false },
              { text: "The rule technically only applies to knee-deep water or higher", correct: false },
              { text: "Visible depth is a reliable way to judge water's danger", correct: false },
            ],
            explanation: "What matters isn't how deep water looks, but what's hidden beneath or moving within it — which depth alone can't tell you.",
          },
          {
            id: "guardians-m5-l4-3",
            prompt: "Water is rising on the ground floor. A friend suggests waiting it out there since \"it's probably not that deep yet.\" What's the better response?",
            options: [
              { text: "Move higher regardless — waiting for confirmation of \"how deep\" wastes valuable time", correct: true },
              { text: "Wait with them, since it's probably fine for now", correct: false },
              { text: "Go check the depth together before deciding", correct: false },
              { text: "Split up — one of you waits, one moves higher", correct: false },
            ],
            explanation: "Moving higher immediately, rather than waiting to judge exact depth, avoids wasting time you may not have.",
          },
          {
            id: "guardians-m5-l4-4",
            prompt: "Why does a gas smell near an exit demand immediate action, even without a formal alarm confirming danger?",
            options: [
              { text: "The smell itself is a direct, reliable warning sign on its own", correct: true },
              { text: "Smell alone is never a reliable enough signal to act on", correct: false },
              { text: "You should always wait for an alarm regardless of what you notice", correct: false },
              { text: "This only applies once an alarm has already sounded", correct: false },
            ],
            explanation: "A gas smell is a direct signal on its own — it doesn't need a separate alarm to justify acting on it.",
          },
          {
            id: "guardians-m5-l4-5",
            prompt: "Why might \"stay ready to change floors\" matter even if you were initially told to just shelter in place?",
            options: [
              { text: "Conditions like rising water can change the original plan's safety mid-event", correct: true },
              { text: "Initial instructions are always fixed and should never be reconsidered", correct: false },
              { text: "Sheltering in place is always the final answer no matter what happens next", correct: false },
              { text: "There's no real reason to stay flexible once instructed", correct: false },
            ],
            explanation: "Conditions like rising water can change what's actually safe, which is why staying ready to adjust matters even after initial instructions.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "guardians-m5-l5-1",
            prompt: "You're on a middle floor during an active cyclone. Water is visibly rising on the ground floor, and it's unclear whether to move up immediately or wait for an announcement. What's the right call?",
            options: [
              { text: "Move higher and away from windows now, and alert an adult about what you're seeing", correct: true },
              { text: "Wait exactly where you are for an announcement before doing anything", correct: false },
              { text: "Go check the ground floor water level to decide", correct: false },
              { text: "Move to a room with a window for better visibility while deciding", correct: false },
            ],
            explanation: "Acting on visible rising water while also alerting an adult combines fast, safe action with keeping others informed — better than waiting passively.",
          },
          {
            id: "guardians-m5-l5-2",
            prompt: "Why does \"a lull might be the eye of the storm\" matter even for a cyclone officially described as mild?",
            options: [
              { text: "A storm's actual behavior can be uncertain, so the same caution applies regardless of forecast", correct: true },
              { text: "The eye-of-the-storm phenomenon only happens in severe cyclones", correct: false },
              { text: "Mild cyclones never actually have lulls", correct: false },
              { text: "Forecasts are always precisely accurate, so caution isn't needed for mild storms", correct: false },
            ],
            explanation: "Forecasts carry uncertainty, so treating every lull with the same caution — regardless of how the storm was initially described — is the safer approach.",
          },
          {
            id: "guardians-m5-l5-3",
            prompt: "Why is \"never walk through moving water\" true even for someone who's confident in their physical strength or balance?",
            options: [
              { text: "The danger comes from hidden hazards and current, which physical strength doesn't protect against", correct: true },
              { text: "Physically strong people are actually safe to cross moving water", correct: false },
              { text: "The rule is really only meant for people with poor balance", correct: false },
              { text: "Confidence in your own ability is a reliable safety indicator here", correct: false },
            ],
            explanation: "Hidden currents and electrical hazards don't care about physical strength or balance — the rule applies to everyone equally.",
          },
          {
            id: "guardians-m5-l5-4",
            prompt: "A cyclone and flooding are both actively happening, and you also notice a gas smell near your shelter room. What's the correct sequence?",
            options: [
              { text: "Move away from the smell to a different safe interior spot and alert an adult, while still avoiding windows", correct: true },
              { text: "Ignore the smell since the cyclone is the bigger concern right now", correct: false },
              { text: "Investigate the smell's source before deciding what to do", correct: false },
              { text: "Leave the building immediately, disregarding the cyclone", correct: false },
            ],
            explanation: "With three hazards in play, moving away from the newest one (gas) while still respecting the existing rules (no windows) and alerting an adult addresses the full situation.",
          },
          {
            id: "guardians-m5-l5-5",
            prompt: "What's the common thread between the cyclone, flood, and multi-hazard rules in this tier's modules?",
            options: [
              { text: "Acting on what you can currently observe, and staying ready to adjust as conditions change", correct: true },
              { text: "Each hazard actually requires a completely separate, unrelated mindset", correct: false },
              { text: "Waiting passively for instructions is always the correct universal response", correct: false },
              { text: "Only students in leadership roles need to think this way", correct: false },
            ],
            explanation: "Across every hazard in this tier, the same underlying skill applies: read current conditions accurately and stay ready to adjust your plan.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "guardians-m6",
    name: "Multi-Hazard Compound Drill",
    icon: "⚠️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "guardians-m6-l1-1",
            prompt: "Why do multi-hazard drills exist, specifically for this tier?",
            options: [
              { text: "Real emergencies don't always come one at a time", correct: true },
              { text: "They're just extra, unnecessary practice", correct: false },
              { text: "Only larger schools ever face multi-hazard situations", correct: false },
              { text: "They replace the need to learn single-hazard responses", correct: false },
            ],
            explanation: "Multi-hazard drills train you to re-check your plan when conditions change mid-emergency, since real disasters can combine.",
          },
          {
            id: "guardians-m6-l1-2",
            prompt: "After shaking stops and you smell gas, what should you avoid?",
            options: [
              { text: "Flipping light switches or using any flame", correct: true },
              { text: "Talking to anyone nearby", correct: false },
              { text: "Moving away from the smell", correct: false },
              { text: "Alerting an adult or responder", correct: false },
            ],
            explanation: "A spark from a switch or flame can ignite a gas leak — both should be avoided immediately.",
          },
          {
            id: "guardians-m6-l1-3",
            prompt: "Even if a lift looks operational during a fire, when is it acceptable to use?",
            options: [
              { text: "Only if a responder specifically tells you to use it", correct: true },
              { text: "Anytime it looks like it's still running", correct: false },
              { text: "Whenever the stairs feel too crowded", correct: false },
              { text: "It's always fine to use during a fire", correct: false },
            ],
            explanation: "A lift stays off-limits during a fire unless a responder specifically directs you to use it.",
          },
          {
            id: "guardians-m6-l1-4",
            prompt: "Earthquake shaking stops and you smell gas near a stairwell exit, but the alarm hasn't sounded. What do you do?",
            options: [
              { text: "Avoid switches, move away using a different route, and alert someone immediately", correct: true },
              { text: "Wait for the alarm before doing anything", correct: false },
              { text: "Flip on the hallway light to see better", correct: false },
              { text: "Investigate the smell to confirm it's really gas", correct: false },
            ],
            explanation: "The alarm not sounding doesn't mean there's no danger — a gas smell is itself confirmation enough to act.",
          },
          {
            id: "guardians-m6-l1-5",
            prompt: "Why is a fire that starts during a flood evacuation a realistic training scenario?",
            options: [
              { text: "Because real disasters can combine unpredictably, not stay in one category", correct: true },
              { text: "It's actually not a realistic scenario at all", correct: false },
              { text: "Fires and floods can never really happen together", correct: false },
              { text: "It's only included for dramatic effect, without real basis", correct: false },
            ],
            explanation: "Combined hazard scenarios reflect how real disasters actually unfold — one hazard doesn't rule out another appearing.",
          },
        ],
      },
      {
        level: 2,
        questions: [
          {
            id: "guardians-m6-l2-1",
            prompt: "What's a realistic example of one hazard triggering another?",
            options: [
              { text: "An earthquake damaging a gas line", correct: true },
              { text: "A fire drill happening during lunch", correct: false },
              { text: "Two students both feeling nervous at once", correct: false },
              { text: "A scheduled announcement overlapping with class", correct: false },
            ],
            explanation: "An earthquake damaging a gas line is a realistic, common way one hazard leads directly to another.",
          },
          {
            id: "guardians-m6-l2-2",
            prompt: "Why should you avoid using electrical switches near a suspected gas leak?",
            options: [
              { text: "A spark can ignite the gas", correct: true },
              { text: "It has nothing to do with gas safety", correct: false },
              { text: "It only matters for very large leaks", correct: false },
              { text: "Switches are actually unrelated to ignition risk", correct: false },
            ],
            explanation: "Electrical switches can create the spark that ignites gas — that's the specific danger behind this rule.",
          },
          {
            id: "guardians-m6-l2-3",
            prompt: "Should you assume the danger is over once the \"first\" hazard, like shaking, has stopped?",
            options: [
              { text: "No, stay alert for a second hazard", correct: true },
              { text: "Yes, danger only ever comes in one form at a time", correct: false },
              { text: "Only during official drills", correct: false },
              { text: "Only if an adult specifically warns you", correct: false },
            ],
            explanation: "Staying alert after the first hazard passes is the entire point of multi-hazard training.",
          },
          {
            id: "guardians-m6-l2-4",
            prompt: "Why does a working lift still stay off-limits during a fire, even with responders nearby?",
            options: [
              { text: "Only a responder's direct instruction changes that, not just their presence", correct: true },
              { text: "Responders being nearby always makes lifts automatically safe", correct: false },
              { text: "The lift rule stops applying once help has arrived", correct: false },
              { text: "It has nothing to do with responder instructions", correct: false },
            ],
            explanation: "The lift restriction lifts only with a responder's explicit direction — their mere presence isn't enough on its own.",
          },
          {
            id: "guardians-m6-l2-5",
            prompt: "Who should you tell about a secondary hazard, like a gas smell after an earthquake?",
            options: [
              { text: "An adult or responder, right away", correct: true },
              { text: "Only your closest friends", correct: false },
              { text: "No one — just handle it yourself", correct: false },
              { text: "Wait until the situation fully resolves", correct: false },
            ],
            explanation: "Telling an adult or responder immediately means the secondary hazard gets addressed properly.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "guardians-m6-l3-1",
            prompt: "Shaking has just stopped, and you're heading to your usual staircase when you notice a faint gas smell there. What do you do?",
            options: [
              { text: "Change your route and alert an adult about the smell", correct: true },
              { text: "Use the staircase anyway since it's your designated route", correct: false },
              { text: "Wait exactly where you are without acting", correct: false },
              { text: "Investigate the smell before deciding what to do", correct: false },
            ],
            explanation: "Noticing a new hazard means updating your plan immediately, even if it means deviating from your designated route.",
          },
          {
            id: "guardians-m6-l3-2",
            prompt: "A fire starts during an ongoing flood evacuation. What should guide your response?",
            options: [
              { text: "Address whichever hazards are actually present right now", correct: true },
              { text: "Only respond to whichever hazard started first", correct: false },
              { text: "Ignore both until things settle down", correct: false },
              { text: "Follow only the flood evacuation plan, since it started first", correct: false },
            ],
            explanation: "Responding to current, actual conditions matters more than which hazard technically started first.",
          },
          {
            id: "guardians-m6-l3-3",
            prompt: "Why does a gas smell near your exit change your evacuation route, even mid-evacuation?",
            options: [
              { text: "A newly discovered hazard means your route needs to be reassessed", correct: true },
              { text: "You should never deviate from a route once you've started moving", correct: false },
              { text: "Gas smells don't actually require changing anything", correct: false },
              { text: "Only a responder can authorize a route change", correct: false },
            ],
            explanation: "Discovering a new hazard mid-evacuation is exactly the situation that calls for reassessing your route.",
          },
          {
            id: "guardians-m6-l3-4",
            prompt: "Why doesn't waiting for the fire alarm make sense once you've already noticed a gas smell?",
            options: [
              { text: "The smell itself is already sufficient information to act on", correct: true },
              { text: "The alarm always sounds before any smell would appear", correct: false },
              { text: "You should never act on anything without the alarm sounding first", correct: false },
              { text: "Gas smells and fire alarms are always triggered by the same event", correct: false },
            ],
            explanation: "The gas smell is itself a direct warning sign — there's no need to wait for a separate confirmation from the alarm.",
          },
          {
            id: "guardians-m6-l3-5",
            prompt: "What's the core skill this module builds, beyond any single hazard fact?",
            options: [
              { text: "Noticing when conditions change and adjusting your plan accordingly", correct: true },
              { text: "Memorizing one single fixed plan that works for every situation", correct: false },
              { text: "Reacting as quickly as possible without pausing to check anything", correct: false },
              { text: "Following the exact same sequence regardless of what you observe", correct: false },
            ],
            explanation: "Staying observant and willing to adjust your plan is the core skill this entire module is built around.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "guardians-m6-l4-1",
            prompt: "You're mid-evacuation from a fire when you also notice a possible gas smell along your route. What's the best sequence?",
            options: [
              { text: "Reroute away from the smell while continuing to evacuate, and report it once clear", correct: true },
              { text: "Pause the fire evacuation entirely to investigate the smell first", correct: false },
              { text: "Continue on your original route since you're already committed", correct: false },
              { text: "Split the group so some investigate while others continue", correct: false },
            ],
            explanation: "Adjusting your route while continuing to evacuate addresses both hazards without unnecessary delay or splitting the group.",
          },
          {
            id: "guardians-m6-l4-2",
            prompt: "Why does \"don't flip light switches near a gas leak\" apply even in a hallway that's already brightly lit by daylight?",
            options: [
              { text: "The spark risk from a switch doesn't depend on how bright the hallway already is", correct: true },
              { text: "It only matters in dark hallways where you'd actually need the light", correct: false },
              { text: "Lighting conditions have nothing to do with this specific rule", correct: false },
              { text: "Bright daylight actually neutralizes the spark risk", correct: false },
            ],
            explanation: "The danger comes from the spark itself, which exists regardless of how well-lit the hallway already is.",
          },
          {
            id: "guardians-m6-l4-3",
            prompt: "A classmate argues \"we already checked for hazards once during the earthquake response, we're done checking.\" What's the flaw in that reasoning?",
            options: [
              { text: "A new hazard, like a gas leak, can appear after the initial check", correct: true },
              { text: "There's no flaw — one check is genuinely always sufficient", correct: false },
              { text: "Checking more than once is actually discouraged", correct: false },
              { text: "Multi-hazard situations never really involve more than one check", correct: false },
            ],
            explanation: "Conditions can change after an initial check, which is exactly why ongoing awareness matters more than a single check.",
          },
          {
            id: "guardians-m6-l4-4",
            prompt: "Why does reporting a secondary hazard to a responder matter even if you've already handled it yourself by rerouting?",
            options: [
              { text: "Responders can act on a wider scale, like warning others or addressing the source", correct: true },
              { text: "Reporting is only necessary if you haven't personally reacted yet", correct: false },
              { text: "It doesn't add anything once you've already rerouted", correct: false },
              { text: "Only adults are allowed to notice secondary hazards", correct: false },
            ],
            explanation: "A responder can act beyond your own immediate response — warning others or addressing the hazard's source — which is why reporting still matters.",
          },
          {
            id: "guardians-m6-l4-5",
            prompt: "What distinguishes \"re-checking your plan calmly\" from \"panicking and changing course randomly\"?",
            options: [
              { text: "Re-checking is grounded in specific, observed hazards, not just fear", correct: true },
              { text: "There's no meaningful difference between the two", correct: false },
              { text: "Panicked reactions are actually more reliable under pressure", correct: false },
              { text: "Calm re-checking always takes longer with no real benefit", correct: false },
            ],
            explanation: "A deliberate re-check based on real observations is fundamentally different from reacting out of unfocused panic.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "guardians-m6-l5-1",
            prompt: "After an earthquake, you're guiding a small group toward the designated exit when you notice a gas smell. What's the best full sequence of actions?",
            options: [
              { text: "Redirect the group away from the smell, use an alternate route, and alert a responder once everyone is clear", correct: true },
              { text: "Continue to the designated exit since it's the planned route", correct: false },
              { text: "Stop the group to debate whether the smell is really gas", correct: false },
              { text: "Send one person to investigate while the rest wait", correct: false },
            ],
            explanation: "Redirecting immediately, then reporting once clear, avoids wasting time near a suspected hazard or splitting the group unnecessarily.",
          },
          {
            id: "guardians-m6-l5-2",
            prompt: "Why does this tier's training specifically pair earthquakes with gas leaks and fires with blocked staircases?",
            options: [
              { text: "These are realistic, common ways one hazard leads directly to another in a building", correct: true },
              { text: "The pairings are arbitrary, chosen only for variety", correct: false },
              { text: "Gas leaks and blocked staircases never actually relate to their paired hazard", correct: false },
              { text: "Only responders need to understand these specific combinations", correct: false },
            ],
            explanation: "These pairings reflect realistic cause-and-effect relationships — earthquakes commonly damage gas lines, and fires commonly compromise staircases.",
          },
          {
            id: "guardians-m6-l5-3",
            prompt: "Why would jumping straight to \"just get out\" as a single instinct sometimes be worse than following the fuller sequence (protect yourself, reassess, check for secondary hazards, then act)?",
            options: [
              { text: "Skipping straight to \"get out\" can mean walking directly into an undetected second hazard", correct: true },
              { text: "The fuller sequence is always slower with no actual safety benefit", correct: false },
              { text: "There's no meaningful difference between the two approaches", correct: false },
              { text: "The fuller sequence only matters for adults, not students", correct: false },
            ],
            explanation: "Skipping the full sequence risks missing a second hazard entirely — the extra steps are what catch it before it's too late.",
          },
          {
            id: "guardians-m6-l5-4",
            prompt: "You handled a gas-smell situation correctly and reported it. Fifteen minutes later, during continued evacuation, you notice something else unusual. What's the right mindset?",
            options: [
              { text: "Stay just as alert as before — one correct response doesn't mean you're finished watching", correct: true },
              { text: "Assume you've already done your part and stop paying close attention", correct: false },
              { text: "Only stay alert if a responder specifically instructs you to", correct: false },
              { text: "Treat the situation as fully resolved once one hazard is reported", correct: false },
            ],
            explanation: "A multi-hazard situation can keep evolving — staying alert doesn't end just because you handled the first hazard correctly.",
          },
          {
            id: "guardians-m6-l5-5",
            prompt: "What's the biggest conceptual difference between handling a single, simple hazard and a multi-hazard situation?",
            options: [
              { text: "A multi-hazard situation requires continuous re-checking, not one fixed response executed once", correct: true },
              { text: "There's actually no meaningful conceptual difference between the two", correct: false },
              { text: "Multi-hazard situations only require reacting faster, not thinking differently", correct: false },
              { text: "Single hazards require more careful thinking than multi-hazard ones", correct: false },
            ],
            explanation: "The core difference is ongoing awareness — a multi-hazard situation demands continuous re-checking rather than a single, fixed response.",
          },
        ],
      },
    ],
  },
];
