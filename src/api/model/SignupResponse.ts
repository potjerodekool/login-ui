export interface SignupResponse {
    errorMessage?: string
    secretImageUri?: string
    recoveryCodes: string[]
}