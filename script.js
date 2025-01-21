// Importação correta dos módulos do Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get } from "firebase/database";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBNoe0qetEX2JwXdDli8kmTQVDxwmDK5jY",
    authDomain: "salesdessaa.firebaseapp.com",
    databaseURL: "https://salesdessaa-default-rtdb.firebaseio.com",
    projectId: "salesdessaa",
    storageBucket: "salesdessaa.firebasestorage.app",
    messagingSenderId: "354160224607",
    appId: "1:354160224607:web:d7a6d443bc93281950aeea",
    measurementId: "G-CE76TPTJ2R"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Seletores
const yearSelect = document.getElementById('year');
const monthSelect = document.getElementById('month');
const form = document.getElementById('work-form');
const totalCash = document.getElementById('total-cash');
const totalBarter = document.getElementById('total-barter');
const totalOverall = document.getElementById('total-overall');
const workList = document.getElementById('work-list');

// Dados armazenados localmente
let editingIndex = null;

function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
}

// Atualizar resumo
function updateSummary() {
    const key = `${yearSelect.value}-${monthSelect.value}`;
    const workRef = ref(database, `data/${key}`);
    onValue(workRef, (snapshot) => {
        const works = snapshot.val() || [];
        workList.innerHTML = works.map((work, index) => `
            <div class="work-item">
                <p>${work.company}: R$ ${work.cash.toFixed(2)} (Dinheiro), R$ ${work.barter.toFixed(2)} (Permuta)</p>
                <button onclick="editWork('${key}', ${index})">Editar</button>
                <button onclick="deleteWork('${key}', ${index})">Excluir</button>
            </div>
        `).join('');

        const totalCashValue = works.reduce((sum, work) => sum + work.cash, 0);
        const totalBarterValue = works.reduce((sum, work) => sum + work.barter, 0);

        totalCash.textContent = totalCashValue.toFixed(2);
        totalBarter.textContent = totalBarterValue.toFixed(2);
        totalOverall.textContent = (totalCashValue + totalBarterValue).toFixed(2);
    });
}

// Adicionar trabalho
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const company = document.getElementById('company').value;
    const cash = parseFloat(document.getElementById('cash').value);
    const barter = parseFloat(document.getElementById('barter').value || 0);

    const key = `${yearSelect.value}-${monthSelect.value}`;
    const workRef = ref(database, `data/${key}`);

    get(workRef).then((snapshot) => {
        const works = snapshot.val() || [];
        if (editingIndex !== null) {
            works[editingIndex] = { company, cash, barter };
            editingIndex = null;
            form.querySelector('button').textContent = "Adicionar";
        } else {
            works.push({ company, cash, barter });
        }
        set(workRef, works);
        form.reset();
        updateSummary();
    });
});

// Editar trabalho
window.editWork = function(key, index) {
    const workRef = ref(database, `data/${key}`);
    get(workRef).then((snapshot) => {
        const works = snapshot.val();
        const work = works[index];
        document.getElementById('company').value = work.company;
        document.getElementById('cash').value = work.cash;
        document.getElementById('barter').value = work.barter;
        editingIndex = index;
        form.querySelector('button').textContent = "Salvar Alteração";
    });
};

// Excluir trabalho
window.deleteWork = function(key, index) {
    const workRef = ref(database, `data/${key}`);
    get(workRef).then((snapshot) => {
        const works = snapshot.val();
        works.splice(index, 1);
        set(workRef, works);
        updateSummary();
    });
};

// Atualizar resumo ao mudar mês/ano
yearSelect.addEventListener('change', updateSummary);
monthSelect.addEventListener('change', updateSummary);

// Inicializar
populateYearSelect();
updateSummary();
