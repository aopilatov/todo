import { StoreType, FilterType, TaskType, SearchType } from '../types';
import { TaskInterface } from '../interfaces';
import { StoreAbstract, JsonStore } from './stores';

export class Store {
    private store: StoreAbstract;

    constructor(storeType: StoreType) {
        switch (storeType) {
            case 'json':
                this.store = new JsonStore();
                break;
            default:
                throw new Error('Right now only JSON store is available');
        }
    }

    private async doChecks(): Promise<TaskInterface[]> {
        const storeIsAvailable = await this.store.checkAvailability();
        if (!storeIsAvailable) await this.store.init();
        return await this.store.get();
    }

    async get(filter: FilterType = 'all'): Promise<object> {
        let list: TaskInterface[] = await this.doChecks();

        if (['completed', 'uncompleted'].includes(filter)) {
            const isCompleted = filter === 'completed';
            list = list.filter(item => item.isCompleted === isCompleted);
        }

        return list;
    }

    async add(task: TaskType): Promise<boolean> {
        await this.doChecks();
        return await this.store.add(task)
    }

    async remove(task: TaskType, type: SearchType = 'value'): Promise<boolean> {
        await this.doChecks();
        return await this.store.remove(task, type);
    }

    async complete(task: TaskType, type: SearchType = 'value'): Promise<boolean> {
        await this.doChecks();
        return await this.store.complete(task, type);
    }
}