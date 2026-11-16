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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.model.AudienceScope
import com.example.edbridge.data.model.SupportRequest
import com.example.edbridge.data.model.SupportType
import com.example.edbridge.data.model.VerificationState
import com.example.edbridge.ui.components.EmptyStateCard
import com.example.edbridge.ui.components.MetricStatCard
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.components.SupportRequestCard
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun SupporterDashboardScreen(
    viewModel: EdBridgeViewModel,
    onNavigateToImpact: () -> Unit,
    onOpenSupportDetail: (SupportRequest) -> Unit
) {
    val requests by viewModel.requests.collectAsState()
    val streakMonths by viewModel.supporterStreakMonths.collectAsState()
    val impactEvents by viewModel.impactEvents.collectAsState()

    var activeFilter by remember { mutableStateOf("All Verified") }
    val filters = listOf("All Verified", "Alumni Match 1:1", "Urgent (<=10d)", "Alumni-Only Shielded", "Mentorship", "Equipment")

    val filtered = remember(requests, activeFilter) {
        val verified = requests.filter { it.status == VerificationState.VERIFIED }
        when (activeFilter) {
            "Alumni Match 1:1" -> verified.filter { !it.matchingSponsor.isNullOrBlank() }
            "Urgent (<=10d)" -> verified.filter { it.deadlineDays <= 10 }
            "Alumni-Only Shielded" -> verified.filter { it.audienceScope == AudienceScope.ALUMNI_MENTORS_ONLY }
            "Mentorship" -> verified.filter { it.supportTypes.contains(SupportType.MENTORSHIP) }
            "Equipment" -> verified.filter { it.supportTypes.contains(SupportType.RESOURCE) }
            else -> verified
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Supporter Consistency Streak Banner (GoFundMe-inspired retention loop)
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryBlueContainer.copy(alpha = 0.5f)),
                border = BorderStroke(1.dp, PrimaryBlue.copy(alpha = 0.28f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(color = PrimaryBlue, shape = RoundedCornerShape(12.dp)) {
                            Icon(
                                Icons.Default.LocalFireDepartment,
                                contentDescription = "Consistency streak",
                                tint = Color.White,
                                modifier = Modifier.padding(10.dp).size(22.dp)
                            )
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "$streakMonths-Month Consistency Streak",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.ExtraBold,
                                color = OnPrimaryBlueContainer
                            )
                            Text(
                                text = "You've backed ${impactEvents.size} verified actions across CoCIS & Busia SS circles.",
                                style = MaterialTheme.typography.bodySmall,
                                color = OnPrimaryBlueContainer.copy(alpha = 0.85f)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        MetricStatCard(
                            label = "Impact Actions",
                            value = "${impactEvents.size}",
                            caption = "Cash + Mentorship",
                            icon = Icons.Default.EmojiEvents,
                            accentColor = SuccessGreen,
                            modifier = Modifier.weight(1f)
                        )
                        MetricStatCard(
                            label = "Matched Pools",
                            value = "2 Active",
                            caption = "Doubles your UGX",
                            icon = Icons.Default.AutoAwesome,
                            accentColor = ConnectionViolet,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedButton(
                        onClick = onNavigateToImpact,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 48.dp)
                    ) {
                        Icon(Icons.Default.VerifiedUser, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Open My Verified Impact Passport")
                    }
                }
            }
        }

        item {
            SectionHeader(
                title = "Students Ready for Support",
                subtitle = "Every invoice & enrollment is checked before appearing here"
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(filters) { filter ->
                    FilterChip(
                        selected = activeFilter == filter,
                        onClick = { activeFilter = filter },
                        label = { Text(filter) },
                        modifier = Modifier.testTag("supporter_filter_${filter.lowercase().replace(" ", "_")}")
                    )
                }
            }
        }

        if (filtered.isEmpty()) {
            item {
                EmptyStateCard(
                    icon = Icons.Default.SearchOff,
                    title = "No requests in \"$activeFilter\"",
                    subtitle = "Switch back to All Verified to browse students seeking direct bursar settlement or mentorship.",
                    actionLabel = "Show All Verified",
                    onAction = { activeFilter = "All Verified" }
                )
            }
        } else {
            items(filtered, key = { it.id }) { req ->
                SupportRequestCard(
                    request = req,
                    onClick = { onOpenSupportDetail(req) }
                )
            }
        }
    }
}
