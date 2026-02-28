package com.birdsight.user;

import com.birdsight.common.exception.ResourceAlreadyExistsException;
import com.birdsight.common.exception.ResourceNotFoundException;
import com.birdsight.user.dto.CreateUserRequest;
import com.birdsight.user.dto.UpdateUserRequest;
import com.birdsight.user.dto.UserMapper;
import com.birdsight.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAllByDeletedFalse(pageable)
                .map(userMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("User", "username", request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User", "email", request.getEmail());
        }

        User user = userMapper.toEntity(request);
        // TODO: hash password
        User savedUser = userRepository.saveAndFlush(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new ResourceAlreadyExistsException("User", "email", request.getEmail());
            }
            user.setEmail(request.getEmail());
            user.setEmailVerifiedAt(null);
        }

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        User updatedUser = userRepository.saveAndFlush(user);
        return userMapper.toResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setDeleted(true);
        userRepository.saveAndFlush(user);
    }

    @Transactional
    public UserResponse suspendUser(UUID id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setSuspended(true);
        User updatedUser = userRepository.saveAndFlush(user);
        return userMapper.toResponse(updatedUser);
    }

    @Transactional
    public UserResponse unsuspendUser(UUID id) {
        User user = userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setSuspended(false);
        User updatedUser = userRepository.saveAndFlush(user);
        return userMapper.toResponse(updatedUser);
    }
}
