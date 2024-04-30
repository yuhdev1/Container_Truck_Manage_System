function useAuth() {
  //get item from localstorage
  let user: any;

  const _user = localStorage.getItem("ctms_user");

  if (_user) {
    user = JSON.parse(_user);
  }
  if (user) {
    return {
      auth: true,
      username: user.username,
      role: user.role,
      userId: user.userId,
      userNumber: user.userNumber,
    };
  } else {
    return {
      auth: false,
      role: null,
    };
  }
}

export default useAuth;
