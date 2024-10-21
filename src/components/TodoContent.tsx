import { useEffect, useMemo, useState } from 'react';

import { TodoFooter } from './TodoFooter';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';

import { Todo } from '../types/Todo';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';

type Props = {
  errorFunction?: (message: string) => void;
};

export const TodoContent: React.FC<Props> = ({ errorFunction = () => {} }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoList, setTodoList] = useState<Todo[]>(todos);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => errorFunction('Unable to load todos'));
  }, []);

  useMemo(() => setTodoList(todos), [todos]);

  const deleteFunction = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => {
        errorFunction('Unable to delete a todo');
      })
      .finally(() => setLoading(false));
  };

  const addFunction = (
    tempTodoTitle: string,
    { userId, title, completed }: Omit<Todo, 'id'>,
  ) => {
    setLoading(true);

    const tempTodo: Todo = {
      id: 0,
      userId: 0,
      title: tempTodoTitle,
      completed: false,
    };

    setTodoList([...todos, tempTodo]);
    setActiveTodo(tempTodo);

    return createTodo({ userId, title, completed })
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(error => {
        throw error;
      })
      .finally(() => setLoading(false));
  };

  const updateFunction = (todoToUpdate: Todo) => {
    setLoading(true);
    const newActiveTodo = todos.find(todo => todo.id === todoToUpdate.id);

    if (newActiveTodo) {
      setActiveTodo(newActiveTodo);
    }

    setTodoList(currentTodos => {
      return currentTodos.map(todo =>
        todo.id === todoToUpdate.id ? todoToUpdate : todo,
      );
    });

    return updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(() => {
        errorFunction('Unable to add a todo');
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          setTodoList={setTodoList}
          // todoList={todoList}
          setTodos={setTodos}
          addTodo={addFunction}
          setActiveTodo={setActiveTodo}
          setLoading={setLoading}
          loadingState={loading}
          errorFunction={errorFunction}
          // updateFunction={updateFunction}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              activeTodo={activeTodo}
              setActiveTodo={setActiveTodo}
              todoList={todoList}
              loadingState={loading}
              onDelete={deleteFunction}
              update={updateFunction}
              // errorFunction={errorFunction}
            />
            <TodoFooter
              filterTodos={setTodoList}
              onDelete={deleteFunction}
              setLoading={setLoading}
              loadingState={loading}
              setActiveTodo={setActiveTodo}
              setTodos={setTodos}
              todos={todos}
              errorFunction={errorFunction}
            />
          </>
        )}
      </div>
    </>
  );
};
