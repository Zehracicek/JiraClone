package com.projecttracker.surefire;

import com.projecttracker.model.*;
import com.projecttracker.repository.TaskRepository;
import com.projecttracker.repository.UserRepository;
import com.projecttracker.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private ReportService reportService;

    private User onur;
    private User ayse;

    @BeforeEach
    void setUp() {
        onur = new User();
        onur.setId(1L);
        onur.setUsername("onur");
        onur.setFullName("Onur Aran");

        ayse = new User();
        ayse.setId(2L);
        ayse.setUsername("ayse");
        ayse.setFullName("Ayşe Yılmaz");
    }

    @Test
    void testGetAllUsersWorkloadComparison() {
        // GIVEN
        when(userRepository.findAll())
                .thenReturn(List.of(onur, ayse));

        Task t1 = new Task();
        t1.setStatus(TaskStatus.DONE);

        Task t2 = new Task();
        t2.setStatus(TaskStatus.IN_PROGRESS);

        when(taskRepository.findByAssigneeUsername("onur"))
                .thenReturn(List.of(t1, t2));

        when(taskRepository.findByAssigneeUsername("ayse"))
                .thenReturn(List.of());

        // WHEN
        List<Map<String, Object>> result =
                reportService.getAllUsersWorkloadComparison();

        // THEN
        assertEquals(2, result.size());

        Map<String, Object> onurStats = result.get(0);
        assertEquals("onur", onurStats.get("username"));
        assertEquals(2, onurStats.get("totalTasks"));
        assertEquals(1L, onurStats.get("completedTasks"));
        assertEquals(1L, onurStats.get("inProgressTasks"));

        Map<String, Object> ayseStats = result.get(1);
        assertEquals("ayse", ayseStats.get("username"));
        assertEquals(0, ayseStats.get("totalTasks"));

        verify(userRepository, times(1)).findAll();
        verify(taskRepository, times(1)).findByAssigneeUsername("onur");
        verify(taskRepository, times(1)).findByAssigneeUsername("ayse");
    }
}
