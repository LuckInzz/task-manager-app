package com.tasks.backend.dto.task;

import com.tasks.backend.entity.Task;

public class TaskCreateDTO {
    
    private String taskName;

    private String description;

    private Task.TaskPriority priority;

    private Long taskListId;

    public TaskCreateDTO(){}

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

    public Task.TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(Task.TaskPriority priority) {
        this.priority = priority;
    }

    public Long getTaskListId() {
        return taskListId;
    }

    public void setTaskListId(Long groupId) {
        this.taskListId = groupId;
    }
}
