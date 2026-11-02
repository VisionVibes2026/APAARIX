package com.apaarix.integration;

import com.apaarix.enums.VerificationStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.regex.Pattern;

@Component
public class MockApaarAdapter {

    private static final Pattern APAAR_PATTERN = Pattern.compile("^(\\d{4}[- ]?\\d{4}[- ]?\\d{4})$");

    public static class VerificationResult {
        private final VerificationStatus status;
        private final double confidence;
        private final String message;
        private final Instant timestamp;

        public VerificationResult(VerificationStatus status, double confidence, String message) {
            this.status = status;
            this.confidence = confidence;
            this.message = message;
            this.timestamp = Instant.now();
        }

        public VerificationStatus getStatus() { return status; }
        public double getConfidence() { return confidence; }
        public String getMessage() { return message; }
        public Instant getTimestamp() { return timestamp; }
    }

    public boolean validateFormat(String apaarId) {
        if (apaarId == null) return false;
        return APAAR_PATTERN.matcher(apaarId.trim()).matches();
    }

    public String normalize(String apaarId) {
        if (apaarId == null) return null;
        String clean = apaarId.replaceAll("[^0-9]", "");
        if (clean.length() == 12) {
            return clean.substring(0, 4) + "-" + clean.substring(4, 8) + "-" + clean.substring(8, 12);
        }
        return apaarId;
    }

    public VerificationResult verifyWithGateway(String apaarId, String studentName) {
        if (apaarId == null || !validateFormat(apaarId)) {
            return new VerificationResult(
                    VerificationStatus.INVALID,
                    0.0,
                    "Invalid APAAR ID format. Expected 12 numeric digits (XXXX-XXXX-XXXX)."
            );
        }

        String rawDigits = apaarId.replaceAll("[^0-9]", "");

        // Mock test triggers for demo & edge-case validation:
        if (rawDigits.startsWith("9999")) {
            return new VerificationResult(
                    VerificationStatus.INVALID,
                    0.10,
                    "APAAR ID not registered in Academic Bank of Credits (ABC) repository."
            );
        }

        if (rawDigits.startsWith("8888")) {
            return new VerificationResult(
                    VerificationStatus.MANUAL_REVIEW,
                    0.65,
                    "Name discrepancy detected: College record '" + studentName + "' does not match verified name in APAAR registry."
            );
        }

        if (rawDigits.startsWith("0000")) {
            return new VerificationResult(
                    VerificationStatus.API_UNAVAILABLE,
                    0.0,
                    "DigiLocker / ABC gateway timeout during simulated verification probe."
            );
        }

        // Default: Successfully verified
        return new VerificationResult(
                VerificationStatus.VERIFIED,
                0.98,
                "APAAR record verified with Academic Bank of Credits (ABC). Full student identity confirmed."
        );
    }
}

