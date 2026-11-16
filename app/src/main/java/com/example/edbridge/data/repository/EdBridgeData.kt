package com.example.edbridge.data.repository

import com.example.edbridge.data.model.*
import java.text.NumberFormat
import java.util.Locale

object EdBridgeData {
    const val CURRENT_USER_ID = "p-kizito"

    fun formatUgx(amount: Long): String {
        val formatter = NumberFormat.getNumberInstance(Locale.US)
        return "UGX ${formatter.format(amount)}"
    }

    val communities = listOf(
        Community(
            id = "cocis",
            name = "College of Computing and Information Sciences",
            short = "CoCIS",
            kind = CommunityKind.COLLEGE,
            tagline = "Makerere's computing, IT and information science community.",
            members = 1420,
            studentsHelped = 46,
            mentorshipSessions = 88,
            opportunitiesCreated = 34,
            resourcesShared = 27,
            accent = "primary"
        ),
        Community(
            id = "cedat",
            name = "College of Engineering, Design, Art and Technology",
            short = "CEDAT",
            kind = CommunityKind.COLLEGE,
            tagline = "Engineers, designers and builders supporting their own.",
            members = 1180,
            studentsHelped = 28,
            mentorshipSessions = 61,
            opportunitiesCreated = 22,
            resourcesShared = 19,
            accent = "connection"
        ),
        Community(
            id = "chuss",
            name = "College of Humanities and Social Sciences",
            short = "CHUSS",
            kind = CommunityKind.COLLEGE,
            tagline = "Humanities students, researchers and alumni.",
            members = 1610,
            studentsHelped = 21,
            mentorshipSessions = 40,
            opportunitiesCreated = 14,
            resourcesShared = 9,
            accent = "cyan"
        ),
        Community(
            id = "caes",
            name = "College of Agricultural and Environmental Sciences",
            short = "CAES",
            kind = CommunityKind.COLLEGE,
            tagline = "Agriculture, food systems and environment.",
            members = 970,
            studentsHelped = 17,
            mentorshipSessions = 26,
            opportunitiesCreated = 11,
            resourcesShared = 12,
            accent = "success"
        ),
        Community(
            id = "conas",
            name = "College of Natural Sciences",
            short = "CONAS",
            kind = CommunityKind.COLLEGE,
            tagline = "Mathematics, physics, chemistry and biology.",
            members = 840,
            studentsHelped = 13,
            mentorshipSessions = 18,
            opportunitiesCreated = 8,
            resourcesShared = 6,
            accent = "primary"
        ),
        Community(
            id = "cs",
            name = "Computer Science (Makerere)",
            short = "Computer Science",
            kind = CommunityKind.COURSE,
            tagline = "Everyone on the BSc Computer Science programme, past and present.",
            members = 520,
            studentsHelped = 31,
            mentorshipSessions = 74,
            opportunitiesCreated = 29,
            resourcesShared = 21,
            accent = "connection"
        ),
        Community(
            id = "busia-alumni",
            name = "Busia Secondary School Alumni",
            short = "Busia SS Alumni",
            kind = CommunityKind.SCHOOL_ALUMNI,
            tagline = "From Busia to campus — and back again.",
            members = 214,
            studentsHelped = 12,
            mentorshipSessions = 23,
            opportunitiesCreated = 7,
            resourcesShared = 10,
            accent = "cyan"
        ),
        Community(
            id = "mak-alumni",
            name = "Makerere Alumni Network",
            short = "Mak Alumni",
            kind = CommunityKind.ORGANIZATION,
            tagline = "Graduates giving structured support back to campus.",
            members = 3120,
            studentsHelped = 58,
            mentorshipSessions = 132,
            opportunitiesCreated = 47,
            resourcesShared = 33,
            accent = "success"
        )
    )

