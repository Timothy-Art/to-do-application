const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
let DB = {};
for (let t of firstTodos){
    DB[t.title] = new Todo(t.title);
}
console.log(DB);

server.on('connection', (client) => {
    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    };

    // Sends an update message with the updated entry.
    const updateTodo = (title) => {
        server.emit('update', DB[title]);
    };

    // Send a delete message with the title of the entry to delete.
    const deleteTodo = (title) => {
        server.emit('delete', title);
    };

    // Accepts when a client makes a new todo. Emits an update event.
    client.on('make', (t) => {
        // Make a new todo
        let newTodo = new Todo(t.title);

        // Push this newly created todo to our database
        DB[t.title] = newTodo;

        // Send the new todo to our clients
        updateTodo(newTodo.title);
    });

    // Accepts when a client completes a todo and toggles the completed property. Emits an update event.
    client.on('complete', (title) => {
        // Toggle our completed field when the message is sent.
        if (title in DB){
            DB[title].completed = !DB[title].completed;
        }

        // Send an update with the completed todo item.
        updateTodo(title);
    });

    // Accepts when a client completes all todos. Emits a load event.
    client.on('complete_all', () => {
        // Toggle all completed fields.
        Object.keys(DB).map(key => DB[key].completed = true);

        // Reload the todos.
        reloadTodos();
    });

    // Accepts when a client deletes a todo. Emits a delete event.
    client.on('delete', (title) => {
        // Delete our desired element from the database.
        if (title in DB){
            delete DB[title];
        }

        // Send a delete command to our clients.
        deleteTodo(title);
    });

    // Accepts when a client deletes all entries. Emits a load event.
    client.on('delete_all', () => {
        // Clear our database.
        DB = {};

        // Reload the todos.
        reloadTodos()
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
