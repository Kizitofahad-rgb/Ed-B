package com.example.edbridge.data.repository

import com.example.edbridge.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class EdBridgeRepository {

    private val _role = MutableStateFlow(DemoRole.VISITOR)
    val role: StateFlow<DemoRole> = _role.asStateFlow()

    private val _requests = MutableStateFlow(EdBridgeData.initialRequests)
    val requests: StateFlow<List<SupportRequest>> = _requests.asStateFlow()

    private val _impactEvents = MutableStateFlow(EdBridgeData.initialImpact)
    val impactEvents: StateFlow<List<ImpactEvent>> = _impactEvents.asStateFlow()

    private val _notifications = MutableStateFlow(EdBridgeData.initialNotifications)
    val notifications: StateFlow<List<AppNotification>> = _notifications.asStateFlow()

    private val _joinedCommunities = MutableStateFlow(listOf("cocis", "cs", "busia-alumni"))
    val joinedCommunities: StateFlow<List<String>> = _joinedCommunities.asStateFlow()

    private val _connections = MutableStateFlow(listOf("p-amina", "p-david", "p-sarah", "p-hassan"))
    val connections: StateFlow<List<String>> = _connections.asStateFlow()

    private val _mentorships = MutableStateFlow(listOf("p-joel"))
    val mentorships: StateFlow<List<String>> = _mentorships.asStateFlow()

    private val _savedOpportunities = MutableStateFlow(setOf("o-1"))
    val savedOpportunities: StateFlow<Set<String>> = _savedOpportunities.asStateFlow()

    private val _appliedOpportunities = MutableStateFlow(emptySet<String>())
    val appliedOpportunities: StateFlow<Set<String>> = _appliedOpportunities.asStateFlow()

    private val _proofItems = MutableStateFlow(EdBridgeData.proofItems)
    val proofItems: StateFlow<List<ProofOfImpactItem>> = _proofItems.asStateFlow()

    private val _onboarded = MutableStateFlow(false)
    val onboarded: StateFlow<Boolean> = _onboarded.asStateFlow()

    private val _supporterStreakMonths = MutableStateFlow(4)
    val supporterStreakMonths: StateFlow<Int> = _supporterStreakMonths.asStateFlow()

    private fun today(): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

    private fun uid(): String = UUID.randomUUID().toString().take(8)

    fun setRole(newRole: DemoRole) {
        _role.value = newRole
    }

    fun completeOnboarding(
        name: String,
        institution: String,
        field: String,
        bio: String,
        defaultShielded: Boolean
    ) {
        _onboarded.value = true
        _role.value = DemoRole.STUDENT
        addNotification(
            title = "Profile submitted for verification",
            body = "Welcome, $name ($institution · $field). Privacy default: ${if (defaultShielded) "Shielded Alias" else "Circle Trusted"}.",
            tone = NotificationTone.VERIFICATION
        )
    }

    fun supportFinancially(
        requestId: String,
        amount: Long,
        privacy: Privacy,
        paymentRail: String = "Direct Bursar (MTN MoMo)",
        encouragementNote: String = ""
    ) {
        val req = _requests.value.find { it.id == requestId } ?: return
        val studentLabel = if (req.disclosureLevel == DisclosureLevel.SHIELDED_ALIAS) {
            req.aliasLabel
        } else {
            EdBridgeData.peopleMap[req.personId]?.name ?: req.aliasLabel
        }

        val previousRaised = req.amountRaised ?: 0L
        val nextRaised = previousRaised + amount
        val target = req.amountNeeded ?: 0L

        val milestoneUpdate = if (target > 0) {
            val prevPct = (previousRaised * 100) / target
            val nextPct = (nextRaised * 100) / target
            when {
                prevPct < 100 && nextPct >= 100 -> RequestUpdate(
                    id = "u-${uid()}",
                    authorLabel = "Ed-Bridge Milestone",
                    date = "Just now",
                    milestoneTag = "100% Funded!",
                    message = "Goal reached! Funds are queued for ${req.disbursementMode.badge}."
                )
                prevPct < 75 && nextPct >= 75 -> RequestUpdate(
                    id = "u-${uid()}",
                    authorLabel = "Ed-Bridge Milestone",
                    date = "Just now",
                    milestoneTag = "75% Milestone",
                    message = "75% of the ${req.category.lowercase()} target is now covered!"
                )
                prevPct < 50 && nextPct >= 50 -> RequestUpdate(
                    id = "u-${uid()}",
                    authorLabel = "Ed-Bridge Milestone",
                    date = "Just now",
                    milestoneTag = "50% Milestone",
                    message = "Halfway milestone reached! Every contribution moves this student closer to exams."
                )
                else -> null
            }
        } else null

        val supportNoteUpdate = if (encouragementNote.isNotBlank()) {
            RequestUpdate(
                id = "u-${uid()}",
                authorLabel = if (privacy == Privacy.PRIVATE) "Private Supporter" else "Verified Supporter",
                date = "Just now",
                milestoneTag = "Encouragement",
                message = encouragementNote.trim()
            )
        } else null

        _requests.value = _requests.value.map { r ->
            if (r.id == requestId) {
                val newUpdates = listOfNotNull(milestoneUpdate, supportNoteUpdate) + r.updates
                r.copy(
                    amountRaised = nextRaised,
                    supporters = r.supporters + 1,
                    updates = newUpdates
                )
            } else r
        }

        if (!_connections.value.contains(req.personId)) {
            _connections.value = _connections.value + req.personId
        }

        val event = ImpactEvent(
            id = uid(),
            date = today(),
            type = "financial",
            label = "Direct settlement via $paymentRail",
            detail = "$studentLabel — ${req.title} (${EdBridgeData.formatUgx(amount)})",
            privacy = privacy
        )
        _impactEvents.value = listOf(event) + _impactEvents.value

        addNotification(
            title = "Impact recorded (${EdBridgeData.formatUgx(amount)})",
            body = "Simulated $paymentRail settlement to $studentLabel added to your Impact Passport.",
            tone = NotificationTone.IMPACT
        )
    }

    fun offerSupport(requestId: String, type: SupportType, privacy: Privacy, note: String? = null) {
        val req = _requests.value.find { it.id == requestId } ?: return
        val studentLabel = if (req.disclosureLevel == DisclosureLevel.SHIELDED_ALIAS) {
            req.aliasLabel
        } else {
            EdBridgeData.peopleMap[req.personId]?.name ?: req.aliasLabel
        }

        val typeLabel = when (type) {
            SupportType.MENTORSHIP -> "Offered mentorship"
            SupportType.RESOURCE -> "Offered a resource / equipment loan"
            SupportType.OPPORTUNITY -> "Referred a paid opportunity"
            SupportType.REFERRAL -> "Made a warm referral"
            SupportType.AMPLIFICATION -> "Amplified to community circle"
            SupportType.FINANCIAL -> "Financial contribution"
        }

        val updateEntry = RequestUpdate(
            id = "u-${uid()}",
            authorLabel = if (privacy == Privacy.PRIVATE) "Private Supporter" else "Verified Circle Member",
            date = "Just now",
            milestoneTag = type.label,
            message = note?.takeIf { it.isNotBlank() } ?: "$typeLabel for this request."
        )

        _requests.value = _requests.value.map { r ->
            if (r.id == requestId) {
                r.copy(
                    supporters = r.supporters + 1,
                    updates = listOf(updateEntry) + r.updates
                )
            } else r
        }

        if (!_connections.value.contains(req.personId)) {
            _connections.value = _connections.value + req.personId
        }

        if (type == SupportType.MENTORSHIP && !_mentorships.value.contains(req.personId)) {
            _mentorships.value = _mentorships.value + req.personId
        }

        val event = ImpactEvent(
            id = uid(),
            date = today(),
            type = type.name.lowercase(Locale.ROOT),
            label = typeLabel,
            detail = "$studentLabel${if (!note.isNullOrBlank()) " — $note" else " — ${req.title}"}",
            privacy = privacy
        )
        _impactEvents.value = listOf(event) + _impactEvents.value

        addNotification(
            title = if (type == SupportType.MENTORSHIP) "New mentorship connection" else "Relational support offered",
            body = "$typeLabel for $studentLabel.",
            tone = if (type == SupportType.MENTORSHIP) NotificationTone.MATCH else NotificationTone.SUPPORT
        )
    }

    fun postRequestUpdate(requestId: String, milestoneTag: String, message: String, isGratitude: Boolean) {
        val req = _requests.value.find { it.id == requestId } ?: return
        val author = if (req.disclosureLevel == DisclosureLevel.SHIELDED_ALIAS) req.aliasLabel else "Kizito Fahad"
        val update = RequestUpdate(
            id = "u-${uid()}",
            authorLabel = author,
            date = "Just now",
            milestoneTag = milestoneTag,
            message = message,
            isGratitude = isGratitude
        )
        _requests.value = _requests.value.map { r ->
            if (r.id == requestId) r.copy(updates = listOf(update) + r.updates) else r
        }
        addNotification(
            title = if (isGratitude) "Thank-you update shared" else "Milestone update posted",
            body = "Supporters of \"${req.title}\" received your update.",
            tone = NotificationTone.IMPACT
        )
    }

    fun joinCommunity(id: String) {
        if (_joinedCommunities.value.contains(id)) return
        _joinedCommunities.value = _joinedCommunities.value + id

        val comm = EdBridgeData.communitiesMap[id]
        val event = ImpactEvent(
            id = uid(),
            date = today(),
            type = "join",
            label = "Joined a community",
            detail = comm?.short ?: id,
            privacy = Privacy.PUBLIC
        )
        _impactEvents.value = listOf(event) + _impactEvents.value

        addNotification(
            title = "Community joined",
            body = "You are now part of ${comm?.short ?: id}.",
            tone = NotificationTone.IMPACT
        )
    }

    fun createRequest(
        title: String,
        category: String,
        need: String,
        why: String,
        amountNeeded: Long?,
        deadlineDays: Int,
        supportTypes: List<SupportType>,
        disclosureLevel: DisclosureLevel,
        audienceScope: AudienceScope,
        disbursementMode: DisbursementMode
    ): String {
        val newId = "r-${uid()}"
        val alias = if (disclosureLevel == DisclosureLevel.SHIELDED_ALIAS) {
            "Verified CoCIS Year 2 Student · #EB-${(100..999).random()}"
        } else {
            "Kizito Fahad (CoCIS Year 2)"
        }
        val newReq = SupportRequest(
            id = newId,
            personId = EdBridgeData.CURRENT_USER_ID,
            title = title.trim(),
            category = category,
            need = need.trim(),
            why = why.trim(),
            amountNeeded = amountNeeded,
            amountRaised = 0L,
            deadlineDays = deadlineDays,
            supporters = 0,
            supportTypes = supportTypes,
            status = VerificationState.PENDING,
            checks = VerificationChecks(identity = true, studentStatus = true, documents = true, humanReview = false),
            createdAt = today(),
            disclosureLevel = disclosureLevel,
            audienceScope = audienceScope,
            disbursementMode = disbursementMode,
            aliasLabel = alias
        )
        _requests.value = listOf(newReq) + _requests.value

        addNotification(
            title = "Request submitted (${disclosureLevel.label})",
            body = "Your request is queued for document verification. Audience: ${audienceScope.label}.",
            tone = NotificationTone.VERIFICATION
        )
        return newId
    }

    fun updateRequestStatus(requestId: String, status: VerificationState) {
        _requests.value = _requests.value.map { r ->
            if (r.id == requestId) {
                r.copy(
                    status = status,
                    checks = r.checks.copy(humanReview = status == VerificationState.VERIFIED)
                )
            } else r
        }

        addNotification(
            title = "Verification updated to ${status.label}",
            body = "Request status updated by human review.",
            tone = NotificationTone.VERIFICATION
        )
    }

    fun toggleSaveOpportunity(opportunityId: String) {
        _savedOpportunities.value = if (_savedOpportunities.value.contains(opportunityId)) {
            _savedOpportunities.value - opportunityId
        } else {
            _savedOpportunities.value + opportunityId
        }
    }

    fun applyOpportunity(opportunityId: String, title: String) {
        if (_appliedOpportunities.value.contains(opportunityId)) return
        _appliedOpportunities.value = _appliedOpportunities.value + opportunityId
        _impactEvents.value = listOf(
            ImpactEvent(
                id = uid(),
                date = today(),
                type = "opportunity",
                label = "Applied with verified profile",
                detail = title,
                privacy = Privacy.PRIVATE
            )
        ) + _impactEvents.value
        addNotification(
            title = "Application sent",
            body = "Your verified Ed-Bridge profile was shared for $title.",
            tone = NotificationTone.OPPORTUNITY
        )
    }

    fun addProofItem(type: String, title: String, fileLabel: String, note: String?) {
        val item = ProofOfImpactItem(
            id = "p-${uid()}",
            studentId = EdBridgeData.CURRENT_USER_ID,
            studentName = "Kizito Fahad",
            type = type,
            title = title,
            date = today(),
            fileLabel = fileLabel,
            note = note,
            verified = false
        )
        _proofItems.value = listOf(item) + _proofItems.value
        addNotification(
            title = "Proof uploaded",
            body = "$title has been uploaded and queued for verification.",
            tone = NotificationTone.IMPACT
        )
    }

    fun markAllNotificationsRead() {
        _notifications.value = _notifications.value.map { it.copy(read = true) }
    }

    private fun addNotification(title: String, body: String, tone: NotificationTone) {
        val notif = AppNotification(
            id = "n-${uid()}",
            title = title,
            body = body,
            at = "Just now",
            read = false,
            tone = tone
        )
        _notifications.value = listOf(notif) + _notifications.value
    }

    fun resetToInitial() {
        _role.value = DemoRole.VISITOR
        _requests.value = EdBridgeData.initialRequests
        _impactEvents.value = EdBridgeData.initialImpact
        _notifications.value = EdBridgeData.initialNotifications
        _joinedCommunities.value = listOf("cocis", "cs", "busia-alumni")
        _connections.value = listOf("p-amina", "p-david", "p-sarah", "p-hassan")
        _mentorships.value = listOf("p-joel")
        _savedOpportunities.value = setOf("o-1")
        _appliedOpportunities.value = emptySet()
        _proofItems.value = EdBridgeData.proofItems
        _onboarded.value = false
    }
}
