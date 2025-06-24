import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
// EN: Translation resources for all supported languages
// PT: Recursos de tradução para todos os idiomas suportados
const resources = {
  en: {
    translation: {
      // Common
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      
      // Authentication
      auth: {
        login: 'Sign In',
        logout: 'Sign Out',
        register: 'Sign Up',
        username: 'Username',
        password: 'Password',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
        enterUsername: 'Enter your username',
        enterPassword: 'Enter your password',
        enterEmail: 'Enter your email',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember me',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
        invalidCredentials: 'Invalid credentials',
        loginSuccess: 'Login successful',
        logoutSuccess: 'Logout successful'
      },
      
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        systemOverview: 'System overview',
        authentication: 'Authentication',
        company: 'Company',
        companyInfo: 'Company information',
        employees: 'Employees & Costs',
        employeeManagement: 'Employee and cost management',
        suppliers: 'Suppliers',
        cashFlow: 'Cash Flow',
        accountsPayable: 'Accounts Payable',
        accountsReceivable: 'Accounts Receivable',
        constructionMaterials: 'Construction Materials',
        employeeMap: 'Employee Map',
        financialReports: 'Financial Reports',
        dataAnalytics: 'Data Analytics',
        advancedFinancial: 'Advanced Financial',
        integrations: 'Integrations'
      },
      
      // Dashboard
      dashboard: {
        welcome: 'Welcome, {{name}}',
        financialSystemOverview: 'Financial system overview',
        activeProjects: 'Active Projects',
        totalRevenue: 'Total Revenue',
        cashFlow: 'Cash Flow',
        pendingPayments: 'Pending Payments',
        vsLastMonth: 'vs last month',
        financialAnalysis: 'Financial Analysis',
        budgetVsExpenses: 'Budget vs Expenses',
        materialCosts: 'Material Costs',
        profitability: 'Profitability',
        reports: 'reports',
        items: 'items',
        metrics: 'metrics',
        financialInsights: 'Financial Insights',
        budgetChart: 'Budget vs Expenses chart will be displayed here'
      },
      
      // Weather
      weather: {
        alerts: 'Weather Alerts',
        humidity: 'Humidity',
        wind: 'Wind',
        partlyCloudy: 'Partly Cloudy',
        coldAlert: 'Cold alert for Thursday. Consider postponing outdoor activities.',
        forecast: '7-day Forecast',
        suggestions: 'Suggestions',
        lowTemperatures: 'Low temperatures forecast. Consider adjusting outdoor activities schedule.',
        days: {
          monday: 'Mon',
          tuesday: 'Tue',
          wednesday: 'Wed',
          thursday: 'Thu',
          friday: 'Fri',
          saturday: 'Sat',
          sunday: 'Sun'
        }
      },
      
      // Company
      company: {
        title: 'Company',
        information: 'Company Information',
        statistics: 'Company Statistics',
        name: 'Company Name',
        cnpj: 'Tax ID (CNPJ)',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        employees: 'Employees',
        activeProjects: 'Active Projects',
        monthlyRevenue: 'Monthly Revenue',
        location: 'Location'
      },
      
      // Employees
      employees: {
        title: 'Employees & Costs',
        management: 'Employee and cost management',
        loadingEmployees: 'Loading employees...',
        addEmployee: 'Add Employee',
        editEmployee: 'Edit Employee',
        deleteEmployee: 'Delete Employee',
        employeeList: 'Employee List',
        searchEmployee: 'Search employee by name',
        filterByName: 'Filter by name',
        name: 'Name',
        position: 'Position',
        department: 'Department',
        salary: 'Salary',
        hireDate: 'Hire Date',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive'
      },
      
      // API Status
      api: {
        connected: 'API connected',
        disconnected: 'API disconnected',
        status: 'API Status',
        endpoint: 'Endpoint',
        mode: 'Mode',
        production: 'Production',
        development: 'Development',
        demo: 'Demo'
      },
      
      // Language Selection
      language: {
        select: 'Select Language',
        english: 'English',
        portuguese: 'Português (Brasil)',
        chinese: '中文'
      },
      
      // Date and Time
      date: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        thisYear: 'This Year',
        formats: {
          short: 'MM/DD/YYYY',
          long: 'MMMM DD, YYYY',
          withTime: 'MM/DD/YYYY HH:mm'
        }
      },
      
      // Footer
      footer: {
        copyright: '© 2024 Financial Recovery System',
        developedFor: 'Developed for business financial management'
      }
    }
  },
  pt: {
    translation: {
      // Common
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      create: 'Criar',
      update: 'Atualizar',
      search: 'Pesquisar',
      filter: 'Filtrar',
      export: 'Exportar',
      import: 'Importar',
      refresh: 'Atualizar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      submit: 'Enviar',
      confirm: 'Confirmar',
      yes: 'Sim',
      no: 'Não',
      
      // Authentication
      auth: {
        login: 'Entrar',
        logout: 'Sair',
        register: 'Cadastrar',
        username: 'Usuário',
        password: 'Senha',
        email: 'E-mail',
        firstName: 'Nome',
        lastName: 'Sobrenome',
        enterUsername: 'Digite seu usuário',
        enterPassword: 'Digite sua senha',
        enterEmail: 'Digite seu e-mail',
        forgotPassword: 'Esqueceu a senha?',
        rememberMe: 'Lembrar de mim',
        createAccount: 'Criar Conta',
        alreadyHaveAccount: 'Já tem uma conta?',
        dontHaveAccount: 'Não tem uma conta?',
        invalidCredentials: 'Credenciais inválidas',
        loginSuccess: 'Login realizado com sucesso',
        logoutSuccess: 'Logout realizado com sucesso'
      },
      
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        systemOverview: 'Visão geral do sistema',
        authentication: 'Autenticação',
        company: 'Empresa',
        companyInfo: 'Informações da empresa',
        employees: 'Funcionários & Custos',
        employeeManagement: 'Gestão de funcionários e custos',
        suppliers: 'Fornecedores',
        cashFlow: 'Fluxo de Caixa',
        accountsPayable: 'Contas a Pagar',
        accountsReceivable: 'Contas a Receber',
        constructionMaterials: 'Materiais de Construção',
        employeeMap: 'Mapa de Funcionários',
        financialReports: 'Relatórios Financeiros',
        dataAnalytics: 'Analytics de Dados',
        advancedFinancial: 'Financeiro Avançado',
        integrations: 'Integrações'
      },
      
      // Dashboard
      dashboard: {
        welcome: 'Bem-vindo, {{name}}',
        financialSystemOverview: 'Visão geral do sistema financeiro',
        activeProjects: 'Projetos Ativos',
        totalRevenue: 'Receita Total',
        cashFlow: 'Fluxo de Caixa',
        pendingPayments: 'Pagamentos Pendentes',
        vsLastMonth: 'vs mês anterior',
        financialAnalysis: 'Análise Financeira',
        budgetVsExpenses: 'Orçamento vs Despesas',
        materialCosts: 'Custos de Material',
        profitability: 'Lucratividade',
        reports: 'relatórios',
        items: 'itens',
        metrics: 'métricas',
        financialInsights: 'Insights Financeiros',
        budgetChart: 'Gráfico de Orçamento vs Despesas será exibido aqui'
      },
      
      // Weather
      weather: {
        alerts: 'Alertas Meteorológicos',
        humidity: 'Umidade',
        wind: 'Vento',
        partlyCloudy: 'Parcialmente Nublado',
        coldAlert: 'Alerta de frio para quinta-feira. Considere adiar atividades externas.',
        forecast: 'Previsão de 7 dias',
        suggestions: 'Sugestões',
        lowTemperatures: 'Temperaturas baixas previstas. Considere ajustar cronograma de atividades externas.',
        days: {
          monday: 'Seg',
          tuesday: 'Ter',
          wednesday: 'Qua',
          thursday: 'Qui',
          friday: 'Sex',
          saturday: 'Sáb',
          sunday: 'Dom'
        }
      },
      
      // Company
      company: {
        title: 'Empresa',
        information: 'Informações da Empresa',
        statistics: 'Estatísticas da Empresa',
        name: 'Nome da Empresa',
        cnpj: 'CNPJ',
        address: 'Endereço',
        phone: 'Telefone',
        email: 'E-mail',
        employees: 'Funcionários',
        activeProjects: 'Projetos Ativos',
        monthlyRevenue: 'Receita Mensal',
        location: 'Localização'
      },
      
      // Employees
      employees: {
        title: 'Funcionários & Custos',
        management: 'Gestão de funcionários e custos',
        loadingEmployees: 'Carregando funcionários...',
        addEmployee: 'Adicionar Funcionário',
        editEmployee: 'Editar Funcionário',
        deleteEmployee: 'Excluir Funcionário',
        employeeList: 'Lista de Funcionários',
        searchEmployee: 'Pesquisar funcionário por nome',
        filterByName: 'Filtrar por nome',
        name: 'Nome',
        position: 'Cargo',
        department: 'Departamento',
        salary: 'Salário',
        hireDate: 'Data de Contratação',
        status: 'Status',
        active: 'Ativo',
        inactive: 'Inativo'
      },
      
      // API Status
      api: {
        connected: 'API conectada',
        disconnected: 'API desconectada',
        status: 'Status da API',
        endpoint: 'Endpoint',
        mode: 'Modo',
        production: 'Produção',
        development: 'Desenvolvimento',
        demo: 'Demo'
      },
      
      // Language Selection
      language: {
        select: 'Selecionar Idioma',
        english: 'English',
        portuguese: 'Português (Brasil)',
        chinese: '中文'
      },
      
      // Date and Time
      date: {
        today: 'Hoje',
        yesterday: 'Ontem',
        tomorrow: 'Amanhã',
        thisWeek: 'Esta Semana',
        thisMonth: 'Este Mês',
        thisYear: 'Este Ano',
        formats: {
          short: 'DD/MM/YYYY',
          long: 'DD de MMMM de YYYY',
          withTime: 'DD/MM/YYYY HH:mm'
        }
      },
      
      // Footer
      footer: {
        copyright: '© 2024 Financial Recovery System',
        developedFor: 'Desenvolvido para gestão financeira empresarial'
      }
    }
  },
  zh: {
    translation: {
      // Common
      loading: '加载中...',
      save: '保存',
      cancel: '取消',
      edit: '编辑',
      delete: '删除',
      create: '创建',
      update: '更新',
      search: '搜索',
      filter: '筛选',
      export: '导出',
      import: '导入',
      refresh: '刷新',
      back: '返回',
      next: '下一个',
      previous: '上一个',
      submit: '提交',
      confirm: '确认',
      yes: '是',
      no: '否',
      
      // Authentication
      auth: {
        login: '登录',
        logout: '退出',
        register: '注册',
        username: '用户名',
        password: '密码',
        email: '邮箱',
        firstName: '名',
        lastName: '姓',
        enterUsername: '请输入用户名',
        enterPassword: '请输入密码',
        enterEmail: '请输入邮箱',
        forgotPassword: '忘记密码？',
        rememberMe: '记住我',
        createAccount: '创建账户',
        alreadyHaveAccount: '已有账户？',
        dontHaveAccount: '没有账户？',
        invalidCredentials: '凭据无效',
        loginSuccess: '登录成功',
        logoutSuccess: '退出成功'
      },
      
      // Navigation
      nav: {
        dashboard: '仪表板',
        systemOverview: '系统概览',
        authentication: '身份验证',
        company: '公司',
        companyInfo: '公司信息',
        employees: '员工与成本',
        employeeManagement: '员工和成本管理',
        suppliers: '供应商',
        cashFlow: '现金流',
        accountsPayable: '应付账款',
        accountsReceivable: '应收账款',
        constructionMaterials: '建筑材料',
        employeeMap: '员工地图',
        financialReports: '财务报告',
        dataAnalytics: '数据分析',
        advancedFinancial: '高级财务',
        integrations: '集成'
      },
      
      // Dashboard
      dashboard: {
        welcome: '欢迎，{{name}}',
        financialSystemOverview: '财务系统概览',
        activeProjects: '活跃项目',
        totalRevenue: '总收入',
        cashFlow: '现金流',
        pendingPayments: '待付款项',
        vsLastMonth: '与上月相比',
        financialAnalysis: '财务分析',
        budgetVsExpenses: '预算与支出',
        materialCosts: '材料成本',
        profitability: '盈利能力',
        reports: '报告',
        items: '项目',
        metrics: '指标',
        financialInsights: '财务洞察',
        budgetChart: '预算与支出图表将在此显示'
      },
      
      // Weather
      weather: {
        alerts: '天气预警',
        humidity: '湿度',
        wind: '风速',
        partlyCloudy: '多云',
        coldAlert: '周四寒冷预警。建议推迟户外活动。',
        forecast: '7天预报',
        suggestions: '建议',
        lowTemperatures: '预计低温。建议调整户外活动时间表。',
        days: {
          monday: '周一',
          tuesday: '周二',
          wednesday: '周三',
          thursday: '周四',
          friday: '周五',
          saturday: '周六',
          sunday: '周日'
        }
      },
      
      // Company
      company: {
        title: '公司',
        information: '公司信息',
        statistics: '公司统计',
        name: '公司名称',
        cnpj: '税务编号',
        address: '地址',
        phone: '电话',
        email: '邮箱',
        employees: '员工',
        activeProjects: '活跃项目',
        monthlyRevenue: '月收入',
        location: '位置'
      },
      
      // Employees
      employees: {
        title: '员工与成本',
        management: '员工和成本管理',
        loadingEmployees: '加载员工中...',
        addEmployee: '添加员工',
        editEmployee: '编辑员工',
        deleteEmployee: '删除员工',
        employeeList: '员工列表',
        searchEmployee: '按姓名搜索员工',
        filterByName: '按姓名筛选',
        name: '姓名',
        position: '职位',
        department: '部门',
        salary: '薪资',
        hireDate: '入职日期',
        status: '状态',
        active: '在职',
        inactive: '离职'
      },
      
      // API Status
      api: {
        connected: 'API已连接',
        disconnected: 'API已断开',
        status: 'API状态',
        endpoint: '端点',
        mode: '模式',
        production: '生产',
        development: '开发',
        demo: '演示'
      },
      
      // Language Selection
      language: {
        select: '选择语言',
        english: 'English',
        portuguese: 'Português (Brasil)',
        chinese: '中文'
      },
      
      // Date and Time
      date: {
        today: '今天',
        yesterday: '昨天',
        tomorrow: '明天',
        thisWeek: '本周',
        thisMonth: '本月',
        thisYear: '今年',
        formats: {
          short: 'YYYY/MM/DD',
          long: 'YYYY年MM月DD日',
          withTime: 'YYYY/MM/DD HH:mm'
        }
      },
      
      // Footer
      footer: {
        copyright: '© 2024 Financial Recovery System',
        developedFor: '为企业财务管理而开发'
      }
    }
  }
};

// Language detection options
const detection = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
  checkWhitelist: true
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection,
    fallbackLng: 'en', // Default to English (American/Canadian)
    supportedLngs: ['en', 'pt', 'zh'], // Supported languages (removed Indian as requested)
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;

