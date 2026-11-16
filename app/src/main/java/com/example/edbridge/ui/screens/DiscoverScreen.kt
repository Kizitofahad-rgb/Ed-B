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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.model.PersonRole
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.NetworkGraphComposable
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.components.UserAvatar
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun DiscoverScreen(
    viewModel: EdBridgeViewModel
) {
    val connectedIds by viewModel.connections.collectAsState()
    val mentorshipIds by viewModel.mentorships.collectAsState()
    var requestedIds by remember { mutableStateOf(emptySet<String>()) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            SectionHeader(
                title = "Your Relational Circle",
                subtitle = "Tap any node to inspect how your college, course & school overlap"
            )
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    NetworkGraphComposable(interactive = true)
                }
            }
        }

        item {
            SectionHeader(
                title = "Recommended Allies & Mentors",
                subtitle = "Matched transparently from shared education & alumni circles"
            )
        }

        items(EdBridgeData.recommendations, key = { it.personId }) { rec ->
            val person = EdBridgeData.peopleMap[rec.personId] ?: return@items
            val isConnected = connectedIds.contains(person.id) || requestedIds.contains(person.id)
            val isMentor = person.role == PersonRole.MENTOR || person.role == PersonRole.ALUMNI

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                modifier = Modifier.fillMaxWidth().testTag("recommend_card_${person.id}")
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        UserAvatar(
                            name = person.name,
                            size = 46.dp,
                            photoKey = person.photoKey
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(person.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                            Text(person.headline, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Surface(color = SuccessGreenContainer, shape = RoundedCornerShape(50)) {
                            Text(
                                text = "${rec.relevance}% match",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = OnSuccessGreenContainer,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(person.bio, style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))

                    rec.reasons.forEach { reason ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(vertical = 1.dp)
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(13.dp))
                            Text(reason, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { requestedIds = requestedIds + person.id },
                            enabled = !isConnected,
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                        ) {
                            Icon(
                                imageVector = if (isConnected) Icons.Default.Check else Icons.Default.PersonAdd,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = when {
                                    mentorshipIds.contains(person.id) -> "Mentoring"
                                    isConnected -> "In Your Circle"
                                    isMentor -> "Request Mentorship"
                                    else -> "Connect"
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
