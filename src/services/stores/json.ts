import { StoreAbstract } from './_abstratct';
import { TaskType, SearchType } from '../../types';
import { TaskInterface } from '../../interfaces';
import { constants, promises as fs } from 'fs';

const STORE_FILE = './store.json';

export class JsonStore extends StoreAbstract {
    private static async writeData(data: TaskInterface[]): Promise<boolean> {
        try {
            await fs.writeFile(STORE_FILE, JSON.stringify({tasks: data}));
            return true;
        } catch (e) {
            return false;
        }
    }

    async checkAvailability(): Promise<boolean> {
        try {
            await fs.access(STORE_FILE, constants.W_OK);
            return true;
        } catch (e) {
            return false;
        }
    }

    async init(): Promise<boolean> {
        try {
            await fs.writeFile(STORE_FILE, JSON.stringify({tasks: []}));
            return true;
        } catch (e) {
            return false;
        }
    }

    async reInit(): Promise<boolean> {
        try {
            await fs.unlink(STORE_FILE);
            return this.init();
        } catch (e) {
            return false;
        }
    }

    async get(): Promise<TaskInterface[]> {
        try {
            let list: TaskInterface[] = [];
            const dataRaw = await fs.readFile(STORE_FILE);

            try {
                const data: Record<string, any> = JSON.parse(dataRaw.toString());

                if (Array.isArray(data.tasks)) {
                    list = data.tasks.filter(item => ['string', 'number'].includes(typeof item.label));
                }
            } catch (e) {
                await this.reInit();
            }

            this.data = list;
            return list;
        } catch (e) {
            return [];
        }
    }

    async add(task: TaskType): Promise<boolean> {
        let id = 0;
        if (this.data.length > 0) {
            id = Math.max(...this.data.map(item => item.id))
        }
        console.log({ id });

        const item: TaskInterface = {
            id: id + 1,
            label: task,
            isCompleted: false,
        };

        this.data.push(item);
        return await JsonStore.writeData(this.data);
    }

    async remove(task: TaskType, type: SearchType): Promise<boolean> {
        const index = this.findTask(task, type);
        if (index !== -1) {
            this.data.splice(index, 1);
            return await JsonStore.writeData(this.data);
        }

        return false;
    }

    async complete(task: TaskType, type: SearchType): Promise<boolean> {
        const index = this.findTask(task, type);
        if (index !== -1) {
            this.data[index].isCompleted = true;
            return await JsonStore.writeData(this.data);
        }

        return false;
    }
}