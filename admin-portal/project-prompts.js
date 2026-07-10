/**
 * ─── ZIMSEC School-Based Project — Shared Prompt Library ─────────────────────
 * Used by both index.js (WhatsApp bot) and admin-portal/server.js (web portal)
 * so the generated project content is identical in structure and mark-scheme
 * alignment (5 / 10 / 10 / 10 / 10 / 5 = 50 marks) across both surfaces.
 */

// ─── Level-based complexity/calc guidance ─────────────────────────────────────
export function levelContext(level, isForm) {
  const n = parseInt((level.match(/\d+/) || ['0'])[0], 10);
  if (!isForm) {
    return n <= 4
      ? {
          complexity:
            'VERY SIMPLE PRIMARY (Grade 1–4, ages 6–10). MANDATORY RULES:\n' +
            '• Use ONLY simple everyday English words a 7-year-old uses at home.\n' +
            '• Maximum 8–10 words per sentence. One idea per sentence.\n' +
            '• NEVER use big or technical words. Replace ANY long word with a short one (e.g. "investigate" → "find out", "observe" → "look at", "phenomenon" → "thing", "utilise" → "use", "hypothesis" → "what I think will happen").\n' +
            '• If you must use a science word, immediately explain it in brackets in tiny-kid words.\n' +
            '• Use kid-friendly examples: toys, food, water, sand, plants, pets, the sun, family.\n' +
            '• Tone: warm, encouraging, like a kind primary teacher talking to a small child.',
          calc: 'Use only counting, drawing pictures, simple measuring (cups, steps, fingers), or adding/subtracting small numbers. Show working with pictures or tally marks. No formulas.',
        }
      : {
          complexity:
            'SIMPLE PRIMARY (Grade 5–7, ages 10–13). MANDATORY RULES:\n' +
            '• Use simple, clear English a Grade 6 child understands. NO jargon, NO long academic words.\n' +
            '• Sentences short (max 12–15 words). Explain anything new in plain words.\n' +
            '• Replace big words with simple ones (e.g. "demonstrate" → "show", "subsequently" → "then", "analyse" → "look at carefully").\n' +
            '• Use local Zimbabwe examples (mealie-meal, sadza, borehole, chickens, school garden).\n' +
            '• Activities must be doable at primary school with cheap or free items.',
          calc: 'Use simple measurements (cm, ml, kg), tally counts, basic +, −, ×, ÷ with units. Show every step in words a child can follow. No algebra.',
        };
  }
  if (n <= 2) return { complexity: 'BASIC — Form 1-2. Concrete real-world topics. No jargon. School lab experiments a 13-15 year old can do.', calc: 'Include basic formulas, step-by-step calculations with real values and units.' };
  if (n <= 4) return { complexity: 'INTERMEDIATE — Form 3-4 O-Level. ZIMSEC O-level standard. Analytical, local Zimbabwean context.', calc: 'Include worked numerical examples, correct formulas, data tables. Show all steps.' };
  return { complexity: 'ADVANCED — Form 5-6 A-Level/Cambridge. Research-based, higher-order analysis. ISO-quality language.', calc: 'Include full mathematical/scientific derivations with numbered steps, real values, correct units, and analytical commentary.' };
}

// PLAIN_FMT is used for WhatsApp-style plain text output (no markdown).
export const PLAIN_FMT = `STRICT FORMATTING:
• PLAIN TEXT ONLY — no markdown (#, **, __, ~~, |)
• Lists use bullet: •
• Full sentences — minimum 3 per paragraph
• No greetings, sign-offs, or meta-commentary — content only`;

// MARKDOWN_FMT is used for the web portal, where the output is rendered with
// react-markdown + KaTeX, so proper markdown headings, bold, and LaTeX math
// ($...$ / $$...$$) are desired instead of plain text.
export const MARKDOWN_FMT = `STRICT FORMATTING:
• Use Markdown: ## for stage headings, ### for sub-headings, **bold** for key terms
• Use LaTeX math for ALL formulas, equations, and calculations — inline as $...$ or block as $$...$$
• Lists use "- " bullets
• Full sentences — minimum 3 per paragraph
• No greetings, sign-offs, or meta-commentary — content only`;

