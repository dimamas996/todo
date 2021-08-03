(function () {
  //создаём и возвращаем заголоок приложния
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаём и возвращаем aформу для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  //создаём и возвращаем сприсок элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name, done = undefined) {
    let item = document.createElement("li");
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // устанавливаем стили для элемент списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (done === true) {
      item.classList.add("list-group-item-success");
    }
    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    if (done === true) {
      item.classList.add("list-group-item-success");
    }

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // функция добавления списка дел в LocalStorage
  function addToLocalStorage(todoListName) {
    localStorage.removeItem(todoListName);
    let list = document.getElementsByTagName("li");
    let listOfObj = [];
    for (let item of list) {
      todoObj = {
        name: item.textContent.replace("ГотовоУдалить", ""),
        done: item.classList.contains("list-group-item-success") ? true : false,
      };
      listOfObj.push(todoObj);
    }
    localStorage.setItem(todoListName, JSON.stringify(listOfObj));
    if (listOfObj.length == 0) {
      localStorage.removeItem(todoListName);
    }
  }

  // функция изъятия списка дел из LocalStorage
  function getFromLocalStorage(objList, title) {      
    let todoList = createTodoList();     
    for (let item of objList) {
    let todoItem = createTodoItem(item.name, item.done);

    //добавляем обработчкики на кнопки
    todoItem.doneButton.addEventListener("click", function () {
      todoItem.item.classList.toggle("list-group-item-success");
      addToLocalStorage(title); //обновления списка дел, если дело выполнено
    });
    todoItem.deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        todoItem.item.remove();
        addToLocalStorage(title); //обновления списка дел, если дело удалено
      }
    });

    todoList.append(todoItem.item);
    }
    return todoList;
  }

  function createTodoApp(container, title = "Список дел", localStorageList = undefined) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    todoItemForm.button.disabled = true; //чтобы у кнопки в форме устанавливался атрибут disabled, когда поле ввода пустое

    // выполнить функцию изъятия списка дел из LocalStorage, если список передан
    if (localStorageList != undefined) {      
      todoList = getFromLocalStorage(JSON.parse(localStorageList), title);      
    }

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    //чтобы у кнопки в форме атрибут disabled пропадал, когда введен хотя бы один символ и появлялся, если мы в ручную отчистили инпут в форме
    todoItemForm.input.addEventListener("input", function () {
      if (todoItemForm.input.value === "") {
        todoItemForm.button.disabled = true; 
      } else {
        todoItemForm.button.disabled = false;
      }
    });

    // браузер создаёт событие sbmit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима , чтоы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игноримаруем создаие элемента, если пользователь ничего не ввёл в поле (если атрибут disabled установлен правильно, он не возволит создать элемент при пустом значении поля)
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);

      //добавляем обработчкики на кнопки
      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");
        addToLocalStorage(title); //обновления списка дел, если дело выполнено
      });
      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItem.item.remove();
          addToLocalStorage(title); //обновления списка дел, если дело удалено
        }
      });

      // создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // обнуляем значение в поле, чтобы не пришлось стриать вручную
      todoItemForm.input.value = "";
      //чтобы у кнопки в форме устанавливался атрибут disabled, когда поле отчистилось после ввода дела
      todoItemForm.button.disabled = true;
      // сохранение списка дел в local storage
      addToLocalStorage(title);
    });
    //общее
  }
  window.createTodoApp = createTodoApp;
})();
