export interface AuthenticationReponse {

    loginToken: string,
    accessToken: string
    refreshToken?: string,
    mfa: boolean,
    secretImageUri: string
}