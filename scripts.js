document.addEventListener('DOMContentLoaded', () => {
    const campos = ['Russia', 'França', 'Detroit', 'Minessota', 'Las Vegas', 'São Jose do Egito'];
    const destino = ['Alemanha', 'Brasil', 'Argentina', 'Canadá', 'Japão'];
    const variedades = ['VAT', 'RB', 'CTC', 'VAT202'];
    
    // Populando os campos dos formulários
    const campoSelect = document.getElementById('campo');
    if (campoSelect) {
        campos.forEach(campo => {
            const option = document.createElement('option');
            option.value = campo;
            option.textContent = campo;
            campoSelect.appendChild(option);
        });
    }

    const destinoSelect = document.getElementById('destino');
    if (destinoSelect) {
        destino.forEach(dest => {
            const option = document.createElement('option');
            option.value = dest;
            option.textContent = dest;
            destinoSelect.appendChild(option);
        });
    }

    const variedadeSelect = document.getElementById('variedade');
    if (variedadeSelect) {
        variedades.forEach(variedade => {
            const option = document.createElement('option');
            option.value = variedade;
            option.textContent = variedade;
            variedadeSelect.appendChild(option);
        });
    }

    const dadosSalvos = localStorage.getItem('dados');
    if (dadosSalvos) {
        document.getElementById('dados').value = dadosSalvos;
        dados = JSON.parse(dadosSalvos);
    }

    const historicoSalvo = JSON.parse(localStorage.getItem('historico')) || [];
    atualizarHistorico(historicoSalvo);
});
let dados = {
    lotes: '',
    transbordos: '',
    avaliacoes: '',
    totalToneladas: 0,
    totalTransbordos: 0
};

let somaAreaColhida = 0;
let somaRestante = 0;
let historico = [];

function adicionarLote() {
    const lote = document.getElementById('lote').value;
    const area = parseFloat(document.getElementById('area').value) || 0;
    const restante = parseFloat(document.getElementById('restante').value) || 0;
    const destino = document.getElementById('destino').value;
    const campo = document.getElementById('campo').value;
    const data = document.getElementById('data').value;

    const dataFormatada = formatarData(data);

    if (!dados.lotes) {
        dados.lotes += `📊 *Relatório do Corte de Semente Mecanizado*\n\nCampo: ${campo}\nData: ${dataFormatada}\n\n`;
    }
    
    dados.lotes += `Lote: ${lote}\nÁrea Colhida: ${area.toFixed(2)}ha\nRestante: ${restante.toFixed(2)}ha\nDestino Semente: ${destino}\n\n`;
    
    somaAreaColhida += area;
    somaRestante += restante;
    
    const somaDados = `Área Total Colhida: ${somaAreaColhida}ha\nTotal Restante: ${somaRestante}ha\n\n`;
    dados.lotes += somaDados;
    
    atualizarResumo();

    historico.push({
        tipo: 'lote',
        dados: dados.lotes
    });
    atualizarHistorico(historico);
    localStorage.setItem('historico', JSON.stringify(historico));

    document.getElementById('lote').value = '';
    document.getElementById('area').value = '';
    document.getElementById('restante').value = '';
    document.getElementById('destino').value = '';
}

function adicionarTransbordo() {
    const numero = document.getElementById('numero').value;
    const variedade = document.getElementById('variedade').value;
    const percentual = document.getElementById('percentual').value;
    const toneladas = parseFloat(document.getElementById('toneladas').value) || 0;

    const dataHora = new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    if (!dados.transbordos) {
        dados.transbordos += `. . . . . . . . . . . . . . . . . . . . . . .\n🚜 *Quantidades de Transbordos*\n\n`;
    }
    
    const transbordoDados = `Número Transbordo: ${numero}\nVariedade: ${variedade}\nPercentual Preenchido: ${percentual}%\nToneladas: ${toneladas}\nData e Hora: ${dataHora}\n\n`;
    dados.transbordos += transbordoDados;

    dados.totalToneladas += toneladas;
    dados.totalTransbordos += 1;

    atualizarResumo();

    historico.push({
        tipo: 'transbordo',
        dados: transbordoDados
    });
    atualizarHistorico(historico);
    localStorage.setItem('historico', JSON.stringify(historico));

    document.getElementById('numero').value = '';
    document.getElementById('percentual').value = '';
    document.getElementById('toneladas').value = '';
}

function adicionarAvaliacao() {
    const facao = document.querySelector('input[name="facao"]:checked').value;
    const faquinha = document.querySelector('input[name="faquinha"]:checked').value;
    const pressaoPicador = document.getElementById('pressao_picador').value;
    const pressaoCorteBase = document.getElementById('pressao_corte_base').value;
    const lavagem = document.getElementById('lavagem').value;
    const observacao = document.getElementById('observacao').value;

    const dataHora = new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const facaoEmoji = facao === 'Nova' ? '🟢' : facao === 'Conservado' ? '🟢' : facao === 'Inicio de Desgaste' ? '🟡' : facao === 'Desgastados' ? '🔴' : '🔧';
    const faquinhaEmoji = faquinha === 'Nova' ? '🟢' : faquinha === 'Conservado' ? '🟢' : faquinha === 'Inicio de Desgaste' ? '🟡' : faquinha === 'Desgastados' ? '🔴' : '🔧';
    const lavagemEmoji = lavagem === 'Sim' ? '✅' : '❌';

    const avaliacaoDados = `Facões: ${facaoEmoji} ${facao}\nFaquinhas: ${faquinhaEmoji} ${faquinha}\nPressão do Picador: ${pressaoPicador}\nPressão do Corte de Base: ${pressaoCorteBase}\nLavagem da Colheita: ${lavagemEmoji} ${lavagem}\nObservação: ${observacao}\nData e Hora: ${dataHora}\n\n`;

    if (!dados.avaliacoes) {
        dados.avaliacoes += `. . . . . . . . . . . . . . . . . . . . . . .\n🧰 *Observações e Detalhes*\n\n`;
    }

    // Atualiza os dados de avaliações
    dados.avaliacoes += avaliacaoDados;

    atualizarResumo();

    historico.push({
        tipo: 'avaliacao',
        dados: avaliacaoDados
    });
    atualizarHistorico(historico);
    localStorage.setItem('historico', JSON.stringify(historico));

    document.getElementById('pressao_picador').value = '';
    document.getElementById('pressao_corte_base').value = '';
    document.getElementById('observacao').value = '';
}


