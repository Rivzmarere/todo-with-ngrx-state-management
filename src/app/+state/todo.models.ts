export class TodoEntity {

  constructor(value: Object = {}){
  Object.assign(this, value)
  }

  id: number;
  name: string;
  description : string;
}
