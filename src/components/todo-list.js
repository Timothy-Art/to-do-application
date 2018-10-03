import React, { Component } from 'react';
import DBContext from '../contexts/db-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
import './todo-list.css';

// Component composing the TodoList inputs and display.
// Component accesses the db context.
const TodoList = () => {
    return(
        <DBContext.Consumer>
            {({ db }) => (
                <div>
                    <MakeInput />
                    <ListDisplay todos={Object.keys(db).map(key => db[key])}/>
                </div>
            )}
        </DBContext.Consumer>
    )
};

// Component with the TodoList inputs
// Component requires the make, removeAll, and completeAll context functions.
class MakeInput extends Component{
    constructor(props){
        super(props);
        this.state = {value: ''};

        // References to the inputs in the component. Set in the render method.
        this.textInput = null;
        this.submitInput = null;

        this.handleChange = this.handleChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleEnter(event){
        if (event.key === 'Enter'){
            this.submitInput.click();
        }
    }

    render(){
        return(
            <DBContext.Consumer>
                {({make, removeAll, completeAll}) => (
                    <div>
                    <div className='field'>
                    <input
                        type="text"
                        className="input"
                        placeholder="Feed the cat"
                        value={this.state.value}
                        onChange={this.handleChange}
                        onKeyDown={this.handleEnter}
                        // Set to this.textInput so we can refer to it programmatically.
                        ref={input => this.textInput = input}
                        autoFocus
                    />
                    </div>
                    <div className='columns is-multiline is-mobile'>
                        <div className='column is-narrow'>
                            <button
                                className='button is-info'
                                onClick={() => {
                                    make(this.state.value);
                                    this.setState({value: ''});
                                    this.textInput.focus();
                                }}
                                // Set to this.submitInput so we can refer to it.
                                ref={input => this.submitInput = input}
                            >
                                <span className='icon is-small'>
                                    <FontAwesomeIcon icon={fas.faPlusCircle} />
                                </span>
                                <span>Add</span>
                            </button>
                        </div>
                        <div className='column is-narrow'>
                            <button className='button is-danger' onClick={removeAll}>
                                <span className='icon is-small'>
                                    <FontAwesomeIcon icon={fas.faSadCry} />
                                </span>
                                <span>
                                    Delete All
                                </span>
                            </button>
                        </div>
                        <div className='column is-narrow'>
                            <button className='button is-warning' onClick={completeAll}>
                                <span className='icon is-small'>
                                    <FontAwesomeIcon icon={fas.faGrinSquint} />
                                </span>
                                <span>
                                    Complete All
                                </span>
                            </button>
                        </div>
                    </div>
                    <br/>
                    </div>
                )}
            </DBContext.Consumer>
        )
    }
}

// Component that displays each list item.
const ListDisplay = ({ todos }) => {
    return(
        <div>
            <hr className='list-rule'/>
            {todos.map(todo => <ListItem key={todo.title} title={todo.title} completed={todo.completed} />)}
        </div>
    );
};

// Component of an individual list item with controls.
// Component requires the complete and remove context functions.
const ListItem = ({ title, completed }) => {
    return (
        <DBContext.Consumer>
            {({complete, remove}) => (
              <div>
                  <div className='field is-grouped todo-item'>
                    <p className='control'>
                        <button className='button is-text has-text-danger' onClick={() => remove(title)}>
                            <FontAwesomeIcon icon={far.faTrashAlt}/>
                        </button>
                    </p>
                    <p className='control'>
                        <button className={completed ? 'button is-text has-text-info' : 'button is-text'} onClick={() => complete(title)}>
                            <FontAwesomeIcon
                                icon={completed ? far.faCheckCircle : far.faCircle}
                            />
                        </button>
                    </p>
                    <p>
                        { title }
                    </p>
                </div>
                <hr className='list-rule'/>
              </div>
            )}
        </DBContext.Consumer>
    )
};

export default TodoList;
