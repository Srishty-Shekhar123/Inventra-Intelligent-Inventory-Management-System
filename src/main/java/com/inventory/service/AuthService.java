package com.inventory.service;

import java.util.Optional;
import java.util.Random;
import java.util.regex.Pattern;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;

    private static final String EMAIL_REGEX =
    "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";


    // password rule
    private static final String PASSWORD_REGEX =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

    public AuthService(UserRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // ================= REGISTER =================
   public void register(User user) {

    // 1️⃣ EMAIL VALIDATION
    if (!Pattern.matches(EMAIL_REGEX, user.getEmail())) {
        throw new RuntimeException("Please enter a valid email address");
    }

    // 2️⃣ PREVENT DUPLICATE EMAIL (recommended)
    if (repo.findByEmail(user.getEmail()).isPresent()) {
        throw new RuntimeException("Email already registered");
    }

    // 3️⃣ ROLE NORMALIZE
    user.setRole(user.getRole().toLowerCase());

    // 4️⃣ PASSWORD VALIDATION
    if (!Pattern.matches(PASSWORD_REGEX, user.getPassword())) {
        throw new RuntimeException(
            "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character"
        );
    }

    // 5️⃣ HASH PASSWORD
    user.setPassword(encoder.encode(user.getPassword()));

    // 6️⃣ SAVE
    repo.save(user);
}

      

    // ================= LOGIN =================
   public User login(String email, String password, String role) {

    Optional<User> opt = repo.findByEmail(email);
    if (opt.isEmpty()) return null;

    User user = opt.get();

    //   THIS CHECK (BLOCKED USER)
    if (!user.isActive()) {
        throw new RuntimeException("User is blocked by admin");
    }

    if (!encoder.matches(password, user.getPassword())) return null;

    if (!user.getRole().equalsIgnoreCase(role)) return null;

    return user;
}


    // ================= SEND OTP =================
   public void sendOtp(String email) {

    // 1️⃣ validate email format
    if (!Pattern.matches(EMAIL_REGEX, email)) {
        throw new RuntimeException("Invalid email address");
    }

    // 2️⃣ check email exists
    User user = repo.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Email not registered"));

    // 3️⃣ generate OTP
    String otp = String.valueOf(new Random().nextInt(900000) + 100000);
    user.setOtp(otp);

    repo.save(user);

    // demo purpose (console)
    System.out.println("OTP for " + email + " : " + otp);
}


    // ================= RESET PASSWORD =================
    public boolean resetPassword(String email, String otp, String newPass) {

    // 1️⃣ validate email format
    if (!Pattern.matches(EMAIL_REGEX, email)) {
        throw new RuntimeException("Invalid email address");
    }

    Optional<User> opt = repo.findByEmail(email);
    if (opt.isEmpty()) return false;

    User user = opt.get();

    // 2️⃣ validate OTP
    if (!otp.equals(user.getOtp())) return false;

    // 3️⃣ validate new password
    if (!Pattern.matches(PASSWORD_REGEX, newPass)) {
        throw new RuntimeException(
            "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character"
        );
    }

    // 4️⃣ hash password
    user.setPassword(encoder.encode(newPass));
    user.setOtp(null);

    repo.save(user);
    return true;
}

}
