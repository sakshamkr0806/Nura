export type JwtPayload = {
  email: string;
  sub: string;
  role: string;
  phoneNumber?: string;
  onboardingCompleted: boolean;
};
