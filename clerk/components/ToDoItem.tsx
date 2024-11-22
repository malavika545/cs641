import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onToggle} style={styles.todoContent}>
      <View style={[styles.checkbox, todo.completed && styles.checked]} />
      <View style={styles.textContainer}>
        <Text style={[styles.text, todo.completed && styles.completedText]}>
          {todo.text}
        </Text>
        {todo.imageUrl && (
          <Image source={{ uri: todo.imageUrl }} style={styles.image} />
        )}
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Text style={styles.deleteText}>×</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    fontSize: 24,
    color: '#FF3B30',
  },
});