import bcrypt from "bcrypt";

export const GenerateOtp = () => {
  let otp;
  do {
    otp = Math.floor(100000 + Math.random() * 900000);
  } while (otp.toString().length !== 6);

  const expiry = new Date();
  // after 30 minutes
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};


// export const GeneratePassword = async (password: string, salt: string) => {
//   return await bcrypt.hash(password, salt);
// };

export const EncryptOtp = async(otp:string, salt:string)=>{
  return await bcrypt.hash(otp, salt);
}

export const ValidateOtp = async(otp:string, salt:string)=>{
  return await bcrypt.compare(otp, salt);
}

