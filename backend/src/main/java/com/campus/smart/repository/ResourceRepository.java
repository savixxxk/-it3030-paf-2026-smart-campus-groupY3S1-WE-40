package com.campus.smart.repository;

import com.campus.smart.model.Resource;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.JpaRepository;
=======
import com.campus.smart.enums.ResourceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
<<<<<<< HEAD
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByName(String name);
    List<Resource> findByAvailableTrue();
=======
public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {
    Optional<Resource> findByName(String name);
    List<Resource> findByAvailableTrue();
    List<Resource> findByStatus(ResourceStatus status);
>>>>>>> c999ac3f4b32fc48012bbf52caf77df97bc7c6cb
}
