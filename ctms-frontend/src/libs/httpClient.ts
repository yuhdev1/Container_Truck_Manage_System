import axios from "axios";
import Constant from "./constant";
import { Cookies } from "react-cookie";
import { RefreshTokenResponse } from "../model/auth";
import toast from "react-hot-toast";
const cookies = new Cookies();

export const httpClient = axios.create({
  baseURL: Constant.BACK_END_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axiosAuth = axios.create({
  baseURL: Constant.BACK_END_URL,
});
