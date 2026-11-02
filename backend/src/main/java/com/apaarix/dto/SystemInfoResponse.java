package com.apaarix.dto;

import java.time.Instant;
import java.util.Map;

public class SystemInfoResponse {

    private String name;
    private String version;
    private String environment;
    private String status;
    private Instant serverTime;
    private String activeProfile;
    private Map<String, Object> database;
    private Map<String, Object> memory;

    public SystemInfoResponse() {
        this.serverTime = Instant.now();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getServerTime() {
        return serverTime;
    }

    public void setServerTime(Instant serverTime) {
        this.serverTime = serverTime;
    }

    public String getActiveProfile() {
        return activeProfile;
    }

    public void setActiveProfile(String activeProfile) {
        this.activeProfile = activeProfile;
    }

    public Map<String, Object> getDatabase() {
        return database;
    }

    public void setDatabase(Map<String, Object> database) {
        this.database = database;
    }

    public Map<String, Object> getMemory() {
        return memory;
    }

    public void setMemory(Map<String, Object> memory) {
        this.memory = memory;
    }
}

