function createAlert(message, type) {
  const alertPlaceholder = document.getElementById('alertPlaceholder')
  const wrapper = document.createElement('div')
  while (alertPlaceholder.firstChild) {
    alertPlaceholder.removeChild(alertPlaceholder.firstChild);
  }
  let icon = ""
  switch (type) {
    case "info":
      icon = "fa fas fa-info-circle"
      break;

    case "success":
      icon = "fa fa-check-circle"
      break;

    default:
      icon = "fa fa-exclamation-triangle"
      break;
  }

  wrapper.innerHTML = [
    `<div class="alert alert-${type} live-alert d-flex align-items-center alert-dismissible" role="alert">`,
    `   <i class="${icon} icn-alert"></i>`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  
  
  alertPlaceholder.append(wrapper)

  const alert = wrapper.querySelector('.alert');
  alert.classList.add('fade');
  setTimeout(() => {alert.classList.add('show')}, 10);

}

function editarComentario(id) {
  const comments = JSON.parse(localStorage.getItem("comments")) || [];
  const comentario = comments.find(comment => comment.id === id);
  if (!comentario) return;

  document.getElementById('username').value = comentario.comentarioUsername;
  document.getElementById('email').value = comentario.comentarioEmail;
  document.getElementById('comment-title').value = comentario.comentarioTitle;
  document.getElementById('comment-input').value = comentario.comentarioContent;
  document.getElementById('comentario-id').value = comentario.id;
}

function obtenerFecha(fecha) {
  const f = fecha;
  const dia = f.getDate().toString().padStart(2, '0');
  const mes = (f.getMonth() + 1).toString().padStart(2, '0');
  const año = f.getFullYear();
  const horas = f.getHours().toString().padStart(2, '0');
  const minutos = f.getMinutes().toString().padStart(2, '0');
  return `${dia}/${mes}/${año} | ${horas}:${minutos}`;
}

function agregarComentario(){
  var comentarioUsername = document.getElementById('username').value;
  var comentarioEmail = document.getElementById('email').value;
  var comentarioTitle = document.getElementById('comment-title').value;
  var comentarioContent = document.getElementById('comment-input').value;
  var comentarioDate = obtenerFecha(new Date());
  var comentarioImgFile = document.getElementById('formFile').files[0];
  const comentarioID = document.getElementById("comentario-id").value;

  
  if (comentarioUsername == "" || comentarioEmail == "" || comentarioContent == "" || comentarioTitle == ""){
    createAlert("Debe ingresar título y descripción, en las notas", "danger");
    return;
  } 
  
  const guardarComentario = (comentarioImg) => {
    const nuevoComentario = { id: comentarioID ? parseInt(comentarioID) : Date.now(), comentarioEmail, comentarioUsername, comentarioDate, comentarioTitle, comentarioContent, comentarioImg };

    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    
    const i = comments.findIndex(comment => comment.id == nuevoComentario.id);

    if(i == -1){
      comments.push(nuevoComentario);
      createAlert("Comentario agregado correctamente!", "success");
    }
    else{
      comments[i] = nuevoComentario;
      createAlert("Comentario actualizado correctamente!", "success");
    }

    localStorage.setItem("comments", JSON.stringify(comments));
    limpiarForm()
  }

  if (comentarioImgFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      guardarComentario(e.target.result);
    };
    reader.readAsDataURL(comentarioImgFile);
  }
  else {
    guardarComentario("images/icons/user-generic.png");
  }
}

function cargarComentarios(){
    var comments=[];
    comments = JSON.parse(localStorage.getItem("comments"));

    comments.sort((a, b) => b.id - a.id)
    var postHtml = "";
    comments.forEach(element => {
       
        postHtml += `<div class="card comment">
                      <div class="row g-0">
                        <div class="col-md-1 align-content-center">
                          <img class="profile-img" src="${element.comentarioImg}">
                        </div>
                        <div class="card-body col-md-8">
                          <h5 class="card-title">@${element.comentarioUsername}
                          <span class="username-email">&lt;${element.comentarioEmail}&gt;</span></h5>
                          <h6 class="card-subtitle mb-2 text-body-secondary">${element.comentarioDate}</h6>
                          <b>${element.comentarioTitle}</b>
                          <p class="card-text">${element.comentarioContent}</p>
                          <a href="#" class="card-link">Responder</a>
                        </div>
                        <div class="dropdown col-sm-1 col-auto text-end">
                          <button class="btn btn-dark" dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa fa-ellipsis-v icn-menu"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editarComentario(${element.id})">Editar<i class="icn-dropdown fa fa-pencil"></i></a></li>
                            <li><a class="dropdown-item" href="#" onclick="eliminarComentario('${element.comentarioTitle}', '${element.comentarioUsername}')">Borrar<i class="icn-dropdown fa fa-trash"></i></a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
        `});
    document.getElementById("comment-section").innerHTML= postHtml;
}

function limpiarForm(){
  cargarComentarios();
  document.getElementById("username").value="";
  document.getElementById("email").value="";
  document.getElementById("formFile").value="";
  document.getElementById("comment-title").value="";
  document.getElementById("comment-input").value="";
  document.getElementById("checkDefault").checked=false;
  document.getElementById("comentarioID").value = "";
}

function eliminarComentario(comentarioTitle, comentarioUsername, event){
    event?.preventDefault();
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    var i= comments.findIndex(r => r.comentarioTitle == comentarioTitle && r.comentarioUsername == comentarioUsername);
    comments.splice(i,1);
    localStorage.setItem("comments", JSON.stringify(comments));
    cargarComentarios();
}