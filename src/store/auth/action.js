export const login = (user) => {
    return {
      type: authActions.login.type,
      payload: user,
    };
  };