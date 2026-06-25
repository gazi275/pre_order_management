import { Preorder, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { preorderSearchableFields } from "./preorder.constant";
import { PreorderCache } from "./preorder.redis";

const createPreorder = async (data: any): Promise<Preorder> => {
  const payload = {
    ...data,
    startsAt: new Date(data.startsAt),
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
  };
  const result = await prisma.preorder.create({
    data: payload,
  });

  // Invalidate all list caches since a new entry affects pagination/filters
  await PreorderCache.invalidateOnMutation();

  return result;
};

const getAllPreorders = async (
  filters: any,
  options: any
) => {
  // Build a deterministic cache key from the query parameters
  const cacheKey = PreorderCache.buildListKey(filters, options);

  // Try cache first
  const cached = await PreorderCache.getCachedList(cacheKey);
  if (cached) {
    return cached;
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: preorderSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PreorderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.preorder.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.preorder.count({
    where: whereConditions,
  });

  const response = {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };

  // Cache the response
  await PreorderCache.setCachedList(cacheKey, response);

  return response;
};

const getSinglePreorder = async (id: string): Promise<Preorder | null> => {
  // Try cache first
  const cached = await PreorderCache.getCachedSingle(id);
  if (cached) {
    return cached;
  }

  const result = await prisma.preorder.findUnique({
    where: {
      id,
    },
  });

  // Cache the result if found
  if (result) {
    await PreorderCache.setCachedSingle(id, result);
  }

  return result;
};

const updatePreorder = async (
  id: string,
  payload: any
): Promise<Preorder | null> => {
  const updateData = { ...payload };
  if (updateData.startsAt) {
    updateData.startsAt = new Date(updateData.startsAt);
  }
  if (updateData.endsAt !== undefined) {
    updateData.endsAt = updateData.endsAt ? new Date(updateData.endsAt) : null;
  }

  const result = await prisma.preorder.update({
    where: {
      id,
    },
    data: updateData,
  });

  // Invalidate this preorder's cache + all list caches
  await PreorderCache.invalidateOnMutation(id);

  return result;
};

const toggleStatus = async (id: string): Promise<Preorder | null> => {
  const current = await prisma.preorder.findUnique({
    where: { id },
  });
  if (!current) {
    throw new Error("Preorder not found");
  }
  const newStatus = current.status === "active" ? "inactive" : "active";
  const result = await prisma.preorder.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });

  // Invalidate this preorder's cache + all list caches
  await PreorderCache.invalidateOnMutation(id);

  return result;
};

const deletePreorder = async (id: string): Promise<Preorder | null> => {
  const result = await prisma.preorder.delete({
    where: {
      id,
    },
  });

  // Invalidate this preorder's cache + all list caches
  await PreorderCache.invalidateOnMutation(id);

  return result;
};

export const PreorderService = {
  createPreorder,
  getAllPreorders,
  getSinglePreorder,
  updatePreorder,
  toggleStatus,
  deletePreorder,
};
