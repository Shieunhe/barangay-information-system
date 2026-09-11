export const USER_ROLE = 1;

export type UserStatus = "account verification" | "pending" | "registered" | "not registered";

export type Users = {
  id: number;
  user_id: string;
  role: typeof USER_ROLE;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  suffix: string;
  age: number;
  civil_status: string;
  sex: string;
  permanent_address: string;
  purok: string;
  contact_number: string;
  email: string;
  status: UserStatus;
  decline_reason: string;
  create_date: string;
  update_date: string;
};
