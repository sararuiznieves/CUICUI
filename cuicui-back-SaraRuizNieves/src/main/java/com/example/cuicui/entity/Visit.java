package com.example.cuicui.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "VISIT")
public class Visit {

    @Id
    @GeneratedValue
    @Column(name = "ID", nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "PET_ID", nullable = false)
    private Pet pet;

    @Column(name = "VET_NAME", nullable = false)
    private String vetName;

    @Column(name = "DATE_VISIT", nullable = false)
    private LocalDate date;

    @Column(name = "TIME_VISIT", nullable = false)
    private LocalTime time;

    @Column(name = "NOTES", length = 1000)
    private String notes;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Column(name = "FINISHED", nullable = false)
    private Boolean finished = false;
}
