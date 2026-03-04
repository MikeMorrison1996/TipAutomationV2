package com.example.tipautomation.model;

import jakarta.persistence.*;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double hours;
    private double tipShare;

    public Employee(){}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getHours() { return hours; }
    public void setHours(double hours) { this.hours = hours; }
    public double getTipShare() { return tipShare; }
    public void setTipShare(double tipShare) { this.tipShare = tipShare; }
}