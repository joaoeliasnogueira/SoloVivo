--
-- PostgreSQL database dump
--

\restrict NdB6DLD3jUVe0fNJTSnMiQbqEYlrtba6q1f6LcGoPTy4XtetIGCFUVxB92CcRHy

-- Dumped from database version 19.0
-- Dumped by pg_dump version 19.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analise_solo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analise_solo (
    id_analise integer NOT NULL,
    id_talhao integer NOT NULL,
    data_analise date NOT NULL,
    tipo_solo character varying(60) NOT NULL,
    ph numeric(4,2),
    materia_organica numeric(8,2),
    fosforo numeric(8,2),
    potassio numeric(8,2),
    drenagem character varying(40),
    retencao_agua character varying(40),
    CONSTRAINT analise_solo_fosforo_check CHECK ((fosforo >= (0)::numeric)),
    CONSTRAINT analise_solo_materia_organica_check CHECK ((materia_organica >= (0)::numeric)),
    CONSTRAINT analise_solo_ph_check CHECK (((ph >= (0)::numeric) AND (ph <= (14)::numeric))),
    CONSTRAINT analise_solo_potassio_check CHECK ((potassio >= (0)::numeric))
);


ALTER TABLE public.analise_solo OWNER TO postgres;

--
-- Name: analise_solo_id_analise_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analise_solo_id_analise_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analise_solo_id_analise_seq OWNER TO postgres;

--
-- Name: analise_solo_id_analise_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analise_solo_id_analise_seq OWNED BY public.analise_solo.id_analise;


--
-- Name: cultura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cultura (
    id_cultura integer NOT NULL,
    nome character varying(100) NOT NULL,
    familia_botanica character varying(100),
    ciclo_dias integer,
    necessidade_hidrica character varying(50),
    descricao text,
    CONSTRAINT cultura_ciclo_dias_check CHECK ((ciclo_dias > 0))
);


ALTER TABLE public.cultura OWNER TO postgres;

--
-- Name: cultura_id_cultura_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cultura_id_cultura_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cultura_id_cultura_seq OWNER TO postgres;

--
-- Name: cultura_id_cultura_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cultura_id_cultura_seq OWNED BY public.cultura.id_cultura;


--
-- Name: diagnostico_fitossanitario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnostico_fitossanitario (
    id_diagnostico integer NOT NULL,
    nome character varying(120) NOT NULL,
    tipo character varying(30) NOT NULL,
    sintomas text,
    manejo_recomendado text,
    descricao text,
    CONSTRAINT diagnostico_fitossanitario_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Praga'::character varying, 'Doença'::character varying, 'Deficiência nutricional'::character varying])::text[])))
);


ALTER TABLE public.diagnostico_fitossanitario OWNER TO postgres;

--
-- Name: diagnostico_fitossanitario_id_diagnostico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diagnostico_fitossanitario_id_diagnostico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diagnostico_fitossanitario_id_diagnostico_seq OWNER TO postgres;

--
-- Name: diagnostico_fitossanitario_id_diagnostico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diagnostico_fitossanitario_id_diagnostico_seq OWNED BY public.diagnostico_fitossanitario.id_diagnostico;


--
-- Name: evento_calendario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evento_calendario (
    id_evento integer NOT NULL,
    id_talhao integer NOT NULL,
    titulo character varying(150) NOT NULL,
    operacao character varying(50) NOT NULL,
    descricao text,
    data_evento date NOT NULL,
    status character varying(30) DEFAULT 'Agendado'::character varying NOT NULL,
    CONSTRAINT evento_calendario_status_check CHECK (((status)::text = ANY ((ARRAY['Agendado'::character varying, 'Concluído'::character varying, 'Cancelado'::character varying])::text[])))
);


ALTER TABLE public.evento_calendario OWNER TO postgres;

--
-- Name: evento_calendario_id_evento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evento_calendario_id_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evento_calendario_id_evento_seq OWNER TO postgres;

--
-- Name: evento_calendario_id_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evento_calendario_id_evento_seq OWNED BY public.evento_calendario.id_evento;


--
-- Name: indicador_sustentabilidade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.indicador_sustentabilidade (
    id_indicador integer NOT NULL,
    pontuacao numeric(5,2),
    criterio character varying(120) NOT NULL,
    descricao text,
    data_avaliacao date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT indicador_sustentabilidade_pontuacao_check CHECK ((pontuacao >= (0)::numeric))
);


