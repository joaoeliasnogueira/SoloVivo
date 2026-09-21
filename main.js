// Estado Global da Aplicação
        let estadoApp = {
            usuario: 'Produtor Rural',
            perfil: {
                proprietario: '',
                fazenda: '',
                cidade: '',
                area: ''
            },
            talhoes: [],
            calendario: [],
            planejamento: [],
            financeiro: [],
            pragas: [],
            solos: []
        };

        function alternarTelaLogin(exibirCadastro) {
            document.getElementById('formEntrada').classList.toggle('esconder', exibirCadastro);
            document.getElementById('formCadastro').classList.toggle('esconder', !exibirCadastro);
        }

        function realizarLogin(e) {
            e.preventDefault();
            estadoApp.usuario = document.getElementById('inpUsuario').value || 'Produtor Rural';
            document.getElementById('lblNomeUsuario').innerText = estadoApp.usuario;
            document.getElementById('viewLogin').classList.add('esconder');
            document.getElementById('viewApp').classList.remove('esconder');
            atualizarInterface();
        }

        function registrarNovaConta(e) {
            e.preventDefault();
            const s1 = document.getElementById('cadSenha1').value;
            const s2 = document.getElementById('cadSenha2').value;
            const err = document.getElementById('msgErroSenha');

            if (s1 !== s2) {
                err.classList.remove('esconder');
                return;
            }
            err.classList.add('esconder');
            estadoApp.usuario = document.getElementById('cadNome').value;
            document.getElementById('lblNomeUsuario').innerText = estadoApp.usuario;
            document.getElementById('viewLogin').classList.add('esconder');
            document.getElementById('viewApp').classList.remove('esconder');
            atualizarInterface();
        }

        function realizarLogoff() {
            document.getElementById('viewApp').classList.add('esconder');
            document.getElementById('viewLogin').classList.remove('esconder');
        }

        function abrirJanela(id) {
            document.getElementById(id).classList.remove('esconder');
        }

        function fecharJanela(id) {
            document.getElementById(id).classList.add('esconder');
        }

        function verificarOutraCultura(valor) {
            const box = document.getElementById('boxCulturaOutros');
            if (valor === 'Outros') {
                box.classList.remove('esconder');
                document.getElementById('talhaoCulturaOutros').setAttribute('required', 'required');
            } else {
                box.classList.add('esconder');
                document.getElementById('talhaoCulturaOutros').removeAttribute('required');
            }
        }

        function salvarPerfil(e) {
            e.preventDefault();
            estadoApp.perfil.proprietario = document.getElementById('cadProprietario').value;
            estadoApp.perfil.fazenda = document.getElementById('cadFazenda').value;
            estadoApp.perfil.cidade = document.getElementById('cadCidade').value;
            estadoApp.perfil.area = document.getElementById('cadAreaTotal').value;

            document.getElementById('lblNomeFazenda').innerText = estadoApp.perfil.fazenda;
            document.getElementById('lblLocalFazenda').innerText = estadoApp.perfil.cidade;
            fecharJanela('modalPerfil');
        }

        function salvarNovoTalhao(e) {
            e.preventDefault();
            const nome = document.getElementById('talhaoNome').value;
            let cultura = document.getElementById('talhaoCultura').value;
            if (cultura === 'Outros') {
                cultura = document.getElementById('talhaoCulturaOutros').value;
            }
            const area = document.getElementById('talhaoArea').value;
            const data = document.getElementById('talhaoData').value;
            const meta = document.getElementById('talhaoMeta').value;

            estadoApp.talhoes.push({ id: Date.now(), nome, cultura, area, data, meta });
            atualizarInterface();
            e.target.reset();
            fecharJanela('modalPlantio');
        }

        function excluirTalhao(id) {
            estadoApp.talhoes = estadoApp.talhoes.filter(t => t.id !== id);
            atualizarInterface();
        }

        function salvarEventoCalendario(e) {
            e.preventDefault();
            const talhaoId = parseInt(document.getElementById('calTalhao').value);
            const talhao = estadoApp.talhoes.find(t => t.id === talhaoId);
            const talhaoNome = talhao ? talhao.nome : 'Geral';
            const operacao = document.getElementById('calOperacao').value;
            const titulo = document.getElementById('calTitulo').value;
            const data = document.getElementById('calData').value;

            estadoApp.calendario.push({ id: Date.now(), talhaoId, talhaoNome, operacao, titulo, data });
            atualizarInterface();
            e.target.reset();
            fecharJanela('modalCalendario');
        }

        function excluirEventoCalendario(id) {
            estadoApp.calendario = estadoApp.calendario.filter(c => c.id !== id);
            atualizarInterface();
        }

        function salvarPlanejamento(e) {
            e.preventDefault();
            const talhaoId = parseInt(document.getElementById('planTalhao').value);
            const talhao = estadoApp.talhoes.find(t => t.id === talhaoId);
            const talhaoNome = talhao ? talhao.nome : 'Sem Talhão';
            const safra = document.getElementById('planSafra').value;
            const meta = document.getElementById('planMeta').value;
            const rotacao = document.getElementById('planRotacao').value;
            const status = document.getElementById('planStatus').value;
            const insumos = document.getElementById('planInsumos').value;

            estadoApp.planejamento.push({ id: Date.now(), talhaoId, talhaoNome, safra, meta, rotacao, status, insumos });
            atualizarInterface();
            e.target.reset();
            fecharJanela('modalPlanejamento');
        }

        function excluirPlanejamento(id) {
            estadoApp.planejamento = estadoApp.planejamento.filter(p => p.id !== id);
            atualizarInterface();
        }

        function salvarFinanceiro(e) {
            e.preventDefault();
            const talhaoId = parseInt(document.getElementById('finTalhao').value);
            const talhao = estadoApp.talhoes.find(t => t.id === talhaoId);
            const talhaoNome = talhao ? talhao.nome : 'Geral';
            const tipo = document.getElementById('finTipo').value;
            const categoria = document.getElementById('finCategoria').value;
            const descricao = document.getElementById('finDescricao').value;
            const valor = parseFloat(document.getElementById('finValor').value);

            estadoApp.financeiro.push({ id: Date.now(), talhaoId, talhaoNome, tipo, categoria, descricao, valor });
            atualizarInterface();
            e.target.reset();
            fecharJanela('modalDespesas');
        }

        function excluirFinanceiro(id) {
            estadoApp.financeiro = estadoApp.financeiro.filter(f => f.id !== id);
            atualizarInterface();
        }

        function salvarOcorrenciaPraga(e) {
            e.preventDefault();
            const talhaoId = parseInt(document.getElementById('pragaTalhao').value);
            const talhao = estadoApp.talhoes.find(t => t.id === talhaoId);
            const talhaoNome = talhao ? talhao.nome : 'Geral';
            const nome = document.getElementById('pragaNome').value;
            const severidade = document.getElementById('pragaSeveridade').value;
            const acao = document.getElementById('pragaAcao').value;
            const data = document.getElementById('pragaData').value;

            estadoApp.pragas.push({ id: Date.now(), talhaoId, talhaoNome, nome, severidade, acao, data });
            atualizarInterface();
            e.target.reset();
            fecharJanela('modalPragas');
        }

        function excluirOcorrenciaPraga(id) {
            estadoApp.pragas = estadoApp.pragas.filter(p => p.id !== id);
            atualizarInterface();
        }

        function calcularCalagem(e) {
            e.preventDefault();
            const v1 = parseFloat(document.getElementById('calcV1').value) || 0;
            const v2 = parseFloat(document.getElementById('calcV2').value) || 0;
            const ctc = parseFloat(document.getElementById('calcCTC').value) || 0;
            const prnt = parseFloat(document.getElementById('calcPRNT').value) || 100;

            if (prnt <= 0) return;

            // Fórmula de Calagem: NC (t/ha) = ((V2 - V1) * CTC) / PRNT
            const nc = ((v2 - v1) * ctc) / prnt;
            const resultado = nc > 0 ? nc.toFixed(2) : '0.00';
            document.getElementById('resCalagem').innerText = `${resultado} Toneladas / ha`;
        }

        function salvarAnaliseSolo(e) {
            e.preventDefault();
            const talhaoId = parseInt(document.getElementById('soloTalhao').value);
            const talhao = estadoApp.talhoes.find(t => t.id === talhaoId);
            const talhaoNome = talhao ? talhao.nome : 'Geral';
            const tipo = document.getElementById('soloTipo').value;
            const ph = parseFloat(document.getElementById('soloPH').value);
            const mo = parseFloat(document.getElementById('soloMO').value);
            const p = parseFloat(document.getElementById('soloP').value);
            const k = parseFloat(document.getElementById('soloK').value);

            estadoApp.solos.push({ id: Date.now(), talhaoId, talhaoNome, tipo, ph, mo, p, k });
            atualizarInterface();
            e.target.reset();
            fecharJanela('modalSolos');
        }

        function excluirAnaliseSolo(id) {
            estadoApp.solos = estadoApp.solos.filter(s => s.id !== id);
            atualizarInterface();
        }

        function atualizarInterface() {
            // Atualizar Selects com os Talhões Disponíveis
            const selectsTalhoes = ['calTalhao', 'planTalhao', 'finTalhao', 'pragaTalhao', 'soloTalhao'];
            selectsTalhoes.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.innerHTML = estadoApp.talhoes.length === 0 
                    ? `<option value="">Nenhum talhão cadastrado</option>`
                    : estadoApp.talhoes.map(t => `<option value="${t.id}">${t.nome} (${t.cultura})</option>`).join('');
            });

            // Renderizar Grid de Talhões
            const gridLavouras = document.getElementById('gridLavouras');
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
                                <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">${t.cultura}</span>
                                <h3 class="text-xl font-black text-stone-900 mt-2">${t.nome}</h3>
                            </div>
                            <button onclick="excluirTalhao(${t.id})" class="text-red-400 hover:text-red-600 font-bold text-sm p-1">🗑️</button>
                        </div>
                        <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
                            <div class="bg-stone-50 p-2 rounded-xl">
                                <p class="text-[9px] text-stone-500 font-black uppercase">Área</p>
                                <p class="text-sm font-black text-stone-800">${t.area} ha</p>
                            </div>
                            <div class="bg-stone-50 p-2 rounded-xl">
                                <p class="text-[9px] text-stone-500 font-black uppercase">Plantio</p>
                                <p class="text-sm font-black text-stone-800">${t.data}</p>
                            </div>
                            <div class="bg-stone-50 p-2 rounded-xl">
                                <p class="text-[9px] text-stone-500 font-black uppercase">Meta</p>
                                <p class="text-sm font-black text-stone-800">${t.meta} sc/ha</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // Renderizar Calendário Resumido e Completo
            const gridResumo = document.getElementById('gridResumoCalendario');
            const listaCal = document.getElementById('listaEventosCalendario');
            
            if (estadoApp.calendario.length === 0) {
                gridResumo.innerHTML = `<p class="col-span-full text-stone-500 font-bold text-sm">Sem operações agendadas.</p>`;
                listaCal.innerHTML = `<p class="text-stone-500 font-bold text-sm">Nenhum evento no calendário.</p>`;
            } else {
                gridResumo.innerHTML = estadoApp.calendario.slice(0, 3).map(c => `
                    <div class="bg-purple-50/60 border border-purple-100 p-4 rounded-2xl">
                        <span class="text-[10px] font-black uppercase bg-purple-200 text-purple-800 px-2.5 py-0.5 rounded-full">${c.operacao}</span>
                        <h4 class="font-black text-stone-800 text-sm mt-2">${c.titulo}</h4>
                        <p class="text-xs text-stone-500 font-bold mt-1">📍 ${c.talhaoNome} | 📅 ${c.data}</p>
                    </div>
                `).join('');

                listaCal.innerHTML = estadoApp.calendario.map(c => `
                    <div class="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">${c.operacao}</span>
                                <span class="text-xs font-bold text-stone-500">📅 ${c.data}</span>
                            </div>
                            <h5 class="font-black text-stone-900 text-sm mt-1">${c.titulo}</h5>
                            <p class="text-xs text-stone-600 font-bold">Talhão: ${c.talhaoNome}</p>
                        </div>
                        <button onclick="excluirEventoCalendario(${c.id})" class="text-red-500 font-bold text-xs hover:bg-red-50 p-2 rounded-xl">Excluir</button>
                    </div>
                `).join('');
            }

            // Renderizar Planejamento Estratégico
            const listaPlan = document.getElementById('listaPlanejamento');
            if (estadoApp.planejamento.length === 0) {
                listaPlan.innerHTML = `<p class="text-stone-500 font-bold text-sm">Nenhum plano cadastrado.</p>`;
            } else {
                listaPlan.innerHTML = estadoApp.planejamento.map(p => `
                    <div class="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-2">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="bg-blue-100 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">${p.status}</span>
                                <h5 class="font-black text-stone-900 text-base mt-2">${p.safra} - ${p.talhaoNome}</h5>
                            </div>
                            <button onclick="excluirPlanejamento(${p.id})" class="text-red-500 font-bold text-xs p-1">Excluir</button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-bold text-stone-700 pt-2 border-t border-stone-200">
                            <p><strong>Meta:</strong> ${p.meta} sc/ha</p>
                            <p><strong>Rotação:</strong> ${p.rotacao}</p>
                        </div>
                        <p class="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200 mt-2 font-semibold">${p.insumos}</p>
                    </div>
                `).join('');
            }

            // Renderizar Financeiro
            const recTotal = estadoApp.financeiro.filter(f => f.tipo === 'Receita').reduce((a, b) => a + b.valor, 0);
            const despTotal = estadoApp.financeiro.filter(f => f.tipo === 'Despesa').reduce((a, b) => a + b.valor, 0);
            const saldo = recTotal - despTotal;

            document.getElementById('finTotalReceitas').innerText = `R$ ${recTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            document.getElementById('finTotalDespesas').innerText = `R$ ${despTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            document.getElementById('finSaldoLiquido').innerText = `R$ ${saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

            const listaFin = document.getElementById('listaFinanceiro');
            if (estadoApp.financeiro.length === 0) {
                listaFin.innerHTML = `<p class="text-stone-500 font-bold text-sm">Nenhum lançamento financeiro.</p>`;
            } else {
                listaFin.innerHTML = estadoApp.financeiro.map(f => `
                    <div class="flex justify-between items-center bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">${f.tipo === 'Receita' ? '🟢' : '🔴'}</span>
                            <div>
                                <p class="font-black text-stone-900 text-sm">${f.descricao}</p>
                                <p class="text-xs text-stone-500 font-bold">${f.categoria} • ${f.talhaoNome}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-black ${f.tipo === 'Receita' ? 'text-emerald-700' : 'text-red-600'} text-sm">
                                ${f.tipo === 'Receita' ? '+' : '-'} R$ ${f.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </p>
                            <button onclick="excluirFinanceiro(${f.id})" class="text-[10px] text-red-500 font-bold underline">Remover</button>
                        </div>
                    </div>
                `).join('');
            }

            // Renderizar Pragas e Ocorrências
            const listaPragas = document.getElementById('listaOcorrenciasPragas');
            if (estadoApp.pragas.length === 0) {
                listaPragas.innerHTML = `<p class="col-span-full text-stone-500 font-bold text-sm">Nenhum alerta fitossanitário registrado.</p>`;
            } else {
                listaPragas.innerHTML = estadoApp.pragas.map(p => `
                    <div class="bg-red-50/50 border border-red-200 p-4 rounded-2xl relative">
                        <div class="flex justify-between items-start">
                            <span class="bg-red-200 text-red-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">${p.severidade}</span>
                            <button onclick="excluirOcorrenciaPraga(${p.id})" class="text-red-500 font-bold text-xs">✕</button>
                        </div>
                        <h5 class="font-black text-stone-900 text-base mt-2">${p.nome}</h5>
                        <p class="text-xs text-stone-600 font-bold">Talhão: ${p.talhaoNome} | Data: ${p.data}</p>
                        <p class="text-xs bg-white p-2.5 rounded-xl border border-red-100 text-stone-800 font-bold mt-2">🛡️ Ação: ${p.acao}</p>
                    </div>
                `).join('');
            }

            // Renderizar Laudos de Solos
            const listaSolos = document.getElementById('listaLaudosSolos');
            if (estadoApp.solos.length === 0) {
                listaSolos.innerHTML = `<p class="text-stone-500 font-bold text-sm">Nenhum laudo de solo cadastrado.</p>`;
            } else {
                listaSolos.innerHTML = estadoApp.solos.map(s => `
                    <div class="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex justify-between items-center">
                        <div>
                            <span class="bg-orange-100 text-orange-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">${s.tipo}</span>
                            <h5 class="font-black text-stone-900 text-sm mt-1">${s.talhaoNome}</h5>
                            <div class="flex gap-4 text-xs font-bold text-stone-600 mt-2">
                                <span><strong>pH:</strong> ${s.ph}</span>
                                <span><strong>M.O:</strong> ${s.mo} g/dm³</span>
                                <span><strong>P:</strong> ${s.p} mg/dm³</span>
                                <span><strong>K:</strong> ${s.k} mmolc/dm³</span>
                            </div>
                        </div>
                        <button onclick="excluirAnaliseSolo(${s.id})" class="text-red-500 font-bold text-xs p-2">Excluir</button>
                    </div>
                `).join('');
            }
        }

        // Inicialização na Carga
        window.onload = function() {
            document.getElementById('cadProprietario').value = estadoApp.perfil.proprietario;
            document.getElementById('cadFazenda').value = estadoApp.perfil.fazenda;
            document.getElementById('cadCidade').value = estadoApp.perfil.cidade;
            document.getElementById('cadAreaTotal').value = estadoApp.perfil.area;
            atualizarInterface();
        };
