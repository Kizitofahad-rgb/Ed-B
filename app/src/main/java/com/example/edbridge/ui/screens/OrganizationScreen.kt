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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.MetricStatCard
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun OrganizationScreen(
    viewModel: EdBridgeViewModel
) {
    val proofItems by viewModel.proofItems.collectAsState()
    var matchingPoolActive by remember { mutableStateOf(true) }
    var showAuditPreview by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // B2B SaaS Header Banner (Why Organizations Would Pay - 2-Min Test #8)
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Surface(color = PrimaryBlueContainer, shape = RoundedCornerShape(50)) {
                        Text(
                            text = "ED-BRIDGE FOR ORGANIZATIONS · B2B SAAS",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = OnPrimaryBlueContainer,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Turn alumni dues & scholarships into auditable outcomes.",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Alumni associations, foundations, and HR teams pay for cohort verification, 1:1 matching pools, direct-to-bursar audit trails, and verified talent pipelines.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        MetricStatCard(
                            label = "Students Reached",
                            value = "696",
                            caption = "Across 3 partner orgs",
                            icon = Icons.Default.Groups,
                            accentColor = PrimaryBlue,
                            modifier = Modifier.weight(1f)
                        )
                        MetricStatCard(
                            label = "Bursar Audit Rate",
                            value = "100%",
                            caption = "Zero unverified payouts",
                            icon = Icons.Default.ReceiptLong,
                            accentColor = SuccessGreen,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Paid SaaS Tool 1: Matching Pool Toggle
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("1:1 Alumni Matching Pool", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Automatically match alumni gifts up to UGX 100k per verified student", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Switch(
                            checked = matchingPoolActive,
                            onCheckedChange = { matchingPoolActive = it },
                            modifier = Modifier.testTag("org_matching_pool_switch")
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = { showAuditPreview = true },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 48.dp).testTag("export_audit_trail_btn")
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Preview Donor Audit & Receipt Ledger (${proofItems.size})")
                    }
                }
            }
        }

        // Partner Organizations & SaaS Plans
        item {
            SectionHeader(
                title = "Active Partner Organizations",
                subtitle = "Tiered Pro & Enterprise Cohort plans"
            )
        }

        items(EdBridgeData.organizations, key = { it.id }) { org ->
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
                        Column(modifier = Modifier.weight(1f)) {
                            Text(org.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                            Text(org.kind, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Surface(color = ConnectionVioletContainer, shape = RoundedCornerShape(50)) {
                            Text(
                                text = org.planTier,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = OnConnectionVioletContainer,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(org.blurb, style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "${org.studentsReached} students reached · ${org.campaigns} campaigns · ${org.mentorshipSessions} mentoring sessions",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PrimaryBlue
                    )
                }
            }
        }
    }

    if (showAuditPreview) {
        AlertDialog(
            onDismissRequest = { showAuditPreview = false },
            title = { Text("Direct Settlement Audit Ledger", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Board-ready ledger proving every shilling settled directly to a verified university or hostel account.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    HorizontalDivider()
                    proofItems.take(4).forEach { item ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.title, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Text("${item.studentName} · ${item.date}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Text(
                                text = item.amountVerified?.let { EdBridgeData.formatUgx(it) } ?: "Doc Verified",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = SuccessGreen
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = { showAuditPreview = false }) { Text("Done") }
            }
        )
    }
}
