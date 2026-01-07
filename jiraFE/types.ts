
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED'
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  active: boolean;
}

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignee?: UserDTO;
  sprintId?: number;
  sprintName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SprintDTO {
  id: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  active: boolean;
  tasks?: TaskDTO[];
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  taskCount: number;
}

export interface SprintStatistics {
  sprintId: number;
  sprintName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  blockedTasks: number;
  completionPercentage: number;
}

export interface UserWorkloadReport {
  username: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
}

export interface BurndownReport {
  sprintId: number;
  sprintName: string;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  dailyProgress: Record<string, number>;
}
