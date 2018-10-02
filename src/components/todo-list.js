import React, { Component } from 'react';
import { add, complete, remove, removeAll, completeAll } from '../client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fas from '@fortawesome/free-solid-svg-icons';
import './todo-list.css';


const TodoList = ({ db }) => {
    return(
        <div>
            <MakeInput />
            <ListDisplay todos={db}/>
        </div>
    )
};

class MakeInput extends Component{
    constructor(props){
        super(props);
        this.state = {value: ''};

        this.handleMake = this.handleMake.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleMake(){
        add(this.state.value);
        this.setState({value: ''});
        this.textInput.focus()
    }

    render(){
        return(
            <div>
                <div className='field'>
                    <input
                        type="text"
                        className="input"
                        placeholder="Feed the cat"
                        value={this.state.value}
                        onChange={this.handleChange}
                        // Set to this.textInput so we can refer to it programmatically.
                        ref={input => this.textInput = input}
                        autoFocus
                    />
                </div>
                <div className='field is-grouped'>
                    <div className='control'>
                        <button className='button is-info' onClick={this.handleMake}>
                            <span className='icon is-small'>
                                <FontAwesomeIcon icon={fas.faPlusCircle} />
                            </span>
                            <span>Add</span>
                        </button>
                    </div>
                    <div className='control'>
                        <button className='button is-danger' onClick={removeAll}>
                            <span className='icon is-small'>
                                <FontAwesomeIcon icon={fas.faSadCry} />
                            </span>
                            <span>
                                Delete All
                            </span>
                        </button>
                    </div>
                    <div className='control'>
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
        )
    }
}

const ListDisplay = ({ todos }) => {
    return(
        <div>
            <hr className='list-rule'/>
            {todos.map(todo => <ListItem key={todo.id} id={todo.id} title={todo.title} completed={todo.completed} />)}
        </div>
    );
};

class ListItem extends Component{
    constructor(props){
        super(props);

        this.handleComplete = this.handleComplete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };

    handleComplete(){
        complete(this.props.id);
    };

    handleDelete(){
        remove(this.props.id);
    };

    render() {
        return (
            <div>
                <div className='field is-grouped todo-item'>
                    <p className='control'>
                        <button className='button is-text has-text-danger' onClick={this.handleDelete}>
                            <FontAwesomeIcon icon={far.faTrashAlt}/>
                        </button>
                    </p>
                    <p className='control'>
                        <button className={this.props.completed ? 'button is-text has-text-info' : 'button is-text'} onClick={this.handleComplete}>
                            <FontAwesomeIcon
                                icon={this.props.completed ? far.faCheckCircle : far.faCircle}
                            />
                        </button>
                    </p>
                    <p>
                        {this.props.title}
                    </p>
                </div>
                <hr className='list-rule'/>
            </div>
        )
    };
}

export default TodoList;
