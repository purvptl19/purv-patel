package com.biodata.repository;

import com.biodata.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findAllByOrderBySortOrderAsc();
}
