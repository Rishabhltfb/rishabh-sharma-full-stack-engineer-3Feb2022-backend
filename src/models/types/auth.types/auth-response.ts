export default interface AuthResponse {
    jwtToken: string;
    refreshToken: string;
    ipAddress?: string;
}