    val people = listOf(
        Person(
            id = CURRENT_USER_ID,
            name = "Kizito Fahad",
            role = PersonRole.STUDENT,
            headline = "Computer Science, Year 2 — CoCIS",
            college = "CoCIS",
            course = "Computer Science",
            year = 2,
            secondarySchool = "Busia Secondary School",
            communities = listOf("cocis", "cs", "busia-alumni"),
            skills = listOf("React", "Python", "Data structures", "Community organising"),
            offers = listOf(SupportType.MENTORSHIP, SupportType.REFERRAL, SupportType.AMPLIFICATION),
            verified = true,
            trustScore = 88,
            bio = "Second-year Computer Science student who runs a weekend coding club for first-years.",
            photoKey = "student_1"
        ),
        Person(
            id = "p-amina",
            name = "Amina N.",
            role = PersonRole.STUDENT,
            headline = "Computer Science, Year 2 — CoCIS",
            college = "CoCIS",
            course = "Computer Science",
            year = 2,
            secondarySchool = "Tororo Girls School",
            communities = listOf("cocis", "cs"),
            skills = listOf("Java", "Databases"),
            offers = listOf(SupportType.AMPLIFICATION),
            verified = true,
            trustScore = 91,
            bio = "Works part-time at a campus print shop while completing her second year.",
            photoKey = "student_2"
        ),
        Person(
            id = "p-david",
            name = "David K.",
            role = PersonRole.STUDENT,
            headline = "Civil Engineering, Year 3 — CEDAT",
            college = "CEDAT",
            course = "Civil Engineering",
            year = 3,
            secondarySchool = "Busia Secondary School",
            communities = listOf("cedat", "busia-alumni"),
            skills = listOf("AutoCAD", "Surveying"),
            offers = listOf(SupportType.REFERRAL),
            verified = true,
            trustScore = 84,
            bio = "Third-year engineering student from Busia, active in the district students' association.",
            photoKey = "student_3"
        ),
        Person(
            id = "p-sarah",
            name = "Sarah M.",
            role = PersonRole.MENTOR,
            headline = "Software Engineer — CoCIS alumna (2019)",
            college = "CoCIS",
            course = "Computer Science",
            secondarySchool = "Gayaza High School",
            communities = listOf("cocis", "cs", "mak-alumni"),
            skills = listOf("Backend engineering", "Career coaching"),
            offers = listOf(SupportType.MENTORSHIP, SupportType.OPPORTUNITY, SupportType.REFERRAL),
            verified = true,
            trustScore = 95,
            bio = "Mentors two students each semester on backend engineering and interview prep.",
            photoKey = "student_4"
        ),
        Person(
            id = "p-brian",
            name = "Brian O.",
            role = PersonRole.ALUMNI,
            headline = "Product Manager — Mak Alumni Network",
            college = "COBAMS",
            course = "Business Computing",
            secondarySchool = "Busia Secondary School",
            communities = listOf("mak-alumni", "busia-alumni"),
            skills = listOf("Product", "Fundraising"),
            offers = listOf(SupportType.FINANCIAL, SupportType.OPPORTUNITY, SupportType.MENTORSHIP),
            verified = true,
            trustScore = 93,
            bio = "Coordinates the Busia alumni tuition circle.",
            photoKey = "student_5"
        ),
        Person(
            id = "p-joel",
            name = "Joel T.",
            role = PersonRole.STUDENT,
            headline = "Software Engineering, Year 1 — CoCIS",
            college = "CoCIS",
            course = "Software Engineering",
            year = 1,
            secondarySchool = "Busia Secondary School",
            communities = listOf("cocis", "busia-alumni"),
            skills = listOf("JavaScript"),
            offers = emptyList(),
            verified = true,
            trustScore = 79,
            bio = "First-year student adjusting to campus life, looking for a study group.",
            photoKey = "student_6"
        ),
        Person(
            id = "p-peter",
            name = "Peter M.",
            role = PersonRole.SUPPORTER,
            headline = "Data Analyst — CoCIS alumnus (2017)",
            college = "CoCIS",
            course = "Computer Science",
            secondarySchool = "Namilyango College",
            communities = listOf("cocis", "cs", "mak-alumni"),
            skills = listOf("Analytics", "SQL"),
            offers = listOf(SupportType.FINANCIAL, SupportType.MENTORSHIP),
            verified = true,
            trustScore = 92,
            bio = "Supports one tuition request per semester and mentors data-science beginners."
        ),
        Person(
            id = "p-esther",
            name = "Esther K.",
            role = PersonRole.STUDENT,
            headline = "Social Work, Year 2 — CHUSS",
            college = "CHUSS",
            course = "Social Work",
            year = 2,
            secondarySchool = "Tororo Girls School",
            communities = listOf("chuss"),
            skills = listOf("Counselling", "Community work"),
            offers = listOf(SupportType.AMPLIFICATION),
            verified = true,
            trustScore = 78,
            bio = "Volunteers with a student welfare desk."
        ),
        Person(
            id = "p-fatuma",
            name = "Fatuma B.",
            role = PersonRole.STUDENT,
            headline = "Agribusiness, Year 2 — CAES",
            college = "CAES",
            course = "Agribusiness",
            year = 2,
            secondarySchool = "Busia Secondary School",
            communities = listOf("caes", "busia-alumni"),
            skills = listOf("Field research"),
            offers = emptyList(),
            verified = true,
            trustScore = 81,
            bio = "Studying smallholder value chains in eastern Uganda."
        ),
        Person(
            id = "p-collins",
            name = "Collins B.",
            role = PersonRole.STUDENT,
            headline = "Electrical Engineering, Year 2 — CEDAT",
            college = "CEDAT",
            course = "Electrical Engineering",
            year = 2,
            secondarySchool = "Ntare School",
            communities = listOf("cedat"),
            skills = listOf("Embedded systems"),
            offers = listOf(SupportType.RESOURCE),
            verified = true,
            trustScore = 80,
            bio = "Repairs and refurbishes donated laptops for classmates."
        ),
        Person(
            id = "p-hassan",
            name = "Hassan L.",
            role = PersonRole.STUDENT,
            headline = "Computer Science, Year 3 — CoCIS",
            college = "CoCIS",
            course = "Computer Science",
            year = 3,
            secondarySchool = "Busia Secondary School",
            communities = listOf("cocis", "cs", "busia-alumni"),
            skills = listOf("Android", "Kotlin"),
            offers = listOf(SupportType.MENTORSHIP, SupportType.AMPLIFICATION),
            verified = true,
            trustScore = 86,
            bio = "Builds Android apps for campus clubs."
        )
    )

