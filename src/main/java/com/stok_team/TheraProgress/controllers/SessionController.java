package com.stok_team.TheraProgress.controllers;

import com.stok_team.TheraProgress.models.Child;
import com.stok_team.TheraProgress.models.Session;
import com.stok_team.TheraProgress.repositories.ChildRepository;
import com.stok_team.TheraProgress.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/sessions")
public class SessionController {
    @Autowired
    private final SessionRepository sessionRepository;

    @Autowired
    private final ChildRepository childRepository;

    public SessionController(SessionRepository sessionRepository, ChildRepository childRepository) {
        this.sessionRepository = sessionRepository;
        this.childRepository = childRepository;
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping
    public ResponseEntity<Iterable<Session>> getSession() {
        return new ResponseEntity<>(sessionRepository.findAll(), HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping(params = "childId")
    public ResponseEntity<Iterable<Session>> getSessionsByChildId(@RequestParam UUID childId) {
        // Найдем ребенка по childId
        Optional<Child> childOptional = childRepository.findById(childId);
        if (!childOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Найдем все сессии, связанные с этим ребенком
        Iterable<Session> sessions = sessionRepository.findByChild(childOptional.get());

        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping
    public ResponseEntity<Session> postSession(@RequestBody Session session) {
        // Найдем ребенка по child_id
        Optional<Child> childOptional = childRepository.findById(session.getChildId());
        if (!childOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Установим связь с ребенком
        session.setChild(childOptional.get());

        // Сохраним сессию
        return new ResponseEntity<>(sessionRepository.save(session), HttpStatus.CREATED);
    }
}