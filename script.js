// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNoe0qetEX2JwXdDli8kmTQVDxwmDK5jY",
  authDomain: "salesdessaa.firebaseapp.com",
  databaseURL: "https://salesdessaa-default-rtdb.firebaseio.com",
  projectId: "salesdessaa",
  storageBucket: "salesdessaa.firebasestorage.app",
  messagingSenderId: "354160224607",
  appId: "1:354160224607:web:87fabeb31d0ededf50aeea",
  measurementId: "G-JDDLSYMFT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa o Firestore
const db = getFirestore(app);

const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

let itens = []
let id

async function loadItens() {
  const querySnapshot = await getDocs(collection(db, "funcionarios", "dadosFuncionarios", "itens"));
  itens = [];
  querySnapshot.forEach((doc) => {
    itens.push({ ...doc.data(), id: doc.id });
  });
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

async function setItensBD() {
  itens.forEach(async (item) => {
    await setDoc(doc(db, "funcionarios", "dadosFuncionarios", "itens", item.id), item);
  });
}

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
  }
}

function editItem(index) {
  openModal(true, index)
}

async function deleteItem(index) {
  await deleteDoc(doc(db, "funcionarios", "dadosFuncionarios", "itens", itens[index].id));
  itens.splice(index, 1);
  await setItensBD();
  loadItens();
}

async function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = async e => {
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
  } else {
    const newItem = {
      nome: sNome.value,
      funcao: sFuncao.value,
      salario: sSalario.value,
    };
    await addDoc(collection(db, "funcionarios", "dadosFuncionarios", "itens"), newItem);
  }

  await setItensBD();

  modal.classList.remove('active')
  await loadItens();
  id = undefined
}

loadItens()
