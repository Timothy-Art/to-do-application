import io from 'socket.io-client';

export const server = io('http://localhost:3003/');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
export const add = value => server.emit('make', {title : value});

export const complete = todo => server.emit('complete', todo);

export const completeAll = () => server.emit('complete_all');

export const remove = title => server.emit('delete', title);

export const removeAll = () => server.emit('delete_all');
