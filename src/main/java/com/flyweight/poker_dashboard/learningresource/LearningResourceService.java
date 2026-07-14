package com.flyweight.poker_dashboard.learningresource;

import com.flyweight.poker_dashboard.exception.ResourceNotFoundException;
import com.flyweight.poker_dashboard.learningresource.dto.CreateLearningResourceRequest;
import com.flyweight.poker_dashboard.learningresource.dto.LearningResourceResponse;
import com.flyweight.poker_dashboard.learningresource.dto.UpdateLearningResourceRequest;
import com.flyweight.poker_dashboard.learningresource.mapper.LearningResourceMapper;
import com.flyweight.poker_dashboard.user.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class LearningResourceService {

    private final LearningResourceRepository learningResourceRepository;
    private final LearningResourceMapper learningResourceMapper;

    public LearningResourceService(LearningResourceRepository learningResourceRepository,
                                   LearningResourceMapper learningResourceMapper) {
        this.learningResourceRepository = learningResourceRepository;
        this.learningResourceMapper = learningResourceMapper;
    }

    private User getCurrentUser() {
        return (User) Objects.requireNonNull(SecurityContextHolder
                        .getContext()
                        .getAuthentication())
                .getPrincipal();
    }

    public List<LearningResourceResponse> getAll(LearningResourceStatus status) {
        User user = getCurrentUser();

        List<LearningResource> learningResources = status == null
                ? learningResourceRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                : learningResourceRepository.findByUser_IdAndStatusOrderByCreatedAtDesc(user.getId(), status);

        return learningResources
                .stream()
                .map(learningResourceMapper::toResponse)
                .toList();
    }

    public LearningResourceResponse create(CreateLearningResourceRequest request) {
        User user = getCurrentUser();

        LearningResource learningResource = learningResourceMapper.toEntity(request);
        learningResource.setUser(user);

        if (learningResource.getStatus() == null) {
            learningResource.setStatus(LearningResourceStatus.TO_WATCH);
        }

        LearningResource savedLearningResource = learningResourceRepository.save(learningResource);
        return learningResourceMapper.toResponse(savedLearningResource);
    }

    public LearningResourceResponse update(Long id, UpdateLearningResourceRequest request) {
        User user = getCurrentUser();

        LearningResource learningResource = learningResourceRepository
                .findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        learningResourceMapper.updateEntityFromRequest(request, learningResource);

        if (learningResource.getStatus() == null) {
            learningResource.setStatus(LearningResourceStatus.TO_WATCH);
        }

        LearningResource savedLearningResource = learningResourceRepository.save(learningResource);
        return learningResourceMapper.toResponse(savedLearningResource);
    }

    public void delete(Long id) {
        User user = getCurrentUser();

        LearningResource learningResource = learningResourceRepository
                .findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        learningResourceRepository.delete(learningResource);
    }
}
