"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import {
  type Group,
  type GroupDetails,
  type CreateGroupDTO,
  type UpdateGroupDTO,
  type GroupStudentPaymentInfo,
  type GroupStudentPaymentDetail,
  GroupQueryParams,
  GroupStudent,
} from "../types";
import { type ApiResponse } from "@/types";

export async function getGroups(
  params: GroupQueryParams,
): Promise<ApiResponse<Group[]>> {
  return serverApiClient<Group[]>({
    url: "/groups",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function getGroup(id: string): Promise<ApiResponse<GroupDetails>> {
  return serverApiClient<GroupDetails>({
    url: `/groups/${id}`,
    method: "GET",
    cache: "no-store",
  });
}

export async function createGroupAction(
  data: CreateGroupDTO,
): Promise<ApiResponse<GroupDetails>> {
  return serverApiClient<GroupDetails>({
    url: "/groups",
    method: "POST",
    body: data,
  });
}

export async function updateGroupAction(
  id: string,
  data: UpdateGroupDTO,
): Promise<ApiResponse<GroupDetails>> {
  return serverApiClient<GroupDetails>({
    url: `/groups/${id}`,
    method: "PATCH",
    body: data,
  });
}

export async function deleteGroupAction(
  id: string,
): Promise<ApiResponse<void>> {
  return serverApiClient<void>({
    url: `/groups/${id}`,
    method: "DELETE",
  });
}

export async function toggleGroupStatusAction(
  id: string,
): Promise<ApiResponse<Group>> {
  return serverApiClient<Group>({
    url: `/groups/${id}/toggle-status`,
    method: "PATCH",
  });
}

export async function getAvailableStudentsForGroup(
  groupId: string,
  params: GroupQueryParams,
): Promise<ApiResponse<GroupStudent[]>> {
  return serverApiClient<GroupStudent[]>({
    url: `/groups/${groupId}/available-students`,
    method: "GET",
    params,
  });
}

export async function getGroupStudents(
  groupId: string,
  params: GroupQueryParams,
): Promise<ApiResponse<GroupStudent[]>> {
  return serverApiClient<GroupStudent[]>({
    url: `/groups/${groupId}/students`,
    method: "GET",
    params,
  });
}

export async function addStudentsToGroupAction(
  id: string,
  studentIds: string[],
  subscriptionStartDate?: string,
): Promise<ApiResponse<GroupDetails>> {
  return serverApiClient<GroupDetails>({
    url: `/groups/${id}/students`,
    method: "POST",
    body: {
      studentIds,
      ...(subscriptionStartDate ? { subscriptionStartDate } : {}),
    },
  });
}

export async function removeStudentsFromGroupAction(
  id: string,
  studentIds: string[],
): Promise<ApiResponse<GroupDetails>> {
  return serverApiClient<GroupDetails>({
    url: `/groups/${id}/students`,
    method: "DELETE",
    body: { studentIds },
  });
}

export async function getGroupPaymentsAction(
  groupId: string,
): Promise<ApiResponse<GroupStudentPaymentInfo[]>> {
  return serverApiClient<GroupStudentPaymentInfo[]>({
    url: `/groups/${groupId}/payments`,
    method: "GET",
    cache: "no-store",
  });
}

export async function payGroupStudentMonthAction(
  groupStudentId: string,
  subscriptionDate: string,
  notes?: string,
): Promise<ApiResponse<GroupStudentPaymentDetail>> {
  return serverApiClient<GroupStudentPaymentDetail>({
    url: `/group-students/${groupStudentId}/payments`,
    method: "POST",
    body: {
      subscriptionDate,
      ...(notes ? { notes } : {}),
    },
  });
}
