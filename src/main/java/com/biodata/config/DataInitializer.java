package com.biodata.config;

import com.biodata.model.*;
import com.biodata.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;

    public DataInitializer(ProfileRepository profileRepository,
                            EducationRepository educationRepository,
                            SkillRepository skillRepository,
                            ProjectRepository projectRepository) {
        this.profileRepository = profileRepository;
        this.educationRepository = educationRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public void run(String... args) {
        if (profileRepository.count() == 0) {
            Profile p = new Profile();
            p.setName("purv patel");
            p.setTitle("Student");
            p.setEmail("patelpurv29939@gmail.com");
            p.setPhone("9998029939");
            p.setLocation("patan, india");
            p.setSummary("Final-year BSc IT student with strong hands-on skills in Java and " +
                    "database management. Comfortable building backend applications and working " +
                    "with relational databases end-to-end. Currently looking for an internship " +
                    "or entry-level opportunity to apply my skills on real-world projects.");
            p.setLinkedin("https://www.linkedin.com/in/purv-patel-197863399?utm_source=share_via&utm_content=profile&utm_medium=member_android");
            p.setGithub("https://github.com/purvptl19");
            p.setWebsite("https://yourwebsite.com");
            profileRepository.save(p);
        }

        if (educationRepository.count() == 0)
        {
            Education ed = new Education();
            ed.setInstitution("Hemchandracharya North Gujarat University, Patan");
            ed.setDegree("Bachelor of Science in Computer Applications and Information Technology");
            ed.setField("Computer Science");
            ed.setStartYear("2024");
            ed.setEndYear("2029");
            ed.setDescription("Relevant coursework, honors, or activities.");
            ed.setSortOrder(1);
            educationRepository.save(ed);
        }

        if (skillRepository.count() == 0) {
            String[][] skills = {
                    {"Java", "Languages", "5"},
                    {"Spring Boot", "Frameworks", "4"},
                    {"JavaScript", "Languages", "4"},
                    {"SQL", "Database ", "4"},

            };
            int order = 1;
            for (String[] s : skills) {
                Skill skill = new Skill();
                skill.setName(s[0]);
                skill.setCategory(s[1]);
                skill.setLevel(Integer.parseInt(s[2]));
                skill.setSortOrder(order++);
                skillRepository.save(skill);
            }
        }

        if (projectRepository.count() == 0) {
            Project proj = new Project();
            proj.setTitle("Project Name");
            proj.setDescription("A short description of a college project, hackathon build, " +
                    "or something you made on your own — what it does and your role in it.");
            proj.setTechStack("Java, Spring Boot, PostgreSQL");
            proj.setLink("https://github.com/purvptl19");
            proj.setSortOrder(1);
            projectRepository.save(proj);
        }
    }
}
