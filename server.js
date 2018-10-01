const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

let DB = firstTodos.map((t, i) => {
    // Form new Todo objects
    return new Todo(i, title=t.title);
});

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(DB.length, title=t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);
        console.log(DB);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        server.emit('load', [DB[DB.length - 1]]);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
