import { ProductModel } from "../models/product.model.js";

const buildFilter = (queryObj) => {
    if(!queryObj) return {};
    const filter = {};
    if(queryObj.category) filter.category = queryObj.category;
  // available can come as 'true' or 'false'
    if(typeof queryObj.available !== "undefined") filter.status = queryObj.available === "true" || queryObj.available === true;
    return filter;
};

export const ProductService = {
    async getPaginated({ limit = 10, page = 1, sort, query }) {
    const options = { page: Number(page), limit: Number(limit), lean: true };
    if(sort === "asc") options.sort = { price: 1 };
    if(sort === "desc") options.sort = { price: -1 };

    const filter = buildFilter(query);
    return ProductModel.paginate(filter, options);
    },

    async getById(id) {
    return ProductModel.findById(id).lean();
    },

    async create(payload) {
    return ProductModel.create(payload);
    },

    async update(id, update) {
    return ProductModel.findByIdAndUpdate(id, update, { new: true }).lean();
    },

    async delete(id) {
    return ProductModel.findByIdAndDelete(id);
    }
};
