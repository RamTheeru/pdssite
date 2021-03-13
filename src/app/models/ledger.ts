import { Voucher } from "../models/voucher";
export class Ledger extends Voucher {
  Id: number;
  Particulars: string;
  Credit: number;
  Debit: number;
  Balance: number;
  Status: string;
  Cred_Date:string;
  VStatus: Boolean;
  CreditDate:string;
  Remarks:string;
  IsActive:boolean;
  CheckVal: Boolean = false;
  credit: any;
  debit: any;
  balance:any;

}
