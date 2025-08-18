package com.tasks.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tasks.backend.dto.task_list.TaskListCreateDTO;
import com.tasks.backend.dto.task_list.TaskListResponseDTO;
import com.tasks.backend.dto.task_list.TaskListUpdateDTO;
import com.tasks.backend.entity.TaskList;
import com.tasks.backend.entity.User;
import com.tasks.backend.services.TaskListService;

@RestController
@RequestMapping("/task_list")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskListController {
    
    @Autowired
    private TaskListService taskListService;

    @GetMapping
    public List<TaskListResponseDTO> getAll() {
        return taskListService.getAll();
    }

    @GetMapping("/user")
    public List<TaskListResponseDTO> getAllByUser(@AuthenticationPrincipal User currentUser) {
        return taskListService.getAllByUser(currentUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskListResponseDTO> getTaskListById(@PathVariable Long id) {
        TaskListResponseDTO task = taskListService.getTaskListById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskListResponseDTO> createTaskList(@RequestBody TaskListCreateDTO taskListReceive, @AuthenticationPrincipal User currentUser) {
        TaskListResponseDTO taskList = taskListService.createTaskList(taskListReceive, currentUser);
        return ResponseEntity.ok(taskList);
    }

    @PostMapping("/{id}/tasks")
    public ResponseEntity<TaskListResponseDTO> addTasksToList(@PathVariable Long id, @RequestBody TaskListUpdateDTO taskList, @AuthenticationPrincipal User currentUser) {
        TaskListResponseDTO updatedTaskList = taskListService.addTasksToList(id, taskList.getTasksId(), currentUser);
        return ResponseEntity.ok(updatedTaskList);
    }


    @PutMapping("/{id}")
    public ResponseEntity<TaskListResponseDTO> updateTaskList(@PathVariable Long id, @RequestBody TaskListCreateDTO taskListUpdated) {
        TaskListResponseDTO taskList = taskListService.updateTaskList(id, taskListUpdated);
        return ResponseEntity.ok(taskList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskList(@PathVariable Long id) {
        taskListService.deleteTaskList(id);
        return ResponseEntity.noContent().build();
    }
}
