
// Declarações das constantes dos botões e inputs do  capturadas pelos IDs do HTML 
const button = document.getElementById('button_input');
const buttonID = document.getElementById('buttonID');
const input = document.getElementById('input');
const listaCompleta = document.getElementById('todo-list');
const inputTitle = document.getElementById('inputTitle');
const inputID = document.getElementById('inputID')

let contID = 0;
let listaTarefas = [];

//adiciona uma nova tarefa e faz algumas validações iniciais 
function adicionarTarefa() {
    try {
        if (input.value === '' || input.value.length < 20) {
            throw new Error("Não foi informada uma tarefa ou a descrição deve ter no mínimo 20 caracteres.");
        } else if (inputTitle.value === '' || inputTitle.value.length < 4) {
            throw new Error("Não foi informado um Título válido e que contenha no mínimo 4 caracteres.");
        } else if (verificarOcorrenciaDeTitulo(listaTarefas, inputTitle.value) === true) {
            throw new Error("Já existe este título.");
        } else {
            listaTarefas.push({
                tarefa: input.value,
                concluida: false,
                ID: contID,
                title: inputTitle.value
            });
        }
        contID++; // Incrementa o ID apos a adição da tarefa

        input.value = '';
        inputTitle.value = '';

        mostrarTarefa();

    } catch (error) {
        alert(error);
    }
}

// Função para verificar a ocorrência de um título ou ID na lista de tarefas
function verificarOcorrenciaDeTitulo(listaTarefas, titulo) {
    for (let i = 0; i < listaTarefas.length; i++) {
        if (listaTarefas[i].title === titulo) {
            return true; // Se encontrou, retorna verdadeiro
        }
    }
    return false; // Se não encontrou, retorna falso
}


button.addEventListener('click', adicionarTarefa);  // observa o click para adição da tarefa

// Função que itera renderiza a nova Li no HTML e chama algumas funções específicas dentro da tag adicionada  
function mostrarTarefa() {
    let novaLi = ''

    listaTarefas.forEach((tarefaDigitada, posicao) => {
        novaLi = novaLi + `
        <fieldset>
            <div class="content-style-titleID"> 
            <div> <h3>${tarefaDigitada.title}</h3></div>
            <div class="style-id"> ID:${tarefaDigitada.ID} </div>
            </div>    
            <li class="task ${tarefaDigitada.concluida && "concluida-style"}">
            <p>${tarefaDigitada.tarefa}</p>
            <div class="img-task">
            <img src="assets/aceitar (1).png" alt="checked" onclick="concluirTarefa(${posicao})">
            <img src="assets/editar.png" alt="edit" onclick="editarTarefa(${posicao})" onclick="editarTitulo(${posicao})">
            <img src="assets/cancelar.png" alt="remove" onclick="detelarTarefa(${posicao})">
            <img src="assets/editar-texto.png" alt="editar titulo" onclick="editarTitulo(${posicao})">
            </div>
         </li>
         </fieldset>`
    });

    //Atualiza o conteúdo HTML da lista completa com a novaLi, renderizando todas as tarefas na interface do usuário.
    listaCompleta.innerHTML = novaLi

    // Atualiza o armazenamento local com a lista atualizada de tarefas em formato JSON. Isso é feito para manter os dados entre os recarregamentos da página
    // Seta uma chave e transforma a listaTerfas em uma string JSON 
    localStorage.setItem('lista', JSON.stringify(listaTarefas));

}


function editarTarefa(posicao) {
    const novoTexto = prompt("Digite o novo texto da tarefa:");

    try { // Trata o erro e apresenta para o usuario através do alert

        if (novoTexto !== null && novoTexto !== '' && novoTexto.length > 20) { // faz validacoes no if de acordo com a posicao da tarefa a ser editada no prompt
            listaTarefas[posicao].tarefa = novoTexto;
            mostrarTarefa(); // renderiza novamente ja editada
        } else {
            throw new Error("A descrição deve ter no mínimo 20 caracteres");
        }
    } catch (error) {
        alert(error);
    }
}


// edita o título atraves do prompt e faz validações para a edição do novo título de acordo com as regras da aplicação 
function editarTitulo(posicao) {
    const novoTitulo = prompt("Dê um novo Título");

    try {
        if (novoTitulo !== null && novoTitulo !== '' && novoTitulo.length > 4) {
            listaTarefas[posicao].title = novoTitulo;
            mostrarTarefa();
        } else {
            throw new Error("O titulo deve ter no mínimo 4 caracteres");
        }
    } catch (error) {
        alert(error);
    }
}

