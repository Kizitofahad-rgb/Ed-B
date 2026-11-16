package com.example.edbridge.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.R
import com.example.edbridge.data.model.*
import com.example.edbridge.data.repository.EdBridgeData
import com.example.edbridge.ui.theme.*
import kotlin.math.hypot

fun resolvePhotoDrawable(photoKey: String?): Int? = when (photoKey) {
    "hero_student" -> R.drawable.hero_student
    "student_1" -> R.drawable.student_1
    "student_2" -> R.drawable.student_2
    "student_3" -> R.drawable.student_3
    "student_4" -> R.drawable.student_4
    "student_5" -> R.drawable.student_5
    "student_6" -> R.drawable.student_6
    else -> null
}

@Composable
fun UserAvatar(
    name: String,
    size: Dp = 42.dp,
    isShielded: Boolean = false,
    photoKey: String? = null,
    modifier: Modifier = Modifier
) {
    if (isShielded) {
        Box(
            modifier = modifier
                .size(size)
                .clip(CircleShape)
                .background(
                    Brush.linearGradient(
                        listOf(ShieldIndigo, ConnectionViolet)
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Shield,
                contentDescription = "Identity shielded for privacy",
                tint = Color.White,
                modifier = Modifier.size(size * 0.52f)
            )
        }
        return
    }

    val drawableRes = resolvePhotoDrawable(photoKey)
    if (drawableRes != null) {
        Image(
            painter = painterResource(id = drawableRes),
            contentDescription = "$name profile photo",
            contentScale = ContentScale.Crop,
            modifier = modifier
                .size(size)
                .clip(CircleShape)
        )
        return
    }

    val initials = remember(name) {
        name.split(" ")
            .filter { it.isNotBlank() }
            .take(2)
            .joinToString("") { it.first().uppercaseChar().toString() }
            .ifEmpty { "EB" }
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(
                Brush.linearGradient(
                    colors = listOf(PrimaryBlue, ConnectionViolet)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initials,
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = (size.value * 0.36f).sp
        )
    }
}

@Composable
fun StatusBadge(
    status: VerificationState,
    modifier: Modifier = Modifier
) {
    val (bg, fg, icon) = when (status) {
        VerificationState.VERIFIED -> Triple(SuccessGreenContainer, OnSuccessGreenContainer, Icons.Default.Verified)
        VerificationState.PENDING -> Triple(WarningAmberContainer, OnWarningAmberContainer, Icons.Default.Schedule)
        VerificationState.NEEDS_INFO -> Triple(CyanAccentContainer, CyanAccent, Icons.Default.Info)
        VerificationState.REJECTED -> Triple(ErrorRedContainer, ErrorRed, Icons.Default.Cancel)
    }
    Surface(
        color = bg,
        shape = RoundedCornerShape(50),
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(icon, contentDescription = status.label, tint = fg, modifier = Modifier.size(13.dp))
            Text(
                text = status.label,
                color = fg,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1
            )
        }
    }
}

@Composable
fun ShieldedIdentityBadge(
    disclosureLevel: DisclosureLevel,
    modifier: Modifier = Modifier
) {
    val (bg, fg, icon, text) = when (disclosureLevel) {
        DisclosureLevel.SHIELDED_ALIAS -> Quad(
            ShieldIndigoContainer,
            ShieldIndigo,
            Icons.Default.VisibilityOff,
            "Shielded Alias"
        )
        DisclosureLevel.CIRCLE_TRUSTED -> Quad(
            ConnectionVioletContainer,
            OnConnectionVioletContainer,
            Icons.Default.Groups,
            "Circle Trusted"
        )
        DisclosureLevel.PUBLIC_VERIFIED -> Quad(
            PrimaryBlueContainer,
            OnPrimaryBlueContainer,
            Icons.Default.Public,
            "Public Verified"
        )
    }

    Surface(
        color = bg,
        shape = RoundedCornerShape(50),
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(icon, contentDescription = text, tint = fg, modifier = Modifier.size(12.dp))
            Text(
                text = text,
                color = fg,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1
            )
        }
    }
}

