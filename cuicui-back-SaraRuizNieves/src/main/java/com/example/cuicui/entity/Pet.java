package com.example.cuicui.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "PET")
public class Pet {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "OWNER_ID")
    private User user;

    @OneToMany(mappedBy = "pet")
    private List<Visit> visits;

    @Column(name = "NAME", nullable = false)
    private String petName;

    @Column(name = "BREED")
    private String breed;

    @Column(name = "DATE_BIRTH", nullable = false)
    private LocalDate dateBirth;

    @Column(name = "GENDER")
    private String gender;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Column(name = "PHOTO")
    private String photo;

    @Column(name = "DATE_ADOPTION")
    private LocalDate dateAdoption;

    @Column(name = "DATE_DISABLE")
    private LocalDate dateDisable;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}