for (const validationRequest of groupedValidationRequests[tenantId]) {
	const emailStatus = emailStatuses.find((es) => es.email === validationRequest.toAddress)
	const toEmail = validationRequest.toAddress
	const emailDomain = this.extractDomain(toEmail)?.trim().toLowerCase()
	if (!isEmpty(blockedDomains) && blockedDomains.includes(emailDomain)) {
		console.log(
			Marking email ${ toEmail } as invalid (blocked domain: ${ emailDomain }),
	  )
		invalidResults.push({ ...validationRequest, isValid: false })
		// eslint-disable-next-line no-continue
		continue
	}

	const emailStatus = emailStatuses.find((es) => es.email === toEmail)
	if (emailStatus?.doubleOptInState === DoubleOptInState.Approved) {
		validResults.push({ ...validationRequest, isValid: true })
	} else {
		invalidResults.push({ ...validationRequest, isValid: false })
	}
}