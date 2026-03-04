package com.example.tipautomation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String mainPage() {

        return "main";
    }

    @GetMapping("/history")
    public String historyPage() {

        return "history";
    }
}