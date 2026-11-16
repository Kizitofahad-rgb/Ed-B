package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SupportDetailScreen(
    requestId: String,
    viewModel: EdBridgeViewModel,
    onBack: () -> Unit
) {
    val requests by viewModel.requests.collectAsState()
    val actionState by viewModel.actionState.collectAsState()
    val request = remember(requests, requestId) { requests.find { it.id == requestId } }

    if (request == null) {
        Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
            EmptyStateCard(
                icon = Icons.Default.SearchOff,
                title = "Request unavailable",
                subtitle = "This support request may have been removed or archived.",
                actionLabel = "Go back",
                onAction = onBack
            )
        }
        return
    }

    val person = EdBridgeData.peopleMap[request.personId]
    val isShielded = request.disclosureLevel == DisclosureLevel.SHIELDED_ALIAS
    val displayName = if (isShielded) request.aliasLabel else (person?.name ?: request.aliasLabel)

    var showFinancialSheet by remember { mutableStateOf(false) }
    var selectedNonCashType by remember { mutableStateOf<SupportType?>(null) }
    var showPostUpdateDialog by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(actionState.lastSuccessMessage) {
        actionState.lastSuccessMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearActionMessages()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (isShielded) "Shielded Request" else "Support Request",
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.testTag("detail_back_btn")
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    TextButton(
                        onClick = { showPostUpdateDialog = true },
                        modifier = Modifier.testTag("detail_post_update_btn")
                    ) {
                        Icon(Icons.Default.Campaign, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Post Update")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Identity & Privacy Card
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            UserAvatar(
                                name = displayName,
                                size = 54.dp,
                                isShielded = isShielded,
                                photoKey = if (isShielded) null else person?.photoKey
                            )
                            Column(modifier = Modifier.weight(1f)) {
                                Text(displayName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                                Text(
                                    text = if (isShielded) "Identity protected by Ed-Bridge Shield · ${request.audienceScope.label}" else (person?.headline ?: "Makerere University"),
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            StatusBadge(status = request.status)
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            ShieldedIdentityBadge(disclosureLevel = request.disclosureLevel)
                            DisbursementPill(mode = request.disbursementMode)
                        }

                        if (isShielded) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Surface(
                                color = ShieldIndigoContainer.copy(alpha = 0.55f),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(Icons.Default.Lock, contentDescription = null, tint = ShieldIndigo, modifier = Modifier.size(16.dp))
                                    Text(
                                        text = "Student ID, fee invoice, and academic standing were verified privately by Ed-Bridge staff. Classmates cannot see this student's real name.",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = ShieldIndigo
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Text(request.title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.ExtraBold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(request.need, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurface)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(request.why, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)

                        if (!request.matchingSponsor.isNullOrBlank()) {
                            Spacer(modifier = Modifier.height(10.dp))
                            MatchingSponsorStrip(text = request.matchingSponsor)
                        }

                        if (request.amountNeeded != null && request.amountNeeded > 0) {
                            val raised = request.amountRaised ?: 0L
                            val pct = (raised.toFloat() / request.amountNeeded.toFloat()).coerceIn(0f, 1f)
                            Spacer(modifier = Modifier.height(14.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = EdBridgeData.formatUgx(raised),
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = PrimaryBlue
                                )
                                Text(
                                    text = "Target ${EdBridgeData.formatUgx(request.amountNeeded)} (${(pct * 100).toInt()}%)",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            LinearProgressIndicator(
                                progress = { pct },
                                modifier = Modifier.fillMaxWidth().height(10.dp).clip(RoundedCornerShape(50)),
                                color = if (pct >= 1f) SuccessGreen else PrimaryBlue,
                                trackColor = MaterialTheme.colorScheme.surfaceVariant
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "${request.supporters} verified supporters · ${request.deadlineDays} days left",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // Verification 4-Check Card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("4-Step Verification Trail", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))
                        CheckRow("University identity & student number", request.checks.identity)
                        CheckRow("Current semester enrollment standing", request.checks.studentStatus)
                        CheckRow("Official bursar invoice / hostel quote", request.checks.documents)
                        CheckRow("Human reviewer sign-off", request.checks.humanReview)
                    }
                }
            }

            // Ways to Support (Cash + Non-Cash)
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Choose How to Help", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text(
                            text = "Every action — cash or non-cash — writes a verified entry to your Impact Passport.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        if (request.amountNeeded != null) {
                            Button(
                                onClick = { showFinancialSheet = true },
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .defaultMinSize(minHeight = 50.dp)
                                    .testTag("open_financial_support_btn")
                            ) {
                                Icon(Icons.Default.AccountBalance, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Settle via ${request.disbursementMode.badge}", fontWeight = FontWeight.Bold)
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }

                        val nonFinancialTypes = listOf(
                            SupportType.MENTORSHIP to "Offer 1-on-1 Mentorship",
                            SupportType.RESOURCE to "Lend Laptop / Textbooks",
                            SupportType.OPPORTUNITY to "Refer Paid Gig / Internship",
                            SupportType.REFERRAL to "Make Warm Alumni Referral",
                            SupportType.AMPLIFICATION to "Amplify to Alumni Circle"
                        )

                        nonFinancialTypes.forEach { (type, label) ->
                            OutlinedButton(
                                onClick = { selectedNonCashType = type },
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .defaultMinSize(minHeight = 48.dp)
                                    .testTag("offer_${type.name.lowercase()}_btn")
                            ) {
                                Text(label, modifier = Modifier.weight(1f))
                                Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }

            // Milestones & Student Updates / Gratitude Timeline
            item {
                SectionHeader(
                    title = "Milestones & Student Updates",
                    subtitle = "How updates & gratitude build ongoing attachment",
                    actionLabel = "Add update",
                    onActionClick = { showPostUpdateDialog = true }
                )
            }

            if (request.updates.isEmpty()) {
                item {
                    EmptyStateCard(
                        icon = Icons.Default.Timeline,
                        title = "No milestone updates yet",
                        subtitle = "Milestones trigger automatically at 50%, 75%, and 100%, or the student can post a progress note.",
                        actionLabel = "Post update now",
                        onAction = { showPostUpdateDialog = true }
                    )
                }
            } else {
                items(request.updates, key = { it.id }) { update ->
                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (update.isGratitude) ConnectionVioletContainer.copy(alpha = 0.35f) else MaterialTheme.colorScheme.surface
                        ),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    color = if (update.isGratitude) ConnectionViolet else PrimaryBlue,
                                    shape = RoundedCornerShape(50)
                                ) {
                                    Text(
                                        text = update.milestoneTag,
                                        color = Color.White,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }
                                Text(update.date, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(update.authorLabel, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(update.message, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
    }

    // Financial Support Modal (Simulated Direct Bursar / MoMo Settlement)
    if (showFinancialSheet) {
        FinancialSupportDialog(
            request = request,
            isLoading = actionState.isLoading,
            errorMessage = actionState.errorMessage,
            onDismiss = {
                viewModel.clearActionMessages()
                showFinancialSheet = false
            },
            onConfirm = { amount, privacy, rail, note ->
                viewModel.submitFinancialSupport(
                    requestId = request.id,
                    amount = amount,
                    privacy = privacy,
                    paymentRail = rail,
                    encouragementNote = note,
                    onComplete = { showFinancialSheet = false }
                )
            }
        )
    }

    // Non-Financial Support Dialog
    selectedNonCashType?.let { type ->
        NonCashSupportDialog(
            type = type,
            isLoading = actionState.isLoading,
            onDismiss = { selectedNonCashType = null },
            onConfirm = { privacy, note ->
                viewModel.submitNonFinancialSupport(
                    requestId = request.id,
                    type = type,
                    privacy = privacy,
                    note = note,
                    onComplete = { selectedNonCashType = null }
                )
            }
        )
    }

    // Post Milestone / Thank-You Update Dialog
    if (showPostUpdateDialog) {
        PostUpdateDialog(
            onDismiss = { showPostUpdateDialog = false },
            onPost = { tag, msg, isGratitude ->
                viewModel.repository.postRequestUpdate(request.id, tag, msg, isGratitude)
                showPostUpdateDialog = false
            }
        )
    }
}

@Composable
private fun CheckRow(label: String, checked: Boolean) {
    Row(
        modifier = Modifier.padding(vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(
            imageVector = if (checked) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
            contentDescription = null,
            tint = if (checked) SuccessGreen else MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(18.dp)
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
private fun FinancialSupportDialog(
    request: SupportRequest,
    isLoading: Boolean,
    errorMessage: String?,
    onDismiss: () -> Unit,
    onConfirm: (Long, Privacy, String, String) -> Unit
) {
    var amountText by remember { mutableStateOf("50000") }
    var rail by remember { mutableStateOf("Direct Bursar (MTN MoMo)") }
    var privacy by remember { mutableStateOf(Privacy.RECOGNIZED) }
    var note by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = { if (!isLoading) onDismiss() },
        title = { Text("Direct Verified Settlement", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "Simulated checkout: funds settle directly to ${request.disbursementMode.label}.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf(10000L to "10k", 25000L to "25k", 50000L to "50k", 100000L to "100k").forEach { (v, lbl) ->
                        FilterChip(
                            selected = amountText == v.toString(),
                            onClick = { amountText = v.toString() },
                            label = { Text(lbl) }
                        )
                    }
                }

                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it.filter { ch -> ch.isDigit() } },
                    label = { Text("Amount (UGX)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("financial_amount_input")
                )

                Text("Settlement Rail", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    listOf("Direct Bursar (MTN MoMo)", "Direct Bursar (Airtel Money)", "Card / Alumni Bank").forEach { option ->
                        FilterChip(
                            selected = rail == option,
                            onClick = { rail = option },
                            label = { Text(option, fontSize = 12.sp) },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }

                OutlinedTextField(
                    value = note,
                    onValueChange = { note = it },
                    label = { Text("Encouragement note (optional)") },
                    placeholder = { Text("Focus on your exams — we've got your back.") },
                    maxLines = 2,
                    modifier = Modifier.fillMaxWidth()
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Keep my name private", style = MaterialTheme.typography.bodySmall)
                    Switch(
                        checked = privacy == Privacy.PRIVATE,
                        onCheckedChange = { privacy = if (it) Privacy.PRIVATE else Privacy.RECOGNIZED }
                    )
                }

                if (!errorMessage.isNullOrBlank()) {
                    Text(errorMessage, color = ErrorRed, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        },
        confirmButton = {
            Button(
                enabled = !isLoading,
                onClick = {
                    val amt = amountText.toLongOrNull() ?: 0L
                    onConfirm(amt, privacy, rail, note)
                },
                modifier = Modifier.testTag("confirm_financial_support_btn")
            ) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(if (isLoading) "Settling..." else "Confirm Settlement")
            }
        },
        dismissButton = {
            TextButton(enabled = !isLoading, onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun NonCashSupportDialog(
    type: SupportType,
    isLoading: Boolean,
    onDismiss: () -> Unit,
    onConfirm: (Privacy, String) -> Unit
) {
    var note by remember { mutableStateOf("") }
    var privacy by remember { mutableStateOf(Privacy.RECOGNIZED) }

    AlertDialog(
        onDismissRequest = { if (!isLoading) onDismiss() },
        title = { Text("Offer ${type.label}", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "Describe how you can help. Your contribution is logged on your Verified Impact Passport.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                OutlinedTextField(
                    value = note,
                    onValueChange = { note = it },
                    label = { Text("Your offer or message") },
                    placeholder = { Text("e.g., Happy to review your CV & host a 30-min mock interview") },
                    minLines = 2,
                    modifier = Modifier.fillMaxWidth().testTag("non_cash_note_input")
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Recognized in Impact Passport", style = MaterialTheme.typography.bodySmall)
                    Switch(
                        checked = privacy != Privacy.PRIVATE,
                        onCheckedChange = { privacy = if (it) Privacy.RECOGNIZED else Privacy.PRIVATE }
                    )
                }
            }
        },
        confirmButton = {
            Button(
                enabled = !isLoading,
                onClick = { onConfirm(privacy, note) },
                modifier = Modifier.testTag("confirm_non_cash_support_btn")
            ) {
                Text(if (isLoading) "Saving..." else "Send Offer")
            }
        },
        dismissButton = {
            TextButton(enabled = !isLoading, onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun PostUpdateDialog(
    onDismiss: () -> Unit,
    onPost: (String, String, Boolean) -> Unit
) {
    var tag by remember { mutableStateOf("Thank-You Update") }
    var message by remember { mutableStateOf("") }
    var isGratitude by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Share Progress or Thank You", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Thank-You Update" to true, "Exam Progress" to false, "Receipt Ready" to false).forEach { (label, grat) ->
                        FilterChip(
                            selected = tag == label,
                            onClick = {
                                tag = label
                                isGratitude = grat
                            },
                            label = { Text(label, fontSize = 11.sp) }
                        )
                    }
                }
                OutlinedTextField(
                    value = message,
                    onValueChange = {
                        message = it
                        error = null
                    },
                    label = { Text("Update for your circle") },
                    placeholder = { Text("Share an academic milestone or thank alumni supporters…") },
                    minLines = 3,
                    modifier = Modifier.fillMaxWidth().testTag("post_update_message_input")
                )
                if (error != null) {
                    Text(error!!, color = ErrorRed, fontSize = 12.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (message.trim().length < 10) {
                        error = "Please enter at least 10 characters."
                    } else {
                        onPost(tag, message.trim(), isGratitude)
                    }
                },
                modifier = Modifier.testTag("submit_post_update_btn")
            ) {
                Text("Publish Update")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
