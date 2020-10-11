export class loansModel {

    constructor(
       public dateLoan: string,
       public amount: string,
       public rateInterest: number,
       public statusLoan: Boolean,
       public finishedDatePayment: String ,
       public idUser: string,
       public description: String
    ){}

}
