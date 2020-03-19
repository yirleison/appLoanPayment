export class PaymentModel {
    constructor(
        public _id: String,
        public dateDeposit: String,
        public amount: String,
        public interest: String,
        public nextDatePayment: String,
        public balanceLoand: String,
        public statusDeposit: String,
        public idLoan: String
    ){}

}