export interface SignInCredential {
    email: string
    password: string
}

export interface SignInResponse {
    signature: string
    email: string
    verified: boolean
}

export interface SignUpResponse {
    signature: string
    email: string
    verified: boolean
}

export interface SignUpCredential {
    email: string
    fullname: string
    password: string
}

export interface ForgotPassword {
    email: string
}

export interface ResetPassword {
    password: string
}

export interface VerifyOtpRequest {
    otp: string
}

export interface ResendOtpRequest {
    email: string
}
