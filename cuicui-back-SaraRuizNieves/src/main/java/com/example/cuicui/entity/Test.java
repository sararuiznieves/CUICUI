package com.example.cuicui.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "TEST")
public class Test {

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

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "TEST_DATE")
    private LocalDate testDate;

    @Column(name = "RESULT")
    private String result;

    @Column(name = "VET_NAME")
    private String vetName;

    @Column(name = "NOTES")
    private String notes;

    @Column(name = "FILE_NAME")
    private String fileName;

    @Column(name = "FILE_PATH")
    private String filePath;

    @Column(name = "FILE_TYPE")
    private String fileType;
}