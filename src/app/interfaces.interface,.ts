export interface MEDICAL_RECORD_INTERFACE {
  allergies: Array<any>;
  conditions: Array<any>;
  date: string;
  fullName: string;
  gender: string;
  medications: Array<any>;
  nationalId: number;
  phoneNo: string;
  substances: Array<boolean>;
  photoUrl: string;
}

export interface SEARCH_RESPONSE {
  birthDate: string;
  email: string;
  location: string;
  phoneNumber: string;
  photoUrl: string;
  uId: string;
  username: string;
}

export interface userReadings {
  ecg: string;
  hrate: string;
  temp: string;
  SPO2: string;
}
