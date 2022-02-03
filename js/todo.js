var database = firebase.database()
var dbRefUsers = database.ref('users')

//Trata da submissão do formularios de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault();
  var file = todoForm.file.files[0] // Seleciona o primeiro arquivo da seleção de arquivos
  if (todoForm.name.value != '') {
   if(file != null){ //verifica se o arquivo foi selecionado
      if(file.type.includes('image')){//verifica se o arquivo é uma imagem
        //Compõe nome do arquivo
        var imgName = firebase.database().ref().push().key + '-' + file.name
        //compõe o caminho do arquivo
        var imgPath = 'todoListFiles /' + firebase.auth().currentUser.uid + '/' + imgName
        //Referencia de arquivo usando o caminho criado na linha acima
        var storageRef = firebase.storage().ref(imgPath)
        //inicia o precesso de upload
        storageRef.put(file) 
      } 
    }

    var data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase()
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).push(data).then(function () {
      console.log('Tarefa "' + data.name + '" adicionada com sucesso')
    }).catch((error) => {
      showError('Falha ao adicionar tarefa: ', error)
    })

    todoForm.name.value = ''
  } else {
    alert('O nome da tarefa não pode está vazia')
  }
}


//Exibir lista de tarefas de usuário
function fillTodoList(dataSnapshot) {
  ulTodoLit.innerHTML = ''
  var num = dataSnapshot.numChildren();
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':';

  dataSnapshot.forEach(function (item) {
    var value = item.val();
    var li = document.createElement('li')
    var spanLi = document.createElement('span')
    spanLi.appendChild(document.createTextNode(value.name))
    spanLi.id = item.key
    li.appendChild(spanLi)

    var liRemoveBtn = document.createElement('button')
    liRemoveBtn.appendChild(document.createTextNode('Excluir'))
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")')
    liRemoveBtn.setAttribute('class', 'danger todoBtn')
    li.appendChild(liRemoveBtn)

    var liUpdateBtn = document.createElement('button')
    liUpdateBtn.appendChild(document.createTextNode('Editar'))
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")')
    liUpdateBtn.setAttribute('class', 'alternative todoBtn')
    li.appendChild(liUpdateBtn)

    ulTodoLit.appendChild(li)
  })

}

function removeTodo(key) {
  var selectedItem = document.getElementById(key)
  var confirmation = confirm('Realmente deseja remover a tarefa \"' + selectedItem.innerHTML + '\" ?')
  if (confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove().then(()=>{
      console.log('tarefa ' + selectedItem.innerHTML + ' removida com sucesso')
    }).catch((error) => {
      showError('Falha ao remove tarefa: ', error)
    })
  }
}

function updateTodo(key) {
  var selectedItem = document.getElementById(key)
  var newTodoname = prompt('Escolha um novo nome para a tarefa \"' + selectedItem.innerHTML + '\".',selectedItem.innerHTML)
  if(newTodoname != ''){
    var data = {
      name: newTodoname,
      nameLowerCase: newTodoname.toLowerCase()
    }
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data).then(()=>{
      console.log('tarefa ' + data.name + ' atualizada com sucesso')
    }).catch(() => {
      showError('Falha ao atualizar tarefa: ', error)
    })
  }else{
    alert('O nome da tarefa não pode ser em branco para atualizar a tarefa')
  }
  
}



