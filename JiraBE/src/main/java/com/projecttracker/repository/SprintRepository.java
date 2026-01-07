package com.projecttracker.repository;

import com.projecttracker.model.Sprint;
import com.projecttracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {


    List<Sprint> findByActive(Boolean active);

    List<Sprint> findAllByOrderByStartDateDesc();

    @Query("SELECT s FROM Sprint s JOIN s.users u WHERE u = :user AND s.active = true")
    Optional<Sprint> findActiveSprintByUser(@Param("user") User user);

    @Query("SELECT COUNT(s) > 0 FROM Sprint s JOIN s.users u WHERE u = :user")
    boolean existsByUsers(@Param("user") User user);

    @Query("SELECT s FROM Sprint s JOIN s.users u WHERE u.id = :userId")
    List<Sprint> findByUserId(@Param("userId") Long userId);
}