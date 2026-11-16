package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.model.*
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.*
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun StudentDashboardScreen(
    viewModel: EdBridgeViewModel,
    onNavigateToDiscover: () -> Unit,
    onNavigateToOpportunities: () -> Unit,
    onNavigateToOnboarding: () -> Unit,
    onOpenSupportDetail: (SupportRequest) -> Unit
) {
    val requests by viewModel.requests.collectAsState()
    val joinedCommunities by viewModel.joinedCommunities.collectAsState()
    val actionState by viewModel.actionState.collectAsState()
    val onboarded by viewModel.onboarded.collectAsState()

    val currentUser = EdBridgeData.peopleMap[EdBridgeData.CURRENT_USER_ID]
    val myRequests = remember(requests) {
        requests.filter { it.personId == EdBridgeData.CURRENT_USER_ID }
    }

    var showCreateDialog by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Student Profile Summary & Dignified CTA
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        UserAvatar(
                            name = currentUser?.name ?: "Kizito Fahad",
                            size = 54.dp,
                            photoKey = currentUser?.photoKey
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = currentUser?.name ?: "Kizito Fahad",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = currentUser?.headline ?: "Computer Science, Year 2 — CoCIS",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Surface(color = SuccessGreenContainer, shape = RoundedCornerShape(50)) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(Icons.Default.Verified, contentDescription = null, tint = OnSuccessGreenContainer, modifier = Modifier.size(13.dp))
                                Text("Trust 88", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = OnSuccessGreenContainer)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Surface(
                        color = ShieldIndigoContainer.copy(alpha = 0.55f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Default.Shield, contentDescription = null, tint = ShieldIndigo, modifier = Modifier.size(18.dp))
                            Text(
                                text = "You control who sees your identity. Choose Shielded Alias to hide your name & photo from classmates while verifying privately.",
                                style = MaterialTheme.typography.bodySmall,
                                color = ShieldIndigo
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { showCreateDialog = true },
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .weight(1f)
                                .defaultMinSize(minHeight = 48.dp)
                                .testTag("create_shielded_request_btn")
                        ) {
                            Icon(Icons.Default.AddCircleOutline, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Create Request", fontWeight = FontWeight.Bold)
                        }
                        OutlinedButton(
                            onClick = onNavigateToOpportunities,
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .weight(1f)
                                .defaultMinSize(minHeight = 48.dp)
                                .testTag("student_find_gigs_btn")
                        ) {
                            Icon(Icons.Default.WorkOutline, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Paid Gigs")
                        }
                    }
                }
            }
        }

        // Student Quick Stats
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                MetricStatCard(
                    label = "My Circles",
                    value = "${joinedCommunities.size}",
                    caption = "CoCIS, CS, Busia SS",
                    icon = Icons.Default.Hub,
                    accentColor = PrimaryBlue,
                    modifier = Modifier.weight(1f)
                )
                MetricStatCard(
                    label = "Active Requests",
                    value = "${myRequests.size}",
                    caption = "Private or circle-scoped",
                    icon = Icons.Default.VisibilityOff,
                    accentColor = ShieldIndigo,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Action Prompt if not yet onboarded
        if (!onboarded) {
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = ConnectionVioletContainer.copy(alpha = 0.45f)),
                    border = BorderStroke(1.dp, ConnectionViolet.copy(alpha = 0.3f))
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(Icons.Default.Badge, contentDescription = null, tint = ConnectionViolet)
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Complete 4-Step Verification", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("Upload Student ID & set your default Shielded Alias level.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        TextButton(onClick = onNavigateToOnboarding) {
                            Text("Start")
                        }
                    }
                }
            }
        }

        // My Requests Section
        item {
            SectionHeader(
                title = "My Support Requests",
                subtitle = "Post milestone updates & thank-you notes to keep alumni engaged"
            )
        }

        if (myRequests.isEmpty()) {
            item {
                EmptyStateCard(
                    icon = Icons.Default.LockPerson,
                    title = "No personal requests yet",
                    subtitle = "Need help with tuition, hostel sustenance, or a laptop? Create a verified request — you can keep your real name hidden from classmates.",
                    actionLabel = "Create Shielded Request",
                    onAction = { showCreateDialog = true }
                )
            }
        } else {
            items(myRequests, key = { it.id }) { req ->
                SupportRequestCard(
                    request = req,
                    onClick = { onOpenSupportDetail(req) }
                )
            }
        }

        // Retention & Pay-It-Forward Loop
        item {
            SectionHeader(
                title = "Why Students Stay Every Week",
                subtitle = "Your circle also unlocks paid work & peer mentoring"
            )
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    RetentionActionRow(
                        icon = Icons.Default.Work,
                        title = "Part-time Campus Data Assistant",
                        subtitle = "UGX 220,000/mo · Matched to your CoCIS profile",
                        actionText = "View Gigs",
                        onClick = onNavigateToOpportunities
                    )
                    HorizontalDivider()
                    RetentionActionRow(
                        icon = Icons.Default.People,
                        title = "You Mentor Joel T. (Year 1)",
                        subtitle = "Pay it forward — logging mentorship boosts your Trust Score",
                        actionText = "Circle",
                        onClick = onNavigateToDiscover
                    )
                }
            }
        }
    }

    if (showCreateDialog) {
        CreateDignifiedRequestDialog(
            isLoading = actionState.isLoading,
            onDismiss = { if (!actionState.isLoading) showCreateDialog = false },
            onSubmit = { title, category, need, why, amount, days, types, disclosure, audience, disbursement ->
                viewModel.createSupportRequest(
                    title = title,
                    category = category,
                    need = need,
                    why = why,
                    amountNeeded = amount,
                    deadlineDays = days,
                    supportTypes = types,
                    disclosureLevel = disclosure,
                    audienceScope = audience,
                    disbursementMode = disbursement,
                    onSuccess = { newId ->
                        showCreateDialog = false
                        viewModel.requests.value.find { it.id == newId }?.let(onOpenSupportDetail)
                    }
                )
            }
        )
    }
}

