package com.tasks.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tasks.backend.entity.Task;
import com.tasks.backend.entity.User;

import java.util.List;

@Repository // Anotação que marca esta interface como um componente de acesso a dados
public interface TaskRepository extends JpaRepository<Task, Long>{
    
    List<Task> findByTaskNameContainingIgnoreCaseAndUser(String taskName, User currentUser);
    List<Task> findByUser(User currentUser);
    List<Task> findByIdInAndUser(List<Long> ids, User user);
}
