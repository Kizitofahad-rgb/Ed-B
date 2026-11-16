# Ed-Bridge (Android)

Ed-Bridge is a trusted student support and educational opportunity network, originating at Makerere University in Uganda.

## Overview
Unlike anonymous crowdfunding, Ed-Bridge leverages relational trust networks (colleges, courses, secondary school alumni, and student associations) to connect students with direct funding, mentorship, equipment, opportunities, and referrals.

## Architecture
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose (Material Design 3)
- **Architecture**: MVVM with reactive StateFlow repository
- **Design System**: Centralized Material 3 Theme with Makerere community color tokens
- **Platform**: Android SDK 36 (minSdk 26)

## Core Features
1. **Interactive Ed-Bridge Circle**: Visual network graph connecting students through shared colleges (CoCIS, CEDAT, CHUSS, CAES, CONAS), courses, and alumni networks.
2. **Support Requests**: Verified student needs (Tuition, Laptops/Equipment, Accommodation, Mentorship, Internships) with verification checklist (Identity, Student Status, Documents, Human Review).
3. **Simulated Direct Funding**: UGX contribution flow with privacy selection (Private, Recognized, Public).
4. **Relational Giving**: Non-financial support actions (Mentorship, Resources, Opportunity referrals, Community amplification).
5. **Community Directory & Leaderboard**: Colleges and alumni networks ranked by students helped, mentorship sessions, and opportunities shared.
6. **Opportunities Matcher**: Internships, scholarships, and hackathons with explicit rationale explaining why the student was matched.
7. **Impact Passport**: Verifiable contribution history, 52-week activity heatmap, achievement badges, and Proof of Impact document verification.
8. **Admin Verification Queue**: Workflow for reviewers to verify student identity and documents.
9. **Student Onboarding**: 4-step wizard for building a verified student profile.
10. **Notification Center**: Real-time alerts for matches, verifications, and community activity.
