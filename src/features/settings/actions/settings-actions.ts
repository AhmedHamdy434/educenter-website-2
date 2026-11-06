"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type ApiResponse } from "@/types";
import { CenterSettings, UpdateCenterSettingsDTO } from "../types";

export async function getCenterSettingsAction(): Promise<ApiResponse<CenterSettings>> {
  return serverApiClient<CenterSettings>({
    url: "/owner/settings",
    method: "GET",
    cache: "no-store",
  });
}

export async function updateCenterSettingsAction(
  data: UpdateCenterSettingsDTO,
): Promise<ApiResponse<CenterSettings>> {
  return serverApiClient<CenterSettings>({
    url: "/owner/settings",
    method: "PATCH",
    body: data,
  });
}

