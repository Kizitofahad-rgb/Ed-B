package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
import com.example.edbridge.data.model.Community
import com.example.edbridge.data.model.CommunityKind
import com.example.edbridge.data.model.SupportRequest
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.components.SupportRequestCard
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun CommunitiesScreen(
    viewModel: EdBridgeViewModel,
    onOpenSupportDetail: (SupportRequest) -> Unit
) {
    val joinedIds by viewModel.joinedCommunities.collectAsState()
    val requests by viewModel.requests.collectAsState()
    var selectedKind by remember { mutableStateOf<CommunityKind?>(null) }
    var inspectedCommunity by remember { mutableStateOf<Community?>(null) }

    val filteredCommunities = remember(selectedKind) {
        if (selectedKind == null) EdBridgeData.communities
        else EdBridgeData.communities.filter { it.kind == selectedKind }
    }

    val leaderboard = remember {
        EdBridgeData.communities.sortedByDescending { it.studentsHelped }.take(3)
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            SectionHeader(
                title = "Communities Build Trust",
                subtitle = "Shared colleges, courses & high-school alumni turn strangers into allies"
            )
        }

        // Community Impact Leaderboard
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(Icons.Default.EmojiEvents, contentDescription = null, tint = WarningAmber, modifier = Modifier.size(18.dp))
                        Text("Top Impact Circles This Semester", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    leaderboard.forEachIndexed { idx, comm ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Surface(
                                color = if (idx == 0) WarningAmberContainer else PrimaryBlueContainer,
                                shape = CircleShape,
                                modifier = Modifier.size(26.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text("#${idx + 1}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(comm.short, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text("${comm.mentorshipSessions} mentorships · ${comm.opportunitiesCreated} opportunities", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Text(
                                text = "${comm.studentsHelped} helped",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = SuccessGreen
                            )
                        }
                    }
                }
            }
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    FilterChip(
                        selected = selectedKind == null,
                        onClick = { selectedKind = null },
                        label = { Text("All (${EdBridgeData.communities.size})") }
                    )
                }
                items(CommunityKind.entries) { kind ->
                    FilterChip(
                        selected = selectedKind == kind,
                        onClick = { selectedKind = kind },
                        label = { Text(kind.label) }
                    )
                }
            }
        }

        items(filteredCommunities, key = { it.id }) { community ->
            val isJoined = joinedIds.contains(community.id)
            CommunityCard(
                community = community,
                isJoined = isJoined,
                onJoinClick = { viewModel.repository.joinCommunity(community.id) },
                onInspectClick = { inspectedCommunity = community }
            )
        }

        item {
            SectionHeader(title = "Recent Circle Activity")
        }

        items(EdBridgeData.communityActivities, key = { it.id }) { act ->
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
                    Surface(color = ConnectionVioletContainer, shape = CircleShape, modifier = Modifier.size(34.dp)) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Hub, contentDescription = null, tint = ConnectionViolet, modifier = Modifier.size(16.dp))
                        }
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(act.label, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(act.detail, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Text(act.`when`, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }

    inspectedCommunity?.let { comm ->
        val commMembers = EdBridgeData.people.filter { it.communities.contains(comm.id) }
        val commRequests = requests.filter { req ->
            EdBridgeData.peopleMap[req.personId]?.communities?.contains(comm.id) == true
        }
        AlertDialog(
            onDismissRequest = { inspectedCommunity = null },
            title = { Text(comm.name, fontWeight = FontWeight.Bold, fontSize = 17.sp) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(comm.tagline, style = MaterialTheme.typography.bodySmall)
                    Text(
                        text = "${comm.members} members · ${comm.studentsHelped} students helped · ${comm.opportunitiesCreated} opportunities created",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PrimaryBlue
                    )
                    HorizontalDivider()
                    Text("Verified Members (${commMembers.size} shown)", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    commMembers.take(3).forEach { m ->
                        Text("• ${m.name} — ${m.headline}", fontSize = 12.sp)
                    }
                    if (commRequests.isNotEmpty()) {
                        HorizontalDivider()
                        Text("Active Requests in Circle (${commRequests.size})", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        commRequests.take(2).forEach { r ->
                            TextButton(
                                onClick = {
                                    inspectedCommunity = null
                                    onOpenSupportDetail(r)
                                },
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                Text("Open: ${r.title}", fontSize = 12.sp)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                val joined = joinedIds.contains(comm.id)
                Button(
                    enabled = !joined,
                    onClick = { viewModel.repository.joinCommunity(comm.id) }
                ) {
                    Text(if (joined) "Joined" else "Join Circle")
                }
            },
            dismissButton = {
                TextButton(onClick = { inspectedCommunity = null }) { Text("Close") }
            }
        )
    }
}

@Composable
private fun CommunityCard(
    community: Community,
    isJoined: Boolean,
    onJoinClick: () -> Unit,
    onInspectClick: () -> Unit
) {
    Card(
        onClick = onInspectClick,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        modifier = Modifier.fillMaxWidth().testTag("community_card_${community.id}")
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Surface(color = PrimaryBlueContainer, shape = RoundedCornerShape(50)) {
                        Text(
                            text = community.kind.label,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = OnPrimaryBlueContainer,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(community.short, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Text(community.name, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                if (isJoined) {
                    FilledTonalButton(
                        onClick = onInspectClick,
                        modifier = Modifier.defaultMinSize(minHeight = 48.dp)
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Joined", fontSize = 12.sp)
                    }
                } else {
                    Button(
                        onClick = onJoinClick,
                        modifier = Modifier.defaultMinSize(minHeight = 48.dp).testTag("join_community_${community.id}")
                    ) {
                        Text("Join", fontSize = 12.sp)
                    }
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(community.tagline, style = MaterialTheme.typography.bodySmall)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "${community.members} members · ${community.studentsHelped} helped · ${community.mentorshipSessions} mentoring sessions",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrimaryBlue
            )
        }
    }
}
