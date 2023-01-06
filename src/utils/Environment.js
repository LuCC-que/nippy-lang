class Environment {
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
    this.id = parent ? parent.id + 1 : 0;
  }
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  //update the value

  // assign(name, value) {
  //   this.resolve(name).record[name] = value;
  //   return value;
  // }

  //
  lookup(name) {
    return this.resolve(name).record[name];
  }

  resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      //return this env if it contains such a property
      return this;
    }

    if (this.parent == null) {
      throw new ReferenceError(`Variable not find ${name}`);
    }

    return this.parent.resolve(name);
  }
}

module.exports = { Environment };
