package com.example.edbridge.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    onPrimary = Color.White,
    primaryContainer = PrimaryBlueContainer,
    onPrimaryContainer = OnPrimaryBlueContainer,
    secondary = ConnectionViolet,
    onSecondary = Color.White,
    secondaryContainer = ConnectionVioletContainer,
    onSecondaryContainer = OnConnectionVioletContainer,
    tertiary = CyanAccent,
    onTertiary = Color.White,
    tertiaryContainer = CyanAccentContainer,
    background = BgLight,
    onBackground = TextPrimary,
    surface = SurfaceLight,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceVariantLight,
    onSurfaceVariant = TextMuted,
    outline = BorderLight,
    outlineVariant = BorderLight.copy(alpha = 0.6f),
    error = ErrorRed,
    onError = Color.White,
    errorContainer = ErrorRedContainer
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF7D93FF),
    onPrimary = Color(0xFF101C5C),
    primaryContainer = Color(0xFF20307A),
    onPrimaryContainer = Color(0xFFE0E7FF),
    secondary = Color(0xFFA78BFA),
    onSecondary = Color(0xFF2E1065),
    secondaryContainer = Color(0xFF4C1D95),
    onSecondaryContainer = Color(0xFFEDE9FE),
    tertiary = Color(0xFF38BDF8),
    background = BgDark,
    onBackground = TextPrimaryDark,
    surface = SurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = TextMutedDark,
    outline = BorderDark,
    outlineVariant = BorderDark.copy(alpha = 0.6f),
    error = Color(0xFFF87171),
    onError = Color(0xFF450A0A)
)

@Composable
fun EdBridgeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
