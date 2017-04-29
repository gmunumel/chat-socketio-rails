export class User {
  constructor(public id = 0, public name = '', public email = '') { }
  clone() { return new User(this.id, this.name, this.email); }
}
