package com.example.tipautomation.service;

import com.example.tipautomation.model.TipSession;
import com.example.tipautomation.repository.TipSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipSessionService {

    private final TipSessionRepository repository;
    private static final Logger logger = LoggerFactory.getLogger(TipSessionService.class);

    public TipSessionService(TipSessionRepository repository) {
        this.repository = repository;
    }

    public TipSession calculateTips(TipSession session) {
        TipCalculator.calculate(session);
        return session;
    }

    public TipSession saveSession(TipSession session) {
        // Validate session
        if (session == null || session.getEmployees() == null || session.getEmployees().isEmpty()) {
            throw new IllegalArgumentException("Session must have at least one employee");
        }

        if (session.getTotalTips() <= 0) {
            throw new IllegalArgumentException("Total tips must be greater than 0");
        }

        // Calculate total hours
        double totalHours = session.getEmployees().stream()
            .mapToDouble(e -> e.getHours())
            .sum();

        session.setTotalHours(totalHours);

        logger.info("Saving session: {} employees, {} total hours, ${} tips",
            session.getEmployees().size(), totalHours, session.getTotalTips());

        return repository.save(session);
    }

    public List<TipSession> getHistory() {

        return repository.findAll();
    }

    public boolean deleteSession(Long id) {
        try {
            if (repository.existsById(id)) {
                repository.deleteById(id);
                logger.info("Session with ID {} deleted successfully", id);
                return true;
            } else {
                logger.warn("Session with ID {} not found", id);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error deleting session with ID {}", id, e);
            throw new RuntimeException("Error deleting session", e);
        }
    }
}