package com.example.demo.service;

import com.example.demo.model.User;
import com.google.firebase.auth.UserRecord;

public interface AuthService {
    User signUp(User user) throws Exception;
    User login(String email) throws Exception;
    User getUserData(String uid) throws Exception;
}