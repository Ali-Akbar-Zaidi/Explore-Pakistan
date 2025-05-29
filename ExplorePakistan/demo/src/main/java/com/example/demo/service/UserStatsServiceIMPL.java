package com.example.demo.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserStatsServiceIMPL implements UserStatsService {

    @Override
    public List<Map<String, Object>> getMonthlySignups(int months) {
        try {
            // Get all users from Firebase
            List<UserRecord> allUsers = getAllUsers();

            // Create map to hold monthly counts
            Map<String, Integer> monthlyCounts = new LinkedHashMap<>();

            // Initialize months (last X months)
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");

            // Initialize all months with zero counts
            for (int i = months - 1; i >= 0; i--) {
                LocalDateTime date = now.minusMonths(i);
                String monthName = date.format(formatter);
                monthlyCounts.put(monthName, 0);
            }

            // Count users by creation month
            for (UserRecord user : allUsers) {
                Date creationDate = new Date(user.getUserMetadata().getCreationTimestamp());
                LocalDateTime createDateTime = creationDate.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();

                // Only count users created within the requested time period
                if (createDateTime.isAfter(now.minusMonths(months))) {
                    String month = createDateTime.format(formatter);
                    if (monthlyCounts.containsKey(month)) {
                        monthlyCounts.put(month, monthlyCounts.get(month) + 1);
                    }
                }
            }

            // Convert to the format needed by frontend
            return monthlyCounts.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("month", entry.getKey());
                        item.put("signups", entry.getValue());
                        return item;
                    })
                    .collect(Collectors.toList());

        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @Override
    public long getTotalUserCount() {
        try {
            return getAllUsers().size();
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return 0;
        }
    }

    // Helper method to get all users from Firebase
    private List<UserRecord> getAllUsers() throws FirebaseAuthException {
        List<UserRecord> users = new ArrayList<>();
        String pageToken = null;
        ListUsersPage page;

        try {
            do {
                page = FirebaseAuth.getInstance().listUsers(pageToken, 1000);
                if (page != null) {
                    for (UserRecord user : page.getValues()) {
                        users.add(user);
                    }
                    pageToken = page.getNextPageToken();
                }
            } while (pageToken != null);
        } catch (IllegalArgumentException e) {
            // Handle case when page token is invalid
            e.printStackTrace();
        }

        return users;
    }
}