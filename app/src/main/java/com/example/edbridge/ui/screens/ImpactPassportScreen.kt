package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.model.Privacy
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.components.TrustScoreRingCanvas
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun ImpactPassportScreen(
    viewModel: EdBridgeViewModel
) {
    val events by viewModel.impactEvents.collectAsState()
    val proofItems by viewModel.proofItems.collectAsState()
    val streakMonths by viewModel.supporterStreakMonths.collectAsState()

    var hidePublicIdentity by remember { mutableStateOf(true) }
    var showUploadDialog by remember { mutableStateOf(false) }

    val trustScore = remember(events.size, proofItems.size) {
        (82 + events.size * 2).coerceAtMost(99)
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Verified Impact Passport Header
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        TrustScoreRingCanvas(score = trustScore)
                        Column(modifier = Modifier.weight(1f)) {
                            Surface(color = SuccessGreenContainer, shape = RoundedCornerShape(50)) {
                                Text(
                                    text = "VERIFIED IMPACT PASSPORT",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = OnSuccessGreenContainer,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "${events.size} Verified Actions",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Text(
                                text = "$streakMonths-month consistency streak · Includes financial, mentorship, resource & referral entries.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Surface(
                        color = ShieldIndigoContainer.copy(alpha = 0.55f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.VisibilityOff, contentDescription = null, tint = ShieldIndigo, modifier = Modifier.size(16.dp))
                                Column {
                                    Text("Private Public-Ledger Mode", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = ShieldIndigo)
                                    Text("Show impact counts without exposing your full name publicly", fontSize = 11.sp, color = ShieldIndigo.copy(alpha = 0.8f))
                                }
                            }
                            Switch(
                                checked = hidePublicIdentity,
                                onCheckedChange = { hidePublicIdentity = it },
                                modifier = Modifier.testTag("passport_privacy_switch")
                            )
                        }
                    }
                }
            }
        }

        // Contribution Consistency Heatmap (26-week mini grid)
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Consistency Heatmap (18 Weeks)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Active", fontSize = 11.sp, color = SuccessGreen, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        for (row in 0 until 4) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                for (col in 0 until 18) {
                                    val intensity = ((row * 7 + col * 3 + events.size) % 4)
                                    val cellColor = when (intensity) {
                                        0 -> MaterialTheme.colorScheme.surfaceVariant
                                        1 -> PrimaryBlue.copy(alpha = 0.25f)
                                        2 -> PrimaryBlue.copy(alpha = 0.55f)
                                        else -> PrimaryBlue
                                    }
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(12.dp)
                                            .clip(RoundedCornerShape(3.dp))
                                            .background(cellColor)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Proof of Impact Section (Bursar receipts & transcripts)
        item {
            SectionHeader(
                title = "Proof of Impact Receipts",
                subtitle = "Direct bursar & hostel receipts verifying funds reached their goal",
                actionLabel = "Upload",
                onActionClick = { showUploadDialog = true }
            )
        }

        items(proofItems, key = { it.id }) { proof ->
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Surface(
                        color = if (proof.verified) SuccessGreenContainer else WarningAmberContainer,
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(
                            imageVector = if (proof.verified) Icons.Default.Verified else Icons.Default.PendingActions,
                            contentDescription = null,
                            tint = if (proof.verified) OnSuccessGreenContainer else OnWarningAmberContainer,
                            modifier = Modifier.padding(8.dp).size(18.dp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(proof.title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(
                            text = "${proof.studentName} · ${proof.fileLabel}",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        if (proof.amountVerified != null) {
                            Text(
                                text = "Settled: ${EdBridgeData.formatUgx(proof.amountVerified)}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryBlue
                            )
                        }
                        if (!proof.note.isNullOrBlank()) {
                            Text(proof.note, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }

        // Chronological Impact Timeline
        item {
            SectionHeader(
                title = "Impact Activity Ledger",
                subtitle = "Chronological log across your circles"
            )
        }

        items(events, key = { it.id }) { event ->
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Surface(color = PrimaryBlueContainer, shape = RoundedCornerShape(10.dp)) {
                        Icon(
                            imageVector = when (event.type) {
                                "financial" -> Icons.Default.AccountBalance
                                "mentorship" -> Icons.Default.School
                                "resource" -> Icons.Default.Laptop
                                "opportunity" -> Icons.Default.Work
                                else -> Icons.Default.Favorite
                            },
                            contentDescription = null,
                            tint = PrimaryBlue,
                            modifier = Modifier.padding(8.dp).size(18.dp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(event.label, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(
                            text = if (hidePublicIdentity && event.privacy == Privacy.PUBLIC) {
                                "${event.detail} · Identity Shielded"
                            } else event.detail,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(event.date, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(event.privacy.label, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = PrimaryBlue)
                    }
                }
            }
        }
    }

    if (showUploadDialog) {
        UploadProofDialog(
            onDismiss = { showUploadDialog = false },
            onUpload = { title, fileLabel, note ->
                viewModel.repository.addProofItem("fee_receipt", title, fileLabel, note)
                showUploadDialog = false
            }
        )
    }
}

@Composable
private fun UploadProofDialog(
    onDismiss: () -> Unit,
    onUpload: (String, String, String?) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var fileLabel by remember { mutableStateOf("Makerere_Bursar_Receipt.pdf") }
    var note by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Upload Proof of Impact", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it; error = null },
                    label = { Text("Receipt or Milestone Title") },
                    placeholder = { Text("e.g., Semester 2 Exam Permit Cleared") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("proof_title_input")
                )
                OutlinedTextField(
                    value = fileLabel,
                    onValueChange = { fileLabel = it },
                    label = { Text("Document Filename") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = note,
                    onValueChange = { note = it },
                    label = { Text("Note for Supporters (optional)") },
                    maxLines = 2,
                    modifier = Modifier.fillMaxWidth()
                )
                if (error != null) {
                    Text(error!!, color = ErrorRed, fontSize = 12.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.trim().length < 4) {
                        error = "Enter a descriptive title."
                    } else {
                        onUpload(title.trim(), fileLabel.ifBlank { "Receipt.pdf" }, note.takeIf { it.isNotBlank() })
                    }
                },
                modifier = Modifier.testTag("submit_proof_btn")
            ) {
                Text("Submit Proof")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
