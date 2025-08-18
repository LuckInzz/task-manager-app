package com.tasks.backend.services;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.tasks.backend.dto.task.TaskResponseDTO;
import com.tasks.backend.dto.task_list.TaskListCreateDTO;
import com.tasks.backend.dto.task_list.TaskListResponseDTO;
import com.tasks.backend.dto.task_list.TaskListUpdateDTO;
import com.tasks.backend.entity.Task;
import com.tasks.backend.entity.TaskList;
import com.tasks.backend.entity.User;
import com.tasks.backend.exception.ResourceNotFoundException;
import com.tasks.backend.repository.TaskListRepository;
import com.tasks.backend.repository.TaskRepository;

import jakarta.transaction.Transactional;

@Service
public class TaskListService {
    
    @Autowired
    private TaskListRepository taskListRepository;
    @Autowired
    private TaskRepository taskRepository;

    public List<TaskListResponseDTO> getAll(){
        List<TaskList> taskLists = taskListRepository.findAll();
        return taskLists.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
    }

    public List<TaskListResponseDTO> getAllByUser(User currentUser){
        List<TaskList> taskLists = taskListRepository.findByUser(currentUser);
        return taskLists.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
    }

    @PreAuthorize("@taskListRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public TaskListResponseDTO getTaskListById(Long id) {
        TaskList taskList = taskListRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task list not found with id: " + id));
        return convertToResponseDTO(taskList);
    }

    public TaskListResponseDTO createTaskList(TaskListCreateDTO taskList, User currentUser) {
        TaskList newTaskList = new TaskList();
        newTaskList.setName(taskList.getName());
        newTaskList.setUser(currentUser);

        TaskList savedTaskList = taskListRepository.save(newTaskList);
        return convertToResponseDTO(savedTaskList);
    }

    @Transactional
    @PreAuthorize("@taskListRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public TaskListResponseDTO addTasksToList(Long id, List<Long> tasksId, User currentUser) {
        TaskList taskList = taskListRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task list not found with id: " + id));

        List<Task> tasksToAdd = taskRepository.findByIdInAndUser(tasksId, currentUser);

        for(Task task: tasksToAdd) {
            if (!task.getUser().getId().equals(currentUser.getId())) {
                throw new SecurityException("Access denied: the task" + task.getId() + " not below to you.");
            }
            taskList.addTask(task);
        }

        TaskList updatedList = taskListRepository.save(taskList);
        return convertToResponseDTO(updatedList);
    }

    @PreAuthorize("@taskListRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public TaskListResponseDTO updateTaskList(Long id, TaskListCreateDTO taskListUpdated) {
        TaskList oldTaskList = taskListRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task list not found with id: " + id));
        
        oldTaskList.setName(taskListUpdated.getName());
        taskListRepository.save(oldTaskList);
        return convertToResponseDTO(oldTaskList);
    }

    @PreAuthorize("@taskListRepository.findById(#id).get().getUser().getId() == authentication.principal.id")
    public void deleteTaskList(Long id) {
        TaskList taskList = taskListRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task list not found with id: " + id));

        taskListRepository.delete(taskList);
    }

    private TaskListResponseDTO convertToResponseDTO(TaskList taskList) {
        TaskListResponseDTO dto = new TaskListResponseDTO();
        dto.setId(taskList.getId());
        dto.setName(taskList.getName());
        if (taskList.getTasks() != null) {
            List<TaskResponseDTO> taskDTOs = taskList.getTasks().stream()
                    .map(this::convertToTaskResponseDTO)
                    .collect(Collectors.toList());
            dto.setTasks(taskDTOs);
        }

        return dto;
    }

    private TaskResponseDTO convertToTaskResponseDTO(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(task.getId());
        dto.setTaskName(task.getTaskName());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDateCreation(task.getDateCreation());
        dto.setDateUpdate(task.getDateUpdate());
        dto.setTaskListId(task.getTaskList().getId());
        dto.setTaskListName(task.getTaskList().getName());

        return dto;
    }
}
