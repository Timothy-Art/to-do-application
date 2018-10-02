import io from 'socket.io-client';

export const server = io('http://localhost:3003/');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
export const add = value => server.emit('make', {title : value});

export const complete = id => server.emit('complete', id);

export const completeAll = () => server.emit('complete_all');

export const remove = id => server.emit('delete', id);

export const removeAll = () => server.emit('delete_all');
