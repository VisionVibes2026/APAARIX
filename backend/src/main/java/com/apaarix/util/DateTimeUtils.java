package com.apaarix.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class DateTimeUtils {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_INSTANT;

    private DateTimeUtils() {
    }

    public static String formatIso(Instant instant) {
        return instant != null ? ISO_FORMATTER.format(instant) : null;
    }

    public static String formatIndianStandardTime(Instant instant) {
        if (instant == null) return null;
        DateTimeFormatter istFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                .withZone(ZoneId.of("Asia/Kolkata"));
        return istFormatter.format(instant);
    }
}

