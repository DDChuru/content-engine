/**
 * Food Safety Culture Training - Infographic Generator
 * Living a Positive Food Safety Culture
 *
 * Uses gemini-3-pro-image-preview for ALL image generation
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../../../projects/professional/food-safety/output/food-safety-culture/images');

// Culture-focused infographic prompts
const infographics = {

  // ============================================
  // MODULE 1: Why Culture Eats Compliance
  // ============================================

  '01-compliance-vs-culture': {
    module: 1,
    title: 'Compliance vs Culture',
    prompt: `Create a professional training infographic showing "COMPLIANCE vs CULTURE" in food safety.

Split design - two contrasting sides:

LEFT SIDE (Grey/Dull - Compliance):
- Title: "COMPLIANCE"
- Subtitle: "Doing the minimum"
- Visual: Worker with clipboard, checking boxes mechanically
- Thought bubble: "I have to do this"
- Only active when supervisor/auditor is watching (show figure watching)
- Clock watching - waiting for shift end
- Facial expression: Disengaged, going through motions

RIGHT SIDE (Vibrant Blue/Green - Culture):
- Title: "CULTURE"
- Subtitle: "Living it every day"
- Visual: Worker actively engaged, taking pride
- Thought bubble: "I want to do this right"
- Same attention whether alone or observed
- Pride in work
- Facial expression: Engaged, ownership

Bottom comparison table:
| Compliance | Culture |
| "I have to" | "I want to" |
| When watched | Always |
| Minimum | My standard |

Title at top: "WHAT'S THE DIFFERENCE?"
Subtitle: "Culture is what you do when no one's watching"

Style:
- Modern, clean infographic design
- High contrast between the two sides
- Professional training material look
- Food processing/industrial setting implied
- Aspirational - makes culture side attractive`
  },

  '02-when-no-ones-watching': {
    module: 1,
    title: 'When No One\'s Watching',
    prompt: `Create an impactful training infographic titled "THE REAL TEST"

Central concept:
Show a food processing worker alone in a facility - no supervisor, no cameras visible, end of shift setting.

Two choice paths branching from the worker:

PATH A (Wrong - faded/grey):
- "Take the shortcut"
- Skip steps when tired
- "No one will know"
- Leads to: Hidden contamination symbol

PATH B (Right - bright/highlighted):
- "Do it right anyway"
- Same standard, every time
- "I will know"
- Leads to: Protected food/safe product symbol

Central message in bold:
"CULTURE IS WHAT YOU DO WHEN NO ONE'S WATCHING"

Bottom text:
"The late shift. The last clean. The corner you could cut. That's where culture lives."

Style:
- Dramatic lighting - spotlight on worker making choice
- Fork in the road visual metaphor
- Emotional and thought-provoking
- Dark background with highlighted choice points
- Professional but inspirational
- Food safety context clear`
  },

  '03-faces-behind-food': {
    module: 1,
    title: 'The Faces Behind the Food',
    prompt: `Create an emotional training infographic titled "WHO ARE WE PROTECTING?"

Central visual:
Show diverse family members who consume the food we process:
- Elderly grandmother at dinner table
- Pregnant woman preparing meal
- Young child eating vegetables
- Immunocompromised person (perhaps hospital setting)

Around them, subtle text:
- "Someone's mother"
- "Someone's unborn child"
- "Someone's little one"
- "Someone fighting illness"

Key statistic (tastefully placed):
"Listeria kills 1 in 5 vulnerable people infected"

Bottom message:
"Every surface you clean protects a family"
"They're counting on you. They just don't know your name."

Style:
- Warm, human, emotional
- NOT scary or graphic - caring and protective
- Soft colors, family-focused imagery
- Professional but deeply personal
- Motivational - connects work to meaning
- NO gore or illness imagery - focus on the LIFE we protect`
  },

  // ============================================
  // MODULE 2: Know Your Enemy
  // ============================================

  '04-meet-the-enemy': {
    module: 2,
    title: 'Meet the Enemy',
    prompt: `Create an educational infographic titled "MEET THE ENEMY: LISTERIA"

Character-based approach - personify Listeria as a villain:
- Small but sinister looking microbe character
- Smart, patient, persistent personality
- Speech bubbles revealing its "powers":
  * "I LOVE the cold - your chillers are my home"
  * "I build invisible shields (biofilms)"
  * "I hide in cracks and crevices"
  * "I'm patient - I can wait for my chance"

Key facts around the character:
- Grows at refrigeration temperatures (unlike most bacteria)
- Forms protective biofilms
- Found naturally in soil and water
- Survives harsh conditions
- Zero tolerance in food (no acceptable level)

Bottom message:
"Know your enemy. Respect the threat. Beat it every day."

Style:
- Educational but engaging
- Character should be memorable but not cartoonish
- Dark/moody background suggesting the threat
- Scientific facts presented accessibly
- Training poster suitable for break room display`
  },

  '05-why-it-loves-our-environment': {
    module: 2,
    title: 'Why It Loves Our Environment',
    prompt: `Create an educational infographic titled "WHY LISTERIA LOVES VEGETABLE PROCESSING"

Show a vegetable processing facility with callouts highlighting risk factors:

RISK FACTOR 1: COLD TEMPERATURES
- Show chillers/cold rooms
- "Most bacteria slow down in cold. Listeria speeds up."
- Snowflake icon with warning

RISK FACTOR 2: WET ENVIRONMENTS
- Show wet floors, drains, washdown areas
- "Moisture is life for Listeria"
- Water droplet icon

RISK FACTOR 3: SOIL CONTACT
- Show vegetables being received
- "Vegetables come from the ground - Listeria's natural home"
- Soil/earth icon

RISK FACTOR 4: COMPLEX EQUIPMENT
- Show processing machinery
- "Hiding places everywhere - joints, seals, underneath"
- Equipment icon

RISK FACTOR 5: HIGH-TOUCH SURFACES
- Show conveyor, cutting boards, bins
- "Every touch is a transfer point"
- Hand/surface icon

Central message:
"Our environment is PERFECT for Listeria. That's why WE must be perfect at controlling it."

Style:
- Facility diagram/isometric view
- Color-coded risk zones
- Professional, educational
- Vegetable processing specific
- Not alarmist - factual and empowering`
  },

  '06-where-it-hides': {
    module: 2,
    title: 'Where It Hides',
    prompt: `Create a facility map infographic titled "WHERE LISTERIA HIDES"

Top-down or isometric view of vegetable processing area showing:

HOTSPOT 1: DRAINS (40% of positives)
- Red highlight
- "The central reservoir"
- "Never spray directly into drains"

HOTSPOT 2: FLOOR-WALL JUNCTIONS (Skirting)
- Red highlight
- "Cracks and gaps = perfect homes"
- "Check for damage daily"

HOTSPOT 3: EQUIPMENT UNDERSIDES
- Orange highlight
- "Hollow legs, joints, hard-to-reach"
- "Strip down for proper cleaning"

HOTSPOT 4: COLD ROOM DOOR SEALS
- Orange highlight
- "Condensation + cold = ideal conditions"
- "Inspect seals regularly"

HOTSPOT 5: CONDENSATION DRIP POINTS
- Yellow highlight
- "Anywhere water collects"
- "Look UP as well as down"

Legend:
- Red = Critical risk areas
- Orange = High attention areas
- Yellow = Monitor regularly

Bottom message:
"If you were Listeria, where would YOU hide? Now check there."

Style:
- Clean facility diagram
- Heat map style coloring
- Numbered callouts
- Easy to reference
- Could be printed as poster for facility`
  },

  '07-biofilm-shield': {
    module: 2,
    title: 'The Biofilm Shield',
    prompt: `Create an educational infographic titled "THE BIOFILM SHIELD - Why Scrubbing Matters"

Cross-section diagram showing:

STAGE 1: "Bacteria Arrive"
- Individual bacteria landing on surface
- "They find a spot"

STAGE 2: "Colony Forms"
- Bacteria multiplying
- "They invite friends"

STAGE 3: "Shield Goes Up"
- Biofilm matrix forming over bacteria
- "They build protection"

STAGE 4: "Sanitizer Applied (No Scrub)"
- Show sanitizer bouncing off biofilm
- "Chemicals can't penetrate the shield"
- Bacteria safe underneath
- RED X

STAGE 5: "Scrub + Sanitizer"
- Show scrubbing action breaking biofilm
- Then sanitizer reaching exposed bacteria
- "Break the shield THEN kill"
- GREEN CHECKMARK

Key insight:
"Biofilm is Listeria's armor. SCRUBBING breaks it. Then sanitizer can KILL."

Bottom message:
"This is why 'elbow juice' matters more than any chemical"

Style:
- Scientific but accessible
- Cross-section/cutaway view
- Before/after contrast
- Physical scrubbing action emphasized
- Educational diagram suitable for training`
  },

  // ============================================
  // MODULE 3: Your Role in the Chain
  // ============================================

  '08-last-line-of-defence': {
    module: 3,
    title: 'You Are the Last Line',
    prompt: `Create an impactful infographic titled "YOU ARE THE LAST LINE OF DEFENCE"

Visual flow/chain concept:

CHAIN LINKS leading to central figure:
Farm → Transport → Receiving → Storage → Processing → Packing → Distribution

In the center: A FOOD WORKER (cleaner/operator) - highlighted, heroic pose

After the worker:
→ Consumer's Table (family eating)

Key message around the worker:
- "Everything before you can be perfect"
- "If it fails HERE, none of that matters"
- "YOU are the final checkpoint"
- "You stand between contamination and someone's family"

Visual emphasis:
- Chain links leading to worker
- Worker larger/highlighted as critical point
- Family table shown as what's being protected
- Shield or guardian visual element

Bottom message:
"You're not 'just' anything. You're the last person who can stop contamination before it reaches a family."

Style:
- Heroic, empowering
- Chain/flow visualization
- Worker as central hero figure
- Protective, guardian imagery
- Professional but inspiring
- Food processing context`
  },

  '09-multiplier-effect': {
    module: 3,
    title: 'The Multiplier Effect',
    prompt: `Create an infographic titled "THE MULTIPLIER EFFECT"

Split into two scenarios branching from one person:

NEGATIVE MULTIPLIER (Left/Top):
- One missed spot
- → Contaminated surface
- → Contaminated equipment
- → Contaminated product batch
- → Multiple sick families
- Visual: Expanding circles of impact (red)
- "One shortcut. Hundreds affected."

POSITIVE MULTIPLIER (Right/Bottom):
- One person doing it right
- → Colleague sees and follows
- → Team standard rises
- → Culture of excellence
- → Safe product, protected families
- Visual: Expanding circles of positive impact (green)
- "One person leading. Everyone following."

Center message:
"YOU are a multiplier - positive or negative. Your choice."

Bottom insight:
"Every action ripples outward. Make it a good ripple."

Style:
- Ripple effect visualization
- Contrast between negative and positive paths
- Cause and effect clearly shown
- One person as the starting point of both scenarios
- Empowering - shows the power of individual action`
  },

  '10-every-role-counts': {
    module: 3,
    title: 'Every Role Counts',
    prompt: `Create an infographic titled "EVERY ROLE COUNTS"

Show different roles in a food processing facility, each with their food safety impact:

CLEANER
- Icon: Scrub brush
- "You remove contamination or spread it"
- "Your scrubbing breaks biofilms"

MACHINE OPERATOR
- Icon: Equipment controls
- "You see problems first - damaged seals, buildup, drips"
- "Your eyes catch what others miss"

PACKER
- Icon: Package/box
- "Last eyes on product before shipping"
- "Final checkpoint"

FORKLIFT/TROLLEY DRIVER
- Icon: Forklift
- "You control traffic flow"
- "Wheels can spread or contain"

QC INSPECTOR
- Icon: Clipboard
- "You verify the system"
- "But you can't be everywhere"

ALL ROLES (Central):
- Icon: Team/group
- "You SEE things others don't"
- "Your eyes matter"

Bottom message:
"No role is 'just' anything. Every role is a defence layer."

Style:
- Icon-based role representations
- Equal visual weight to all roles
- Team/collaborative feel
- Food processing setting
- Professional training poster style`
  },

  // ============================================
  // MODULE 4: Eyes of a Food Safety Hero
  // ============================================

  '11-five-second-scan': {
    module: 4,
    title: 'The 5-Second Scan',
    prompt: `Create a practical infographic titled "THE 5-SECOND SCAN"

Central figure: Worker pausing, alert posture, scanning environment

Four directions of scanning:

LOOK UP ↑
- What to check: Condensation, drips, overhead pipes, ceiling condition
- Icon: Upward arrow with eye
- "Where does water collect above you?"

LOOK DOWN ↓
- What to check: Floor condition, drains, standing water, debris
- Icon: Downward arrow with eye
- "Is the floor telling you something?"

LOOK AROUND ←→
- What to check: Equipment state, traffic, zone boundaries
- Icon: Horizontal arrows with eye
- "What's moving through your space?"

LOOK CLOSE 🔍
- What to check: Surface condition where you're working, crevices, joints
- Icon: Magnifying glass
- "What does the surface really look like?"

Center instruction:
"Before EVERY task - pause - scan - proceed"
"5 seconds that could catch a problem"

Bottom message:
"Train your eyes. Make scanning automatic."

Style:
- Clean, directional design
- Four quadrants or compass style
- Practical and actionable
- Easy to remember
- Suitable as quick reference poster`
  },

  '12-spot-the-risk': {
    module: 4,
    title: 'Spot the Risk',
    prompt: `Create a hazard identification training infographic titled "SPOT THE RISK"

Show a food processing scene with multiple hazards to identify:

STRUCTURAL RISKS (Mark in RED):
- Crack in floor tile
- Gap at skirting/wall junction
- Damaged door seal
- Rust on equipment leg
- Damaged drain cover

CONTAMINATION SIGNS (Mark in ORANGE):
- Slimy residue on equipment
- Discoloration on surface
- Debris buildup in corner
- Standing water

TRAFFIC RISKS (Mark in YELLOW):
- Trolley with dirty wheels
- Wrong color tool in area
- Footprints across zones
- Equipment crossing boundaries

Layout:
- Realistic facility scene
- Numbered hazards for identification
- Answer key at bottom or side
- Interactive "find the hazard" style

Message at top:
"How many risks can you spot?"

Message at bottom:
"A food safety hero sees what others walk past"

Style:
- Detailed facility illustration
- Hidden hazard style (like Where's Waldo but for food safety)
- Training exercise format
- Can be used for group discussion`
  },

  '13-trust-your-eyes': {
    module: 4,
    title: 'Trust Your Eyes',
    prompt: `Create a visual checklist infographic titled "TRUST YOUR EYES"

What to look for - organized by sense:

SEE IT:
- Cracks, gaps, holes in surfaces
- Discoloration or staining
- Rust, corrosion, damage
- Standing water where it shouldn't be
- Debris, buildup, residue
- Worn or damaged seals
- Missing parts or covers

FEEL IT:
- Slimy surfaces (biofilm!)
- Rough areas that should be smooth
- Loose fittings
- Wet areas in dry zones

SMELL IT:
- Unusual odors
- Stale or musty smell
- Chemical smells where unexpected

THE GOLDEN RULE:
Large text in center:
"If something doesn't seem right, IT PROBABLY ISN'T"
"If you're wondering 'should I report this?' - YES."

Bottom message:
"Trust your instincts. Your eyes catch what tests miss."

Style:
- Clean checklist format
- Icons for each item
- See/Feel/Smell sections
- Easy to scan
- Practical reference
- Empowering message`
  },

  '14-if-listeria-could-choose': {
    module: 4,
    title: 'If Listeria Could Choose',
    prompt: `Create an engaging infographic titled "IF LISTERIA COULD CHOOSE..."

Concept: Show what Listeria would want (its "wishlist") vs what we give it instead

LISTERIA'S WISHLIST (Left side - red X marks):
- "A nice crack to hide in" → We seal and report cracks
- "Standing water to grow in" → We eliminate pooling water
- "A dirty tool to travel on" → We sanitize and color-code tools
- "A neglected corner" → We clean everywhere, every time
- "A shortcut you took" → We do it right, always
- "A problem you didn't report" → We speak up immediately

OUR RESPONSE (Right side - green checks):
Each wishlist item has the counter-action

Center message:
"Every day, you decide what Listeria gets."
"Make its life difficult."

Bottom:
"A hostile environment for Listeria = A safe environment for people"

Style:
- Two-column comparison
- Listeria as a frustrated character/villain
- Empowering counter-actions
- Checklist feel
- Memorable and engaging
- Makes prevention feel like winning`
  },

  // ============================================
  // MODULE 5: The Daily Rituals
  // ============================================

  '15-five-step-ritual': {
    module: 5,
    title: 'The 5-Step Ritual',
    prompt: `Create a cleaning protocol infographic titled "THE 5-STEP RITUAL"

Sequential flow showing proper cleaning:

STEP 1: DRY PICKUP
- Icon: Squeegee/scraper
- "Remove debris DRY first"
- "No water yet!"
- Purpose: Remove gross soil

STEP 2: PRE-RINSE
- Icon: Gentle water stream
- "LOW PRESSURE rinse"
- "No splashing!"
- Purpose: Loosen remaining soil

STEP 3: DETERGENT + SCRUB (BIGGEST/HIGHLIGHTED)
- Icon: Brush + flexed arm muscle
- "Apply detergent"
- "SCRUB - This is where it counts!"
- "Break the biofilm"
- Contact time clock shown
- THIS STEP LARGEST

STEP 4: RINSE
- Icon: Water
- "Rinse all detergent"
- "Top to bottom, toward drain"
- Purpose: Remove detergent and loosened soil

STEP 5: SANITIZE
- Icon: Spray bottle with checkmark
- "Apply sanitizer"
- "Correct dilution + contact time"
- "Don't rinse off!"
- Purpose: Kill remaining bacteria

Flow arrows between each step
Step 3 visually emphasized as most important

Bottom message:
"Every step matters. Step 3 matters most."

Style:
- Vertical or horizontal flow
- Clear numbered progression
- Step 3 larger/highlighted
- Practical, actionable
- Suitable as workstation reference`
  },

  '16-elbow-juice': {
    module: 5,
    title: 'Elbow Juice Matters',
    prompt: `Create a powerful comparison infographic titled "ELBOW JUICE MATTERS!"

Split comparison:

LEFT SIDE - WRONG (Red X):
Title: "SPRAY ALONE = FAIL"
- Show: Sanitizer being sprayed on surface
- Below surface: Bacteria protected by biofilm dome
- Bacteria character smiling, saying "Thanks for the shower! Still safe in here!"
- Result: Listeria survives

RIGHT SIDE - CORRECT (Green checkmark):
Title: "SCRUB + SPRAY = SUCCESS"
- Show: Physical scrubbing with brush, motion lines, effort shown
- Below surface: Biofilm broken apart, bacteria exposed
- Then sanitizer applied
- Bacteria exposed and killed
- Result: Surface truly clean

Center visual comparison:
Show biofilm cross-section:
- Spray alone: Bounces off shield
- Scrub then spray: Breaks shield, chemicals reach bacteria

Bottom message (bold):
"BIOFILM is armor. SCRUBBING breaks it. Then sanitizer KILLS."
"No scrub = No clean. It's that simple."

Subtitle:
"Your elbow is more powerful than any chemical"

Style:
- Strong visual contrast
- Physical effort shown (flexed arm, motion)
- Before/after comparison
- Memorable and clear
- Scientific but accessible`
  },

  '17-non-negotiables': {
    module: 5,
    title: 'Non-Negotiables',
    prompt: `Create a list-style infographic titled "THE NON-NEGOTIABLES"

Subtitle: "These are not suggestions. These are standards."

List format with icons:

✓ HANDWASHING
- Before entering production
- After touching drains/floors/bins
- After removing gloves
- 20 seconds minimum
- "Every time. No exceptions."

✓ BOOT PROTOCOL
- Boot wash/change at zone transitions
- Never walk contamination into clean areas
- "Your feet are transport vehicles"

✓ TOOL DISCIPLINE
- Color codes respected
- Drain tools NEVER on equipment
- Tools cleaned after EVERY use
- "Wrong color = wrong place"

✓ THE SCRUB
- Always included in cleaning
- Physical effort applied
- "Spray alone is not cleaning"

✓ REPORT IMMEDIATELY
- See something, say something
- Don't wait for end of shift
- "Problems hidden become crises"

Central visual:
Badge or stamp style "NON-NEGOTIABLE" marking

Bottom message:
"These aren't extra. These are the baseline. Every day."

Style:
- Checklist/list format
- Bold, authoritative
- Non-negotiable feel
- Easy to reference
- Could be posted as commitment poster`
  },

  '18-tool-discipline': {
    module: 5,
    title: 'Tool Discipline',
    prompt: `Create a tool management infographic titled "TOOL DISCIPLINE"

Section 1: COLOR CODE SYSTEM
Show different colored tools with zones:
- RED = Drains ONLY (Never on equipment!)
- BLUE = Floors
- WHITE/YELLOW = Food contact surfaces
- "Colors exist for a reason. Respect them."

Section 2: CLEAN YOUR TOOLS
Before and after each use:
- Wash
- Sanitize
- Rinse
- "Dirty tools spread contamination"

Section 3: STORE CORRECTLY
RIGHT (Green check):
- Tools hanging (elevated, air drying)
- Organized by color

WRONG (Red X):
- Tools standing in dirty water/bucket
- Mixed colors together
- On floor

Section 4: INSPECT DAILY
- Worn bristles = bacteria hideouts
- Cracked handles = contamination traps
- "Damaged? Replace it!"

Central rule:
"Your tools are only as clean as YOU make them"

Bottom message:
"A dirty brush doesn't clean - it spreads"

Style:
- Organized sections
- Color-coded visuals
- Practical reference
- Tool illustrations
- Suitable for cleaning station posting`
  },

  // ============================================
  // MODULE 6: When Things Go Wrong
  // ============================================

  '19-see-it-say-it': {
    module: 6,
    title: 'See It. Say It. Solve It.',
    prompt: `Create a reporting culture infographic titled "SEE IT. SAY IT. SOLVE IT."

Three-step flow:

SEE IT 👁️
What to look for:
- Structural damage (cracks, gaps, rust)
- Equipment issues (damaged seals, buildup)
- Unusual observations (slime, odor)
- Pest signs
- "Anything that doesn't seem right"

SAY IT 🗣️
How to report:
- Tell supervisor IMMEDIATELY
- Be specific: WHERE, WHAT, WHEN
- Don't wait for end of shift
- "If in doubt, report anyway"

SOLVE IT ✓
What happens:
- Issue gets assessed
- Action gets taken
- You get feedback
- Problem fixed before it grows

Escalation path visual:
YOU → SUPERVISOR → QC/MANAGEMENT → DOCUMENTED & RESOLVED

Key messages:
- "Reporting is PROTECTING, not complaining"
- "Finding problems = WINNING"
- "The only failure is staying quiet"

Bottom:
"In a safety culture, problems get reported. In a fear culture, they get hidden. Which do you want?"

Style:
- Three-step flow
- Icons for each step
- Positive framing of reporting
- Escalation pathway clear
- Empowering, not punitive`
  },

  '20-hidden-problem': {
    module: 6,
    title: 'The Hidden Problem',
    prompt: `Create a consequences infographic titled "THE HIDDEN PROBLEM"

Two paths from discovering an issue:

PATH A - HIDE IT (Bad - greyed/red):
- "I'll ignore it"
- "Someone else will handle it"
- "I don't want to cause trouble"
Timeline progression:
Day 1: Small crack in skirting
Day 7: Biofilm establishes
Day 14: Positive result found
Day 21: Multiple positives, investigation, crisis
End: Major problem, potential recall

PATH B - REPORT IT (Good - green/highlighted):
- "I'll flag it now"
- "Better safe than sorry"
- "This is my responsibility"
Timeline progression:
Day 1: Small crack reported
Day 2: Assessed and scheduled for repair
Day 5: Fixed
End: Problem solved, crisis prevented

Central insight:
"A small problem reported = Small fix"
"A small problem hidden = Big crisis"

Bottom message:
"The cover-up is ALWAYS worse than the issue"
"Speaking up shows strength, not weakness"

Style:
- Two-path comparison
- Timeline progression
- Cause and effect clear
- Dramatic contrast between outcomes
- Encourages reporting`
  },

  // ============================================
  // MODULE 7: Celebrating Success
  // ============================================

  '21-every-negative-is-a-win': {
    module: 7,
    title: 'Every Negative is a Win',
    prompt: `Create a celebratory infographic titled "EVERY NEGATIVE IS A WIN"

Visual concept: Scoreboard/streak counter style

CELEBRATING OUR RESULTS:
- Clean swab = Someone did their job RIGHT
- Day of negatives = Team excellence
- Week of negatives = Culture building
- Month of negatives = Standard being set

STREAK MENTALITY:
Like a sports winning streak counter:
"Consecutive Negative Days: [XX]"
"Don't break the streak!"

Recognition elements:
- Trophy/medal icons
- Team celebration imagery
- Achievement badges style

Messages:
- "Negative results aren't boring - they're VICTORIES"
- "Every test we pass is a family we protected"
- "This is what winning looks like"

Bottom:
"Consecutive negatives aren't luck. They're EARNED."
"By you. Every day."

Style:
- Celebratory, positive
- Sports/achievement metaphor
- Scoreboard/streak counter visual
- Team success feel
- Motivational poster style`
  },

  '22-we-are-protectors': {
    module: 7,
    title: 'We Are Protectors',
    prompt: `Create an inspirational infographic titled "WE ARE PROTECTORS"

Central powerful image:
Food worker in heroic/guardian stance, professional but proud

Around the figure, role transformations:
- "I'm a cleaner" → "I REMOVE contamination"
- "I'm a packer" → "I'm the FINAL checkpoint"
- "I'm an operator" → "I CATCH problems first"
- "I work in food" → "I PROTECT families"

Shield or badge concept:
"FOOD SAFETY PROTECTOR"

Commitment statements:
- "We don't do the minimum - we do what's RIGHT"
- "We don't hide problems - we FIND them"
- "We don't work alone - we WIN together"
- "We don't just comply - we LEAD"

Bottom message:
"Every person who handles food is a protector."
"Wear that with pride."

Final line:
"Consecutive negatives. Protected families. That's our legacy."

Style:
- Heroic, empowering
- Pride and purpose
- Guardian/protector imagery
- Professional but inspirational
- Suitable as facility entrance poster
- Team identity building`
  }
};

class InfographicGenerator {
  constructor(apiKey) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.costPerImage = 0.039;
  }

  async generate(name, config) {
    try {
      console.log(`\n[Module ${config.module}] Generating: ${config.title}...`);

      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: config.prompt,
        config: {
          imageConfig: {
            aspectRatio: '4:3',
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in response');
      }

      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      const extension = mimeType.includes('jpeg') ? 'jpg' :
                       mimeType.includes('webp') ? 'webp' : 'png';

      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      const filepath = path.join(OUTPUT_DIR, `${name}.${extension}`);
      await fs.writeFile(filepath, imageBuffer);

      console.log(`  [✓] Saved: ${name}.${extension}`);
      return { success: true, path: filepath, cost: this.costPerImage, title: config.title, module: config.module };

    } catch (error) {
      console.error(`  [✗] Error: ${error.message}`);
      return { success: false, error: error.message, cost: 0, title: config.title, module: config.module };
    }
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('LIVING A POSITIVE FOOD SAFETY CULTURE');
  console.log('Infographic Generator');
  console.log('═'.repeat(60));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('\nERROR: GEMINI_API_KEY not found in .env');
    process.exit(1);
  }

  // Check for specific infographic argument
  const targetInfographic = process.argv[2];
  let infographicsToGenerate = Object.entries(infographics);

  if (targetInfographic) {
    if (targetInfographic.startsWith('module')) {
      // Generate all for a module (e.g., "module1")
      const moduleNum = parseInt(targetInfographic.replace('module', ''));
      infographicsToGenerate = infographicsToGenerate.filter(([_, config]) => config.module === moduleNum);
      console.log(`\nGenerating Module ${moduleNum} infographics only`);
    } else {
      // Generate specific infographic
      infographicsToGenerate = infographicsToGenerate.filter(([name, _]) => name === targetInfographic);
      if (infographicsToGenerate.length === 0) {
        console.error(`\nInfographic "${targetInfographic}" not found`);
        console.log('\nAvailable infographics:');
        Object.keys(infographics).forEach(name => console.log(`  - ${name}`));
        process.exit(1);
      }
    }
  }

  console.log(`\nOutput: ${OUTPUT_DIR}`);
  console.log(`Infographics to generate: ${infographicsToGenerate.length}`);

  const generator = new InfographicGenerator(apiKey);
  const results = [];
  let totalCost = 0;

  for (const [name, config] of infographicsToGenerate) {
    const result = await generator.generate(name, config);
    results.push({ name, ...result });
    totalCost += result.cost;

    // Delay between generations to avoid rate limiting
    if (infographicsToGenerate.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('═'.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  // Group by module
  const byModule = {};
  successful.forEach(r => {
    if (!byModule[r.module]) byModule[r.module] = [];
    byModule[r.module].push(r);
  });

  console.log('\nSuccessful by Module:');
  Object.entries(byModule).forEach(([module, items]) => {
    console.log(`\n  Module ${module}:`);
    items.forEach(r => console.log(`    ✓ ${r.title}`));
  });

  if (failed.length > 0) {
    console.log(`\nFailed: ${failed.length}`);
    failed.forEach(r => console.log(`  ✗ ${r.title}: ${r.error}`));
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Total generated: ${successful.length}/${results.length}`);
  console.log(`Total cost: $${totalCost.toFixed(3)}`);
  console.log(`\nImages saved to:\n${OUTPUT_DIR}`);
}

main().catch(console.error);
