package com.example.edbridge.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.R
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onFinish: () -> Unit
) {
    var startAnim by remember { mutableStateOf(false) }

    val logoScale by animateFloatAsState(
        targetValue = if (startAnim) 1f else 0.82f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "splash_logo_scale"
    )

    val logoAlpha by animateFloatAsState(
        targetValue = if (startAnim) 1f else 0f,
        animationSpec = tween(durationMillis = 520, easing = FastOutSlowInEasing),
        label = "splash_logo_alpha"
    )

    val textAlpha by animateFloatAsState(
        targetValue = if (startAnim) 1f else 0f,
        animationSpec = tween(durationMillis = 600, delayMillis = 260, easing = FastOutSlowInEasing),
        label = "splash_text_alpha"
    )

    val textOffsetY by animateDpAsState(
        targetValue = if (startAnim) 0.dp else 18.dp,
        animationSpec = tween(durationMillis = 600, delayMillis = 260, easing = FastOutSlowInEasing),
        label = "splash_text_offset"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "splash_glow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.20f,
        targetValue = 0.45f,
        animationSpec = infiniteRepeatable(
            animation = tween(1300, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow_pulse"
    )

    LaunchedEffect(Unit) {
        startAnim = true
        delay(1850)
        onFinish()
    }

    val mintAccent = Color(0xFF6EE7B7)
    val deepNavyTop = Color(0xFF0B1222)
    val deepNavyBottom = Color(0xFF131F3E)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(deepNavyTop, deepNavyBottom, deepNavyTop)
                )
            )
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onFinish
            )
            .systemBarsPadding()
            .testTag("splash_screen_root")
    ) {
        // Soft ambient mint-indigo radial aura behind the monogram
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .offset(y = (-42).dp)
                .size(240.dp)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            mintAccent.copy(alpha = glowAlpha),
                            Color(0xFF2845D6).copy(alpha = 0.16f),
                            Color.Transparent
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(horizontal = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Refined Broken-Spine Logo Tile
            Surface(
                shape = RoundedCornerShape(32.dp),
                color = Color(0xFF0B1222),
                border = BorderStroke(1.2.dp, mintAccent.copy(alpha = 0.35f)),
                shadowElevation = 20.dp,
                modifier = Modifier
                    .size(134.dp)
                    .scale(logoScale)
                    .alpha(logoAlpha)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.img_edbridge_logo),
                    contentDescription = "Ed-Bridge monogram logo",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Spacer(modifier = Modifier.height(26.dp))

            // Wordmark & Tagline
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .offset(y = textOffsetY)
                    .alpha(textAlpha)
            ) {
                Text(
                    text = buildAnnotatedString {
                        withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.ExtraBold)) {
                            append("Ed")
                        }
                        withStyle(SpanStyle(color = mintAccent, fontWeight = FontWeight.ExtraBold)) {
                            append("-")
                        }
                        withStyle(SpanStyle(color = Color.White, fontWeight = FontWeight.ExtraBold)) {
                            append("Bridge")
                        }
                    },
                    fontSize = 34.sp,
                    letterSpacing = (-0.5).sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Connect · Support · Grow",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFFCBD5E1),
                    letterSpacing = 0.6.sp
                )

                Spacer(modifier = Modifier.height(20.dp))

                Surface(
                    color = mintAccent.copy(alpha = 0.12f),
                    shape = RoundedCornerShape(50),
                    border = BorderStroke(1.dp, mintAccent.copy(alpha = 0.28f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.VerifiedUser,
                            contentDescription = null,
                            tint = mintAccent,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = "Private & Verified Student Safety Net",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = mintAccent
                        )
                    }
                }
            }
        }

        // Bottom subtle pulse & brand footer
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 28.dp)
                .alpha(textAlpha),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            LinearProgressIndicator(
                modifier = Modifier
                    .width(96.dp)
                    .height(3.dp)
                    .clip(RoundedCornerShape(50)),
                color = mintAccent,
                trackColor = Color.White.copy(alpha = 0.12f)
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "Starting at Makerere University",
                fontSize = 11.sp,
                color = Color(0xFF94A3B8),
                fontWeight = FontWeight.Medium
            )
        }
    }
}
