var database = firebase.database()
var dbRefUsers = database.ref('users')

//Trata da submissão do formularios de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault();
  if (todoForm.name.value != '') {
    var data = {
      name: todoForm.name.value
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
      console.log('Tarefa "' + data.name + '" adicionada com sucesso')
    }).catch((error)=>{
      showError('Falha ao adicionar tarefa: ', error)
    })
  } else {
    alert('O nome da tarefa não pode está vazia')
  }
}


//Exibir lista de tarefas de usuário
function fillTodoList(dataSnapshot){
  ulTodoLit.innerHTML = ''
  var num = dataSnapshot.numChildren();
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':';
  
  dataSnapshot.forEach(function(item){
    var value = item.val();
    var li = document.createElement('li')
    var spanLi = document.createElement('span')
    spanLi.appendChild(document.createTextNode(value.name))
    li.appendChild(spanLi)
    ulTodoLit.appendChild(li)
  })
  
}

