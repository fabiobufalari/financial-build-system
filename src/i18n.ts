// Configuração de internacionalização completa
// Configuration of complete internationalization
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Traduções para todos os idiomas
// Translations for all languages
const resources = {
  en: {
    translation: {
      // Common
      language: {
        select: "Select Language",
        english: "English",
        portuguese: "Portuguese (Brazil)",
        french: "French",
        chinese: "Chinese",
        arabic: "Arabic"
      },
      auth: {
        title: "Financial Solutions",
        subtitle: "Financial Solutions",
        username: "Username",
        usernamePlaceholder: "Enter your username",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        signIn: "Sign In",
        signingIn: "Signing in...",
        selectLanguage: "Select Language",
        success: "Login successful!",
        footer: "All rights reserved.",
        enterUsername: "Enter your username",
        enterPassword: "Enter your password",
        invalidCredentials: "Invalid username or password",
        loginSuccess: "Login successful!",
        demo: {
          title: "Demo credentials:",
          username: "Username",
          password: "Password"
        },
        errors: {
          usernameRequired: "Username is required",
          passwordRequired: "Password is required",
          invalidCredentials: "Invalid username or password",
          generic: "Login error"
        }
      },
      register: {
        title: "Create Account",
        subtitle: "Join Financial Build System",
        firstName: "First Name",
        firstNamePlaceholder: "Enter your first name",
        lastName: "Last Name", 
        lastNamePlaceholder: "Enter your last name",
        username: "Username",
        usernamePlaceholder: "Choose a username",
        email: "Email",
        emailPlaceholder: "Enter your email address",
        password: "Password",
        passwordPlaceholder: "Create a password",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm your password",
        signUp: "Create Account",
        registering: "Creating account...",
        alreadyHaveAccount: "Already have an account?",
        signInLink: "Sign in here",
        errors: {
          usernameRequired: "Username is required",
          usernameMinLength: "Username must be at least 3 characters",
          emailRequired: "Email is required",
          emailInvalid: "Please enter a valid email address",
          passwordRequired: "Password is required",
          passwordMinLength: "Password must be at least 6 characters",
          passwordMismatch: "Passwords do not match",
          firstNameRequired: "First name is required",
          lastNameRequired: "Last name is required",
          generic: "Registration failed. Please try again."
        }
      },
      api: {
        status: "API Status",
        connected: "Connected",
        disconnected: "Disconnected",
        endpoint: "Endpoint",
        mode: "Mode",
        production: "Production"
      },
      loading: "Loading",
      refresh: "Refresh",
      footer: {
        copyright: "© 2024 Financial Build System. All rights reserved.",
        developedFor: "Developed by Fabio Bufalari - bufalari.fabio@gmail.com - 15 years of experience"
      },
      dashboard: {
        financialSystemOverview: "Financial System Overview",
        welcome: "Welcome",
        subtitle: "Financial system overview",
        refresh: "Refresh",
        refreshing: "Refreshing...",
        vsLastMonth: "vs last month",
        cards: {
          activeProjects: "Active Projects",
          totalRevenue: "Total Revenue",
          cashFlow: "Cash Flow",
          pendingPayments: "Pending Payments"
        },
        financialAnalysis: "Financial Analysis",
        chartPlaceholder: "Budget vs Expenses chart will be displayed here",
        insights: {
          title: "Financial Insights",
          positive: "December 2024 analysis: 16% below planned budget, indicating good financial management. Continue monitoring to maintain positive trend."
        },
        projectMap: "Project Map",
        analysis: {
          budget: "Budget vs Expenses",
          materials: "Material Costs",
          profitability: "Profitability",
          reports: "reports",
          items: "items",
          metrics: "metrics"
        }
      },
      menu: {
        dashboard: "Dashboard",
        auth: "Authentication",
        company: "Company",
        employees: "Employees & Costs",
        suppliers: "Suppliers",
        cashflow: "Cash Flow",
        accountsPayable: "Accounts Payable",
        accountsReceivable: "Accounts Receivable",
        materials: "Building Materials",
        projectMap: "Project Map",
        reports: "Financial Reports",
        analytics: "Data Analytics",
        advanced: "Advanced Financial",
        integrations: "Integrations",
        logout: "Logout",
        descriptions: {
          dashboard: "Main dashboard with financial overview",
          auth: "User authentication and access control",
          company: "Company information and settings",
          employees: "Employee management and cost tracking",
          suppliers: "Supplier management and contracts",
          cashflow: "Cash flow monitoring and projections",
          accountsPayable: "Manage accounts payable",
          accountsReceivable: "Manage accounts receivable",
          materials: "Building materials calculation",
          projectMap: "Geographic view of all projects",
          reports: "Financial reports and analytics",
          analytics: "Advanced data analytics",
          advanced: "Advanced financial tools",
          integrations: "System integrations"
        }
      },
      weather: {
        title: "Weather Alerts",
        temperature: "Temperature",
        forecast: "7-day Forecast",
        alerts: "Weather Alerts",
        suggestions: "Suggestions"
      }
    }
  },
  pt: {
    translation: {
      // Common
      language: {
        select: "Selecionar Idioma",
        english: "Inglês",
        portuguese: "Português (Brasil)",
        french: "Francês",
        chinese: "Chinês",
        arabic: "Árabe"
      },
      auth: {
        title: "Financial Solutions",
        subtitle: "Financial Solutions",
        username: "Usuário",
        usernamePlaceholder: "Digite seu usuário",
        password: "Senha",
        passwordPlaceholder: "Digite sua senha",
        signIn: "Entrar",
        signingIn: "Entrando...",
        selectLanguage: "Selecionar Idioma",
        success: "Login realizado com sucesso!",
        footer: "Todos os direitos reservados.",
        enterUsername: "Digite seu usuário",
        enterPassword: "Digite sua senha",
        invalidCredentials: "Usuário ou senha inválidos",
        loginSuccess: "Login realizado com sucesso!",
        demo: {
          title: "Dados para demonstração:",
          username: "Usuário",
          password: "Senha"
        },
        errors: {
          usernameRequired: "Usuário é obrigatório",
          passwordRequired: "Senha é obrigatória",
          invalidCredentials: "Usuário ou senha inválidos",
          generic: "Erro ao fazer login"
        }
      },
      register: {
        title: "Criar Conta",
        subtitle: "Junte-se ao Financial Build System",
        firstName: "Primeiro Nome",
        firstNamePlaceholder: "Digite seu primeiro nome",
        lastName: "Sobrenome", 
        lastNamePlaceholder: "Digite seu sobrenome",
        username: "Usuário",
        usernamePlaceholder: "Escolha um nome de usuário",
        email: "Email",
        emailPlaceholder: "Digite seu endereço de email",
        password: "Senha",
        passwordPlaceholder: "Crie uma senha",
        confirmPassword: "Confirmar Senha",
        confirmPasswordPlaceholder: "Confirme sua senha",
        signUp: "Criar Conta",
        registering: "Criando conta...",
        alreadyHaveAccount: "Já tem uma conta?",
        signInLink: "Entrar aqui",
        errors: {
          usernameRequired: "Usuário é obrigatório",
          usernameMinLength: "Usuário deve ter pelo menos 3 caracteres",
          emailRequired: "Email é obrigatório",
          emailInvalid: "Por favor, insira um endereço de email válido",
          passwordRequired: "Senha é obrigatória",
          passwordMinLength: "Senha deve ter pelo menos 6 caracteres",
          passwordMismatch: "As senhas não coincidem",
          firstNameRequired: "Primeiro nome é obrigatório",
          lastNameRequired: "Sobrenome é obrigatório",
          generic: "Falha no registro. Por favor, tente novamente."
        }
      },
      api: {
        status: "Status da API",
        connected: "Conectado",
        disconnected: "Desconectado",
        endpoint: "Endpoint",
        mode: "Modo",
        production: "Produção"
      },
      loading: "Carregando",
      refresh: "Atualizar",
      footer: {
        copyright: "© 2024 Financial Build System. Todos os direitos reservados.",
        developedFor: "Desenvolvido por Fabio Bufalari - bufalari.fabio@gmail.com - 15 anos de experiência"
      },
      dashboard: {
        financialSystemOverview: "Visão Geral do Sistema Financeiro",
        welcome: "Bem-vindo",
        subtitle: "Visão geral do sistema financeiro",
        refresh: "Atualizar",
        refreshing: "Atualizando...",
        vsLastMonth: "vs mês anterior",
        cards: {
          activeProjects: "Projetos Ativos",
          totalRevenue: "Receita Total",
          cashFlow: "Fluxo de Caixa",
          pendingPayments: "Pagamentos Pendentes"
        },
        financialAnalysis: "Análise Financeira",
        chartPlaceholder: "Gráfico de Orçamento vs Despesas será exibido aqui",
        insights: {
          title: "Insights Financeiros",
          positive: "Análise de dezembro 2024: 16% abaixo do orçamento planejado, indicando boa gestão financeira. Continue monitorando para manter a tendência positiva."
        },
        projectMap: "Mapa de Projetos",
        analysis: {
          budget: "Orçamento vs Despesas",
          materials: "Custos de Materiais",
          profitability: "Rentabilidade",
          reports: "relatórios",
          items: "itens",
          metrics: "métricas"
        }
      },
      menu: {
        dashboard: "Dashboard",
        auth: "Autenticação",
        company: "Empresa",
        employees: "Funcionários e Custos",
        suppliers: "Fornecedores",
        cashflow: "Fluxo de Caixa",
        accountsPayable: "Contas a Pagar",
        accountsReceivable: "Contas a Receber",
        materials: "Materiais de Construção",
        projectMap: "Mapa de Projetos",
        reports: "Relatórios Financeiros",
        analytics: "Análise de Dados",
        advanced: "Financeiro Avançado",
        integrations: "Integrações",
        logout: "Sair",
        descriptions: {
          dashboard: "Dashboard principal com visão financeira",
          auth: "Autenticação e controle de acesso",
          company: "Informações e configurações da empresa",
          employees: "Gestão de funcionários e custos",
          suppliers: "Gestão de fornecedores e contratos",
          cashflow: "Monitoramento e projeções de fluxo de caixa",
          accountsPayable: "Gerenciar contas a pagar",
          accountsReceivable: "Gerenciar contas a receber",
          materials: "Cálculo de materiais de construção",
          projectMap: "Visualização geográfica de todos os projetos",
          reports: "Relatórios e análises financeiras",
          analytics: "Análise avançada de dados",
          advanced: "Ferramentas financeiras avançadas",
          integrations: "Integrações do sistema"
        }
      },
      weather: {
        title: "Alertas de Clima",
        temperature: "Temperatura",
        forecast: "Previsão 7 dias",
        alerts: "Alertas Meteorológicos",
        suggestions: "Sugestões"
      }
    }
  },
  fr: {
    translation: {
      // Common
      language: {
        select: "Sélectionner la langue",
        english: "Anglais",
        portuguese: "Portugais (Brésil)",
        french: "Français",
        chinese: "Chinois",
        arabic: "Arabe"
      },
      auth: {
        title: "Financial Solutions",
        subtitle: "Financial Solutions",
        username: "Nom d'utilisateur",
        usernamePlaceholder: "Entrez votre nom d'utilisateur",
        password: "Mot de passe",
        passwordPlaceholder: "Entrez votre mot de passe",
        signIn: "Se connecter",
        signingIn: "Connexion en cours...",
        selectLanguage: "Sélectionner la langue",
        success: "Connexion réussie!",
        footer: "Tous droits réservés.",
        enterUsername: "Entrez votre nom d'utilisateur",
        enterPassword: "Entrez votre mot de passe",
        invalidCredentials: "Nom d'utilisateur ou mot de passe invalide",
        loginSuccess: "Connexion réussie!",
        demo: {
          title: "Identifiants de démonstration:",
          username: "Nom d'utilisateur",
          password: "Mot de passe"
        },
        errors: {
          usernameRequired: "Le nom d'utilisateur est requis",
          passwordRequired: "Le mot de passe est requis",
          invalidCredentials: "Nom d'utilisateur ou mot de passe invalide",
          generic: "Erreur de connexion"
        }
      },
      register: {
        title: "Créer un compte",
        subtitle: "Rejoignez Financial Build System",
        firstName: "Prénom",
        firstNamePlaceholder: "Entrez votre prénom",
        lastName: "Nom de famille", 
        lastNamePlaceholder: "Entrez votre nom de famille",
        username: "Nom d'utilisateur",
        usernamePlaceholder: "Choisissez un nom d'utilisateur",
        email: "Email",
        emailPlaceholder: "Entrez votre adresse email",
        password: "Mot de passe",
        passwordPlaceholder: "Créez un mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        confirmPasswordPlaceholder: "Confirmez votre mot de passe",
        signUp: "Créer un compte",
        registering: "Création du compte...",
        alreadyHaveAccount: "Vous avez déjà un compte?",
        signInLink: "Connectez-vous ici",
        errors: {
          usernameRequired: "Le nom d'utilisateur est requis",
          usernameMinLength: "Le nom d'utilisateur doit contenir au moins 3 caractères",
          emailRequired: "L'email est requis",
          emailInvalid: "Veuillez entrer une adresse email valide",
          passwordRequired: "Le mot de passe est requis",
          passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
          passwordMismatch: "Les mots de passe ne correspondent pas",
          firstNameRequired: "Le prénom est requis",
          lastNameRequired: "Le nom de famille est requis",
          generic: "Échec de l'inscription. Veuillez réessayer."
        }
      },
      api: {
        status: "Statut de l'API",
        connected: "Connecté",
        disconnected: "Déconnecté",
        endpoint: "Point de terminaison",
        mode: "Mode",
        production: "Production"
      },
      loading: "Chargement",
      refresh: "Actualiser",
      footer: {
        copyright: "© 2024 Financial Build System. Tous droits réservés.",
        developedFor: "Développé par Fabio Bufalari - bufalari.fabio@gmail.com - 15 ans d'expérience"
      },
      dashboard: {
        financialSystemOverview: "Aperçu du système financier",
        welcome: "Bienvenue",
        subtitle: "Aperçu du système financier",
        refresh: "Actualiser",
        refreshing: "Actualisation...",
        vsLastMonth: "vs mois précédent",
        cards: {
          activeProjects: "Projets actifs",
          totalRevenue: "Revenus totaux",
          cashFlow: "Flux de trésorerie",
          pendingPayments: "Paiements en attente"
        },
        financialAnalysis: "Analyse financière",
        chartPlaceholder: "Le graphique Budget vs Dépenses sera affiché ici",
        insights: {
          title: "Aperçus financiers",
          positive: "Analyse de décembre 2024: 16% en dessous du budget prévu, indiquant une bonne gestion financière. Continuez à surveiller pour maintenir la tendance positive."
        },
        projectMap: "Carte des projets",
        analysis: {
          budget: "Budget vs Dépenses",
          materials: "Coûts des matériaux",
          profitability: "Rentabilité",
          reports: "rapports",
          items: "éléments",
          metrics: "métriques"
        }
      },
      menu: {
        dashboard: "Tableau de bord",
        auth: "Authentification",
        company: "Entreprise",
        employees: "Employés et coûts",
        suppliers: "Fournisseurs",
        cashflow: "Flux de trésorerie",
        accountsPayable: "Comptes fournisseurs",
        accountsReceivable: "Comptes clients",
        materials: "Matériaux de construction",
        projectMap: "Carte des projets",
        reports: "Rapports financiers",
        analytics: "Analyse de données",
        advanced: "Finance avancée",
        integrations: "Intégrations",
        logout: "Déconnexion",
        descriptions: {
          dashboard: "Tableau de bord principal avec aperçu financier",
          auth: "Authentification et contrôle d'accès",
          company: "Informations et paramètres de l'entreprise",
          employees: "Gestion des employés et suivi des coûts",
          suppliers: "Gestion des fournisseurs et contrats",
          cashflow: "Surveillance et projections de flux de trésorerie",
          accountsPayable: "Gérer les comptes fournisseurs",
          accountsReceivable: "Gérer les comptes clients",
          materials: "Calcul des matériaux de construction",
          projectMap: "Vue géographique de tous les projets",
          reports: "Rapports et analyses financières",
          analytics: "Analyse avancée des données",
          advanced: "Outils financiers avancés",
          integrations: "Intégrations du système"
        }
      },
      weather: {
        title: "Alertes météo",
        temperature: "Température",
        forecast: "Prévisions 7 jours",
        alerts: "Alertes météorologiques",
        suggestions: "Suggestions"
      }
    }
  },
  zh: {
    translation: {
      // Common
      language: {
        select: "选择语言",
        english: "英语",
        portuguese: "葡萄牙语（巴西）",
        french: "法语",
        chinese: "中文",
        arabic: "阿拉伯语"
      },
      auth: {
        title: "Financial Solutions",
        subtitle: "Financial Solutions",
        username: "用户名",
        usernamePlaceholder: "输入用户名",
        password: "密码",
        passwordPlaceholder: "输入密码",
        signIn: "登录",
        signingIn: "登录中...",
        selectLanguage: "选择语言",
        success: "登录成功!",
        footer: "版权所有。",
        enterUsername: "输入用户名",
        enterPassword: "输入密码",
        invalidCredentials: "用户名或密码无效",
        loginSuccess: "登录成功!",
        demo: {
          title: "演示凭证:",
          username: "用户名",
          password: "密码"
        },
        errors: {
          usernameRequired: "用户名必填",
          passwordRequired: "密码必填",
          invalidCredentials: "用户名或密码无效",
          generic: "登录错误"
        }
      },
      register: {
        title: "创建账户",
        subtitle: "加入财务构建系统",
        firstName: "名字",
        firstNamePlaceholder: "输入您的名字",
        lastName: "姓氏", 
        lastNamePlaceholder: "输入您的姓氏",
        username: "用户名",
        usernamePlaceholder: "选择一个用户名",
        email: "电子邮件",
        emailPlaceholder: "输入您的电子邮件地址",
        password: "密码",
        passwordPlaceholder: "创建密码",
        confirmPassword: "确认密码",
        confirmPasswordPlaceholder: "确认您的密码",
        signUp: "创建账户",
        registering: "正在创建账户...",
        alreadyHaveAccount: "已有账户?",
        signInLink: "在此登录",
        errors: {
          usernameRequired: "用户名必填",
          usernameMinLength: "用户名至少需要3个字符",
          emailRequired: "电子邮件必填",
          emailInvalid: "请输入有效的电子邮件地址",
          passwordRequired: "密码必填",
          passwordMinLength: "密码至少需要6个字符",
          passwordMismatch: "密码不匹配",
          firstNameRequired: "名字必填",
          lastNameRequired: "姓氏必填",
          generic: "注册失败。请重试。"
        }
      },
      api: {
        status: "API状态",
        connected: "已连接",
        disconnected: "已断开",
        endpoint: "端点",
        mode: "模式",
        production: "生产"
      },
      loading: "加载中",
      refresh: "刷新",
      footer: {
        copyright: "© 2024 Financial Build System. 版权所有。",
        developedFor: "由 Fabio Bufalari 开发 - bufalari.fabio@gmail.com - 15年经验"
      },
      dashboard: {
        financialSystemOverview: "财务系统概览",
        welcome: "欢迎",
        subtitle: "财务系统概览",
        refresh: "刷新",
        refreshing: "刷新中...",
        vsLastMonth: "vs 上月",
        cards: {
          activeProjects: "活跃项目",
          totalRevenue: "总收入",
          cashFlow: "现金流",
          pendingPayments: "待付款项"
        },
        financialAnalysis: "财务分析",
        chartPlaceholder: "预算vs支出图表将在此显示",
        insights: {
          title: "财务洞察",
          positive: "2024年12月分析：低于计划预算16%，表明财务管理良好。继续监控以保持积极趋势。"
        },
        projectMap: "项目地图",
        analysis: {
          budget: "预算vs支出",
          materials: "材料成本",
          profitability: "盈利能力",
          reports: "报告",
          items: "项目",
          metrics: "指标"
        }
      },
      menu: {
        dashboard: "仪表板",
        auth: "认证",
        company: "公司",
        employees: "员工和成本",
        suppliers: "供应商",
        cashflow: "现金流",
        accountsPayable: "应付账款",
        accountsReceivable: "应收账款",
        materials: "建筑材料",
        projectMap: "项目地图",
        reports: "财务报告",
        analytics: "数据分析",
        advanced: "高级财务",
        integrations: "集成",
        logout: "登出",
        descriptions: {
          dashboard: "主仪表板，提供财务概览",
          auth: "用户认证和访问控制",
          company: "公司信息和设置",
          employees: "员工管理和成本跟踪",
          suppliers: "供应商管理和合同",
          cashflow: "现金流监控和预测",
          accountsPayable: "管理应付账款",
          accountsReceivable: "管理应收账款",
          materials: "建筑材料计算",
          projectMap: "所有项目的地理视图",
          reports: "财务报告和分析",
          analytics: "高级数据分析",
          advanced: "高级财务工具",
          integrations: "系统集成"
        }
      },
      weather: {
        title: "天气预警",
        temperature: "温度",
        forecast: "7天预报",
        alerts: "天气预警",
        suggestions: "建议"
      }
    }
  },
  ar: {
    translation: {
      // Common
      language: {
        select: "اختر اللغة",
        english: "الإنجليزية",
        portuguese: "البرتغالية (البرازيل)",
        french: "الفرنسية",
        chinese: "الصينية",
        arabic: "العربية"
      },
      auth: {
        title: "Financial Solutions",
        subtitle: "Financial Solutions",
        username: "اسم المستخدم",
        usernamePlaceholder: "أدخل اسم المستخدم",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        signIn: "تسجيل الدخول",
        signingIn: "جاري تسجيل الدخول...",
        selectLanguage: "اختر اللغة",
        success: "تم تسجيل الدخول بنجاح!",
        footer: "جميع الحقوق محفوظة.",
        enterUsername: "أدخل اسم المستخدم",
        enterPassword: "أدخل كلمة المرور",
        invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة",
        loginSuccess: "تم تسجيل الدخول بنجاح!",
        demo: {
          title: "بيانات الاعتماد التجريبية:",
          username: "اسم المستخدم",
          password: "كلمة المرور"
        },
        errors: {
          usernameRequired: "اسم المستخدم مطلوب",
          passwordRequired: "كلمة المرور مطلوبة",
          invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة",
          generic: "خطأ في تسجيل الدخول"
        }
      },
      register: {
        title: "إنشاء حساب",
        subtitle: "انضم إلى نظام البناء المالي",
        firstName: "الاسم الأول",
        firstNamePlaceholder: "أدخل اسمك الأول",
        lastName: "اسم العائلة", 
        lastNamePlaceholder: "أدخل اسم عائلتك",
        username: "اسم المستخدم",
        usernamePlaceholder: "اختر اسم مستخدم",
        email: "البريد الإلكتروني",
        emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
        password: "كلمة المرور",
        passwordPlaceholder: "إنشاء كلمة مرور",
        confirmPassword: "تأكيد كلمة المرور",
        confirmPasswordPlaceholder: "تأكيد كلمة المرور الخاصة بك",
        signUp: "إنشاء حساب",
        registering: "جاري إنشاء الحساب...",
        alreadyHaveAccount: "هل لديك حساب بالفعل؟",
        signInLink: "تسجيل الدخول هنا",
        errors: {
          usernameRequired: "اسم المستخدم مطلوب",
          usernameMinLength: "يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل",
          emailRequired: "البريد الإلكتروني مطلوب",
          emailInvalid: "الرجاء إدخال عنوان بريد إلكتروني صالح",
          passwordRequired: "كلمة المرور مطلوبة",
          passwordMinLength: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
          passwordMismatch: "كلمات المرور غير متطابقة",
          firstNameRequired: "الاسم الأول مطلوب",
          lastNameRequired: "اسم العائلة مطلوب",
          generic: "فشل التسجيل. الرجاء المحاولة مرة أخرى."
        }
      },
      api: {
        status: "حالة API",
        connected: "متصل",
        disconnected: "منقطع",
        endpoint: "نقطة النهاية",
        mode: "الوضع",
        production: "الإنتاج"
      },
      loading: "جاري التحميل",
      refresh: "تحديث",
      footer: {
        copyright: "© 2024 Financial Build System. جميع الحقوق محفوظة.",
        developedFor: "تطوير Fabio Bufalari - bufalari.fabio@gmail.com - 15 سنة خبرة"
      },
      dashboard: {
        financialSystemOverview: "نظرة عامة على النظام المالي",
        welcome: "مرحباً",
        subtitle: "نظرة عامة على النظام المالي",
        refresh: "تحديث",
        refreshing: "جاري التحديث...",
        vsLastMonth: "مقابل الشهر الماضي",
        cards: {
          activeProjects: "المشاريع النشطة",
          totalRevenue: "إجمالي الإيرادات",
          cashFlow: "التدفق النقدي",
          pendingPayments: "المدفوعات المعلقة"
        },
        financialAnalysis: "التحليل المالي",
        chartPlaceholder: "سيتم عرض مخطط الميزانية مقابل المصروفات هنا",
        insights: {
          title: "الرؤى المالية",
          positive: "تحليل ديسمبر 2024: 16% أقل من الميزانية المخططة، مما يشير إلى إدارة مالية جيدة. استمر في المراقبة للحفاظ على الاتجاه الإيجابي."
        },
        projectMap: "خريطة المشاريع",
        analysis: {
          budget: "الميزانية مقابل المصروفات",
          materials: "تكاليف المواد",
          profitability: "الربحية",
          reports: "التقارير",
          items: "العناصر",
          metrics: "المقاييس"
        }
      },
      menu: {
        dashboard: "لوحة التحكم",
        auth: "المصادقة",
        company: "الشركة",
        employees: "الموظفون والتكاليف",
        suppliers: "الموردون",
        cashflow: "التدفق النقدي",
        accountsPayable: "الحسابات المستحقة الدفع",
        accountsReceivable: "الحسابات المستحقة القبض",
        materials: "مواد البناء",
        projectMap: "خريطة المشاريع",
        reports: "التقارير المالية",
        analytics: "تحليل البيانات",
        advanced: "المالية المتقدمة",
        integrations: "التكاملات",
        logout: "تسجيل الخروج",
        descriptions: {
          dashboard: "لوحة التحكم الرئيسية مع نظرة عامة مالية",
          auth: "المصادقة والتحكم في الوصول",
          company: "معلومات وإعدادات الشركة",
          employees: "إدارة الموظفين وتتبع التكاليف",
          suppliers: "إدارة الموردين والعقود",
          cashflow: "مراقبة التدفق النقدي والتوقعات",
          accountsPayable: "إدارة الحسابات المستحقة الدفع",
          accountsReceivable: "إدارة الحسابات المستحقة القبض",
          materials: "حساب مواد البناء",
          projectMap: "عرض جغرافي لجميع المشاريع",
          reports: "التقارير والتحليلات المالية",
          analytics: "تحليل البيانات المتقدم",
          advanced: "أدوات مالية متقدمة",
          integrations: "تكاملات النظام"
        }
      },
      weather: {
        title: "تنبيهات الطقس",
        temperature: "درجة الحرارة",
        forecast: "توقعات 7 أيام",
        alerts: "تنبيهات الطقس",
        suggestions: "اقتراحات"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

