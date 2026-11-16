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
import com.example.edbridge.data.model.Opportunity
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.EmptyStateCard
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun OpportunitiesScreen(
    viewModel: EdBridgeViewModel
) {
    val savedIds by viewModel.savedOpportunities.collectAsState()
    val appliedIds by viewModel.appliedOpportunities.collectAsState()

    var selectedKind by remember { mutableStateOf("All") }
    var search by remember { mutableStateOf("") }
    val kinds = listOf("All", "Part-time", "Internship", "Scholarship", "Mentorship", "Hackathon", "Saved")

    val filtered = remember(selectedKind, search, savedIds) {
        EdBridgeData.opportunities.filter { opp ->
            val matchesKind = when (selectedKind) {
                "All" -> true
                "Saved" -> savedIds.contains(opp.id)
                else -> opp.kind == selectedKind
            }
            val matchesQuery = search.isBlank() ||
                opp.title.contains(search, ignoreCase = true) ||
                opp.org.contains(search, ignoreCase = true) ||
                opp.summary.contains(search, ignoreCase = true)
            matchesKind && matchesQuery
        }
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
                title = "Opportunities & Paid Gigs",
                subtitle = "Sustainable self-reliance matched from your communities & skills"
            )
        }

        item {
            OutlinedTextField(
                value = search,
                onValueChange = { search = it },
                placeholder = { Text("Search campus jobs, scholarships, internships…") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search opportunities") },
                singleLine = true,
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth().testTag("opportunities_search_input")
            )
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(kinds) { kind ->
                    FilterChip(
                        selected = selectedKind == kind,
                        onClick = { selectedKind = kind },
                        label = { Text(kind) }
                    )
                }
            }
        }

        if (filtered.isEmpty()) {
            item {
                EmptyStateCard(
                    icon = Icons.Default.WorkOff,
                    title = "No matching opportunities",
                    subtitle = "Clear your filter or search to browse all paid student roles and scholarships.",
                    actionLabel = "Reset Filters",
                    onAction = {
                        selectedKind = "All"
                        search = ""
                    }
                )
            }
        } else {
            items(filtered, key = { it.id }) { opp ->
                OpportunityCard(
                    opportunity = opp,
                    isSaved = savedIds.contains(opp.id),
                    isApplied = appliedIds.contains(opp.id),
                    onToggleSave = { viewModel.repository.toggleSaveOpportunity(opp.id) },
                    onApply = { viewModel.repository.applyOpportunity(opp.id, opp.title) }
                )
            }
        }
    }
}

@Composable
private fun OpportunityCard(
    opportunity: Opportunity,
    isSaved: Boolean,
    isApplied: Boolean,
    onToggleSave: () -> Unit,
    onApply: () -> Unit
) {
    var showMatchWhy by remember { mutableStateOf(false) }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        modifier = Modifier.fillMaxWidth().testTag("opportunity_card_${opportunity.id}")
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(color = SuccessGreenContainer, shape = RoundedCornerShape(50)) {
                    Text(
                        text = opportunity.kind,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = OnSuccessGreenContainer,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
                IconButton(
                    onClick = onToggleSave,
                    modifier = Modifier.testTag("save_opp_${opportunity.id}")
                ) {
                    Icon(
                        imageVector = if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                        contentDescription = if (isSaved) "Remove bookmark" else "Save opportunity",
                        tint = if (isSaved) PrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Text(opportunity.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text("${opportunity.org} · ${opportunity.location}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(6.dp))
            Text(opportunity.summary, style = MaterialTheme.typography.bodySmall)
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = opportunity.compensation,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = PrimaryBlue
                )
                Text(
                    text = "Closes in ${opportunity.closesInDays}d",
                    fontSize = 11.sp,
                    color = if (opportunity.closesInDays <= 7) WarningAmber else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            TextButton(
                onClick = { showMatchWhy = !showMatchWhy },
                contentPadding = PaddingValues(0.dp)
            ) {
                Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(if (showMatchWhy) "Hide match reason" else "Why am I seeing this?", fontSize = 12.sp)
            }

            if (showMatchWhy) {
                Surface(
                    color = PrimaryBlueContainer.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                ) {
                    Text(
                        text = opportunity.matchReason,
                        fontSize = 12.sp,
                        color = OnPrimaryBlueContainer,
                        modifier = Modifier.padding(10.dp)
                    )
                }
            }

            Button(
                onClick = onApply,
                enabled = !isApplied,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .defaultMinSize(minHeight = 48.dp)
                    .testTag("apply_opp_${opportunity.id}")
            ) {
                Icon(
                    imageVector = if (isApplied) Icons.Default.CheckCircle else Icons.Default.Send,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(if (isApplied) "Applied with Verified Profile" else "Apply with Verified Profile")
            }
        }
    }
}