// A função detelarTarefa tem como objetivo deletar uma tarefa específica da lista de tarefas
// Ela utiliza o método splice para remover um elemento da lista com base na posição fornecida como argumento
function detelarTarefa(posicao) {

    listaTarefas.splice(posicao, 1);

    mostrarTarefa(); // Atualiza a lista  
}


// Tem como objetivo alternar o estado de conclusão de uma tarefa específica na lista de tarefas (listaTarefas). 
// Ela alterna o valor da propriedade concluida para true ou false através da negacao "!""
function concluirTarefa(posicao) {
    listaTarefas[posicao].concluida = !listaTarefas[posicao].concluida

    mostrarTarefa();
}

// A função recarregarTarefas tem o objetivo de recuperar a lista de tarefas armazenada no localStorage, atualizar a variável listaTarefas com esses dados e, 
// em seguida, chamar a função mostrarTarefa para refletir essas alterações na interface do usuário. 
function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('lista')

    if (tarefasDoLocalStorage) { // Verifica se há alguma string armazenada. Se a string não estiver vazia ou null, significa que há dados armazenados.
        listaTarefas = JSON.parse(tarefasDoLocalStorage);
        // Compara o ID da tarefa atual com o valor máximo acumulado (maxID) e retorna o maior.
        const ultimoID = listaTarefas.reduce((maxID, tarefa) => Math.max(maxID, tarefa.ID), 0);
        contID = ultimoID + 1;
    }
    mostrarTarefa();
}

//Função para o botão buscar uma tarefa com base no ID fornecido pelo usuário.
buttonID.addEventListener('click', () => {
    const idDesejado = inputID.value;

    if (!isNaN(idDesejado) && idDesejado !== '') { // Verifica se o valor do ID fornecido é um número válido (usando !isNaN) e não está vazio
        buscarID(parseInt(idDesejado, 10)); // Chama a função buscarID passando o ID convertido para um número inteiro usando parseInt(idDesejado, 10). O segundo argumento 10 especifica a base numérica decimal.
    } else {
        try {
            throw new Error("Por favor, insira um ID válido.");
        } catch (error) {
            alert(error);
        }
    }
});

// Função buscarID é responsável por encontrar uma tarefa na lista de tarefas (listaTarefas) com base no ID fornecido como argumento
function buscarID(id) {
    const tarefaEncontrada = listaTarefas.find(tarefa => tarefa.ID === id); // Usa o método find para procurar na lista de tarefas listaTarefas uma tarefa com ID correspondente ao ID fornecido

    if (tarefaEncontrada) { // Verifica se uma tarefa foi encontrada. Se verdadeiro, cria uma nova string HTML (novaLi) que representa a tarefa encontrada.
        const novaLi = `
        <fieldset>   
            <div class="content-style-titleID" >
            <div> <h3>${tarefaEncontrada.title}</h3></div>    
            <div class="style-id"> ID:${tarefaEncontrada.ID} </div>  
            </div>   
            <li class="task ${tarefaEncontrada.concluida && "concluida-style"}">
                <p>${tarefaEncontrada.tarefa}</p>
                <div class="img-task">
                    <img src="assets/aceitar (1).png" alt="checked" onclick="concluirTarefa(${id})">
                    <img src="assets/editar.png" alt="edit" onclick="editarTarefa(${id})">
                    <img src="assets/cancelar.png" alt="remove" onclick="detelarTarefa(${id})">
                    <img src="assets/editar-texto.png" alt="editar titulo" onclick="editarTitulo(${id})">
                </div>
             </li>
        </fieldset>`;

        listaCompleta.innerHTML = novaLi; // Atualiza o conteúdo HTML da listaCompleta com a novaLi, substituindo o conteúdo anterior pela representação HTML da tarefa encontrada.
    } else {
        try {
            throw new Error("ID não encontrado"); // Mostra a msg se não encontrar o ID
        } catch (error) {
            alert(error)
        }
    }
}


//A função recarregarTarefas tem como objetivo carregar as tarefas do armazenamento local (localStorage) e exibi-las na interface do usuário.
//Ela é chamada no final do código para garantir que, quando a página for carregada, as tarefas armazenadas sejam recuperadas e exibidas.
recarregarTarefas();
