package com.biodata.controller;

import com.biodata.model.*;
import com.biodata.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BiodataController {

    private final ProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;

    public BiodataController(ProfileRepository profileRepository,
                              EducationRepository educationRepository,
                              SkillRepository skillRepository,
                              ProjectRepository projectRepository) {
        this.profileRepository = profileRepository;
        this.educationRepository = educationRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
    }

    // ---------- Aggregate (single call to render the whole page) ----------

    @GetMapping("/biodata")
    public Map<String, Object> getAll() {
        Profile profile = profileRepository.findAll().stream().findFirst().orElseGet(Profile::new);
        return Map.of(
                "profile", profile,
                "education", educationRepository.findAllByOrderBySortOrderAsc(),
                "skills", skillRepository.findAllByOrderBySortOrderAsc(),
                "projects", projectRepository.findAllByOrderBySortOrderAsc()
        );
    }

    // ---------- Profile ----------

    @GetMapping("/profile")
    public Profile getProfile() {
        return profileRepository.findAll().stream().findFirst().orElseGet(Profile::new);
    }

    @PutMapping("/profile")
    public Profile saveProfile(@RequestBody Profile incoming) {
        Profile existing = profileRepository.findAll().stream().findFirst().orElse(null);
        if (existing != null) {
            incoming.setId(existing.getId());
        }
        return profileRepository.save(incoming);
    }

    // ---------- Education ----------

    @GetMapping("/education")
    public List<Education> listEducation() {
        return educationRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/education")
    public Education addEducation(@RequestBody Education item) {
        item.setId(null);
        return educationRepository.save(item);
    }

    @PutMapping("/education/{id}")
    public Education updateEducation(@PathVariable Long id, @RequestBody Education item) {
        item.setId(id);
        return educationRepository.save(item);
    }

    @DeleteMapping("/education/{id}")
    public void deleteEducation(@PathVariable Long id) {
        educationRepository.deleteById(id);
    }

    // ---------- Skills ----------

    @GetMapping("/skills")
    public List<Skill> listSkills() {
        return skillRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/skills")
    public Skill addSkill(@RequestBody Skill item) {
        item.setId(null);
        return skillRepository.save(item);
    }

    @PutMapping("/skills/{id}")
    public Skill updateSkill(@PathVariable Long id, @RequestBody Skill item) {
        item.setId(id);
        return skillRepository.save(item);
    }

    @DeleteMapping("/skills/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillRepository.deleteById(id);
    }

    // ---------- Projects ----------

    @GetMapping("/projects")
    public List<Project> listProjects() {
        return projectRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping("/projects")
    public Project addProject(@RequestBody Project item) {
        item.setId(null);
        return projectRepository.save(item);
    }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project item) {
        item.setId(id);
        return projectRepository.save(item);
    }

    @DeleteMapping("/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
    }
}
