// Dados expandidos para o mapa de projetos
// Expanded data for project map
export const mockProjectMapData = [
  {
    id: 1,
    name: 'Residencial Maple Heights',
    status: 'active',
    progress: 75,
    coordinates: [43.651070, -79.347015] as [number, number],
    client: {
      name: 'Incorporadora Maple Inc.',
      contact: 'John Maple',
      phone: '+1 (416) 555-1234',
      email: 'john@mapleinc.com'
    },
    assignedEmployees: [1, 3],
    address: '123 Maple Street, Toronto, ON'
  },
  {
    id: 2,
    name: 'Centro Comercial Downtown',
    status: 'negotiation',
    progress: 0,
    coordinates: [43.645470, -79.380925] as [number, number],
    client: {
      name: 'Downtown Investments Ltd.',
      contact: 'Sarah Johnson',
      phone: '+1 (416) 555-5678',
      email: 'sarah@downtowninv.com'
    },
    requirements: ['Aprovação da prefeitura', 'Financiamento final', 'Assinatura do contrato'],
    address: '456 Queen Street, Toronto, ON'
  },
  {
    id: 3,
    name: 'Reforma Hospital Central',
    status: 'paused',
    progress: 45,
    coordinates: [43.658730, -79.397415] as [number, number],
    client: {
      name: 'Central Healthcare',
      contact: 'Dr. Michael Brown',
      phone: '+1 (416) 555-9012',
      email: 'mbrown@centralhealthcare.org'
    },
    pendingIssues: ['Aguardando aprovação regulatória', 'Problema estrutural identificado', 'Revisão orçamentária'],
    address: '789 University Avenue, Toronto, ON'
  },
  {
    id: 4,
    name: 'Condomínio Riverside',
    status: 'active',
    progress: 60,
    coordinates: [43.644270, -79.402360] as [number, number],
    client: {
      name: 'Riverside Development Corp.',
      contact: 'Amanda Rivers',
      phone: '+1 (416) 555-3456',
      email: 'amanda@riversidedev.com'
    },
    assignedEmployees: [2],
    address: '321 King Street West, Toronto, ON'
  },
  {
    id: 5,
    name: 'Complexo Esportivo Eastside',
    status: 'paused',
    progress: 30,
    coordinates: [43.671580, -79.358050] as [number, number],
    client: {
      name: 'Município de Toronto',
      contact: 'Robert Parks',
      phone: '+1 (416) 555-7890',
      email: 'rparks@toronto.gov'
    },
    pendingIssues: ['Atraso na entrega de materiais', 'Renegociação de contrato'],
    address: '555 Eastern Avenue, Toronto, ON'
  },
  {
    id: 6,
    name: 'Torre Corporativa Skyview',
    status: 'negotiation',
    progress: 0,
    coordinates: [43.647980, -79.389670] as [number, number],
    client: {
      name: 'Skyview Enterprises',
      contact: 'Victoria Sky',
      phone: '+1 (416) 555-2345',
      email: 'victoria@skyviewent.com'
    },
    requirements: ['Estudo de impacto ambiental', 'Aprovação do conselho', 'Definição final do design'],
    address: '888 Bay Street, Toronto, ON'
  }
];
