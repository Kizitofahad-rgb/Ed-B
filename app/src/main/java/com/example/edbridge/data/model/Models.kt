package com.example.edbridge.data.model

enum class CommunityKind(val label: String) {
    COLLEGE("College"),
    COURSE("Course"),
    SCHOOL_ALUMNI("School Alumni"),
    ORGANIZATION("Organization"),
    CLUB("Club")
}

data class Community(
    val id: String,
    val name: String,
    val short: String,
    val kind: CommunityKind,
    val tagline: String,
    val members: Int,
    val studentsHelped: Int,
    val mentorshipSessions: Int,
    val opportunitiesCreated: Int,
    val resourcesShared: Int,
    val accent: String = "primary"
)

enum class PersonRole(val label: String) {
    STUDENT("Student"),
    SUPPORTER("Supporter"),
    MENTOR("Mentor"),
    ALUMNI("Alumni"),
    ORGANIZATION("Organization")
}

enum class SupportType(val label: String) {
    FINANCIAL("Financial"),
    MENTORSHIP("Mentorship"),
    RESOURCE("Resource"),
    OPPORTUNITY("Opportunity"),
    REFERRAL("Referral"),
    AMPLIFICATION("Amplification")
}

enum class DisclosureLevel(val label: String, val subtitle: String) {
    SHIELDED_ALIAS(
        "Shielded Alias",
        "Identity verified by Ed-Bridge; real name & face hidden from peers"
    ),
    CIRCLE_TRUSTED(
        "Circle Trusted",
        "Visible only to verified alumni & mentors in your college/school"
    ),
    PUBLIC_VERIFIED(
        "Public Verified",
        "Name & profile visible across the verified Ed-Bridge network"
    )
}

enum class AudienceScope(val label: String, val description: String) {
    ALUMNI_MENTORS_ONLY(
        "Alumni & Mentors Only",
        "Hidden from current students & classmates so you keep full privacy on campus"
    ),
    MY_COMMUNITIES(
        "My Communities Only",
        "Shared strictly with your college, course & secondary school alumni circles"
    ),
    FULL_NETWORK(
        "Verified Ed-Bridge Network",
        "Reach all verified alumni, supporters & partner organizations"
    )
}

enum class DisbursementMode(val label: String, val badge: String) {
    DIRECT_BURSAR("Direct to University Bursar", "Direct Bursar Settlement"),
    DIRECT_VENDOR("Direct to Hostel / Vendor", "Direct Vendor Payment"),
    MILESTONE_STIPEND("Sustenance / Meal Voucher", "Milestone Voucher")
}

data class RequestUpdate(
    val id: String,
    val authorLabel: String,
    val date: String,
    val milestoneTag: String,
    val message: String,
    val isGratitude: Boolean = false
)

data class Person(
    val id: String,
    val name: String,
    val role: PersonRole,
    val headline: String,
    val college: String? = null,
    val course: String? = null,
    val year: Int? = null,
    val secondarySchool: String? = null,
    val communities: List<String> = emptyList(),
    val skills: List<String> = emptyList(),
    val offers: List<SupportType> = emptyList(),
    val verified: Boolean = false,
    val trustScore: Int = 80,
    val bio: String = "",
    val photoKey: String? = null
)

enum class VerificationState(val label: String) {
    PENDING("Pending review"),
    VERIFIED("Verified"),
    NEEDS_INFO("Needs more information"),
    REJECTED("Rejected")
}

data class VerificationChecks(
    val identity: Boolean = false,
    val studentStatus: Boolean = false,
    val documents: Boolean = false,
    val humanReview: Boolean = false
)

data class SupportRequest(
    val id: String,
    val personId: String,
    val title: String,
    val category: String,
    val need: String,
    val why: String,
    val amountNeeded: Long? = null,
    val amountRaised: Long? = null,
    val resourceNeeded: String? = null,
    val deadlineDays: Int = 14,
    val supporters: Int = 0,
    val supportTypes: List<SupportType> = emptyList(),
    val status: VerificationState = VerificationState.PENDING,
    val checks: VerificationChecks = VerificationChecks(),
    val createdAt: String = "",
    val disclosureLevel: DisclosureLevel = DisclosureLevel.CIRCLE_TRUSTED,
    val audienceScope: AudienceScope = AudienceScope.MY_COMMUNITIES,
    val disbursementMode: DisbursementMode = DisbursementMode.DIRECT_BURSAR,
    val aliasLabel: String = "Verified Student",
    val matchingSponsor: String? = null,
    val updates: List<RequestUpdate> = emptyList()
)

data class Opportunity(
    val id: String,
    val title: String,
    val org: String,
    val kind: String,
    val location: String,
    val compensation: String,
    val closesInDays: Int,
    val summary: String,
    val matchReason: String,
    val communities: List<String> = emptyList()
)

data class Organization(
    val id: String,
    val name: String,
    val kind: String,
    val studentsReached: Int,
    val campaigns: Int,
    val mentorshipSessions: Int,
    val opportunitiesCreated: Int,
    val blurb: String,
    val planTier: String = "Pro Cohort"
)

enum class Privacy(val label: String) {
    PRIVATE("Private"),
    RECOGNIZED("Recognized"),
    PUBLIC("Public impact")
}

data class ImpactEvent(
    val id: String,
    val date: String,
    val type: String,
    val label: String,
    val detail: String,
    val privacy: Privacy = Privacy.RECOGNIZED
)

enum class NotificationTone {
    MATCH, SUPPORT, VERIFICATION, IMPACT, OPPORTUNITY
}

data class AppNotification(
    val id: String,
    val title: String,
    val body: String,
    val at: String,
    val read: Boolean = false,
    val tone: NotificationTone = NotificationTone.SUPPORT
)

data class Recommendation(
    val personId: String,
    val relevance: Int,
    val reasons: List<String>
)

data class ProofOfImpactItem(
    val id: String,
    val studentId: String,
    val studentName: String,
    val type: String,
    val title: String,
    val date: String,
    val fileLabel: String,
    val amountVerified: Long? = null,
    val note: String? = null,
    val verified: Boolean = false
)

data class CommunityActivity(
    val id: String,
    val community: String,
    val label: String,
    val detail: String,
    val `when`: String
)

data class Campaign(
    val name: String,
    val goalStudents: Int,
    val supportedStudents: Int,
    val laptops: Int,
    val tablets: Int,
    val mentorshipSessions: Int
)

enum class DemoRole(val label: String) {
    VISITOR("Visitor"),
    STUDENT("Student"),
    SUPPORTER("Supporter"),
    COMMUNITY("Community"),
    ORGANIZATION("Organization"),
    ADMIN("Admin")
}
