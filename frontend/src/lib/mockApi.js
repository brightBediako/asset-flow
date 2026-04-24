const state = {
  me: {
    id: 1,
    email: "admin@assetflow.local",
    fullName: "AssetFlow Admin",
    role: { name: "SUPER_ADMIN" },
  },
  organizations: [
    { id: 1, name: "Acme Industries" },
    { id: 2, name: "Northwind Logistics" },
  ],
  roles: [
    { id: 1, name: "SUPER_ADMIN" },
    { id: 2, name: "ORG_ADMIN" },
    { id: 3, name: "USER" },
  ],
  users: [
    {
      id: 1,
      email: "admin@assetflow.local",
      fullName: "AssetFlow Admin",
      organization: { id: 1 },
      role: { id: 1, name: "SUPER_ADMIN" },
    },
    {
      id: 2,
      email: "ops@acme.local",
      fullName: "Ops Manager",
      organization: { id: 1 },
      role: { id: 2, name: "ORG_ADMIN" },
    },
  ],
  assets: [
    { id: 1, name: "Projector A1", status: "AVAILABLE", organizationId: 1 },
    { id: 2, name: "Van 3", status: "IN_USE", organizationId: 2 },
  ],
  bookings: [
    { id: 1, status: "PENDING", organizationId: 1 },
    { id: 2, status: "APPROVED", organizationId: 1 },
  ],
};

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const nextId = (items) => {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
};

export const mockApi = {
  auth: {
    async login(payload) {
      await wait();
      if (!payload?.email || !payload?.password) {
        throw new Error("Email and password are required");
      }
      return { ...state.me, email: payload.email };
    },
    async me() {
      await wait();
      return { ...state.me };
    },
  },
  roles: {
    async list() {
      await wait();
      return [...state.roles];
    },
  },
  users: {
    async list() {
      await wait();
      return [...state.users];
    },
    async get(id) {
      await wait();
      const user = state.users.find((item) => String(item.id) === String(id));
      if (!user) throw new Error("User not found");
      return { ...user };
    },
    async create(payload) {
      await wait();
      const role = state.roles.find((item) => String(item.id) === String(payload.role?.id));
      const user = {
        id: nextId(state.users),
        email: payload.email,
        fullName: payload.fullName,
        organization: payload.organization ? { id: Number(payload.organization.id) } : null,
        role: role ?? { id: Number(payload.role?.id), name: "USER" },
      };
      state.users.push(user);
      return { ...user };
    },
    async update(id, payload) {
      await wait();
      const index = state.users.findIndex((item) => String(item.id) === String(id));
      if (index < 0) throw new Error("User not found");
      const role = state.roles.find((item) => String(item.id) === String(payload.role?.id));
      const updated = {
        ...state.users[index],
        email: payload.email ?? state.users[index].email,
        fullName: payload.fullName ?? state.users[index].fullName,
        organization: payload.organization ? { id: Number(payload.organization.id) } : null,
        role: role ?? state.users[index].role,
      };
      state.users[index] = updated;
      return { ...updated };
    },
    async remove(id) {
      await wait();
      const index = state.users.findIndex((item) => String(item.id) === String(id));
      if (index < 0) throw new Error("User not found");
      state.users.splice(index, 1);
    },
  },
  organizations: {
    async list() {
      await wait();
      return [...state.organizations];
    },
    async get(id) {
      await wait();
      const organization = state.organizations.find((org) => String(org.id) === String(id));
      if (!organization) throw new Error("Organization not found");
      return { ...organization };
    },
    async create(payload) {
      await wait();
      const organization = { id: nextId(state.organizations), ...payload };
      state.organizations.push(organization);
      return { ...organization };
    },
    async update(id, payload) {
      await wait();
      const index = state.organizations.findIndex((org) => String(org.id) === String(id));
      if (index < 0) throw new Error("Organization not found");
      const updated = { ...state.organizations[index], ...payload };
      state.organizations[index] = updated;
      return { ...updated };
    },
    async remove(id) {
      await wait();
      const index = state.organizations.findIndex((org) => String(org.id) === String(id));
      if (index < 0) throw new Error("Organization not found");
      state.organizations.splice(index, 1);
    },
  },
  dashboard: {
    async summary() {
      await wait();
      return {
        organizations: state.organizations.length,
        users: state.users.length,
        assets: state.assets.length,
        bookings: state.bookings.length,
      };
    },
  },
};
