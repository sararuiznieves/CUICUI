package com.example.cuicui.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "MEDICINE")
public class Medicine {

    @Id
    @Column(name = "ID", nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PET_ID", nullable = false)
    private Pet pet;

    // Nombre del medicamento
    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "DOSE", nullable = false)
    private String dose;

    @Column(name = "FREQUENCY", nullable = false)
    private String frequency;

    @Column(name = "ACTIVE", nullable = false)
    private boolean active = true;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "VET_NAME")
    private String vetName;

    @Column(name = "NOTES")
    private String notes;
}