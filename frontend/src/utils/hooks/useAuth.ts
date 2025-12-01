import { apiBcToken, apiSignIn, apiSignUp } from "@/services/AuthService";
import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
  verificationRequired,
  bcTokenSuccess,
} from "@/store";
import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import type {
  JWTPayload,
  SignInCredential,
  SignUpCredential,
} from "@/@types/auth";
import { jwtDecode } from "jwt-decode";
import { AccountInfo } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

type Status = "success" | "failed";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { lowercaseOrganizationEmail } from "../validations";

function useAuth() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { instance } = useMsal();

  const { signature, signedIn, verified, appToken } = useAppSelector(
    (state) => state.auth.session
  );

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status;
        message: string;
      }
    | undefined
  > => {
    try {
      const resp = await apiSignIn(values);
      if (resp.data) {
        const { signature } = resp.data;
        console.log(resp.data);
        const { verified } = await jwtDecode<JWTPayload>(signature);

        if (verified == true) {
          await dispatch(
            signInSuccess({
              signature,
              verified,
              signedIn: true,
            })
          );
          const bcTokenResponse = await apiBcToken();
          const { access_token } = bcTokenResponse.data;

          const bcToken = access_token;
          dispatch(
            signInSuccess({
              signature,
              verified,
              appToken: bcToken,
              signedIn: true,
              companyId: resp.data.companyId,
            })
          );
          console.log({
            signature,
            verified,
            appToken: bcToken,
            signedIn: true,
            companyId: resp.data.companyId,
          });
          dispatch(bcTokenSuccess(bcToken));

          if (resp.data.signature) {
            dispatch(
              setUser({
                email: resp.data.email,
                fullName: resp.data.fullName,
              })
            );
          }
          const redirectUrl = query.get(REDIRECT_URL_KEY);
          navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
          );
          console.log(redirectUrl);
          console.log(appConfig.authenticatedEntryPath);
          return {
            status: "success",
            message: "",
          };
        }
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      if (errors?.response?.data?.message == "User not verified") {
        dispatch(verificationRequired(errors?.response?.data?.signature));
      }

      return {
        status: "failed",
        // message: errors?.response?.data?.message || errors.toString(),
        message: getErrorMessage(errors),
      };
    }
  };

  const getErrorMessage = (error: any): string => {
    console.log(error);
    if (!error) return 'An unknown error occurred';
    
    // Handle axios error response
    if (error.response?.data) {
      const { data } = error.response;
      
      // If data.message is a string, return it
      if (typeof data.message === 'string') {
        return data.message;
      }
      
      // If data.message is an object, try to extract meaningful info
      if (typeof data.message === 'object') {
        return Object.values(data.message).join(', ');
      }
      
      // If data itself contains the error message
      if (typeof data === 'string') {
        return data;
      }
    }
    
    // Handle error object with message property
    if (error.message) {
      return error.message;
    }
    
    // If error is a string, return it
    if (typeof error === 'string') {
      return error;
    }
    
    // Fallback
    return 'An unexpected error occurred';
  };
  
  const getAzureTokenAndAccount = async (): Promise<{
    token: string | undefined;
    account: AccountInfo | null;
  }> => {
    const request = {
      scopes: ["https://api.businesscentral.dynamics.com/.default"],
      extraScopesToConsent: [
        "user.read",
        "openid",
        "profile",
        "offline_access",
      ],
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      return { token: response.accessToken, account: response.account };
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await instance.acquireTokenPopup(request);
        return { token: response.accessToken, account: response.account };
      } else {
        return { token: undefined, account: null };
      }
    }
  };
  const signInWithAzure = async () => {
    try {
      const { token, account } = await getAzureTokenAndAccount();
      if (token && account) {
        const bcTokenResponse = await apiBcToken();
        const { access_token } = bcTokenResponse.data;
        if (access_token) {
          dispatch(signInSuccess({
            signature: token,
            verified: true,
            signedIn: true,
            appToken: access_token,
            companyId: null,
          }));
          dispatch(bcTokenSuccess(access_token));
          const userEmail = account.username;
          const email = lowercaseOrganizationEmail(userEmail);
          dispatch(setUser({ email, fullName: account.name }));
          console.log("User email:", email);
          return {
            status: "success",
            message: "Signed in with Azure successfully",
          };
        }
      }
      return { status: "failed", message: "Failed to get token or account" };
    } catch (error: any) {
      return { status: "failed", message: error.toString() };
    }
  };

  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values);
      if (resp.data) {
        const { signature } = resp.data;
        dispatch(
          signInSuccess({
            signature,
            verified: false,
            appToken: null,
            signedIn: false,
          })
        );
        if (resp.data.email) {
          dispatch(
            setUser(
              resp.data || {
                email: "",
              }
            )
          );
        }
        // const redirectUrl = query.get(REDIRECT_URL_KEY)
        // navigate(
        //     redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
        // )
        return {
          status: "success",
          message: "",
        };
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: "failed",
        message: getErrorMessage(errors),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    dispatch(
      setUser({
        avatar: "",
        fullName: "",
        email: "",
        authority: [],
      })
    );
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    // await apiSignOut();
    handleSignOut();
  };

  return {
    authenticated: signature && signedIn && verified && appToken,
    signIn,
    signUp,
    signOut,
    signInWithAzure,
  };
}

export default useAuth;
