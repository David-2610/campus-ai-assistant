// TOKEN
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// USER
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

// ROLE
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};