package com.example.edbridge

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.edbridge.data.model.DemoRole
import com.example.edbridge.data.model.SupportRequest
import com.example.edbridge.ui.screens.*
import com.example.edbridge.ui.theme.ConnectionViolet
import com.example.edbridge.ui.theme.EdBridgeTheme
import com.example.edbridge.ui.theme.PrimaryBlue
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

enum class Screen(val label: String, val icon: ImageVector) {
    HOME("Home", Icons.Default.Home),
    EXPLORE_SUPPORT("Support", Icons.Default.VolunteerActivism),
    DISCOVER("Circle", Icons.Default.People),
    COMMUNITIES("Circles", Icons.Default.Hub),
    IMPACT("Impact", Icons.Default.EmojiEvents),
    OPPORTUNITIES("Gigs", Icons.Default.Work),
    STUDENT_DASHBOARD("Student", Icons.Default.School),
    SUPPORTER_DASHBOARD("Supporter", Icons.Default.Handshake),
    ORGANIZATION("Org Pro", Icons.Default.Business),
    ADMIN("Admin", Icons.Default.AdminPanelSettings),
    ONBOARDING("Onboard", Icons.Default.PersonAdd),
    NOTIFICATIONS("Alerts", Icons.Default.Notifications),
    ABOUT("About", Icons.Default.Info),
    SUPPORT_DETAIL("Detail", Icons.Default.Article)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EdBridgeTheme {
                var showSplash by remember { mutableStateOf(true) }
                Crossfade(targetState = showSplash, label = "splash_to_app") { isSplash ->
                    if (isSplash) {
                        SplashScreen(onFinish = { showSplash = false })
                    } else {
                        EdBridgeApp()
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EdBridgeApp(
    viewModel: EdBridgeViewModel = viewModel()
) {
    var screenStack by remember { mutableStateOf(listOf(Screen.HOME)) }
    val currentScreen = screenStack.lastOrNull() ?: Screen.HOME
    var selectedRequestId by remember { mutableStateOf<String?>(null) }
    var roleDropdownExpanded by remember { mutableStateOf(false) }

    val role by viewModel.role.collectAsState()
    val notifications by viewModel.notifications.collectAsState()
    val unreadNotifications = remember(notifications) { notifications.count { !it.read } }

    fun navigateTo(screen: Screen) {
        if (currentScreen != screen) {
            screenStack = if (screen == Screen.HOME) listOf(Screen.HOME) else screenStack + screen
        }
    }

    fun navigateBack() {
        if (screenStack.size > 1) {
            screenStack = screenStack.dropLast(1)
        }
    }

    fun openRequestDetail(req: SupportRequest) {
        selectedRequestId = req.id
        navigateTo(Screen.SUPPORT_DETAIL)
    }

    val primaryTabs = listOf(
        Screen.HOME,
        Screen.EXPLORE_SUPPORT,
        Screen.DISCOVER,
        Screen.COMMUNITIES,
        Screen.IMPACT
    )

    if (screenStack.size > 1) {
        BackHandler { navigateBack() }
    }

    BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
        val isWide = maxWidth > 700.dp

        Row(modifier = Modifier.fillMaxSize()) {
            if (isWide && currentScreen != Screen.SUPPORT_DETAIL) {
                NavigationRail(
                    header = {
                        Image(
                            painter = painterResource(id = R.drawable.img_edbridge_logo),
                            contentDescription = "Ed-Bridge Logo",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(42.dp)
                                .clip(RoundedCornerShape(12.dp))
                        )
                    },
                    modifier = Modifier.padding(vertical = 8.dp)
                ) {
                    primaryTabs.forEach { screen ->
                        NavigationRailItem(
                            selected = currentScreen == screen,
                            onClick = { screenStack = listOf(screen) },
                            icon = { Icon(screen.icon, contentDescription = screen.label) },
                            label = { Text(screen.label) }
                        )
                    }
                    HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp, horizontal = 8.dp))
                    NavigationRailItem(
                        selected = currentScreen == Screen.OPPORTUNITIES,
                        onClick = { navigateTo(Screen.OPPORTUNITIES) },
                        icon = { Icon(Screen.OPPORTUNITIES.icon, contentDescription = "Paid Gigs") },
                        label = { Text("Gigs") }
                    )
                }
            }

            Scaffold(
                topBar = {
                    if (currentScreen != Screen.SUPPORT_DETAIL) {
                        TopAppBar(
                            title = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    modifier = Modifier.testTag("app_brand_header")
                                ) {
                                    Image(
                                        painter = painterResource(id = R.drawable.img_edbridge_logo),
                                        contentDescription = "Ed-Bridge brand mark",
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(36.dp)
                                            .clip(RoundedCornerShape(10.dp))
                                    )
                                    Column {
                                        Text(
                                            text = "Ed-Bridge",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 18.sp
                                        )
                                        if (role != DemoRole.VISITOR) {
                                            Text(
                                                text = "${role.label} Mode",
                                                fontSize = 10.sp,
                                                color = PrimaryBlue,
                                                fontWeight = FontWeight.SemiBold
                                            )
                                        }
                                    }
                                }
                            },
                            actions = {
                                IconButton(
                                    onClick = { navigateTo(Screen.OPPORTUNITIES) },
                                    modifier = Modifier.testTag("top_opportunities_btn")
                                ) {
                                    Icon(Icons.Default.WorkOutline, contentDescription = "Paid Gigs & Opportunities")
                                }

                                IconButton(
                                    onClick = { navigateTo(Screen.NOTIFICATIONS) },
                                    modifier = Modifier.testTag("notifications_icon_btn")
                                ) {
                                    BadgedBox(
                                        badge = {
                                            if (unreadNotifications > 0) {
                                                Badge(containerColor = ConnectionViolet) {
                                                    Text("$unreadNotifications", fontSize = 10.sp)
                                                }
                                            }
                                        }
                                    ) {
                                        Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                                    }
                                }

                                Box {
                                    Button(
                                        onClick = { roleDropdownExpanded = true },
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier
                                            .padding(end = 8.dp)
                                            .defaultMinSize(minHeight = 40.dp)
                                            .testTag("role_selector_button")
                                    ) {
                                        Text(
                                            text = if (role == DemoRole.VISITOR) "Views" else role.label,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                        Icon(Icons.Default.ArrowDropDown, contentDescription = "Switch perspective", modifier = Modifier.size(16.dp))
                                    }

                                    DropdownMenu(
                                        expanded = roleDropdownExpanded,
                                        onDismissRequest = { roleDropdownExpanded = false }
                                    ) {
                                        Text(
                                            "Switch Workspace",
                                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        HorizontalDivider()
                                        DropdownMenuItem(
                                            text = { Text("Student Hub (Shielded Aid)") },
                                            leadingIcon = { Icon(Icons.Default.School, contentDescription = null) },
                                            onClick = {
                                                viewModel.repository.setRole(DemoRole.STUDENT)
                                                navigateTo(Screen.STUDENT_DASHBOARD)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Supporter Hub & Streak") },
                                            leadingIcon = { Icon(Icons.Default.Handshake, contentDescription = null) },
                                            onClick = {
                                                viewModel.repository.setRole(DemoRole.SUPPORTER)
                                                navigateTo(Screen.SUPPORTER_DASHBOARD)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Opportunities & Paid Gigs") },
                                            leadingIcon = { Icon(Icons.Default.Work, contentDescription = null) },
                                            onClick = {
                                                navigateTo(Screen.OPPORTUNITIES)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Organization Pro (B2B SaaS)") },
                                            leadingIcon = { Icon(Icons.Default.Business, contentDescription = null) },
                                            onClick = {
                                                viewModel.repository.setRole(DemoRole.ORGANIZATION)
                                                navigateTo(Screen.ORGANIZATION)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Admin Verification Queue") },
                                            leadingIcon = { Icon(Icons.Default.AdminPanelSettings, contentDescription = null) },
                                            onClick = {
                                                viewModel.repository.setRole(DemoRole.ADMIN)
                                                navigateTo(Screen.ADMIN)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        HorizontalDivider()
                                        DropdownMenuItem(
                                            text = { Text("4-Step Onboarding Wizard") },
                                            leadingIcon = { Icon(Icons.Default.PersonAdd, contentDescription = null) },
                                            onClick = {
                                                navigateTo(Screen.ONBOARDING)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("About Ed-Bridge") },
                                            leadingIcon = { Icon(Icons.Default.Info, contentDescription = null) },
                                            onClick = {
                                                navigateTo(Screen.ABOUT)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                        HorizontalDivider()
                                        DropdownMenuItem(
                                            text = { Text("Reset Demo Data") },
                                            leadingIcon = { Icon(Icons.Default.RestartAlt, contentDescription = null) },
                                            onClick = {
                                                viewModel.repository.resetToInitial()
                                                screenStack = listOf(Screen.HOME)
                                                roleDropdownExpanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        )
                    }
                },
                bottomBar = {
                    if (!isWide && currentScreen != Screen.SUPPORT_DETAIL) {
                        NavigationBar(
                            modifier = Modifier.testTag("bottom_nav_bar")
                        ) {
                            primaryTabs.forEach { screen ->
                                NavigationBarItem(
                                    selected = currentScreen == screen,
                                    onClick = { screenStack = listOf(screen) },
                                    icon = { Icon(screen.icon, contentDescription = screen.label) },
                                    label = { Text(screen.label, fontSize = 11.sp, maxLines = 1) },
                                    modifier = Modifier.testTag("nav_item_${screen.name.lowercase()}")
                                )
                            }
                        }
                    }
                }
            ) { paddingValues ->
                Crossfade(
                    targetState = currentScreen,
                    modifier = Modifier.padding(paddingValues),
                    label = "screen_crossfade"
                ) { target ->
                    when (target) {
                        Screen.HOME -> HomeScreen(
                            viewModel = viewModel,
                            onNavigateToSupport = { screenStack = listOf(Screen.EXPLORE_SUPPORT) },
                            onNavigateToCommunities = { screenStack = listOf(Screen.COMMUNITIES) },
                            onNavigateToOpportunities = { navigateTo(Screen.OPPORTUNITIES) },
                            onNavigateToOnboarding = { navigateTo(Screen.ONBOARDING) },
                            onNavigateToStudentHub = { navigateTo(Screen.STUDENT_DASHBOARD) },
                            onNavigateToSupporterHub = { navigateTo(Screen.SUPPORTER_DASHBOARD) },
                            onNavigateToOrganization = { navigateTo(Screen.ORGANIZATION) },
                            onOpenSupportDetail = ::openRequestDetail
                        )
                        Screen.STUDENT_DASHBOARD -> StudentDashboardScreen(
                            viewModel = viewModel,
                            onNavigateToDiscover = { screenStack = listOf(Screen.DISCOVER) },
                            onNavigateToOpportunities = { navigateTo(Screen.OPPORTUNITIES) },
                            onNavigateToOnboarding = { navigateTo(Screen.ONBOARDING) },
                            onOpenSupportDetail = ::openRequestDetail
                        )
                        Screen.SUPPORTER_DASHBOARD -> SupporterDashboardScreen(
                            viewModel = viewModel,
                            onNavigateToImpact = { screenStack = listOf(Screen.IMPACT) },
                            onOpenSupportDetail = ::openRequestDetail
                        )
                        Screen.EXPLORE_SUPPORT -> ExploreSupportScreen(
                            viewModel = viewModel,
                            onOpenSupportDetail = ::openRequestDetail
                        )
                        Screen.COMMUNITIES -> CommunitiesScreen(
                            viewModel = viewModel,
                            onOpenSupportDetail = ::openRequestDetail
                        )
                        Screen.OPPORTUNITIES -> OpportunitiesScreen(viewModel = viewModel)
                        Screen.DISCOVER -> DiscoverScreen(viewModel = viewModel)
                        Screen.IMPACT -> ImpactPassportScreen(viewModel = viewModel)
                        Screen.ORGANIZATION -> OrganizationScreen(viewModel = viewModel)
                        Screen.ADMIN -> AdminScreen(viewModel = viewModel)
                        Screen.ONBOARDING -> OnboardingScreen(
                            viewModel = viewModel,
                            onFinished = { navigateTo(Screen.STUDENT_DASHBOARD) }
                        )
                        Screen.NOTIFICATIONS -> NotificationsScreen(viewModel = viewModel)
                        Screen.ABOUT -> AboutScreen(
                            onTryStudentFlow = {
                                viewModel.repository.setRole(DemoRole.STUDENT)
                                navigateTo(Screen.STUDENT_DASHBOARD)
                            },
                            onTrySupporterFlow = {
                                viewModel.repository.setRole(DemoRole.SUPPORTER)
                                navigateTo(Screen.SUPPORTER_DASHBOARD)
                            },
                            onTryOrgFlow = {
                                viewModel.repository.setRole(DemoRole.ORGANIZATION)
                                navigateTo(Screen.ORGANIZATION)
                            }
                        )
                        Screen.SUPPORT_DETAIL -> {
                            val id = selectedRequestId
                            if (id != null) {
                                SupportDetailScreen(
                                    requestId = id,
                                    viewModel = viewModel,
                                    onBack = { navigateBack() }
                                )
                            } else {
                                screenStack = listOf(Screen.EXPLORE_SUPPORT)
                            }
                        }
                    }
                }
            }
        }
    }
}
