import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useReducer } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";

interface TodoItems {
  id: string;
  text: string;
  compeleted: boolean;
}
interface State {
  todos: TodoItems[];
  newTodo: string;
  editingId: string | null;
  editedText: string;
}
const initialState: State = {
  todos: [],
  newTodo: "",
  editingId: null,
  editedText: "",
};
type Actions =
  | { type: "add_todo"; payload: string }
  | { type: "toggle_todo"; payload: string }
  | { type: "delete_todo"; payload: string }
  | { type: "startEdit_todo"; payload: string }
  | { type: "saveEdit_todo"; payload: { id: string; text: string } }
  | { type: "add_todo"; payload: string }
  | { type: "set_newtodo"; payload: string }
  | { type: "update_editedtext"; payload: string };

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "add_todo":
      if (state.newTodo.trim()) {
        return {
          ...state,
          todos: [
            ...state.todos,
            {
              id: Math.random().toString(),
              text: state.newTodo,
              compeleted: false,
            },
          ],
          newTodo: "",
        };
      } else {
        alert("Please enter at least one letter.");
        return state;
      }
    case "set_newtodo":
      return {
        ...state,
        newTodo: action.payload,
      };

    case "toggle_todo":
      const updatedTodos = state.todos.map((todo) =>
        todo.id === action.payload
          ? { ...todo, compeleted: !todo.compeleted }
          : todo
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    case "delete_todo":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "update_editedtext":
      return {
        ...state,
        editedText: action.payload,
      };
    case "startEdit_todo":
      return {
        ...state,
        editingId: action.payload,
      };
    case "saveEdit_todo":
      if (state.editedText.trim()) {
        const updatedTodos = state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: state.editedText }
            : todo
        );
        return {
          ...state,
          todos: updatedTodos,
          editingId: null,
          editedText: "",
        };
      } else {
        alert("Please enter at least one letter.");
        return state;
      }
    default:
      return state;
  }
}
export default function TodoList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Todo App</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={state.newTodo}
        onChangeText={(text) =>
          dispatch({ type: "set_newtodo", payload: text })
        }
      />
      <Button
        title="Add"
        onPress={() => dispatch({ type: "add_todo", payload: state.newTodo })}
      />
      <FlatList
        data={state.todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <CheckBox
              checked={item.compeleted}
              onPress={() =>
                dispatch({ type: "toggle_todo", payload: item.id })
              }
            />
            {state.editingId === item.id ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={state.editedText}
                  onChangeText={(text) =>
                    dispatch({ type: "update_editedtext", payload: text })
                  }
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() =>
                    dispatch({
                      type: "saveEdit_todo",
                      payload: { id: item.id, text: state.editedText },
                    })
                  }
                >
                  <Ionicons name="save" size={24} color="blue" />
                </TouchableOpacity>
              </>
            ) : (
              <Text
                style={{
                  textDecorationLine: item.compeleted ? "line-through" : "none",
                }}
              >
                {item.text}
              </Text>
            )}
            <TouchableOpacity
              onPress={() =>
                dispatch({ type: "delete_todo", payload: item.id })
              }
            >
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch({ type: "startEdit_todo", payload: item.id });
              }}
            >
              <Ionicons name="create" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  editInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  header: {
    backgroundColor: "#3498db",
    padding: 18,
    alignItems: "center",
    margin: 10,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
