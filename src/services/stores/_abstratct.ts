import { TaskType, SearchType } from '../../types';
import { TaskInterface } from '../../interfaces';

export abstract class StoreAbstract {
    protected data: TaskInterface[] = [];

    findTask(task: TaskType, type: SearchType) {
        return this.data.findIndex(item => {
            const valueToCompare = type === 'value'
                ? String(item.label)
                : item.id;

            return String(task) === String(valueToCompare);
        });
    }

    abstract checkAvailability(): Promise<boolean>;
    abstract init(): Promise<boolean>;
    abstract reInit(): Promise<boolean>;
    abstract get(): Promise<TaskInterface[]>;
    abstract add(task: TaskType): Promise<boolean>;
    abstract remove(task: TaskType, type: SearchType): Promise<boolean>;
    abstract complete(task: TaskType, type: SearchType): Promise<boolean>;
}