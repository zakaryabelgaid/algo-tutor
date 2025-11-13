# Application Overview: Algo Tutor

The application is a multi-functional educational platform named **Algo Tutor**, designed to help students learn algorithms. It features distinct roles for Admins, Teachers, and public users, providing a rich, interactive experience with features like lesson management, news articles, file sharing, and a Q&A system. A credit line, "how did you made this," has been added to the footer of all public-facing pages and within the "About" section on the landing page to acknowledge its creation.

---

### 1. Core Functionalities

*   **Role-Based Access Control (RBAC):**
    *   **Admin:** Has full control over the entire platform, including managing teacher accounts, all content (lessons, news, files), and student questions.
    *   **Teacher:** Manages their own content (news posts, file uploads), answers student questions assigned to them, and manages their own profile settings. Their account requires admin approval before they can log in.
    *   **Public User/Student:** Can browse all public content (lessons, news, files, teacher profiles), ask questions to specific teachers, and view pinned Q&A.

*   **Authentication & User Management:**
    *   **Teacher/Admin Login:** A dedicated login page at `/login` authenticates users based on their email and password.
    *   **Teacher Registration:** A registration page at `/register` allows new users to sign up as teachers. Their account is created with `isApproved: false` and must be approved by an Admin.
    *   **User Deletion:** Admins can delete teacher accounts from the Firestore database, which revokes their access and removes them from the application's UI.

*   **Content Management (CRUD Operations):**
    *   **Lessons:** Admins can edit lesson metadata (like `grade` and `slug`) and delete lessons from the database. The core content is internationalized and stored in locale files.
    *   **News:** Admins and Teachers can create, update, and delete news articles.
    *   **File Uploads:** Admins and Teachers can upload files, which are stored in **Firebase Cloud Storage**. The file metadata (name, category, download URL) is stored in Firestore for efficient querying and display.
    *   **Q&A:** Students can ask questions to specific teachers. Teachers and Admins can answer these questions and "pin" important ones to make them publicly visible on the `/qna` page.

*   **Internationalization (i18n):**
    *   The entire UI is bilingual, supporting **English** and **French**.
    *   A custom `LanguageContext` manages the active language, storing the user's preference in `localStorage`.
    *   All display text is sourced from JSON locale files (`src/locales/en.json`, `src/locales/fr.json`).

*   **Theming:**
    *   Supports **Dark** and **Light** modes.
    *   A `ThemeContext` manages the theme, storing the user's preference and synchronizing it with the browser's system preference.

### 2. Application Structure

The project follows the standard Next.js App Router structure.

*   `src/app/`: Contains all routes and pages.
    *   `(public pages)`: Root-level directories like `/lessons`, `/news`, `/files`, etc., which share a common layout with the credit in the footer.
    *   `admin/`: Contains all pages for the Admin dashboard, protected by a dedicated layout.
    *   `teacher/`: Contains all pages for the Teacher dashboard, protected by its own layout.
*   `src/components/`: Contains all reusable React components.
    *   `ui/`: Contains all the low-level UI components from **ShadCN/UI** (Button, Card, Input, etc.).
    *   **Custom Components:** Higher-level components like `header.tsx`, `qna-form.tsx`, `lesson-manager.tsx`, and `particles-background.tsx`.
*   `src/context/`: Holds all global React Context providers for state management.
    *   `user-context.tsx`: Manages user data, authentication, and all CRUD operations for teachers, lessons, questions, and uploads, interacting directly with Firestore.
    *   `news-context.tsx`: Manages state for news articles.
    *   `language-context.tsx`: Manages multi-language support.
    *   `theme-context.tsx`: Manages dark/light mode.
*   `src/firebase/`: Contains all Firebase configuration and custom hooks for interacting with Firebase services.
*   `src/lib/`: Contains shared utilities, initial data for fallback, and TypeScript type definitions.
*   `src/locales/`: Contains the JSON files for English (`en.json`) and French (`fr.json`) translations.
*   `firestore.rules` & `storage.rules`: Security rules that protect your Firestore database and Cloud Storage bucket, with role-based access controls.

### 3. Design and Components

*   **UI Framework:** **ShadCN/UI** is used for the entire component library.
*   **Styling:**
    *   **Tailwind CSS:** Used for all styling, creating a modern, clean, and responsive design.
    *   **CSS Variables:** The color scheme is defined in `src/app/globals.css` using HSL CSS variables, enabling easy theming and dark/light modes.
*   **Key UI Components:**
    *   **Layouts:** The application uses several nested layouts to provide consistent headers, footers, and sidebars. The public layouts now include a footer with the credit line "how did you made this".
    *   **Sidebar:** A responsive, collapsible sidebar is used for navigation in the Admin and Teacher dashboards.
    *   **Cards:** Used extensively to section off content.
    *   **Forms:** Used for login, registration, creating news, and asking questions.
    *   **Data Display:** `Table`, `Accordion`, and `Tabs` components are used to display and organize data in the dashboards.
    *   **Dialogs & Alerts:** Used for confirmation prompts (e.g., delete confirmation) and modal forms.
    *   **Toasts:** Used for non-intrusive user feedback.
*   **Icons:** **Lucide React** is used for a consistent and modern icon set.
*   **Animation & Effects:** Subtle animations are used for UI elements. The hero section on the landing page features a dynamic, interactive particle background effect.
