package com.example.edbridge.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.edbridge.data.model.*
import com.example.edbridge.data.repository.EdBridgeRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ActionUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val lastSuccessMessage: String? = null
)

class EdBridgeViewModel(
    val repository: EdBridgeRepository = EdBridgeRepository()
) : ViewModel() {

    private val _actionState = MutableStateFlow(ActionUiState())
    val actionState: StateFlow<ActionUiState> = _actionState.asStateFlow()

    val role = repository.role
    val requests = repository.requests
    val impactEvents = repository.impactEvents
    val notifications = repository.notifications
    val joinedCommunities = repository.joinedCommunities
    val connections = repository.connections
    val mentorships = repository.mentorships
    val savedOpportunities = repository.savedOpportunities
    val appliedOpportunities = repository.appliedOpportunities
    val proofItems = repository.proofItems
    val onboarded = repository.onboarded
    val supporterStreakMonths = repository.supporterStreakMonths

    fun clearActionMessages() {
        _actionState.value = _actionState.value.copy(errorMessage = null, lastSuccessMessage = null)
    }

    fun submitFinancialSupport(
        requestId: String,
        amount: Long,
        privacy: Privacy,
        paymentRail: String,
        encouragementNote: String,
        onComplete: () -> Unit
    ) {
        if (amount < 1000L) {
            _actionState.value = _actionState.value.copy(errorMessage = "Minimum support amount is UGX 1,000.")
            return
        }
        viewModelScope.launch {
            _actionState.value = ActionUiState(isLoading = true)
            delay(550) // Simulated mobile-money / bursar settlement handshake
            repository.supportFinancially(requestId, amount, privacy, paymentRail, encouragementNote)
            _actionState.value = ActionUiState(
                isLoading = false,
                lastSuccessMessage = "Simulated bursar settlement recorded!"
            )
            onComplete()
        }
    }

    fun submitNonFinancialSupport(
        requestId: String,
        type: SupportType,
        privacy: Privacy,
        note: String,
        onComplete: () -> Unit
    ) {
        viewModelScope.launch {
            _actionState.value = ActionUiState(isLoading = true)
            delay(300)
            repository.offerSupport(requestId, type, privacy, note)
            _actionState.value = ActionUiState(
                isLoading = false,
                lastSuccessMessage = "${type.label} recorded in your Impact Passport."
            )
            onComplete()
        }
    }

    fun createSupportRequest(
        title: String,
        category: String,
        need: String,
        why: String,
        amountNeeded: Long?,
        deadlineDays: Int,
        supportTypes: List<SupportType>,
        disclosureLevel: DisclosureLevel,
        audienceScope: AudienceScope,
        disbursementMode: DisbursementMode,
        onSuccess: (String) -> Unit
    ) {
        viewModelScope.launch {
            _actionState.value = ActionUiState(isLoading = true)
            delay(400)
            val id = repository.createRequest(
                title = title,
                category = category,
                need = need,
                why = why,
                amountNeeded = amountNeeded,
                deadlineDays = deadlineDays,
                supportTypes = supportTypes,
                disclosureLevel = disclosureLevel,
                audienceScope = audienceScope,
                disbursementMode = disbursementMode
            )
            _actionState.value = ActionUiState(
                isLoading = false,
                lastSuccessMessage = "Request submitted for confidential verification!"
            )
            onSuccess(id)
        }
    }
}
