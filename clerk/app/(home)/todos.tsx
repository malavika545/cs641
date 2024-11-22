import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { TodoItem } from '../../components/ToDoItem';
import { Todo } from '../../types/todo';
import { TodoService } from '../../services/toDoService';

export default function TodosScreen() {
  const { user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    const loadedTodos = await TodoService.getTodos(user.id);
    setTodos(loadedTodos);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddTodo = async () => {
    if (!user || !newTodo.trim()) return;

    await TodoService.addTodo(user.id, newTodo.trim(), image);
    setNewTodo('');
    setImage(null);
    loadTodos();
  };

  const handleToggleTodo = async (todo: Todo) => {
    await TodoService.toggleTodo(todo.id, !todo.completed);
    loadTodos();
  };

  const handleDeleteTodo = async (todoId: string) => {
    await TodoService.deleteTodo(todoId);
    loadTodos();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo..."
        />
        <TouchableOpacity 
          style={styles.imageButton}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>
            {image ? 'Change Image' : 'Add Image'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.addButton, !newTodo.trim() && styles.disabledButton]}
          onPress={handleAddTodo}
          disabled={!newTodo.trim()}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => handleToggleTodo(item)}
            onDelete={() => handleDeleteTodo(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});