package com.parmugilan.SweetShop.Services;

import com.parmugilan.SweetShop.Models.Role;
import com.parmugilan.SweetShop.Models.User;
import com.parmugilan.SweetShop.Repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private org.springframework.core.env.Environment env;



    @Autowired
    UserRepository repository;
    @Autowired
    private PasswordEncoder encoder;
    @PostConstruct
    public void debugMongo() {
        System.out.println("MongoDB URI = " + env.getProperty("spring.data.mongodb.uri"));
    }


    public List<User> getAllTodos(){
        List<User> users = repository.findAll();
        System.out.println("Retrieved " + users.size() + " User");
        return users;
    }

    public User getByid(String id){
        System.out.println("Fetching user with ID: [" + id + "]");
        return repository.findById(id).orElse(null);
    }

    public User createTodo(User user) {

        Optional<User> existingUser = repository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Set default values
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        if (user.getEnabled() == null) {
            user.setEnabled(true);
        }

        user.setPassword(encoder.encode(user.getPassword()));


        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return repository.save(user);
    }

    public String DeleteTodo(String id){
        try {
            repository.deleteById(id);
            return id + " Deleted";
        }catch (Exception e){
            return "Error: " + e.getMessage();
        }
    }

    public User UpdateTodo(User user){
        System.out.println("Updating user: " + user);
        return repository.save(user);

    }
}
