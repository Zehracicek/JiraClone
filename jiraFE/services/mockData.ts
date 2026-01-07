
import { TaskDTO, UserDTO, SprintDTO, Priority, TaskStatus } from '../types';

export const MOCK_USERS: UserDTO[] = [
  { id: 1, username: 'jdoe', email: 'john@jira.com', fullName: 'John Doe', role: 'ADMIN', active: true },
  { id: 2, username: 'asmith', email: 'alice@jira.com', fullName: 'Alice Smith', role: 'DEVELOPER', active: true },
  { id: 3, username: 'bwilliams', email: 'bob@jira.com', fullName: 'Bob Williams', role: 'DESIGNER', active: true },
];

export const MOCK_TASKS: TaskDTO[] = [
  {
    id: 101,
    title: 'Design System Implementation',
    description: 'Create a reusable set of UI components based on the new brand guidelines.',
    priority: Priority.CRITICAL,
    status: TaskStatus.IN_PROGRESS,
    assignee: MOCK_USERS[2],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 102,
    title: 'API Authentication Layer',
    description: 'Implement JWT based auth for all endpoints.',
    priority: Priority.HIGH,
    status: TaskStatus.TODO,
    assignee: MOCK_USERS[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 103,
    title: 'Landing Page Bug Fixes',
    description: 'Fix responsive issues on the main landing page.',
    priority: Priority.MEDIUM,
    status: TaskStatus.DONE,
    assignee: MOCK_USERS[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 104,
    title: 'Database Migration to Postgres',
    description: 'Migrate existing legacy data to the new schema.',
    priority: Priority.HIGH,
    status: TaskStatus.BLOCKED,
    assignee: MOCK_USERS[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 105,
    title: 'User Profile UX Research',
    description: 'Conduct interviews with 5 stakeholders.',
    priority: Priority.LOW,
    status: TaskStatus.TODO,
    assignee: MOCK_USERS[2],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_SPRINT: SprintDTO = {
  id: 1,
  name: 'Innovation Sprint Q3',
  goal: 'Deliver the core management dashboard',
  startDate: '2023-10-01',
  endDate: '2023-10-14',
  active: true,
  tasks: MOCK_TASKS,
  totalTasks: 5,
  completedTasks: 1,
  completionPercentage: 20,
  taskCount: 5,
};
