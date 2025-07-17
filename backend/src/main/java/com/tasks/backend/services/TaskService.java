package com.tasks.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tasks.backend.repository.TaskRepository;
import com.tasks.backend.entity.Task;
import com.tasks.backend.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    public List<Task> getAllTask() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).
        orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        if(taskRepository.existsById(id)){
            taskRepository.deleteById(id);
        }
        else {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
    }

    public Task updateTask(Long id, Task task) {
        Task oldTask = taskRepository.findById(id).
        orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        oldTask.setTaskName(task.getTaskName());
        oldTask.setDescription(task.getDescription());
        oldTask.setDone(task.isDone());
        oldTask.setPriority(task.getPriority());
        return taskRepository.save(oldTask);
    }
}
