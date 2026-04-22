package com.campus.smart.repository;

import com.campus.smart.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByName(String name);
    List<Resource> findByAvailableTrue();
}
