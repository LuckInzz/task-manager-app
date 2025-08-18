package com.tasks.backend.dto.task_list;

import java.util.List;

public class TaskListUpdateDTO {
    
    private List<Long> tasksId;
    
    public List<Long> getTasksId() {
        return tasksId;
    }
    public void setTasksId(List<Long> tasksId) {
        this.tasksId = tasksId;
    }

}
