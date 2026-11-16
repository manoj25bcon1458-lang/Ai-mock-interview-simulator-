# UNIVERSAL AI MOCK INTERVIEW SIMULATOR

An enterprise-grade, modern Universal AI Mock Interview Simulator built for all professions, industries, academic levels, and career milestones. Powered by **Google Gemini 3.8 Flash** via the `@google/genai` TypeScript SDK, this application provides realistic, intelligent interview conversations, role-calibrated adaptive questioning, multi-persona panel simulations, specialized rubrics, and comprehensive preparation roadmaps.

---

## 🌍 1. Universal Interview Coverage

The simulator supports interviews across all professions and career goals without restriction:
- **Technology & IT**: Software Developers, DevOps/Cloud, Cybersecurity, Data Science, AI/ML Engineers, Solutions Architects.
- **HR & Operations**: HR Business Partners, Talent Acquisition Specialists, Office Administrators, Operations Managers.
- **Business & Finance**: Financial Analysts, Investment Bankers, Management Consultants, Strategists, Accountants.
- **Product & Project Management**: Product Managers, Scrum Masters, Agile Coaches, Business Analysts.
- **Engineering Branches**: Mechanical Engineers, Civil Engineers, Electrical/Electronics Engineers, Robotics Engineers.
- **Sales & Customer Success**: B2B Enterprise Account Executives, SDRs, Customer Success Leads, Hospitality & Retail Supervisors.
- **Government & Public Sector**: Civil Services Officers (IAS/IPS/UPSC), Public Policy Analysts, Defense Services, Municipal Administrators.
- **Higher Education & Admissions**: College Admissions, Master’s / MBA Entrance, Scholarship Selection Boards, Research Fellowships.
- **Healthcare & Specialized Occupations**: Clinical Nurse Supervisors, Resident Physicians, Healthcare Administrators, Pharmacists.
- **Custom Occupations**: Enter any custom job title, specialized post, academic syllabus, or promotion milestone via free text.

---

## ⚙️ 2. Universal Setup Options

1. **Interview Purpose**:
   - Job Interview, HR Interview, Technical Interview, Behavioral (STAR), Managerial & Leadership, Government/Civil Services, University Admission, Scholarship Selection, Internship Selection, Internal Promotion, Career Transition, Custom Purpose.
2. **Target Role, Profession, Course, or Position**: Free-text input with quick 1-click suggestions.
3. **Industry, Domain, or Subject**: Free-text input (e.g. Healthcare, B2B SaaS, Automotive, Public Administration, Higher Education).
4. **Candidate Experience or Education Level**:
   - Student, Fresher (0–1 yr), Early Career (0–2 yrs), Mid-Level (3–5 yrs), Senior / Lead (6–10 yrs), Executive / Principal (10+ yrs), or Custom.
5. **Interview Format**:
   - Mixed Comprehensive, Technical / Subject Knowledge, HR Screening, STAR Behavioral, Situational Judgment, Progressive Case Study, Panel Interview Simulation (Multi-Persona), Stress Interview Simulation (Challenging & Respectful), Communication Assessment, Custom Format.
6. **Difficulty**: Beginner, Easy, Medium, Hard, Expert.
7. **Interview Length**: 5, 10, 15, 20 questions, or custom count (1–30 questions).
8. **Language Support**: English, Hindi, Hinglish, Spanish, French, German, or Custom language.
9. **Practice Modes**:
   - **Realistic Interview Mode**: Simulates a live board interview—feedback is hidden during the round and revealed in full at the end.
   - **Learning Mode**: Immediate coaching after each question with rubric breakdown, strengths, gaps, and model responses.
   - **Rapid-Fire Mode**: Suggested 60-second response countdown target for sharp, concise articulation.
   - **Beginner Practice Mode**: Gentle on-ramp with foundational explanations and progressive difficulty climb.
   - **Advanced Challenge Mode**: Deep follow-up questions and multi-part case problems.
   - **Custom Practice Mode**: Fully configurable parameters and feedback styles.
