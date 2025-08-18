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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tasks.backend.services.TaskService;
import com.tasks.backend.dto.task.TaskCreateDTO;
import com.tasks.backend.dto.task.TaskResponseDTO;
import com.tasks.backend.dto.task.TaskUpdateDTO;
import com.tasks.backend.entity.User;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @PostMapping
    public TaskResponseDTO createTask(@RequestBody TaskCreateDTO task, @AuthenticationPrincipal User currentUser){
        return taskService.createTask(task, currentUser);
    }

    @PostMapping("/batch")
    public List<TaskResponseDTO> createTasks(@RequestBody List<TaskCreateDTO> tasks, @AuthenticationPrincipal User currentUser){
        return taskService.createTasks(tasks, currentUser);
    }

    @GetMapping
    public List<TaskResponseDTO> getAll(){
        return taskService.getAllTask();
    }

    @GetMapping("/user")
    public List<TaskResponseDTO> getAllByUser(@AuthenticationPrincipal User currentUser){
        return taskService.getAllTaskByUser(currentUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getByID(@PathVariable Long id) {
        TaskResponseDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> update(@PathVariable Long id, @RequestBody TaskUpdateDTO task) {
        TaskResponseDTO updatedTask = taskService.updateTask(id, task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        // Retorna um status 204 No Content, que é o padrão para
        // uma deleção bem-sucedida sem corpo de resposta.
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponseDTO>> getByName(@RequestParam(name="name") String query, @AuthenticationPrincipal User currentUser) {
        List<TaskResponseDTO> tasks = taskService.getByName(query, currentUser);
        return ResponseEntity.ok(tasks);
    }

}
