import { Todo } from '../types/Todo';
import { ToDo } from './Todo';

type Props = {
  activeTodo: Todo | null;
  setActiveTodo: (todo: Todo) => void;
  todoList: Todo[];
  loadingState: boolean;
  onDelete: (todoId: number) => void;
  update: (todoToUpdate: Todo) => Promise<void>;
  // update: (todoToUpdate: Todo) => void;
  // errorFunction: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  loadingState,
  activeTodo,
  setActiveTodo,
  update,
  // errorFunction,
  onDelete = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <ToDo
          activeTodo={activeTodo}
          setActiveTodo={setActiveTodo}
          todo={todo}
          loadingState={loadingState}
          onDelete={onDelete}
          update={update}
          // errorFunction={errorFunction}
          key={todo.id}
        />
      ))}
    </section>
  );
};
