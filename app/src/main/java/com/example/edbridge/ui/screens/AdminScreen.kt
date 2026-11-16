package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.model.SupportRequest
import com.example.edbridge.data.model.VerificationState
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.EmptyStateCard
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.components.ShieldedIdentityBadge
import com.example.edbridge.ui.components.StatusBadge
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun AdminScreen(
    viewModel: EdBridgeViewModel
) {
    val requests by viewModel.requests.collectAsState()
    var filterStatus by remember { mutableStateOf<VerificationState?>(VerificationState.PENDING) }
    var inspectedRequest by remember { mutableStateOf<SupportRequest?>(null) }

    val filtered = remember(requests, filterStatus) {
        if (filterStatus == null) requests else requests.filter { it.status == filterStatus }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionHeader(
                title = "Human Verification Queue",
                subtitle = "Inspect private student IDs & bursar invoices before requests go live"
            )
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    FilterChip(
                        selected = filterStatus == null,
                        onClick = { filterStatus = null },
                        label = { Text("All (${requests.size})") }
                    )
                }
                items(VerificationState.entries) { state ->
                    val count = requests.count { it.status == state }
                    FilterChip(
                        selected = filterStatus == state,
                        onClick = { filterStatus = state },
                        label = { Text("${state.label} ($count)") }
                    )
                }
            }
        }

        if (filtered.isEmpty()) {
            item {
                EmptyStateCard(
                    icon = Icons.Default.CheckCircle,
                    title = "Queue cleared",
                    subtitle = "No requests currently have status \"${filterStatus?.label ?: "All"}\".",
                    actionLabel = "Show All Requests",
                    onAction = { filterStatus = null }
                )
            }
        } else {
            items(filtered, key = { it.id }) { req ->
                val person = EdBridgeData.peopleMap[req.personId]
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                    modifier = Modifier.fillMaxWidth().testTag("admin_req_card_${req.id}")
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(person?.name ?: req.aliasLabel, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("Public display: ${req.aliasLabel}", fontSize = 11.sp, color = ShieldIndigo)
                            }
                            StatusBadge(status = req.status)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        ShieldedIdentityBadge(disclosureLevel = req.disclosureLevel)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(req.title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                        Text(req.need, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = { inspectedRequest = req },
                                modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                            ) {
                                Icon(Icons.Default.Description, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Inspect Docs", fontSize = 12.sp)
                            }
                            Button(
                                onClick = { viewModel.repository.updateRequestStatus(req.id, VerificationState.VERIFIED) },
                                enabled = req.status != VerificationState.VERIFIED,
                                modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp).testTag("admin_verify_${req.id}")
                            ) {
                                Text("Verify", fontSize = 12.sp)
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            TextButton(
                                onClick = { viewModel.repository.updateRequestStatus(req.id, VerificationState.NEEDS_INFO) },
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Needs Info", fontSize = 12.sp, color = WarningAmber)
                            }
                            TextButton(
                                onClick = { viewModel.repository.updateRequestStatus(req.id, VerificationState.REJECTED) },
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Reject", fontSize = 12.sp, color = ErrorRed)
                            }
                        }
                    }
                }
            }
        }
    }

    inspectedRequest?.let { req ->
        val person = EdBridgeData.peopleMap[req.personId]
        AlertDialog(
            onDismissRequest = { inspectedRequest = null },
            title = { Text("Confidential Reviewer File", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Real Identity (Private): ${person?.name ?: "Student"}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Text("Public Shield Label: ${req.aliasLabel}", fontSize = 12.sp, color = ShieldIndigo)
                    Text("Audience Scope: ${req.audienceScope.label}", fontSize = 12.sp)
                    Text("Settlement Mode: ${req.disbursementMode.label}", fontSize = 12.sp)
                    HorizontalDivider()
                    Text("• Makerere Student ID: Verified (Active Sem 2)", fontSize = 12.sp)
                    Text("• Bursar / Vendor Quote: Attached & matched", fontSize = 12.sp)
                    Text("• Classmate Privacy: Protected (Never leaked publicly)", fontSize = 12.sp, color = SuccessGreen)
                }
            },
            confirmButton = {
                Button(onClick = {
                    viewModel.repository.updateRequestStatus(req.id, VerificationState.VERIFIED)
                    inspectedRequest = null
                }) {
                    Text("Approve & Verify")
                }
            },
            dismissButton = {
                TextButton(onClick = { inspectedRequest = null }) { Text("Close") }
            }
        )
    }
}
