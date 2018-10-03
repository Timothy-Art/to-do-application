import React, { Component } from 'react';
import TodoList from './todo-list';
import DBContext from '../contexts/db-context';
import { server, add, complete, completeAll, remove, removeAll } from '../client';
import {get_db_cache, push_db_cache, process_db_updates, push_db_update} from '../cache';
import 'bulma/css/bulma.min.css';

class App extends Component {
    constructor(props){
        super(props);

        // Context functions
        // Reloads the entire db state.
        this.load = db => {
            push_db_cache(db);
            this.setState({db: db});
        };

        // Updates a single entry in the db state.
        this.update = todo => {
            let db = Object.assign({}, this.state.db);

            if (todo.title in db){
                db[todo.title] = todo;
            } else {
                db[todo.title] = todo;
            }

            push_db_cache(db);
            this.setState({db: db});
        };

        // Deletes a single entry in the db state.
        this.del = title => {
            let db = Object.assign({}, this.state.db);

            if (title in db){
                delete db[title];
            }

            push_db_cache(db);
            this.setState({db: db});
        };

        // Adds a new entry, caches it if the server is unavailable.
        this.make = todo => {
            todo = todo.trim();
            if (todo !== ''){
                if (server.connected){
                    add(todo);
                } else {
                    this.update({title: todo, completed: false});
                    push_db_update('make', todo);
                }
            }
        };

        // Toggles complete on an entry, caches it if the server is unavailable.
        this.complete = title => {
            if (server.connected){
                complete({title: title, completed: !this.state.db[title].completed});
            } else {
                if (title in this.state.db){
                    let todo = {title: this.state.db[title].title, completed: !this.state.db[title].completed};
                    this.update(todo);
                    console.log(todo);
                    push_db_update('complete', todo);
                }
            }
        };

        // Sets complete to true on all entries, caches it if the server is unavailable.
        this.completeAll = () => {
            if (server.connected){
                completeAll();
            } else {
                let new_state = Object.assign({}, this.state.db);
                for (let key of Object.keys(new_state)){
                    new_state[key].completed = true;
                }
                this.load(new_state);
                push_db_update('complete_all', {});
            }
        };

        // Removes an entry, caches it if the server is unavailable.
        this.remove = title => {
            if (server.connected){
                remove(title);
            } else {
                if (title in this.state.db){
                    this.del(title);
                    push_db_update('remove', title);
                }
            }
        };

        // Removes all entries, caches it if the server is unavailable.
        this.removeAll = () => {
            if (server.connected){
                removeAll();
            } else {
                this.load({});
                push_db_update('removeAll', {});
            }
        };

        // NOTE: These are listeners for events from the server
        // This event is for (re)loading the entire list of todos from the server
        server.on('load', todos => {
            console.log(todos);
            this.load(todos);
            process_db_updates();
        });

        // This event manages updates (single todo) from the server.
        server.on('update', todo => this.update(todo));

        // This event manages deletion events on single todos from the server.
        server.on('delete', title => this.del(title));

        // This event manages a delete_all event from the server.
        server.on('delete_all', () => this.load({}));

        this.state = {
            db: get_db_cache(),
            load: this.load,
            update: this.update,
            del: this.del,
            make: this.make,
            complete: this.complete,
            completeAll: this.completeAll,
            remove: this.remove,
            removeAll: this.removeAll
        };
    };

    render(){
        return (
            <DBContext.Provider value={this.state}>
                <section className='App section'>
                    <div className='container'>
                        <h3 className='title'>What are we doing today?</h3>
                        <hr/>
                        <div className='content is-medium'>
                            <TodoList />
                        </div>
                    </div>
                </section>
            </DBContext.Provider>
        )
    };
}

export default App;