@Composable
private fun RetentionActionRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    actionText: String,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Surface(color = PrimaryBlueContainer, shape = RoundedCornerShape(10.dp)) {
            Icon(icon, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.padding(8.dp).size(18.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            Text(subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        TextButton(onClick = onClick) {
            Text(actionText, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun CreateDignifiedRequestDialog(
    isLoading: Boolean,
    onDismiss: () -> Unit,
    onSubmit: (
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
    ) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Tuition") }
    var need by remember { mutableStateOf("") }
    var why by remember { mutableStateOf("") }
    var amountText by remember { mutableStateOf("350000") }
    var disclosure by remember { mutableStateOf(DisclosureLevel.SHIELDED_ALIAS) }
    var audience by remember { mutableStateOf(AudienceScope.ALUMNI_MENTORS_ONLY) }
    var disbursement by remember { mutableStateOf(DisbursementMode.DIRECT_BURSAR) }
    var selectedTypes by remember { mutableStateOf(setOf(SupportType.FINANCIAL, SupportType.MENTORSHIP)) }
    var showPeerPreview by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Default.Shield, contentDescription = null, tint = ShieldIndigo)
                Text("New Dignified Request", fontWeight = FontWeight.Bold)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .heightIn(max = 470.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Live Peer vs Alumni Visibility Preview
                Surface(
                    color = ShieldIndigoContainer.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (showPeerPreview) "Preview: What Classmates See" else "Preview: What Alumni See",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = ShieldIndigo
                            )
                            TextButton(
                                onClick = { showPeerPreview = !showPeerPreview },
                                contentPadding = PaddingValues(horizontal = 6.dp, vertical = 0.dp)
                            ) {
                                Text("Switch View", fontSize = 11.sp)
                            }
                        }
                        val previewText = when {
                            showPeerPreview && audience == AudienceScope.ALUMNI_MENTORS_ONLY ->
                                "HIDDEN FROM CLASSMATES. Current students will never see this request in their feed."
                            disclosure == DisclosureLevel.SHIELDED_ALIAS ->
                                "Shown as \"Verified CoCIS Year 2 Student · #EB-219\" — real name & photo hidden."
                            disclosure == DisclosureLevel.CIRCLE_TRUSTED ->
                                "Shown as \"Kizito Fahad\" only inside verified CoCIS & Busia SS circles."
                            else -> "Shown with your verified name across the Ed-Bridge network."
                        }
                        Text(previewText, fontSize = 11.sp, color = ShieldIndigo)
                    }
                }

                Text("1. Identity Privacy Tier", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                DisclosureLevel.entries.forEach { level ->
                    FilterChip(
                        selected = disclosure == level,
                        onClick = { disclosure = level },
                        label = { Text("${level.label}: ${level.subtitle}", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Text("2. Audience Scope", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                AudienceScope.entries.forEach { scope ->
                    FilterChip(
                        selected = audience == scope,
                        onClick = { audience = scope },
                        label = { Text(scope.label, fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Text("3. Direct Settlement Mode", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                DisbursementMode.entries.forEach { mode ->
                    FilterChip(
                        selected = disbursement == mode,
                        onClick = { disbursement = mode },
                        label = { Text(mode.label, fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Text("4. Request Details", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Tuition", "Accommodation", "Laptop / Equipment", "Mentorship").forEach { cat ->
                        FilterChip(
                            selected = category == cat,
                            onClick = { category = cat },
                            label = { Text(cat, fontSize = 10.sp) }
                        )
                    }
                }

                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it; error = null },
                    label = { Text("Request Title") },
                    placeholder = { Text("e.g., Semester 2 Exam Permit Balance") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("new_request_title_input")
                )

                OutlinedTextField(
                    value = need,
                    onValueChange = { need = it; error = null },
                    label = { Text("Exact Need (1 line)") },
                    placeholder = { Text("Direct bursar invoice balance due in 10 days") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("new_request_need_input")
                )

                OutlinedTextField(
                    value = why,
                    onValueChange = { why = it; error = null },
                    label = { Text("Context (keep private details minimal)") },
                    placeholder = { Text("Brief academic standing & how this helps you finish exams (20+ chars)") },
                    minLines = 2,
                    modifier = Modifier.fillMaxWidth().testTag("new_request_why_input")
                )

                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it.filter { c -> c.isDigit() } },
                    label = { Text("Target Amount UGX (optional for mentorship)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                if (error != null) {
                    Text(error!!, color = ErrorRed, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        },
        confirmButton = {
            Button(
                enabled = !isLoading,
                onClick = {
                    if (title.trim().length < 5) {
                        error = "Title must be at least 5 characters."
                        return@Button
                    }
                    if (need.trim().length < 5) {
                        error = "Please summarize the exact need."
                        return@Button
                    }
                    if (why.trim().length < 20) {
                        error = "Context must be at least 20 characters for reviewers."
                        return@Button
                    }
                    val amt = amountText.toLongOrNull()?.takeIf { it > 0L }
                    onSubmit(
                        title,
                        category,
                        need,
                        why,
                        amt,
                        14,
                        selectedTypes.toList(),
                        disclosure,
                        audience,
                        disbursement
                    )
                },
                modifier = Modifier.testTag("submit_new_request_btn")
            ) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp, color = Color.White)
                    Spacer(modifier = Modifier.width(6.dp))
                }
                Text(if (isLoading) "Submitting..." else "Submit Privately")
            }
        },
        dismissButton = {
            TextButton(enabled = !isLoading, onClick = onDismiss) { Text("Cancel") }
        }
    )
}
