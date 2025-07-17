// src/assets/js/cookie-consent.js

document.addEventListener('DOMContentLoaded', () => {
    const cookieConsentBanner = document.getElementById('cookie-consent-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const rejectButton = document.getElementById('cookie-reject'); // Optional, if you have a reject button
    const learnMoreLink = document.getElementById('cookie-learn-more'); // Optional

    const GA_ID = "{{ site.googleAnalyticsId }}"; // Nunjucks will inject the GA ID from site.json

    // Function to load Google Analytics script
    const loadGoogleAnalytics = () => {
        if (GA_ID && GA_ID !== "YOUR_GA_ID") { // Check if GA_ID is configured
            console.log("Loading Google Analytics...");
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', GA_ID, { 'anonymize_ip': {{ analyticsConsent.ipAnonymization | default(false) }} }); // Anonymize IP based on analyticsConsent.json
            };
        }
    };

    // Check if user has previously consented
    const hasConsented = localStorage.getItem('cookieConsent') === 'accepted';

    if (!hasConsented) {
        cookieConsentBanner.classList.remove('hidden'); // Show the banner if no consent
    } else {
        loadGoogleAnalytics(); // If already consented, load GA immediately
    }

    // Event listener for accept button
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsentBanner.classList.add('hidden');
            loadGoogleAnalytics();
            console.log('Cookie consent accepted.');
        });
    }

    // Event listener for reject button (optional)
    if (rejectButton) {
        rejectButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected'); // Or 'dismissed' if you want to allow showing again
            cookieConsentBanner.classList.add('hidden');
            console.log('Cookie consent rejected.');
            // No GA loaded or clear existing GA cookies if any
        });
    }

    // Event listener for "Learn More" link (optional)
    if (learnMoreLink) {
        learnMoreLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Redirect to privacy policy page or open a modal
            window.location.href = "{{ site.legalLinks[0].url | default('/privacy-policy/') }}"; // Assuming first legal link is privacy policy
        });
    }
});