ALTER TABLE public.indicador_sustentabilidade OWNER TO postgres;

--
-- Name: indicador_sustentabilidade_id_indicador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.indicador_sustentabilidade_id_indicador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.indicador_sustentabilidade_id_indicador_seq OWNER TO postgres;

--
-- Name: indicador_sustentabilidade_id_indicador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.indicador_sustentabilidade_id_indicador_seq OWNED BY public.indicador_sustentabilidade.id_indicador;


--
-- Name: lancamento_financeiro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lancamento_financeiro (
    id_lancamento integer NOT NULL,
    id_talhao integer NOT NULL,
    tipo character varying(10) NOT NULL,
    categoria character varying(60) NOT NULL,
    descricao character varying(255),
    valor numeric(14,2) NOT NULL,
    data_lancamento date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT lancamento_financeiro_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Receita'::character varying, 'Despesa'::character varying])::text[]))),
    CONSTRAINT lancamento_financeiro_valor_check CHECK ((valor > (0)::numeric))
);


ALTER TABLE public.lancamento_financeiro OWNER TO postgres;

--
-- Name: lancamento_financeiro_id_lancamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lancamento_financeiro_id_lancamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lancamento_financeiro_id_lancamento_seq OWNER TO postgres;

--
-- Name: lancamento_financeiro_id_lancamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lancamento_financeiro_id_lancamento_seq OWNED BY public.lancamento_financeiro.id_lancamento;


--
-- Name: ocorrencia_fitossanitaria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ocorrencia_fitossanitaria (
    id_ocorrencia integer NOT NULL,
    id_talhao integer NOT NULL,
    id_diagnostico integer,
    nome character varying(120) NOT NULL,
    severidade character varying(20) DEFAULT 'Baixo'::character varying NOT NULL,
    data_ocorrencia date NOT NULL,
    acao_realizada character varying(255),
    observacoes text,
    CONSTRAINT ocorrencia_fitossanitaria_severidade_check CHECK (((severidade)::text = ANY ((ARRAY['Baixo'::character varying, 'Médio'::character varying, 'Alto'::character varying, 'Crítico'::character varying])::text[])))
);


ALTER TABLE public.ocorrencia_fitossanitaria OWNER TO postgres;

--
-- Name: ocorrencia_fitossanitaria_id_ocorrencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ocorrencia_fitossanitaria_id_ocorrencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ocorrencia_fitossanitaria_id_ocorrencia_seq OWNER TO postgres;

--
-- Name: ocorrencia_fitossanitaria_id_ocorrencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ocorrencia_fitossanitaria_id_ocorrencia_seq OWNED BY public.ocorrencia_fitossanitaria.id_ocorrencia;


--
-- Name: planejamento_safra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planejamento_safra (
    id_planejamento integer NOT NULL,
    id_talhao integer NOT NULL,
    safra character varying(30) NOT NULL,
    meta_produtividade numeric(10,2),
    rotacao_planejada character varying(255),
    status character varying(30) DEFAULT 'Em planejamento'::character varying NOT NULL,
    CONSTRAINT planejamento_safra_meta_produtividade_check CHECK ((meta_produtividade >= (0)::numeric)),
    CONSTRAINT planejamento_safra_status_check CHECK (((status)::text = ANY ((ARRAY['Em planejamento'::character varying, 'Em execução'::character varying, 'Concluído'::character varying])::text[])))
);


ALTER TABLE public.planejamento_safra OWNER TO postgres;

--
-- Name: planejamento_safra_id_planejamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.planejamento_safra_id_planejamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planejamento_safra_id_planejamento_seq OWNER TO postgres;

--
-- Name: planejamento_safra_id_planejamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.planejamento_safra_id_planejamento_seq OWNED BY public.planejamento_safra.id_planejamento;


--
-- Name: plantio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plantio (
    id_plantio integer NOT NULL,
    id_talhao integer NOT NULL,
    id_cultura integer NOT NULL,
    data_plantio date NOT NULL,
    quantidade_sementes numeric(12,2),
    produtividade_prevista numeric(10,2),
    status character varying(30) DEFAULT 'Planejado'::character varying NOT NULL,
    CONSTRAINT plantio_produtividade_prevista_check CHECK ((produtividade_prevista >= (0)::numeric)),
    CONSTRAINT plantio_quantidade_sementes_check CHECK ((quantidade_sementes >= (0)::numeric)),
    CONSTRAINT plantio_status_check CHECK (((status)::text = ANY ((ARRAY['Planejado'::character varying, 'Em andamento'::character varying, 'Colhido'::character varying, 'Cancelado'::character varying])::text[])))
);


