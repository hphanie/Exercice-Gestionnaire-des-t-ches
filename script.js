// Sélection des éléments
const taskInput = document.querySelector('#taskInput');
const filterSelect = document.querySelector('.main_header_actions_right_filter');
const mainTaskContent = document.querySelector('#main-task__content');

// Modal et formulaire
const addNewTaskModal = document.querySelector('#taskModal');
const closeModal = document.querySelector('#closeModal');
const addTaskForm = document.querySelector('.form');

// Variable pour suivre l'édition (null = ajout, sinon l'id de la tâche modifiée)
let currentEditingTaskId = null;

// Gestion des tâches dans localStorage
const TASK = {
  getTasks: function() {
    let tasks = localStorage.getItem('tasks');
    if (tasks) {
      return JSON.parse(tasks);
    } else {
      localStorage.setItem('tasks', JSON.stringify([]));
      return [];
    }
  },
  saveTasks: function(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },
  addTask: function(task) {
    const tasks = TASK.getTasks();
    tasks.push(task);
    TASK.saveTasks(tasks);
  },
  updateTask: function(updatedTask) {
    let tasks = TASK.getTasks();
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    TASK.saveTasks(tasks);
  },
  deleteTask: function(taskId) {
    let tasks = TASK.getTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    TASK.saveTasks(tasks);
  }
};

// Affichage des tâches en fonction du filtre
function displayTasks() {
  const tasks = TASK.getTasks();
  const filterValue = parseInt(filterSelect.value);
  const tasksToDisplay = filterValue === 0 ? tasks : tasks.filter(task => task.status === filterValue);

  mainTaskContent.innerHTML = "";
  if (tasksToDisplay.length > 0) {
    mainTaskContent.style.display = 'grid';
    tasksToDisplay.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('main-task__content-item');

      // Titre
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('main-task__content-item__title');
      titleDiv.textContent = task.title;
      taskDiv.appendChild(titleDiv);

      // Description
      const descP = document.createElement('p');
      descP.classList.add('main-task__content-item__desc');
      descP.textContent = task.description;
      taskDiv.appendChild(descP);

      // Date
      const dateDiv = document.createElement('div');
      dateDiv.classList.add('main-task__content-item__date');
      dateDiv.textContent = task.date;
      taskDiv.appendChild(dateDiv);

      // Actions
      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('main-task__content-item__actions');

      // Statut
      const statusSpan = document.createElement('span');
      statusSpan.classList.add('main-task__content-item__actions_status');
      let statusText = '', statusClass = '';
      if (task.status === 1) {
        statusText = 'En cours';
        statusClass = 'pending';
      } else if (task.status === 2) {
        statusText = 'Annulé';
        statusClass = 'canceled';
      } else if (task.status === 3) {
        statusText = 'Terminé';
        statusClass = 'completed';
      }
      statusSpan.textContent = statusText;
      statusSpan.classList.add(statusClass);
      actionsDiv.appendChild(statusSpan);

      // Boutons d'actions
      const btnContainer = document.createElement('div');

      // Bouton "Voir plus"
      const seeMoreBtn = document.createElement('button');
      seeMoreBtn.classList.add('rounded-btn', 'see-more');
      seeMoreBtn.textContent = 'v+';
      seeMoreBtn.dataset.id = task.id;
      seeMoreBtn.addEventListener('click', () => {
        alert(`Titre: ${task.title}\nDescription: ${task.description}\nDate: ${task.date}`);
      });
      btnContainer.appendChild(seeMoreBtn);

      // Bouton "Modifier"
      const modifyBtn = document.createElement('button');
      modifyBtn.classList.add('rounded-btn', 'modify');
      modifyBtn.textContent = 'm';
      modifyBtn.dataset.id = task.id;
      modifyBtn.addEventListener('click', () => {
        // Ouvrir le modal en mode édition
        currentEditingTaskId = task.id;
        // Pré-remplir le formulaire avec les informations de la tâche
        document.querySelector('#taskTitle').value = task.title;
        document.querySelector('#taskDescription').value = task.description;
        document.querySelector('#taskDate').value = task.date;
        // Mettre à jour le titre du modal (optionnel)
        document.querySelector('.modal_title').textContent = "Modifier la tâche";
        addNewTaskModal.classList.add('active');
      });
      btnContainer.appendChild(modifyBtn);

      // Bouton "Valider" (change le statut en Terminé)
      const validateBtn = document.createElement('button');
      validateBtn.classList.add('rounded-btn', 'validate');
      validateBtn.textContent = 'va';
      validateBtn.dataset.id = task.id;
      validateBtn.addEventListener('click', () => {
        task.status = 3;
        TASK.updateTask(task);
        filterSelect.value = "3"; // mettre à jour le filtre sur "Terminé"
        displayTasks();
      });
      btnContainer.appendChild(validateBtn);

      actionsDiv.appendChild(btnContainer);
      taskDiv.appendChild(actionsDiv);

    
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.classList.add('checkTask');
      checkBox.dataset.id = task.id;
      checkBox.addEventListener('click', () => {
        TASK.deleteTask(task.id);
        displayTasks();
      });
      taskDiv.appendChild(checkBox);

      mainTaskContent.appendChild(taskDiv);
    });
  } else {
    mainTaskContent.style.display = 'block';
    mainTaskContent.innerHTML = `<section class="box box-center"><h1>Aucune tâche disponible...</h1></section>`;
  }
}


taskInput.addEventListener('click', () => {
 
  currentEditingTaskId = null;
  document.querySelector('.modal_title').textContent = "Ajouter une tâche";
  addTaskForm.reset();
  addNewTaskModal.classList.add('active');
});


closeModal.addEventListener('click', () => {
  addNewTaskModal.classList.remove('active');
});


addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = addTaskForm.querySelector('input[name="taskTitle"]').value.trim();
  const description = addTaskForm.querySelector('textarea[name="taskDescription"]').value.trim();
  const date = addTaskForm.querySelector('input[name="taskDate"]').value;
  if (title !== "") {
    const tasks = TASK.getTasks();
    if (currentEditingTaskId !== null) {
     
      const updatedTask = {
        id: currentEditingTaskId,
        title: title,
        description: description,
        date: date,
        status: 1  
      };
      TASK.updateTask(updatedTask);
      currentEditingTaskId = null;
    } else {
     
      const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        date: date,
        status: 1 
      };
      TASK.addTask(newTask);

      filterSelect.value = "1";
    }
    addTaskForm.reset();
    addNewTaskModal.classList.remove('active');
    displayTasks();
  }
});


filterSelect.addEventListener('change', () => {
  displayTasks();
});


displayTasks();
