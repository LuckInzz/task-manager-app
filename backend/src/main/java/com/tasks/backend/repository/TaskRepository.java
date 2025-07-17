package com.tasks.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tasks.backend.entity.Task;

@Repository // Anotação que marca esta interface como um componente de acesso a dados
public interface TaskRepository extends JpaRepository<Task, Long>{
    
}