    val peopleMap: Map<String, Person> = people.associateBy { it.id }
    val communitiesMap: Map<String, Community> = communities.associateBy { it.id }

    val initialRequests = listOf(
        SupportRequest(
            id = "r-shielded-tuition",
            personId = "p-amina",
            title = "UGX 350,000 exam permit tuition clearance",
            category = "Tuition",
            need = "Direct bursar settlement to clear Semester 2 balance before exam permit deadline.",
            why = "Academic standing is 4.2 GPA. A temporary family cash-flow gap left a balance; clearing the invoice directly with the university bursar unlocks end-of-semester exams.",
            amountNeeded = 350000L,
            amountRaised = 210000L,
            deadlineDays = 9,
            supporters = 6,
            supportTypes = listOf(SupportType.FINANCIAL, SupportType.OPPORTUNITY, SupportType.MENTORSHIP),
            status = VerificationState.VERIFIED,
            checks = VerificationChecks(identity = true, studentStatus = true, documents = true, humanReview = true),
            createdAt = "2026-11-08",
            disclosureLevel = DisclosureLevel.SHIELDED_ALIAS,
            audienceScope = AudienceScope.ALUMNI_MENTORS_ONLY,
            disbursementMode = DisbursementMode.DIRECT_BURSAR,
            aliasLabel = "Verified CoCIS Year 2 Student · #EB-402",
            matchingSponsor = "Mak Alumni matches 1:1 up to UGX 100,000",
            updates = listOf(
                RequestUpdate(
                    id = "u-1",
                    authorLabel = "Student #EB-402",
                    date = "2 days ago",
                    milestoneTag = "50% Milestone",
                    message = "Thank you so much to the 6 alumni who stepped in quietly! Over half the bursar invoice is cleared. I also applied for the part-time data role listed here.",
                    isGratitude = true
                )
            )
        ),
        SupportRequest(
            id = "r-joel-laptop",
            personId = "p-joel",
            title = "Loaner laptop or equipment grant for coding labs",
            category = "Laptop / Equipment",
            need = "Access to a refurbished 8GB RAM laptop (or semester loan) for software practicals.",
            why = "Currently sharing a lab workstation with three peers during restricted evening hours. Even a temporary semester loan from an alumnus or lab scheme solves this.",
            resourceNeeded = "Refurbished laptop (loan or grant)",
            amountNeeded = 900000L,
            amountRaised = 300000L,
            deadlineDays = 21,
            supporters = 4,
            supportTypes = listOf(SupportType.RESOURCE, SupportType.FINANCIAL, SupportType.MENTORSHIP, SupportType.AMPLIFICATION),
            status = VerificationState.VERIFIED,
            checks = VerificationChecks(identity = true, studentStatus = true, documents = true, humanReview = true),
            createdAt = "2026-11-02",
            disclosureLevel = DisclosureLevel.CIRCLE_TRUSTED,
            audienceScope = AudienceScope.MY_COMMUNITIES,
            disbursementMode = DisbursementMode.DIRECT_VENDOR,
            aliasLabel = "Joel T. (CoCIS Year 1)",
            matchingSponsor = "Eastern Uganda Laptop Fund contributes hardware match",
            updates = listOf(
                RequestUpdate(
                    id = "u-2",
                    authorLabel = "Joel T.",
                    date = "Yesterday",
                    milestoneTag = "Equipment Check",
                    message = "Completed Data Structures lab 3 using borrowed workshop hours — grateful for the mentorship check-in from Sarah M.!"
                )
            )
        ),
        SupportRequest(
            id = "r-esther-sustenance",
            personId = "p-esther",
            title = "One month hostel & campus sustenance voucher",
            category = "Accommodation",
            need = "UGX 280,000 direct hostel payment + meal voucher while district bursary processes.",
            why = "Bursary disbursement shifted by 4 weeks. Direct hostel settlement prevents a 3-hour daily commute during coursework weeks.",
            amountNeeded = 280000L,
            amountRaised = 145000L,
            deadlineDays = 6,
            supporters = 5,
            supportTypes = listOf(SupportType.FINANCIAL, SupportType.REFERRAL, SupportType.AMPLIFICATION),
            status = VerificationState.VERIFIED,
            checks = VerificationChecks(identity = true, studentStatus = true, documents = true, humanReview = true),
            createdAt = "2026-11-10",
            disclosureLevel = DisclosureLevel.SHIELDED_ALIAS,
            audienceScope = AudienceScope.ALUMNI_MENTORS_ONLY,
            disbursementMode = DisbursementMode.DIRECT_VENDOR,
            aliasLabel = "Verified CHUSS Year 2 Student · #EB-189",
            updates = listOf(
                RequestUpdate(
                    id = "u-3",
                    authorLabel = "Student #EB-189",
                    date = "3 days ago",
                    milestoneTag = "50% Funded",
                    message = "Half of the hostel invoice is settled directly with the custodian. Thank you for protecting my privacy while helping me stay near campus.",
                    isGratitude = true
                )
            )
        ),
        SupportRequest(
            id = "r-fatuma-mentor",
            personId = "p-fatuma",
            title = "Field mentor for agribusiness maize research",
            category = "Mentorship",
            need = "2-hour review of research methodology & field contacts in Eastern Uganda.",
            why = "Researching smallholder maize value chains; looking for an alumnus in agribusiness or NGO research for guidance — no funding needed.",
            deadlineDays = 30,
            supporters = 2,
            supportTypes = listOf(SupportType.MENTORSHIP, SupportType.OPPORTUNITY, SupportType.REFERRAL),
            status = VerificationState.VERIFIED,
            checks = VerificationChecks(identity = true, studentStatus = true, documents = true, humanReview = true),
            createdAt = "2026-10-28",
            disclosureLevel = DisclosureLevel.PUBLIC_VERIFIED,
            audienceScope = AudienceScope.FULL_NETWORK,
            disbursementMode = DisbursementMode.MILESTONE_STIPEND,
            aliasLabel = "Fatuma B. (CAES Year 2)"
        ),
        SupportRequest(
            id = "r-collins-intern",
            personId = "p-collins",
            title = "Industrial training placement in power systems",
            category = "Career / Internship",
            need = "Recess-term electrical engineering internship or referral near Kampala.",
            why = "Compulsory industrial training starts next month. Seeking a referral from CEDAT alumni working in energy or telecoms.",
            deadlineDays = 18,
            supporters = 1,
            supportTypes = listOf(SupportType.OPPORTUNITY, SupportType.REFERRAL, SupportType.MENTORSHIP),
            status = VerificationState.PENDING,
            checks = VerificationChecks(identity = true, studentStatus = true, documents = true, humanReview = false),
            createdAt = "2026-11-12",
            disclosureLevel = DisclosureLevel.CIRCLE_TRUSTED,
            audienceScope = AudienceScope.MY_COMMUNITIES,
            disbursementMode = DisbursementMode.MILESTONE_STIPEND,
            aliasLabel = "Collins B. (CEDAT Year 2)"
        )
    )

