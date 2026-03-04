package com.example.tipautomation.controller;

import com.example.tipautomation.model.TipSession;
import com.example.tipautomation.service.TipSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TipController {

    private final TipSessionService service;
    private static final Logger logger = LoggerFactory.getLogger(TipController.class);

    public TipController(TipSessionService service) {
        this.service = service;
    }

    @PostMapping("/calculate")
    public TipSession calculate(@RequestBody TipSession session) {
        return service.calculateTips(session);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody TipSession session) {
        try {
            logger.info("Saving session with {} employees and ${} tips",
                session.getEmployees().size(), session.getTotalTips());

            TipSession saved = service.saveSession(session);

            logger.info("Session saved successfully with ID: {}", saved.getId());
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            logger.error("Error saving session", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to save session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        try {
            logger.info("Deleting session with ID: {}", id);

            boolean deleted = service.deleteSession(id);

            if (deleted) {
                logger.info("Session deleted successfully");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Session deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Session not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            logger.error("Error deleting session", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> history() {
        try {
            List<TipSession> sessions = service.getHistory();
            logger.info("Retrieved {} sessions from history", sessions.size());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            logger.error("Error retrieving history", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}