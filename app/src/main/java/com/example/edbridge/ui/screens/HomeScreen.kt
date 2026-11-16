package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.R
import com.example.edbridge.data.model.DemoRole
import com.example.edbridge.data.model.SupportRequest
import com.example.edbridge.data.model.VerificationState
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.components.*
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun HomeScreen(
    viewModel: EdBridgeViewModel,
    onNavigateToSupport: () -> Unit,
    onNavigateToCommunities: () -> Unit,
    onNavigateToOpportunities: () -> Unit,
    onNavigateToOnboarding: () -> Unit,
    onNavigateToStudentHub: () -> Unit,
    onNavigateToSupporterHub: () -> Unit,
    onNavigateToOrganization: () -> Unit,
    onOpenSupportDetail: (SupportRequest) -> Unit
) {
    val requests by viewModel.requests.collectAsState()
    val verifiedRequests = remember(requests) {
        requests.filter { it.status == VerificationState.VERIFIED }
    }
    var selectedCompareTab by remember { mutableStateOf(0) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        // 1. 2-Minute Clarity Hero Card (What Ed-Bridge is & Who it is for)
        item {
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(155.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.hero_student),
                            contentDescription = "Makerere University students collaborating",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(
                                            Color(0x550F172A),
                                            Color(0xDD0F172A)
                                        )
                                    )
                                )
                        )
                        Column(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(16.dp)
                        ) {
                            Surface(
                                color = ShieldIndigoContainer.copy(alpha = 0.95f),
                                shape = RoundedCornerShape(50)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(5.dp)
                                ) {
                                    Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = ShieldIndigo, modifier = Modifier.size(13.dp))
                                    Text(
                                        text = "Starting at Makerere · Relational & Shielded Aid",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = ShieldIndigo
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Students stay in school without public begging.",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.White
                            )
                        }
                    }

                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Ed-Bridge turns your real academic communities (College, Course, Secondary School Alumni) into a verified, private safety net for tuition, sustenance, mentorship, equipment, and paid work.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Button(
                                onClick = onNavigateToSupport,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .defaultMinSize(minHeight = 48.dp)
                                    .testTag("hero_explore_support_btn")
                            ) {
                                Icon(Icons.Default.VolunteerActivism, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Help a Student", fontWeight = FontWeight.SemiBold)
                            }
                            OutlinedButton(
                                onClick = {
                                    viewModel.repository.setRole(DemoRole.STUDENT)
                                    onNavigateToStudentHub()
                                },
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .defaultMinSize(minHeight = 48.dp)
                                    .testTag("hero_seek_support_btn")
                            ) {
                                Icon(Icons.Default.Shield, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Seek Quiet Aid", fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
            }
        }

        // 2. Quick Role Tour (Lets a first-time reviewer test all perspectives in 1 tap)
        item {
            SectionHeader(
                title = "Explore by Perspective",
                subtitle = "Switch roles instantly to experience the full platform"
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                RoleShortcutChip(
                    label = "Student",
                    subtitle = "Shielded Request",
                    icon = Icons.Default.School,
                    accent = PrimaryBlue,
                    onClick = {
                        viewModel.repository.setRole(DemoRole.STUDENT)
                        onNavigateToStudentHub()
                    },
                    modifier = Modifier.weight(1f).testTag("quick_role_student")
                )
                RoleShortcutChip(
                    label = "Supporter",
                    subtitle = "Impact Passport",
                    icon = Icons.Default.Handshake,
                    accent = ConnectionViolet,
                    onClick = {
                        viewModel.repository.setRole(DemoRole.SUPPORTER)
                        onNavigateToSupporterHub()
                    },
                    modifier = Modifier.weight(1f).testTag("quick_role_supporter")
                )
                RoleShortcutChip(
                    label = "Org SaaS",
                    subtitle = "Cohort Tools",
                    icon = Icons.Default.Business,
                    accent = SuccessGreen,
                    onClick = {
                        viewModel.repository.setRole(DemoRole.ORGANIZATION)
                        onNavigateToOrganization()
                    },
                    modifier = Modifier.weight(1f).testTag("quick_role_org")
                )
            }
        }

        // 3. Dignified & Shielded Aid Explainer (Directly solves stigma & over-exposure)
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = ShieldIndigoContainer.copy(alpha = 0.55f)),
                border = BorderStroke(1.dp, ShieldIndigo.copy(alpha = 0.25f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Surface(color = ShieldIndigo, shape = RoundedCornerShape(10.dp)) {
                            Icon(
                                Icons.Default.VisibilityOff,
                                contentDescription = "Shielded privacy",
                                tint = Color.White,
                                modifier = Modifier.padding(8.dp).size(18.dp)
                            )
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Need Tuition Without Public Exposure?",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                color = ShieldIndigo
                            )
                            Text(
                                text = "Built for students protecting dignity & privacy",
                                style = MaterialTheme.typography.bodySmall,
                                color = ShieldIndigo.copy(alpha = 0.8f)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    ShieldBullet(
                        icon = Icons.Default.Badge,
                        text = "Shielded Alias (#EB-402): Ed-Bridge verifies your Makerere ID & fee invoice privately, then hides your name & photo from classmates."
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    ShieldBullet(
                        icon = Icons.Default.Groups,
                        text = "Alumni-Only Audience Scope: Route requests strictly to verified alumni & mentors — never your current class feed."
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    ShieldBullet(
                        icon = Icons.Default.AccountBalance,
                        text = "Direct Bursar & Hostel Settlement: Supporters settle invoices directly with Makerere Bursar or vendors, eliminating skepticism."
                    )
                }
            }
        }

        // 4. Why Ed-Bridge != Crowdfunding (2-Minute Test #3, #4, #7, #8)
        item {
            SectionHeader(
                title = "Why Ed-Bridge Is Not Crowdfunding",
                subtitle = "Relational trust, non-cash help & ongoing retention"
            )
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
                        listOf("Trust vs Viral", "Help Without Cash", "Retention & SaaS").forEachIndexed { idx, label ->
                            SegmentedButton(
                                selected = selectedCompareTab == idx,
                                onClick = { selectedCompareTab = idx },
                                shape = SegmentedButtonDefaults.itemShape(index = idx, count = 3)
                            ) {
                                Text(label, fontSize = 11.sp, maxLines = 1)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    when (selectedCompareTab) {
                        0 -> {
                            CompareRow("Public Crowdfunding", "Requires broadcasting your hardship to strangers on social media.", isGood = false)
                            Spacer(modifier = Modifier.height(8.dp))
                            CompareRow("Ed-Bridge", "Human-verified documents + Shielded Aliases routed to your college, course & high-school alumni.", isGood = true)
                        }
                        1 -> {
                            CompareRow("Cash-Only Sites", "Leave you stuck if supporters cannot send mobile money today.", isGood = false)
                            Spacer(modifier = Modifier.height(8.dp))
                            CompareRow("6 Ways to Help", "Offer 1-on-1 mentorship, spare laptop loans, paid campus jobs, internships, warm referrals, or circle amplification.", isGood = true)
                        }
                        else -> {
                            CompareRow("One-Time Disposal", "Once a campaign ends, students and donors vanish forever.", isGood = false)
                            Spacer(modifier = Modifier.height(8.dp))
                            CompareRow("Ongoing Attachment", "Students return weekly for paid gigs, milestones & paying it forward; alumni get a Verified Impact Passport; orgs pay for Cohort SaaS.", isGood = true)
                        }
                    }
                }
            }
        }

        // 5. Verified Support Requests Preview
        item {
            SectionHeader(
                title = "Verified Requests Right Now",
                subtitle = "Notice shielded aliases, direct bursar tags & 1:1 alumni matches",
                actionLabel = "See all",
                onActionClick = onNavigateToSupport
            )
        }

        items(verifiedRequests.take(3), key = { it.id }) { req ->
            SupportRequestCard(
                request = req,
                onClick = { onOpenSupportDetail(req) }
            )
        }

        // 6. Live Circle Graph Preview
        item {
            SectionHeader(
                title = "Your Trusted Circle Graph",
                subtitle = "How shared colleges & alumni communities unlock help",
                actionLabel = "Communities",
                onActionClick = onNavigateToCommunities
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

        // 7. CoCIS Laptop & Bursar Campaign Banner + Opportunities CTA
        item {
            val camp = EdBridgeData.campaign
            val pct = camp.supportedStudents.toFloat() / camp.goalStudents.toFloat()
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = PrimaryBlueContainer.copy(alpha = 0.45f)),
                border = BorderStroke(1.dp, PrimaryBlue.copy(alpha = 0.25f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = camp.name,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = OnPrimaryBlueContainer
                        )
                        Surface(color = SuccessGreenContainer, shape = RoundedCornerShape(50)) {
                            Text(
                                text = "${camp.supportedStudents}/${camp.goalStudents} reached",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = OnSuccessGreenContainer,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { pct },
                        modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(50)),
                        color = PrimaryBlue,
                        trackColor = Color.White
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "${camp.laptops} laptops · ${camp.tablets} tablets · ${camp.mentorshipSessions} mentorship sessions backed by Mak Alumni & Org Partners.",
                        style = MaterialTheme.typography.bodySmall,
                        color = OnPrimaryBlueContainer
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(
                            onClick = onNavigateToOpportunities,
                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                        ) {
                            Text("Paid Gigs & Aid")
                        }
                        Button(
                            onClick = onNavigateToOnboarding,
                            modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                        ) {
                            Text("Join Verified")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RoleShortcutChip(
    label: String,
    subtitle: String,
    icon: ImageVector,
    accent: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Surface(color = accent.copy(alpha = 0.12f), shape = CircleShape) {
                Icon(icon, contentDescription = label, tint = accent, modifier = Modifier.padding(7.dp).size(16.dp))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(label, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
            Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1)
        }
    }
}

@Composable
private fun ShieldBullet(icon: ImageVector, text: String) {
    Row(
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(icon, contentDescription = null, tint = ShieldIndigo, modifier = Modifier.padding(top = 2.dp).size(15.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = ShieldIndigo
        )
    }
}

@Composable
private fun CompareRow(title: String, body: String, isGood: Boolean) {
    Surface(
        color = if (isGood) SuccessGreenContainer.copy(alpha = 0.45f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(10.dp),
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = if (isGood) Icons.Default.CheckCircle else Icons.Default.RemoveCircleOutline,
                contentDescription = null,
                tint = if (isGood) SuccessGreen else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(18.dp)
            )
            Column {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = if (isGood) OnSuccessGreenContainer else MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = body,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (isGood) OnSuccessGreenContainer else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
