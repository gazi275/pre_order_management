import { Preorder, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { preorderSearchableFields } from "./preorder.constant";

const createPreorder = async (data: any): Promise<Preorder> => {
  const payload = {
    ...data,
    startsAt: new Date(data.startsAt),
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
  };
  const result = await prisma.preorder.create({
    data: payload,
  });
  return result;
};

const getAllPreorders = async (
  filters: any,
  options: any
) => {
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

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSinglePreorder = async (id: string): Promise<Preorder | null> => {
  const result = await prisma.preorder.findUnique({
    where: {
      id,
    },
  });
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
  return result;
};

const deletePreorder = async (id: string): Promise<Preorder | null> => {
  const result = await prisma.preorder.delete({
    where: {
      id,
    },
  });
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
