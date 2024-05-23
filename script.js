// Funções para manipulação de tarefas
let currentTaskId = null;
let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(task => {
    task.addEventListener('dragstart', dragstart_handler);
  });

  document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', dragover_handler);
    column.addEventListener('drop', drop_handler);
  });
});

function dragstart_handler(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

function dragover_handler(event) {
  event.preventDefault();
}

function drop_handler(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const taskElement = document.getElementById(taskId);
  const columnBody = event.target.closest('.column').querySelector('.cards_list');

  if (columnBody) {
    columnBody.appendChild(taskElement);
  }
}

function openModal(columnId) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('column').value = columnId;
  isEditing = false;
  document.getElementById('creationModeTitle').style.display = 'block';
  document.getElementById('editingModeTitle').style.display = 'none';
  document.getElementById('creationModeBtn').style.display = 'block';
  document.getElementById('editingModeBtn').style.display = 'none';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('description').value = '';
  document.getElementById('priority').value = 'Baixa';
  document.getElementById('column').value = '1';
  document.getElementById('deadline').value = '';
}

function createTask() {
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;
  const column = document.getElementById('column').value;
  const deadline = document.getElementById('deadline').value;
  const taskId = `task-${Date.now()}`;

  const taskElement = document.createElement('div');
  taskElement.className = 'card';
  taskElement.id = taskId;
  taskElement.setAttribute('draggable', 'true');
  taskElement.addEventListener('dragstart', dragstart_handler);
  
  taskElement.innerHTML = `
    <div class="info">
      <span>${description}</span>
      <span>Prioridade: ${priority}</span>
      <span>Prazo: ${deadline}</span>
    </div>
    <div class="actions">
      <button onclick="editTask('${taskId}')">Editar</button>
      <button onclick="deleteTask('${taskId}')">Excluir</button>
    </div>
  `;

  document.querySelector(`.column[data-column="${column}"] .cards_list`).appendChild(taskElement);

  closeModal();
}

function editTask(taskId) {
  const taskElement = document.getElementById(taskId);
  const info = taskElement.querySelector('.info').children;
  const description = info[0].textContent;
  const priority = info[1].textContent.split(': ')[1];
  const deadline = info[2].textContent.split(': ')[1];

  document.getElementById('idInput').value = taskId;
  document.getElementById('description').value = description;
  document.getElementById('priority').value = priority;
  document.getElementById('column').value = taskElement.closest('.column').getAttribute('data-column');
  document.getElementById('deadline').value = deadline;

  document.getElementById('modal').style.display = 'flex';
  document.getElementById('creationModeTitle').style.display = 'none';
  document.getElementById('editingModeTitle').style.display = 'block';
  document.getElementById('creationModeBtn').style.display = 'none';
  document.getElementById('editingModeBtn').style.display = 'block';

  currentTaskId = taskId;
  isEditing = true;
}

function updateTask() {
  if (!isEditing) return;

  const taskId = document.getElementById('idInput').value;
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;
  const column = document.getElementById('column').value;
  const deadline = document.getElementById('deadline').value;

  const taskElement = document.getElementById(taskId);
  taskElement.querySelector('.info').innerHTML = `
    <span>${description}</span>
    <span>Prioridade: ${priority}</span>
    <span>Prazo: ${deadline}</span>
  `;

  document.querySelector(`.column[data-column="${column}"] .cards_list`).appendChild(taskElement);

  closeModal();
}

function deleteTask(taskId) {
  document.getElementById(taskId).remove();
}
