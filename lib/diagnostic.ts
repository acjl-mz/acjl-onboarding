export type DiagnosticData={responsible:{fullName:string;role:string;phone:string;email:string;preferredChannel:string};company:{legalName:string;tradeName:string;nuit:string;organizationType:string;sector:string;mainActivity:string;activityDescription:string;incorporationYear:string;activityStartYear:string;location:string;establishments:string;employeeRange:string;activityVolume:string};model:"AVENCA"|"PONTUAL"|"";services:string[];tasks:Record<string,string[]>;taskDetails:string;operations:{routines:string;processes:string;collection:string;treatment:string;management:string};situation:{provider:string;providerScope:string;motivation:string;pending:string};objectives:{main:string;recommendation:boolean}};
export const initialDiagnostic:DiagnosticData={responsible:{fullName:"",role:"",phone:"",email:"",preferredChannel:""},company:{legalName:"",tradeName:"",nuit:"",organizationType:"",sector:"",mainActivity:"",activityDescription:"",incorporationYear:"",activityStartYear:"",location:"",establishments:"",employeeRange:"",activityVolume:""},model:"",services:[],tasks:{},taskDetails:"",operations:{routines:"",processes:"",collection:"",treatment:"",management:""},situation:{provider:"",providerScope:"",motivation:"",pending:""},objectives:{main:"",recommendation:false}};
export function readDiagnostic():DiagnosticData{
  if(typeof window==="undefined") return initialDiagnostic;
  try{
    const raw=JSON.parse(localStorage.getItem("acjl-diagnostic")||"null");
    if(!raw||typeof raw!=="object") return initialDiagnostic;
    return {
      ...initialDiagnostic,
      ...raw,
      responsible:{...initialDiagnostic.responsible,...(raw.responsible||{})},
      company:{...initialDiagnostic.company,...(raw.company||{})},
      services:Array.isArray(raw.services)?raw.services:[],
      tasks:raw.tasks&&typeof raw.tasks==="object"?raw.tasks:{},
      operations:{...initialDiagnostic.operations,...(raw.operations||{})},
      situation:{...initialDiagnostic.situation,...(raw.situation||{})},
      objectives:{...initialDiagnostic.objectives,...(raw.objectives||{})}
    };
  }catch{return initialDiagnostic}
}
export function saveDiagnostic(data:DiagnosticData){
  localStorage.setItem("acjl-diagnostic",JSON.stringify(data))
}

export const serviceTasks:Record<string,string[]>={
"Gestão Fiscal e de Impostos":["Apuramento de impostos","Preenchimento e submissão de declarações/guias","Regularização de pendências fiscais","Análise da situação fiscal","Revisão da situação tributária","Apoio em inspecção, notificação ou procedimento da AT","Pedido de reembolso de IVA","Regularização de obrigações fiscais em atraso"],
"Contabilidade":["Organização de documentos e registos","Lançamentos contabilísticos","Reconciliações bancárias","Fecho de contas","Preparação de demonstrações financeiras","Regularização contabilística","Preparação de processo de contas","Relatórios financeiros / de gestão","Recuperação de contabilidade em atraso"],
"Processamento de Salários":["Processamento mensal de salários","Regularização de processamento salarial","Processamento de salários em atraso","Estruturação do processo de salários","Cálculo e controlo de INSS e IRPS","Mapas e relatórios de salários","Apoio numa situação específica de colaboradores"],
"Assistência Administrativa":["Organização administrativa","Organização e arquivo de documentos","Preparação e controlo de documentos administrativos","Apoio em processos administrativos","Estruturação de rotinas administrativas","Apoio à organização de processos internos","Secretariado administrativo / back-office"],
"Auditorias":["Auditoria interna","Auditoria externa","Auditoria financeira","Auditoria fiscal","Auditoria de processos","Revisão de controlo interno","Revisão de procedimentos e conformidade","Procedimentos acordados / verificação específica","Apoio a auditoria de terceiros"],
"Treinamentos":["Formação de equipas","Treinamento em gestão financeira","Treinamento em obrigações fiscais","Treinamento em contabilidade","Treinamento em processamento de salários","Treinamento em procedimentos administrativos","Formação à medida para a empresa"],
"Serviços Especializados / Outros":["Diagnóstico empresarial específico","Estruturação ou melhoria de processos","Consultoria financeira","Consultoria fiscal específica","Outro serviço não listado"]};
export const serviceDescriptions:Record<string,string>={
"Gestão Fiscal e de Impostos":"Acompanhamento contínuo das obrigações fiscais, prazos, apuramentos, declarações e situações que exigem atenção.",
"Contabilidade":"Acompanhamento contabilístico, organização dos registos, fecho de períodos e produção de informação útil à gestão.",
"Processamento de Salários":"Processamento e apoio à organização do ciclo salarial, incluindo os controlos e obrigações associadas.",
"Assistência Administrativa":"Apoio recorrente à organização documental, rotinas e processos administrativos da empresa.",
"Auditorias":"Trabalhos específicos de auditoria, revisão, controlo e verificação, conforme o objectivo definido.",
"Treinamentos":"Capacitação prática de equipas em temas relevantes para a gestão e operação da empresa.",
"Serviços Especializados / Outros":"Atendimento de necessidades específicas que exigem definição própria de escopo."};