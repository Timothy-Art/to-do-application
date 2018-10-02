import React from 'react';

// DBContext for our TodoList
const DBContext = React.createContext({
    db: {},
    load: () => {},
    update: () => {},
    del: () => {},
    make: () => {},
    complete: () => {},
    completeAll: () => {},
    remove: () => {},
    removeAll: () => {}
});

export default DBContext
