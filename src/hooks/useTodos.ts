
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
}

const STORAGE_KEY = 'tms-todos';

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
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => {
        if (todo.id === id) {
          const completed = !todo.completed;
          return { 
            ...todo, 
            completed,
            completedAt: completed ? new Date().toISOString() : undefined
          };
        }
        return todo;
      })
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
