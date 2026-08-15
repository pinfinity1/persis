"use server";

import {
  getProductsService,
  GetProductsParams,
} from "@/services/product.service";

export async function fetchMoreProductsAction(params: GetProductsParams) {
  return await getProductsService(params);
}
