class ShareManager {
    constructor() {
        this.modal = null;
        this.shareButton = null;
        this.urlInput = null;
        this.copyButton = null;
        this.qrContainer = null;
        this.currentURL = '';
    }

    init() {
        this.modal = document.getElementById('share-modal');
        this.shareButton = document.getElementById('share-button');
        this.urlInput = document.getElementById('share-url');
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
            // Parse the datetime-local input value
            const targetDate = new Date(targetDateTimeInput.value);

            // Format as ISO string (e.g., "2025-12-04T06:30:00")
            const isoString = targetDate.toISOString().slice(0, 19);

            // Build the shareable URL
            const baseURL = window.location.origin + window.location.pathname;
            const params = new URLSearchParams();
            params.set('time', isoString);

            // Include title if one exists in current URL
            const currentParams = new URLSearchParams(window.location.search);
            const title = currentParams.get('title');
            if (title) {
                params.set('title', title);
            }

            this.currentURL = `${baseURL}?${params.toString()}`;
        }

        if (this.urlInput) {
            this.urlInput.value = this.currentURL;
        }
    }

    openModal() {
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
