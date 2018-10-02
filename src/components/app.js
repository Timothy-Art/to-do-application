import React, { Component } from 'react';
import TodoList from './todo-list';
import {server} from '../client';

class App extends Component {
    constructor(props){
        super(props);

        this.state = {db: {}};


        // NOTE: These are listeners for events from the server
        // This event is for (re)loading the entire list of todos from the server
        server.on('load', todos => {
            console.log(todos);
            this.setState({db: todos})
        });

        server.on('update', todo => {
            console.log(todo);
            let db = Object.assign({}, this.state.db);

            if (todo.id in db){
                db[todo.id] = todo;
            } else {
                db[todo.id] = todo;
            }

            this.setState({db: db})
        });

        server.on('delete', id => {
            console.log(id);
            let db = Object.assign({}, this.state.db);

            if (id in db){
                delete db[id];
            }

            this.setState({db: db});
        });

        server.on('delete_all', () => {
            this.setState({db: {}})
        });
    }

    render(){
        let todos = Object.keys(this.state.db).map(key => this.state.db[key]);
        return (
            <div className='App'>
                <h3>TODO List</h3>
                <TodoList db={todos} />
            </div>
        )
    }
}

export default App;
