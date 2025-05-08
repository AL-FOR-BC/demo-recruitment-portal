import {
  apiBcToken,
  apiSignIn,
  apiSignUp,
} from "@/services/AuthService";
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

type Status = "success" | "failed";

function useAuth() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const query = useQuery();

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
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };
  // const getToken = async () => {
  //   try {
  //     const resp = await apiBcToken();
  //     const { access_token } = resp.data;
  //     if (access_token) {
  //       dispatch(signInSuccess(access_token));
  //       return {
  //         status: "success",
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       status: "failed",
  //       // @ts-ignore
  //       message: error?.response?.data?.msg || error.toString(),
  //     };
  //   }
  // };

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
        message: errors?.response?.data?.message || errors.toString(),
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
  };
}

export default useAuth;
