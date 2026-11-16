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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.data.model.NotificationTone
import com.example.edbridge.ui.components.EmptyStateCard
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun NotificationsScreen(
    viewModel: EdBridgeViewModel
) {
    val notifications by viewModel.notifications.collectAsState()
    var filterTone by remember { mutableStateOf<NotificationTone?>(null) }

    val filtered = remember(notifications, filterTone) {
        if (filterTone == null) notifications else notifications.filter { it.tone == filterTone }
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
                title = "Activity & Milestones",
                subtitle = "Real-time updates, matches, and settlement receipts",
                actionLabel = "Mark all read",
                onActionClick = { viewModel.repository.markAllNotificationsRead() }
            )
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    FilterChip(
                        selected = filterTone == null,
                        onClick = { filterTone = null },
                        label = { Text("All") }
                    )
                }
                items(NotificationTone.entries) { tone ->
                    FilterChip(
                        selected = filterTone == tone,
                        onClick = { filterTone = tone },
                        label = { Text(tone.name.lowercase().replaceFirstChar { it.uppercase() }) }
                    )
                }
            }
        }

        if (filtered.isEmpty()) {
            item {
                EmptyStateCard(
                    icon = Icons.Default.NotificationsNone,
                    title = "You're all caught up",
                    subtitle = "No notifications in this filter.",
                    actionLabel = "Show All",
                    onAction = { filterTone = null }
                )
            }
        } else {
            items(filtered, key = { it.id }) { notif ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (notif.read) MaterialTheme.colorScheme.surface else PrimaryBlueContainer.copy(alpha = 0.35f)
                    ),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                    modifier = Modifier.fillMaxWidth().testTag("notification_${notif.id}")
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(14.dp),
                        verticalAlignment = Alignment.Top,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            color = PrimaryBlueContainer,
                            shape = CircleShape,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = when (notif.tone) {
                                        NotificationTone.IMPACT -> Icons.Default.EmojiEvents
                                        NotificationTone.MATCH -> Icons.Default.People
                                        NotificationTone.OPPORTUNITY -> Icons.Default.Work
                                        NotificationTone.VERIFICATION -> Icons.Default.VerifiedUser
                                        NotificationTone.SUPPORT -> Icons.Default.Favorite
                                    },
                                    contentDescription = null,
                                    tint = PrimaryBlue,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(notif.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, modifier = Modifier.weight(1f))
                                Text(notif.at, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Spacer(modifier = Modifier.height(3.dp))
                            Text(notif.body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}
