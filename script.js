const yearSelect = document.getElementById('year');
const monthSelect = document.getElementById('month');
const form = document.getElementById('work-form');
const workList = document.getElementById('work-list');
const totalCash = document.getElementById('total-cash');
const totalBarter = document.getElementById('total-barter');
const totalOverall = document.getElementById('total-overall');

let data = {};

// Preencher anos dinamicamente
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 2000; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
}

// Adicionar trabalho
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const year = yearSelect.value;
    const month = monthSelect.value;
    const company = document.getElementById('company').value;
    const cash = parseFloat(document.getElementById('cash').value);
    const barter = parseFloat(document.getElementById('barter').value || 0);

    const key = `${year}-${month}`;
    if (!data[key]) data[key] = [];

    data[key].push({ company, cash, barter });
    updateSummary(key);

    form.reset();
});

// Atualizar resumo
function updateSummary(key) {
    const works = data[key] || [];
    workList.innerHTML = works.map(work => `
        <p>${work.company}: R$ ${work.cash.toFixed(2)} (Dinheiro), R$ ${work.barter.toFixed(2)} (Permuta)</p>
    `).join('');
    const totalCashValue = works.reduce((sum, work) => sum + work.cash, 0);
    const totalBarterValue = works.reduce((sum, work) => sum + work.barter, 0);

    totalCash.textContent = totalCashValue.toFixed(2);
    totalBarter.textContent = totalBarterValue.toFixed(2);
    totalOverall.textContent = (totalCashValue + totalBarterValue).toFixed(2);
}
