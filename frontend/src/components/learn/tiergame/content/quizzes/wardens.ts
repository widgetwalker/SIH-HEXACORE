import type { QuizModule } from "../../types";

/* Wardens (Ages 18+) Quiz Arena. One quiz per real module, 5 levels of
   5 questions each, 4-option questions with a command and coordination
   angle, grounded in their modules' focus on leading others and handing
   off to responders. */
export const WARDENS_QUIZ_MODULES: QuizModule[] = [
  {
    moduleId: "wardens-m1",
    name: "Earthquake: Command Decisions Under Shaking",
    icon: "🌍",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "wardens-m1-l1-1",
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
            id: "wardens-m1-l1-2",
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
            id: "wardens-m1-l1-3",
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
            id: "wardens-m1-l1-4",
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
            id: "wardens-m1-l1-5",
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
        questions: [
          {
            id: "wardens-m1-l2-1",
            prompt: "Why must you take cover yourself before doing anything to help organize others?",
            options: [
              { text: "You can't lead an evacuation if you're injured in the first moments", correct: true },
              { text: "Wardens are actually exempt from needing to take cover", correct: false },
              { text: "Organizing others is always more urgent than your own safety", correct: false },
              { text: "This rule only applies to newer wardens", correct: false },
            ],
            explanation: "An injured warden can't lead — your own safety in the first moments directly enables your ability to help others afterward.",
          },
          {
            id: "wardens-m1-l2-2",
            prompt: "What three things does a warden's rapid post-shake triage cover?",
            options: [
              { text: "Injuries nearby, structural damage, and route usability", correct: true },
              { text: "Only the number of students present", correct: false },
              { text: "Only whether the alarm has sounded", correct: false },
              { text: "Only the building's overall age and condition", correct: false },
            ],
            explanation: "Triage covers injuries, structural damage, and route usability — all within a fast, roughly one-minute assessment.",
          },
          {
            id: "wardens-m1-l2-3",
            prompt: "Why does \"this way, other stairs\" work better than a longer explanation during an evacuation?",
            options: [
              { text: "Short, directive instructions get people moving faster than explanations do", correct: true },
              { text: "Longer explanations are always more effective under pressure", correct: false },
              { text: "There's no real difference in effectiveness between the two", correct: false },
              { text: "Short instructions only matter for very large groups", correct: false },
            ],
            explanation: "Brevity moves people faster — a directive instruction gets action started immediately, unlike a longer explanation.",
          },
          {
            id: "wardens-m1-l2-4",
            prompt: "Why is a distant, one-time shouted warning less effective than physically positioning yourself at a hazard?",
            options: [
              { text: "People moving out of habit under stress often don't register a distant warning", correct: true },
              { text: "Shouted warnings are always equally effective as physical positioning", correct: false },
              { text: "Physical positioning is actually less effective in most cases", correct: false },
              { text: "This distinction only matters for very quiet warnings", correct: false },
            ],
            explanation: "Habit-driven movement under stress often overrides a one-time distant warning — physically being there is what actually redirects people.",
          },
          {
            id: "wardens-m1-l2-5",
            prompt: "If a route becomes unsafe mid-evacuation, when should you communicate that to responders?",
            options: [
              { text: "Redirect people immediately, and report it as soon as possible, not only afterward", correct: true },
              { text: "Only after the entire evacuation has finished", correct: false },
              { text: "Never — responders will figure it out themselves", correct: false },
              { text: "Only if someone is actually injured on that route", correct: false },
            ],
            explanation: "Both an immediate redirect and prompt reporting matter — waiting until the evacuation fully finishes delays information responders need sooner.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "wardens-m1-l3-1",
            prompt: "Shaking has just stopped. You have a choice between beginning triage immediately or first confirming with another warden. What's correct?",
            options: [
              { text: "Begin your own rapid triage immediately — coordination with other wardens can happen as you go", correct: true },
              { text: "Wait for confirmation from another warden before starting anything", correct: false },
              { text: "Skip triage entirely and move straight to directing evacuation", correct: false },
              { text: "Wait for responders to arrive before doing any assessment", correct: false },
            ],
            explanation: "Starting your own triage immediately, while coordinating with others as you go, is faster than waiting for confirmation before beginning.",
          },
          {
            id: "wardens-m1-l3-2",
            prompt: "During triage, you find a minor injury and a cracked wall at the same time. What should guide your next action?",
            options: [
              { text: "Address whichever poses the more immediate risk to the group's evacuation first", correct: true },
              { text: "Always address the injury first, regardless of the wall's risk", correct: false },
              { text: "Always address structural damage first, regardless of the injury", correct: false },
              { text: "Address neither until responders arrive", correct: false },
            ],
            explanation: "Judging which poses more immediate risk to the group's overall evacuation is what should guide your next action, rather than a fixed rule for every situation.",
          },
          {
            id: "wardens-m1-l3-3",
            prompt: "You're directing evacuation and notice people beginning to bunch up at one stairwell. What's the correct response?",
            options: [
              { text: "Give a short, clear redirect toward the alternate stairwell to prevent a bottleneck", correct: true },
              { text: "Let the bunching resolve itself naturally", correct: false },
              { text: "Wait to see if it becomes a serious problem before acting", correct: false },
              { text: "Move to the back of the crowd to help push people through", correct: false },
            ],
            explanation: "A short, clear redirect prevents a bottleneck from developing further — waiting for it to resolve itself risks it worsening.",
          },
          {
            id: "wardens-m1-l3-4",
            prompt: "A route you initially assessed as safe develops a new hazard 5 minutes into the evacuation. What's the correct sequence?",
            options: [
              { text: "Redirect people immediately, loudly, and reassess your overall plan", correct: true },
              { text: "Continue with the original plan since it was correct initially", correct: false },
              { text: "Quietly note it for later without acting immediately", correct: false },
              { text: "Wait for a formal report before redirecting anyone", correct: false },
            ],
            explanation: "An immediate, loud redirect combined with reassessing your plan reflects that conditions — and therefore your plan — can change mid-evacuation.",
          },
          {
            id: "wardens-m1-l3-5",
            prompt: "Why does modeling Drop-Cover-Hold yourself matter for your later effectiveness as a leader, beyond just your personal safety?",
            options: [
              { text: "Others may look to your behavior as a cue for what to do, especially early on", correct: true },
              { text: "Modeling behavior has no real effect on others' actions", correct: false },
              { text: "This only matters if you're specifically asked to demonstrate it", correct: false },
              { text: "Personal safety and leadership effectiveness are entirely unrelated", correct: false },
            ],
            explanation: "People often look to a warden's visible behavior as a cue, which means modeling the correct response yourself has an effect beyond your own safety.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "wardens-m1-l4-1",
            prompt: "You're mid-triage when you notice a second warden giving conflicting directions to the same group. What's the best response?",
            options: [
              { text: "Quickly coordinate with the other warden to align on one clear direction", correct: true },
              { text: "Give your own separate direction to the group as well", correct: false },
              { text: "Ignore it and continue your own triage independently", correct: false },
              { text: "Wait to see whose direction the group follows first", correct: false },
            ],
            explanation: "Conflicting directions can confuse a group under stress — quickly aligning with the other warden prevents that confusion from compounding.",
          },
          {
            id: "wardens-m1-l4-2",
            prompt: "Why might \"this way, other stairs\" sometimes need a brief follow-up, like pointing or physically leading, rather than words alone?",
            options: [
              { text: "Under high stress, people may need a visible cue in addition to a verbal instruction", correct: true },
              { text: "Verbal instructions are always sufficient on their own", correct: false },
              { text: "Physical cues are actually unnecessary in every case", correct: false },
              { text: "This concern only applies to very large groups", correct: false },
            ],
            explanation: "High stress can reduce how well people process verbal instructions alone — a visible cue like pointing or leading reinforces the direction.",
          },
          {
            id: "wardens-m1-l4-3",
            prompt: "Why does \"position yourself so you can see both the group and the route ahead\" matter specifically for a warden's role?",
            options: [
              { text: "It lets you catch a new hazard on the route while still monitoring the group's movement", correct: true },
              { text: "Visibility of the route doesn't actually matter once evacuation has started", correct: false },
              { text: "This positioning is only relevant before evacuation begins", correct: false },
              { text: "Monitoring the group is unrelated to monitoring the route", correct: false },
            ],
            explanation: "Positioning to see both lets you catch a developing hazard on the route while still tracking how the group itself is moving.",
          },
          {
            id: "wardens-m1-l4-4",
            prompt: "Why might waiting for a hazard to be \"fully confirmed\" before redirecting people actually cost more than acting on a strong suspicion?",
            options: [
              { text: "The delay from waiting for full confirmation can let more people commit to an unsafe route", correct: true },
              { text: "Waiting for full confirmation never actually costs anything meaningful", correct: false },
              { text: "Acting on suspicion alone is always less effective than waiting", correct: false },
              { text: "This tradeoff only matters for very minor hazards", correct: false },
            ],
            explanation: "Every moment spent waiting for full confirmation is a moment more people can commit to a route that turns out to be unsafe.",
          },
          {
            id: "wardens-m1-l4-5",
            prompt: "Why does a warden's own calm demeanor matter even during the triage phase, before any group direction has started?",
            options: [
              { text: "People nearby may already be observing and reacting to your visible demeanor during triage", correct: true },
              { text: "Demeanor only starts to matter once formal directions begin", correct: false },
              { text: "Triage is a private process that others don't observe", correct: false },
              { text: "This concern is unrelated to the warden role specifically", correct: false },
            ],
            explanation: "Even during triage, people nearby can be observing and reacting to a warden's visible demeanor, which is why calm behavior matters from the very start.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "wardens-m1-l5-1",
            prompt: "You're triaging your floor when you find a minor injury, notice people drifting toward a cracked stairwell out of habit, AND feel a possible aftershock. What's the correct full sequence?",
            options: [
              { text: "Take cover through the aftershock, then physically redirect people from the cracked stairwell, then address the injury once the group is safely moving", correct: true },
              { text: "Address the injury first since it's the most personally urgent issue", correct: false },
              { text: "Redirect the crowd first, then take cover if the aftershock actually happens", correct: false },
              { text: "Handle all three simultaneously without any real prioritization", correct: false },
            ],
            explanation: "An aftershock takes priority for everyone's safety, then redirecting the crowd prevents a larger-scale injury risk, and the minor injury — while important — can follow once the group is safely moving.",
          },
          {
            id: "wardens-m1-l5-2",
            prompt: "Why does this module frame \"Drop-Cover-Hold still applies to you\" as a genuinely important lesson for a warden, rather than an obvious point not worth repeating?",
            options: [
              { text: "The instinct to immediately start organizing others can tempt a warden to skip their own safety response", correct: true },
              { text: "Wardens are actually naturally immune to this particular instinct", correct: false },
              { text: "The point is purely redundant with no real teaching value", correct: false },
              { text: "This lesson only matters for wardens with no leadership experience", correct: false },
            ],
            explanation: "A warden's instinct to immediately help others can genuinely tempt them to skip their own safety response first — which is exactly why this lesson is worth stating explicitly, not just assumed.",
          },
          {
            id: "wardens-m1-l5-3",
            prompt: "Why might \"rapid triage within about a minute\" be a deliberately imperfect but useful standard, rather than a precise, guaranteed timeframe?",
            options: [
              { text: "It sets a practical urgency benchmark without pretending real conditions are perfectly predictable", correct: true },
              { text: "The one-minute mark is always achievable exactly as stated in every scenario", correct: false },
              { text: "Precision in timing matters more than the urgency the standard conveys", correct: false },
              { text: "This standard has no real practical value beyond sounding specific", correct: false },
            ],
            explanation: "The roughly-one-minute standard conveys real urgency without falsely promising that every situation fits a precise timeframe — it's a practical benchmark, not a guarantee.",
          },
          {
            id: "wardens-m1-l5-4",
            prompt: "Why does \"redirect immediately and loudly\" scale in importance the larger the group under your direction becomes?",
            options: [
              { text: "A larger group has more people who could commit to an unsafe route before hearing a quieter or delayed warning", correct: true },
              { text: "Group size actually has no bearing on how urgently a redirect matters", correct: false },
              { text: "Loud, immediate redirects only matter for very small groups", correct: false },
              { text: "This principle reverses for larger groups, where a quieter approach is better", correct: false },
            ],
            explanation: "The larger the group, the more people are at risk of committing to an unsafe route before a delayed or quiet warning reaches them — which is exactly why immediacy and volume both matter more at scale.",
          },
          {
            id: "wardens-m1-l5-5",
            prompt: "What's the underlying leadership principle connecting \"take cover yourself first,\" \"give short directive instructions,\" and \"physically position yourself at a hazard\"?",
            options: [
              { text: "Effective leadership in a crisis is expressed through direct, visible action, not just correct knowledge", correct: true },
              { text: "The three ideas are actually unrelated aspects of the warden role", correct: false },
              { text: "Knowledge alone, without visible action, is sufficient for effective leadership", correct: false },
              { text: "Only the instructions given verbally actually matter for leadership", correct: false },
            ],
            explanation: "All three practices share the same principle: leadership under pressure is expressed through direct, visible action — modeling behavior, giving clear instructions, and physically intervening — not knowledge alone.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "wardens-m2",
    name: "Fire: Coordinating a Multi-Group Evacuation",
    icon: "🔥",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "wardens-m2-l1-1",
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
            id: "wardens-m2-l1-2",
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
            id: "wardens-m2-l1-3",
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
            id: "wardens-m2-l1-4",
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
            id: "wardens-m2-l1-5",
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
        level: 2,
        questions: [
          {
            id: "wardens-m2-l2-1",
            prompt: "What two conditions must both be true before even considering controlling a fire yourself?",
            options: [
              { text: "It's small, and you're trained to handle it safely", correct: true },
              { text: "It's visible, and someone is filming it", correct: false },
              { text: "It's nearby, and no adult is present", correct: false },
              { text: "You feel confident, and it's not spreading fast", correct: false },
            ],
            explanation: "Both size and training have to genuinely be true together — neither one alone justifies attempting to control a fire.",
          },
          {
            id: "wardens-m2-l2-2",
            prompt: "Why does the fire floor and the floor above generally move first in a sequenced evacuation?",
            options: [
              { text: "They're closest to the immediate hazard, so their risk is highest", correct: true },
              { text: "It's simply a tradition with no real safety basis", correct: false },
              { text: "Lower floors are always at greater risk regardless of the fire's location", correct: false },
              { text: "The order doesn't actually matter for safety outcomes", correct: false },
            ],
            explanation: "Proximity to the fire's location is what determines evacuation priority — the fire floor and the one above face the most immediate risk.",
          },
          {
            id: "wardens-m2-l2-3",
            prompt: "Why should you personally verify an alternate route before sending more people toward it?",
            options: [
              { text: "To avoid redirecting people into a second, unconfirmed problem", correct: true },
              { text: "Verification isn't actually necessary once a redirect is issued", correct: false },
              { text: "This step only matters for very large groups", correct: false },
              { text: "The group can verify it themselves once redirected", correct: false },
            ],
            explanation: "Personally verifying the alternate route prevents sending people from one problem straight into another unconfirmed one.",
          },
          {
            id: "wardens-m2-l2-4",
            prompt: "Why is sheltering a group you genuinely can't evacuate described as \"a legitimate command decision,\" not a failure?",
            options: [
              { text: "It reflects a real, appropriate response to a genuinely blocked evacuation, not poor planning", correct: true },
              { text: "Sheltering is always the first choice regardless of circumstances", correct: false },
              { text: "It's only legitimate if a responder specifically approves it in advance", correct: false },
              { text: "Sheltering actually indicates a planning failure by the warden", correct: false },
            ],
            explanation: "When evacuation is genuinely impossible, sheltering with clear communication is the correct response to reality, not a sign of poor planning.",
          },
          {
            id: "wardens-m2-l2-5",
            prompt: "What determines whether a lift is acceptable to use during a fire?",
            options: [
              { text: "Whether there's real doubt about its safety, not just whether it's currently running", correct: true },
              { text: "Whether it's currently running, regardless of anything else", correct: false },
              { text: "Whether the stairs are more crowded than usual", correct: false },
              { text: "Whether a student or warden personally decides it looks fine", correct: false },
            ],
            explanation: "The doubt-means-evacuate principle, not current operability alone, is what determines whether a lift is acceptable to use.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "wardens-m2-l3-1",
            prompt: "You spot a small fire and you're trained in extinguisher use, but you're genuinely unsure if it's spreading. What's correct?",
            options: [
              { text: "Treat the uncertainty as doubt and evacuate rather than attempt to control it", correct: true },
              { text: "Attempt to control it since you're trained", correct: false },
              { text: "Wait a moment to see if it visibly spreads before deciding", correct: false },
              { text: "Ask nearby students for their opinion before deciding", correct: false },
            ],
            explanation: "Genuine uncertainty about whether it's spreading counts as doubt — the correct response is to evacuate, not to attempt control despite your training.",
          },
          {
            id: "wardens-m2-l3-2",
            prompt: "You're sequencing evacuation and the fire is on the 3rd floor. Which group should generally move first?",
            options: [
              { text: "Students on the 3rd and 4th floors", correct: true },
              { text: "Students on the ground floor", correct: false },
              { text: "Whichever floor has the most students present", correct: false },
              { text: "All floors simultaneously with no particular order", correct: false },
            ],
            explanation: "The fire floor and the floor above it — 3rd and 4th here — face the most immediate risk and should move first.",
          },
          {
            id: "wardens-m2-l3-3",
            prompt: "You've redirected a group away from a smoky staircase, but haven't yet verified the alternate is clear. What's the priority?",
            options: [
              { text: "Verify the alternate route yourself before more people commit to it", correct: true },
              { text: "Trust that it's fine since it wasn't the reported problem", correct: false },
              { text: "Send someone else to verify while you move on to other tasks", correct: false },
              { text: "Skip verification since time is limited", correct: false },
            ],
            explanation: "Verifying the alternate yourself, even under time pressure, avoids sending people into a second unconfirmed hazard.",
          },
          {
            id: "wardens-m2-l3-4",
            prompt: "A group genuinely can't evacuate due to conditions blocking every route. What's your correct sequence of actions?",
            options: [
              { text: "Get them into the safest available room, close the door, and communicate their exact location to responders", correct: true },
              { text: "Keep attempting evacuation through the blocked routes regardless", correct: false },
              { text: "Split the group to try multiple blocked routes at once", correct: false },
              { text: "Wait without taking any specific action until conditions change", correct: false },
            ],
            explanation: "This exact sequence — shelter, close the door, communicate location — is the correct, deliberate response when evacuation is genuinely blocked.",
          },
          {
            id: "wardens-m2-l3-5",
            prompt: "A lift appears to be working, and a responder hasn't arrived yet to give guidance. What's correct?",
            options: [
              { text: "Continue treating it as off-limits until a responder specifically directs otherwise", correct: true },
              { text: "Use it since no responder has said not to", correct: false },
              { text: "Use it only for people who have difficulty with stairs", correct: false },
              { text: "Let each group leader decide individually about the lift", correct: false },
            ],
            explanation: "The lift restriction stays in place until a responder specifically directs otherwise — the absence of a responder doesn't change the default.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "wardens-m2-l4-1",
            prompt: "You're coordinating evacuation across multiple floors when you learn TWO staircases have developed problems simultaneously. What's the right approach?",
            options: [
              { text: "Quickly reassess a full alternate sequence for all affected groups, rather than patching each staircase issue separately", correct: true },
              { text: "Handle each staircase problem in isolation as they're reported", correct: false },
              { text: "Pause the entire evacuation until both issues are resolved", correct: false },
              { text: "Focus only on the staircase affecting the most people", correct: false },
            ],
            explanation: "Two simultaneous staircase problems call for a full reassessment of the evacuation sequence, not just patching each issue in isolation.",
          },
          {
            id: "wardens-m2-l4-2",
            prompt: "Why does \"doubt about safety\" matter more than \"confidence in your training\" when deciding whether to attempt controlling a fire?",
            options: [
              { text: "Training doesn't remove genuine uncertainty about a specific fire's actual behavior", correct: true },
              { text: "Training always removes any real doubt about a fire's behavior", correct: false },
              { text: "Confidence should override doubt whenever you're properly trained", correct: false },
              { text: "This distinction doesn't actually matter in practice", correct: false },
            ],
            explanation: "Being trained doesn't eliminate genuine uncertainty about how a specific fire will behave — doubt about safety is the deciding factor, not general confidence from training.",
          },
          {
            id: "wardens-m2-l4-3",
            prompt: "Why might \"fire floor and the floor above move first\" need adjusting if the fire's exact floor is uncertain?",
            options: [
              { text: "The sequencing depends on accurate location information, which should be reassessed as it becomes available", correct: true },
              { text: "The sequencing rule never needs adjusting regardless of uncertainty", correct: false },
              { text: "Uncertainty about the fire's floor should be ignored entirely", correct: false },
              { text: "This rule is only ever a fixed, unchangeable sequence", correct: false },
            ],
            explanation: "The sequencing principle depends on knowing the fire's actual location — as better information becomes available, the sequence should be reassessed accordingly.",
          },
          {
            id: "wardens-m2-l4-4",
            prompt: "Why does sheltering a group require closing the door as a specific, deliberate step, not just an incidental detail?",
            options: [
              { text: "A closed door is part of what makes the shelter room actually safer from smoke and heat", correct: true },
              { text: "Closing the door is purely a matter of habit with no real safety function", correct: false },
              { text: "It only matters if smoke is already visible nearby", correct: false },
              { text: "An open door is equally safe as long as the room itself is chosen well", correct: false },
            ],
            explanation: "The closed door is an active part of the shelter strategy, helping keep smoke and heat out — not just an incidental detail.",
          },
          {
            id: "wardens-m2-l4-5",
            prompt: "Why does the lift restriction stay in place even once you personally see a responder using it themselves?",
            options: [
              { text: "A responder's own operational use doesn't automatically extend permission to others unless they explicitly direct it", correct: true },
              { text: "Seeing a responder use it always means it's now safe for everyone", correct: false },
              { text: "The restriction is lifted automatically once any responder is on scene", correct: false },
              { text: "This concern doesn't really apply once responders have arrived", correct: false },
            ],
            explanation: "A responder using the lift for their own operational reasons doesn't automatically mean it's safe for students or staff — only their explicit direction changes that.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "wardens-m2-l5-1",
            prompt: "You're coordinating a multi-floor evacuation. The fire floor is confirmed, but you also get an unconfirmed report of smoke on a completely different floor's staircase. What's the best full response?",
            options: [
              { text: "Continue the confirmed sequencing while quickly verifying the unconfirmed report, adjusting the plan the moment it's confirmed", correct: true },
              { text: "Immediately treat the unconfirmed report as equally certain as the confirmed fire floor", correct: false },
              { text: "Ignore the unconfirmed report entirely until someone else verifies it", correct: false },
              { text: "Pause all evacuation activity until the unconfirmed report is resolved", correct: false },
            ],
            explanation: "Continuing your confirmed plan while actively verifying new information — rather than ignoring it or treating it as equally certain — is how a warden should handle a mix of confirmed and unconfirmed hazards simultaneously.",
          },
          {
            id: "wardens-m2-l5-2",
            prompt: "Why does this module frame \"sheltering is a legitimate command decision, not a failure\" as something wardens specifically need to hear, more than other tiers?",
            options: [
              { text: "Wardens carry the responsibility for the decision, which can create pressure to see any non-evacuation outcome as a personal failure", correct: true },
              { text: "This concern is actually irrelevant to the warden role specifically", correct: false },
              { text: "Only younger tiers ever feel pressure about evacuation outcomes", correct: false },
              { text: "Sheltering decisions are actually made exclusively by responders, not wardens", correct: false },
            ],
            explanation: "As the person responsible for the decision, a warden can feel pressure to see anything short of full evacuation as a personal failure — this module directly addresses that pressure.",
          },
          {
            id: "wardens-m2-l5-3",
            prompt: "Why might verifying an alternate route yourself matter even more when you're coordinating multiple groups at once, rather than just one?",
            options: [
              { text: "A verification error affects every group you redirect toward that route, not just one", correct: true },
              { text: "Verification actually matters less when multiple groups are involved", correct: false },
              { text: "Coordinating multiple groups removes the need for personal verification", correct: false },
              { text: "This concern only applies when coordinating a single group", correct: false },
            ],
            explanation: "When multiple groups are being redirected toward the same alternate, an unverified route puts all of them at risk at once, not just one — raising the stakes of skipping that verification.",
          },
          {
            id: "wardens-m2-l5-4",
            prompt: "Why does the \"doubt means evacuate\" principle apply with equal force to both the \"attempt to control the fire\" decision and the \"use the lift\" decision?",
            options: [
              { text: "Both decisions involve committing to an option whose safety you can't fully verify in the moment", correct: true },
              { text: "The two decisions are actually based on completely different principles", correct: false },
              { text: "Lift safety is always more certain than fire-control safety", correct: false },
              { text: "This principle only genuinely applies to one of the two decisions", correct: false },
            ],
            explanation: "Both decisions require committing to something you can't fully verify — whether you can safely control the fire, or whether the lift will stay safe — which is why the same doubt-means-evacuate logic applies to both.",
          },
          {
            id: "wardens-m2-l5-5",
            prompt: "What's the deeper theme connecting sequencing, sheltering, verification, and the lift rule across this entire module?",
            options: [
              { text: "Good command decisions come from managing uncertainty deliberately, not from eliminating it entirely", correct: true },
              { text: "The four ideas are actually unrelated aspects of fire evacuation", correct: false },
              { text: "Uncertainty should always be treated as something to eliminate before acting at all", correct: false },
              { text: "Only the sequencing rule reflects genuine command-level reasoning", correct: false },
            ],
            explanation: "Every rule in this module reflects the same underlying theme: real command decisions are made by managing genuine uncertainty responsibly, not by waiting to eliminate it completely.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "wardens-m3",
    name: "Evacuation Planning & Building Hazard Mapping",
    icon: "🗺️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "wardens-m3-l1-1",
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
            id: "wardens-m3-l1-2",
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
            id: "wardens-m3-l1-3",
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
            id: "wardens-m3-l1-4",
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
            id: "wardens-m3-l1-5",
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
        level: 2,
        questions: [
          {
            id: "wardens-m3-l2-1",
            prompt: "Why does knowing typical headcount by time of day matter for a warden's floor knowledge?",
            options: [
              { text: "It helps you judge whether a headcount at the assembly point is actually complete", correct: true },
              { text: "It has no real bearing on evacuation planning", correct: false },
              { text: "It only matters for scheduling classes, not emergencies", correct: false },
              { text: "Headcount timing is irrelevant once an emergency starts", correct: false },
            ],
            explanation: "Knowing the expected headcount gives you a baseline to judge whether your assembly-point count is actually complete.",
          },
          {
            id: "wardens-m3-l2-2",
            prompt: "Who benefits from a warden communicating hazard signals outward, rather than just noticing them privately?",
            options: [
              { text: "Other wardens, responders, and the people being directed", correct: true },
              { text: "Only the warden themselves", correct: false },
              { text: "Only responders, not other wardens or students", correct: false },
              { text: "No one — private noticing is just as effective", correct: false },
            ],
            explanation: "Outward communication benefits everyone in the chain — other wardens, responders, and the people directly being directed.",
          },
          {
            id: "wardens-m3-l2-3",
            prompt: "Why shouldn't a warden re-enter the building to search for someone missing after evacuation?",
            options: [
              { text: "It risks turning one missing-person situation into two", correct: true },
              { text: "Wardens are physically incapable of searching effectively", correct: false },
              { text: "There's no real risk in a quick, careful re-entry", correct: false },
              { text: "This restriction only applies to fire evacuations, not others", correct: false },
            ],
            explanation: "Re-entering an evacuated building risks adding a second person at risk, rather than resolving the original missing-person situation.",
          },
          {
            id: "wardens-m3-l2-4",
            prompt: "What method does this module suggest for confirming evacuation is actually complete?",
            options: [
              { text: "A headcount, roll call, or check-in system", correct: true },
              { text: "Simply observing that the building looks empty", correct: false },
              { text: "Assuming completion once the alarm stops", correct: false },
              { text: "Waiting a fixed amount of time before assuming completion", correct: false },
            ],
            explanation: "A deliberate headcount, roll call, or check-in system is what actually confirms evacuation, rather than assumption alone.",
          },
          {
            id: "wardens-m3-l2-5",
            prompt: "Why should a missing person be flagged to responders \"right away,\" rather than after a short wait?",
            options: [
              { text: "Immediate flagging gives responders the earliest possible window to act", correct: true },
              { text: "A short wait has no real effect on responders' ability to help", correct: false },
              { text: "Waiting is actually the recommended standard practice", correct: false },
              { text: "This only matters if you suspect the person is in immediate danger", correct: false },
            ],
            explanation: "Every moment of delay before flagging a missing person is time responders don't have to begin acting.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "wardens-m3-l3-1",
            prompt: "You've just become the warden for a new floor and haven't yet confirmed the typical headcount by time of day. What should you prioritize?",
            options: [
              { text: "Learning typical headcount patterns alongside the exits and assembly point", correct: true },
              { text: "Waiting until an actual emergency to learn this information", correct: false },
              { text: "Assuming it matches your previous floor's patterns", correct: false },
              { text: "Only learning exits, since headcount isn't as urgent", correct: false },
            ],
            explanation: "Headcount patterns are part of the same groundwork as exits and the assembly point — all of it should be learned as soon as possible.",
          },
          {
            id: "wardens-m3-l3-2",
            prompt: "You notice a hazard signal but aren't yet certain it's significant. Should you still communicate it outward?",
            options: [
              { text: "Yes — communicating it lets others help judge and respond to it", correct: true },
              { text: "No, only communicate hazards you're fully certain about", correct: false },
              { text: "Only communicate it if a responder specifically asks", correct: false },
              { text: "Only communicate it to other wardens, never to responders", correct: false },
            ],
            explanation: "Communicating even an uncertain hazard signal lets others help assess and respond to it, rather than you carrying that judgment alone.",
          },
          {
            id: "wardens-m3-l3-3",
            prompt: "Your headcount is short by one person, but a colleague suggests waiting five minutes in case they're just running late. What's correct?",
            options: [
              { text: "Report the missing individual to responders immediately, rather than waiting", correct: true },
              { text: "Wait the suggested five minutes before reporting", correct: false },
              { text: "Only report if the person is still missing after ten minutes", correct: false },
              { text: "Don't report unless multiple people are missing", correct: false },
            ],
            explanation: "Reporting immediately, without waiting to see if the person turns up, gives responders the earliest possible chance to act.",
          },
          {
            id: "wardens-m3-l3-4",
            prompt: "Why is \"evacuation isn't complete until everyone is accounted for\" a standard you should apply even when the building visibly looks empty?",
            options: [
              { text: "A visibly empty building doesn't confirm that every specific individual made it out", correct: true },
              { text: "A visibly empty building is always sufficient confirmation on its own", correct: false },
              { text: "This standard only applies to buildings with unclear layouts", correct: false },
              { text: "Visible emptiness and individual accountability are the same thing", correct: false },
            ],
            explanation: "A building looking empty doesn't confirm every specific individual is accounted for — only a deliberate headcount or check-in does that.",
          },
          {
            id: "wardens-m3-l3-5",
            prompt: "Why does communicating a hazard to \"other wardens, responders, AND the people you're directing\" matter more than telling just one of those groups?",
            options: [
              { text: "Each group can act on the information differently — coordinating, responding, or adjusting their own movement", correct: true },
              { text: "Only responders actually need to know about any given hazard", correct: false },
              { text: "Telling just one group is always functionally equivalent to telling all three", correct: false },
              { text: "Students being directed don't actually need hazard information themselves", correct: false },
            ],
            explanation: "Each group plays a different role — coordinating wardens, responding professionals, or people adjusting their own movement — which is why communicating to all three matters.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "wardens-m3-l4-1",
            prompt: "You're new to a floor and its typical headcount data is outdated by a full semester. Why does that matter for your planning?",
            options: [
              { text: "Outdated headcount data could make you misjudge whether an actual headcount is complete", correct: true },
              { text: "Headcount data never actually changes meaningfully over a semester", correct: false },
              { text: "Outdated data is just as reliable as current data for this purpose", correct: false },
              { text: "This concern only matters for very large floors", correct: false },
            ],
            explanation: "Outdated headcount data could lead you to wrongly judge an actual count as complete or incomplete — keeping it current matters for accurate judgment.",
          },
          {
            id: "wardens-m3-l4-2",
            prompt: "Why does communicating an uncertain hazard signal outward sometimes feel uncomfortable, and why is it still the right call?",
            options: [
              { text: "It risks being wrong, but staying silent risks missing something others could have helped assess", correct: true },
              { text: "It's never actually uncomfortable to communicate uncertain information", correct: false },
              { text: "Staying silent is always the safer choice when uncertain", correct: false },
              { text: "This tradeoff doesn't really apply to hazard communication specifically", correct: false },
            ],
            explanation: "Communicating uncertainty risks being wrong, but the alternative — staying silent — risks missing a hazard others could have helped assess, which is why speaking up remains the right call.",
          },
          {
            id: "wardens-m3-l4-3",
            prompt: "Why might \"don't re-enter the building yourself\" be one of the hardest rules for a warden to follow in the moment, and why does it still hold?",
            options: [
              { text: "The instinct to personally help can be strong, but it risks creating a second person at risk instead of resolving the first", correct: true },
              { text: "This rule is actually easy to follow and rarely tested in practice", correct: false },
              { text: "Personal instinct should override this rule when the warden feels confident", correct: false },
              { text: "The rule doesn't really apply once a warden feels a strong personal connection to those missing", correct: false },
            ],
            explanation: "The instinct to personally help is genuinely strong, which is exactly why this rule is hard to follow — but re-entering still risks creating a second at-risk person rather than resolving the first.",
          },
          {
            id: "wardens-m3-l4-4",
            prompt: "Why does \"flag missing persons right away\" apply even if you suspect they're probably fine, just running late?",
            options: [
              { text: "Your suspicion isn't the same as confirmation, and responders can act on either outcome once informed", correct: true },
              { text: "A suspicion that someone is fine removes the need to report them", correct: false },
              { text: "Reporting is only necessary when you're fairly certain something is wrong", correct: false },
              { text: "This concern only matters if you have no suspicion either way", correct: false },
            ],
            explanation: "A personal suspicion that someone is probably fine isn't the same as actual confirmation — reporting lets responders act regardless of which turns out to be true.",
          },
          {
            id: "wardens-m3-l4-5",
            prompt: "Why does this module treat \"knowing your floor\" and \"communicating outward\" as two connected skills, rather than separate topics?",
            options: [
              { text: "Knowledge without communication doesn't actually help anyone else respond to a hazard", correct: true },
              { text: "The two skills are actually unrelated to each other", correct: false },
              { text: "Communication matters more than actual floor knowledge", correct: false },
              { text: "Floor knowledge alone is always sufficient without needing to communicate it", correct: false },
            ],
            explanation: "Floor knowledge that stays with you alone doesn't help anyone else — communicating it outward is what turns your knowledge into something the wider response can actually use.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "wardens-m3-l5-1",
            prompt: "Your headcount is short by one person, you're also managing an uncertain hazard report from another warden, and responders haven't arrived yet. What's the correct priority order?",
            options: [
              { text: "Report the missing person immediately, communicate the uncertain hazard outward too, and continue monitoring both while awaiting responders", correct: true },
              { text: "Focus solely on the missing person and address the hazard report only after they're found", correct: false },
              { text: "Wait for responders to arrive before reporting either issue", correct: false },
              { text: "Only report the hazard, since the missing person might still turn up", correct: false },
            ],
            explanation: "Both issues warrant immediate reporting — treating them as sequential, or waiting for responders, delays information that matters right now for two separate, genuine concerns.",
          },
          {
            id: "wardens-m3-l5-2",
            prompt: "Why does this module frame accountability (\"evacuation isn't complete until everyone is accounted for\") as a defining responsibility of the warden role specifically?",
            options: [
              { text: "Wardens are positioned to actually perform and verify the headcount, not just hope it happens", correct: true },
              { text: "Accountability is actually a responder-only responsibility, not a warden one", correct: false },
              { text: "This framing has no particular connection to the warden role", correct: false },
              { text: "Every tier bears equal responsibility for performing headcounts", correct: false },
            ],
            explanation: "The warden role specifically includes actually performing and verifying the headcount — which is why accountability is framed as a defining warden responsibility, not just a general hope.",
          },
          {
            id: "wardens-m3-l5-3",
            prompt: "Why might \"communicate hazards outward, even uncertain ones\" be a harder standard for a warden to hold themselves to than for a student?",
            options: [
              { text: "A warden's report carries more weight and may trigger a larger response, which can make hesitation to report feel more consequential", correct: true },
              { text: "This standard is actually easier for wardens than for students", correct: false },
              { text: "Warden reports carry no more weight than any other report", correct: false },
              { text: "This concern doesn't really apply differently across tiers", correct: false },
            ],
            explanation: "A warden's report can trigger a larger, more consequential response than a student's, which can make the decision to report an uncertain hazard feel weightier — even though the same logic still applies.",
          },
          {
            id: "wardens-m3-l5-4",
            prompt: "Why does \"don't re-enter the building\" apply with the same force even when a warden has specific reason to believe they know exactly where the missing person is?",
            options: [
              { text: "Specific knowledge of the person's likely location doesn't remove the actual hazard conditions inside", correct: true },
              { text: "Specific knowledge of their location makes re-entry safe in that case", correct: false },
              { text: "This rule only applies when the warden has no idea where the person might be", correct: false },
              { text: "Knowing someone's likely location eliminates the risk of re-entering", correct: false },
            ],
            explanation: "Knowing where someone likely is doesn't change the actual hazard conditions inside the building — the re-entry risk remains the same regardless of how confident the warden feels about the person's location.",
          },
          {
            id: "wardens-m3-l5-5",
            prompt: "What's the shared principle across \"know your floor,\" \"communicate outward,\" and \"never re-enter yourself\"?",
            options: [
              { text: "A warden's value comes from preparation and coordination, not from personally taking on every risk directly", correct: true },
              { text: "The three ideas are actually unrelated aspects of the warden role", correct: false },
              { text: "A warden's value comes primarily from personally handling every risk", correct: false },
              { text: "Only the \"know your floor\" principle reflects genuine preparation", correct: false },
            ],
            explanation: "All three ideas reflect the same principle: a warden's real value is in preparation and coordinating others, not in personally absorbing every risk themselves.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "wardens-m4",
    name: "Chemical Incidents & First-Aid-Adjacent Response",
    icon: "🧪",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "wardens-m4-l1-1",
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
            id: "wardens-m4-l1-2",
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
            id: "wardens-m4-l1-3",
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
            id: "wardens-m4-l1-4",
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
            id: "wardens-m4-l1-5",
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
        level: 2,
        questions: [
          {
            id: "wardens-m4-l2-1",
            prompt: "When is it appropriate for a warden to attempt cleanup of a chemical spill?",
            options: [
              { text: "Only if specifically trained and equipped for it", correct: true },
              { text: "Whenever it seems like a small, manageable spill", correct: false },
              { text: "Any time no other adult is nearby", correct: false },
              { text: "Cleanup is always part of the standard warden role", correct: false },
            ],
            explanation: "Cleanup requires specific training and equipment — without both, it stays outside the warden's role, regardless of how small the spill seems.",
          },
          {
            id: "wardens-m4-l2-2",
            prompt: "Why do responders specifically need visible labels reported, if any exist?",
            options: [
              { text: "Labels can give responders critical information about the chemical's properties before they arrive", correct: true },
              { text: "Labels are actually irrelevant to a responder's initial assessment", correct: false },
              { text: "This detail only matters for very large spills", correct: false },
              { text: "Responders can always identify the chemical themselves regardless of labels", correct: false },
            ],
            explanation: "Visible labels can give responders critical information about the chemical before they even arrive, which is why reporting them matters.",
          },
          {
            id: "wardens-m4-l2-3",
            prompt: "Why is a person's own assessment (\"it's probably fine\") not a reliable safety signal after chemical exposure?",
            options: [
              { text: "Exposure symptoms can be delayed or invisible at first", correct: true },
              { text: "People are always accurate judges of their own chemical exposure", correct: false },
              { text: "This concern only applies to certain kinds of chemicals", correct: false },
              { text: "Self-assessment is actually more reliable than protocol equipment", correct: false },
            ],
            explanation: "Because exposure symptoms aren't always immediately visible, a person's own \"I feel fine\" isn't a reliable enough signal to skip the protocol.",
          },
          {
            id: "wardens-m4-l2-4",
            prompt: "What's the warden's actual value during the first minutes of a first-aid-adjacent situation?",
            options: [
              { text: "Keeping the person calm, keeping others back, and relaying accurate information", correct: true },
              { text: "Attempting to diagnose the exact nature of the injury", correct: false },
              { text: "Performing whatever treatment feels most helpful", correct: false },
              { text: "Stepping back entirely and letting the situation unfold", correct: false },
            ],
            explanation: "Keeping the person calm, controlling the surrounding crowd, and relaying accurate information is the specific, defined value a warden provides in those first minutes.",
          },
          {
            id: "wardens-m4-l2-5",
            prompt: "Why does \"your value is in coordination, not improvised treatment\" matter, even if you personally know some first aid?",
            options: [
              { text: "Improvised treatment outside your specific certification can create risk beyond what coordination alone would", correct: true },
              { text: "Knowing some first aid always qualifies you to treat any injury", correct: false },
              { text: "Coordination and treatment carry exactly the same value and risk", correct: false },
              { text: "This concern only applies to wardens with no first aid knowledge at all", correct: false },
            ],
            explanation: "Even some first aid knowledge doesn't fully cover the risk of improvising outside your specific certification — coordination remains the safer, more valuable role.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "wardens-m4-l3-1",
            prompt: "A chemical incident occurs and you notice a partial label on the container. What should you do with that information?",
            options: [
              { text: "Include it in your report to responders, even if it's only partially legible", correct: true },
              { text: "Withhold it until you can read the full label clearly", correct: false },
              { text: "Ignore it since a partial label isn't fully useful", correct: false },
              { text: "Try to research it yourself before reporting", correct: false },
            ],
            explanation: "Even a partial label can give responders useful information — reporting it as-is is better than withholding it while trying to get a complete read.",
          },
          {
            id: "wardens-m4-l3-2",
            prompt: "Someone with visible chemical exposure insists they're fine and walks away before you can escort them to protocol equipment. What's correct?",
            options: [
              { text: "Follow up immediately, insist calmly, and still get medical responders involved", correct: true },
              { text: "Let them go since they made their own choice", correct: false },
              { text: "Wait to see if they come back on their own", correct: false },
              { text: "Report it only if they show visible symptoms later", correct: false },
            ],
            explanation: "Following up and still involving medical responders reflects that a person's refusal doesn't remove the genuine exposure risk.",
          },
          {
            id: "wardens-m4-l3-3",
            prompt: "You're keeping a crowd back from an incident when someone asks you directly what's wrong with the injured person. What's the right response?",
            options: [
              { text: "Keep the crowd back and avoid speculating on a diagnosis, while relaying accurate facts as needed to responders", correct: true },
              { text: "Give your best guess about their condition to satisfy the crowd", correct: false },
              { text: "Ignore the question and say nothing at all", correct: false },
              { text: "Let a bystander answer since you're busy with other tasks", correct: false },
            ],
            explanation: "Avoiding speculation while managing the crowd and relaying facts to responders stays within the defined boundaries of the warden's role.",
          },
          {
            id: "wardens-m4-l3-4",
            prompt: "Why does keeping others back from an incident matter as much as helping the affected person directly?",
            options: [
              { text: "A crowded scene can complicate both the person's condition and responders' ability to work", correct: true },
              { text: "Keeping others back has no real connection to the affected person's safety", correct: false },
              { text: "This concern only matters for very large crowds", correct: false },
              { text: "Crowd management is solely a responder's job, not a warden's", correct: false },
            ],
            explanation: "A crowded scene can worsen conditions for the affected person and slow down responders — crowd management is a genuine part of the response, not a secondary concern.",
          },
          {
            id: "wardens-m4-l3-5",
            prompt: "Why might a warden feel tempted to attempt treatment beyond their certification during a first-aid-adjacent situation, and why should they resist that?",
            options: [
              { text: "The urge to actively help can be strong, but untrained treatment risks worsening the outcome", correct: true },
              { text: "There's no real temptation to resist in this kind of situation", correct: false },
              { text: "Attempting treatment is always better than doing nothing at all", correct: false },
              { text: "This temptation only affects wardens without any first aid background", correct: false },
            ],
            explanation: "The instinct to actively help is genuinely strong, which is exactly why this module addresses it directly — untrained treatment can worsen the outcome, even with good intentions.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "wardens-m4-l4-1",
            prompt: "You're managing a chemical incident with one exposed person and a growing crowd, and responders haven't arrived. What should you prioritize?",
            options: [
              { text: "Keep the crowd back and get the exposed person to protocol equipment, while relaying an accurate report as you go", correct: true },
              { text: "Focus exclusively on the crowd, since the exposed person is a lower priority", correct: false },
              { text: "Focus exclusively on the exposed person and ignore the growing crowd", correct: false },
              { text: "Wait for responders before taking any action on either issue", correct: false },
            ],
            explanation: "Addressing both the exposed person and the crowd — rather than choosing one over the other, or waiting entirely — reflects the warden's actual dual role in this kind of incident.",
          },
          {
            id: "wardens-m4-l4-2",
            prompt: "Why does \"containment and evacuation, not identification\" remain your role even if you personally recognize the chemical from a label?",
            options: [
              { text: "Recognizing a label doesn't qualify you to safely handle or fully assess the chemical's risk", correct: true },
              { text: "Recognizing the chemical automatically qualifies you to handle it", correct: false },
              { text: "This restriction only applies to chemicals you don't recognize", correct: false },
              { text: "Identification and safe handling are the same skill", correct: false },
            ],
            explanation: "Recognizing a chemical from its label doesn't mean you're equipped to safely assess or handle its actual risk — your role stays containment and evacuation regardless.",
          },
          {
            id: "wardens-m4-l4-3",
            prompt: "Why might \"insist calmly\" matter as much as \"insist\" when getting an exposed person to protocol equipment?",
            options: [
              { text: "A calm approach is more likely to get genuine cooperation than a forceful one, without adding unnecessary panic", correct: true },
              { text: "Calmness is irrelevant as long as you eventually insist strongly enough", correct: false },
              { text: "A forceful approach is always more effective in this situation", correct: false },
              { text: "This distinction only matters for exposed individuals who are already calm", correct: false },
            ],
            explanation: "A calm approach is more likely to secure genuine cooperation without adding panic, which is why both the calmness and the insistence matter together.",
          },
          {
            id: "wardens-m4-l4-4",
            prompt: "Why does relaying accurate information matter more than relaying fast but uncertain information during a first-aid-adjacent incident?",
            options: [
              { text: "Inaccurate information can lead responders to prepare or act incorrectly", correct: true },
              { text: "Speed always matters more than accuracy in this context", correct: false },
              { text: "There's no real difference in value between fast and accurate reports", correct: false },
              { text: "Accuracy only matters once responders have already arrived", correct: false },
            ],
            explanation: "Inaccurate information — even if delivered quickly — can cause responders to prepare or act incorrectly, which is why accuracy remains the priority.",
          },
          {
            id: "wardens-m4-l4-5",
            prompt: "Why does this module frame \"not attempting treatment outside your certification\" as an active, deliberate choice, rather than simple inaction?",
            options: [
              { text: "Choosing coordination over improvised treatment is itself a meaningful, protective decision, not just passivity", correct: true },
              { text: "It's genuinely the same as doing nothing at all", correct: false },
              { text: "This framing has no real practical significance", correct: false },
              { text: "Coordination requires no real decision-making compared to treatment", correct: false },
            ],
            explanation: "Deliberately choosing coordination over improvised treatment is itself a protective decision — framing it as passive inaction misses that it's an active, considered choice.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "wardens-m4-l5-1",
            prompt: "A chemical incident involves an exposed person who refuses treatment, a partial label you can read, and a crowd starting to gather. What's the correct full sequence?",
            options: [
              { text: "Keep the crowd back, calmly insist the exposed person get treatment while involving medical responders, and report the label details as part of your account", correct: true },
              { text: "Focus only on convincing the exposed person, and skip the label and crowd since they're less urgent", correct: false },
              { text: "Report the label first since it's the easiest task, then handle the person and crowd afterward", correct: false },
              { text: "Wait for responders to arrive before addressing any of the three elements", correct: false },
            ],
            explanation: "This combines every relevant duty — crowd management, insisting on protocol care, and reporting available label information — rather than sequencing or skipping any of them.",
          },
          {
            id: "wardens-m4-l5-2",
            prompt: "Why does this module explicitly frame the warden's role as \"first-aid-adjacent,\" rather than simply \"first aid\"?",
            options: [
              { text: "It draws a clear boundary between supporting a response and actually providing medical treatment yourself", correct: true },
              { text: "The distinction is purely a naming choice with no practical meaning", correct: false },
              { text: "\"First-aid-adjacent\" actually means the same thing as providing first aid directly", correct: false },
              { text: "This framing only applies to wardens with no first aid training at all", correct: false },
            ],
            explanation: "The specific phrase \"first-aid-adjacent\" draws a deliberate boundary — supporting and coordinating a response, not personally providing medical treatment — which is central to how this module defines the warden's role.",
          },
          {
            id: "wardens-m4-l5-3",
            prompt: "Why might \"your value is in coordination and accurate information\" be a harder principle to internalize for a warden with real medical interest or training, compared to one without?",
            options: [
              { text: "Having relevant knowledge can make the urge to directly intervene feel more justified, even when it isn't appropriate", correct: true },
              { text: "This principle is actually easier for medically-inclined wardens to accept", correct: false },
              { text: "Medical knowledge removes any tension around this principle entirely", correct: false },
              { text: "The principle doesn't really apply differently based on personal background", correct: false },
            ],
            explanation: "A warden with genuine medical interest may feel their knowledge justifies more direct intervention — which is exactly why this principle can be harder, not easier, for them to hold to.",
          },
          {
            id: "wardens-m4-l5-4",
            prompt: "Why does \"insist calmly, regardless of protest\" not conflict with respecting a person's autonomy, according to the reasoning in this module?",
            options: [
              { text: "A person's protest under exposure stress may not reflect a fully informed, clear-headed choice", correct: true },
              { text: "Respecting autonomy actually requires immediately accepting any refusal", correct: false },
              { text: "This tension doesn't really exist in the module's reasoning", correct: false },
              { text: "Autonomy and safety insistence are treated as unrelated concepts here", correct: false },
            ],
            explanation: "A protest made under the stress of possible chemical exposure may not reflect the person's fully informed judgment, which is why calm insistence — paired with involving medical responders — is treated as protective rather than as overriding genuine autonomy.",
          },
          {
            id: "wardens-m4-l5-5",
            prompt: "What's the underlying principle connecting \"containment over identification,\" \"accurate over fast reporting,\" and \"coordination over improvised treatment\"?",
            options: [
              { text: "In each case, staying within your actual role and training produces a better outcome than well-intentioned overreach", correct: true },
              { text: "The three ideas are actually unrelated aspects of chemical incident response", correct: false },
              { text: "Overreach beyond your role is always the safer, more helpful choice", correct: false },
              { text: "Only the reporting principle reflects genuine safety reasoning", correct: false },
            ],
            explanation: "All three principles share the same underlying logic: staying within your actual role and training, even when well-intentioned overreach feels tempting, produces the better and safer outcome.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "wardens-m5",
    name: "Cyclone & Flood: Shelter Command",
    icon: "🌊",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "wardens-m5-l1-1",
            prompt: "As a warden, what should guide your decision between sheltering in place and relocating to a higher floor?",
            options: [
              { text: "Defaulting to the safer, more conservative option when information is incomplete", correct: true },
              { text: "Always choosing whichever option is fastest to execute", correct: false },
              { text: "Waiting until you have complete information before deciding anything", correct: false },
              { text: "Letting the group vote on which option to choose", correct: false },
            ],
            explanation: "Defaulting to the more conservative option under incomplete information, and updating as official information arrives, is the recommended approach.",
          },
          {
            id: "wardens-m5-l1-2",
            prompt: "During a long-duration event like a cyclone or flood, what does your responsibility expand to include?",
            options: [
              { text: "Conserving supplies, checking on vulnerable individuals, and maintaining calm communication", correct: true },
              { text: "Nothing extra — the initial plan covers the entire duration", correct: false },
              { text: "Only monitoring weather updates continuously", correct: false },
              { text: "Handling every individual task personally without delegating", correct: false },
            ],
            explanation: "A long-duration event expands your responsibility to ongoing group management — supplies, vulnerable individuals, and calm communication — not just the initial decision.",
          },
          {
            id: "wardens-m5-l1-3",
            prompt: "What's the firm rule about electrical panels or outlets that floodwater has reached or may reach?",
            options: [
              { text: "Never let anyone approach them — isolate the area and wait for trained personnel", correct: true },
              { text: "Approach carefully if it seems urgent enough", correct: false },
              { text: "Only avoid them if water is already actively touching them", correct: false },
              { text: "It's a judgment call to relax if time is limited", correct: false },
            ],
            explanation: "This is described as a firm rule, not a judgment call to relax under pressure — isolate the area and wait for trained personnel.",
          },
          {
            id: "wardens-m5-l1-4",
            prompt: "Floodwater is rising toward a ground-floor electrical panel while your group waits for evacuation transport. What's the correct call?",
            options: [
              { text: "Move the group away from the panel's area entirely and keep everyone clear until trained personnel isolate the power", correct: true },
              { text: "Try to shut off the panel yourself to \"prevent a bigger problem\"", correct: false },
              { text: "Ignore it since the water hasn't reached it yet", correct: false },
              { text: "Ask for a volunteer from the group to check on it", correct: false },
            ],
            explanation: "A live electrical panel near rising water is a firm no-approach rule - the safe response is distance, not intervention.",
          },
          {
            id: "wardens-m5-l1-5",
            prompt: "Why should you update your shelter-vs-relocate decision as official information arrives, rather than sticking with your first choice?",
            options: [
              { text: "Official information can reveal conditions you couldn't observe when you first decided", correct: true },
              { text: "Updating decisions is generally a sign of poor initial planning", correct: false },
              { text: "Your first decision should always be treated as final", correct: false },
              { text: "Official updates rarely contain anything actually useful", correct: false },
            ],
            explanation: "Official updates can reveal conditions beyond what you could observe initially, which is why staying willing to update your decision matters.",
          },
        ],
      },
      {
        level: 2,
        questions: [
          {
            id: "wardens-m5-l2-1",
            prompt: "When information about a cyclone or flood is incomplete, what should you default to?",
            options: [
              { text: "The safer, more conservative option", correct: true },
              { text: "Whichever option feels most convenient", correct: false },
              { text: "The option the majority of the group prefers", correct: false },
              { text: "Waiting indefinitely until information is complete", correct: false },
            ],
            explanation: "Defaulting to the safer, more conservative choice under incomplete information is the recommended standard.",
          },
          {
            id: "wardens-m5-l2-2",
            prompt: "What's one specific responsibility that expands during a long-duration sheltering event?",
            options: [
              { text: "Checking on vulnerable individuals in your group", correct: true },
              { text: "Only monitoring your own personal wellbeing", correct: false },
              { text: "Delegating every task immediately to someone else", correct: false },
              { text: "Focusing exclusively on supply conservation, nothing else", correct: false },
            ],
            explanation: "Checking on vulnerable individuals is one of several responsibilities that expand specifically because a long-duration event gives you the time and need to do so.",
          },
          {
            id: "wardens-m5-l2-3",
            prompt: "Why is the electrical panel rule described as \"firm,\" rather than something to judge case by case?",
            options: [
              { text: "The risk of electrocution near water is severe enough that it shouldn't be relaxed under pressure", correct: true },
              { text: "It's actually meant to be judged case by case despite the wording", correct: false },
              { text: "Firm rules are just a stylistic choice with no real safety basis", correct: false },
              { text: "This rule only applies to panels that are visibly sparking", correct: false },
            ],
            explanation: "The severity of electrocution risk near water is exactly why this rule is firm — it's not meant to be relaxed even under time pressure.",
          },
          {
            id: "wardens-m5-l2-4",
            prompt: "Why does maintaining calm communication matter specifically during a long-duration event?",
            options: [
              { text: "Uncertainty over a longer period can turn into panic if communication breaks down", correct: true },
              { text: "Communication only matters during the first few minutes of an event", correct: false },
              { text: "Calm communication is only relevant for very large groups", correct: false },
              { text: "This concern doesn't really apply to slow-moving disasters", correct: false },
            ],
            explanation: "Extended uncertainty during a long event can turn into panic without ongoing, calm communication — which is why it becomes an expanded responsibility.",
          },
          {
            id: "wardens-m5-l2-5",
            prompt: "Why should a warden's shelter-vs-relocate decision be treated as updatable, not fixed?",
            options: [
              { text: "New official information can change what's actually the safer choice", correct: true },
              { text: "Decisions should never be revisited once made", correct: false },
              { text: "Updating a decision always signals the original choice was wrong", correct: false },
              { text: "This concern only applies to very long events", correct: false },
            ],
            explanation: "New information can genuinely change what's safest, which is why the decision should stay open to updating as conditions evolve.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "wardens-m5-l3-1",
            prompt: "You have incomplete information about whether flooding will reach your floor. What should guide your initial decision?",
            options: [
              { text: "Default to the more conservative option — likely relocating higher — given the incomplete picture", correct: true },
              { text: "Assume flooding won't reach you since it's not confirmed", correct: false },
              { text: "Wait for complete certainty before making any decision", correct: false },
              { text: "Let each individual in the group decide for themselves", correct: false },
            ],
            explanation: "Incomplete information calls for defaulting to the more conservative option, rather than assuming the best-case outcome or waiting for full certainty.",
          },
          {
            id: "wardens-m5-l3-2",
            prompt: "Several hours into a flood event, you notice one member of your group seems increasingly distressed. What's the correct response?",
            options: [
              { text: "Check on them directly as part of your expanded long-duration responsibility", correct: true },
              { text: "Assume someone else will check on them", correct: false },
              { text: "Address it only once the event fully concludes", correct: false },
              { text: "Focus only on supply conservation instead", correct: false },
            ],
            explanation: "Checking on a distressed individual directly reflects the expanded responsibility that comes with managing a long-duration event.",
          },
          {
            id: "wardens-m5-l3-3",
            prompt: "Water hasn't yet reached an electrical panel, but it's rising steadily nearby. What's correct?",
            options: [
              { text: "Treat the area as off-limits now, before the water actually reaches it", correct: true },
              { text: "Wait until water actually touches the panel before restricting access", correct: false },
              { text: "Allow careful, brief access until the water gets closer", correct: false },
              { text: "Let a trained-sounding volunteer assess the panel", correct: false },
            ],
            explanation: "Treating the area as off-limits proactively, before water actually reaches the panel, reflects the firm nature of this rule rather than waiting for direct contact.",
          },
          {
            id: "wardens-m5-l3-4",
            prompt: "New official information arrives that contradicts your group's current sheltering plan. What's the correct response?",
            options: [
              { text: "Update your plan based on the new official information", correct: true },
              { text: "Stick with the original plan since it was already communicated", correct: false },
              { text: "Ignore the update unless it comes from multiple sources", correct: false },
              { text: "Let the group decide whether to follow the update", correct: false },
            ],
            explanation: "Updating your plan based on new official information is exactly the flexibility this module asks a warden to maintain.",
          },
          {
            id: "wardens-m5-l3-5",
            prompt: "Why might \"conserving supplies\" matter even if the event seems likely to resolve soon?",
            options: [
              { text: "Duration is often uncertain, and conservative supply use protects against it running longer than expected", correct: true },
              { text: "Supply conservation is only relevant for events confirmed to be very long", correct: false },
              { text: "If an event seems short, supply conservation becomes unnecessary", correct: false },
              { text: "This concern doesn't really connect to the overall shelter command role", correct: false },
            ],
            explanation: "Since duration is often genuinely uncertain, conservative supply use protects the group even if the event turns out to last longer than initially expected.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "wardens-m5-l4-1",
            prompt: "You're managing a shelter-in-place group when you learn water is approaching from a direction you hadn't previously considered. What's the priority?",
            options: [
              { text: "Reassess your conservative default decision in light of the new information, and adjust if needed", correct: true },
              { text: "Continue with the original plan since it was based on the best information at the time", correct: false },
              { text: "Wait for official confirmation before considering any change", correct: false },
              { text: "Make the decision alone without communicating the new information to the group", correct: false },
            ],
            explanation: "New information about an unconsidered water direction calls for genuinely reassessing your plan, not defaulting to your original decision out of consistency alone.",
          },
          {
            id: "wardens-m5-l4-2",
            prompt: "Why does \"checking on vulnerable individuals\" require active effort, rather than assuming you'd notice if someone needed help?",
            options: [
              { text: "Distress isn't always visibly obvious, especially over a long, uncertain event", correct: true },
              { text: "Vulnerable individuals always make their needs obvious without prompting", correct: false },
              { text: "This responsibility only matters if someone explicitly asks for help", correct: false },
              { text: "Passive awareness is just as effective as active checking", correct: false },
            ],
            explanation: "Distress isn't always visibly obvious, particularly during a long, uncertain event — which is why actively checking, rather than assuming you'd notice, matters.",
          },
          {
            id: "wardens-m5-l4-3",
            prompt: "Why might the electrical panel rule feel like it conflicts with a warden's instinct to \"solve problems directly,\" and why does the rule still hold?",
            options: [
              { text: "The instinct to act directly doesn't reduce the actual electrocution risk near water", correct: true },
              { text: "This rule doesn't actually conflict with a warden's typical instincts", correct: false },
              { text: "A warden's direct instinct should override this specific rule when time is limited", correct: false },
              { text: "The electrocution risk decreases the more urgently a warden acts", correct: false },
            ],
            explanation: "A warden's instinct to act directly is understandable, but it doesn't change the actual electrocution risk — which is exactly why this firm rule holds even against that instinct.",
          },
          {
            id: "wardens-m5-l4-4",
            prompt: "Why does \"maintaining calm communication\" require more deliberate effort during a slow-moving disaster than a fast one, like a fire?",
            options: [
              { text: "A longer timeframe gives uncertainty more room to build into panic if not actively managed", correct: true },
              { text: "Calm communication actually matters less during slow-moving disasters", correct: false },
              { text: "Fast-moving disasters require more communication effort than slow ones", correct: false },
              { text: "This distinction doesn't really exist between fast and slow disasters", correct: false },
            ],
            explanation: "A longer timeframe gives uncertainty more room to build into panic if it isn't actively managed, which is why sustained, deliberate communication matters more in a slow-moving event.",
          },
          {
            id: "wardens-m5-l4-5",
            prompt: "Why does defaulting to the \"more conservative option\" sometimes mean accepting a less convenient plan for your group?",
            options: [
              { text: "Safety under incomplete information sometimes costs convenience, and that tradeoff is the correct one", correct: true },
              { text: "The more conservative option is always equally convenient as any alternative", correct: false },
              { text: "Convenience should be weighed as equally important as safety here", correct: false },
              { text: "This tradeoff only applies to very large groups", correct: false },
            ],
            explanation: "Choosing the safer, more conservative option under incomplete information sometimes genuinely costs convenience — and this module treats that tradeoff as the correct one to accept.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "wardens-m5-l5-1",
            prompt: "You're several hours into a flood event, water is now approaching an electrical panel, one group member is showing signs of distress, and new official guidance just arrived. What's the correct full response?",
            options: [
              { text: "Update your plan per the new guidance, keep the group clear of the panel area, and directly check on the distressed individual", correct: true },
              { text: "Address only the electrical panel since it's the most physically dangerous issue", correct: false },
              { text: "Follow the new guidance but leave the panel and distressed individual for later", correct: false },
              { text: "Handle the distressed individual first, then reassess the panel and guidance afterward", correct: false },
            ],
            explanation: "This combines every element the module emphasizes — updating your plan, respecting the firm electrical rule, and expanding your responsibility to the group's wellbeing — rather than treating them as competing priorities.",
          },
          {
            id: "wardens-m5-l5-2",
            prompt: "Why is this module titled \"Shelter Command,\" emphasizing an ongoing leadership role, rather than just \"Shelter Rules\"?",
            options: [
              { text: "The module is about sustained decision-making and group management over time, not just a single initial choice", correct: true },
              { text: "The title is purely stylistic with no real connection to the content", correct: false },
              { text: "\"Command\" here refers only to giving the initial shelter-vs-relocate instruction", correct: false },
              { text: "This module is actually just a list of fixed rules, similar to earlier tiers", correct: false },
            ],
            explanation: "The \"Command\" framing reflects that this module is about sustained decision-making and group management throughout a long event — not just issuing one initial instruction and stepping back.",
          },
          {
            id: "wardens-m5-l5-3",
            prompt: "Why does \"default to the conservative option under incomplete information\" remain the right principle even for an experienced warden confident in their read of the situation?",
            options: [
              { text: "Confidence doesn't eliminate the actual gaps in information a warden is working with", correct: true },
              { text: "Experienced wardens are exempt from needing to default conservatively", correct: false },
              { text: "Confidence in your read should override the conservative default when you're experienced", correct: false },
              { text: "This principle only applies to newer, less experienced wardens", correct: false },
            ],
            explanation: "No amount of confidence changes the fact that the underlying information is genuinely incomplete — which is why the conservative default holds regardless of a warden's experience level.",
          },
          {
            id: "wardens-m5-l5-4",
            prompt: "Why might the firm electrical-panel rule be one of the clearest examples in this tier of a rule that should never be relaxed, even by a highly capable warden?",
            options: [
              { text: "The consequence of being wrong (electrocution) is severe and irreversible, unlike many other judgment calls in this module", correct: true },
              { text: "This rule is actually more flexible than most other rules in the tier", correct: false },
              { text: "Capability level should determine how strictly this specific rule applies", correct: false },
              { text: "This rule is no different in severity from the other guidance in this module", correct: false },
            ],
            explanation: "Unlike many of the module's judgment calls, the electrical-panel rule guards against a severe, irreversible outcome — which is exactly why it's framed as firm rather than subject to a capable warden's discretion.",
          },
          {
            id: "wardens-m5-l5-5",
            prompt: "What's the deepest connecting theme between \"default conservative under uncertainty,\" \"expand your responsibility over time,\" and \"never relax the firm electrical rule\"?",
            options: [
              { text: "Good shelter command means matching your response to genuine risk and uncertainty, not to convenience or confidence", correct: true },
              { text: "The three ideas are actually unrelated aspects of shelter management", correct: false },
              { text: "Confidence should be the primary factor guiding all three of these decisions", correct: false },
              { text: "Only the electrical rule reflects genuine safety reasoning among the three", correct: false },
            ],
            explanation: "All three ideas share the same deep principle: a warden's response should be calibrated to genuine risk and uncertainty — not to convenience, not to the passage of time feeling routine, and not to personal confidence.",
          },
        ],
      },
    ],
  },
  {
    moduleId: "wardens-m6",
    name: "Multi-Hazard Compound Command & Responder Handoff",
    icon: "⚠️",
    levels: [
      {
        level: 1,
        questions: [
          {
            id: "wardens-m6-l1-1",
            prompt: "Why is this described as the capstone module for the Wardens tier?",
            options: [
              { text: "Everything in the tier converges here: personal safety, group direction, hazard judgment, and accountability", correct: true },
              { text: "It's simply the final module in the sequence, without deeper connection", correct: false },
              { text: "It only covers content not addressed anywhere else in the tier", correct: false },
              { text: "It's the easiest module, meant as a wrap-up", correct: false },
            ],
            explanation: "This module deliberately brings together every core skill from the tier — personal safety, group direction, hazard judgment, and accountability — all under changing conditions.",
          },
          {
            id: "wardens-m6-l1-2",
            prompt: "In a sequence like earthquake → damaged stair → gas leak, what's the correct order of response?",
            options: [
              { text: "Protect yourself first, reassess before moving, identify secondary hazards, then act", correct: true },
              { text: "Act immediately without any reassessment", correct: false },
              { text: "Identify secondary hazards before protecting yourself", correct: false },
              { text: "Wait for responders before doing anything at all", correct: false },
            ],
            explanation: "This exact sequence — protect, reassess, identify, then act — is presented as the correct order, not a single undifferentiated \"get out\" instinct.",
          },
          {
            id: "wardens-m6-l1-3",
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
            id: "wardens-m6-l1-4",
            prompt: "Responders have just arrived after a multi-hazard event you've been managing for ten minutes. What's your role now?",
            options: [
              { text: "Brief them concisely (headcount, hazards found, anyone missing/injured) and transition to following their direction", correct: true },
              { text: "Continue running your own evacuation plan independently of what responders are now coordinating", correct: false },
              { text: "Step back entirely without briefing them at all", correct: false },
              { text: "Wait for them to ask before offering any information", correct: false },
            ],
            explanation: "A concise handoff lets trained responders take command efficiently with the exact information they need to act on immediately.",
          },
          {
            id: "wardens-m6-l1-5",
            prompt: "Why is \"continuing to run your own plan independently\" a mistake once responders arrive?",
            options: [
              { text: "Two uncoordinated command chains on the same scene can work against each other", correct: true },
              { text: "It's actually the correct approach once you've been managing the scene", correct: false },
              { text: "Responders always expect you to keep running things until told otherwise", correct: false },
              { text: "This concern only applies to very large-scale incidents", correct: false },
            ],
            explanation: "Two uncoordinated command chains on the same scene can work against each other — the handoff itself is the correct command decision once responders arrive.",
          },
        ],
      },
      {
        level: 2,
        questions: [
          {
            id: "wardens-m6-l2-1",
            prompt: "What four skill areas does this capstone module bring together?",
            options: [
              { text: "Personal safety, group direction, hazard judgment, and accountability", correct: true },
              { text: "Only hazard judgment and reporting", correct: false },
              { text: "Only personal safety and delegation", correct: false },
              { text: "Only communication and equipment use", correct: false },
            ],
            explanation: "This module explicitly draws together all four skill areas developed across the tier, not just one or two of them.",
          },
          {
            id: "wardens-m6-l2-2",
            prompt: "In the correct multi-hazard sequence, what comes right after \"protect yourself\"?",
            options: [
              { text: "Reassess before moving", correct: true },
              { text: "Act immediately in any available direction", correct: false },
              { text: "Delegate to another warden before doing anything else", correct: false },
              { text: "Contact responders before any other step", correct: false },
            ],
            explanation: "Reassessing before moving is the deliberate second step, distinct from either acting immediately or waiting for outside help first.",
          },
          {
            id: "wardens-m6-l2-3",
            prompt: "Why does \"you take the west stair group, report back at the north assembly point\" work better than \"help out over there\"?",
            options: [
              { text: "It gives a specific task and a specific reporting point, leaving no ambiguity", correct: true },
              { text: "Both instructions are actually equally clear and useful", correct: false },
              { text: "\"Help out over there\" is actually the more efficient instruction", correct: false },
              { text: "This distinction only matters for very large teams", correct: false },
            ],
            explanation: "A specific task with a specific reporting point removes ambiguity — \"help out over there\" leaves the other warden without clear direction.",
          },
          {
            id: "wardens-m6-l2-4",
            prompt: "What three things should a concise handoff to responders include?",
            options: [
              { text: "Headcount, hazards found, and anyone missing or injured", correct: true },
              { text: "Your personal opinion of what should happen next", correct: false },
              { text: "A full timeline of everything that occurred", correct: false },
              { text: "Only the number of people currently present", correct: false },
            ],
            explanation: "Headcount, known hazards, and missing/injured status are the specific, actionable details a concise handoff should cover.",
          },
          {
            id: "wardens-m6-l2-5",
            prompt: "Why can two uncoordinated command chains work against each other on the same scene?",
            options: [
              { text: "They may give conflicting instructions or duplicate/miss efforts without realizing it", correct: true },
              { text: "Two command chains always naturally coordinate without any real risk", correct: false },
              { text: "This concern only applies to very small-scale incidents", correct: false },
              { text: "Responders always defer automatically to whoever arrived first", correct: false },
            ],
            explanation: "Without coordination, two command chains can give conflicting instructions or duplicate and miss efforts — which is exactly why the handoff matters.",
          },
        ],
      },
      {
        level: 3,
        questions: [
          {
            id: "wardens-m6-l3-1",
            prompt: "An earthquake has occurred, and you're following the protect-reassess-identify-act sequence when you feel a possible aftershock during the reassess step. What do you do?",
            options: [
              { text: "Protect yourself again through the aftershock, then resume reassessing once it passes", correct: true },
              { text: "Skip ahead to acting immediately, aftershock or not", correct: false },
              { text: "Continue reassessing through the aftershock without pausing", correct: false },
              { text: "Abandon the sequence entirely and improvise", correct: false },
            ],
            explanation: "An aftershock always takes priority within the sequence — protecting yourself again, then resuming reassessment, keeps the correct order intact.",
          },
          {
            id: "wardens-m6-l3-2",
            prompt: "You need to delegate handling of a secondary hazard to a Sentinel while you manage the primary evacuation. What's the best instruction?",
            options: [
              { text: "\"Check the east corridor for the gas smell and report back to me directly\"", correct: true },
              { text: "\"Deal with whatever's going on over there\"", correct: false },
              { text: "No instruction — let them figure out what's needed", correct: false },
              { text: "Handle it yourself instead of delegating at all", correct: false },
            ],
            explanation: "A specific task and a specific reporting channel back to you is exactly the kind of bounded, effective delegation this module teaches.",
          },
          {
            id: "wardens-m6-l3-3",
            prompt: "Responders arrive while you're still mid-evacuation. What's the correct immediate action?",
            options: [
              { text: "Give them a concise brief as soon as practical, then transition to their direction", correct: true },
              { text: "Finish the evacuation exactly as planned before speaking with them at all", correct: false },
              { text: "Continue managing independently since you're already mid-task", correct: false },
              { text: "Wait for them to take full initiative before saying anything", correct: false },
            ],
            explanation: "Briefing responders as soon as practical, even mid-evacuation, allows the handoff to happen efficiently rather than delaying it until your own plan concludes.",
          },
          {
            id: "wardens-m6-l3-4",
            prompt: "Why might running your own plan alongside responders' efforts seem tempting, even though it's the wrong call?",
            options: [
              { text: "You may feel you understand the situation best, having managed it before they arrived", correct: true },
              { text: "There's no real temptation to continue running your own plan", correct: false },
              { text: "Running a parallel plan is actually the correct choice in most cases", correct: false },
              { text: "This concern only applies to wardens with little prior experience", correct: false },
            ],
            explanation: "Having managed the situation before responders arrived can create a genuine feeling of being best-positioned to keep directing — which is exactly why the handoff has to be a deliberate choice, not just an instinct to resist.",
          },
          {
            id: "wardens-m6-l3-5",
            prompt: "Why does this module frame accountability — knowing who's missing or injured — as essential to a good handoff, not just a nice detail?",
            options: [
              { text: "Responders need this information immediately to prioritize their own actions effectively", correct: true },
              { text: "Accountability information is actually optional for an effective handoff", correct: false },
              { text: "This detail only matters if someone is confirmed injured", correct: false },
              { text: "Responders can always determine this themselves without your input", correct: false },
            ],
            explanation: "Accountability information — who's missing or injured — is exactly what responders need immediately to prioritize their own actions, making it essential, not optional, to a good handoff.",
          },
        ],
      },
      {
        level: 4,
        questions: [
          {
            id: "wardens-m6-l4-1",
            prompt: "You're managing a compound scenario — earthquake damage plus a gas smell — and have delegated part of the response to a Sentinel, when responders arrive. What's the correct full sequence?",
            options: [
              { text: "Quickly consolidate status from your delegated Sentinel, then brief responders concisely, then transition to their direction", correct: true },
              { text: "Brief responders immediately without checking on your delegated Sentinel first", correct: false },
              { text: "Have the Sentinel brief responders directly while you continue your own separate plan", correct: false },
              { text: "Wait until the Sentinel's task is fully complete before briefing responders at all", correct: false },
            ],
            explanation: "Consolidating status before briefing ensures responders get a complete, accurate picture in one handoff, rather than a fragmented one or an unnecessary delay.",
          },
          {
            id: "wardens-m6-l4-2",
            prompt: "Why does the protect-reassess-identify-act sequence matter even more in a compound scenario than in a single-hazard one?",
            options: [
              { text: "Skipping a step risks missing one of multiple hazards present, not just one", correct: true },
              { text: "The sequence actually matters less when multiple hazards are present", correct: false },
              { text: "Compound scenarios don't really require this specific sequence", correct: false },
              { text: "This concern only applies to scenarios with exactly two hazards", correct: false },
            ],
            explanation: "With multiple hazards present, skipping a step in the sequence risks missing one of them entirely — raising the stakes of following it carefully compared to a single-hazard situation.",
          },
          {
            id: "wardens-m6-l4-3",
            prompt: "Why might vague delegation (\"help out over there\") be especially costly during a genuinely compound, fast-moving scenario?",
            options: [
              { text: "Ambiguity wastes time that's especially scarce when multiple hazards are unfolding at once", correct: true },
              { text: "Vague delegation actually works better under fast-moving conditions", correct: false },
              { text: "This concern only matters in slow-moving, single-hazard scenarios", correct: false },
              { text: "Time pressure has no real bearing on delegation clarity", correct: false },
            ],
            explanation: "Time is especially scarce in a fast-moving, compound scenario, which is exactly when the wasted clarification time from vague delegation becomes most costly.",
          },
          {
            id: "wardens-m6-l4-4",
            prompt: "Why does a concise handoff matter more, not less, when the situation you're handing off is especially complex?",
            options: [
              { text: "Complexity makes it easier to overwhelm responders with unnecessary detail instead of what they actually need first", correct: true },
              { text: "Complex situations should always be described in maximum possible detail", correct: false },
              { text: "Conciseness only matters for simple, low-complexity situations", correct: false },
              { text: "Handoff quality has no real connection to situation complexity", correct: false },
            ],
            explanation: "In a complex situation, it's especially easy to overwhelm responders with detail — a concise handoff that prioritizes headcount, hazards, and injuries prevents that.",
          },
          {
            id: "wardens-m6-l4-5",
            prompt: "Why might a warden's own sense of \"ownership\" over a situation they've managed for a while make the responder handoff feel harder, even when they know it's correct?",
            options: [
              { text: "Investment in managing something can create a natural reluctance to hand off control, even when it's the right call", correct: true },
              { text: "Ownership over a situation actually makes handoff feel easier, not harder", correct: false },
              { text: "This concern doesn't really apply to experienced wardens", correct: false },
              { text: "Knowing the handoff is correct should eliminate any emotional difficulty around it", correct: false },
            ],
            explanation: "Genuine investment in managing a situation can create a natural reluctance to let go of control, even while intellectually knowing the handoff is correct — which is exactly why this module names it directly.",
          },
        ],
      },
      {
        level: 5,
        questions: [
          {
            id: "wardens-m6-l5-1",
            prompt: "You're managing a compound scenario alone — earthquake damage, a gas smell, and a small injury — when a Sentinel becomes available to help, and responders arrive minutes later. What's the ideal full sequence?",
            options: [
              { text: "Delegate a specific, bounded task to the Sentinel, continue following the protect-reassess-identify-act sequence yourself, then brief responders concisely on the full picture and transition to their direction", correct: true },
              { text: "Handle everything alone until responders arrive, since delegating mid-crisis adds complexity", correct: false },
              { text: "Delegate the entire situation to the Sentinel once they're available, freeing yourself to brief responders early", correct: false },
              { text: "Brief responders as soon as they arrive, before addressing the gas smell or injury at all", correct: false },
            ],
            explanation: "This combines every core skill the capstone module targets — sequencing, effective delegation, and a complete, timely handoff — without skipping or over-delegating any part of the response.",
          },
          {
            id: "wardens-m6-l5-2",
            prompt: "Why does this module deliberately combine earthquake damage, a secondary hazard, delegation, AND a responder handoff into one capstone scenario, rather than testing each skill separately?",
            options: [
              { text: "Real multi-hazard incidents require all these skills working together under pressure, not applied one at a time", correct: true },
              { text: "It's simply a way to make the final module more difficult, without deeper purpose", correct: false },
              { text: "Combining the skills actually makes the scenario easier to manage", correct: false },
              { text: "Delegation and handoff are unrelated to hazard sequencing in practice", correct: false },
            ],
            explanation: "A real multi-hazard incident doesn't wait for you to apply sequencing, delegation, and handoff skills one at a time — this capstone scenario reflects that they have to work together under genuine pressure.",
          },
          {
            id: "wardens-m6-l5-3",
            prompt: "Why is \"the handoff itself is the correct command decision\" framed as an active choice a warden makes, rather than simply the end of their involvement?",
            options: [
              { text: "Choosing to hand off well — with a clear, complete brief — is itself a deliberate act of good command, not a passive stepping-back", correct: true },
              { text: "The handoff is actually a passive event that happens automatically once responders arrive", correct: false },
              { text: "This framing has no real practical significance for how a warden behaves", correct: false },
              { text: "A warden's involvement is considered a failure once a handoff becomes necessary", correct: false },
            ],
            explanation: "Executing a good handoff — clear, complete, and well-timed — is itself an active command decision, not simply the passive end of a warden's involvement; that reframing is central to how this module treats the handoff.",
          },
          {
            id: "wardens-m6-l5-4",
            prompt: "Why might the skills this capstone module builds — sequencing, delegation, and handoff — matter as much in a single, simpler hazard as in a genuinely compound one?",
            options: [
              { text: "The same underlying judgment and communication skills apply in any hazard situation, not only complex ones", correct: true },
              { text: "These skills are actually only relevant to compound, multi-hazard scenarios specifically", correct: false },
              { text: "Simple hazard situations never require any real sequencing or delegation", correct: false },
              { text: "This module's lessons don't meaningfully transfer to simpler situations", correct: false },
            ],
            explanation: "The core skills — sequencing your response, delegating clearly, and handing off well — remain valuable in any hazard situation; this capstone simply pushes you to apply them at their most demanding.",
          },
          {
            id: "wardens-m6-l5-5",
            prompt: "What's the ultimate distinction this capstone module draws between being a capable individual responder and being an effective warden?",
            options: [
              { text: "An effective warden coordinates a full response across sequencing, delegation, and handoff — not just handling their own part correctly", correct: true },
              { text: "There's no real distinction — both roles require exactly the same skills", correct: false },
              { text: "A capable individual responder is actually more valuable than a coordinating warden", correct: false },
              { text: "The distinction is purely about title, without any real skill difference", correct: false },
            ],
            explanation: "This capstone module draws a clear line: an effective warden coordinates the full response — sequencing their own actions, delegating to others, and handing off well to responders — which goes well beyond simply handling their own individual part correctly.",
          },
        ],
      },
    ],
  },
];
