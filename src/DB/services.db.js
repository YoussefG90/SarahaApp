export const findOne = async ({model , filter = {} , select ="" , populate=[]} = {}) => {
    return await model.findOne(filter).select(select).populate(populate)};

export const create = async ({model , data = [{}] , options = {}}) => {
    return await model.create(data , options)};

export const findAll = async ({ model, filter = {}, select = "", populate = [], sort = {}, limit = 0, skip = 0 } = {}) =>
  await model.find(filter).select(select).populate(populate).sort(sort).limit(limit).skip(skip);

export const findById = async ({ model, id, select = "", populate = [] } = {}) =>
  await model.findById(id).select(select).populate(populate);

export const updateOne = async ({ model, filter = {}, data = {}, options = {} }) =>
  await model.updateOne(filter, {...data , $inc:{__v:1}}, options);

export const findByIdAndUpdate = async ({ model, id, data = {}, options = { new: true } }) =>
  await model.findByIdAndUpdate(id, {...data , $inc:{__v:1}}, options);

export const findOneAndUpdate = async ({ model, filter = {}, data = {}, options = { new: true } }) =>
  await model.findOneAndUpdate(filter, { ...data, $inc: { __v: 1 } }, options);

export const deleteOne = async ({ model, filter = {} }) =>
  await model.deleteOne(filter);

export const deleteMany = async ({ model, filter = {} }) =>
  await model.deleteMany(filter);

export const findByIdAndDelete = async ({ model, id }) =>
  await model.findByIdAndDelete(id);