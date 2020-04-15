export class InterestModel {
  constructor(
      public _id: String,
      public dayPayment: String,
      public interestPending: String,
      public state: Boolean,
      public idPayment: String
  ){}

}
