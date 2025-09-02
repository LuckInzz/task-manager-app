package com.tasks.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.tasks.backend.repository.TaskListRepository;
import com.tasks.backend.repository.TaskRepository;
//import com.tasks.backend.repository.UserRepository;
import com.tasks.backend.entity.Task;
import com.tasks.backend.entity.User;
import com.tasks.backend.entity.TaskList;
import com.tasks.backend.dto.task.TaskResponseDTO;
import com.tasks.backend.dto.task.TaskUpdateDTO;
import com.tasks.backend.dto.task.TaskCreateDTO;
import com.tasks.backend.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    //private final UserRepository userRepository;
    private final TaskListRepository taskListRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, /*UserRepository userRepository,*/ TaskListRepository groupRepository) {
        this.taskRepository = taskRepository;
        //this.userRepository = userRepository;
        this.taskListRepository = groupRepository;
    }
    

    public List<TaskResponseDTO> getAllTaskByUser(User currentUser) {
        List<Task> tasks = taskRepository.findByUser(currentUser);
        return tasks.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TaskResponseDTO> getAllTask() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @PreAuthorize("@taskRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return convertToResponseDTO(task);
    }

    
    public TaskResponseDTO createTask(TaskCreateDTO taskDTO, User currentUser) {
        Task newTask = new Task();
        newTask.setTaskName(taskDTO.getTaskName());
        newTask.setDescription(taskDTO.getDescription());
        newTask.setPriority(taskDTO.getPriority());
        newTask.setStatus(Task.TaskStatus.PENDING);
        newTask.setUser(currentUser);

        //Se a task tem um grupo atribuido
        if (taskDTO.getTaskListId() != null){
            TaskList group = taskListRepository.findById(taskDTO.getTaskListId())
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + taskDTO.getTaskListId()));
            newTask.setTaskList(group);
        }

        Task savedTask = taskRepository.save(newTask);
        return convertToResponseDTO(savedTask);
    }

    public List<TaskResponseDTO> createTasks(List<TaskCreateDTO> tasks, User currentUser) {
        return tasks.stream()
            .map(task -> createTask(task, currentUser)) // aproveita o método que já existe
            .collect(Collectors.toList());
    }

    @PreAuthorize("@taskRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found with this id: " + id));
        taskRepository.delete(task);
    }

    @PreAuthorize("@taskRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public TaskResponseDTO updateTask(Long id, TaskUpdateDTO taskUpdatedDTO) {
        Task oldTask = taskRepository.findById(id).
        orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        oldTask.setTaskName(taskUpdatedDTO.getTaskName());
        oldTask.setDescription(taskUpdatedDTO.getDescription());
        oldTask.setStatus(taskUpdatedDTO.getStatus());
        oldTask.setPriority(taskUpdatedDTO.getPriority());
        if (taskUpdatedDTO.getTaskListId() != null){
            TaskList group = taskListRepository.findById(taskUpdatedDTO.getTaskListId())
                            .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + taskUpdatedDTO.getTaskListId()));
            oldTask.setTaskList(group);
        }
        taskRepository.save(oldTask);
        return convertToResponseDTO(oldTask);
    }

    public List<TaskResponseDTO> getByName(String query, User currentUser) {
        List<Task> tasks = taskRepository.findByTaskNameContainingIgnoreCaseAndUser(query, currentUser);
        return tasks.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private TaskResponseDTO convertToResponseDTO(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(task.getId());
        dto.setTaskName(task.getTaskName());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDateCreation(task.getDateCreation());
        
        //Verifica se a tarefa tem um grupo atribuido
        if (task.getTaskList() != null) {
            dto.setTaskListId(task.getTaskList().getId());
            dto.setTaskListName(task.getTaskList().getName());
        }

        return dto;
    }
}