function buildPrompts(FMT) {
  const PREAMBLE_PROMPT = (subject, level, isForm, topic) => {
    const { complexity } = levelContext(level, isForm);
    return `${FMT}

You are writing the cover section of a ZIMSEC Heritage-Based Curriculum School-Based Project.
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}

Write EXACTLY these sections in order, using the EXACT heading format shown:

PROJECT TITLE: [Write a single compelling title: "How [${subject} Concept] Can Be Used to [Solve a Specific Real Problem in Zimbabwe]". Must be unique, descriptive, and relevant.]

SYLLABUS TOPICS
• [Specific ${subject} syllabus topic directly used in this project]
• [Second topic]
• [Third topic]
• [Fourth topic]

PROJECT OBJECTIVE
[Write 4 full sentences. State: (1) what this project sets out to achieve, (2) which specific ${subject} concepts are applied, (3) what real-world Zimbabwean problem is addressed, (4) what benefit the outcome provides.]

PROJECT DESCRIPTION
[Write 5 full sentences. Describe: the problem identified, why ${subject} is the best tool to address it, the method of investigation used, what evidence will be produced, and the expected outcome for the community or school.]

TABLE OF CONTENTS
1. Stage 1: Problem Identification — 5 marks
2. Stage 2: Investigation of Related Ideas — 10 marks
3. Stage 3: Generation of Ideas / Possible Solutions — 10 marks
4. Stage 4: Development and Refinement of Chosen Idea — 10 marks
5. Stage 5: Presentation of Final Solution — 10 marks
6. Stage 6: Evaluation and Recommendations — 5 marks`;
  };

  const STAGE1_PROMPT = (subject, level, isForm, topic) => {
    const { complexity, calc } = levelContext(level, isForm);
    return `${FMT}

Write ONLY Stage 1 of a ZIMSEC School-Based Project (aim to score ALL 5 marks).
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}
${calc}

STAGE 1: PROBLEM IDENTIFICATION [5 MARKS]

1.1 Description of the Problem [1 mark — be specific and concrete]
Write 4-5 sentences identifying a real, specific problem in Zimbabwe connected to ${subject}${topic ? ` and ${topic}` : ''}. Name the exact gap, who is affected, where it occurs, and why existing solutions are inadequate. This must be convincing enough to earn the full 1 mark.

1.2 Statement of Intent [2 marks — clearly state what you will do and how]
Write 4-5 sentences. State exactly what this project will create or investigate. Explicitly state which ${subject} concepts will be applied. Describe the expected outcome. Link the intent directly back to the problem in 1.1. Use confident, purposeful academic language to earn both marks.

1.3 Design and Project Specifications [2 marks — list at least 3 measurable specs]
Introduce with 2 sentences explaining what specifications are and why they matter for this project.
List 4 specific, measurable design specifications (each must have criteria that can be checked):
• [Specification 1 — must include a measurable criterion, e.g. cost, size, quantity, time]
• [Specification 2 — different dimension of the design]
• [Specification 3 — quality or performance standard]
• [Specification 4 — material, safety, or accessibility requirement]`;
  };

  const STAGE2_PROMPT = (subject, level, isForm, topic) => {
    const { complexity, calc } = levelContext(level, isForm);
    return `${FMT}

Write ONLY Stage 2 of a ZIMSEC School-Based Project (aim to score ALL 10 marks).
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}
${calc}

Marking: 3 ideas × 1 mark (3) + 3 merits × 1 mark (3) + 3 demerits × 1 mark (3) + quality (1) = 10 marks

STAGE 2: INVESTIGATION OF RELATED IDEAS [10 MARKS]

Write an opening paragraph (3 sentences) explaining that you researched three existing approaches related to the problem. State why it is important to investigate what already exists before designing a new solution.

2.1 Related Idea 1: [Name a real, specific existing method, product, or approach that exists in Zimbabwe or Africa — not invented] [1 mark]
Write 5-6 sentences. Describe: what this idea is, how it specifically works, where it is used in Zimbabwe or Africa, what ${subject} principles it applies, and how it connects to the project topic. Include a specific example or data point to strengthen the description.

2.2 Related Idea 2: [Name a different real existing method or approach] [1 mark]
Write 5-6 sentences using the same depth as Idea 1. Ensure this is clearly different from Idea 1.

2.3 Related Idea 3: [Name a third distinct real method] [1 mark]
Write 5-6 sentences. Ensure all three ideas are clearly distinct from each other.

Analysis of Related Ideas [6 marks — earn all 6 by being specific]

Merits [3 marks — 1 mark per merit — must be specific, not generic]
• Idea 1 Merit — [Write a specific, detailed advantage directly relevant to solving the project problem. 2 sentences.]
• Idea 2 Merit — [Specific advantage of this idea, 2 sentences.]
• Idea 3 Merit — [Specific advantage, 2 sentences.]

Demerits [3 marks — 1 mark per demerit — must be specific, not generic]
• Idea 1 Demerit — [Write a specific, detailed weakness that limits this idea's use. 2 sentences.]
• Idea 2 Demerit — [Specific weakness, 2 sentences.]
• Idea 3 Demerit — [Specific weakness, 2 sentences.]

Summary and Quality of Stage 2 [1 mark]
Write 4-5 sentences. Summarise what was learnt from all three ideas. Explain which idea came closest to solving the problem and why. Explain how investigating these ideas directly informed what will be designed in Stage 3.`;
  };

  const STAGE3_PROMPT = (subject, level, isForm, topic) => {
    const { complexity, calc } = levelContext(level, isForm);
    return `${FMT}

Write ONLY Stage 3 of a ZIMSEC School-Based Project (aim to score ALL 10 marks).
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}
${calc}

Marking: 3 solutions × 1 mark (3) + 3 merits × 1 mark (3) + 3 demerits × 1 mark (3) + quality (1) = 10 marks

STAGE 3: GENERATION OF IDEAS / POSSIBLE SOLUTIONS [10 MARKS]

Write an opening paragraph (3 sentences) explaining that you developed three original student-designed solutions using concepts from ${subject}. These are NOT existing ideas — they are new solutions created by the student.

3.1 Solution 1: [Give this solution a specific, descriptive name] [1 mark]
Write 5-6 sentences describing how this solution works. Include: what ${subject} concept is applied, how it specifically addresses the problem, what resources are needed, and how a student could implement it.
Worked Example: [Show a real numerical calculation, formula application, measurement, or step-by-step method using ${subject} concepts. Show all working with correct units. Minimum 4 calculation steps.]

Merits of Solution 1 [1 mark — must be specific and relevant]
• [Merit 1 — specific advantage, 2 sentences explaining the benefit clearly]
• [Merit 2 — different advantage, 2 sentences]

Demerits of Solution 1 [1 mark — must be specific and honest]
• [Demerit 1 — specific limitation, 2 sentences explaining the drawback]

3.2 Solution 2: [Give this solution a specific, descriptive name — must be clearly different from Solution 1] [1 mark]
Write 5-6 sentences. Different approach or ${subject} concept from Solution 1.
Worked Example: [Different calculation or method. Minimum 4 steps.]

Merits of Solution 2 [1 mark]
• [Merit 1, 2 sentences]
• [Merit 2, 2 sentences]

Demerits of Solution 2 [1 mark]
• [Demerit 1, 2 sentences]

3.3 Solution 3: [Give this solution a specific, descriptive name — must be clearly different from Solutions 1 and 2] [1 mark]
Write 5-6 sentences.
Worked Example: [Different calculation or method. Minimum 4 steps.]

Merits of Solution 3 [1 mark]
• [Merit 1, 2 sentences]
• [Merit 2, 2 sentences]

Demerits of Solution 3 [1 mark]
• [Demerit 1, 2 sentences]

Summary and Quality of Stage 3 [1 mark]
Write 4-5 sentences. Compare all three solutions — cost, feasibility, accuracy, and relevance to the problem. State which solution is most suitable to develop further in Stage 4 and give clear reasons backed by the worked examples.`;
  };

  const STAGE4_PROMPT = (subject, level, isForm, topic) => {
    const { complexity, calc } = levelContext(level, isForm);
    return `${FMT}

Write ONLY Stage 4 of a ZIMSEC School-Based Project (aim to score ALL 10 marks).
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}
${calc}

Marking: chosen idea (1) + justification/2 points (2) + 3 refinements × 2 each (6) + impression (1) = 10 marks

STAGE 4: DEVELOPMENT AND REFINEMENT OF CHOSEN IDEA [10 MARKS]

4.1 Indication of Chosen Solution [1 mark]
Write 3-4 sentences. Clearly state which solution from Stage 3 was selected as the best. Briefly describe what makes it stand out as the chosen approach.

4.2 Justification of Choice [2 marks — need at least 2 specific, well-evidenced reasons]
Write 5-6 sentences. Give 3 specific reasons why this solution was chosen over the others. Reference evidence from Stage 3 worked examples and the merits/demerits analysis. Link each reason back to solving the original problem from Stage 1.

4.3 Refinements and Developments [6 marks — 2 marks each — must be specific and detailed]

Refinement 1: [Give this refinement a clear, descriptive name]
Write 4 sentences describing this improvement. State: (1) what the original weakness or gap was, (2) exactly what was changed or added, (3) how this change improves the solution, (4) evidence or calculation showing the improvement. Include a before/after comparison with specific values where possible.

Refinement 2: [Give this refinement a clear, descriptive name — different aspect from Refinement 1]
Write 4 sentences using the same structure. Include specific technical or subject-related detail that shows real development of the idea.

Refinement 3: [Give this refinement a clear, descriptive name — different aspect from Refinements 1 and 2]
Write 4 sentences. This refinement should address a practical, safety, or quality issue not covered by the first two.

4.4 Overall Presentation and Impression [1 mark]
Write 3-4 sentences reflecting on the development process. Describe how the idea evolved from the initial concept in Stage 3 to the refined version here. Comment on what the refinements collectively achieve and how the solution is now much stronger than the original.`;
  };

  const STAGE5_PROMPT = (subject, level, isForm, topic) => {
    const { complexity, calc } = levelContext(level, isForm);
    return `${FMT}

Write ONLY Stage 5 of a ZIMSEC School-Based Project (aim to score ALL 10 marks).
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}
${calc}

Marking: quality, communication, standards compliance, and completeness of presentation = 10 marks

STAGE 5: PRESENTATION OF THE FINAL SOLUTION [10 MARKS]

Final Solution Overview
Write 5-6 full sentences describing the completed final solution. Include: what it is, how it works, which ${subject} concepts it applies, who benefits, where it would be used in Zimbabwe, and how it fully addresses the original problem identified in Stage 1.

Type of Presentation
State whether the final solution is presented as: an Artefact (physical model or prototype), a Service (report, poster, video, demonstration, performance), or a Product (cream, food, cosmetic, herbal, chemical product). Write 3-4 sentences describing exactly what form the presentation takes, what it includes, and how it would be shown to a teacher or audience.

Complete Mathematical and Scientific Working
This is the most important section of Stage 5. Show the complete, detailed step-by-step application of ${subject} to this solution. Write out all formulas, substitute all real values, show every calculation step, include correct units, and explain each step in plain language. This must demonstrate full command of the ${subject} concepts. Minimum 8 numbered steps.

Key Findings and Results
Write 4-5 sentences summarising the main results, data, or outputs produced by the project. Reference specific numbers or outcomes from the working above. Explain what these results mean for the real-world problem.

Materials and Resources Required
• [Item 1 — specify quantity and where to source it in Zimbabwe]
• [Item 2 — with quantity and source]
• [Item 3 — with quantity and source]
• [Item 4]
• [Item 5]
• [Item 6]

Standards and Quality Compliance
Write 4-5 sentences explaining how this project meets: (1) ZIMSEC Heritage-Based Curriculum learning standards, (2) ISO quality or safety standards relevant to the subject, (3) age-appropriateness for ${level} students, (4) ethical or environmental considerations.

Stage 5 Conclusion
Write 3-4 sentences summarising what was presented, what evidence was produced, and how Stage 5 demonstrates the power of ${subject} in solving real-world problems.`;
  };

  const STAGE6_PROMPT = (subject, level, isForm, topic) => {
    const { complexity } = levelContext(level, isForm);
    return `${FMT}

Write ONLY Stage 6 of a ZIMSEC School-Based Project (aim to score ALL 5 marks).
Subject: ${subject}${topic ? ` — Topic: ${topic}` : ''}  |  Level: ${level}  |  ${complexity}

Marking: relevance (2) + challenges (1) + recommendations (2) = 5 marks

STAGE 6: EVALUATION AND RECOMMENDATIONS [5 MARKS]

6.1 Relevance to Statement of Intent [2 marks — must be honest, specific, and evaluative]
Write 6-7 evaluative sentences. (1) Directly restate the original statement of intent from Stage 1. (2) State clearly what was achieved and provide specific evidence. (3) State what the project demonstrated about the usefulness of ${subject}. (4) Acknowledge one area where the project fell short of the original intent. (5) Explain what this gap means for the overall project outcome. Use academic evaluative language to earn both marks.

6.2 Challenges Encountered [1 mark — must be honest and specific]
Write 4-5 sentences. Describe 3 specific real challenges faced during the project. For each challenge, name it precisely, explain why it occurred, and state how it affected the project. Do NOT give vague or generic challenges — be specific to this subject and topic.

6.3 Recommendations for Future Improvement [2 marks — must be specific and actionable]
Write 6-7 sentences. Give 4 specific, well-explained recommendations. Each recommendation must: (1) name the improvement, (2) explain how it would be implemented, (3) state what benefit it would provide. Link recommendations directly to the challenges in 6.2 and the original problem in Stage 1. End with a forward-looking statement about how this project could be extended or applied more broadly in Zimbabwe.

Conclusion
Write 5-6 sentences as a formal academic conclusion. Summarise: what was achieved, which ${subject} concepts were applied and how, what the project demonstrates about the value of ${subject} in solving real-world problems, and what impact this type of project could have on education and community development in Zimbabwe.`;
  };

  return { PREAMBLE_PROMPT, STAGE1_PROMPT, STAGE2_PROMPT, STAGE3_PROMPT, STAGE4_PROMPT, STAGE5_PROMPT, STAGE6_PROMPT };
}

export const {
  PREAMBLE_PROMPT,
  STAGE1_PROMPT,
  STAGE2_PROMPT,
  STAGE3_PROMPT,
  STAGE4_PROMPT,
  STAGE5_PROMPT,
  STAGE6_PROMPT,
} = buildPrompts(PLAIN_FMT);

export const {
  PREAMBLE_PROMPT: PREAMBLE_PROMPT_MD,
  STAGE1_PROMPT: STAGE1_PROMPT_MD,
  STAGE2_PROMPT: STAGE2_PROMPT_MD,
  STAGE3_PROMPT: STAGE3_PROMPT_MD,
  STAGE4_PROMPT: STAGE4_PROMPT_MD,
  STAGE5_PROMPT: STAGE5_PROMPT_MD,
  STAGE6_PROMPT: STAGE6_PROMPT_MD,
} = buildPrompts(MARKDOWN_FMT);
