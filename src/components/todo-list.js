import React, { Component } from 'react';
import { add, complete, remove, removeAll } from '../client';


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
                <input
                    type="text"
                    placeholder="Feed the cat"
                    value={this.state.value}
                    onChange={this.handleChange}
                    // Set to this.textInput so we can refer to it programmatically.
                    ref={input => this.textInput = input}
                    autoFocus
                />
                <button type="button" onClick={this.handleMake}>Add</button>
                <button type="button" onClick={removeAll}>Delete All</button>
            </div>
        )
    }
}

const ListDisplay = ({ todos }) => {
    return(
        <div>
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
            <div className={this.props.completed ? 'complete' : 'incomplete'}>
                <button type="button" onClick={this.handleDelete}>X</button>
                <button type="button" onClick={this.handleComplete}>{this.props.completed ? 'Cancel' : 'Complete'}</button>
                {this.props.title}
            </div>
        )
    };
}

export default TodoList;
