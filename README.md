# Campus Life Hub

CampusHub — Lovable Build Prompt

Copy everything below the line into Lovable as your first prompt. It's written as one complete brief so Lovable can scaffold the whole app in one pass, then you iterate page by page.

PROMPT FOR LOVABLE

Build CampusHub, a modern multi-page web app for managing college/campus student life — think "LinkedIn meets Notion meets an event platform," built for a student to track events, clubs, announcements, and their own participation in one place.

Tech & Structure

React + Tailwind (Lovable defaults), fully responsive (mobile-first, works great on phone and desktop)

Client-side routing across all pages listed below

Use Supabase for auth (email/password + Google login) and database once we get to backend phase — but scaffold the UI first with realistic mock/sample data so it looks fully alive immediately

Component-driven: reusable Card, Badge, Modal, Sidebar, Navbar, EmptyState, Toast/notification components

Design Direction

Vibe: modern university dashboard, clean SaaS aesthetic — not a generic Bootstrap template

Theme: dark navy (#0B1120 / slate-950 tones) as the base, white/soft-gray content cards, indigo-to-violet gradient accents (blue → purple) for CTAs, highlights, and active states

Light/Dark mode toggle available everywhere (default dark)

Rounded-xl cards with soft shadows, subtle hover-lift and fade-in animations, generous whitespace

Clean sans-serif typography (Inter or similar), strong visual hierarchy, consistent spacing scale

Iconography throughout (lucide icons) — avoid text-only lists where an icon adds clarity

Empty states, loading skeletons, and toast notifications everywhere data loads or an action completes — the app should never feel static or unfinished

Global Navigation

Persistent sidebar (desktop) / bottom nav or hamburger drawer (mobile) with: Home, Events, Clubs, Announcements, Leaderboard, Dashboard, Contact. Include a global search bar in the top navbar that searches events, clubs, and announcements together. Show a notification bell with a dropdown for reminders (event starting soon, deadline approaching, new announcement).

1. 🏠 Home

Hero section: bold headline, short tagline, primary CTA ("Explore Events") and secondary CTA ("Join a Club"), with a subtle animated gradient or illustration background

"Upcoming Events" horizontal scroll/carousel of event cards (date, venue, category tag, registration status)

"Featured Clubs" grid with logo, short blurb, member count, "View Club" link

"Quick Links" tile grid (Timetable, Assignments, Notes, Leaderboard, My Dashboard)

"Campus Announcements" ticker/feed — latest 3–4 with a "View All" link

A small "This Week at a Glance" stats strip: events this week, active clubs, open deadlines

2. 📅 Events

Filter/tab bar: All, Technical, Workshops, Hackathons, Cultural

Toggle between Grid view and Calendar view (monthly calendar with event dots)

Search + filters (date range, venue, "free" vs "registration required")

Event cards: title, category badge, date/time, venue, seats left, Register/Save button

"Save for later" (bookmark icon) that ties into the Dashboard

3. 🏛️ Clubs

Club directory grid (logo, name, category tag — Technical/Cultural/Sports/Social), search + category filter

Each club card links to a dedicated Club Page with: banner, about, member count, upcoming events by this club, photo gallery, "Join Club" button, contact/social links

Seed with realistic sample clubs: IEEE Student Chapter, ISA, Coding Club, Robotics Club, Music & Arts Club, Sports Committee, Entrepreneurship Cell

4. 📝 Event Details (dynamic page per event)

Banner image, title, category badge, full description

Speaker/host cards (photo, name, title)

Schedule/agenda timeline (time-blocked)

Venue with embedded map placeholder

Live countdown timer (days/hours/min/sec) to event start, built in JS/React state — switches to "Happening Now" or "Event Ended" automatically

Sticky "Register" button (with confirmation modal + success toast); shows "Registered ✅" state after

Related/similar events section at the bottom

5. 👤 Student Dashboard

Profile header: avatar, name, department/year, bio, edit-profile button

Tabs: Registered Events, Saved Events, Upcoming (next 7 days), Certificates

Stats cards: events attended, points earned, certificates collected, current leaderboard rank

Activity timeline (recent actions: registered, saved, certificate earned)

6. 📢 Announcements

Feed of college notices, deadlines, and updates — each with category tag (Academic, Event, Deadline, General), priority flag for urgent ones, posted date

Search bar + filter by category/date

Pin important announcements to the top

"Mark as read" state and unread indicator dot

7. 📊 Leaderboard

Ranked table/list of students by points, with avatar, name, department, events attended, certificates earned, total points

Top 3 get a podium-style highlight card at the top

Filter by "This Month" / "This Semester" / "All Time"

Show the current logged-in student's own rank highlighted even if they're far down the list

Small "How points work" info tooltip (e.g., attend event = +10, win hackathon = +50, host = +20)

8. 📞 Contact

Contact form (name, email, subject, message) with success toast on submit

FAQ accordion section

Social links (Instagram, LinkedIn, Discord/WhatsApp community) as icon buttons

Campus map/location block + general email and office hours

Bonus "Student OS" Enhancements (build these in after the core 8 pages)

Timetable page: weekly class schedule grid, color-coded by subject

Assignments/Deadlines tracker: kanban-style (To Do / In Progress / Done) tied into Announcements deadlines

Notes section: simple folder + note list, markdown-friendly text editor

Expense tracker (optional, lightweight): monthly spend log with category breakdown chart

Unified "Today" view on the dashboard pulling together today's classes, deadlines, and events

Interactions & Logic to Implement

Live countdown timers on event pages

Search + multi-filter logic on Events, Clubs, and Announcements (client-side filtering over sample data)

Save/Register buttons that update Dashboard state in real time

Dark/light mode toggle persisted across pages

Responsive collapse of sidebar → mobile bottom nav

Smooth page transitions and card hover/entry animations

Data

Seed the app with realistic sample data (10–15 events across all categories, 6–8 clubs, 8–10 announcements, a 15-person leaderboard, 1 demo student profile) so every page looks fully populated from the first load.

Build Order (tell Lovable to follow this if it asks how to sequence)

Global shell: navbar, sidebar, routing, dark/light theme, design tokens

Home, Events, Clubs, Event Details (with countdown)

Dashboard, Announcements, Leaderboard, Contact

Student OS bonus pages (Timetable, Assignments, Notes)

Wire up Supabase auth + persistent database once the UI is approved

Tip: paste this whole prompt as your first message in Lovable, let it scaffold everything, then go section-by-section ("now polish the Event Details page," "now connect Supabase auth") for refinement.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/59747968-af0b-43ba-b77e-97fa4c02fee3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
