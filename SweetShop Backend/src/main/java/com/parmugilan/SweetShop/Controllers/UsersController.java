package com.parmugilan.SweetShop.Controllers;


import com.parmugilan.SweetShop.Models.User;
import com.parmugilan.SweetShop.Repository.UserRepository;
import com.parmugilan.SweetShop.Security.JwtUtil;
import com.parmugilan.SweetShop.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UsersController  {
    @Autowired
    private  PasswordEncoder encoder;
    @Autowired
    UserService service;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository repository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> request) {
        String email=request.get("email");
        String password=request.get("password");

        var opetional =repository.findByEmail(email);
        if(opetional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User Not Registered"));
        }
        User user=opetional.get();
        if(!encoder.matches(password,user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User Not Registered"));
        }
        String token=jwtUtil.generateToken(email,user.getRole().name());
        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("token", token));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "error", "No token provided"));
            }

            String token = authHeader.substring(7);

            if (jwtUtil.validatejwttoken(token)) {
                String email = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);
                System.out.println("called and success ");
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "email", email,
                        "role", role
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "error", "Invalid token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Token verification failed"));
        }
    }






    @GetMapping("/get/{id}")
    public ResponseEntity<User> get(@PathVariable String id){
        User user = service.getByid(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get")
    public ResponseEntity<List<User>> getAll(){
        return ResponseEntity.ok(service.getAllTodos());
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody User user) {
        try {
            User created = service.createTodo(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody User user) {
        try {

            User existingUser = service.getByid(user.getId());
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }


            if (user.getPassword() != null && !user.getPassword().isEmpty()) {

                if (!user.getPassword().startsWith("$2a$")) {
                    String encodedPassword = encoder.encode(user.getPassword());
                    user.setPassword(encodedPassword);
                }
            } else {

                user.setPassword(existingUser.getPassword());
            }


            user.setUpdatedAt(LocalDateTime.now());

            User updated = service.UpdateTodo(user);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public Map<String,String> delete(@PathVariable String id){
        String result = service.DeleteTodo(id);
        return Map.of("message",id + " Deleted");
    }

}
