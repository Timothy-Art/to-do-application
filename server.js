const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

let DB = {};
let index = 0;
for (let t of firstTodos){
    DB[index] = new Todo(index, t.title);
    index++;
}

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    };

    const updateTodo = (id) => {
        server.emit('update', DB[id]);
    };

    const deleteTodo = (id) => {
        server.emit('delete', id);
    };

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        let newTodo = new Todo(index, t.title);

        // Push this newly created todo to our database
        DB[index] = newTodo;
        index++;

        // Send the new todo to our clients
        updateTodo(newTodo.id);
    });

    client.on('complete', (id) => {
        // Toggle our completed field when the message is sent.
        DB[id].completed = !DB[id].completed;

        // Send an update with the completed todo item.
        updateTodo(id);
    });

    client.on('complete_all', () => {
        // Toggle all completed fields.
        Object.keys(DB).map(key => DB[key].completed = true);

        // Reload the todos.
        reloadTodos();
    });

    client.on('delete', (id) => {
        // Delete our desired element from the database.
        if (id in DB){
            delete DB[id];
        }

        // Send a delete command to our clients.
        deleteTodo(id);
    });

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
