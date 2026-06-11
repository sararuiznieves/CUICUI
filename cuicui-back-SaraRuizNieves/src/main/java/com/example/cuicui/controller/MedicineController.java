package com.example.cuicui.controller;

import com.example.cuicui.controller.exception.InvalidInputException;
import com.example.cuicui.controller.exception.NotFoundException;
import com.example.cuicui.dto.request.MedicineRequest;
import com.example.cuicui.dto.response.MedicineResponse;
import com.example.cuicui.mapper.MedicineMapper;
import com.example.cuicui.service.MedicineServiceAdapter;
import com.example.cuicui.service.PetServiceAdapter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pet")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicineController {

  private static final Logger logger = LoggerFactory.getLogger(MedicineController.class);

  @Autowired
  private MedicineServiceAdapter medicineServiceAdapter;
  @Autowired
  private PetServiceAdapter petServiceAdapter;
  @Autowired
  MedicineMapper medicineMapper;

  @Operation(
    summary = "Get pet's medicine",
    description = "Returns all the medicines of a pet",
    responses = {
      @ApiResponse(responseCode = "200", description = "Medicines successfully retrieved"),
      @ApiResponse(responseCode = "403", description = "Invalid or expired session"),
      @ApiResponse(responseCode = "400", description = "Invalid request input"),
      @ApiResponse(responseCode = "404", description = "None medicine was found for this pet"),
      @ApiResponse(responseCode = "500", description = "Internal server error")
    }
  )
  @GetMapping("{petId}/medicine")
  public ResponseEntity<List<MedicineResponse>> findMedicineByPetId(
          @PathVariable("petId") UUID petId
  ) {

    List<MedicineResponse> meds = medicineServiceAdapter.findAllByPetId(petId);

    return ResponseEntity.ok(meds);
  }

  @Operation(
    summary = "Creates medicine",
    description = "Creates a medicine for the pet.",
    responses = {
      @ApiResponse(responseCode = "200", description = "Medicine successfully created"),
      @ApiResponse(responseCode = "403", description = "Invalid or expired session"),
      @ApiResponse(responseCode = "400", description = "Invalid request input"),
      @ApiResponse(responseCode = "404", description = "None pet was found"),
      @ApiResponse(responseCode = "500", description = "Internal server error")
    }
  )
  @PostMapping("{petId}/medicine")
  public ResponseEntity<MedicineResponse> createMedicine(@PathVariable("petId") UUID
                                                           petId, @RequestBody MedicineRequest medRequest)
    throws InvalidInputException, NotFoundException {
    logger.info("Received create medicine request with pet id: {}", petId);

    MedicineResponse medicine = medicineServiceAdapter.save(medRequest, petId);


    return ResponseEntity.status(HttpStatus.CREATED).body(medicine);
  }

  @Operation(
    summary = "Ends medicine",
    description = "Puts an end to the medicine's field endDate.",
    responses = {
      @ApiResponse(responseCode = "200", description = "Medicine successfully ended"),
      @ApiResponse(responseCode = "403", description = "Invalid or expired session"),
      @ApiResponse(responseCode = "400", description = "Invalid request input"),
      @ApiResponse(responseCode = "404", description = "None pet was found"),
      @ApiResponse(responseCode = "500", description = "Internal server error")
    }
  )
  @PutMapping("/medicine/{medicineId}/end")
  public ResponseEntity<MedicineResponse> endMedicine(@PathVariable("medicineId") UUID medicineID)
    throws InvalidInputException, NotFoundException {
    logger.info("Received end medicine request with id: {}", medicineID);

    MedicineResponse medicine = medicineServiceAdapter.endMedicine(medicineID);

    return ResponseEntity.status(HttpStatus.OK).body(medicine);
  }

  @PutMapping("/medicine/{medicineId}")
  public ResponseEntity<MedicineResponse> updateMedicine(
          @PathVariable("medicineId") UUID medicineId,
          @RequestBody MedicineRequest medRequest
  ) throws NotFoundException {
    logger.info("Received update medicine request with id: {}", medicineId);

    MedicineResponse medicine = medicineServiceAdapter.update(medicineId, medRequest);

    return ResponseEntity.status(HttpStatus.OK).body(medicine);
  }

  @PutMapping("/medicine/{medicineId}/reactivate")
  public ResponseEntity<MedicineResponse> reactivateMedicine(
          @PathVariable("medicineId") UUID medicineId
  ) throws NotFoundException {
    logger.info("Received reactivate medicine request with id: {}", medicineId);

    MedicineResponse medicine = medicineServiceAdapter.reactivateMedicine(medicineId);

    return ResponseEntity.status(HttpStatus.OK).body(medicine);
  }

  @DeleteMapping("/medicine/{medicineId}")
  public ResponseEntity<Void> deleteMedicine(
          @PathVariable("medicineId") UUID medicineId
  ) throws NotFoundException {
    logger.info("Received delete medicine request with id: {}", medicineId);

    medicineServiceAdapter.deleteMedicine(medicineId);

    return ResponseEntity.noContent().build();
  }
}