private data class Quad<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)

@Composable
fun DisbursementPill(
    mode: DisbursementMode,
    modifier: Modifier = Modifier
) {
    Surface(
        color = MaterialTheme.colorScheme.surfaceVariant,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(
                imageVector = Icons.Default.AccountBalance,
                contentDescription = mode.badge,
                tint = PrimaryBlue,
                modifier = Modifier.size(12.dp)
            )
            Text(
                text = mode.badge,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun MatchingSponsorStrip(
    text: String,
    modifier: Modifier = Modifier
) {
    Surface(
        color = SuccessGreenContainer.copy(alpha = 0.65f),
        shape = RoundedCornerShape(10.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = Icons.Default.AutoAwesome,
                contentDescription = "Sponsor match active",
                tint = OnSuccessGreenContainer,
                modifier = Modifier.size(14.dp)
            )
            Text(
                text = text,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = OnSuccessGreenContainer,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun SupportTypePill(
    type: SupportType,
    modifier: Modifier = Modifier
) {
    val (bg, fg) = when (type) {
        SupportType.FINANCIAL -> PrimaryBlueContainer to OnPrimaryBlueContainer
        SupportType.MENTORSHIP -> ConnectionVioletContainer to OnConnectionVioletContainer
        SupportType.RESOURCE -> CyanAccentContainer to CyanAccent
        SupportType.OPPORTUNITY -> SuccessGreenContainer to OnSuccessGreenContainer
        SupportType.REFERRAL -> WarningAmberContainer to OnWarningAmberContainer
        SupportType.AMPLIFICATION -> MaterialTheme.colorScheme.surfaceVariant to MaterialTheme.colorScheme.onSurfaceVariant
    }
    Surface(
        color = bg,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier
    ) {
        Text(
            text = type.label,
            color = fg,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            maxLines = 1
        )
    }
}

@Composable
fun SectionHeader(
    title: String,
    subtitle: String? = null,
    actionLabel: String? = null,
    onActionClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            if (!subtitle.isNullOrBlank()) {
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        if (!actionLabel.isNullOrBlank() && onActionClick != null) {
            TextButton(
                onClick = onActionClick,
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                modifier = Modifier.defaultMinSize(minHeight = 48.dp)
            ) {
                Text(
                    text = actionLabel,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PrimaryBlue
                )
                Spacer(modifier = Modifier.width(2.dp))
                Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(14.dp), tint = PrimaryBlue)
            }
        }
    }
}

@Composable
fun MetricStatCard(
    label: String,
    value: String,
    caption: String,
    icon: ImageVector,
    accentColor: Color = PrimaryBlue,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
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
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                Surface(
                    color = accentColor.copy(alpha = 0.12f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        tint = accentColor,
                        modifier = Modifier
                            .padding(6.dp)
                            .size(16.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 1
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = caption,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun SupportRequestCard(
    request: SupportRequest,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val person = EdBridgeData.peopleMap[request.personId]
    val isShielded = request.disclosureLevel == DisclosureLevel.SHIELDED_ALIAS
    val displayName = if (isShielded) {
        request.aliasLabel
    } else {
        person?.name ?: request.aliasLabel
    }
    val subLine = if (isShielded) {
        "Verified enrollment · ${request.audienceScope.label}"
    } else {
        person?.headline ?: "Makerere University"
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("support_request_card_${request.id}")
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(
            width = 1.dp,
            color = if (isShielded) ShieldIndigo.copy(alpha = 0.28f) else MaterialTheme.colorScheme.outline
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                UserAvatar(
                    name = displayName,
                    size = 42.dp,
                    isShielded = isShielded,
                    photoKey = if (isShielded) null else person?.photoKey
                )
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = displayName,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = subLine,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                StatusBadge(status = request.status)
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                ShieldedIdentityBadge(disclosureLevel = request.disclosureLevel)
                DisbursementPill(mode = request.disbursementMode)
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = request.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = request.need,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            if (!request.matchingSponsor.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                MatchingSponsorStrip(text = request.matchingSponsor)
            }

            if (request.amountNeeded != null && request.amountNeeded > 0L) {
                val raised = request.amountRaised ?: 0L
                val pct = (raised.toFloat() / request.amountNeeded.toFloat()).coerceIn(0f, 1f)
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = EdBridgeData.formatUgx(raised),
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryBlue
                    )
                    Text(
                        text = "of ${EdBridgeData.formatUgx(request.amountNeeded)} (${(pct * 100).toInt()}%)",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = { pct },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(50)),
                    color = if (pct >= 1f) SuccessGreen else PrimaryBlue,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
            }

            request.updates.firstOrNull()?.let { latest ->
                Spacer(modifier = Modifier.height(10.dp))
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = if (latest.isGratitude) Icons.Default.Favorite else Icons.Default.Campaign,
                            contentDescription = null,
                            tint = if (latest.isGratitude) ConnectionViolet else PrimaryBlue,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = "${latest.milestoneTag}: ${latest.message}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    request.supportTypes.take(3).forEach { st ->
                        SupportTypePill(type = st)
                    }
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Schedule,
                        contentDescription = null,
                        tint = if (request.deadlineDays <= 7) WarningAmber else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "${request.deadlineDays}d · ${request.supporters} supporters",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (request.deadlineDays <= 7) WarningAmber else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
fun TrustScoreRingCanvas(
    score: Int,
    modifier: Modifier = Modifier,
    size: Dp = 112.dp
) {
    val animatedProgress by animateFloatAsState(
        targetValue = (score.coerceIn(0, 100) / 100f),
        animationSpec = tween(durationMillis = 900),
        label = "trust_ring"
    )
    Box(
        modifier = modifier.size(size),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeWidth = 10.dp.toPx()
            drawArc(
                color = PrimaryBlueContainer,
                startAngle = 0f,
                sweepAngle = 360f,
                useCenter = false,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
            drawArc(
                brush = Brush.sweepGradient(listOf(PrimaryBlue, ConnectionViolet, SuccessGreen, PrimaryBlue)),
                startAngle = -90f,
                sweepAngle = animatedProgress * 360f,
                useCenter = false,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "$score",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.ExtraBold,
                color = PrimaryBlue
            )
            Text(
                text = "TRUST SCORE",
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

data class GraphNodeSpec(
    val id: String,
    val label: String,
    val roleHint: String,
    val relation: String,
    val xFraction: Float,
    val yFraction: Float,
    val radiusDp: Float,
    val color: Color
)

@Composable
fun NetworkGraphComposable(
    modifier: Modifier = Modifier,
    interactive: Boolean = true
) {
    val nodes = remember {
        listOf(
            GraphNodeSpec("you", "You", "CS Year 2 · Busia SS", "Center of your trusted circle", 0.50f, 0.50f, 24f, PrimaryBlue),
            GraphNodeSpec("cocis", "CoCIS", "College Circle", "1,420 students & alumni in computing", 0.22f, 0.24f, 18f, ConnectionViolet),
            GraphNodeSpec("busia", "Busia SS", "Secondary Alumni", "214 former students quietly backing peers", 0.80f, 0.24f, 18f, CyanAccent),
            GraphNodeSpec("sarah", "Sarah M.", "Mentor ('19)", "3 mentorship slots open · CoCIS alumna", 0.20f, 0.75f, 16f, SuccessGreen),
            GraphNodeSpec("brian", "Brian O.", "Tuition Circle", "Busia alumni coordinator · Direct bursar pool", 0.80f, 0.75f, 16f, WarningAmber),
            GraphNodeSpec("mak", "Mak Alumni", "Matching Pool", "1:1 tuition match up to UGX 100k", 0.50f, 0.14f, 15f, PrimaryBlueDark),
            GraphNodeSpec("joel", "Joel T.", "Peer Mentee", "Year 1 Software Eng · Busia SS", 0.50f, 0.86f, 14f, ConnectionViolet)
        )
    }

    var selectedNode by remember { mutableStateOf<GraphNodeSpec?>(nodes.first()) }
    var canvasSize by remember { mutableStateOf(androidx.compose.ui.unit.IntSize.Zero) }

    Column(modifier = modifier) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(230.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f))
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .pointerInput(interactive) {
                        if (!interactive) return@pointerInput
                        detectTapGestures { tapOffset ->
                            val w = size.width.toFloat()
                            val h = size.height.toFloat()
                            val hit = nodes.minByOrNull { node ->
                                val nx = w * node.xFraction
                                val ny = h * node.yFraction
                                hypot(tapOffset.x - nx, tapOffset.y - ny)
                            }
                            if (hit != null) {
                                val nx = w * hit.xFraction
                                val ny = h * hit.yFraction
                                if (hypot(tapOffset.x - nx, tapOffset.y - ny) <= 44.dp.toPx()) {
                                    selectedNode = hit
                                }
                            }
                        }
                    }
            ) {
                canvasSize = androidx.compose.ui.unit.IntSize(size.width.toInt(), size.height.toInt())
                val center = Offset(size.width * 0.50f, size.height * 0.50f)

                val edgePairs = listOf(
                    0 to 1, 0 to 2, 0 to 3, 0 to 4, 0 to 5, 0 to 6,
                    1 to 3, 1 to 5, 2 to 4, 3 to 6, 4 to 5
                )

                edgePairs.forEach { (a, b) ->
                    val na = nodes[a]
                    val nb = nodes[b]
                    val start = Offset(size.width * na.xFraction, size.height * na.yFraction)
                    val end = Offset(size.width * nb.xFraction, size.height * nb.yFraction)
                    drawLine(
                        color = PrimaryBlue.copy(alpha = 0.25f),
                        start = start,
                        end = end,
                        strokeWidth = 2.dp.toPx()
                    )
                }

                nodes.forEach { node ->
                    val pos = Offset(size.width * node.xFraction, size.height * node.yFraction)
                    val r = node.radiusDp.dp.toPx()
                    val isSelected = selectedNode?.id == node.id
                    if (isSelected) {
                        drawCircle(
                            color = node.color.copy(alpha = 0.22f),
                            radius = r + 8.dp.toPx(),
                            center = pos
                        )
                    }
                    drawCircle(
                        color = node.color,
                        radius = r,
                        center = pos
                    )
                    drawCircle(
                        color = Color.White,
                        radius = r,
                        center = pos,
                        style = Stroke(width = 2.dp.toPx())
                    )
                }
            }

            // Crisp node labels aligned via BoxWithConstraints percentages
            BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
                nodes.forEach { node ->
                    val xOffset = maxWidth * node.xFraction - 34.dp
                    val yOffset = maxHeight * node.yFraction + node.radiusDp.dp + 2.dp
                    Box(
                        modifier = Modifier
                            .offset(x = xOffset.coerceIn(4.dp, maxWidth - 72.dp), y = yOffset.coerceAtMost(maxHeight - 20.dp))
                            .width(68.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Surface(
                            color = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = node.label,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface,
                                maxLines = 1,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                            )
                        }
                    }
                }
            }
        }

        if (interactive && selectedNode != null) {
            val node = selectedNode!!
            Spacer(modifier = Modifier.height(8.dp))
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(12.dp)
                            .clip(CircleShape)
                            .background(node.color)
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "${node.label} · ${node.roleHint}",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = node.relation,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Text(
                        text = "Tap node",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyStateCard(
    icon: ImageVector,
    title: String,
    subtitle: String,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                color = PrimaryBlueContainer,
                shape = CircleShape,
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(28.dp))
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (!actionLabel.isNullOrBlank() && onAction != null) {
                Spacer(modifier = Modifier.height(14.dp))
                OutlinedButton(
                    onClick = onAction,
                    modifier = Modifier.defaultMinSize(minHeight = 48.dp)
                ) {
                    Text(actionLabel)
                }
            }
        }
    }
}
