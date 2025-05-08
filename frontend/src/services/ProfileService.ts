import ApiService from "./ApiService";

export const apiProfile = async () => {
  return ApiService.fetchData({
    url: "/profile/profile",
    method: "get",
  });
};

export const createProfile = async (data: any) => {
  return ApiService.fetchData({
    url: "/profile/create-profile",
    method: "post",
    data,
  });
};

export const updateProfile = async (data: any) => {
  return ApiService.fetchData({
    url: "/profile/update-profile",
    method: "patch",
    data,
  });
};
