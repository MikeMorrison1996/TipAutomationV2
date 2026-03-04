package com.example.tipautomation.service;

import com.example.tipautomation.model.Employee;
import com.example.tipautomation.model.TipSession;

public class TipCalculator {

    public static TipSession calculate(TipSession session) {

        double totalHours = 0;

        for (Employee employee : session.getEmployees()) {
            totalHours += employee.getHours();
        }

        session.setTotalHours(totalHours);

        for (Employee employee : session.getEmployees()) {

            double share = (employee.getHours() / totalHours) * session.getTotalTips();

            employee.setTipShare(Math.round(share * 100.0) / 100.0);
        }

        return session;
    }
}