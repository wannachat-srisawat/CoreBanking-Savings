package com.saving.backend.controller;

import com.saving.backend.dto.LoginRequest;
import com.saving.backend.dto.LoginResponse;
import com.saving.backend.dto.RegisterRequest;
import com.saving.backend.entity.User;
import com.saving.backend.repository.UserRepository;
import com.saving.backend.until.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>>  register(@RequestBody RegisterRequest request) {
        Map<String, String> response = new HashMap<>();

        Optional<User> existingEmail = userRepository.findByEmail(request.getEmail());
        if (existingEmail.isPresent() && !existingEmail.get().getCitizenId().equals(request.getCitizenId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        if ("CUSTOMER".equalsIgnoreCase(request.getRole())) {
            if (request.getCitizenId() == null || request.getCitizenId().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Citizen ID is required for CUSTOMER");
            }
            if (request.getPin() == null || request.getPin().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PIN is required for CUSTOMER");
            }
        }

        Optional<User> optionalUser = Optional.empty();

        if (request.getCitizenId() != null && !request.getCitizenId().isBlank()) {
            optionalUser = userRepository.findByCitizenId(request.getCitizenId());
        }

        User user = optionalUser.orElseGet(User::new);

        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setThaiName(request.getThaiName());
        user.setEngName(request.getEngName());

        if ("CUSTOMER".equalsIgnoreCase(request.getRole())) {
            user.setCitizenId(request.getCitizenId());
            user.setPin(passwordEncoder.encode(request.getPin()));
        }

        userRepository.save(user);

        response.put("message", "Register success");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}