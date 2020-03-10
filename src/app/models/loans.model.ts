export class loansModel {

    constructor(
       public dateLoan: string,
       public amount: Number,
       public rateInterest: number,
       public statusLoan: Boolean,
       public finishedDatePayment: String ,
       public idUser: string
    ){}

}