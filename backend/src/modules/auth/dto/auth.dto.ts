import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * E.164 phone format: +<country_code><number> (7–15 digits total)
   * Example: +919876543210
   */
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message: 'phoneNumber must be in E.164 format (e.g. +919876543210)',
  })
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_=+<>])[A-Za-z\d@$!%*?&^#\-_=+<>]{8,}$/,
    {
      message:
        'Password must include uppercase, lowercase, a number, and a special character',
    },
  )
  password: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
}

export class SigninDto {
  /**
   * Can be an email address or an E.164 phone number
   */
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateDobDto {
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;
}

/**
 * @deprecated Use SignupDto or SigninDto instead.
 */
export class AuthDto extends SignupDto {}
