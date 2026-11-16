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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.edbridge.ui.theme.*

@Composable
fun AboutScreen(
    onTryStudentFlow: () -> Unit,
    onTrySupporterFlow: () -> Unit,
    onTryOrgFlow: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("About Ed-Bridge", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.ExtraBold)
                Text(
                    text = "We rise by lifting others — without forcing students to broadcast personal hardship to the public.",
                    style = MaterialTheme.typography.titleSmall,
                    color = PrimaryBlue,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "Traditional crowdfunding forces students into a painful privacy paradox: expose your financial struggle to classmates or drop out quietly. Ed-Bridge solves this by verifying enrollment & invoices privately, protecting identity with Shielded Aliases (#EB-402), routing help through real academic & alumni circles, and settling funds directly to university bursars or hostel custodians.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        AboutPillarCard(
            icon = Icons.Default.VisibilityOff,
            title = "1. Dignified & Shielded Aid",
            body = "Students choose Shielded Alias + Alumni-Only scope so classmates never see their financial request, while alumni trust the 4-step verification badge."
        )
        AboutPillarCard(
            icon = Icons.Default.Handshake,
            title = "2. Six Ways to Help Beyond Cash",
            body = "Financial settlement is only one path. Supporters also mentor, lend spare laptops, refer paid campus gigs, share internships, and amplify within trusted circles."
        )
        AboutPillarCard(
            icon = Icons.Default.Repeat,
            title = "3. Built for Ongoing Attachment",
            body = "Students stay weekly for paid campus opportunities & peer mentorship; supporters build a Verified Impact Passport & consistency streak; organizations pay for cohort audit & matching SaaS."
        )

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(
                onClick = onTryStudentFlow,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 48.dp).testTag("about_try_student_btn")
            ) {
                Text("Try Student Shielded Flow")
            }
            OutlinedButton(
                onClick = onTrySupporterFlow,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 48.dp).testTag("about_try_supporter_btn")
            ) {
                Text("Try Supporter Impact Flow")
            }
            OutlinedButton(
                onClick = onTryOrgFlow,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().defaultMinSize(minHeight = 48.dp)
            ) {
                Text("Try Organization Cohort SaaS")
            }
        }
    }
}

@Composable
private fun AboutPillarCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    body: String
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(14.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            Surface(color = ShieldIndigoContainer, shape = RoundedCornerShape(10.dp)) {
                Icon(icon, contentDescription = null, tint = ShieldIndigo, modifier = Modifier.padding(8.dp).size(20.dp))
            }
            Column {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(3.dp))
                Text(body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}
