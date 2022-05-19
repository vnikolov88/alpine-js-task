function TodoMVC() {
  const storage = Storage()
  const { todos } = storage.get()

  return {
    init() {
    
    },

    save() {
      this.$nextTick(() => {
        storage.set({ todos: this.todos })
      })
    },

    // data

    todos,
    newTodo: '',

    // filtering

    listTodos() {
      switch (this.filter) {
        default:
          return this.todos
      }
    },


    // adding new todos

    add() {
      const id = new Date().getTime()
      this.todos = [
        ...this.todos,
        { id, description: this.newTodo.trim(), completed: false },
      ]
      this.newTodo = ''
    },

    // removing todos

    remove(todo) {
      const idx = findIdx(todo, this.todos)
      this.todos = [
        ...this.todos.slice(0, idx),
        ...this.todos.slice(idx + 1, this.todos.length),
      ]
    },

    clear(todos) {
      this.todos = [
        ...this.todos.slice(this.todos.length),
      ]
    },

    // editing todos

    editing(todo) {
      todo.editing = true
      todo.edit = todo.title
      todo.edit = todo.description

      this.$nextTick(() => {
        document.getElementById(`edit-${todo.id}`).focus()
      })
    },

    edit(todo) {
      const newTitle = todo.edit.trim()
      if (!newTitle) {
        this.remove(todo)
      } else {
        todo.title = newTitle
        this.reset(todo)
      }
    },

    reset(todo) {
      todo.editing = false
      todo.edit = ''
    },

  }
}

function Storage() {
  const KEY = 'todos-alpinejs'
  const defaultData = '{ "todos": [] }'

  return {
    get() {
      return JSON.parse(localStorage.getItem(KEY) || defaultData)
    },
    set({ todos, ...rest }) {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          ...rest,
          todos: todos.map(({ id, title, description  }) => ({
            id,
            title,
            description
          })),
        }),
      )
    },
  }
}

function findIdx(todo, todos) {
  const idx = todos.findIndex(({ id }) => id === todo.id)
  if (idx < 0) throw Error(`Can not find todo`)
  return idx
}
