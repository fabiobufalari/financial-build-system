// Configuração de internacionalização completa
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Traduções para todos os idiomas
const resources = {
  en: {
    translation: {
      // Login
      login: {
        title: "Financial Recovery System",
        subtitle: "Habermatt Construction",
        username: "Username",
        usernamePlaceholder: "Enter your username",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        signIn: "Sign In",
        signingIn: "Signing in...",
        selectLanguage: "Select Language",
        success: "Login successful!",
        footer: "All rights reserved.",
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
      // Menu Lateral
      menu: {
        dashboard: "Dashboard",
        auth: "Authentication",
        company: "Company",
        employees: "Employees & Costs",
        suppliers: "Suppliers",
        cashFlow: "Cash Flow",
        accountsPayable: "Accounts Payable",
        accountsReceivable: "Accounts Receivable",
        materials: "Building Materials",
        reports: "Financial Reports",
        analytics: "Data Analytics",
        advanced: "Advanced Financial",
        integrations: "Integrations",
        logout: "Logout"
      },
      // Dashboard
      dashboard: {
        welcome: "Welcome",
        activeProjects: "Active Projects",
        totalRevenue: "Total Revenue",
        cashFlow: "Cash Flow",
        pendingPayments: "Pending Payments",
        weatherAlerts: "Weather Alerts",
        newProject: "New Project",
        sendPhotos: "Send Photos",
        manageTeams: "Manage Teams",
        registerExpenses: "Register Expenses"
      },
      // Clima
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
      // Login
      login: {
        title: "Sistema de Recuperação Financeira",
        subtitle: "Habermatt Construction",
        username: "Usuário",
        usernamePlaceholder: "Digite seu usuário",
        password: "Senha",
        passwordPlaceholder: "Digite sua senha",
        signIn: "Entrar",
        signingIn: "Entrando...",
        selectLanguage: "Selecionar Idioma",
        success: "Login realizado com sucesso!",
        footer: "Todos os direitos reservados.",
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
      // Menu Lateral
      menu: {
        dashboard: "Dashboard",
        auth: "Autenticação",
        company: "Empresa",
        employees: "Funcionários e Custos",
        suppliers: "Fornecedores",
        cashFlow: "Fluxo de Caixa",
        accountsPayable: "Contas a Pagar",
        accountsReceivable: "Contas a Receber",
        materials: "Materiais de Construção",
        reports: "Relatórios Financeiros",
        analytics: "Análise de Dados",
        advanced: "Financeiro Avançado",
        integrations: "Integrações",
        logout: "Sair"
      },
      // Dashboard
      dashboard: {
        welcome: "Bem-vindo",
        activeProjects: "Projetos Ativos",
        totalRevenue: "Receita Total",
        cashFlow: "Fluxo de Caixa",
        pendingPayments: "Pagamentos Pendentes",
        weatherAlerts: "Alertas de Clima",
        newProject: "Novo Projeto",
        sendPhotos: "Enviar Fotos",
        manageTeams: "Gerenciar Equipes",
        registerExpenses: "Registrar Despesas"
      },
      // Clima
      weather: {
        title: "Alertas de Clima",
        temperature: "Temperatura",
        forecast: "Previsão 7 dias",
        alerts: "Alertas Meteorológicos",
        suggestions: "Sugestões"
      }
    }
  },
  hi: {
    translation: {
      // Login
      login: {
        title: "वित्तीय रिकवरी सिस्टम",
        subtitle: "हैबरमैट कंस्ट्रक्शन",
        username: "उपयोगकर्ता नाम",
        password: "पासवर्ड",
        loginButton: "साइन इन",
        selectLanguage: "भाषा चुनें",
        loading: "साइन इन हो रहा है...",
        error: "अमान्य क्रेडेंशियल"
      },
      // Menu Lateral
      menu: {
        dashboard: "डैशबोर्ड",
        auth: "प्रमाणीकरण",
        company: "कंपनी",
        employees: "कर्मचारी और लागत",
        suppliers: "आपूर्तिकर्ता",
        cashFlow: "नकदी प्रवाह",
        accountsPayable: "देय खाते",
        accountsReceivable: "प्राप्य खाते",
        materials: "निर्माण सामग्री",
        reports: "वित्तीय रिपोर्ट",
        analytics: "डेटा एनालिटिक्स",
        advanced: "उन्नत वित्तीय",
        integrations: "एकीकरण",
        logout: "लॉग आउट"
      },
      // Dashboard
      dashboard: {
        welcome: "स्वागत",
        activeProjects: "सक्रिय परियोजनाएं",
        totalRevenue: "कुल राजस्व",
        cashFlow: "नकदी प्रवाह",
        pendingPayments: "लंबित भुगतान",
        weatherAlerts: "मौसम अलर्ट",
        newProject: "नई परियोजना",
        sendPhotos: "फोटो भेजें",
        manageTeams: "टीमों का प्रबंधन",
        registerExpenses: "खर्च दर्ज करें"
      },
      // Clima
      weather: {
        title: "मौसम अलर्ट",
        temperature: "तापमान",
        forecast: "7-दिन का पूर्वानुमान",
        alerts: "मौसम अलर्ट",
        suggestions: "सुझाव"
      }
    }
  },
  zh: {
    translation: {
      // Login
      login: {
        title: "财务恢复系统",
        subtitle: "哈伯马特建筑",
        username: "用户名",
        password: "密码",
        loginButton: "登录",
        selectLanguage: "选择语言",
        loading: "登录中...",
        error: "凭据无效"
      },
      // Menu Lateral
      menu: {
        dashboard: "仪表板",
        auth: "身份验证",
        company: "公司",
        employees: "员工和成本",
        suppliers: "供应商",
        cashFlow: "现金流",
        accountsPayable: "应付账款",
        accountsReceivable: "应收账款",
        materials: "建筑材料",
        reports: "财务报告",
        analytics: "数据分析",
        advanced: "高级财务",
        integrations: "集成",
        logout: "登出"
      },
      // Dashboard
      dashboard: {
        welcome: "欢迎",
        activeProjects: "活跃项目",
        totalRevenue: "总收入",
        cashFlow: "现金流",
        pendingPayments: "待付款项",
        weatherAlerts: "天气警报",
        newProject: "新项目",
        sendPhotos: "发送照片",
        manageTeams: "管理团队",
        registerExpenses: "登记费用"
      },
      // Clima
      weather: {
        title: "天气警报",
        temperature: "温度",
        forecast: "7天预报",
        alerts: "天气警报",
        suggestions: "建议"
      }
    }
  }
}

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
  })

export default i18n

