package com.tasks.backend.dto.task_list;

import java.util.List;

import com.tasks.backend.dto.task.TaskResponseDTO;

public class TaskListResponseDTO {

    private Long id;
    private String name;
    private List<TaskResponseDTO> tasks;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<TaskResponseDTO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskResponseDTO> tasks) {
        this.tasks = tasks;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
