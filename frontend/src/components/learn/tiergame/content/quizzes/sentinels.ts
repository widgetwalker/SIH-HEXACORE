import type { QuizModule } from "../../types";

/* Sentinels (Ages 14-17) Quiz Arena. One quiz per real module, 5 levels of
   5 questions each, 4-option questions with a leadership/judgment angle,
   grounded in their modules' emphasis on reasoning and helping others. */
export const SENTINELS_QUIZ_MODULES: QuizModule[] = [
  {
    moduleId: "sentinels-m1",
    name: "Earthquake: Beyond Drop-Cover-Hold",
    icon: "🌍",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "sentinels-m1-l1-1",
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
            id: "sentinels-m1-l1-2",
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
            id: "sentinels-m1-l1-3",
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
            id: "sentinels-m1-l1-4",
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
            id: "sentinels-m1-l1-5",
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
        questions: [
          {
            id: "sentinels-m1-l2-1",
            prompt: "What's the practical reason \"the response with the best statistical outcome\" beats other instincts, like trying to secure the room?",
            options: [
              { text: "Statistics reflect what actually reduces injury across many real events, not just intuition", correct: true },
              { text: "Statistics are just a formality, intuition is more reliable", correct: false },
              { text: "There's no real difference between the two approaches", correct: false },
              { text: "Securing the room is actually the statistically better choice", correct: false },
            ],
            explanation: "Relying on outcomes from real events, rather than instinct alone, is why Drop-Cover-Hold remains the recommended response.",
          },
          {
            id: "sentinels-m1-l2-2",
            prompt: "How long after the main shaking can a dangerous aftershock occur?",
            options: [
              { text: "Minutes or hours later", correct: true },
              { text: "Only within the first ten seconds", correct: false },
              { text: "Aftershocks can't happen after the main quake ends", correct: false },
              { text: "Only the following day at the earliest", correct: false },
            ],
            explanation: "Aftershocks can strike minutes or hours after the main shaking, which is why vigilance doesn't end once it stops.",
          },
          {
            id: "sentinels-m1-l2-3",
            prompt: "What should you avoid doing near a stairwell right after shaking stops?",
            options: [
              { text: "Lingering there without a clear reason", correct: true },
              { text: "Passing through it briefly on your way out", correct: false },
              { text: "Using it as part of your planned evacuation route", correct: false },
              { text: "Walking through it at a steady pace", correct: false },
            ],
            explanation: "Stairwells carry more aftershock risk — pass through with purpose rather than lingering.",
          },
          {
            id: "sentinels-m1-l2-4",
            prompt: "What's the most effective way to help a frozen younger student, according to this module?",
            options: [
              { text: "A short instruction combined with physically leading them", correct: true },
              { text: "A calm but lengthy explanation of the danger", correct: false },
              { text: "Leaving them to process the situation alone", correct: false },
              { text: "Pointing out the danger from a distance", correct: false },
            ],
            explanation: "Combining direction with physical action is what actually breaks a freeze response — words alone often aren't enough.",
          },
          {
            id: "sentinels-m1-l2-5",
            prompt: "Why is staying brief, not just calm, part of good communication during a crisis?",
            options: [
              { text: "Long explanations can slow down urgent action when time matters most", correct: true },
              { text: "Brevity has no real value during a crisis", correct: false },
              { text: "Long explanations are always more reassuring", correct: false },
              { text: "It only matters when talking to younger students", correct: false },
            ],
            explanation: "Time matters during a crisis — brief, calm instructions get people moving faster than long explanations.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "sentinels-m1-l3-1",
            prompt: "You feel a possible aftershock while walking through a stairwell. What's the correct response?",
            options: [
              { text: "Drop, cover, and hold on again if possible, right where you are", correct: true },
              { text: "Run the rest of the way through the stairwell as fast as possible", correct: false },
              { text: "Freeze without taking any cover", correct: false },
              { text: "Turn back toward your original classroom", correct: false },
            ],
            explanation: "An aftershock calls for the same Drop-Cover-Hold response, wherever you happen to be, including mid-evacuation.",
          },
          {
            id: "sentinels-m1-l3-2",
            prompt: "A younger student near you seems to be following the crowd blindly, without noticing a cracked wall ahead. What's the right move?",
            options: [
              { text: "Give a short direction and lead them away from that path", correct: true },
              { text: "Assume the crowd will naturally avoid the hazard", correct: false },
              { text: "Point out the crack and let them decide", correct: false },
              { text: "Focus only on your own evacuation", correct: false },
            ],
            explanation: "Blindly following a crowd doesn't guarantee hazard-avoidance — a direct, brief intervention is more reliable.",
          },
          {
            id: "sentinels-m1-l3-3",
            prompt: "You're several minutes past the main shaking and everything seems calm. Should you fully relax your guard?",
            options: [
              { text: "No — aftershocks can still occur well after the main shaking", correct: true },
              { text: "Yes, calm conditions mean the danger has passed", correct: false },
              { text: "Only relax if you're already outside", correct: false },
              { text: "It depends on how long ago the shaking was", correct: false },
            ],
            explanation: "Calm conditions minutes after shaking don't rule out a later aftershock — staying aware continues to matter.",
          },
          {
            id: "sentinels-m1-l3-4",
            prompt: "Why does explaining your full reasoning to a frozen student often backfire in the moment?",
            options: [
              { text: "It adds delay and cognitive load exactly when quick action is needed", correct: true },
              { text: "Explanations are always the most effective way to help someone", correct: false },
              { text: "It has no real effect either way", correct: false },
              { text: "It only backfires with much younger students", correct: false },
            ],
            explanation: "A frozen student under stress needs a fast, simple path forward — a detailed explanation adds delay instead of removing paralysis.",
          },
          {
            id: "sentinels-m1-l3-5",
            prompt: "Why might staying calm yourself help even students you're not directly speaking to?",
            options: [
              { text: "Panic and calm both spread through visible behavior, not just direct words", correct: true },
              { text: "Your demeanor only affects people you're speaking to directly", correct: false },
              { text: "Calm behavior has no effect on people nearby", correct: false },
              { text: "This only applies to people who already know you", correct: false },
            ],
            explanation: "Visible calm behavior can influence people around you even without a direct conversation, the same way panic can spread.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "sentinels-m1-l4-1",
            prompt: "You're guiding a younger student and an aftershock hits mid-guidance. What's the correct priority order?",
            options: [
              { text: "Drop, cover, hold on together, then resume guiding once it passes", correct: true },
              { text: "Keep guiding them at the same pace, ignoring the aftershock", correct: false },
              { text: "Let go of guiding them and focus only on yourself", correct: false },
              { text: "Push them ahead of you and follow behind", correct: false },
            ],
            explanation: "An aftershock takes priority over the guidance itself — taking cover together, then resuming, keeps both of you safest.",
          },
          {
            id: "sentinels-m1-l4-2",
            prompt: "Why does \"the best statistical outcome\" matter more than what feels intuitively safest in the moment?",
            options: [
              { text: "Intuition under stress can lead people toward actions that actually increase risk", correct: true },
              { text: "Intuition is always more reliable than statistics", correct: false },
              { text: "Statistics and intuition always point the same direction anyway", correct: false },
              { text: "This distinction doesn't really matter in practice", correct: false },
            ],
            explanation: "Stress can make risky actions feel intuitively safe — relying on outcomes from real events corrects for that bias.",
          },
          {
            id: "sentinels-m1-l4-3",
            prompt: "A student insists they're fine to keep moving fast through a stairwell right after shaking. What's the concern with that?",
            options: [
              { text: "Feeling fine doesn't reduce actual aftershock risk in that location", correct: true },
              { text: "There's no real concern if they feel confident", correct: false },
              { text: "Confidence is actually a reliable safety indicator here", correct: false },
              { text: "The concern only applies to less confident students", correct: false },
            ],
            explanation: "A student's confidence doesn't change the stairwell's actual risk level — the caution applies regardless of how they feel.",
          },
          {
            id: "sentinels-m1-l4-4",
            prompt: "Why might \"one short, clear instruction at a time\" work better than giving several instructions at once to a stressed student?",
            options: [
              { text: "Stress narrows how much information someone can process at once", correct: true },
              { text: "Giving multiple instructions is always more efficient", correct: false },
              { text: "It doesn't actually make a difference either way", correct: false },
              { text: "Only younger students are affected by instruction overload", correct: false },
            ],
            explanation: "Stress reduces how much information a person can process — one clear instruction at a time is more likely to actually be followed.",
          },
          {
            id: "sentinels-m1-l4-5",
            prompt: "Why is staying calm described as \"itself a safety action,\" rather than just a nice personal quality?",
            options: [
              { text: "It has a direct, observable effect on how others around you behave", correct: true },
              { text: "It's purely about how you personally feel, with no outward effect", correct: false },
              { text: "It's only relevant to how adults perceive you", correct: false },
              { text: "It doesn't actually influence anyone else's behavior", correct: false },
            ],
            explanation: "Calm behavior visibly influences the people around you, which is exactly why it counts as an active safety action, not just a personal trait.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "sentinels-m1-l5-1",
            prompt: "You're leading a small group down a stairwell when a strong aftershock hits, and one younger student freezes. What's the best full sequence?",
            options: [
              { text: "Take cover yourself and direct everyone to do the same, then help the frozen student move once it passes", correct: true },
              { text: "Immediately grab the frozen student and keep moving through the aftershock", correct: false },
              { text: "Continue leading the rest of the group and let the frozen student catch up later", correct: false },
              { text: "Stop the whole group indefinitely until the student feels ready", correct: false },
            ],
            explanation: "Taking cover first protects everyone during the actual aftershock, then a brief, direct instruction addresses the frozen student once it's safe to move again.",
          },
          {
            id: "sentinels-m1-l5-2",
            prompt: "Why does this module frame Drop-Cover-Hold as having \"the best statistical outcome for everyone, including you,\" rather than just \"the rule for younger students\"?",
            options: [
              { text: "It corrects the common assumption that older students should react differently or more independently", correct: true },
              { text: "It's simply a stylistic way of phrasing the same younger-student rule", correct: false },
              { text: "It implies older students actually face a different physical risk", correct: false },
              { text: "The phrasing has no real purpose beyond repetition", correct: false },
            ],
            explanation: "Framing it this way directly counters the instinct that being older means you should react differently — the safest response doesn't change with age.",
          },
          {
            id: "sentinels-m1-l5-3",
            prompt: "Why does \"aftershock awareness\" require a genuinely different mindset than just \"the shaking is over, relax\"?",
            options: [
              { text: "It means treating the danger window as extended, not instantly closed", correct: true },
              { text: "It's functionally identical to relaxing immediately", correct: false },
              { text: "It only applies to earthquakes above a certain strength", correct: false },
              { text: "It's mainly a formality without practical impact on behavior", correct: false },
            ],
            explanation: "Aftershock awareness means treating the danger period as extended well past the main shaking, which changes how you move and where you linger.",
          },
          {
            id: "sentinels-m1-l5-4",
            prompt: "Why is \"give one short, clear instruction, not a lecture\" specifically framed as a Sentinel-tier responsibility, rather than something only adults do?",
            options: [
              { text: "At this age, you're old enough to help direct younger students during real emergencies", correct: true },
              { text: "It's actually not a real responsibility at this tier", correct: false },
              { text: "Only Wardens are ever expected to communicate this way", correct: false },
              { text: "The framing has no real connection to your age group's role", correct: false },
            ],
            explanation: "This tier specifically introduces the responsibility of helping direct younger students, which is why clear, brief communication becomes a skill you're expected to build.",
          },
          {
            id: "sentinels-m1-l5-5",
            prompt: "What's the deeper connection between \"panic spreads through tone\" and your own personal safety during an earthquake?",
            options: [
              { text: "A calmer environment around you, which your own tone helps create, reduces everyone's risk of panic-driven mistakes", correct: true },
              { text: "There's no real connection — tone only affects other people, not your own safety", correct: false },
              { text: "Tone matters only for the person speaking, not the group", correct: false },
              { text: "This idea only applies once you're already a Warden", correct: false },
            ],
            explanation: "A calmer group, which your own tone helps shape, reduces the risk of panic-driven mistakes for everyone — including you.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "sentinels-m2",
    name: "Fire: Reading a Building Under Stress",
    icon: "🔥",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "sentinels-m2-l1-1",
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
            id: "sentinels-m2-l1-2",
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
            id: "sentinels-m2-l1-3",
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
            id: "sentinels-m2-l1-4",
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
            id: "sentinels-m2-l1-5",
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
        level: 2,
        questions: [
          {
            id: "sentinels-m2-l2-1",
            prompt: "Why is water considered dangerous specifically on an electrical fire?",
            options: [
              { text: "It creates a shock risk through the live equipment", correct: true },
              { text: "Water is never actually dangerous on any fire type", correct: false },
              { text: "It only matters if the fire is very large", correct: false },
              { text: "Electrical fires are actually put out faster with water", correct: false },
            ],
            explanation: "Water conducts electricity, creating a shock risk when used on a fire involving live electrical equipment.",
          },
          {
            id: "sentinels-m2-l2-2",
            prompt: "What should you communicate if you're sheltering rather than evacuating?",
            options: [
              { text: "Your exact location, signaled clearly for responders", correct: true },
              { text: "Nothing — sheltering means staying silent", correct: false },
              { text: "Only your name, nothing else", correct: false },
              { text: "General information without specifics", correct: false },
            ],
            explanation: "A clear, specific location signal is what makes sheltering an effective strategy rather than just hiding.",
          },
          {
            id: "sentinels-m2-l2-3",
            prompt: "Why should you still check a lift's condition even if you can see it's currently running?",
            options: [
              { text: "Currently running doesn't guarantee it stays operational or safe", correct: true },
              { text: "There's no reason to check a lift that's currently running", correct: false },
              { text: "Lifts are only checked visually, nothing else matters", correct: false },
              { text: "This only applies to lifts that look old", correct: false },
            ],
            explanation: "A lift's current operation doesn't guarantee its condition moments later — that uncertainty is exactly why it stays off-limits during a fire.",
          },
          {
            id: "sentinels-m2-l2-4",
            prompt: "What three pieces of information make a fire report genuinely useful to responders?",
            options: [
              { text: "Which route is affected, how many people, and exact location", correct: true },
              { text: "Your name, your class, and the time", correct: false },
              { text: "Only a general description of what's happening", correct: false },
              { text: "Just an estimate of how serious it feels", correct: false },
            ],
            explanation: "Specific, actionable details — route, headcount, location — are what actually help responders act quickly.",
          },
          {
            id: "sentinels-m2-l2-5",
            prompt: "Why is \"firmly redirect\" a better response than \"argue about it\" when someone wants to go back for belongings?",
            options: [
              { text: "Arguing wastes time near the hazard, while firm redirection moves everyone forward", correct: true },
              { text: "Arguing is always faster than firm redirection", correct: false },
              { text: "There's no real difference between the two approaches", correct: false },
              { text: "Firm redirection is actually less effective than reasoning", correct: false },
            ],
            explanation: "A firm redirection gets the group moving immediately, while arguing keeps everyone lingering near danger.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "sentinels-m2-l3-1",
            prompt: "You're unsure whether a small fire is electrical or ordinary combustible material. What's the safe assumption?",
            options: [
              { text: "Treat it as unknown and evacuate rather than attempt to extinguish it", correct: true },
              { text: "Assume it's ordinary and use water", correct: false },
              { text: "Assume it's electrical and try a different method yourself", correct: false },
              { text: "Guess based on how it looks and act accordingly", correct: false },
            ],
            explanation: "Without certainty about the source, evacuating is safer than guessing and potentially using the wrong response.",
          },
          {
            id: "sentinels-m2-l3-2",
            prompt: "You and your group are sheltering after both staircases became smoke-filled. What should you do while waiting?",
            options: [
              { text: "Keep the door closed and continue signaling your exact location", correct: true },
              { text: "Open the door periodically to check conditions", correct: false },
              { text: "Stop signaling once you've reported once", correct: false },
              { text: "Split into smaller groups to find another way out", correct: false },
            ],
            explanation: "Keeping the door closed and continuing to signal your location maintains the safety of the shelter-in-place strategy.",
          },
          {
            id: "sentinels-m2-l3-3",
            prompt: "A student on your floor claims the lift is \"definitely fine\" since a teacher used it minutes ago. What's the issue with fully trusting that?",
            options: [
              { text: "Conditions can change quickly during a fire, even minutes apart", correct: true },
              { text: "There's no issue — recent use guarantees safety", correct: false },
              { text: "Teachers using it makes it officially safe for anyone", correct: false },
              { text: "This claim is actually reliable enough to act on", correct: false },
            ],
            explanation: "A lift's safety can change within minutes during an active fire — recent use by someone else doesn't guarantee current safety.",
          },
          {
            id: "sentinels-m2-l3-4",
            prompt: "You need to radio a report but you're unsure of the exact room number you're in. What should you do?",
            options: [
              { text: "Give the most specific location information you can, and clarify further if asked", correct: true },
              { text: "Skip the location entirely since you're unsure", correct: false },
              { text: "Wait until you're completely certain before reporting anything", correct: false },
              { text: "Report a random nearby room number instead", correct: false },
            ],
            explanation: "Giving your best available specific information, even if imperfect, is more useful to responders than skipping it or guessing randomly.",
          },
          {
            id: "sentinels-m2-l3-5",
            prompt: "Why might firmly redirecting someone actually be a kinder response than letting them go back for a bag?",
            options: [
              { text: "It protects them from a decision made under panic that they might not make calmly", correct: true },
              { text: "It isn't actually kinder, just faster", correct: false },
              { text: "Kindness isn't a relevant factor in this decision", correct: false },
              { text: "Letting them go back is always the more respectful choice", correct: false },
            ],
            explanation: "A firm redirection can protect someone from a panic-driven decision they wouldn't make with a clear head.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "sentinels-m2-l4-1",
            prompt: "You're sheltering with a group, and someone suggests opening the door briefly to check conditions outside. What's the risk?",
            options: [
              { text: "Opening the door can let smoke or heat in, and possibly ignite the room", correct: true },
              { text: "There's no real risk in briefly opening a sheltering room's door", correct: false },
              { text: "It only matters if smoke is visibly billowing already", correct: false },
              { text: "Opening it briefly is actually the recommended way to reassess", correct: false },
            ],
            explanation: "Even a brief opening risks letting in smoke or heat that could compromise the shelter — the door should stay closed while sheltering.",
          },
          {
            id: "sentinels-m2-l4-2",
            prompt: "Why does communicating \"six students sheltering in Room 304\" matter more than just saying \"we're okay for now\"?",
            options: [
              { text: "Specific numbers and location let responders plan and locate you precisely", correct: true },
              { text: "Both phrasings give responders equally useful information", correct: false },
              { text: "\"We're okay for now\" is actually the more useful phrasing", correct: false },
              { text: "Precision only matters if the situation is very severe", correct: false },
            ],
            explanation: "Precise numbers and location let responders plan their approach — vague reassurance doesn't give them anything actionable.",
          },
          {
            id: "sentinels-m2-l4-3",
            prompt: "Why does \"if there's any doubt about the fire's source, treat it as unknown\" outweigh a fast guess, even under time pressure?",
            options: [
              { text: "A wrong guess about the fire's source can make the situation worse, not just waste time", correct: true },
              { text: "Guessing quickly is always the better use of limited time", correct: false },
              { text: "There's no real downside to guessing under time pressure", correct: false },
              { text: "Doubt about the source rarely matters in practice", correct: false },
            ],
            explanation: "A wrong guess about the source — like using water on an electrical fire — can actively worsen the situation, which outweighs the time saved by guessing.",
          },
          {
            id: "sentinels-m2-l4-4",
            prompt: "Why might a student's confident claim that \"the lift is fine\" actually be less trustworthy under fire conditions than under normal ones?",
            options: [
              { text: "Fire conditions can change a lift's safety much faster than normal, everyday use would suggest", correct: true },
              { text: "Confidence is always equally reliable regardless of conditions", correct: false },
              { text: "Lifts are actually more reliable during emergencies", correct: false },
              { text: "This distinction doesn't really matter in practice", correct: false },
            ],
            explanation: "Fire conditions change rapidly, meaning a lift's safety can shift far faster than it would under normal daily use — which is why claims of \"it's fine\" carry less weight here.",
          },
          {
            id: "sentinels-m2-l4-5",
            prompt: "What makes \"firmly redirect and keep moving\" a better leadership response than \"let them decide, it's their own risk\"?",
            options: [
              { text: "One person's panic-driven choice can put the whole group at risk by keeping everyone near the hazard", correct: true },
              { text: "Individual choice should always take priority over group safety", correct: false },
              { text: "There's no real difference in outcome between the two approaches", correct: false },
              { text: "Letting people decide individually is always the more effective approach", correct: false },
            ],
            explanation: "One person's decision to linger near a hazard can keep the entire group exposed longer — firm redirection protects everyone, not just that individual.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "sentinels-m2-l5-1",
            prompt: "You're sheltering with a group when smoke begins seeping under the door. What's the correct escalation?",
            options: [
              { text: "Seal the gap as best you can, move away from the door, and continue signaling your location urgently", correct: true },
              { text: "Open the door immediately to escape the smoke", correct: false },
              { text: "Ignore it since you're already sheltering according to plan", correct: false },
              { text: "Wait exactly as you were without adjusting anything", correct: false },
            ],
            explanation: "Sealing the gap and moving away addresses the immediate risk while staying inside the shelter strategy, and urgent signaling reflects the worsening conditions.",
          },
          {
            id: "sentinels-m2-l5-2",
            prompt: "Why does this module frame \"evacuate and let responders handle it\" as the default, even for Sentinels who may feel more capable than younger students?",
            options: [
              { text: "Being older doesn't change the fundamental risk of misjudging a fire's true danger", correct: true },
              { text: "Sentinels are actually expected to handle fires themselves in most cases", correct: false },
              { text: "The default only applies to Guardians and younger tiers", correct: false },
              { text: "Age and capability directly reduce the risk of misjudging a fire", correct: false },
            ],
            explanation: "Being older or more capable doesn't change how hard it is to accurately judge a fire's true danger — the same default applies across every tier.",
          },
          {
            id: "sentinels-m2-l5-3",
            prompt: "Why is \"communicating up and down the chain\" described as part of your role specifically at this tier, not just a nice-to-have skill?",
            options: [
              { text: "At this tier, you're positioned to relay accurate information between younger students and responders", correct: true },
              { text: "It's actually not an expected part of the Sentinel role", correct: false },
              { text: "Only Wardens are expected to communicate with responders", correct: false },
              { text: "This responsibility applies equally at every single tier", correct: false },
            ],
            explanation: "Sentinels sit in a position to pass accurate information both to younger students and up to responders, which is why this becomes an explicit part of the role at this tier.",
          },
          {
            id: "sentinels-m2-l5-4",
            prompt: "Why does firmly redirecting a panicking student sometimes require overriding what feels like the more \"respectful\" choice of letting them decide?",
            options: [
              { text: "Panic can compromise someone's judgment in a way that respecting their choice doesn't account for", correct: true },
              { text: "Respecting someone's choice is always the safer approach in a crisis", correct: false },
              { text: "There's no real tension between the two ideas", correct: false },
              { text: "Overriding someone's choice is never appropriate, even in a fire", correct: false },
            ],
            explanation: "Panic can distort someone's judgment enough that their in-the-moment choice isn't the one they'd make calmly — which is why firm redirection can be the more genuinely protective response.",
          },
          {
            id: "sentinels-m2-l5-5",
            prompt: "What's the shared reasoning connecting \"treat an unknown fire source as unknown,\" \"never trust a lift by default,\" and \"give specific, not vague, reports\"?",
            options: [
              { text: "Each rule replaces an unreliable guess or assumption with the safest verifiable default", correct: true },
              { text: "The three rules are actually unrelated pieces of advice", correct: false },
              { text: "They all exist mainly to slow down your response time", correct: false },
              { text: "Only trained responders need to understand why these rules connect", correct: false },
            ],
            explanation: "All three rules replace a guess or assumption you can't verify with the safest available default — treating the unknown as unknown, distrusting the lift by default, and reporting only what you actually know precisely.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "sentinels-m3",
    name: "Floor-by-Floor Hazard Mapping & Route Judgment",
    icon: "🗺️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "sentinels-m3-l1-1",
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
            id: "sentinels-m3-l1-2",
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
            id: "sentinels-m3-l1-3",
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
            id: "sentinels-m3-l1-4",
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
            id: "sentinels-m3-l1-5",
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
        level: 2,
        questions: [
          {
            id: "sentinels-m3-l2-1",
            prompt: "Why is memory recall specifically emphasized over reading a posted map?",
            options: [
              { text: "Recall works faster under the stress of a real evacuation", correct: true },
              { text: "Posted maps are typically inaccurate", correct: false },
              { text: "Reading is always slower than memory in any situation", correct: false },
              { text: "It's mainly a matter of personal preference", correct: false },
            ],
            explanation: "Speed under stress is the key reason — recall doesn't require stopping to locate and read a map in the moment.",
          },
          {
            id: "sentinels-m3-l2-2",
            prompt: "What should you build a mental map of, specifically, for your floor?",
            options: [
              { text: "Both exits, the assembly point, and one shelter-in-place room", correct: true },
              { text: "Only the exit closest to your usual seat", correct: false },
              { text: "Just the assembly point outside", correct: false },
              { text: "Nothing specific — general familiarity is enough", correct: false },
            ],
            explanation: "A complete mental map includes both exits, the assembly point, and a shelter option, not just one piece of it.",
          },
          {
            id: "sentinels-m3-l2-3",
            prompt: "What's the correct standard for judging a route unsafe: visible hazard, or official confirmation?",
            options: [
              { text: "Visible hazard, judged in real time", correct: true },
              { text: "Official confirmation, even if it takes a while", correct: false },
              { text: "Neither — routes are always assumed safe unless proven otherwise", correct: false },
              { text: "Whichever standard feels more convenient at the time", correct: false },
            ],
            explanation: "Real-time judgment based on visible hazards is the correct standard — waiting for official confirmation costs valuable time.",
          },
          {
            id: "sentinels-m3-l2-4",
            prompt: "Between fire/smoke and standing water, which should generally be treated as more urgent?",
            options: [
              { text: "Fire and smoke", correct: true },
              { text: "Standing water", correct: false },
              { text: "They're always exactly equal in urgency", correct: false },
              { text: "Neither — crowding always outranks both", correct: false },
            ],
            explanation: "Fire and smoke are generally treated as the more immediately lethal hazard when weighing route options.",
          },
          {
            id: "sentinels-m3-l2-5",
            prompt: "What should you do if you genuinely can't judge which of two routes is safer?",
            options: [
              { text: "Shelter safely and signal for help", correct: true },
              { text: "Guess based on which route feels faster", correct: false },
              { text: "Wait in the open without taking any action", correct: false },
              { text: "Ask whoever is nearby, regardless of their expertise", correct: false },
            ],
            explanation: "Sheltering and signaling is the safer default when you genuinely can't judge between two uncertain options.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "sentinels-m3-l3-1",
            prompt: "You've just transferred to a new floor and haven't built a mental map yet. What should be your priority?",
            options: [
              { text: "Learn both exits, the assembly point, and a shelter spot as soon as possible", correct: true },
              { text: "Wait until an emergency forces you to learn it", correct: false },
              { text: "Assume it's identical to your previous floor's layout", correct: false },
              { text: "Only learn the exit closest to your usual seat", correct: false },
            ],
            explanation: "Building a complete mental map as soon as possible means you're prepared regardless of when an emergency happens.",
          },
          {
            id: "sentinels-m3-l3-2",
            prompt: "You notice light haze in a stairwell during an actual evacuation. Should you wait for someone to officially confirm it's dangerous?",
            options: [
              { text: "No — treat the visible haze itself as the signal to act", correct: true },
              { text: "Yes, always wait for official confirmation first", correct: false },
              { text: "Only wait if the haze looks very thick", correct: false },
              { text: "Only wait if a teacher is nearby to ask", correct: false },
            ],
            explanation: "Visible haze is itself the signal — waiting for a separate, official confirmation wastes time you don't have.",
          },
          {
            id: "sentinels-m3-l3-3",
            prompt: "Two routes both show a hazard: one has light smoke, one has standing water. Which do you generally treat as more urgent to avoid?",
            options: [
              { text: "The one with smoke", correct: true },
              { text: "The one with standing water", correct: false },
              { text: "Both are exactly equally urgent in every case", correct: false },
              { text: "Whichever route is currently less crowded", correct: false },
            ],
            explanation: "Smoke is generally treated as more immediately lethal than standing water when comparing two hazardous routes.",
          },
          {
            id: "sentinels-m3-l3-4",
            prompt: "You reach a point where neither visible route looks clearly safe, and you're genuinely unsure. What's correct?",
            options: [
              { text: "Shelter safely in a known spot and signal for help", correct: true },
              { text: "Pick whichever route you can access fastest", correct: false },
              { text: "Stay exactly where you are, in the open", correct: false },
              { text: "Ask a nearby student what they think, regardless of their information", correct: false },
            ],
            explanation: "Genuine uncertainty between two unclear options is exactly when sheltering and signaling becomes the better choice over guessing.",
          },
          {
            id: "sentinels-m3-l3-5",
            prompt: "Why does having a mental map of a shelter-in-place room matter, even if you expect to always be able to evacuate normally?",
            options: [
              { text: "It gives you a real option if both known exits are ever genuinely blocked at once", correct: true },
              { text: "Shelter rooms are actually more useful than exits in general", correct: false },
              { text: "It's not really necessary if you know your exits well", correct: false },
              { text: "Only Warden-tier students need to know about shelter rooms", correct: false },
            ],
            explanation: "The shelter room is your backup plan for the rare case both exits are genuinely unusable — worth knowing even if rarely needed.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "sentinels-m3-l4-1",
            prompt: "You know your floor's exits but haven't updated your mental map since a recent renovation. Why does that matter?",
            options: [
              { text: "Building layout changes can make your memorized route outdated or unsafe", correct: true },
              { text: "Renovations never actually affect evacuation routes", correct: false },
              { text: "Mental maps don't need updating once initially learned", correct: false },
              { text: "It only matters if the renovation was very recent", correct: false },
            ],
            explanation: "A layout change can make a previously safe mental map inaccurate — keeping it current matters as much as learning it initially.",
          },
          {
            id: "sentinels-m3-l4-2",
            prompt: "Why does judging a route by \"what it currently shows\" work better under real evacuation conditions than judging by \"what it usually looks like\"?",
            options: [
              { text: "Conditions during an actual emergency can differ significantly from normal, everyday conditions", correct: true },
              { text: "Routes always look identical during emergencies and normal days", correct: false },
              { text: "\"Usually looks like\" is actually the more reliable standard", correct: false },
              { text: "There's no meaningful difference between the two standards", correct: false },
            ],
            explanation: "Emergency conditions can change a route significantly from its usual state, which is why current, real-time observation matters more than habit or memory of normal conditions.",
          },
          {
            id: "sentinels-m3-l4-3",
            prompt: "A hallway shows a small amount of standing water but no fire or smoke at all. Should you treat it with the same urgency as a smoke-filled route?",
            options: [
              { text: "No — while still a hazard, water is generally treated as less immediately urgent than fire or smoke", correct: true },
              { text: "Yes, all hazards should be treated with identical urgency", correct: false },
              { text: "Only if the water looks unusually deep", correct: false },
              { text: "Urgency depends entirely on how nervous you feel", correct: false },
            ],
            explanation: "Water is still a genuine hazard, but the relative urgency compared to fire or smoke helps you prioritize when comparing route options.",
          },
          {
            id: "sentinels-m3-l4-4",
            prompt: "Why might \"shelter and signal\" sometimes be the objectively better choice, even when a route looks only mildly risky rather than clearly blocked?",
            options: [
              { text: "A mild-looking risk can still turn out worse than expected once you're already committed to the route", correct: true },
              { text: "Mildly risky routes should always just be used without hesitation", correct: false },
              { text: "Shelter and signal is only appropriate for clearly blocked routes", correct: false },
              { text: "There's no meaningful difference between mild and severe route risk", correct: false },
            ],
            explanation: "Once committed to a route, there's often no way back — a mild-looking risk can worsen mid-route, which is part of why sheltering can be the safer call under real uncertainty.",
          },
          {
            id: "sentinels-m3-l4-5",
            prompt: "Why does this module frame route judgment as a skill you build, rather than a fixed checklist you memorize once?",
            options: [
              { text: "Real situations vary too much for a fixed checklist to cover every case", correct: true },
              { text: "A fixed checklist would actually work just as well in every case", correct: false },
              { text: "Route judgment doesn't really require any ongoing skill development", correct: false },
              { text: "This framing has no practical bearing on how you evacuate", correct: false },
            ],
            explanation: "Because real conditions vary so much, judgment — not a fixed checklist — is what actually lets you respond well to situations you haven't specifically memorized.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "sentinels-m3-l5-1",
            prompt: "Both visible routes from your floor show some hazard — one light smoke, one standing water near a possible electrical source. What's the best full decision process?",
            options: [
              { text: "Weigh smoke against a possible electrical hazard in the water, then choose the less immediately lethal option or shelter if truly uncertain", correct: true },
              { text: "Automatically pick the water route since water is generally less urgent than smoke", correct: false },
              { text: "Automatically pick the smoke route since it's more familiar", correct: false },
              { text: "Wait exactly where you are indefinitely without deciding", correct: false },
            ],
            explanation: "A possible electrical hazard changes the water route's real danger — genuinely weighing both specific risks, rather than applying the general smoke-over-water rule blindly, is what real judgment requires.",
          },
          {
            id: "sentinels-m3-l5-2",
            prompt: "Why does this module emphasize \"judgment calls happen fast\" as a core idea, rather than just listing fixed rules for every possible route condition?",
            options: [
              { text: "No fixed rule list could cover every real combination of hazards you might actually encounter", correct: true },
              { text: "Fixed rule lists are actually always sufficient for real situations", correct: false },
              { text: "Judgment and fixed rules are functionally identical concepts", correct: false },
              { text: "This idea is mainly about following instructions faster, not judging independently", correct: false },
            ],
            explanation: "Real hazard combinations vary too much for any fixed rule list — which is exactly why building genuine, fast judgment is the actual goal of this module.",
          },
          {
            id: "sentinels-m3-l5-3",
            prompt: "Why might \"the standard for judging blocked routes\" stay useful even for a Sentinel who's never personally experienced a real evacuation before?",
            options: [
              { text: "The judgment principle applies to hazards generally, not just ones you've personally seen before", correct: true },
              { text: "The standard is only useful once you've been through a real evacuation", correct: false },
              { text: "Personal past experience is required for the standard to make sense", correct: false },
              { text: "This idea doesn't actually transfer to a first-time real evacuation", correct: false },
            ],
            explanation: "The underlying principle — act on what you currently observe — applies regardless of prior personal experience, which is exactly why it's taught as a general standard.",
          },
          {
            id: "sentinels-m3-l5-4",
            prompt: "A younger Guardian-tier student asks why they can't just \"wait for a teacher to say which way is safe.\" How would you explain the real reason, based on this module?",
            options: [
              { text: "Waiting for confirmation can cost time that a fast-moving hazard doesn't give you", correct: true },
              { text: "Teachers are actually never a reliable source during emergencies", correct: false },
              { text: "There's no real downside to waiting for a teacher's confirmation", correct: false },
              { text: "This is only a concern for older students, not younger ones", correct: false },
            ],
            explanation: "Explaining that fast-moving hazards don't wait for confirmation helps a younger student understand why real-time judgment matters, not just as an arbitrary rule.",
          },
          {
            id: "sentinels-m3-l5-5",
            prompt: "What's the ultimate goal of this module's hazard-mapping and route-judgment training, beyond memorizing any single floor's layout?",
            options: [
              { text: "Building a transferable skill for judging unfamiliar or changing conditions in any building", correct: true },
              { text: "Memorizing one specific floor plan permanently", correct: false },
              { text: "Learning to always wait for someone else's decision", correct: false },
              { text: "There's no broader goal beyond the specific floor plan taught", correct: false },
            ],
            explanation: "The real goal is a transferable judgment skill — one that works in any building, not just the specific floor plan used to teach it.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "sentinels-m4",
    name: "Chemical & Lab Incident Response",
    icon: "🧪",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "sentinels-m4-l1-1",
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
            id: "sentinels-m4-l1-2",
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
            id: "sentinels-m4-l1-3",
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
            id: "sentinels-m4-l1-4",
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
            id: "sentinels-m4-l1-5",
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
        level: 2,
        questions: [
          {
            id: "sentinels-m4-l2-1",
            prompt: "What does \"isolate the area\" mean in practice after a spill?",
            options: [
              { text: "Keep others from wandering through it while help is on the way", correct: true },
              { text: "Physically clean up the area yourself", correct: false },
              { text: "Ignore it unless someone asks about it", correct: false },
              { text: "Only isolate it if the spill is large", correct: false },
            ],
            explanation: "Isolating the area means actively keeping others away from it, not cleaning it up or waiting passively.",
          },
          {
            id: "sentinels-m4-l2-2",
            prompt: "Why is using an eyewash station \"just in case\" considered a problem?",
            options: [
              { text: "It can waste critical time and resources needed for an actual exposure", correct: true },
              { text: "There's no real downside to using it preventively", correct: false },
              { text: "Eyewash stations are unlimited and using them has no cost", correct: false },
              { text: "It only matters if multiple people try to use it at once", correct: false },
            ],
            explanation: "Using emergency equipment as a general precaution rather than for real exposure wastes time and resources that matter for actual incidents.",
          },
          {
            id: "sentinels-m4-l2-3",
            prompt: "What extra risk do chemical fumes carry beyond just blocking your visibility, unlike ordinary smoke?",
            options: [
              { text: "Additional health risks specific to whatever chemical is involved", correct: true },
              { text: "No extra risk — fumes and smoke are functionally identical", correct: false },
              { text: "Fumes are actually less risky than smoke in every case", correct: false },
              { text: "The extra risk only applies to very strong-smelling chemicals", correct: false },
            ],
            explanation: "Beyond blocking visibility like smoke, chemical fumes can carry their own specific health risks depending on the chemical involved.",
          },
          {
            id: "sentinels-m4-l2-4",
            prompt: "Why does a chemical splash on skin need protocol equipment right away, rather than waiting to see if it causes a problem?",
            options: [
              { text: "Symptoms from chemical exposure aren't always immediate, so waiting risks worse injury", correct: true },
              { text: "Skin exposure is never actually a serious concern", correct: false },
              { text: "Protocol equipment is only useful after symptoms already appear", correct: false },
              { text: "Waiting to see is actually the recommended first step", correct: false },
            ],
            explanation: "Chemical effects on skin aren't always immediately obvious — acting right away, rather than waiting for symptoms, is the safer approach.",
          },
          {
            id: "sentinels-m4-l2-5",
            prompt: "Why doesn't getting close to smell an unknown chemical actually give you reliable information?",
            options: [
              { text: "Smell alone can't tell you how dangerous a chemical actually is", correct: true },
              { text: "Smell is actually a very reliable way to judge chemical danger", correct: false },
              { text: "This only applies to chemicals with no smell at all", correct: false },
              { text: "Getting close is safe as long as you don't touch anything", correct: false },
            ],
            explanation: "Smell doesn't reliably indicate how dangerous a chemical is, which is why getting closer to identify it isn't actually useful — and it risks exposure besides.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "sentinels-m4-l3-1",
            prompt: "You notice a spill and immediately smell something unusual, but you're mid-experiment with your own setup nearby. What do you do?",
            options: [
              { text: "Stop your own work, alert others, and isolate the area regardless of your own experiment", correct: true },
              { text: "Finish your current step first, then address the spill", correct: false },
              { text: "Only alert others if the spill is directly next to you", correct: false },
              { text: "Assume someone else will notice and handle it", correct: false },
            ],
            explanation: "Alerting others and isolating the area takes priority over finishing your own work, regardless of how close the spill is to you.",
          },
          {
            id: "sentinels-m4-l3-2",
            prompt: "A classmate got a small amount of an unknown chemical on their hand and says it \"doesn't feel like anything yet.\" What's the correct response?",
            options: [
              { text: "Direct them to the eyewash/shower protocol and get a trained adult immediately, regardless of how it feels", correct: true },
              { text: "Wait to see if a feeling develops before acting", correct: false },
              { text: "Tell them it's probably fine since there's no sensation yet", correct: false },
              { text: "Suggest they just wash it off with whatever's nearby", correct: false },
            ],
            explanation: "The absence of an immediate sensation doesn't mean there's no exposure risk — protocol equipment and a trained adult should be used regardless.",
          },
          {
            id: "sentinels-m4-l3-3",
            prompt: "Fumes are present in your only usable stairwell. What's the right sequence?",
            options: [
              { text: "Look for an alternate route, and if none exists, shelter and report your exact location", correct: true },
              { text: "Push through the fumes since there's no other stairwell", correct: false },
              { text: "Wait indefinitely at the base of the stairwell", correct: false },
              { text: "Try to identify the fumes to judge if it's safe to pass through", correct: false },
            ],
            explanation: "If no alternate route exists, sheltering and reporting your location is the correct fallback — not pushing through unknown fumes.",
          },
          {
            id: "sentinels-m4-l3-4",
            prompt: "Why does \"per your training\" matter as a qualifier for using an eyewash station or emergency shower, rather than just \"use it if you think it's needed\"?",
            options: [
              { text: "Following the specific protocol ensures the equipment is used correctly and effectively", correct: true },
              { text: "The qualifier doesn't actually change anything meaningful", correct: false },
              { text: "\"If you think it's needed\" is actually the more precise standard", correct: false },
              { text: "Training only matters for adults operating the equipment", correct: false },
            ],
            explanation: "Following the specific trained protocol, rather than your own in-the-moment judgment alone, ensures the equipment is actually used effectively.",
          },
          {
            id: "sentinels-m4-l3-5",
            prompt: "Why should you report a spill even if you're not entirely sure something spilled, versus staying quiet until certain?",
            options: [
              { text: "Early reporting gives trained adults the best chance to assess and respond in time", correct: true },
              { text: "Uncertain reports are generally unhelpful and should be avoided", correct: false },
              { text: "You should always be fully certain before ever reporting anything", correct: false },
              { text: "It doesn't really matter when you report, timing is irrelevant", correct: false },
            ],
            explanation: "Reporting early, even with some uncertainty, gives trained adults the earliest possible chance to assess and respond correctly.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "sentinels-m4-l4-1",
            prompt: "A spill has occurred, and a classmate insists they can identify it because it smells like something they've encountered before. What's the risk in trusting that?",
            options: [
              { text: "Familiarity doesn't guarantee accuracy, and a wrong guess could lead to an unsafe response", correct: true },
              { text: "There's no real risk if the smell seems familiar", correct: false },
              { text: "Familiar smells are always accurately identified this way", correct: false },
              { text: "This concern only applies to completely unfamiliar smells", correct: false },
            ],
            explanation: "A familiar-seeming smell isn't a reliable identification method — a wrong guess could lead to an unsafe response, so proper reporting still matters.",
          },
          {
            id: "sentinels-m4-l4-2",
            prompt: "Why does \"chemical fumes can carry additional health risks beyond visibility loss\" matter even in a stairwell with good overall visibility?",
            options: [
              { text: "The health risk from fumes exists independent of how well you can see through them", correct: true },
              { text: "Good visibility means the fumes are automatically not a health risk", correct: false },
              { text: "This concern only applies when visibility is also poor", correct: false },
              { text: "Visibility and health risk are always directly linked", correct: false },
            ],
            explanation: "A chemical's health risk doesn't depend on how much it obscures your vision — good visibility doesn't mean the fumes themselves are safe to breathe.",
          },
          {
            id: "sentinels-m4-l4-3",
            prompt: "Why might waiting to use an eyewash station until you're \"completely sure it's needed\" actually be more dangerous than using it promptly on suspected exposure?",
            options: [
              { text: "Delaying treatment for confirmed or suspected direct exposure can worsen the outcome", correct: true },
              { text: "There's no real downside to waiting for full certainty first", correct: false },
              { text: "Prompt use is actually less effective than waiting", correct: false },
              { text: "This concern only applies to exposure involving the eyes specifically", correct: false },
            ],
            explanation: "For suspected direct exposure, delaying treatment while seeking full certainty can worsen the outcome — prompt use of the protocol matters more than waiting.",
          },
          {
            id: "sentinels-m4-l4-4",
            prompt: "Why is \"isolate the area\" listed as a first-reaction step, alongside alerting others, rather than something to do only after help arrives?",
            options: [
              { text: "Preventing others from walking through it reduces exposure risk immediately, without needing to wait", correct: true },
              { text: "Isolating the area is actually a job only for arriving responders", correct: false },
              { text: "It has no real urgency compared to simply alerting others", correct: false },
              { text: "This step only matters for very large spills", correct: false },
            ],
            explanation: "Isolating the area right away, rather than waiting for help to arrive, immediately reduces the number of people at risk of exposure.",
          },
          {
            id: "sentinels-m4-l4-5",
            prompt: "What's the common reasoning tying together \"don't self-identify,\" \"don't use equipment preventively,\" and \"report even with uncertainty\"?",
            options: [
              { text: "Each rule avoids acting on unreliable, self-generated certainty in favor of trained protocol", correct: true },
              { text: "The three rules are actually unrelated pieces of guidance", correct: false },
              { text: "They exist mainly to create extra steps, without a real shared purpose", correct: false },
              { text: "Only the reporting rule is genuinely grounded in safety reasoning", correct: false },
            ],
            explanation: "All three rules share the same logic: avoid acting on guesses or unearned confidence, and instead default to trained protocol and prompt, honest reporting.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "sentinels-m4-l5-1",
            prompt: "A spill occurs, a classmate has a small splash on their hand, and fumes are also drifting toward your usual exit. What's the correct full sequence?",
            options: [
              { text: "Alert others, direct the exposed classmate to protocol equipment and a trained adult, and reroute away from the fumes while reporting your location", correct: true },
              { text: "Handle the classmate's exposure first, then worry about the fumes afterward", correct: false },
              { text: "Prioritize evacuating past the fumes quickly, then handle the classmate's exposure once outside", correct: false },
              { text: "Wait for a single adult to arrive and handle all three issues in sequence yourself", correct: false },
            ],
            explanation: "Addressing the exposure through protocol while simultaneously rerouting away from fumes and reporting handles all three elements of the situation at once, rather than sequencing them in a way that delays any of them.",
          },
          {
            id: "sentinels-m4-l5-2",
            prompt: "Why does this module frame identification and cleanup as strictly outside your role, even for a Sentinel who might feel more capable than a Guardian-tier student?",
            options: [
              { text: "Accurate chemical identification requires specific training and equipment that age or confidence alone doesn't provide", correct: true },
              { text: "Sentinels are actually expected to identify and clean up chemical spills themselves", correct: false },
              { text: "This restriction only applies to Guardian-tier students, not Sentinels", correct: false },
              { text: "Confidence and age directly translate into safe identification ability", correct: false },
            ],
            explanation: "Accurate identification genuinely requires specific training and equipment — neither age nor confidence changes that, which is why the role stays the same across tiers.",
          },
          {
            id: "sentinels-m4-l5-3",
            prompt: "Why might \"per your training\" for emergency equipment use matter even more at this tier, where you're expected to help guide younger students too?",
            options: [
              { text: "Modeling correct, protocol-based behavior helps younger students learn the right response, not just your own safety", correct: true },
              { text: "Younger students don't actually observe or learn from Sentinel behavior", correct: false },
              { text: "This consideration only matters once you're a Warden", correct: false },
              { text: "Guiding others has no real connection to how you personally use equipment", correct: false },
            ],
            explanation: "As a Sentinel guiding younger students, your own protocol-following behavior becomes a model they learn from — which raises the stakes of doing it correctly.",
          },
          {
            id: "sentinels-m4-l5-4",
            prompt: "Why does \"report even without certainty\" apply just as strongly to a Sentinel confident in their own judgment as to anyone else?",
            options: [
              { text: "Confidence in your own judgment doesn't substitute for a trained adult's assessment of an unknown chemical", correct: true },
              { text: "Confident students are actually exempt from needing to report", correct: false },
              { text: "This rule only applies to students who lack confidence", correct: false },
              { text: "Personal confidence is itself a reliable substitute for expert assessment", correct: false },
            ],
            explanation: "No amount of personal confidence changes the fact that a trained adult's assessment is what's actually needed — the reporting rule applies regardless of how sure you feel.",
          },
          {
            id: "sentinels-m4-l5-5",
            prompt: "What's the deepest reason chemical incidents are handled so differently from hazards like fire or a cracked staircase, across this entire module?",
            options: [
              { text: "Chemical danger is often invisible and unpredictable without specific expertise, unlike more visibly obvious hazards", correct: true },
              { text: "Chemical incidents are actually simpler to judge than fire or structural damage", correct: false },
              { text: "There's no real difference in how any of these hazards should be judged", correct: false },
              { text: "Only the specific chemical's smell determines how it should be handled", correct: false },
            ],
            explanation: "Unlike fire or structural damage, which tend to be visibly obvious, a chemical's true danger is often invisible and requires specific expertise to judge — which is why every rule in this module defaults to distance and trained response.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "sentinels-m5",
    name: "Cyclone & Flood: Judgment Over Panic",
    icon: "🌊",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "sentinels-m5-l1-1",
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
            id: "sentinels-m5-l1-2",
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
            id: "sentinels-m5-l1-3",
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
            id: "sentinels-m5-l1-4",
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
            id: "sentinels-m5-l1-5",
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
      {
        level: 2,
        questions: [
          {
            id: "sentinels-m5-l2-1",
            prompt: "What's the recommended instinct to override during a cyclone: staying put, or getting somewhere else?",
            options: [
              { text: "The instinct to \"get somewhere else\"", correct: true },
              { text: "The instinct to stay put in an interior room", correct: false },
              { text: "Neither instinct needs overriding", correct: false },
              { text: "Both instincts are equally correct", correct: false },
            ],
            explanation: "The natural urge to move somewhere else is often wrong during a cyclone — staying in a protected interior room is usually correct.",
          },
          {
            id: "sentinels-m5-l2-2",
            prompt: "How much water can be enough to knock a person down, according to this module?",
            options: [
              { text: "As little as 15cm of fast-moving water", correct: true },
              { text: "Only water at least waist-deep", correct: false },
              { text: "Only water deeper than one meter", correct: false },
              { text: "Depth doesn't actually matter for this risk", correct: false },
            ],
            explanation: "Even a relatively shallow 15cm of fast-moving water can be enough to knock someone off their feet.",
          },
          {
            id: "sentinels-m5-l2-3",
            prompt: "What's the correct order when facing an earthquake-plus-gas-smell scenario?",
            options: [
              { text: "Protect yourself, reassess, check for secondary hazards, then choose a path", correct: true },
              { text: "Choose a path immediately, then reassess afterward", correct: false },
              { text: "Check for secondary hazards before protecting yourself", correct: false },
              { text: "Skip reassessment and act purely on instinct", correct: false },
            ],
            explanation: "This exact order — protect, reassess, check, then act — is what prevents walking into a worse hazard than the one you started with.",
          },
          {
            id: "sentinels-m5-l2-4",
            prompt: "What should a brief, confident instruction to a group during a hazard actually contain?",
            options: [
              { text: "The hazard, and the action to take", correct: true },
              { text: "A complete explanation of your full reasoning", correct: false },
              { text: "An open question asking what the group wants to do", correct: false },
              { text: "Nothing specific — tone alone is enough", correct: false },
            ],
            explanation: "Stating the hazard and the required action, briefly and confidently, is what actually gets a group moving.",
          },
          {
            id: "sentinels-m5-l2-5",
            prompt: "Why shouldn't you assume responders or staff already know your exact location during a flood?",
            options: [
              { text: "That assumption isn't reliable — confirming it yourself is safer", correct: true },
              { text: "Responders always know everyone's location automatically", correct: false },
              { text: "Location doesn't actually matter during a flood", correct: false },
              { text: "This concern only applies during fires, not floods", correct: false },
            ],
            explanation: "Assuming someone already knows where you are isn't reliable — actively communicating your location removes that uncertainty.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "sentinels-m5-l3-1",
            prompt: "Wind suddenly stops during an active cyclone warning, and a student asks if they can check the courtyard. What's your response as the most senior student present?",
            options: [
              { text: "No — this could be a lull, not the storm's end. Stay inside and wait for official confirmation", correct: true },
              { text: "Sure, it's probably fine since the wind has stopped", correct: false },
              { text: "Let them decide for themselves individually", correct: false },
              { text: "Only allow it if they go quickly", correct: false },
            ],
            explanation: "A confident, brief \"no, stay inside\" response, explaining the lull risk, is exactly the kind of direction this module asks you to give.",
          },
          {
            id: "sentinels-m5-l3-2",
            prompt: "You need to cross a hallway with visible moving water to reach an exit. What's the better judgment call?",
            options: [
              { text: "Avoid it and find another way, or wait for guidance", correct: true },
              { text: "Cross carefully since you're confident in your balance", correct: false },
              { text: "Test the depth with a stick first, then decide", correct: false },
              { text: "Cross quickly since moving water usually isn't too deep", correct: false },
            ],
            explanation: "Avoiding moving water entirely, rather than testing or trusting your own judgment about its depth, remains the safer choice regardless of confidence.",
          },
          {
            id: "sentinels-m5-l3-3",
            prompt: "After shaking stops, you find a damaged stair. Before even considering the stair, what should you check for?",
            options: [
              { text: "Any secondary hazards, like a gas smell, near the area", correct: true },
              { text: "Whether the stair looks usable enough to risk it", correct: false },
              { text: "Whether anyone else has already used it successfully", correct: false },
              { text: "Nothing else — the stair is the only concern", correct: false },
            ],
            explanation: "Checking for secondary hazards before focusing on the stair itself follows the correct protect-reassess-check-act sequence.",
          },
          {
            id: "sentinels-m5-l3-4",
            prompt: "A group looks to you for direction during a hazard, but you're genuinely unsure what to do. What's the better approach?",
            options: [
              { text: "Take a moment to assess, then give the clearest instruction you honestly can", correct: true },
              { text: "Project confidence regardless of whether you actually know the right move", correct: false },
              { text: "Stay silent until you're completely certain", correct: false },
              { text: "Ask the group to figure it out democratically", correct: false },
            ],
            explanation: "A brief, honest assessment followed by the clearest instruction you can genuinely give is better than false confidence or complete silence.",
          },
          {
            id: "sentinels-m5-l3-5",
            prompt: "You're sheltering during a flood and have time to spare. What should you use some of that time for?",
            options: [
              { text: "Confirming who's with you and communicating your location to staff", correct: true },
              { text: "Assuming everything is already handled since you have time", correct: false },
              { text: "Nothing in particular — just wait passively", correct: false },
              { text: "Focusing only on your own situation, not checking on others", correct: false },
            ],
            explanation: "Using available time to confirm your group and communicate location is exactly the kind of proactive use this module recommends.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "sentinels-m5-l4-1",
            prompt: "A lull happens during a cyclone that was forecast as \"minor.\" Does the forecast change how you should treat the lull?",
            options: [
              { text: "No — treat any lull with the same caution regardless of the storm's forecast severity", correct: true },
              { text: "Yes, a minor forecast means the lull is definitely safe", correct: false },
              { text: "Only treat lulls cautiously during forecasts of severe storms", correct: false },
              { text: "Forecast severity is the only factor that matters here", correct: false },
            ],
            explanation: "A storm's true behavior can differ from its forecast, so the same lull caution applies regardless of how the storm was initially described.",
          },
          {
            id: "sentinels-m5-l4-2",
            prompt: "Why does \"even 15cm of fast-moving water can knock a person down\" matter more than someone's personal strength or size?",
            options: [
              { text: "The physics of moving water's force doesn't meaningfully change based on the person", correct: true },
              { text: "Strength and size fully protect against this specific risk", correct: false },
              { text: "This concern only applies to smaller or weaker individuals", correct: false },
              { text: "15cm of water is actually never genuinely dangerous", correct: false },
            ],
            explanation: "The physical force of moving water doesn't change meaningfully based on a person's size or strength, which is why the caution applies broadly.",
          },
          {
            id: "sentinels-m5-l4-3",
            prompt: "Why might skipping the \"reassess\" step, and going straight from \"protect yourself\" to \"choose a path,\" still be risky even if you genuinely feel calm?",
            options: [
              { text: "Feeling calm doesn't guarantee you've actually noticed a secondary hazard yet", correct: true },
              { text: "Reassessing is only necessary if you're feeling panicked", correct: false },
              { text: "Calm feelings are a reliable substitute for actually checking conditions", correct: false },
              { text: "This step can safely be skipped whenever you feel confident", correct: false },
            ],
            explanation: "Feeling calm doesn't substitute for actually checking conditions — the reassess step exists to catch hazards you haven't consciously noticed yet, regardless of your emotional state.",
          },
          {
            id: "sentinels-m5-l4-4",
            prompt: "Why does \"confident tone\" matter as much as \"correct information\" when directing a group during a hazard?",
            options: [
              { text: "Hesitation itself can cause a crowd to freeze, even if your information is accurate", correct: true },
              { text: "Tone is actually irrelevant as long as the information is correct", correct: false },
              { text: "Correct information always overrides any effect of tone", correct: false },
              { text: "This only matters for very large groups", correct: false },
            ],
            explanation: "Even accurate information can fail to move a group if delivered hesitantly — confident tone is what actually gets people to act on it.",
          },
          {
            id: "sentinels-m5-l4-5",
            prompt: "Why does communicating your location during a flood matter even if you're confident someone will eventually find you?",
            options: [
              { text: "\"Eventually\" can mean a costly delay compared to actively confirming your location now", correct: true },
              { text: "Confidence that you'll be found removes any need to communicate", correct: false },
              { text: "Location communication is only useful if you're not confident you'll be found", correct: false },
              { text: "There's no real time cost to being found \"eventually\"", correct: false },
            ],
            explanation: "Even confidence that you'll eventually be found doesn't eliminate the time cost of that delay — actively communicating now closes that gap.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "sentinels-m5-l5-1",
            prompt: "You're the most senior student present during a flood, wind has just gone quiet during an active cyclone, and a younger student is asking whether it's safe to check outside. What's the best full response?",
            options: [
              { text: "Calmly and confidently say no, explain briefly that it could be a lull, and direct everyone to stay in the interior room while you confirm your group's status", correct: true },
              { text: "Say no without any explanation, since explanations aren't necessary from a leader", correct: false },
              { text: "Let the student decide for themselves since it's ultimately their choice", correct: false },
              { text: "Go check yourself first, then report back what you find", correct: false },
            ],
            explanation: "A brief, confident, correct instruction — paired with actually confirming your group's status — combines every element this module emphasizes: judgment, tone, and using available time well.",
          },
          {
            id: "sentinels-m5-l5-2",
            prompt: "Why is this module titled \"Judgment Over Panic\" rather than simply listing cyclone and flood safety rules?",
            options: [
              { text: "The real skill being taught is overriding panic-driven instincts with calm, reasoned judgment", correct: true },
              { text: "The title is purely stylistic, with no connection to the actual content", correct: false },
              { text: "Panic is actually irrelevant to how these specific hazards should be handled", correct: false },
              { text: "Judgment and panic are treated as the same thing in this module", correct: false },
            ],
            explanation: "The core lesson is about overriding panic-driven instincts — like the urge to \"do something\" during a lull — with calm, informed judgment, which is exactly what the title reflects.",
          },
          {
            id: "sentinels-m5-l5-3",
            prompt: "Why does the \"protect, reassess, check, act\" sequence apply just as strongly to a confident Sentinel as to someone less experienced?",
            options: [
              { text: "Confidence doesn't replace the actual information each step in the sequence is designed to surface", correct: true },
              { text: "The sequence is really only necessary for less experienced or less confident students", correct: false },
              { text: "Confident students are naturally exempt from needing to reassess", correct: false },
              { text: "Experience level directly changes what the sequence accomplishes", correct: false },
            ],
            explanation: "No amount of confidence substitutes for the actual information each step surfaces — the sequence protects against blind spots regardless of experience.",
          },
          {
            id: "sentinels-m5-l5-4",
            prompt: "Why might using time well during a slow-moving disaster be considered a leadership skill, not just a personal safety habit?",
            options: [
              { text: "Confirming your group and communicating location benefits everyone with you, not just yourself", correct: true },
              { text: "It's purely a personal habit with no effect on anyone else", correct: false },
              { text: "This idea only applies to designated Wardens, not Sentinels", correct: false },
              { text: "Using time well has no real connection to leadership", correct: false },
            ],
            explanation: "Confirming your group's status and communicating location has a direct effect on the safety of everyone with you, which is exactly what makes it a leadership action.",
          },
          {
            id: "sentinels-m5-l5-5",
            prompt: "What's the underlying connection between \"a lull isn't the end of the storm\" and \"most injuries happen from moving during shaking, not the shaking itself,\" from the earthquake module?",
            options: [
              { text: "Both highlight how the moment right after a hazard feels safe can actually be the most dangerous time to act rashly", correct: true },
              { text: "The two ideas are completely unrelated across the different hazard types", correct: false },
              { text: "Both ideas actually recommend taking immediate action the moment things feel calmer", correct: false },
              { text: "Only one of the two ideas has any real safety basis", correct: false },
            ],
            explanation: "Both lessons point to the same underlying trap: the moment a hazard feels like it's easing up is often exactly when a rash decision — checking outside, or moving too soon — creates the most risk.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "sentinels-m6",
    name: "Multi-Hazard Compound Drill & Leading Under Pressure",
    icon: "⚠️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "sentinels-m6-l1-1",
            prompt: "Why does this module state that \"compound scenarios are the norm, not the exception\"?",
            options: [
              { text: "Real disasters rarely stay in one category, so combined hazards are common, not rare", correct: true },
              { text: "Compound scenarios are actually extremely rare in reality", correct: false },
              { text: "It's simply a dramatic phrase without real basis", correct: false },
              { text: "Only very large disasters ever involve more than one hazard", correct: false },
            ],
            explanation: "Real disasters commonly combine hazards, which is exactly why this module trains you to keep re-evaluating rather than locking into one plan.",
          },
          {
            id: "sentinels-m6-l1-2",
            prompt: "In the earthquake → damaged stair → gas smell sequence, what should you do first?",
            options: [
              { text: "Protect yourself during the shaking", correct: true },
              { text: "Move immediately toward the stair", correct: false },
              { text: "Investigate the gas smell's source", correct: false },
              { text: "Decide on a path before assessing anything", correct: false },
            ],
            explanation: "Protecting yourself during the actual shaking always comes first, before assessing the stair or the gas smell.",
          },
          {
            id: "sentinels-m6-l1-3",
            prompt: "Why is \"just get out\" without this sequence potentially dangerous?",
            options: [
              { text: "It can lead people to walk into a worse hazard than the one they left", correct: true },
              { text: "It's actually always the fastest and safest option", correct: false },
              { text: "There's no real danger in skipping the sequence", correct: false },
              { text: "This concern only applies to very complex buildings", correct: false },
            ],
            explanation: "Skipping the sequence and just reacting can mean missing a second hazard entirely, walking straight into something worse.",
          },
          {
            id: "sentinels-m6-l1-4",
            prompt: "As the most senior student present, what should you communicate to your group?",
            options: [
              { text: "\"Stair B has smoke — we're using Stair A, follow me\"", correct: true },
              { text: "A lengthy explanation of every hazard you've identified", correct: false },
              { text: "Nothing — let the group figure it out themselves", correct: false },
              { text: "An open question about which stair the group prefers", correct: false },
            ],
            explanation: "A brief, clear statement of the hazard and the action — paired with visibly leading — is the model of effective communication this module teaches.",
          },
          {
            id: "sentinels-m6-l1-5",
            prompt: "Why does hesitation from a leader matter as much as being factually correct?",
            options: [
              { text: "Hesitation itself can cause a crowd to freeze, regardless of how correct the information is", correct: true },
              { text: "Hesitation has no real effect on a group's behavior", correct: false },
              { text: "Being factually correct always overrides any hesitation", correct: false },
              { text: "This concern only applies to very large groups", correct: false },
            ],
            explanation: "A hesitant leader can cause a crowd to freeze even with accurate information — confidence in delivery matters alongside accuracy.",
          },
        ],
      },
      {
        level: 2,
        questions: [
          {
            id: "sentinels-m6-l2-1",
            prompt: "What's the second step in the correct sequence, right after protecting yourself?",
            options: [
              { text: "Reassess — don't move during aftershocks toward an unconfirmed route", correct: true },
              { text: "Immediately choose the fastest visible path", correct: false },
              { text: "Alert responders before doing anything else", correct: false },
              { text: "Skip straight to checking for secondary hazards", correct: false },
            ],
            explanation: "Reassessing — and specifically not moving during aftershocks — is the deliberate second step before checking for secondary hazards.",
          },
          {
            id: "sentinels-m6-l2-2",
            prompt: "What's the third step in the sequence, after protecting yourself and reassessing?",
            options: [
              { text: "Check for secondary hazards, like gas, before choosing a path", correct: true },
              { text: "Choose a path immediately without further checking", correct: false },
              { text: "Return to your original starting point", correct: false },
              { text: "Wait indefinitely without taking any further action", correct: false },
            ],
            explanation: "Checking for secondary hazards comes before choosing a path — skipping this step is what leads people into a second, worse hazard.",
          },
          {
            id: "sentinels-m6-l2-3",
            prompt: "Why do real disasters \"rarely stay in one category,\" according to this module?",
            options: [
              { text: "One hazard, like an earthquake, can trigger another, like a gas leak", correct: true },
              { text: "Disasters are actually always confined to one clear category", correct: false },
              { text: "This idea only applies to extremely severe events", correct: false },
              { text: "It has no real basis in how disasters actually unfold", correct: false },
            ],
            explanation: "One hazard commonly triggers another — an earthquake damaging a gas line is a direct example of this pattern.",
          },
          {
            id: "sentinels-m6-l2-4",
            prompt: "What two things should a good group instruction include, according to this module?",
            options: [
              { text: "The hazard, and the action to take", correct: true },
              { text: "A full explanation and a personal opinion", correct: false },
              { text: "A question and a suggestion", correct: false },
              { text: "Just a general reassurance", correct: false },
            ],
            explanation: "Stating the hazard and the required action, briefly, is the format this module recommends for group instructions.",
          },
          {
            id: "sentinels-m6-l2-5",
            prompt: "Why does confidence in tone matter alongside accurate information when leading a group?",
            options: [
              { text: "Confidence helps prevent the freeze response that hesitation can trigger in a crowd", correct: true },
              { text: "Tone has no real effect on how a group responds", correct: false },
              { text: "Accurate information always works regardless of delivery", correct: false },
              { text: "Confidence only matters for very large groups", correct: false },
            ],
            explanation: "Confident delivery helps prevent a crowd freeze that hesitation alone can trigger, even when the underlying information is accurate.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "sentinels-m6-l3-1",
            prompt: "Shaking has just stopped, and before you've fully reassessed, you feel a possible aftershock. What's correct?",
            options: [
              { text: "Protect yourself again during the aftershock before continuing to reassess", correct: true },
              { text: "Continue reassessing regardless of the aftershock", correct: false },
              { text: "Skip ahead to choosing a path immediately", correct: false },
              { text: "Assume the aftershock isn't significant enough to pause for", correct: false },
            ],
            explanation: "An aftershock always takes priority — protecting yourself again comes before continuing any reassessment.",
          },
          {
            id: "sentinels-m6-l3-2",
            prompt: "You've reassessed after shaking stops and are about to check for secondary hazards when a younger student starts moving toward a stairwell alone. What do you do?",
            options: [
              { text: "Give a brief, clear instruction to stop and follow you, then continue your hazard check", correct: true },
              { text: "Let them go, since your own hazard check takes priority", correct: false },
              { text: "Follow them immediately without giving any instruction first", correct: false },
              { text: "Ignore them and continue your check alone", correct: false },
            ],
            explanation: "A brief instruction to bring them with you lets you keep them safe without fully abandoning your own hazard-checking process.",
          },
          {
            id: "sentinels-m6-l3-3",
            prompt: "You've identified that Stair B has smoke. What's the most effective way to communicate this to your group?",
            options: [
              { text: "\"Stair B has smoke — we're using Stair A, follow me\"", correct: true },
              { text: "\"I think Stair B might not be great, maybe consider Stair A?\"", correct: false },
              { text: "A detailed explanation of exactly how much smoke you observed", correct: false },
              { text: "Silence, while you personally head toward Stair A", correct: false },
            ],
            explanation: "A direct statement of the hazard and the action, paired with visibly leading, is far more effective than a tentative suggestion or silent action alone.",
          },
          {
            id: "sentinels-m6-l3-4",
            prompt: "Why does skipping straight from \"protect yourself\" to \"choose a path\" risk missing a hazard like a gas leak?",
            options: [
              { text: "The reassess and secondary-hazard-check steps are specifically what surface hazards like gas leaks", correct: true },
              { text: "Gas leaks are always immediately obvious without any specific checking", correct: false },
              { text: "Skipping steps has no real effect on what you might miss", correct: false },
              { text: "This concern only applies to very large gas leaks", correct: false },
            ],
            explanation: "The reassess and secondary-hazard-check steps exist specifically to catch hazards like gas leaks that aren't obvious in the first moment after shaking stops.",
          },
          {
            id: "sentinels-m6-l3-5",
            prompt: "Why might staying silent while personally moving toward a safer route actually be less effective leadership than a brief spoken instruction?",
            options: [
              { text: "Silent action alone doesn't guarantee the group understands the hazard or follows your lead", correct: true },
              { text: "Silent action is always at least as effective as spoken instruction", correct: false },
              { text: "Groups can always infer hazards accurately just from watching your movement", correct: false },
              { text: "Speaking is only necessary for very large groups", correct: false },
            ],
            explanation: "Without a spoken instruction, the group may not understand why you're moving or reliably follow — a brief spoken direction removes that ambiguity.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "sentinels-m6-l4-1",
            prompt: "You're mid-sequence — you've protected yourself and reassessed — when you notice TWO possible secondary hazards: a faint gas smell and a small amount of smoke from a different direction. What's the right approach?",
            options: [
              { text: "Identify a route that avoids both, rather than picking one hazard to address and ignoring the other", correct: true },
              { text: "Address whichever hazard seems more severe and ignore the other entirely", correct: false },
              { text: "Pick a path at random since dealing with two hazards is too complex", correct: false },
              { text: "Wait exactly where you are until one of the two hazards resolves itself", correct: false },
            ],
            explanation: "With two secondary hazards present, finding a route that avoids both is more thorough than picking one to address while ignoring the other.",
          },
          {
            id: "sentinels-m6-l4-2",
            prompt: "Why does \"real disasters don't stay in one category\" matter for how you personally prepare, not just how you react in the moment?",
            options: [
              { text: "It means mentally rehearsing multi-hazard scenarios in advance, not just single-hazard drills", correct: true },
              { text: "It only affects how responders should prepare, not students", correct: false },
              { text: "It has no real bearing on preparation, only on-the-spot reaction", correct: false },
              { text: "This idea is purely theoretical with no practical preparation implications", correct: false },
            ],
            explanation: "Understanding that hazards can combine means preparation should include multi-hazard thinking, not just rehearsing single, isolated scenarios.",
          },
          {
            id: "sentinels-m6-l4-3",
            prompt: "Why might a younger student following your lead without question actually increase your responsibility, rather than simplify the situation?",
            options: [
              { text: "Their trust means your judgment call directly determines their safety, not just your own", correct: true },
              { text: "It actually reduces your responsibility since they're making their own choice to follow", correct: false },
              { text: "Trust from younger students has no real bearing on your responsibility", correct: false },
              { text: "This only matters if the younger student is related to you", correct: false },
            ],
            explanation: "A younger student's trust in your lead means your judgment now directly affects their safety too, which raises the stakes of getting the call right.",
          },
          {
            id: "sentinels-m6-l4-4",
            prompt: "Why does \"state the hazard, state the action, move\" work better under real pressure than a more collaborative, discussion-based approach?",
            options: [
              { text: "Fast-moving hazards don't leave time for open discussion before action is needed", correct: true },
              { text: "Discussion-based approaches are always faster in a real emergency", correct: false },
              { text: "There's no real time pressure difference between the two approaches", correct: false },
              { text: "Discussion is only slower when the group is very large", correct: false },
            ],
            explanation: "Fast-moving hazards require action before there's time for open discussion — the direct, brief format is built for that time pressure.",
          },
          {
            id: "sentinels-m6-l4-5",
            prompt: "Why does confident tone remain important even in a compound scenario where you're genuinely uncertain about the best path?",
            options: [
              { text: "You can be confident in the process — checking, reassessing — even without full certainty about the outcome", correct: true },
              { text: "Confidence should only be projected when you're fully certain of the correct answer", correct: false },
              { text: "Uncertainty means you should avoid giving any instructions at all", correct: false },
              { text: "Tone stops mattering once the situation becomes genuinely complex", correct: false },
            ],
            explanation: "Confidence can come from trusting the process itself — checking and reassessing carefully — even when you're not certain of the final answer yet.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "sentinels-m6-l5-1",
            prompt: "You're the most senior student present after an earthquake. A stair is damaged, you smell gas near it, and a younger student is frozen nearby. What's the best full sequence of actions?",
            options: [
              { text: "Protect yourself through any aftershock, reassess, note both hazards, then give a brief instruction that redirects the group (including the frozen student) to a safer route", correct: true },
              { text: "Immediately grab the frozen student and rush toward the damaged stair since it's the nearest way out", correct: false },
              { text: "Investigate the gas smell closely to confirm it before deciding on any action", correct: false },
              { text: "Wait for someone else to take charge since the situation involves multiple hazards", correct: false },
            ],
            explanation: "This combines every element of the module — sequencing, secondary-hazard awareness, and confident group leadership — into one coherent response that also accounts for the frozen student.",
          },
          {
            id: "sentinels-m6-l5-2",
            prompt: "Why is this module positioned as the capstone for the Sentinels tier, combining judgment, sequencing, AND leadership, rather than teaching each skill separately?",
            options: [
              { text: "Real multi-hazard situations require all three skills simultaneously, not one at a time", correct: true },
              { text: "It's simply a convenient way to organize the curriculum, without a deeper reason", correct: false },
              { text: "Combining the skills actually makes the situation simpler to handle", correct: false },
              { text: "Leadership is unrelated to judgment and sequencing in a real scenario", correct: false },
            ],
            explanation: "A real compound scenario doesn't wait for you to apply one skill at a time — judgment, sequencing, and leadership all have to work together, which is why this module combines them.",
          },
          {
            id: "sentinels-m6-l5-3",
            prompt: "Why does \"just get out\" fail specifically as a leadership instruction, not just as a personal response?",
            options: [
              { text: "It gives a group no specific hazard or action to follow, increasing the risk of a scattered, unsafe response", correct: true },
              { text: "\"Just get out\" is actually a perfectly clear leadership instruction", correct: false },
              { text: "This concern only applies to personal responses, not group instructions", correct: false },
              { text: "Groups always interpret vague instructions the same, safe way", correct: false },
            ],
            explanation: "As a group instruction, \"just get out\" provides no specific hazard or action, which can lead to a scattered, uncoordinated response — exactly what brief, specific instructions are meant to prevent.",
          },
          {
            id: "sentinels-m6-l5-4",
            prompt: "Why might the skills in this module — sequencing and confident communication — matter just as much in a single-hazard situation as in a compound one?",
            options: [
              { text: "The same underlying judgment and communication skills apply, compound scenario or not", correct: true },
              { text: "These skills are actually only relevant to compound, multi-hazard scenarios", correct: false },
              { text: "Single-hazard situations never require any real judgment or communication", correct: false },
              { text: "This module's lessons don't transfer to simpler situations at all", correct: false },
            ],
            explanation: "The core skills — sequencing your response and communicating clearly under pressure — are valuable in any hazard situation, not just compound ones; this module simply pushes you to apply them at their hardest.",
          },
          {
            id: "sentinels-m6-l5-5",
            prompt: "What's the ultimate difference this capstone module is trying to build between a Sentinel and a Guardian-tier student, beyond just more advanced hazard facts?",
            options: [
              { text: "The ability to sequence judgment under pressure AND lead others through it, not just react correctly yourself", correct: true },
              { text: "There's no real difference beyond simply knowing more hazard facts", correct: false },
              { text: "Guardians are actually expected to lead others just as much as Sentinels", correct: false },
              { text: "The difference is purely about age, with no real skill distinction", correct: false },
            ],
            explanation: "This capstone module is specifically building the combined skill of sequencing judgment under pressure while also leading others through it — a step beyond reacting correctly on your own.",
          },
        ],
      },
    ],
  },
];
