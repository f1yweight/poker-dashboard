package com.flyweight.poker_dashboard.learningresource;

import com.flyweight.poker_dashboard.learningresource.dto.CreateLearningResourceRequest;
import com.flyweight.poker_dashboard.learningresource.dto.LearningResourceResponse;
import com.flyweight.poker_dashboard.learningresource.dto.UpdateLearningResourceRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-resources")
public class LearningResourceController {

    private final LearningResourceService learningResourceService;

    public LearningResourceController(LearningResourceService learningResourceService) {
        this.learningResourceService = learningResourceService;
    }

    @GetMapping
    public List<LearningResourceResponse> getAll(@RequestParam(required = false) LearningResourceStatus status) {
        return learningResourceService.getAll(status);
    }

    @PostMapping
    public LearningResourceResponse create(@Valid @RequestBody CreateLearningResourceRequest request) {
        return learningResourceService.create(request);
    }

    @PatchMapping("/{id}")
    public LearningResourceResponse update(@PathVariable Long id
            , @Valid @RequestBody UpdateLearningResourceRequest request) {
        return learningResourceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        learningResourceService.delete(id);
    }
}
