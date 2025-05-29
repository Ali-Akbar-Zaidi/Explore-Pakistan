package com.example.demo.service;

import java.util.Map;
import java.util.List;

public interface UserStatsService {
    /**
     * Retrieves monthly user signup counts for the specified number of months
     * 
     * @param months Number of months to look back
     * @return List of maps containing month and signup count
     */
    List<Map<String, Object>> getMonthlySignups(int months);

    /**
     * Gets total count of registered users
     * 
     * @return Total user count
     */
    long getTotalUserCount();
}