    val opportunities = listOf(
        Opportunity(
            id = "o-1",
            title = "Part-time Campus Data Assistant",
            org = "Makerere Research Group",
            kind = "Part-time",
            location = "On campus · 10 hrs/wk",
            compensation = "UGX 220,000 / month",
            closesInDays = 6,
            summary = "Flexible paid student work cleaning and visualising survey datasets alongside graduate researchers.",
            matchReason = "Matched because you study Computer Science and listed Python & Data skills.",
            communities = listOf("cocis", "conas")
        ),
        Opportunity(
            id = "o-2",
            title = "Backend Engineering Internship",
            org = "Kampala Fintech Partner",
            kind = "Internship",
            location = "Kampala · Hybrid",
            compensation = "UGX 450,000 stipend / mo",
            closesInDays = 12,
            summary = "Three-month paid internship building mobile money APIs alongside a senior Makerere alumnus.",
            matchReason = "Matched because you belong to CoCIS and Computer Science.",
            communities = listOf("cs", "cocis")
        ),
        Opportunity(
            id = "o-3",
            title = "CoCIS Women & Allies Tuition Scholarship",
            org = "Makerere Alumni Network",
            kind = "Scholarship",
            location = "Makerere University",
            compensation = "Up to UGX 800,000 / sem",
            closesInDays = 20,
            summary = "Partial tuition scholarship for continuing computing students with verified academic progress.",
            matchReason = "Matched because you belong to CoCIS.",
            communities = listOf("cocis")
        ),
        Opportunity(
            id = "o-4",
            title = "Alumni Mentorship Cohort — Semester 2",
            org = "Mak Alumni Network",
            kind = "Mentorship",
            location = "Online · Fortnightly",
            compensation = "6 structured sessions + CV review",
            closesInDays = 8,
            summary = "Pair up with a verified alumnus in software, engineering, or product management for career guidance.",
            matchReason = "Matched because 3 mentors in your communities are accepting mentees.",
            communities = listOf("mak-alumni", "cocis")
        ),
        Opportunity(
            id = "o-5",
            title = "East Africa Civic Tech Hackathon",
            org = "Regional Student Tech Network",
            kind = "Hackathon",
            location = "Kampala · 48 hours",
            compensation = "UGX 1.5M prize + travel stipend",
            closesInDays = 15,
            summary = "Build solutions for campus & civic challenges; travel and meal support provided.",
            matchReason = "Matched because your skills include React and Python.",
            communities = listOf("cs", "cedat")
        )
    )

