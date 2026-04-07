## Mocknetic Teacher Portal

This repository contains the Teacher Portal for Mocknetic, an AI-powered technical interview preparation and classroom assessment platform. This interface enables educators to create assessments, audit student performance, and perform manual grading on AI-evaluated submissions.

**Live URL:** [teachers.mocknetic.com](https://www.google.com/search?q=https://teachers.mocknetic.com)

-----

## Overview

The Teacher Portal is designed to provide an efficient evaluation workflow. While the core AI engine handles automated grading, this interface provides educators with human-in-the-loop oversight to ensure evaluation accuracy and deliver personalized mentorship.

### Core Functionality

  * **Classroom Management:** Organization of student cohorts and aggregate performance monitoring.
  * **Assessment Authoring:** Creation of technical assessments with configurable question parameters.
  * **Performance Analytics:** Real-time tracking of submission volume, average scores, and competency metrics.
  * **Manual Grading & Auditing:** Side-by-side review of student responses, including AI-generated evaluations, with options to override scores and provide custom feedback.
  * **Data Export:** Capability to export assessment data to CSV format for external auditing and record-keeping.

-----

## Ecosystem Integration

Mocknetic is structured as a dual-portal ecosystem:

1.  **Student Portal ([mocknetic.com](https://mocknetic.com)):** The platform for students to practice coding, complete assessments, and view progress analytics.
2.  **Teacher Portal ([teachers.mocknetic.com](https://www.google.com/search?q=https://teachers.mocknetic.com)):** The administrative interface for assessment authoring and result auditing.

### Technical Connection

Both portals interface with a centralized MongoDB database and a shared Node.js/Express API. When an assessment is published in the Teacher Portal, it is immediately accessible via the Student Portal. Upon submission, the platform processes the response through the AI module, after which the results are populated in the Teacher Portal for review.

-----

## Technical Stack

  * **Framework:** Next.js (App Router)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS + shadcn/ui
  * **Iconography:** Lucide React
  * **API Integration:** Axios
  * **Notification Handling:** Sonner

-----

## Project Structure

```text
src/
├── components/       # Reusable UI components
├── lib/              # API configuration and utility functions
├── pages/            # Core view logic
│   ├── AssessmentResults.tsx    # Dashboard for specific assessment data
│   └── StudentResultDetail.tsx  # Individual grading and feedback interface
└── ui/               # Radix-based UI components
```

-----

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mocknetic-teacher.git
    cd mocknetic-teacher
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file and specify the API base URL:

    ```env
    VITE_API_URL=https://api.mocknetic.com
    ```

4.  **Run Development Server:**

    ```bash
    npm run dev
    ```

5.  **Production Build:**

    ```bash
    npm run build
    ```

-----

## Data Export

The portal supports data extraction for external reporting. Navigating to an **Assessment Results** page and selecting the **Export CSV** function will generate a file containing student identification, raw scores, total points, percentage metrics, and submission timestamps.

-----
