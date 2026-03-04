package com.example.tipautomation.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class TipSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String date;

    private double totalTips;

    private double totalHours;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Employee> employees;

    public TipSession(){}

    public Long getId() { return id; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public double getTotalTips() { return totalTips; }
    public void setTotalTips(double totalTips) { this.totalTips = totalTips; }
    public double getTotalHours() { return totalHours; }
    public void setTotalHours(double totalHours) { this.totalHours = totalHours; }
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
}