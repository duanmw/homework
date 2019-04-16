const getters = {
  sidebar: state => state.app.sidebar,
  fixedHeader: state => state.app.fixedHeader,
  darkTheme: state => state.app.darkTheme,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  email: state => state.user.email,
  number: state => state.user.number,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
