class ShareManager {
    constructor() {
        this.modal = null;
        this.shareButton = null;
        this.urlInput = null;
        this.titleInput = null;
        this.copyButton = null;
        this.qrContainer = null;
        this.currentURL = '';
    }

    init() {
        this.modal = document.getElementById('share-modal');
        this.shareButton = document.getElementById('share-button');
        this.urlInput = document.getElementById('share-url');
        this.titleInput = document.getElementById('share-title');
        this.copyButton = document.getElementById('copy-button');
        this.qrContainer = document.getElementById('qr-code');

        if (!this.modal || !this.shareButton) {
            console.warn('Share elements not found in DOM');
            return;
        }

        this.setupEventListeners();
        this.updateURL();
    }

    setupEventListeners() {
        // Open modal
        this.shareButton.addEventListener('click', () => {
            this.openModal();
        });

        // Copy button
        this.copyButton.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Title input - update URL as user types
        if (this.titleInput) {
            this.titleInput.addEventListener('input', () => {
                this.updateURL();
                this.generateQRCode();
            });
        }

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on X button
        const closeButton = this.modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    updateURL() {
        // Get the target datetime from the input field
        const targetDateTimeInput = document.getElementById('targetDateTime');

        if (!targetDateTimeInput || !targetDateTimeInput.value) {
            // Fallback to current URL if no date is set
            this.currentURL = window.location.href;
        } else {
            // Use the datetime-local value directly (already in correct format)
            // datetime-local format: "YYYY-MM-DDTHH:mm" (local time, no timezone conversion!)
            const localDateTime = targetDateTimeInput.value;

            // Add seconds if not present
            const timeString = localDateTime.includes(':') && localDateTime.split(':').length === 2
                ? localDateTime + ':00'
                : localDateTime;

            // Get user's current timezone offset
            // getTimezoneOffset() returns minutes OPPOSITE of GMT offset
            // (e.g., GMT+13 returns -780, so we need to negate and convert to hours)
            const offsetMinutes = -new Date().getTimezoneOffset();
            const offsetHours = Math.floor(offsetMinutes / 60);
            const offsetMins = Math.abs(offsetMinutes % 60);

            // Format as "+13" or "-5" or "+5:30"
            const timezoneString = offsetMins === 0
                ? `${offsetHours >= 0 ? '+' : ''}${offsetHours}`
                : `${offsetHours >= 0 ? '+' : ''}${offsetHours}:${String(offsetMins).padStart(2, '0')}`;

            // Build the shareable URL
            const baseURL = window.location.origin + window.location.pathname;
            const params = new URLSearchParams();
            params.set('time', timeString);
            params.set('tz', timezoneString);

            // Include title from the title input field if one is entered
            if (this.titleInput && this.titleInput.value.trim()) {
                params.set('title', this.titleInput.value.trim());
            }

            this.currentURL = `${baseURL}?${params.toString()}`;
        }

        if (this.urlInput) {
            this.urlInput.value = this.currentURL;
        }
    }

    openModal() {
        // Pre-fill title input with existing title from URL if present
        const currentParams = new URLSearchParams(window.location.search);
        const existingTitle = currentParams.get('title');
        if (this.titleInput && existingTitle) {
            this.titleInput.value = decodeURIComponent(existingTitle);
        }

        this.updateURL();
        this.generateQRCode();
        this.modal.classList.add('show');

        // Select the URL for easy copying
        if (this.urlInput) {
            this.urlInput.select();
        }
    }

    closeModal() {
        this.modal.classList.remove('show');
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.currentURL);
            this.showCopyFeedback();
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback: select the text
            if (this.urlInput) {
                this.urlInput.select();
                document.execCommand('copy');
                this.showCopyFeedback();
            }
        }
    }

    showCopyFeedback() {
        const originalText = this.copyButton.textContent;
        this.copyButton.textContent = '✓ Copied!';
        this.copyButton.classList.add('copied');

        setTimeout(() => {
            this.copyButton.textContent = originalText;
            this.copyButton.classList.remove('copied');
        }, 2000);
    }

    generateQRCode() {
        // Clear previous QR code
        this.qrContainer.innerHTML = '';

        // Generate new QR code using qrcodejs
        if (typeof QRCode !== 'undefined') {
            new QRCode(this.qrContainer, {
                text: this.currentURL,
                width: 200,
                height: 200,
                colorDark: '#2c3e50',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        } else {
            console.warn('QRCode library not loaded');
            this.qrContainer.innerHTML = '<p style="color: #666;">QR code unavailable</p>';
        }
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShareManager;
}
