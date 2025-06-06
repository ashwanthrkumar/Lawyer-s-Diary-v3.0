export interface Case {
  id?: string;
  lawyerId: string;
  clientId: string;
  title: string;
  court: string;
  judge: string;
  caseType: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  hearingDate: string;
}
