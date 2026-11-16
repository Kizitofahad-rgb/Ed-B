package com.example.edbridge.ui.screens

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
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.edbridge.data.model.DisclosureLevel
import com.example.edbridge.data.model.SupportRequest
import com.example.edbridge.data.model.SupportType
import com.example.edbridge.data.model.VerificationState
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.EmptyStateCard
import com.example.edbridge.ui.components.SectionHeader
import com.example.edbridge.ui.components.SupportRequestCard
import com.example.edbridge.ui.theme.PrimaryBlue
import com.example.edbridge.ui.theme.ShieldIndigo
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun ExploreSupportScreen(
    viewModel: EdBridgeViewModel,
    onOpenSupportDetail: (SupportRequest) -> Unit
) {
    val allRequests by viewModel.requests.collectAsState()
    var query by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var selectedSupportType by remember { mutableStateOf<SupportType?>(null) }
    var onlyShielded by remember { mutableStateOf(false) }
    var onlyVerified by remember { mutableStateOf(true) }

    val categories = listOf("All", "Tuition", "Accommodation", "Laptop / Equipment", "Mentorship", "Career / Internship")

    val filtered = remember(allRequests, query, selectedCategory, selectedSupportType, onlyShielded, onlyVerified) {
        allRequests.filter { req ->
            val personName = EdBridgeData.peopleMap[req.personId]?.name ?: ""
            val matchesQuery = query.isBlank() ||
                req.title.contains(query, ignoreCase = true) ||
                req.need.contains(query, ignoreCase = true) ||
                req.aliasLabel.contains(query, ignoreCase = true) ||
                personName.contains(query, ignoreCase = true)
            val matchesCat = selectedCategory == "All" || req.category == selectedCategory
            val matchesType = selectedSupportType == null || req.supportTypes.contains(selectedSupportType)
            val matchesShield = !onlyShielded || req.disclosureLevel == DisclosureLevel.SHIELDED_ALIAS
            val matchesStatus = !onlyVerified || req.status == VerificationState.VERIFIED
            matchesQuery && matchesCat && matchesType && matchesShield && matchesStatus
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
                title = "Verified Support Board",
                subtitle = "${filtered.size} active requests · Financial or non-cash help"
            )
        }

        item {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                placeholder = { Text("Search tuition, hostel, laptop, CoCIS…") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search requests") },
                trailingIcon = {
                    if (query.isNotEmpty()) {
                        IconButton(onClick = { query = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear search")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("explore_search_input")
            )
        }

        // Category pills
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(categories) { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat) },
                        modifier = Modifier.testTag("filter_category_${cat.lowercase().replace(" ", "_")}")
                    )
                }
            }
        }

        // Support type & privacy quick toggles
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    FilterChip(
                        selected = onlyShielded,
                        onClick = { onlyShielded = !onlyShielded },
                        leadingIcon = {
                            Icon(
                                Icons.Default.Shield,
                                contentDescription = null,
                                tint = if (onlyShielded) ShieldIndigo else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(16.dp)
                            )
                        },
                        label = { Text("Shielded Alias Only") },
                        modifier = Modifier.testTag("filter_shielded_only")
                    )
                }
                item {
                    FilterChip(
                        selected = onlyVerified,
                        onClick = { onlyVerified = !onlyVerified },
                        leadingIcon = {
                            Icon(
                                Icons.Default.Verified,
                                contentDescription = null,
                                tint = if (onlyVerified) PrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(16.dp)
                            )
                        },
                        label = { Text("Verified Only") },
                        modifier = Modifier.testTag("filter_verified_only")
                    )
                }
                items(SupportType.entries) { type ->
                    FilterChip(
                        selected = selectedSupportType == type,
                        onClick = {
                            selectedSupportType = if (selectedSupportType == type) null else type
                        },
                        label = { Text(type.label) }
                    )
                }
            }
        }

        if (filtered.isEmpty()) {
            item {
                EmptyStateCard(
                    icon = Icons.Default.FilterAltOff,
                    title = "No matching requests",
                    subtitle = "Try clearing your search or toggling off one of the filters to see more verified students.",
                    actionLabel = "Reset all filters",
                    onAction = {
                        query = ""
                        selectedCategory = "All"
                        selectedSupportType = null
                        onlyShielded = false
                        onlyVerified = false
                    }
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
