import { add, complete, completeAll, remove, removeAll } from './client';

// Gets the db cache from the localStorage.
export const get_db_cache = () => {
    let cache = JSON.parse(window.localStorage.getItem('db_cache'));
    if (cache === null){
        cache = {};
    }
    return cache;
};

// Pushes db entries to localStorage.
export const push_db_cache = (db) => {
    window.localStorage.setItem('db_cache', JSON.stringify(db));
};

// Gets db updates from localStorage.
export const get_db_updates = () => {
    return JSON.parse(window.localStorage.getItem('db_updates'));
};

// Pushes an update to localStorage.
export const push_db_update = (action, obj) => {
    let updates = get_db_updates();
    
    if (updates === null){
        updates = [{action: action, obj: obj}];
    } else {
        updates.push({action: action, obj: obj});
    }

    window.localStorage.setItem('db_updates', JSON.stringify(updates));
};

// Processes existing db updates from localStorage and clears them.
export const process_db_updates = () => {
    let updates = get_db_updates();
    window.localStorage.setItem('db_updates', JSON.stringify([]));

    for (let update of updates){
        switch (update.action){
            case 'make':
                add(update.obj);
                break;
            case 'complete':
                complete(update.obj);
                break;
            case 'completeAll':
                completeAll();
                break;
            case 'remove':
                remove(update.obj);
                break;
            case 'removeAll':
                removeAll();
                break;
        }
    }
};
