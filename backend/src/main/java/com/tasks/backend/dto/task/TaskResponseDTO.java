package com.tasks.backend.dto.task;

import java.time.LocalDateTime;

import com.tasks.backend.entity.Task;

public class TaskResponseDTO {
    
    private Long id;
    private String taskName;
    private String description;
    private Task.TaskStatus status;
    private Task.TaskPriority priority;
    private LocalDateTime dateCreation;
    private LocalDateTime dateUpdate;
    private Long taskListId;
    private String taskListName;

    public TaskResponseDTO(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Task.TaskStatus getStatus() {
        return status;
    }

    public void setStatus(Task.TaskStatus status) {
        this.status = status;
    }

    public Task.TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(Task.TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateUpdate() {
        return dateUpdate;
    }

    public void setDateUpdate(LocalDateTime dateUpdate) {
        this.dateUpdate = dateUpdate;
    }

    public Long getTaskListId() {
        return taskListId;
    }

    public void setTaskListId(Long groupId) {
        this.taskListId = groupId;
    }

    public String getTaskListName() {
        return taskListName;
    }

    public void setTaskListName(String groupName) {
        this.taskListName = groupName;
    }
}
