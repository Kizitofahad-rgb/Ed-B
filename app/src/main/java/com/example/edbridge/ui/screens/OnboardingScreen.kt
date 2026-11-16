package com.example.edbridge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.ui.theme.*
import com.example.edbridge.ui.viewmodel.EdBridgeViewModel

@Composable
fun OnboardingScreen(
    viewModel: EdBridgeViewModel,
    onFinished: () -> Unit
) {
    var step by remember { mutableStateOf(0) }
    var name by remember { mutableStateOf("Kizito Fahad") }
    var institution by remember { mutableStateOf("Makerere University — CoCIS") }
    var field by remember { mutableStateOf("BSc Computer Science, Year 2") }
    var secondarySchool by remember { mutableStateOf("Busia Secondary School") }
    var bio by remember { mutableStateOf("Second-year CS student organizing weekend peer coding sessions.") }
    var defaultShielded by remember { mutableStateOf(true) }
    var studentIdAttached by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    val steps = listOf("Identity", "Education", "Dignity & Privacy", "Verification")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Join Ed-Bridge Verified", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.ExtraBold)
        Text(
            text = "Step ${step + 1} of 4 · ${steps[step]}",
            style = MaterialTheme.typography.labelLarge,
            color = PrimaryBlue
        )

        LinearProgressIndicator(
            progress = { (step + 1) / 4f },
            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(50)),
            color = PrimaryBlue
        )

        Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                when (step) {
                    0 -> {
                        Text("Who are you?", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it; error = null },
                            label = { Text("Full Legal Name (kept private if Shielded)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth().testTag("onboard_name_input")
                        )
                        OutlinedTextField(
                            value = bio,
                            onValueChange = { bio = it },
                            label = { Text("Short bio & interests") },
                            minLines = 2,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    1 -> {
                        Text("Your Real Academic Circles", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Ed-Bridge connects you automatically with your college, course, and secondary school alumni.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        OutlinedTextField(
                            value = institution,
                            onValueChange = { institution = it; error = null },
                            label = { Text("University & College") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = field,
                            onValueChange = { field = it; error = null },
                            label = { Text("Course & Year") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = secondarySchool,
                            onValueChange = { secondarySchool = it },
                            label = { Text("Secondary School Alumni Circle") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    2 -> {
                        Text("Dignity & Privacy Default", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Choose how you appear if you ever ask for tuition or sustenance support.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)

                        Surface(
                            color = if (defaultShielded) ShieldIndigoContainer else MaterialTheme.colorScheme.surfaceVariant,
                            shape = RoundedCornerShape(14.dp),
                            border = BorderStroke(1.dp, if (defaultShielded) ShieldIndigo else MaterialTheme.colorScheme.outline),
                            onClick = { defaultShielded = true }
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Icon(Icons.Default.VisibilityOff, contentDescription = null, tint = ShieldIndigo)
                                Column(modifier = Modifier.weight(1f)) {
                                    Text("Shielded Alias Default (Recommended)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = ShieldIndigo)
                                    Text("Hide your real name & photo from classmates. Only verified alumni & bursar staff see verified credentials.", fontSize = 11.sp, color = ShieldIndigo.copy(alpha = 0.85f))
                                }
                                RadioButton(selected = defaultShielded, onClick = { defaultShielded = true })
                            }
                        }

                        Surface(
                            color = if (!defaultShielded) PrimaryBlueContainer else MaterialTheme.colorScheme.surfaceVariant,
                            shape = RoundedCornerShape(14.dp),
                            border = BorderStroke(1.dp, if (!defaultShielded) PrimaryBlue else MaterialTheme.colorScheme.outline),
                            onClick = { defaultShielded = false }
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Icon(Icons.Default.Groups, contentDescription = null, tint = PrimaryBlue)
                                Column(modifier = Modifier.weight(1f)) {
                                    Text("Circle Trusted Profile", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    Text("Show your name inside your college & secondary school alumni circles.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                RadioButton(selected = !defaultShielded, onClick = { defaultShielded = false })
                            }
                        }
                    }
                    3 -> {
                        Text("Confidential Verification", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Documents are inspected by human reviewers only and never published.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Surface(
                            color = SuccessGreenContainer.copy(alpha = 0.5f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Icon(Icons.Default.Badge, contentDescription = null, tint = OnSuccessGreenContainer)
                                    Column {
                                        Text("Makerere Student ID", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text("MAK_ID_2026_VERIFIED.pdf", fontSize = 11.sp, color = OnSuccessGreenContainer)
                                    }
                                }
                                Checkbox(checked = studentIdAttached, onCheckedChange = { studentIdAttached = it })
                            }
                        }
                    }
                }

                if (error != null) {
                    Text(error!!, color = ErrorRed, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (step > 0) {
                OutlinedButton(
                    onClick = { step -= 1 },
                    modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp)
                ) {
                    Text("Back")
                }
            }
            Button(
                onClick = {
                    if (step == 0 && name.trim().length < 2) {
                        error = "Please enter your name."
                        return@Button
                    }
                    if (step == 1 && (institution.isBlank() || field.isBlank())) {
                        error = "Please enter your university and course."
                        return@Button
                    }
                    if (step == 3 && !studentIdAttached) {
                        error = "Attach a Student ID check to complete verification."
                        return@Button
                    }
                    if (step < 3) {
                        step += 1
                    } else {
                        viewModel.repository.completeOnboarding(
                            name = name.trim(),
                            institution = institution.trim(),
                            field = field.trim(),
                            bio = bio.trim(),
                            defaultShielded = defaultShielded
                        )
                        onFinished()
                    }
                },
                modifier = Modifier.weight(1f).defaultMinSize(minHeight = 48.dp).testTag("onboarding_next_btn")
            ) {
                Text(if (step < 3) "Continue" else "Complete Verification")
            }
        }
    }
}
