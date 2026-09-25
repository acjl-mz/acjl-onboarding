export type DiagnosticData = {
  responsible:{fullName:string;role:string;phone:string;email:string;preferredChannel:string};
  company:{legalName:string;tradeName:string;nuit:string;organizationType:string;sector:string;mainActivity:string;activityDescription:string;incorporationYear:string;activityStartYear:string;location:string;establishments:string;employeeRange:string;activityVolume:string};
  model:"AVENCA"|"PONTUAL"|"";
  services:string[];
  tasks:Record<string,string[]>;
  taskDetails:string;
  situation:{provider:string;providerScope:string;motivation:string;pending:string};
  objectives:{main:string;recommendation:boolean};
};
export const initialDiagnostic:DiagnosticData={responsible:{fullName:"",role:"",phone:"",email:"",preferredChannel:""},company:{legalName:"",tradeName:"",nuit:"",organizationType:"",sector:"",mainActivity:"",activityDescription:"",incorporationYear:"",activityStartYear:"",location:"",establishments:"",employeeRange:"",activityVolume:""},model:"",services:[],tasks:{},taskDetails:"",situation:{provider:"",providerScope:"",motivation:"",pending:""},objectives:{main:"",recommendation:false}};
export function readDiagnostic():DiagnosticData{if(typeof window==="undefined")return initialDiagnostic;try{return JSON.parse(localStorage.getItem("acjl-diagnostic")||"null")||initialDiagnostic}catch{return initialDiagnostic}}
export function saveDiagnostic(data:DiagnosticData){localStorage.setItem("acjl-diagnostic",JSON.stringify(data))}
export function clearDiagnostic(){localStorage.removeItem("acjl-diagnostic")}
export const serviceTasks:Record<string,string[]>={
"Gestão Fiscal e de Impostos":["Apuramento de impostos","Preenchimento e submissão de declarações/guias","Regularização de pendências fiscais","Análise da situação fiscal","Apoio numa questão fiscal específica"],
"Contabilidade":["Organização de documentos e registos","Lançamentos contabilísticos","Reconciliações","Regularização contabilística","Preparação de informação contabilística"],
"Processamento de Salários":["Processamento mensal de salários","Regularização de processamento salarial","Estruturação do processo de salários","Apoio numa situação específica de colaboradores"],
"Assistência Administrativa":["Organização administrativa","Preparação e organização de documentos","Apoio em processos administrativos","Estruturação de rotinas administrativas"],
"Auditorias":["Auditoria/diagnóstico de processos","Verificação de registos financeiros","Auditoria fiscal","Revisão de procedimentos e controlos"],
"Treinamentos":["Formação de equipas","Treinamento em gestão financeira","Treinamento em obrigações fiscais","Treinamento em procedimentos administrativos"],
"Serviços Especializados / Outros":["Pedido específico não enquadrado nas opções anteriores"]};
export const serviceDescriptions:Record<string,string>={
"Gestão Fiscal e de Impostos":"Apoio contínuo na gestão, acompanhamento e organização das obrigações fiscais.",
"Contabilidade":"Organização e acompanhamento da informação contabilística da empresa.",
"Processamento de Salários":"Processamento e apoio à gestão administrativa dos salários e colaboradores.",
"Assistência Administrativa":"Apoio na organização e execução de processos administrativos.",
"Auditorias":"Análise e verificação de processos, registos e situações específicas.",
"Treinamentos":"Capacitação de equipas em temas de gestão, fiscalidade e procedimentos.",
"Serviços Especializados / Outros":"Atendimento de necessidades específicas que exigem análise própria."};