ALTER TABLE public.plantio OWNER TO postgres;

--
-- Name: plantio_id_plantio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plantio_id_plantio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plantio_id_plantio_seq OWNER TO postgres;

--
-- Name: plantio_id_plantio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plantio_id_plantio_seq OWNED BY public.plantio.id_plantio;


--
-- Name: previsao_climatica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.previsao_climatica (
    id_previsao integer NOT NULL,
    id_propriedade integer NOT NULL,
    data_previsao date NOT NULL,
    temperatura numeric(5,2),
    probabilidade_chuva numeric(5,2),
    umidade numeric(5,2),
    alerta character varying(150),
    CONSTRAINT previsao_climatica_probabilidade_chuva_check CHECK (((probabilidade_chuva >= (0)::numeric) AND (probabilidade_chuva <= (100)::numeric))),
    CONSTRAINT previsao_climatica_umidade_check CHECK (((umidade >= (0)::numeric) AND (umidade <= (100)::numeric)))
);


ALTER TABLE public.previsao_climatica OWNER TO postgres;

--
-- Name: previsao_climatica_id_previsao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.previsao_climatica_id_previsao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.previsao_climatica_id_previsao_seq OWNER TO postgres;

--
-- Name: previsao_climatica_id_previsao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.previsao_climatica_id_previsao_seq OWNED BY public.previsao_climatica.id_previsao;


--
-- Name: produtor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtor (
    id_produtor integer NOT NULL,
    nome character varying(120) NOT NULL,
    email character varying(150) NOT NULL,
    senha character varying(255) NOT NULL,
    telefone character varying(20)
);


ALTER TABLE public.produtor OWNER TO postgres;

--
-- Name: produtor_id_produtor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtor_id_produtor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtor_id_produtor_seq OWNER TO postgres;

--
-- Name: produtor_id_produtor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtor_id_produtor_seq OWNED BY public.produtor.id_produtor;


--
-- Name: propriedade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propriedade (
    id_propriedade integer NOT NULL,
    id_produtor integer NOT NULL,
    nome character varying(120) NOT NULL,
    cidade character varying(100) NOT NULL,
    estado character(2) NOT NULL,
    area_total numeric(12,2) NOT NULL,
    localizacao character varying(255),
    CONSTRAINT propriedade_area_total_check CHECK ((area_total > (0)::numeric))
);


ALTER TABLE public.propriedade OWNER TO postgres;

--
-- Name: propriedade_id_propriedade_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.propriedade_id_propriedade_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.propriedade_id_propriedade_seq OWNER TO postgres;

--
-- Name: propriedade_id_propriedade_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.propriedade_id_propriedade_seq OWNED BY public.propriedade.id_propriedade;


