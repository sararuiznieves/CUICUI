package com.example.cuicui.config;

import com.example.cuicui.entity.Medicine;
import com.example.cuicui.entity.Pet;
import com.example.cuicui.entity.User;
import com.example.cuicui.entity.Visit;
import com.example.cuicui.repository.MedicineRepository;
import com.example.cuicui.repository.PetRepository;
import com.example.cuicui.repository.UserRepository;
import com.example.cuicui.repository.VisitRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DBInitializer {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final VisitRepository visitRepository;
    private final MedicineRepository medicineRepository;

    @Autowired
    public DBInitializer(
            UserRepository userRepository,
            PetRepository petRepository,
            VisitRepository visitRepository,
            MedicineRepository medicineRepository
    ) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.visitRepository = visitRepository;
        this.medicineRepository = medicineRepository;
    }

    @PostConstruct
    public void onInit() {
        initDatabase();
    }

    @Transactional
    public void initDatabase() {
        if (!userRepository.existsByEmail("test@gmail.com")) {
            User user1 = new User();
            user1.setEmail("test@gmail.com");
            user1.setPassword("PASSWORD");
            user1.setName("Usuario Test");
            User johnDoe = userRepository.save(user1);

            User user2 = new User();
            user2.setEmail("test2@gmail.com");
            user2.setPassword("PASSWORD");
            user2.setName("Usuario Test 2");
            userRepository.save(user2);

            // Crear pet
            Pet pet1 = new Pet();
            pet1.setPetName("Pet 1");
            pet1.setBreed("Breed 1");
            pet1.setUser(johnDoe);
            pet1.setGender("Female");
            pet1.setDateBirth(LocalDate.now().minusYears(3));
            pet1.setPhoto("c009d371-d19a-4ca8-9fd6-f3f6c1901568.jpg");
            pet1 = petRepository.save(pet1);

            // Crear visita
            Visit visit1 = new Visit();
            visit1.setPet(pet1);
            visit1.setVetName("Anjana");
            visit1.setDate(LocalDate.now().plusDays(2));
            visit1.setTime(LocalTime.of(10, 30));
            visit1.setNotes("Revisión general");
            visitRepository.save(visit1);

            // Crear medicina
            Medicine med1 = new Medicine();
            med1.setName("Medicina 1");
            med1.setDose("50g");
            med1.setFrequency("12 horas");
            med1.setActive(true);
            med1.setStartDate(LocalDate.now().minusDays(1));
            med1.setEndDate(null);
            med1.setPet(pet1);
            medicineRepository.save(med1);

            System.out.println("User created: " + johnDoe.getEmail() + " with id: " + johnDoe.getId());
            System.out.println("Pet created: " + pet1.getPetName() + " with id: " + pet1.getId() + " fecha muerte: " + pet1.getDateDisable());
            System.out.println("Base de datos inicializada con datos de prueba");
        }
    }
}