/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { USER_ID } from '../api/todos';
// import { event } from 'cypress/types/jquery';

type Props = {
  todo: Todo;
  activeTodo: Todo | null;
  setActiveTodo: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  update: (todoToUpdate: Todo) => Promise<void>;
  // update: (todoToUpdate: Todo) => void;
  // errorFunction: (message: string) => void;
  loadingState: boolean;
};

export const ToDo: React.FC<Props> = ({
  todo,
  activeTodo,
  setActiveTodo,
  update,
  // errorFunction,
  onDelete = () => {},
  loadingState,
}) => {
  const [onEdit, setOnEdit] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [todoStatus, setTodoStatus] = useState(todo.completed);

  // const completedTodo = todoStatus;
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onEdit && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [onEdit]);

  useEffect(() => {
    setTodoStatus(todo.completed);
  }, [todo]);

  const handleDelete = (todoToDelete: Todo) => {
    setActiveTodo(todoToDelete);
    onDelete(todoToDelete.id);
  };

  const handleUpdate = () => {
    setOnEdit(false);
    setActiveTodo(todo);
    const normalizedTitle = title.trim();

    const todoToUpdate: Todo = {
      id: todo.id,
      title: normalizedTitle,
      userId: USER_ID,
      completed: todoStatus,
    };

    if (normalizedTitle === todo.title) {
      setOnEdit(false);

      // return;
    }

    if (normalizedTitle.length === 0) {
      handleDelete(todo);

      // return;
    }

    if (todoStatus !== todo.completed || normalizedTitle !== todo.title) {
      update(todoToUpdate)
        .then(() => {})
        .catch(() => {
          // setTodoList(todos);
          setOnEdit(true);
        });
    }
  };

  const submitUpdate = (
    event: React.FormEvent<HTMLInputElement | HTMLFormElement>,
  ) => {
    event.preventDefault();

    handleUpdate();
  };

  const setTodoStatusFunction = () => {
    if (todo.completed) {
      setTodoStatus(false);
    } else {
      setTodoStatus(true);
    }

    handleUpdate();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOnEdit(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      onDoubleClick={() => setOnEdit(true)}
      className={classNames('todo', { completed: todoStatus })}
    >
      <label
        htmlFor={`${todo.id}`}
        onClick={() => setTodoStatusFunction()}
        className="todo__status-label"
      >
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoStatus}
        />
      </label>

      {!onEdit ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={event => submitUpdate(event)}>
          <input
            data-cy="TodoTitleField"
            ref={todoInputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // value="Todo is being edited now"
            value={title}
            onChange={event => onInputChange(event)}
            onSubmit={event => submitUpdate(event)}
            onBlur={() => handleUpdate()}
            onKeyUp={event => handleKeyUp(event)}
            // onKeyUp={() => {
            //   setOnEdit(false);
            // }}
          />
        </form>
      )}

      <Loader loadingState={loadingState} todo={todo} activeTodo={activeTodo} />
    </div>
  );
};
