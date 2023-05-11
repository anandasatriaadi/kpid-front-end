type UserData = {
  _id: string;
  name: string;
  email: string;
  last_login: Date;
  created_at: Date | null;
  role: string;
};

export default UserData;
