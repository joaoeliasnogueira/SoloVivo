
// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_PUBLICA_ANON';

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ==========================================
// ESTADO GLOBAL
// ==========================================

let estadoApp = {
    usuario: 'Produtor Rural',
    usuarioAuth: null,
    idProdutor: null,
    idPropriedade: null,

    perfil: {
        proprietario: '',
        fazenda: '',
        cidade: '',
        estado: '',
        area: ''
    },

    talhoes: [],
    calendario: [],
    planejamento: [],
    financeiro: [],
    pragas: [],
    solos: []
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function valor(id) {
    return document.getElementById(id)?.value?.trim() || '';
}

function numero(id) {
    const v = valor(id).replace(',', '.');
    return v === '' ? null : Number(v);
}

function mostrarErro(erro) {
    console.error(erro);
    alert(erro.message || 'Ocorreu um erro ao acessar o banco de dados.');
}

function escapar(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[caractere]);
}

function formatarData(data) {
    if (!data) return '';
    return String(data).slice(0, 10);
}

function nomeTalhao(id) {
    const talhao = estadoApp.talhoes.find(t => t.id === Number(id));
    return talhao ? talhao.nome : 'Talhão';
}

function atualizarTelaUsuario() {
    document.getElementById('lblNomeUsuario').innerText = estadoApp.usuario;
    document.getElementById('lblNomeFazenda').innerText =
        estadoApp.perfil.fazenda || 'Minha propriedade';
    document.getElementById('lblLocalFazenda').innerText =
        estadoApp.perfil.cidade || '';
}

// ==========================================
// PRODUTOR E PROPRIEDADE
// ==========================================

async function garantirProdutor(usuario) {
    const { data: produtor, error } = await supabase
        .from('produtor')
        .select('*')
        .eq('auth_uid', usuario.id)
        .maybeSingle();

    if (error) throw error;

    if (produtor) {
        estadoApp.idProdutor = produtor.id_produtor;
        estadoApp.usuario = produtor.nome;
        return produtor;
    }

    const nome = usuario.user_metadata?.nome || usuario.email;

    const { data: novoProdutor, error: erroInsert } = await supabase
        .from('produtor')
        .insert({
            auth_uid: usuario.id,
            nome: nome,
            email: usuario.email,
            senha: null
        })
        .select()
        .single();

    if (erroInsert) throw erroInsert;

    estadoApp.idProdutor = novoProdutor.id_produtor;
    estadoApp.usuario = novoProdutor.nome;

    return novoProdutor;
}

async function carregarPropriedade() {
    const { data, error } = await supabase
        .from('propriedade')
        .select('*')
        .eq('id_produtor', estadoApp.idProdutor)
        .limit(1)
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        estadoApp.idPropriedade = null;
        return;
    }

    estadoApp.idPropriedade = data.id_propriedade;

    estadoApp.perfil = {
        proprietario: estadoApp.usuario,
        fazenda: data.nome,
        cidade: data.cidade,
        estado: data.estado,
        area: data.area_total
    };

    document.getElementById('cadProprietario').value = data.nome
        ? estadoApp.usuario : '';
    document.getElementById('cadFazenda').value = data.nome;
    document.getElementById('cadCidade').value = data.cidade;
    document.getElementById('cadEstado').value = data.estado;
    document.getElementById('cadAreaTotal').value = data.area_total;
}