    val organizations = listOf(
        Organization(
            id = "org-mak-alumni",
            name = "Makerere Alumni Network",
            kind = "Alumni Association",
            studentsReached = 412,
            campaigns = 6,
            mentorshipSessions = 132,
            opportunitiesCreated = 47,
            blurb = "Coordinates alumni tuition matching pools, mentorship cohorts, and direct bursar disbursements.",
            planTier = "Ed-Bridge Enterprise"
        ),
        Organization(
            id = "org-laptop-fund",
            name = "Eastern Uganda Laptop Fund",
            kind = "Education Non-Profit",
            studentsReached = 96,
            campaigns = 3,
            mentorshipSessions = 12,
            opportunitiesCreated = 5,
            blurb = "Refurbishes and lends laptops to computing students from eastern Uganda with full tracking.",
            planTier = "Ed-Bridge Pro"
        ),
        Organization(
            id = "org-cedat-guild",
            name = "CEDAT Students' Guild",
            kind = "Student Organization",
            studentsReached = 188,
            campaigns = 4,
            mentorshipSessions = 34,
            opportunitiesCreated = 16,
            blurb = "Runs emergency sustenance grants and workshop-resource sharing for engineering students.",
            planTier = "Campus Partner"
        )
    )

    val recommendations = listOf(
        Recommendation(
            personId = "p-sarah",
            relevance = 94,
            reasons = listOf("CoCIS Alumna (2019)", "Mentors Year 2 CS students", "3 mentorship slots open")
        ),
        Recommendation(
            personId = "p-brian",
            relevance = 88,
            reasons = listOf("Same secondary school — Busia SS", "Coordinates Busia tuition circle")
        ),
        Recommendation(
            personId = "p-amina",
            relevance = 85,
            reasons = listOf("Same college — CoCIS", "Same course — Computer Science")
        ),
        Recommendation(
            personId = "p-david",
            relevance = 81,
            reasons = listOf("Same secondary school — Busia SS", "Active in district association")
        ),
        Recommendation(
            personId = "p-hassan",
            relevance = 76,
            reasons = listOf("Same course — Computer Science", "Android & Kotlin mentor")
        ),
        Recommendation(
            personId = "p-joel",
            relevance = 69,
            reasons = listOf("Same secondary school", "First-year peer you mentor")
        )
    )

