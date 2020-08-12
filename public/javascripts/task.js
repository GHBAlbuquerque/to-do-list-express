const setTagAsDone = async (element, id) => { //passei como parametro o proprio elemento e o id da task
    // tenho que chamar o backend e, quando ele responder, preciso alterar o elemtno (setar o chekd para true e passar as classes)
    event.preventDefault();
    try {
        let headers = new Headers({ 'Content-Type': 'application/json' }) //precisamos de header para chamar o backend, e depois o tipo de chamada
        let body = JSON.stringify({ task: { done: element.checked } }) //vou olhar a task, e para saber o que preciso passar, vou olhar o elemento e ver se ele está checado ou não e colocar no body
        let response = await fetch(`/tasks/${id}?_method=put`, { headers: headers, body: body, method: 'PUT' }); //passei minha requisicao
        let data = await response.json(); //pego a resposta que veio da requisicao 
        let task = data.task; //peguei da resposta a minha task atualizada
        let parent = element.parentNode; // como tambem quero alterar o elemento pai, preciso pegar ele aqui (é onde estao as infos de classe do bulma)

        if (task.done) {
            element.checked = true; //o elemento é o próprio campo
            parent.classList.add('has-text-success');
            parent.classList.add('is-italic');
        } else{
            element.checked = false; //o elemento é o próprio campo
            parent.classList.remove('has-text-success');
            parent.classList.remove('is-italic');
        }
    } catch (error) {
        console.log(error)
        alert ('Erro ao atualizar a tarefa');
    }
}
