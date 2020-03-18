export class PaymentModel {
    constructor(
        public dateDeposit: String,
        public amount: String,
        public interest: Number,
        public nextDatePayment: String,
        public balanceLoand: Number,
        public statusDeposit: String,
        public idLoan: String
    ){}

}