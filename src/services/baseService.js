class Service {
  constructor(model) {
    this.model = model;
  }

  deleteOne(query) {
    return this.model.deleteOne(query);
  }

  deleteMany(query) {
    return this.model.deleteMany(query);
  }

  find(query, projection) {
    return this.model.find(query, projection);
  }

  findOne(query, projection) {
    return this.model.findOne(query, projection);
  }

  create(data) {
    return this.model.create(data);
  }

  findOneById(id) {
    return this.model.findOne({ _id: id });
  }

  findOneByIdAndUpdate(id, body, options) {
    return this.model.findOneAndUpdate({ _id: id }, { $set: body }, options);
  }

  updateMany(criteria, updateData, options) {
    return this.model.updateMany(criteria, updateData, options);
  }
}

module.exports = Service;
