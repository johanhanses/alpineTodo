window.todoStore = {
    todos: JSON.parse(localStorage.getItem("todo-store") || "[]"),

    save() {
        localStorage.setItem("todo-store", JSON.stringify(this.todos));
    }
};

window.todoApp = function() {
    return {
        ...todoStore,
        newTodo: "",
        edited: null,
        filter: "all",

        get active() {
            return this.todos.filter(todo => !todo.completed);
        },

        get completed() {
            return this.todos.filter(todo => todo.completed);
        },

        get filteredTodos() {
            //Lookup table
            return {
                all: this.todos,
                active: this.active,
                completed: this.completed
            }[this.filter];

            // trad approach.
            // if (this.filter === "all") {
            //     return this.todos;
            // }

            // if (this.filter === "active") {
            //     return this.active;
            // }

            // if (this.filter === "completed") {
            //     return this.completed;
            // }
        },

        get allComplete() {
            return this.todos.length === this.completed.length;
        },

        addTodo() {
            if (!this.newTodo) {
                return;
            }

            this.todos.push({
                id: Date.now(),
                body: this.newTodo,
                completed: false
            });

            //Update localstorage
            this.save();
            // Clear input field
            this.newTodo = "";
        },

        deleteTodo(todo) {
            const position = this.todos.indexOf(todo);

            this.todos.splice(position, 1);
            this.save();
        },

        completeTodo(todo) {
            todo.completed = !todo.completed;
            this.save();
        },

        editTodo(todo) {
            todo.cashedBody = todo.body;
            this.edited = todo;
        },

        cancelEdit(todo) {
            todo.body = todo.cashedBody;
            this.edited = null;
            delete todo.cashedBody;
        },

        editComplete(todo) {
            if (todo.body.trim() === "") {
                return this.deleteTodo(todo);
            }

            this.edited = null;
            this.save();
        },

        clearCompletedTodos() {
            this.todos = this.active;

            this.save();
        },

        toggleCompletion(todo) {
            todo.completed = !todo.completed;

            this.save();
        },

        toggleAllComplete() {
            const allComplete = this.allComplete;
            this.todos.forEach(todo => (todo.completed = !allComplete));

            this.save();
        }
    };
};
