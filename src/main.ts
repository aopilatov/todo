#! /usr/bin/env node

import { Command } from 'commander';
import { Store } from './services/store';
import { TaskType, SearchType } from './types';

(() => {
    const program = new Command();
    const store = new Store('json');

    program.command('list')
        .description('get list of tasks')
        .argument('[filter]', 'filter', 'all')
        .action(async (filter) => {
            console.log({ filter });
            const list = await store.get(filter);
            console.table(list);
        });

    program.command('add')
        .description('add task')
        .argument('<string>', 'task string')
        .action(async (task: TaskType) => {
            if (await store.add(task)) {
                console.log('Successfully added');
            } else {
                console.error('Error while added');
            }
        });

    program.command('complete')
        .description('mark task as completed')
        .argument('<task>', 'task id or value')
        .argument('[search]', 'search by value or key')
        .action(async (task: TaskType, search: SearchType) => {
            if (await store.complete(task, search)) {
                console.log('Successfully marked as completed');
            } else {
                console.error('Error while marked');
            }
        });

    program.command('remove')
        .description('remove task')
        .argument('<task>', 'task id or value')
        .argument('[search]', 'search by value or key')
        .action(async (task: TaskType, search: SearchType) => {
            if (await store.remove(task, search)) {
                console.log('Successfully removed');
            } else {
                console.error('Error while marked');
            }
        });

    program.parse();
})();