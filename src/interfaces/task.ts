import { TaskType } from '../types';

export interface TaskInterface {
    id: number,
    label: TaskType,
    isCompleted: boolean,
}