function atualizarResumo() {
    let resumoTransbordos = `${dados.transbordos}`;

    if (dados.totalTransbordos > 0) {
        const mediaToneladas = (dados.totalToneladas / dados.totalTransbordos).toFixed(2);
        resumoTransbordos += `Média Tonelada por Transbordo: ${mediaToneladas} toneladas\n\n`;
    }

    const resumo = `${dados.lotes}\n${resumoTransbordos}${dados.avaliacoes}`;
    document.getElementById('dados').value = resumo;
    localStorage.setItem('dados', JSON.stringify(dados));
}

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function copiarDados() {
    const textarea = document.getElementById('dados');
    textarea.select();
    document.execCommand('copy');
    alert('Dados copiados!');
}

function limparDados() {
    document.getElementById('dados').value = '';
    localStorage.removeItem('dados');
    dados = {
        lotes: '',
        transbordos: '',
        avaliacoes: ''
    };
    somaAreaColhida = 0;
    somaRestante = 0;
    historico = [];
    atualizarHistorico(historico);
    localStorage.removeItem('historico');
}


/*
function atualizarHistorico(historico) {
    const historicoDiv = document.getElementById('historico');
    historicoDiv.innerHTML = '';
    historico.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('historico-item');
        itemDiv.innerHTML = `
            <p>${item.tipo.toUpperCase()}</p>
            <pre>${item.dados}</pre>
            <button onclick="editarItem(${index})">Editar</button>
            <button onclick="excluirItem(${index})">Excluir</button>
        `;
        historicoDiv.appendChild(itemDiv);
    });
}

function editarItem(index) {
    const item = historico[index];
    if (item.tipo === 'lote') {
        // Implementar lógica para edição de lotes
        // Exemplo de como preencher o formulário com os dados do lote para edição
        const campos = item.dados.split('\n');
        document.getElementById('campo').value = campos[2].split(': ')[1];
        document.getElementById('data').value = campos[3].split(': ')[1];
        document.getElementById('lote').value = campos[4].split(': ')[1];
        document.getElementById('area').value = parseFloat(campos[5].split(': ')[1]);
        document.getElementById('restante').value = parseFloat(campos[6].split(': ')[1]);
        document.getElementById('destino').value = campos[7].split(': ')[1];
    } else if (item.tipo === 'transbordo') {
        // Implementar lógica para edição de transbordos
        // Exemplo de como preencher o formulário com os dados do transbordo para edição
        const campos = item.dados.split('\n');
        document.getElementById('numero').value = campos[0].split(': ')[1];
        document.getElementById('variedade').value = campos[1].split(': ')[1];
        document.getElementById('percentual').value = parseFloat(campos[2].split(': ')[1]);
    } else if (item.tipo === 'avaliacao') {
        // Implementar lógica para edição de avaliações
        // Exemplo de como preencher o formulário com os dados da avaliação para edição
        const campos = item.dados.split('\n');
        document.querySelector(`input[name="facao"][value="${campos[0].split(': ')[1]}"]`).checked = true;
        document.querySelector(`input[name="faquinha"][value="${campos[1].split(': ')[1]}"]`).checked = true;
        document.getElementById('pressao_picador').value = campos[2].split(': ')[1];
        document.getElementById('pressao_corte_base').value = campos[3].split(': ')[1];
        document.getElementById('lavagem').value = campos[4].split(': ')[1];
        document.getElementById('observacao').value = campos[5].split(': ')[1];
    }
}

function excluirItem(index) {
    historico.splice(index, 1);
    atualizarHistorico(historico);
    localStorage.setItem('historico', JSON.stringify(historico));
}

function limparHistorico() {
    historico = [];
    atualizarHistorico(historico);
    localStorage.removeItem('historico');
}

*/

// Supondo que você tenha uma variável global 'historico' que contém os dados
//let historico = JSON.parse(localStorage.getItem('historico')) || [];

function atualizarHistorico(historico) {
    const historicoDiv = document.getElementById('historico');
    historicoDiv.innerHTML = '';
    historico.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('historico-item');
        itemDiv.innerHTML = `
            <p>${item.tipo.toUpperCase()}</p>
            <pre>${item.dados}</pre>
            <button onclick="excluirItem(${index})">Excluir</button>
        `;
        historicoDiv.appendChild(itemDiv);
    });
}

function excluirItem(index) {
    historico.splice(index, 1);
    atualizarHistorico(historico);
    localStorage.setItem('historico', JSON.stringify(historico));
}

function limparHistorico() {
    historico = [];
    atualizarHistorico(historico);
    localStorage.removeItem('historico');
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarHistorico(historico);
});