    val initialImpact = listOf(
        ImpactEvent(
            id = "i-1",
            date = "2026-11-12",
            type = "financial",
            label = "Contributed to shielded tuition clearance",
            detail = "Student #EB-402 — Direct Makerere Bursar settlement",
            privacy = Privacy.RECOGNIZED
        ),
        ImpactEvent(
            id = "i-2",
            date = "2026-11-08",
            type = "mentorship",
            label = "Mentored a first-year CS student",
            detail = "Data structures study session with Joel T.",
            privacy = Privacy.RECOGNIZED
        ),
        ImpactEvent(
            id = "i-3",
            date = "2026-11-03",
            type = "opportunity",
            label = "Referred a paid campus data role",
            detail = "Shared Makerere Research Group job with CoCIS circle",
            privacy = Privacy.PUBLIC
        ),
        ImpactEvent(
            id = "i-4",
            date = "2026-10-24",
            type = "resource",
            label = "Lent lab equipment",
            detail = "Loaned spare laptop charger to CEDAT share pool",
            privacy = Privacy.PRIVATE
        ),
        ImpactEvent(
            id = "i-5",
            date = "2026-10-14",
            type = "amplification",
            label = "Amplified verified request to alumni",
            detail = "Shared shielded hostel request with Busia SS Alumni",
            privacy = Privacy.PUBLIC
        )
    )