async function salvarPerfil(e) {
    e.preventDefault();

    try {
        const dados = {
            id_produtor: estadoApp.idProdutor,
            nome: valor('cadFazenda'),
            cidade: valor('cadCidade'),
            estado: valor('cadEstado').toUpperCase(),
            area_total: numero('cadAreaTotal')
        };

        if (estadoApp.idPropriedade) {
            const { error } = await supabase
                .from('propriedade')
                .update(dados)
                .eq('id_propriedade', estadoApp.idPropriedade);

            if (error) throw error;
        } else {
            const { data, error } = await supabase
                .from('propriedade')
                .insert(dados)
                .select()
                .single();

            if (error) throw error;

            estadoApp.idPropriedade = data.id_propriedade;
        }

        estadoApp.perfil = {
            proprietario: estadoApp.usuario,
            fazenda: dados.nome,
            cidade: dados.cidade,
            estado: dados.estado,
            area: dados.area_total
        };

        atualizarTelaUsuario();
        fecharJanela('modalPerfil');
        await carregarDados();

        alert('Propriedade salva com sucesso!');
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// AUTENTICAÇÃO
// ==========================================

function alternarTelaLogin(exibirCadastro) {
    document.getElementById('formEntrada')
        .classList.toggle('esconder', exibirCadastro);

    document.getElementById('formCadastro')
        .classList.toggle('esconder', !exibirCadastro);
}

async function realizarLogin(e) {
    e.preventDefault();

    try {
        const email = valor('inpUsuario');
        const senha = valor('inpSenha');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha
        });

        if (error) throw error;

        await iniciarAplicacao(data.user);
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function registrarNovaConta(e) {
    e.preventDefault();

    const senha1 = valor('cadSenha1');
    const senha2 = valor('cadSenha2');
    const erroSenha = document.getElementById('msgErroSenha');

    if (senha1 !== senha2) {
        erroSenha.classList.remove('esconder');
        return;
    }

    erroSenha.classList.add('esconder');

    try {
        const nome = valor('cadNome');
        const email = valor('cadEmail');

        const { data, error } = await supabase.auth.signUp({
            email,
            password: senha1,
            options: {
                data: { nome }
            }
        });

        if (error) throw error;

        if (data.session && data.user) {
            await iniciarAplicacao(data.user);
        } else {
            alert(
                'Cadastro realizado! Verifique seu e-mail para confirmar a conta. Depois, entre com seu e-mail e senha.'
            );
            alternarTelaLogin(false);
        }
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function iniciarAplicacao(usuario) {
    try {
        estadoApp.usuarioAuth = usuario;

        await garantirProdutor(usuario);
        await carregarPropriedade();
        await carregarDados();

        atualizarTelaUsuario();

        document.getElementById('viewLogin').classList.add('esconder');
        document.getElementById('viewApp').classList.remove('esconder');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function realizarLogoff() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        estadoApp.usuarioAuth = null;
        estadoApp.idProdutor = null;
        estadoApp.idPropriedade = null;

        estadoApp.talhoes = [];
        estadoApp.calendario = [];
        estadoApp.planejamento = [];
        estadoApp.financeiro = [];
        estadoApp.pragas = [];
        estadoApp.solos = [];

        document.getElementById('viewApp').classList.add('esconder');
        document.getElementById('viewLogin').classList.remove('esconder');
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// CARREGAR DADOS DO BANCO
// ==========================================

async function carregarDados() {
    if (!estadoApp.idPropriedade) {
        estadoApp.talhoes = [];
        estadoApp.calendario = [];
        estadoApp.planejamento = [];
        estadoApp.financeiro = [];
        estadoApp.pragas = [];
        estadoApp.solos = [];

        atualizarInterface();
        return;
    }

    // Talhões
    const { data: talhoes, error: erroTalhoes } = await supabase
        .from('talhao')
        .select('*')
        .eq('id_propriedade', estadoApp.idPropriedade);

    if (erroTalhoes) throw erroTalhoes;

    // Plantios e culturas
    const { data: plantios, error: erroPlantios } = await supabase
        .from('plantio')
        .select('*, cultura(nome)');

    if (erroPlantios) throw erroPlantios;

    estadoApp.talhoes = (talhoes || []).map(t => {
        const plantio = plantios.find(p => p.id_talhao === t.id_talhao);

        return {
            id: t.id_talhao,
            nome: t.nome,
            area: t.area,
            data: formatarData(plantio?.data_plantio || t.data_plantio),
            meta: plantio?.produtividade_prevista ?? t.meta_produtividade ?? '',
            cultura: plantio?.cultura?.nome || 'Não informada'
        };
    });

    // Calendário
    const { data: calendario, error: erroCalendario } = await supabase
        .from('evento_calendario')
        .select('*, talhao(nome)')
        .in('id_talhao', estadoApp.talhoes.map(t => t.id).length
            ? estadoApp.talhoes.map(t => t.id)
            : [-1]);

    if (erroCalendario) throw erroCalendario;

    estadoApp.calendario = (calendario || []).map(c => ({
        id: c.id_evento,
        talhaoId: c.id_talhao,
        talhaoNome: c.talhao?.nome || 'Talhão',
        operacao: c.operacao,
        titulo: c.titulo,
        data: formatarData(c.data_evento)
    }));

    // Planejamento
    const { data: planejamento, error: erroPlanejamento } = await supabase
        .from('planejamento_safra')
        .select('*, talhao(nome)')
        .in('id_talhao', estadoApp.talhoes.map(t => t.id).length
            ? estadoApp.talhoes.map(t => t.id)
            : [-1]);

    if (erroPlanejamento) throw erroPlanejamento;

    estadoApp.planejamento = (planejamento || []).map(p => ({
        id: p.id_planejamento,
        talhaoId: p.id_talhao,
        talhaoNome: p.talhao?.nome || 'Talhão',
        safra: p.safra,
        meta: p.meta_produtividade,
        rotacao: p.rotacao_planejada || '',
        status: p.status,
        insumos: ''
    }));

    // Financeiro
    const { data: financeiro, error: erroFinanceiro } = await supabase
        .from('lancamento_financeiro')
        .select('*, talhao(nome)')
        .in('id_talhao', estadoApp.talhoes.map(t => t.id).length
            ? estadoApp.talhoes.map(t => t.id)
            : [-1]);

    if (erroFinanceiro) throw erroFinanceiro;

    estadoApp.financeiro = (financeiro || []).map(f => ({
        id: f.id_lancamento,
        talhaoId: f.id_talhao,
        talhaoNome: f.talhao?.nome || 'Talhão',
        tipo: f.tipo,
        categoria: f.categoria,
        descricao: f.descricao || '',
        valor: Number(f.valor)
    }));

    // Ocorrências fitossanitárias
    const { data: pragas, error: erroPragas } = await supabase
        .from('ocorrencia_fitossanitaria')
        .select('*, talhao(nome)')
        .in('id_talhao', estadoApp.talhoes.map(t => t.id).length
            ? estadoApp.talhoes.map(t => t.id)
            : [-1]);

    if (erroPragas) throw erroPragas;

    estadoApp.pragas = (pragas || []).map(p => ({
        id: p.id_ocorrencia,
        talhaoId: p.id_talhao,
        talhaoNome: p.talhao?.nome || 'Talhão',
        nome: p.nome,
        severidade: p.severidade,
        acao: p.acao_realizada || '',
        data: formatarData(p.data_ocorrencia)
    }));

    // Análises de solo
    const { data: solos, error: erroSolos } = await supabase
        .from('analise_solo')
        .select('*, talhao(nome)')
        .in('id_talhao', estadoApp.talhoes.map(t => t.id).length
            ? estadoApp.talhoes.map(t => t.id)
            : [-1]);

    if (erroSolos) throw erroSolos;

    estadoApp.solos = (solos || []).map(s => ({
        id: s.id_analise,
        talhaoId: s.id_talhao,
        talhaoNome: s.talhao?.nome || 'Talhão',
        tipo: s.tipo_solo,
        ph: s.ph,
        mo: s.materia_organica,
        p: s.fosforo,
        k: s.potassio
    }));

    atualizarInterface();
}

// ==========================================
// JANELAS E CULTURAS
// ==========================================

function abrirJanela(id) {
    document.getElementById(id).classList.remove('esconder');
}

function fecharJanela(id) {
    document.getElementById(id).classList.add('esconder');
}

function verificarOutraCultura(valorSelecionado) {
    const box = document.getElementById('boxCulturaOutros');
    const campo = document.getElementById('talhaoCulturaOutros');

    if (valorSelecionado === 'Outros') {
        box.classList.remove('esconder');
        campo.setAttribute('required', 'required');
    } else {
        box.classList.add('esconder');
        campo.removeAttribute('required');
    }
}

async function obterIdCultura(nome) {
    const { data: existente, error } = await supabase
        .from('cultura')
        .select('id_cultura')
        .eq('nome', nome)
        .maybeSingle();

    if (error) throw error;

    if (existente) return existente.id_cultura;

    const { data: nova, error: erroInsert } = await supabase
        .from('cultura')
        .insert({ nome })
        .select('id_cultura')
        .single();

    if (erroInsert) throw erroInsert;

    return nova.id_cultura;
}

// ==========================================
// TALHÕES E PLANTIOS
// ==========================================

async function salvarNovoTalhao(e) {
    e.preventDefault();

    try {
        if (!estadoApp.idPropriedade) {
            alert('Cadastre primeiro os dados da propriedade.');
            abrirJanela('modalPerfil');
            return;
        }

        const nome = valor('talhaoNome');
        let cultura = valor('talhaoCultura');

        if (cultura === 'Outros') {
            cultura = valor('talhaoCulturaOutros');
        }

        const area = numero('talhaoArea');
        const data = valor('talhaoData') || null;
        const meta = numero('talhaoMeta');

        const { data: novoTalhao, error } = await supabase
            .from('talhao')
            .insert({
                id_propriedade: estadoApp.idPropriedade,
                nome,
                area,
                data_plantio: data,
                meta_produtividade: meta
            })
            .select()
            .single();

        if (error) throw error;

        const idCultura = await obterIdCultura(cultura);

        const { error: erroPlantio } = await supabase
            .from('plantio')
            .insert({
                id_talhao: novoTalhao.id_talhao,
                id_cultura: idCultura,
                data_plantio: data || new Date().toISOString().slice(0, 10),
                produtividade_prevista: meta,
                status: 'Planejado'
            });

        if (erroPlantio) throw erroPlantio;

        await carregarDados();

        e.target.reset();
        fecharJanela('modalPlantio');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirTalhao(id) {
    if (!confirm('Deseja excluir este talhão e seus registros relacionados?')) return;

    try {
        const { error } = await supabase
            .from('talhao')
            .delete()
            .eq('id_talhao', id);

        if (error) throw error;

        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// CALENDÁRIO
// ==========================================

async function salvarEventoCalendario(e) {
    e.preventDefault();

    try {
        const talhaoId = Number(valor('calTalhao'));

        const { error } = await supabase
            .from('evento_calendario')
            .insert({
                id_talhao: talhaoId,
                operacao: valor('calOperacao'),
                titulo: valor('calTitulo'),
                data_evento: valor('calData')
            });

        if (error) throw error;

        await carregarDados();

        e.target.reset();
        fecharJanela('modalCalendario');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirEventoCalendario(id) {
    try {
        const { error } = await supabase
            .from('evento_calendario')
            .delete()
            .eq('id_evento', id);

        if (error) throw error;

        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// PLANEJAMENTO
// ==========================================

async function salvarPlanejamento(e) {
    e.preventDefault();

    try {
        const { error } = await supabase
            .from('planejamento_safra')
            .insert({
                id_talhao: Number(valor('planTalhao')),
                safra: valor('planSafra'),
                meta_produtividade: numero('planMeta'),
                rotacao_planejada: valor('planRotacao'),
                status: valor('planStatus')
            });

        if (error) throw error;

        await carregarDados();

        e.target.reset();
        fecharJanela('modalPlanejamento');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirPlanejamento(id) {
    try {
        const { error } = await supabase
            .from('planejamento_safra')
            .delete()
            .eq('id_planejamento', id);

        if (error) throw error;

        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// FINANCEIRO
// ==========================================

async function salvarFinanceiro(e) {
    e.preventDefault();

    try {
        const { error } = await supabase
            .from('lancamento_financeiro')
            .insert({
                id_talhao: Number(valor('finTalhao')),
                tipo: valor('finTipo'),
                categoria: valor('finCategoria'),
                descricao: valor('finDescricao'),
                valor: numero('finValor')
            });

        if (error) throw error;

        await carregarDados();

        e.target.reset();
        fecharJanela('modalDespesas');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirFinanceiro(id) {
    try {
        const { error } = await supabase
            .from('lancamento_financeiro')
            .delete()
            .eq('id_lancamento', id);

        if (error) throw error;

        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// PRAGAS E OCORRÊNCIAS
// ==========================================

async function salvarOcorrenciaPraga(e) {
    e.preventDefault();

    try {
        const { error } = await supabase
            .from('ocorrencia_fitossanitaria')
            .insert({
                id_talhao: Number(valor('pragaTalhao')),
                nome: valor('pragaNome'),
                severidade: valor('pragaSeveridade'),
                acao_realizada: valor('pragaAcao'),
                data_ocorrencia: valor('pragaData'),
                id_diagnostico: null
            });

        if (error) throw error;

        await carregarDados();

        e.target.reset();
        fecharJanela('modalPragas');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirOcorrenciaPraga(id) {
    try {
        const { error } = await supabase
            .from('ocorrencia_fitossanitaria')
            .delete()
            .eq('id_ocorrencia', id);

        if (error) throw error;

        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// CALCULADORA DE CALAGEM
// ==========================================

function calcularCalagem(e) {
    e.preventDefault();

    const v1 = numero('calcV1') || 0;
    const v2 = numero('calcV2') || 0;
    const ctc = numero('calcCTC') || 0;
    const prnt = numero('calcPRNT') || 100;

    if (prnt <= 0) return;

    const nc = ((v2 - v1) * ctc) / prnt;
    const resultado = nc > 0 ? nc.toFixed(2) : '0.00';

    document.getElementById('resCalagem').innerText =
        `${resultado} Toneladas / ha`;
}

// ==========================================
// ANÁLISES DE SOLO
// ==========================================

async function salvarAnaliseSolo(e) {
    e.preventDefault();

    try {
        const { error } = await supabase
            .from('analise_solo')
            .insert({
                id_talhao: Number(valor('soloTalhao')),
                tipo_solo: valor('soloTipo'),
                data_analise: new Date().toISOString().slice(0, 10),
                ph: numero('soloPH'),
                materia_organica: numero('soloMO'),
                fosforo: numero('soloP'),
                potassio: numero('soloK')
            });

        if (error) throw error;

        await carregarDados();

        e.target.reset();
        fecharJanela('modalSolos');
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirAnaliseSolo(id) {
    try {
        const { error } = await supabase
            .from('analise_solo')
            .delete()
            .eq('id_analise', id);

        if (error) throw error;

        await carregarDados();
    } catch (erro) {
        mostrarErro(erro);
    }
}

// ==========================================
// ATUALIZAÇÃO DA INTERFACE
// ==========================================

function atualizarInterface() {

    // SELECTS DE TALHÕES
    const selectsTalhoes = [
        'calTalhao',
        'planTalhao',
        'finTalhao',
        'pragaTalhao',
        'soloTalhao'
    ];

    selectsTalhoes.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.innerHTML = estadoApp.talhoes.length === 0
            ? '<option value="">Nenhum talhão cadastrado</option>'
            : estadoApp.talhoes.map(t => `
                <option value="${t.id}">
                    ${escapar(t.nome)} (${escapar(t.cultura)})
                </option>
            `).join('');
    });

    // TALHÕES
    const gridLavouras = document.getElementById('gridLavouras');

    if (!gridLavouras) return;

    if (estadoApp.talhoes.length === 0) {
        gridLavouras.innerHTML = `
            <div class="col-span-full bg-white border border-dashed border-stone-300 rounded-3xl p-8 text-center">
                <span class="text-4xl">🚜</span>
                <p class="text-stone-600 font-bold mt-2">Nenhum talhão cadastrado ainda.</p>
                <button onclick="abrirJanela('modalPlantio')" class="mt-4 bg-emerald-600 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider">
                    Cadastrar Primeiro Talhão
                </button>
            </div>
        `;
    } else {
        gridLavouras.innerHTML = estadoApp.talhoes.map(t => `
            <div class="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">${escapar(t.cultura)}</span>
                        <h3 class="text-xl font-black text-stone-900 mt-2">${escapar(t.nome)}</h3>
                    </div>
                    <button onclick="excluirTalhao(${t.id})" class="text-red-400 hover:text-red-600 font-bold text-sm p-1">🗑️</button>
                </div>
                <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
                    <div class="bg-stone-50 p-2 rounded-xl">
                        <p class="text-[9px] text-stone-500 font-black uppercase">Área</p>
                        <p class="text-sm font-black text-stone-800">${escapar(t.area)} ha</p>
                    </div>
                    <div class="bg-stone-50 p-2 rounded-xl">
                        <p class="text-[9px] text-stone-500 font-black uppercase">Plantio</p>
                        <p class="text-sm font-black text-stone-800">${escapar(t.data)}</p>
                    </div>
                    <div class="bg-stone-50 p-2 rounded-xl">
                        <p class="text-[9px] text-stone-500 font-black uppercase">Meta</p>
                        <p class="text-sm font-black text-stone-800">${escapar(t.meta)} sc/ha</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // CALENDÁRIO
    const gridResumo = document.getElementById('gridResumoCalendario');
    const listaCal = document.getElementById('listaEventosCalendario');

    if (gridResumo && listaCal) {
        if (estadoApp.calendario.length === 0) {
            gridResumo.innerHTML = '<p class="col-span-full text-stone-500 font-bold text-sm">Sem operações agendadas.</p>';
            listaCal.innerHTML = '<p class="text-stone-500 font-bold text-sm">Nenhum evento no calendário.</p>';
        } else {
            gridResumo.innerHTML = estadoApp.calendario.slice(0, 3).map(c => `
                <div class="bg-purple-50/60 border border-purple-100 p-4 rounded-2xl">
                    <span class="text-[10px] font-black uppercase bg-purple-200 text-purple-800 px-2.5 py-0.5 rounded-full">${escapar(c.operacao)}</span>
                    <h4 class="font-black text-stone-800 text-sm mt-2">${escapar(c.titulo)}</h4>
                    <p class="text-xs text-stone-500 font-bold mt-1">📍 ${escapar(c.talhaoNome)} | 📅 ${escapar(c.data)}</p>
                </div>
            `).join('');

            listaCal.innerHTML = estadoApp.calendario.map(c => `
                <div class="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">${escapar(c.operacao)}</span>
                            <span class="text-xs font-bold text-stone-500">📅 ${escapar(c.data)}</span>
                        </div>
                        <h5 class="font-black text-stone-900 text-sm mt-1">${escapar(c.titulo)}</h5>
                        <p class="text-xs text-stone-600 font-bold">Talhão: ${escapar(c.talhaoNome)}</p>
                    </div>
                    <button onclick="excluirEventoCalendario(${c.id})" class="text-red-500 font-bold text-xs hover:bg-red-50 p-2 rounded-xl">Excluir</button>
                </div>
            `).join('');
        }
    }

    // PLANEJAMENTO
    const listaPlan = document.getElementById('listaPlanejamento');

    if (listaPlan) {
        listaPlan.innerHTML = estadoApp.planejamento.length === 0
            ? '<p class="text-stone-500 font-bold text-sm">Nenhum plano cadastrado.</p>'
            : estadoApp.planejamento.map(p => `
                <div class="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="bg-blue-100 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">${escapar(p.status)}</span>
                            <h5 class="font-black text-stone-900 text-base mt-2">${escapar(p.safra)} - ${escapar(p.talhaoNome)}</h5>
                        </div>
                        <button onclick="excluirPlanejamento(${p.id})" class="text-red-500 font-bold text-xs p-1">Excluir</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-bold text-stone-700 pt-2 border-t border-stone-200">
                        <p><strong>Meta:</strong> ${escapar(p.meta)} sc/ha</p>
                        <p><strong>Rotação:</strong> ${escapar(p.rotacao)}</p>
                    </div>
                </div>
            `).join('');
    }

    // FINANCEIRO
    const recTotal = estadoApp.financeiro
        .filter(f => f.tipo === 'Receita')
        .reduce((a, b) => a + b.valor, 0);

    const despTotal = estadoApp.financeiro
        .filter(f => f.tipo === 'Despesa')
        .reduce((a, b) => a + b.valor, 0);

    const saldo = recTotal - despTotal;

    document.getElementById('finTotalReceitas').innerText =
        `R$ ${recTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    document.getElementById('finTotalDespesas').innerText =
        `R$ ${despTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    document.getElementById('finSaldoLiquido').innerText =
        `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const listaFin = document.getElementById('listaFinanceiro');

    if (listaFin) {
        listaFin.innerHTML = estadoApp.financeiro.length === 0
            ? '<p class="text-stone-500 font-bold text-sm">Nenhum lançamento financeiro.</p>'
            : estadoApp.financeiro.map(f => `
                <div class="flex justify-between items-center bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">${f.tipo === 'Receita' ? '🟢' : '🔴'}</span>
                        <div>
                            <p class="font-black text-stone-900 text-sm">${escapar(f.descricao)}</p>
                            <p class="text-xs text-stone-500 font-bold">${escapar(f.categoria)} • ${escapar(f.talhaoNome)}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-black ${f.tipo === 'Receita' ? 'text-emerald-700' : 'text-red-600'} text-sm">
                            ${f.tipo === 'Receita' ? '+' : '-'} R$ ${f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <button onclick="excluirFinanceiro(${f.id})" class="text-[10px] text-red-500 font-bold underline">Remover</button>
                    </div>
                </div>
            `).join('');
    }

    // PRAGAS
    const listaPragas = document.getElementById('listaOcorrenciasPragas');

    if (listaPragas) {
        listaPragas.innerHTML = estadoApp.pragas.length === 0
            ? '<p class="col-span-full text-stone-500 font-bold text-sm">Nenhum alerta fitossanitário registrado.</p>'
            : estadoApp.pragas.map(p => `
                <div class="bg-red-50/50 border border-red-200 p-4 rounded-2xl relative">
                    <div class="flex justify-between items-start">
                        <span class="bg-red-200 text-red-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">${escapar(p.severidade)}</span>
                        <button onclick="excluirOcorrenciaPraga(${p.id})" class="text-red-500 font-bold text-xs">✕</button>
                    </div>
                    <h5 class="font-black text-stone-900 text-base mt-2">${escapar(p.nome)}</h5>
                    <p class="text-xs text-stone-600 font-bold">Talhão: ${escapar(p.talhaoNome)} | Data: ${escapar(p.data)}</p>
                    <p class="text-xs bg-white p-2.5 rounded-xl border border-red-100 text-stone-800 font-bold mt-2">🛡️ Ação: ${escapar(p.acao)}</p>
                </div>
            `).join('');
    }

    // SOLOS
    const listaSolos = document.getElementById('listaLaudosSolos');

    if (listaSolos) {
        listaSolos.innerHTML = estadoApp.solos.length === 0
            ? '<p class="text-stone-500 font-bold text-sm">Nenhum laudo de solo cadastrado.</p>'
            : estadoApp.solos.map(s => `
                <div class="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                        <span class="bg-orange-100 text-orange-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">${escapar(s.tipo)}</span>
                        <h5 class="font-black text-stone-900 text-sm mt-1">${escapar(s.talhaoNome)}</h5>
                        <div class="flex gap-4 text-xs font-bold text-stone-600 mt-2">
                            <span><strong>pH:</strong> ${escapar(s.ph)}</span>
                            <span><strong>M.O:</strong> ${escapar(s.mo)} g/dm³</span>
                            <span><strong>P:</strong> ${escapar(s.p)} mg/dm³</span>
                            <span><strong>K:</strong> ${escapar(s.k)} mmolc/dm³</span>
                        </div>
                    </div>
                    <button onclick="excluirAnaliseSolo(${s.id})" class="text-red-500 font-bold text-xs p-2">Excluir</button>
                </div>
            `).join('');
    }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

window.addEventListener('load', async () => {
    atualizarInterface();

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        mostrarErro(error);
        return;
    }

    if (data.session?.user) {
        await iniciarAplicacao(data.session.user);
    }
});
