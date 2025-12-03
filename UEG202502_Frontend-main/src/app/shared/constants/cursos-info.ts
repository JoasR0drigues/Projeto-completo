export interface CursoInfo {
  slug: string;
  titulo: string;
  resumo: string;
  duracao: string;
  cargaHoraria: string;
  publicoAlvo: string;
  parceiros: string[];
  beneficios: string[];
  modulos: string[];
}

export const CURSOS_INFO: CursoInfo[] = [
  {
    slug: 'manutencao-computadores-celulares',
    titulo: 'Manutenção de Computadores e Celulares',
    resumo: 'Formação prática para diagnóstico, reparo e configuração completa de dispositivos.',
    duracao: '4 meses',
    cargaHoraria: '120 horas',
    publicoAlvo: 'Interessados em atuar com suporte técnico, assistências e laboratórios.',
    parceiros: ['SECTI', 'CP Goiás', 'Programando o Futuro'],
    beneficios: [
      'Laboratório completo com bancada e kits de diagnóstico',
      'Certificação conjunta Sukatech + parceiros oficiais',
      'Simulações de atendimentos reais e checklist profissional'
    ],
    modulos: [
      'Arquitetura de hardware e eletrônica básica',
      'Formatação, backup e otimização de sistemas',
      'Troca de componentes e micro soldagem',
      'Manutenção preventiva e planos de suporte',
      'Atendimento ao cliente e garantia técnica'
    ]
  },
  {
    slug: 'excel-avancado',
    titulo: 'Excel Avançado',
    resumo: 'Automação de planilhas, dashboards e análise de dados corporativos.',
    duracao: '3 meses',
    cargaHoraria: '90 horas',
    publicoAlvo: 'Profissionais que desejam dominar análises, relatórios e automações no Excel.',
    parceiros: ['SECTI', 'CP Goiás', 'Programando o Futuro'],
    beneficios: [
      'Projetos guiados baseados em cenários reais de negócios',
      'Templates exclusivos e reutilizáveis',
      'Mentorias coletivas com especialistas em BI'
    ],
    modulos: [
      'Funções avançadas, PROCX e LET',
      'Dashboards com gráficos dinâmicos',
      'Power Query e tratamento de dados',
      'Automação com macros e VBA',
      'Boas práticas para relatórios executivos'
    ]
  },
  {
    slug: 'marketing-digital',
    titulo: 'Marketing Digital',
    resumo: 'Estratégias de conteúdo, redes sociais e performance para negócios.',
    duracao: '4 meses',
    cargaHoraria: '110 horas',
    publicoAlvo: 'Empreendedores, creators e equipes de comunicação.',
    parceiros: ['SECTI', 'CP Goiás', 'Programando o Futuro'],
    beneficios: [
      'Calendários editáveis e kits de pauta',
      'Laboratórios de mídia paga com simuladores',
      'Acompanhamento individual de projetos'
    ],
    modulos: [
      'Branding e posicionamento digital',
      'Copywriting e funil de conteúdo',
      'Gestão de redes sociais e social ads',
      'Métricas, KPIs e ferramentas de analytics',
      'Growth e automação de marketing'
    ]
  },
  {
    slug: 'introducao-ia',
    titulo: 'Introdução à IA',
    resumo: 'Fundamentos de inteligência artificial, aplicações e ferramentas práticas.',
    duracao: '2 meses',
    cargaHoraria: '80 horas',
    publicoAlvo: 'Profissionais e estudantes que desejam iniciar na área de IA aplicada.',
    parceiros: ['SECTI', 'CP Goiás', 'Programando o Futuro'],
    beneficios: [
      'Laboratórios com as principais ferramentas de IA generativa',
      'Projetos guiados para diferentes áreas de negócio',
      'Curadoria semanal de novidades do ecossistema IA'
    ],
    modulos: [
      'Conceitos fundamentais de IA e ML',
      'Ferramentas generativas para texto, imagem e dados',
      'Criação de assistentes e automações com IA',
      'Ética, segurança e governança',
      'Protótipos guiados por desafios reais'
    ]
  },
  {
    slug: 'informatica-basica',
    titulo: 'Informática Básica',
    resumo: 'Conceitos essenciais de hardware, software e produtividade no dia a dia.',
    duracao: '2 meses',
    cargaHoraria: '60 horas',
    publicoAlvo: 'Iniciantes que buscam dominar o computador para estudos e trabalho.',
    parceiros: ['SECTI', 'CP Goiás', 'Programando o Futuro'],
    beneficios: [
      'Aulas presenciais e suporte remoto',
      'Material didático ilustrado e acessível',
      'Simulados de certificação digital'
    ],
    modulos: [
      'Ambiente Windows e organização de arquivos',
      'Pacote Office essencial',
      'Navegação segura na internet e cidadania digital',
      'Serviços em nuvem e colaboração',
      'Introdução à manutenção preventiva'
    ]
  }
];

export const CURSOS_INFO_MAP: Record<string, CursoInfo> = CURSOS_INFO.reduce(
  (acc, curso) => ({ ...acc, [curso.slug]: curso }),
  {}
);