    val initialNotifications = listOf(
        AppNotification(
            id = "n-1",
            title = "50% Milestone & Thank-You Note",
            body = "Student #EB-402 posted a gratitude update: over half of the bursar invoice is cleared!",
            at = "2h ago",
            read = false,
            tone = NotificationTone.IMPACT
        ),
        AppNotification(
            id = "n-2",
            title = "New mentorship match in CoCIS",
            body = "Sarah M. (Software Engineer, CoCIS '19) opened one mentorship slot.",
            at = "5h ago",
            read = false,
            tone = NotificationTone.MATCH
        ),
        AppNotification(
            id = "n-3",
            title = "Paid campus role matched to you",
            body = "Part-time Campus Data Assistant (UGX 220,000/mo) closes in 6 days.",
            at = "Yesterday",
            read = false,
            tone = NotificationTone.OPPORTUNITY
        ),
        AppNotification(
            id = "n-4",
            title = "Your student verification passed",
            body = "Makerere University enrollment & shielded alias #EB-219 are now verified.",
            at = "2 days ago",
            read = true,
            tone = NotificationTone.VERIFICATION
        )
    )

    val communityActivities = listOf(
        CommunityActivity(
            id = "ca-1",
            community = "cocis",
            label = "Laptop lending pool updated",
            detail = "CoCIS Laptop Support reached 14 of 20 students this semester",
            `when` = "2 days ago"
        ),
        CommunityActivity(
            id = "ca-2",
            community = "cs",
            label = "Peer mentorship cohort",
            detail = "8 career & code-review sessions logged this month by CS alumni",
            `when` = "4 days ago"
        ),
        CommunityActivity(
            id = "ca-3",
            community = "busia-alumni",
            label = "Private tuition circle",
            detail = "Busia SS Alumni quietly settled 2 exam-permit balances directly with the bursar",
            `when` = "1 week ago"
        ),
        CommunityActivity(
            id = "ca-4",
            community = "cedat",
            label = "Internship referral pipeline",
            detail = "CEDAT alumni placed 5 students in compulsory industrial training",
            `when` = "1 week ago"
        )
    )

    val proofItems = listOf(
        ProofOfImpactItem(
            id = "p1",
            studentId = "p-amina",
            studentName = "Student #EB-402 (Shielded)",
            type = "fee_receipt",
            title = "Makerere Bursar — Exam permit clearance",
            date = "2026-11-10",
            fileLabel = "Mak_Bursar_Settlement_402.pdf",
            amountVerified = 210000L,
            note = "Settled directly with Makerere Bursar's Office. Student identity kept shielded.",
            verified = true
        ),
        ProofOfImpactItem(
            id = "p2",
            studentId = "p-david",
            studentName = "David K.",
            type = "academic_report",
            title = "CEDAT Civil Engineering Year 2 Transcript",
            date = "2026-10-28",
            fileLabel = "David_CEDAT_Transcript.pdf",
            amountVerified = null,
            note = "CGPA 4.1 / 5.0 — First class honours standing.",
            verified = true
        ),
        ProofOfImpactItem(
            id = "p3",
            studentId = "p-fatuma",
            studentName = "Fatuma B.",
            type = "progress_update",
            title = "Agribusiness maize value chain field report",
            date = "2026-11-04",
            fileLabel = "Maize_Price_Field_Study.pdf",
            amountVerified = null,
            note = "Survey completed across 12 smallholder farmers in eastern Uganda.",
            verified = true
        ),
        ProofOfImpactItem(
            id = "p4",
            studentId = "p-esther",
            studentName = "Student #EB-189 (Shielded)",
            type = "fee_receipt",
            title = "Hostel custodian direct settlement",
            date = "2026-11-11",
            fileLabel = "Hostel_Direct_Receipt_189.pdf",
            amountVerified = 145000L,
            note = "Direct hostel payment verified for 1 month accommodation.",
            verified = true
        )
    )

    val campaign = Campaign(
        name = "CoCIS Laptop & Bursar Shield",
        goalStudents = 20,
        supportedStudents = 14,
        laptops = 11,
        tablets = 3,
        mentorshipSessions = 8
    )
}
