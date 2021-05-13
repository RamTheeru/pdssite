import { Employee } from './employee';

export class Pdsemployee extends Employee {
  ReportingManager: string;
  ReportingManagerEmpCode: string;
  IsLwfApplicable: Boolean;
  IsPfOption: Boolean;
  PfFundName: string;
  PfMembershipNumber: string;
  PfDOJFund: string;
  UAN: string;
  IsEsicApplicable: Boolean;
  ESICFundId: string;
  ESICMemberShipNumber: string;
  ESICDOJFund: string;
  EmployeeCategory: string;
  ShiftDetails: string;
  LeavePolicy: string;

  AttendancePolicy: string;
  OverTimeLogic: string;
  OverTimeLogicPayout: string;
  LateInEarlyOut: string;
  WeeklyOff: string;
  DayOff: string;
  HolidayList: string;

  AttendanceCycle: string;
  ApprovalHierarchy: string;
  ClosingLeaveBalances: string;
  DAPeopleSoftId: string;
  PSC: string;
  FromDate: string;
  ToDate: string;
  EmployeeStatus: string;
  ICPaymentMethod: string;
  PaymentPerUnit: string;
  PayFrequency: string;
  RegularPayRateDesc: string;
  BlockARate: string;
  BlockBRate: string;
  PackagesDelivered: string;
  ApplicablePayRate: string;
}