10. **Optional Reference Material**: Job description, admission criteria, exam notification, or syllabus.
11. **Optional Competencies**: Customizable chips and skill tags.

---

## 🎙️ 3. Intelligent Interviewer & Voice Capabilities

- **Intelligent Persona**: Adapts greeting, tone, and questioning depth to the target role and domain.
- **Multi-Persona Panel Simulation**: Simulates distinct board members (e.g., *Dr. Evelyn Reed (Dean)*, *Marcus Vance (Tech Lead)*, *Priya Sharma (HR Director)*) who rotate questions.
- **Pause & Resume**: Candidates can pause the round at any moment to catch their breath and resume seamlessly.
- **Repeat & Clarify**: Dedicated button to repeat questions with natural speech.
- **Voice Input (Speech-to-Text)**: Real browser Web Speech API dictation with browser capability detection (no fake recording).
- **Text-to-Speech (TTS)**: Web Speech Synthesis reads questions aloud in the chosen language.
- **Full Live Transcript**: Review all previous questions, panelist notes, and submitted answers anytime during the session.

---

## 📊 4. Role-Specific Evaluation Rubrics (0 to 5 Scale)

Evaluation rubrics adapt dynamically to the target category:
- **Technical**: Technical Correctness, Problem Solving, Depth of Understanding, Practical Application, Explanation Quality.
- **HR & Behavioral**: Relevance, Clarity & Structure, Specific Examples (STAR), Self-Awareness, Professional Judgment.
- **Management & Business**: Decision-Making, Strategic Thinking, Prioritization, Analytical Reasoning, Executive Communication.
- **Sales & Customer Success**: Active Listening & Empathy, Customer Understanding, Persuasiveness & Value Framing, Objection Handling, Professional Communication.
- **College & University Admissions**: Motivation & Goal Alignment, Subject Understanding, Authenticity & Character, Reflection & Self-Growth, Scholarly Communication.
- **Government & Public Sector**: Relevance to Role & Public Interest, Subject & Policy Awareness, Balanced Reasoning, Dignified Communication, Ethical Judgment & Integrity.
- **Specialized / Custom**: 5 dynamically generated criteria tailored to the role.

---

## 📑 5. Comprehensive Final Performance Report

- **Overall Score (out of 100)** with performance rating (*Needs Improvement*, *Developing*, *Proficient*, *Interview Ready*, *Exceptional*).
- **Executive Summary** and 5-dimension competency bar chart.
- **Top Strongest Answers** and **Answers Needing Reinforcement**.
- **Common Mistakes** and **Identified Knowledge/Skill Gaps**.
- **Communication & Delivery Feedback** (tone, pace, clarity, confidence).
- **Personalized Recommendations** and **Suggested Future Practice Questions**.
- **7-Day Structured Preparation Plan**: Daily study roadmap tailored to the candidate's exact weaknesses.
- **Weak Answer Refactoring**: Direct side-by-side comparison between the candidate's weakest answer and an upgraded exemplary response with technical/behavioral reasoning.
- **Print / PDF Export**: One-click print-ready styling.

---

## 🧪 6. Supporting Prompt Engineering Lab

An academic testbed demonstrating the underlying AI mechanics:
- Role & Persona Prompting
- Few-Shot Demonstrations
- Explicit Rubric Constraints
- Structured JSON Output Enforcement
- Side-by-side comparison of Naive prompts vs. Engineered prompts with scientific 4-dimension scorecards.

---

## 💾 7. Persistence & Security

- **Dual-Layer Persistence**: Browser `localStorage` + Server-side persistent storage (`.data/interviews.json`). Records survive page reloads and server restarts.
- **Prompt Injection Defense**: Untrusted candidate input is wrapped inside `<<<CANDIDATE_ANSWER>>>` delimiters with system boundaries.
- **API Key Security**: Private keys remain strictly on the backend server proxy (`server.ts`).

---

## 🚀 Running the Project

```bash
# Start development server (Port 3000 with Express + Vite)
npm run dev

# Build for production
npm run build
npm start
```
