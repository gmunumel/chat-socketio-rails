export class User {
  constructor(public name = '', public email = '') { }
  clone() { return new User(this.name, this.email); }
}
