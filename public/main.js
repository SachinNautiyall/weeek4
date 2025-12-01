const submitBtn = document.getElementById("submit-data")
const msgSpan = document.getElementById("showMessage")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("search")
const todosDiv = document.getElementById("showTodos")
const delMsg = document.getElementById("showTodosDelMsg")


submitBtn.addEventListener("click", async () => {
    const n = document.getElementById("userInput").value
    const t = document.getElementById("todoInput").value

    const data = { name: n, todo: t };

    const res = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const json = await res.json()

    msgSpan.innerHTML = '';
    const p = document.createElement("p")
    p.textContent = json.message;
    msgSpan.appendChild(p)

})


searchBtn.addEventListener("click", async () => {
    todosDiv.innerHTML = ''
    delMsg.innerHTML = ''

    const delBtn = document.getElementById("deleteUser")
    if (delBtn) delBtn.remove();

    const n = searchInput.value.trim();
    const res = await fetch(`http://localhost:3000/todos/${n}`)
    const json = await res.json()

    const ul = document.createElement("ul");
    ul.id="todoList"

    if (json.data && json.data.todos) {
        json.data.todos.forEach(item => {
            const li = document.createElement("li");
            const label = document.createElement("label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkBoxes";
            checkbox.checked = item.checked || false;

            const span = document.createElement("span");
            const a = document.createElement("a");
            a.textContent = item.todo;
            a.href = "#";
            a.className = "delete-task";

            span.appendChild(a);
            label.appendChild(checkbox);
            label.appendChild(span);
            li.appendChild(label);
            ul.appendChild(li);

            checkbox.addEventListener("change", async () => {
                try {
                    await fetch("http://localhost:3000/updateTodo", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: n,
                            todo: item.todo,
                            checked: checkbox.checked
                        }),
                    });
                } catch (err) {
                    console.error(err);
                }
            });
        });

        todosDiv.appendChild(ul);

        const delUserBtn = document.createElement("button");
        delUserBtn.id = 'deleteUser';
        delUserBtn.className = 'btn';
        delUserBtn.textContent = "Delete User";
        searchBtn.insertAdjacentElement("afterend", delUserBtn);

        delUserBtn.addEventListener("click", async () => {
            try {
                const delRes = await fetch("http://localhost:3000/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: n }),
                });

                const delData = await delRes.json();
                todosDiv.innerHTML = delData.message;
                delUserBtn.remove();
            } catch (err) {
                todosDiv.innerHTML = "Error deleting user.";
            }
        });

        const todoLinks = document.querySelectorAll(".delete-task");
        todoLinks.forEach(link => {
            link.addEventListener("click", async (e) => {
                e.preventDefault();
                const t = link.textContent;

                const delRes = await fetch("http://localhost:3000/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: n, todo: t }),
                });

                const msg = await delRes.json();
                link.closest('li').remove();
                delMsg.innerHTML = msg.message;
            });
        });
    } else {
        todosDiv.innerText = json.message;
    }

    
});