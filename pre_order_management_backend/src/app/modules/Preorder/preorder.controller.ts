import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { PreorderService } from "./preorder.service";
import pick from "../../../shared/pick";
import { preorderFilterableFields } from "./preorder.constant";

const createPreorder = catchAsync(async (req: Request, res: Response) => {
  const result = await PreorderService.createPreorder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Preorder created successfully",
    data: result,
  });
});

const getAllPreorders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, preorderFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await PreorderService.getAllPreorders(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Preorders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePreorder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PreorderService.getSinglePreorder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Preorder retrieved successfully",
    data: result,
  });
});

const updatePreorder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PreorderService.updatePreorder(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Preorder updated successfully",
    data: result,
  });
});

const toggleStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PreorderService.toggleStatus(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Preorder status updated successfully",
    data: result,
  });
});

const deletePreorder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PreorderService.deletePreorder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Preorder deleted successfully",
    data: result,
  });
});

export const PreorderController = {
  createPreorder,
  getAllPreorders,
  getSinglePreorder,
  updatePreorder,
  toggleStatus,
  deletePreorder,
};