--
-- Name: recomendacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recomendacao (
    id_recomendacao integer NOT NULL,
    id_talhao integer NOT NULL,
    id_indicador integer,
    tipo character varying(50) NOT NULL,
    descricao text NOT NULL,
    justificativa text,
    data_geracao timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.recomendacao OWNER TO postgres;

--
-- Name: recomendacao_id_recomendacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recomendacao_id_recomendacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recomendacao_id_recomendacao_seq OWNER TO postgres;

--
-- Name: recomendacao_id_recomendacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recomendacao_id_recomendacao_seq OWNED BY public.recomendacao.id_recomendacao;


--
-- Name: registro_manejo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registro_manejo (
    id_registro integer NOT NULL,
    id_talhao integer NOT NULL,
    tipo_manejo character varying(50) NOT NULL,
    descricao text,
    data_registro date DEFAULT CURRENT_DATE NOT NULL,
    quantidade numeric(12,2),
    observacoes text,
    CONSTRAINT registro_manejo_quantidade_check CHECK ((quantidade >= (0)::numeric))
);


ALTER TABLE public.registro_manejo OWNER TO postgres;

--
-- Name: registro_manejo_id_registro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registro_manejo_id_registro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registro_manejo_id_registro_seq OWNER TO postgres;

--
-- Name: registro_manejo_id_registro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registro_manejo_id_registro_seq OWNED BY public.registro_manejo.id_registro;


--
-- Name: rotacao_cultura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rotacao_cultura (
    id_rotacao integer NOT NULL,
    id_planejamento integer NOT NULL,
    id_cultura integer NOT NULL,
    descricao text,
    data_inicio date,
    data_fim date,
    justificativa text,
    CONSTRAINT ck_rotacao_datas CHECK (((data_fim IS NULL) OR (data_inicio IS NULL) OR (data_fim >= data_inicio)))
);


ALTER TABLE public.rotacao_cultura OWNER TO postgres;

--
-- Name: rotacao_cultura_id_rotacao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rotacao_cultura_id_rotacao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rotacao_cultura_id_rotacao_seq OWNER TO postgres;

--
-- Name: rotacao_cultura_id_rotacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rotacao_cultura_id_rotacao_seq OWNED BY public.rotacao_cultura.id_rotacao;


--
-- Name: talhao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.talhao (
    id_talhao integer NOT NULL,
    id_propriedade integer NOT NULL,
    nome character varying(100) NOT NULL,
    area numeric(12,2) NOT NULL,
    data_plantio date,
    meta_produtividade numeric(10,2),
    CONSTRAINT talhao_area_check CHECK ((area > (0)::numeric)),
    CONSTRAINT talhao_meta_produtividade_check CHECK ((meta_produtividade >= (0)::numeric))
);


ALTER TABLE public.talhao OWNER TO postgres;

--
-- Name: talhao_id_talhao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.talhao_id_talhao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.talhao_id_talhao_seq OWNER TO postgres;

--
-- Name: talhao_id_talhao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.talhao_id_talhao_seq OWNED BY public.talhao.id_talhao;


--
-- Name: analise_solo id_analise; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analise_solo ALTER COLUMN id_analise SET DEFAULT nextval('public.analise_solo_id_analise_seq'::regclass);


--
-- Name: cultura id_cultura; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultura ALTER COLUMN id_cultura SET DEFAULT nextval('public.cultura_id_cultura_seq'::regclass);


--
-- Name: diagnostico_fitossanitario id_diagnostico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnostico_fitossanitario ALTER COLUMN id_diagnostico SET DEFAULT nextval('public.diagnostico_fitossanitario_id_diagnostico_seq'::regclass);


--
-- Name: evento_calendario id_evento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evento_calendario ALTER COLUMN id_evento SET DEFAULT nextval('public.evento_calendario_id_evento_seq'::regclass);


--
-- Name: indicador_sustentabilidade id_indicador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicador_sustentabilidade ALTER COLUMN id_indicador SET DEFAULT nextval('public.indicador_sustentabilidade_id_indicador_seq'::regclass);


--
-- Name: lancamento_financeiro id_lancamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lancamento_financeiro ALTER COLUMN id_lancamento SET DEFAULT nextval('public.lancamento_financeiro_id_lancamento_seq'::regclass);


--
-- Name: ocorrencia_fitossanitaria id_ocorrencia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocorrencia_fitossanitaria ALTER COLUMN id_ocorrencia SET DEFAULT nextval('public.ocorrencia_fitossanitaria_id_ocorrencia_seq'::regclass);


--
-- Name: planejamento_safra id_planejamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planejamento_safra ALTER COLUMN id_planejamento SET DEFAULT nextval('public.planejamento_safra_id_planejamento_seq'::regclass);


--
-- Name: plantio id_plantio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plantio ALTER COLUMN id_plantio SET DEFAULT nextval('public.plantio_id_plantio_seq'::regclass);


--
-- Name: previsao_climatica id_previsao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.previsao_climatica ALTER COLUMN id_previsao SET DEFAULT nextval('public.previsao_climatica_id_previsao_seq'::regclass);


--
-- Name: produtor id_produtor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtor ALTER COLUMN id_produtor SET DEFAULT nextval('public.produtor_id_produtor_seq'::regclass);


--
-- Name: propriedade id_propriedade; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propriedade ALTER COLUMN id_propriedade SET DEFAULT nextval('public.propriedade_id_propriedade_seq'::regclass);


--
-- Name: recomendacao id_recomendacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recomendacao ALTER COLUMN id_recomendacao SET DEFAULT nextval('public.recomendacao_id_recomendacao_seq'::regclass);


--
-- Name: registro_manejo id_registro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_manejo ALTER COLUMN id_registro SET DEFAULT nextval('public.registro_manejo_id_registro_seq'::regclass);


--
-- Name: rotacao_cultura id_rotacao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rotacao_cultura ALTER COLUMN id_rotacao SET DEFAULT nextval('public.rotacao_cultura_id_rotacao_seq'::regclass);


--
-- Name: talhao id_talhao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.talhao ALTER COLUMN id_talhao SET DEFAULT nextval('public.talhao_id_talhao_seq'::regclass);


--
-- Data for Name: analise_solo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analise_solo (id_analise, id_talhao, data_analise, tipo_solo, ph, materia_organica, fosforo, potassio, drenagem, retencao_agua) FROM stdin;
\.


--
-- Data for Name: cultura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cultura (id_cultura, nome, familia_botanica, ciclo_dias, necessidade_hidrica, descricao) FROM stdin;
\.


--
-- Data for Name: diagnostico_fitossanitario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnostico_fitossanitario (id_diagnostico, nome, tipo, sintomas, manejo_recomendado, descricao) FROM stdin;
\.


--
-- Data for Name: evento_calendario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evento_calendario (id_evento, id_talhao, titulo, operacao, descricao, data_evento, status) FROM stdin;
\.


--
-- Data for Name: indicador_sustentabilidade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.indicador_sustentabilidade (id_indicador, pontuacao, criterio, descricao, data_avaliacao) FROM stdin;
\.


--
-- Data for Name: lancamento_financeiro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lancamento_financeiro (id_lancamento, id_talhao, tipo, categoria, descricao, valor, data_lancamento) FROM stdin;
\.


--
-- Data for Name: ocorrencia_fitossanitaria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ocorrencia_fitossanitaria (id_ocorrencia, id_talhao, id_diagnostico, nome, severidade, data_ocorrencia, acao_realizada, observacoes) FROM stdin;
\.


--
-- Data for Name: planejamento_safra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planejamento_safra (id_planejamento, id_talhao, safra, meta_produtividade, rotacao_planejada, status) FROM stdin;
\.


--
-- Data for Name: plantio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plantio (id_plantio, id_talhao, id_cultura, data_plantio, quantidade_sementes, produtividade_prevista, status) FROM stdin;
\.


--
-- Data for Name: previsao_climatica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.previsao_climatica (id_previsao, id_propriedade, data_previsao, temperatura, probabilidade_chuva, umidade, alerta) FROM stdin;
\.


--
-- Data for Name: produtor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtor (id_produtor, nome, email, senha, telefone) FROM stdin;
\.


--
-- Data for Name: propriedade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.propriedade (id_propriedade, id_produtor, nome, cidade, estado, area_total, localizacao) FROM stdin;
\.


--
-- Data for Name: recomendacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recomendacao (id_recomendacao, id_talhao, id_indicador, tipo, descricao, justificativa, data_geracao) FROM stdin;
\.


--
-- Data for Name: registro_manejo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registro_manejo (id_registro, id_talhao, tipo_manejo, descricao, data_registro, quantidade, observacoes) FROM stdin;
\.


--
-- Data for Name: rotacao_cultura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rotacao_cultura (id_rotacao, id_planejamento, id_cultura, descricao, data_inicio, data_fim, justificativa) FROM stdin;
\.


--
-- Data for Name: talhao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.talhao (id_talhao, id_propriedade, nome, area, data_plantio, meta_produtividade) FROM stdin;
\.


--
-- Name: analise_solo_id_analise_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analise_solo_id_analise_seq', 1, false);


--
-- Name: cultura_id_cultura_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultura_id_cultura_seq', 1, false);


--
-- Name: diagnostico_fitossanitario_id_diagnostico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diagnostico_fitossanitario_id_diagnostico_seq', 1, false);


--
-- Name: evento_calendario_id_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evento_calendario_id_evento_seq', 1, false);


--
-- Name: indicador_sustentabilidade_id_indicador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.indicador_sustentabilidade_id_indicador_seq', 1, false);


--
-- Name: lancamento_financeiro_id_lancamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lancamento_financeiro_id_lancamento_seq', 1, false);


--
-- Name: ocorrencia_fitossanitaria_id_ocorrencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ocorrencia_fitossanitaria_id_ocorrencia_seq', 1, false);


--
-- Name: planejamento_safra_id_planejamento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planejamento_safra_id_planejamento_seq', 1, false);


--
-- Name: plantio_id_plantio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plantio_id_plantio_seq', 1, false);


--
-- Name: previsao_climatica_id_previsao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.previsao_climatica_id_previsao_seq', 1, false);


--
-- Name: produtor_id_produtor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtor_id_produtor_seq', 1, false);


--
-- Name: propriedade_id_propriedade_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.propriedade_id_propriedade_seq', 1, false);


--
-- Name: recomendacao_id_recomendacao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recomendacao_id_recomendacao_seq', 1, false);


--
-- Name: registro_manejo_id_registro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registro_manejo_id_registro_seq', 1, false);


--
-- Name: rotacao_cultura_id_rotacao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rotacao_cultura_id_rotacao_seq', 1, false);


--
-- Name: talhao_id_talhao_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.talhao_id_talhao_seq', 1, false);


--
-- Name: analise_solo analise_solo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analise_solo
    ADD CONSTRAINT analise_solo_pkey PRIMARY KEY (id_analise);


--
-- Name: cultura cultura_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultura
    ADD CONSTRAINT cultura_nome_key UNIQUE (nome);


--
-- Name: cultura cultura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultura
    ADD CONSTRAINT cultura_pkey PRIMARY KEY (id_cultura);


--
-- Name: diagnostico_fitossanitario diagnostico_fitossanitario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnostico_fitossanitario
    ADD CONSTRAINT diagnostico_fitossanitario_pkey PRIMARY KEY (id_diagnostico);


--
-- Name: evento_calendario evento_calendario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evento_calendario
    ADD CONSTRAINT evento_calendario_pkey PRIMARY KEY (id_evento);


--
-- Name: indicador_sustentabilidade indicador_sustentabilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indicador_sustentabilidade
    ADD CONSTRAINT indicador_sustentabilidade_pkey PRIMARY KEY (id_indicador);


--
-- Name: lancamento_financeiro lancamento_financeiro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lancamento_financeiro
    ADD CONSTRAINT lancamento_financeiro_pkey PRIMARY KEY (id_lancamento);


--
-- Name: ocorrencia_fitossanitaria ocorrencia_fitossanitaria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocorrencia_fitossanitaria
    ADD CONSTRAINT ocorrencia_fitossanitaria_pkey PRIMARY KEY (id_ocorrencia);


--
-- Name: planejamento_safra planejamento_safra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planejamento_safra
    ADD CONSTRAINT planejamento_safra_pkey PRIMARY KEY (id_planejamento);


--
-- Name: plantio plantio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plantio
    ADD CONSTRAINT plantio_pkey PRIMARY KEY (id_plantio);


--
-- Name: previsao_climatica previsao_climatica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.previsao_climatica
    ADD CONSTRAINT previsao_climatica_pkey PRIMARY KEY (id_previsao);


--
-- Name: produtor produtor_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtor
    ADD CONSTRAINT produtor_email_key UNIQUE (email);


--
-- Name: produtor produtor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtor
    ADD CONSTRAINT produtor_pkey PRIMARY KEY (id_produtor);


--
-- Name: propriedade propriedade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propriedade
    ADD CONSTRAINT propriedade_pkey PRIMARY KEY (id_propriedade);


--
-- Name: recomendacao recomendacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recomendacao
    ADD CONSTRAINT recomendacao_pkey PRIMARY KEY (id_recomendacao);


--
-- Name: registro_manejo registro_manejo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_manejo
    ADD CONSTRAINT registro_manejo_pkey PRIMARY KEY (id_registro);


--
-- Name: rotacao_cultura rotacao_cultura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rotacao_cultura
    ADD CONSTRAINT rotacao_cultura_pkey PRIMARY KEY (id_rotacao);


--
-- Name: talhao talhao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.talhao
    ADD CONSTRAINT talhao_pkey PRIMARY KEY (id_talhao);


--
-- Name: idx_analise_solo_talhao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_analise_solo_talhao ON public.analise_solo USING btree (id_talhao);


--
-- Name: idx_evento_talhao_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evento_talhao_data ON public.evento_calendario USING btree (id_talhao, data_evento);


--
-- Name: idx_lancamento_talhao_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lancamento_talhao_data ON public.lancamento_financeiro USING btree (id_talhao, data_lancamento);


--
-- Name: idx_manejo_talhao_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_manejo_talhao_data ON public.registro_manejo USING btree (id_talhao, data_registro);


--
-- Name: idx_ocorrencia_talhao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ocorrencia_talhao ON public.ocorrencia_fitossanitaria USING btree (id_talhao);


--
-- Name: idx_planejamento_talhao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planejamento_talhao ON public.planejamento_safra USING btree (id_talhao);


--
-- Name: idx_plantio_cultura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plantio_cultura ON public.plantio USING btree (id_cultura);


--
-- Name: idx_plantio_talhao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plantio_talhao ON public.plantio USING btree (id_talhao);


--
-- Name: idx_previsao_prop_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_previsao_prop_data ON public.previsao_climatica USING btree (id_propriedade, data_previsao);


--
-- Name: idx_propriedade_produtor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_propriedade_produtor ON public.propriedade USING btree (id_produtor);


--
-- Name: idx_recomendacao_talhao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recomendacao_talhao ON public.recomendacao USING btree (id_talhao);


--
-- Name: idx_rotacao_planejamento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rotacao_planejamento ON public.rotacao_cultura USING btree (id_planejamento);


--
-- Name: idx_talhao_propriedade; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_talhao_propriedade ON public.talhao USING btree (id_propriedade);


--
-- Name: analise_solo fk_analise_solo_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analise_solo
    ADD CONSTRAINT fk_analise_solo_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: evento_calendario fk_evento_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evento_calendario
    ADD CONSTRAINT fk_evento_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lancamento_financeiro fk_lancamento_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lancamento_financeiro
    ADD CONSTRAINT fk_lancamento_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: registro_manejo fk_manejo_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_manejo
    ADD CONSTRAINT fk_manejo_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ocorrencia_fitossanitaria fk_ocorrencia_diagnostico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocorrencia_fitossanitaria
    ADD CONSTRAINT fk_ocorrencia_diagnostico FOREIGN KEY (id_diagnostico) REFERENCES public.diagnostico_fitossanitario(id_diagnostico) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ocorrencia_fitossanitaria fk_ocorrencia_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocorrencia_fitossanitaria
    ADD CONSTRAINT fk_ocorrencia_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: planejamento_safra fk_planejamento_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planejamento_safra
    ADD CONSTRAINT fk_planejamento_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plantio fk_plantio_cultura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plantio
    ADD CONSTRAINT fk_plantio_cultura FOREIGN KEY (id_cultura) REFERENCES public.cultura(id_cultura) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: plantio fk_plantio_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plantio
    ADD CONSTRAINT fk_plantio_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: previsao_climatica fk_previsao_propriedade; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.previsao_climatica
    ADD CONSTRAINT fk_previsao_propriedade FOREIGN KEY (id_propriedade) REFERENCES public.propriedade(id_propriedade) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: propriedade fk_propriedade_produtor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propriedade
    ADD CONSTRAINT fk_propriedade_produtor FOREIGN KEY (id_produtor) REFERENCES public.produtor(id_produtor) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recomendacao fk_recomendacao_indicador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recomendacao
    ADD CONSTRAINT fk_recomendacao_indicador FOREIGN KEY (id_indicador) REFERENCES public.indicador_sustentabilidade(id_indicador) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: recomendacao fk_recomendacao_talhao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recomendacao
    ADD CONSTRAINT fk_recomendacao_talhao FOREIGN KEY (id_talhao) REFERENCES public.talhao(id_talhao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rotacao_cultura fk_rotacao_cultura; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rotacao_cultura
    ADD CONSTRAINT fk_rotacao_cultura FOREIGN KEY (id_cultura) REFERENCES public.cultura(id_cultura) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rotacao_cultura fk_rotacao_planejamento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rotacao_cultura
    ADD CONSTRAINT fk_rotacao_planejamento FOREIGN KEY (id_planejamento) REFERENCES public.planejamento_safra(id_planejamento) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: talhao fk_talhao_propriedade; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.talhao
    ADD CONSTRAINT fk_talhao_propriedade FOREIGN KEY (id_propriedade) REFERENCES public.propriedade(id_propriedade) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict NdB6DLD3jUVe0fNJTSnMiQbqEYlrtba6q1f6LcGoPTy4XtetIGCFUVxB92CcRHy

