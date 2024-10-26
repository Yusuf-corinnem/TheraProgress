package com.stok_team.TheraProgress.controllers;

import com.stok_team.TheraProgress.models.Child;
import com.stok_team.TheraProgress.repositories.ChildRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/children")
public class ChildController {
    @Autowired
    private final ChildRepository childRepository;

    public ChildController(ChildRepository childRepository) {
        this.childRepository = childRepository;
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping
    public ResponseEntity<Iterable<Child>> getChildren() {
        return new ResponseEntity<>(childRepository.findAll(), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/{id}")
    public ResponseEntity<Child> getChildById(@PathVariable UUID id) {
        Optional<Child> child = childRepository.findById(id);
        return child.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @CrossOrigin(origins = "http://localhost:63342")
//    @GetMapping
//    public int getChildren() {
//        return 1;
//    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping
    public ResponseEntity<Child> postChild(@RequestBody Child child) {
        return new ResponseEntity<>(childRepository.save(child), HttpStatus.CREATED);
    }
}
