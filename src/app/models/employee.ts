import { RegisterEmployee } from "../models/registeremployee";
import { DeliveryDetails } from "../models/deliverydetails";
export class Employee extends RegisterEmployee {
  Guard_FullName: string;

  PANStatus: Boolean;
  DLLRStatus: string = "";
  DLLRNumber: string = "";
  VehicleNumber: string = "";
  BankAccountNumber: string = "";
  BankName: string = "";
  BranchName: string = "";
  IFSCCode: string = "";
  DeliveryDetails: DeliveryDetails;
}
