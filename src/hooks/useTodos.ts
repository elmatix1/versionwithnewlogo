
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

const STORAGE_KEY = 'todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => 
    loadFromLocalStorage<Todo[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, todos);
  }, [todos]);

  const addTodo = (task: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      task,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, task: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, task } : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  };
}
