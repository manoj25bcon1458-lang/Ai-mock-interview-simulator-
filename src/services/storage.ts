import { SavedInterview } from '../types/interview';
import { fetchServerInterviews, saveInterviewToServer, deleteInterviewFromServer } from './api';

const LOCAL_STORAGE_KEY = 'ai_mock_interviews_universal_v2';

export function getLocalInterviews(): SavedInterview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local interviews:', err);
    return [];
  }
}

export function setLocalInterviews(interviews: SavedInterview[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(interviews));
  } catch (err) {
    console.error('Failed to write local interviews:', err);
  }
}

export async function loadAllInterviews(): Promise<SavedInterview[]> {
  const localList = getLocalInterviews();

  try {
    const serverList = await fetchServerInterviews();
    if (serverList && serverList.length > 0) {
      const map = new Map<string, SavedInterview>();
      localList.forEach((item) => map.set(item.id, item));
      serverList.forEach((item) => map.set(item.id, item));
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLocalInterviews(merged);
      return merged;
    }
  } catch (e) {
    // Fall back to localList
  }

  return localList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function persistInterview(interview: SavedInterview): Promise<SavedInterview[]> {
  const current = getLocalInterviews();
  const idx = current.findIndex((i) => i.id === interview.id);

  let updated: SavedInterview[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = interview;
  } else {
    updated = [interview, ...current];
  }

  setLocalInterviews(updated);
  saveInterviewToServer(interview);

  return updated;
}

export async function removeInterview(id: string): Promise<SavedInterview[]> {
  const current = getLocalInterviews();
  const updated = current.filter((i) => i.id !== id);
  setLocalInterviews(updated);
  deleteInterviewFromServer(id);
  return updated;
}

// 6 Realistic Universal Test Scenarios across distinct professions & purposes
export const SAMPLE_DEMO_INTERVIEWS: SavedInterview[] = [
  // 1. SDE Fresher Technical
  {
    id: 'demo_fresher_sde_1',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'completed',
    overallScore: 86,
    config: {
      purpose: 'Technical interview',
      targetRole: 'Software Developer',
      industryOrSubject: 'Information Technology',
      experience: 'Fresher',
      format: 'Technical or subject knowledge',
      difficulty: 'Medium',
      totalQuestions: 5,
      language: 'English',
      practiceMode: 'realistic',
      topics: ['Data Structures', 'OOPs Concepts', 'REST APIs', 'SQL Joins'],
      referenceInfo: 'Entry-level SDE role focusing on backend fundamentals, problem solving, and API design.',
      candidateName: 'Alex Sharma',
    },
    questions: [
      {
        id: 'q1',
        questionNumber: 1,
        question: 'Explain the difference between an Array and a Linked List in memory and access patterns.',
        category: 'Data Structures',
        difficulty: 'Medium',
        candidateAnswer:
          'An array stores elements in contiguous memory locations, allowing O(1) random index access. A linked list stores elements where each node holds data and a pointer to the next, needing sequential traversal which is O(n) access. However, inserting or deleting in a linked list at the head is O(1).',
        answeredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        evaluation: {
          scores: { technicalCorrectness: 5, problemSolving: 5, depthOfUnderstanding: 4, practicalApplication: 4, explanationQuality: 4 },
          rubricDetails: [
            { name: 'Technical Correctness', score: 5, maxScore: 5, description: 'Accurate memory allocation and pointer representation.' },
            { name: 'Problem Solving', score: 5, maxScore: 5, description: 'Clear mapping to big-O time complexity.' },
            { name: 'Depth of Understanding', score: 4, maxScore: 5, description: 'Understands sequential vs random access.' },
            { name: 'Practical Application', score: 4, maxScore: 5, description: 'Contrasted head insertion with index lookup.' },
            { name: 'Explanation Quality', score: 4, maxScore: 5, description: 'Structured and concise response.' },
          ],
          totalScore: 22,
          maxTotalScore: 25,
          percentage: 88,
          strengths: ['Accurate big-O time complexity comparison', 'Clear distinction of contiguous vs node-pointer memory'],
          weaknessesOrMissing: ['Could mention CPU cache locality advantages in modern hardware for arrays'],
          improvementSuggestions: ['Add CPU cache line prefetching as a key hardware reason arrays outperform lists in practice'],
          modelAnswer:
            'Arrays allocate a contiguous block of memory, giving O(1) random access via pointer arithmetic and excellent CPU cache locality. In contrast, linked lists disperse nodes across the heap with pointer overhead per node, leading to O(n) access and cache misses, though enabling O(1) insertion if pointer is known.',
          recommendedTopic: 'CPU Cache Locality and Cache-conscious data structures',
        },
      },
    ],
    finalReport: {
      overallScore: 86,
      performanceRating: 'Interview Ready',
      executiveSummary: 'Demonstrates solid foundational understanding of computer science principles, data structures, and memory layout. Communication is structured and technically grounded.',
      criteriaBreakdown: { 'Technical Correctness': 88, 'Problem Solving': 85, 'Depth of Understanding': 82, 'Practical Application': 84, 'Explanation Quality': 87 },
      strongestAnswers: [{ question: 'Difference between Array and Linked List in memory and access patterns', reason: 'Solid grasp of contiguous vs heap memory allocation and Big-O trade-offs.', score: 88 }],
      weakestAnswers: [{ question: 'Difference between Array and Linked List', reason: 'Could have highlighted hardware CPU cache lines.', score: 88 }],
      areasToImprove: [{ area: 'Hardware-Level Context', suggestion: 'Mention low-level hardware effects like CPU cache lines when discussing data structures.' }],
      commonMistakes: ['Skipping hardware-level cache locality nuances in data structure evaluations'],
      knowledgeGaps: ['Hardware cache prefetching vs pointer chasing'],
      communicationFeedback: 'Clear, concise, and structured delivery.',
      personalizedRecommendations: ['Practice explaining real-world trade-offs between memory overhead and query latency.'],
      suggestedPracticeQuestions: ['How does a hash map handle hash collisions under extreme load?'],
      sevenDayPrepPlan: [
        { day: 1, title: 'Data Structures Refresher', focus: 'Arrays, Lists, Hash Maps', activities: ['Review cache locality mechanics'] },
        { day: 2, title: 'Trees & Graphs', focus: 'BFS/DFS traversals', activities: ['Implement balanced BST search'] },
        { day: 3, title: 'Databases & ACID', focus: 'Index architecture', activities: ['Analyze B-tree lookups'] },
        { day: 4, title: 'REST APIs & Security', focus: 'HTTP idempotency', activities: ['Review token authentication'] },
        { day: 5, title: 'System Design Basics', focus: 'Load balancing & caching', activities: ['Diagram simple cache-aside tier'] },
        { day: 6, title: 'Mock Simulation', focus: 'Timed 5-question round', activities: ['Run simulator in realistic mode'] },
        { day: 7, title: 'Final Polish', focus: 'Interview presence', activities: ['Practice 2-minute elevator pitch'] },
      ],
      improvedWeakAnswer: {
        originalQuestion: 'Explain the difference between Array and Linked List.',
        candidateWeakAnswer: 'An array stores elements contiguously. A linked list uses pointers.',
        revisedExemplaryAnswer: 'Arrays allocate contiguous heap/stack memory allowing instant O(1) pointer arithmetic indexing and high CPU L1/L2 cache locality. Linked lists fragment nodes across memory with pointer overhead, causing O(N) traversal and frequent cache misses, though facilitating O(1) insertions once the pointer is reached.',
        explanation: 'Enriches the answer with hardware cache performance reasons and memory overhead trade-offs.',
      },
    },
  },

  // 2. HR & Cultural Alignment
  {
    id: 'demo_hr_behavioral_2',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'completed',
    overallScore: 82,
    config: {
      purpose: 'HR interview',
      targetRole: 'HR Associate / Talent Partner',
      industryOrSubject: 'Human Resources & Corporate Operations',
      experience: '0–2 years',
      format: 'Behavioral',
      difficulty: 'Medium',
      totalQuestions: 5,
      language: 'English',
      practiceMode: 'learning',
      topics: ['Conflict Resolution', 'Employee Onboarding', 'STAR Method', 'Workplace Culture'],
      candidateName: 'Priya Verma',
    },
    questions: [
      {
        id: 'q_hr1',
        questionNumber: 1,
        question: 'Tell me about a time you had a disagreement with a team member during a project. How did you resolve it?',
        category: 'STAR Behavioral',
        difficulty: 'Medium',
        candidateAnswer:
          'In our capstone team, my teammate wanted vanilla CSS while I advocated Tailwind CSS for speed. I listened to his concerns about learning curves, scheduled a 30-minute demo, shared cheatsheets, and volunteered to configure the pipeline. He adopted it, and we finished 3 days ahead of schedule.',
        answeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        evaluation: {
          scores: { relevance: 5, clarity: 5, specificExamples: 4, selfAwareness: 4, professionalJudgment: 4 },
          rubricDetails: [
            { name: 'Relevance', score: 5, maxScore: 5, description: 'Directly tackled team conflict resolution.' },
            { name: 'Clarity & Structure', score: 5, maxScore: 5, description: 'Followed clear STAR narrative flow.' },
            { name: 'Specific Examples', score: 4, maxScore: 5, description: 'Grounded in genuine project circumstances.' },
            { name: 'Self-Awareness', score: 4, maxScore: 5, description: 'Empathized with partner hesitation.' },
            { name: 'Professional Judgment', score: 4, maxScore: 5, description: 'Collaborative solution rather than confrontation.' },
          ],
          totalScore: 22,
          maxTotalScore: 25,
          percentage: 88,
          strengths: ['Active listening and proactive support', 'Constructive pair-programming resolution'],
          weaknessesOrMissing: ['Could emphasize post-project retrospective feedback'],
          improvementSuggestions: ['Add a brief reflection on how this shaped your ongoing teamwork philosophy'],
          modelAnswer:
            'Situation: In our team project, my colleague was hesitant to adopt a new UI framework fearing project delay. Task: Resolve technical divergence without causing friction. Action: I scheduled a hands-on walk-through, provided cheat sheets, and paired with him during day one. Result: We accelerated UI delivery by 40% and preserved team camaraderie.',
          recommendedTopic: 'STAR Method Mastery and Empathetic Stakeholder Alignment',
        },
      },
    ],
    finalReport: {
      overallScore: 82,
      performanceRating: 'Interview Ready',
      executiveSummary: 'Displays strong emotional intelligence, collaborative negotiation, and structured STAR storytelling.',
      criteriaBreakdown: { 'Relevance': 88, 'Clarity & Structure': 85, 'Specific Examples': 80, 'Self-Awareness': 82, 'Professional Judgment': 84 },
      strongestAnswers: [{ question: 'Disagreement with a team member during a project', reason: 'Empathic problem-solving and proactive enablement.', score: 88 }],
      weakestAnswers: [{ question: 'Disagreement with a team member', reason: 'Could have expanded on long-term team retrospectives.', score: 88 }],
      areasToImprove: [{ area: 'Quantitative Retrospectives', suggestion: 'Incorporate broader team feedback loops.' }],
      commonMistakes: ['Omitting organizational impact beyond the immediate task'],
      knowledgeGaps: ['Metric-driven culture analytics'],
      communicationFeedback: 'Warm, articulate, and poised demeanor.',
      personalizedRecommendations: ['Prepare 4 core STAR stories highlighting conflict, ownership, failure, and innovation.'],
      suggestedPracticeQuestions: ['How do you manage confidentiality when an employee shares a sensitive personal grievance?'],
      sevenDayPrepPlan: [
        { day: 1, title: 'STAR Framework Drilling', focus: 'Conflict & Leadership', activities: ['Draft 2 STAR stories'] },
        { day: 2, title: 'Culture Alignment', focus: 'Company core values', activities: ['Review corporate mission statements'] },
        { day: 3, title: 'Difficult Conversations', focus: 'Performance coaching', activities: ['Roleplay feedback conversation'] },
        { day: 4, title: 'Onboarding Strategy', focus: 'New hire retention', activities: ['Design 30-60-90 day template'] },
        { day: 5, title: 'Behavioral Mock', focus: 'HR screening practice', activities: ['Run Learning Mode simulation'] },
        { day: 6, title: 'Executive Presence', focus: 'Confidence & tone', activities: ['Record video elevator pitch'] },
        { day: 7, title: 'Final Review', focus: 'Question formulation', activities: ['Prepare 5 questions for interviewer'] },
      ],
      improvedWeakAnswer: {
        originalQuestion: 'How do you handle team conflict?',
        candidateWeakAnswer: 'I talk to the person and try to find a compromise.',
        revisedExemplaryAnswer: 'I address conflict with empathetic curiosity: first separating the operational challenge from personal egos, actively validating their perspective, and co-creating a data-backed prototype to evaluate both alternatives objectively.',
        explanation: 'Transforms generic platitudes into concrete conflict resolution methodology.',
      },
    },
  },

  // 3. Sales & Customer Success
  {
    id: 'demo_sales_ae_3',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'completed',
    overallScore: 85,
    config: {
      purpose: 'Job interview',
      targetRole: 'B2B SaaS Account Executive',
      industryOrSubject: 'Sales & Business Development',
      experience: '3–5 years',
      format: 'Situational',
      difficulty: 'Hard',
      totalQuestions: 5,
      language: 'English',
      practiceMode: 'rapid-fire',
      topics: ['Objection Handling', 'Discovery Calls', 'Value-Based Selling', 'Pipeline Forecasting'],
      candidateName: 'David Miller',
    },
    questions: [
      {
        id: 'q_sales1',
        questionNumber: 1,
        question: 'A prospective enterprise client says: "Your platform is great, but your competitor is 35% cheaper and has similar features." How do you respond?',
        category: 'Objection Handling',
        difficulty: 'Hard',
        candidateAnswer:
          'I first acknowledge their cost diligence: "I appreciate you watching your bottom line closely." Then I pivot from feature cost to Total Cost of Ownership (TCO) and business risk: "Many clients who evaluated both found that our automated compliance and 99.99% SLA saved them over $120,000 in averted downtime during year one alone. If we could prove a 3x ROI in 6 months, would that justify the difference?"',
        answeredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        evaluation: {
          scores: { listening: 5, customerUnderstanding: 5, persuasiveness: 5, objectionHandling: 4, professionalCommunication: 4 },
          rubricDetails: [
            { name: 'Active Listening & Empathy', score: 5, maxScore: 5, description: 'Validated the financial priority without defensiveness.' },
            { name: 'Customer Understanding', score: 5, maxScore: 5, description: 'Identified the deeper risk of downtime.' },
            { name: 'Persuasiveness & Value Framing', score: 5, maxScore: 5, description: 'Pivoted to TCO and quantified business ROI.' },
            { name: 'Objection Handling', score: 4, maxScore: 5, description: 'Asked a high-leverage closing question.' },
            { name: 'Professional Communication', score: 4, maxScore: 5, description: 'Assertive, polished, and confident.' },
          ],
          totalScore: 23,
          maxTotalScore: 25,
          percentage: 92,
          strengths: ['Instant pivot from unit cost to Total Cost of Ownership', 'High-impact trial close question'],
          weaknessesOrMissing: ['Could invite the prospect to inspect the specific competitor comparison matrix'],
          improvementSuggestions: ['Offer a joint pilot or reference customer call with a similar migration story'],
          modelAnswer:
            'Acknowledge empathy for cost concerns, reframe comparison around total business impact (uptime, compliance, support overhead), and propose a mutual value-proof evaluation.',
          recommendedTopic: 'Economic Value Selling and Executive Decision-Maker Re-framing',
        },
      },
    ],
    finalReport: {
      overallScore: 85,
      performanceRating: 'Exceptional',
      executiveSummary: 'Demonstrates stellar consultative sales acumen, objection handling, and financial value-framing under pressure.',
      criteriaBreakdown: { 'Active Listening': 92, 'Customer Understanding': 90, 'Persuasiveness': 92, 'Objection Handling': 86, 'Professional Communication': 88 },
      strongestAnswers: [{ question: 'Competitor is 35% cheaper objection', reason: 'Flawless TCO pivot and ROI closing question.', score: 92 }],
      weakestAnswers: [{ question: 'Competitor price objection', reason: 'Could offer customer reference call.', score: 92 }],
      areasToImprove: [{ area: 'Reference Verification', suggestion: 'Incorporate referenceable peer customer proof points.' }],
      commonMistakes: ['Focusing on competitor feature bashing rather than own value proposition'],
      knowledgeGaps: ['Complex multi-year enterprise procurement discounting models'],
      communicationFeedback: 'Persuasive, energetic, and commanding sales cadence.',
      personalizedRecommendations: ['Refine MEDDPICC qualification frameworks for tier-1 enterprise accounts.'],
      suggestedPracticeQuestions: ['How do you revive a deal that went dark after champion turnover?'],
      sevenDayPrepPlan: [
        { day: 1, title: 'MEDDPICC Framework Audit', focus: 'Enterprise qualification', activities: ['Analyze pipeline against economic buyer criteria'] },
        { day: 2, title: 'Objection Matrix', focus: 'Price, timing, competitors', activities: ['Practice 5 rapid objection reframes'] },
        { day: 3, title: 'Discovery Excellence', focus: 'Open-ended diagnosis', activities: ['Draft 10 pain-funnel discovery questions'] },
        { day: 4, title: 'Executive Demo Polish', focus: 'Outcome-oriented pitches', activities: ['Record 5-minute executive demo'] },
        { day: 5, title: 'Rapid-Fire Mock', focus: 'Pressure responses', activities: ['Complete 5 rapid-fire questions in simulator'] },
        { day: 6, title: 'Contract & Negotiation', focus: 'Closing concessions', activities: ['Review non-monetary trade-offs'] },
        { day: 7, title: 'Final Pipeline Review', focus: 'Target quota readiness', activities: ['Final simulated sales round'] },
      ],
      improvedWeakAnswer: {
        originalQuestion: 'How do you handle price objections?',
        candidateWeakAnswer: 'I tell them our product is better and offer a 10% discount.',
        revisedExemplaryAnswer: 'I never discount reflexively. I validate their fiscal responsibility, uncover what capabilities they are willing to trade off for that lower price, and demonstrate how our platform delivers a 3x higher net economic return over 12 months.',
        explanation: 'Avoids race-to-the-bottom discounting and anchors the conversation in business value.',
      },
    },
  },

  // 4. University / Master's Admission
  {
    id: 'demo_admission_mba_4',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'completed',
    overallScore: 88,
    config: {
      purpose: 'College or university admission',
      targetRole: 'Master of Business Administration (MBA) Candidate',
      industryOrSubject: 'Higher Education & Management',
      experience: '3–5 years',
      format: 'Communication assessment',
      difficulty: 'Hard',
      totalQuestions: 5,
      language: 'English',
      practiceMode: 'realistic',
      topics: ['Academic Motivation', 'Leadership Potential', 'Cohort Contribution', 'Ethical Dilemmas'],
      candidateName: 'Elena Rostova',
    },
    questions: [
      {
        id: 'q_adm1',
        questionNumber: 1,
        question: 'Why this university, and how will your unique professional background enrich the peer learning experience of our incoming cohort?',
        category: 'Admissions & Cohort Fit',
        difficulty: 'Hard',
        candidateAnswer:
          'Having spent 4 years building renewable energy microgrids in emerging rural markets, I bring first-hand cross-border operational insights into decentralized infrastructure financing. Your university’s Clean Energy Innovation Hub and case-study pedagogy provide the exact ecosystem for me to test sustainable venture models, while I contribute real-world field data to classroom debates.',
        answeredAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        evaluation: {
          scores: { motivation: 5, subjectUnderstanding: 5, authenticity: 5, reflection: 4, communication: 4 },
          rubricDetails: [
            { name: 'Motivation & Goal Alignment', score: 5, maxScore: 5, description: 'Explicit connection to specific institutional centers.' },
            { name: 'Subject Understanding', score: 5, maxScore: 5, description: 'Grounded understanding of energy infrastructure economics.' },
            { name: 'Authenticity & Character', score: 5, maxScore: 5, description: 'Compelling personal narrative with real fieldwork.' },
            { name: 'Reflection & Self-Growth', score: 4, maxScore: 5, description: 'Clear vision for cohort collaboration.' },
            { name: 'Scholarly Communication', score: 4, maxScore: 5, description: 'Articulate, passionate, and credible.' },
          ],
          totalScore: 23,
          maxTotalScore: 25,
          percentage: 92,
          strengths: ['Distinctive real-world emerging market experience', 'Targeted institutional knowledge of specific university labs'],
          weaknessesOrMissing: ['Could cite specific faculty research projects of interest'],
          improvementSuggestions: ['Mention 1-2 specific professors or recent working papers from the department'],
          modelAnswer:
            'A winning admission answer fuses a distinctive personal backstory with precise institutional knowledge (specific labs, pedagogy, faculty) and clearly articulates mutual value for the student body.',
          recommendedTopic: 'Institutional Alignment and Scholarly Cohort Contribution',
        },
      },
    ],
    finalReport: {
      overallScore: 88,
      performanceRating: 'Exceptional',
      executiveSummary: 'Outstanding academic candidate exhibiting clear scholarly purpose, authentic field expertise, and deep alignment with institutional values.',
      criteriaBreakdown: { 'Motivation & Goals': 94, 'Subject Understanding': 90, 'Authenticity': 92, 'Reflection': 86, 'Scholarly Communication': 88 },
      strongestAnswers: [{ question: 'Why this university & cohort contribution', reason: 'Authentic decentralized energy microgrid narrative and targeted lab interest.', score: 92 }],
      weakestAnswers: [{ question: 'Why this university', reason: 'Could name specific faculty research papers.', score: 92 }],
      areasToImprove: [{ area: 'Faculty Alignment', suggestion: 'Cite specific ongoing scholarly publications from university faculty.' }],
      commonMistakes: ['Relying on generic brochure compliments rather than specific academic programs'],
      knowledgeGaps: ['Long-term post-MBA governance structures'],
      communicationFeedback: 'Reflective, intellectually curious, and engaging vocal tone.',
      personalizedRecommendations: ['Review recent whitepapers published by the university energy initiative.'],
      suggestedPracticeQuestions: ['Describe a time you had to change your mind based on new academic evidence.'],
      sevenDayPrepPlan: [
        { day: 1, title: 'Faculty & Lab Audit', focus: 'Specific university research', activities: ['Read 3 faculty papers'] },
        { day: 2, title: 'Personal Statement Synthesis', focus: 'Cohesive personal narrative', activities: ['Practice 3-minute life story'] },
        { day: 3, title: 'Cohort Value Proposition', focus: 'Peer learning impact', activities: ['Outline 3 workshops you could lead'] },
        { day: 4, title: 'Case Analysis Practice', focus: 'Analytical rigor', activities: ['Deconstruct classic business case'] },
        { day: 5, title: 'Admissions Mock', focus: 'Realistic simulation', activities: ['Run 5-question admission interview'] },
        { day: 6, title: 'Ethical Leadership', focus: 'Values in decision-making', activities: ['Prepare 2 ethical dilemma responses'] },
        { day: 7, title: 'Interview Day Routine', focus: 'Poise and focus', activities: ['Final check of candidate questions'] },
      ],
      improvedWeakAnswer: {
        originalQuestion: 'Why do you want to join our program?',
        candidateWeakAnswer: 'Your university has great prestige and high placement records.',
        revisedExemplaryAnswer: 'I am drawn to your university not just for its reputation, but specifically for Professor Vance’s work at the Clean Energy Institute on decentralized grids, which directly complements my 4 years of rural electrification field experience in developing economies.',
        explanation: 'Replaces superficial rankings praise with specific academic and research synergies.',
      },
    },
  },

  // 5. Government & Public Sector
  {
    id: 'demo_govt_civil_5',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'completed',
    overallScore: 84,
    config: {
      purpose: 'Government job interview',
      targetRole: 'Civil Services / Public Administration Officer',
      industryOrSubject: 'Public Policy, Governance & Ethics',
      experience: 'Fresher',
      format: 'Panel interview simulation',
      difficulty: 'Expert',
      totalQuestions: 5,
      language: 'English',
      practiceMode: 'realistic',
      topics: ['Constitutional Ethics', 'Public Distribution System', 'Crisis Management', 'Digital Inclusion'],
      candidateName: 'Rahul Deshmukh',
    },
    questions: [
      {
        id: 'q_govt1',
        questionNumber: 1,
        question: 'As a district magistrate during an unforeseen flood crisis, a local representative pressures you to divert relief supplies to their constituency ahead of harder-hit villages. How do you respond?',
        category: 'Constitutional Ethics & Crisis Governance',
        difficulty: 'Expert',
        interviewerPersona: 'Dr. Evelyn Reed (Dean / Academic Lead)',
        candidateAnswer:
          'I would courteously but firmly uphold constitutional neutrality and administrative guidelines. Disaster relief must follow objective severity matrices: I would present real-time GIS flood impact data, explain the triage protocol, and assure the representative that every citizen will receive assistance strictly based on verified vulnerability, maintaining complete transparency in public logs.',
        answeredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        evaluation: {
          scores: { relevanceToRole: 5, subjectAwareness: 4, reasoning: 5, communication: 4, ethicalJudgment: 5 },
          rubricDetails: [
            { name: 'Relevance & Public Interest', score: 5, maxScore: 5, description: 'Prioritized public welfare and vulnerable populations.' },
            { name: 'Subject & Policy Awareness', score: 4, maxScore: 5, description: 'Referenced disaster management triage protocols.' },
            { name: 'Balanced Reasoning', score: 5, maxScore: 5, description: 'Objective GIS data approach defused political friction.' },
            { name: 'Dignified Communication', score: 4, maxScore: 5, description: 'Polite, resolute, and administratively sound.' },
            { name: 'Ethical Judgment & Integrity', score: 5, maxScore: 5, description: 'Exemplary refusal to yield to undue partisan pressure.' },
          ],
          totalScore: 23,
          maxTotalScore: 25,
          percentage: 92,
          strengths: ['Uncompromising moral integrity anchored in public service ethics', 'Constructive use of objective GIS data to de-escalate political pressure'],
          weaknessesOrMissing: ['Could cite relevant clauses of Disaster Management Act'],
          improvementSuggestions: ['Reference statutory frameworks like the Disaster Management Act 2005 for legal backing'],
          modelAnswer:
            'A distinguished civil servant demonstrates unwavering adherence to constitutional impartiality, uses objective data to defuse political pressure courteously, and grounds decisions in statutory disaster management protocols.',
          recommendedTopic: 'Statutory Disaster Governance and Ethical Public Administration',
        },
      },
    ],
    finalReport: {
      overallScore: 84,
      performanceRating: 'Interview Ready',
      executiveSummary: 'Exemplifies the composure, moral integrity, and analytical balance demanded of civil servants and public sector leadership.',
      criteriaBreakdown: { 'Public Interest': 92, 'Policy Awareness': 82, 'Balanced Reasoning': 88, 'Dignified Communication': 84, 'Ethical Judgment': 94 },
      strongestAnswers: [{ question: 'Relief supply political pressure scenario', reason: 'High ethical clarity, constitutional neutrality, and objective triage.', score: 92 }],
      weakestAnswers: [{ question: 'Relief supply political pressure', reason: 'Could cite statutory disaster management acts.', score: 92 }],
      areasToImprove: [{ area: 'Statutory Citations', suggestion: 'Cite specific statutory acts and constitutional articles during administrative analysis.' }],
      commonMistakes: ['Relying purely on personal ethics without citing legal and statutory mandates'],
      knowledgeGaps: ['Statutory crisis protocols under emergency administrative law'],
      communicationFeedback: 'Balanced, dignified, and composed cadence suited for panel boards.',
      personalizedRecommendations: ['Review landmark administrative law rulings and welfare jurisprudence.'],
      suggestedPracticeQuestions: ['How should civil servants address algorithmic bias in automated welfare disbursement?'],
      sevenDayPrepPlan: [
        { day: 1, title: 'Constitutional Law Review', focus: 'Fundamental Rights & DPSP', activities: ['Review Articles 14, 19, 21'] },
        { day: 2, title: 'Welfare Schemes & PDS', focus: 'Delivery mechanisms & leaks', activities: ['Analyze direct benefit transfer metrics'] },
        { day: 3, title: 'Disaster Governance', focus: 'Crisis management protocols', activities: ['Review Disaster Management Act 2005'] },
        { day: 4, title: 'Panel Defense Mock', focus: 'Multi-member panel questioning', activities: ['Simulate Panel Interview mode'] },
        { day: 5, title: 'Current Affairs & Ethics', focus: 'Socioeconomic policy dilemmas', activities: ['Formulate balanced views on 3 editorial debates'] },
        { day: 6, title: 'Stress & Composure', focus: 'Handling adversarial probes', activities: ['Run Stress Mode in simulator'] },
        { day: 7, title: 'Final Dress Rehearsal', focus: 'Executive presence', activities: ['Timed 30-minute full mock round'] },
      ],
      improvedWeakAnswer: {
        originalQuestion: 'How do you handle political interference?',
        candidateWeakAnswer: 'I would just say no and report them to the media.',
        revisedExemplaryAnswer: 'I maintain respectful, professional communication while anchoring my decisions strictly within the statutory framework of the Disaster Management Act. By relying on transparent GIS audit logs and established SOPs, I protect public welfare while safeguarding the institutional dignity of the civil service.',
        explanation: 'Replaces impulsive confrontation with mature statutory and procedural statecraft.',
      },
    },
  },

  // 6. Custom Specialized Role (Clinical Nurse Supervisor)
  {
    id: 'demo_custom_nurse_6',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: 'completed',
    overallScore: 87,
    config: {
      purpose: 'Promotion interview',
      targetRole: 'Clinical Nurse Supervisor / ICU Nurse Manager',
      industryOrSubject: 'Healthcare & Patient Care Operations',
      experience: '6–10 years',
      format: 'Situational',
      difficulty: 'Expert',
      totalQuestions: 5,
      language: 'English',
      practiceMode: 'realistic',
      topics: ['Patient Triage', 'ICU Staffing Ratios', 'Clinical Protocol Adherence', 'Medical Error Disclosure'],
      candidateName: 'Sarah Jenkins, RN',
    },
    questions: [
      {
        id: 'q_custom1',
        questionNumber: 1,
        question: 'During a sudden ICU surge with short staffing, two critical patients deteriorate simultaneously while a junior nurse makes a medication dosage miscalculation. How do you triage this crisis in the first 10 minutes?',
        category: 'Clinical Crisis Leadership & Patient Safety',
        difficulty: 'Expert',
        candidateAnswer:
          'First 2 minutes: Immediate patient stabilization. I personally step in to assess the acute respiratory/cardiac deterioration while directing our senior charge nurse to monitor the second patient. For the medication miscalculation, I verify if the dose was administered—if so, I immediately initiate the counter-agent/reversal protocol, notify the on-call attending physician, and stabilize the patient. Once vital signs are secure, I support the junior nurse without punitive shaming, log the near-miss incident in our safety reporting system, and initiate a non-blame root-cause analysis.',
        answeredAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        evaluation: {
          scores: { relevance: 5, domainKnowledge: 5, practicalApplication: 5, problemSolving: 5, communication: 4 },
          rubricDetails: [
            { name: 'Relevance to Practice', score: 5, maxScore: 5, description: 'Directly prioritized clinical triage and life support.' },
            { name: 'Domain Knowledge', score: 5, maxScore: 5, description: 'Clinical reversal protocol and attending escalation.' },
            { name: 'Practical Application', score: 5, maxScore: 5, description: 'Realistic chronological breakdown (first 2 vs 10 minutes).' },
            { name: 'Critical Problem Solving', score: 5, maxScore: 5, description: 'Parallel triage addressing both clinical and human factors.' },
            { name: 'Professional Communication', score: 4, maxScore: 5, description: 'Decisive, empathetic, and safety-focused.' },
          ],
          totalScore: 24,
          maxTotalScore: 25,
          percentage: 96,
          strengths: ['Immediate prioritization of patient life-safety', 'Non-punitive psychological safety culture combined with strict incident logging'],
          weaknessesOrMissing: ['Could mention family communication protocol'],
          improvementSuggestions: ['Detail when and how the family is informed following attending consultation'],
          modelAnswer:
            'A clinical nurse manager prioritizes immediate life-support triage, executes reversal protocols for medication errors, escalates to attendings, and cultivates a just culture of safety reporting.',
          recommendedTopic: 'Just Culture Safety Frameworks and ICU Crisis Resource Management',
        },
      },
    ],
    finalReport: {
      overallScore: 87,
      performanceRating: 'Exceptional',
      executiveSummary: 'Exemplifies clinical mastery, calm crisis triage, empathetic leadership, and dedication to institutional patient safety culture.',
      criteriaBreakdown: { 'Clinical Triage': 96, 'Safety Culture': 92, 'Decisive Leadership': 90, 'Risk Mitigation': 88, 'Professional Communication': 86 },
      strongestAnswers: [{ question: 'ICU surge & medication error crisis triage', reason: 'Flawless parallel triage, psychological safety, and clinical escalation.', score: 96 }],
      weakestAnswers: [{ question: 'ICU surge crisis triage', reason: 'Could touch upon patient family transparency.', score: 96 }],
      areasToImprove: [{ area: 'Family Transparency', suggestion: 'Outline standard operating procedures for open family disclosure post-crisis.' }],
      commonMistakes: ['Focusing on blame rather than immediate clinical stabilization'],
      knowledgeGaps: ['Hospital accreditation sentinel event review timelines'],
      communicationFeedback: 'Composed, authoritative, and deeply compassionate delivery.',
      personalizedRecommendations: ['Review Joint Commission standards on sentinel event disclosures.'],
      suggestedPracticeQuestions: ['How do you manage chronic burnout and moral injury among frontline ICU nursing staff?'],
      sevenDayPrepPlan: [
        { day: 1, title: 'ICU Ratio & Staffing Models', focus: 'Safe staffing metrics', activities: ['Review acuity-based scheduling'] },
        { day: 2, title: 'Just Culture Protocols', focus: 'Non-punitive safety reporting', activities: ['Study incident reporting flows'] },
        { day: 3, title: 'Clinical Quality & Audit', focus: 'Infection control & CLABSI', activities: ['Audit hospital quality metrics'] },
        { day: 4, title: 'Crisis Resource Management', focus: 'Situational leadership', activities: ['Run simulator in Situational mode'] },
        { day: 5, title: 'Budget & Resource Allocation', focus: 'Nurse manager financials', activities: ['Analyze departmental operational budget'] },
        { day: 6, title: 'Peer Review Mock', focus: 'Board interview preparation', activities: ['Practice executive leadership mock'] },
        { day: 7, title: 'Final Preparation', focus: 'Personal philosophy of care', activities: ['Refine nursing leadership vision'] },
      ],
      improvedWeakAnswer: {
        originalQuestion: 'How do you handle medical errors on your floor?',
        candidateWeakAnswer: 'I would reprimand the nurse and file a report with HR.',
        revisedExemplaryAnswer: 'Patient safety is always our immediate priority: we verify the patient condition, administer appropriate countermeasures, and consult the attending. Afterwards, we embrace a Just Culture approach: recognizing systemic fatigue factors, supporting the nurse, and conducting a root-cause analysis to ensure systemic prevention.',
        explanation: 'Transitions from punitive reaction to modern systemic patient safety and clinical excellence.',
      },
    },
  },
];
