const STORAGE_KEY = 'pendientes';

const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const counter = document.querySelector('#task-counter');

let tasks = loadTasks();

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = task.done ? 'task-item done' : 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks[index].done = checkbox.checked;
      update();
    });

    const text = document.createElement('span');
    text.textContent = task.text;

    const remove = document.createElement('button');
    remove.textContent = '✕';
    remove.title = 'Eliminar';
    remove.addEventListener('click', () => {
      tasks.splice(index, 1);
      update();
    });

    item.append(checkbox, text, remove);
    list.append(item);
  });

  const pending = tasks.filter((task) => !task.done).length;
  counter.textContent = `${pending} pendiente(s) de ${tasks.length}`;
}

function update() {
  saveTasks();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  tasks.push({ text: input.value.trim(), done: false });
  input.value = '';
  update();
});

render();
