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
    {
      id: 1,
      name: "Projector A1",
      description: "Portable conference projector",
      status: "AVAILABLE",
      imageUrl: "",
      organization: { id: 1 },
      category: { id: 1, name: "Electronics" },
    },
    {
      id: 2,
      name: "Van 3",
      description: "Delivery van",
      status: "IN_USE",
      imageUrl: "",
      organization: { id: 2 },
      category: { id: 2, name: "Vehicles" },
    },
  ],
  assetCategories: [
    { id: 1, name: "Electronics", organization: { id: 1 } },
    { id: 2, name: "Vehicles", organization: { id: 2 } },
  ],
  bookings: [
    {
      id: 1,
      organization: { id: 1 },
      asset: { id: 1, name: "Projector A1" },
      user: { id: 2, fullName: "Ops Manager" },
      approvedBy: null,
      startTime: "2026-04-25T09:00:00.000Z",
      endTime: "2026-04-25T11:00:00.000Z",
      status: "PENDING",
      checkedInAt: null,
      checkedOutAt: null,
    },
    {
      id: 2,
      organization: { id: 1 },
      asset: { id: 1, name: "Projector A1" },
      user: { id: 2, fullName: "Ops Manager" },
      approvedBy: { id: 1, fullName: "AssetFlow Admin" },
      startTime: "2026-04-26T09:00:00.000Z",
      endTime: "2026-04-26T11:00:00.000Z",
      status: "APPROVED",
      checkedInAt: null,
      checkedOutAt: null,
    },
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
  assetCategories: {
    async list() {
      await wait();
      return [...state.assetCategories];
    },
  },
  assets: {
    async list() {
      await wait();
      return [...state.assets];
    },
    async get(id) {
      await wait();
      const asset = state.assets.find((item) => String(item.id) === String(id));
      if (!asset) throw new Error("Asset not found");
      return { ...asset };
    },
    async create(payload) {
      await wait();
      const category = state.assetCategories.find(
        (item) => String(item.id) === String(payload.category?.id),
      );
      const asset = {
        id: nextId(state.assets),
        name: payload.name,
        description: payload.description ?? "",
        status: payload.status ?? "AVAILABLE",
        imageUrl: payload.imageUrl ?? "",
        organization: { id: Number(payload.organization?.id) },
        category: category
          ? { id: category.id, name: category.name }
          : payload.category
            ? { id: Number(payload.category.id), name: "Category" }
            : null,
      };
      state.assets.push(asset);
      return { ...asset };
    },
    async update(id, payload) {
      await wait();
      const index = state.assets.findIndex((item) => String(item.id) === String(id));
      if (index < 0) throw new Error("Asset not found");
      const category = state.assetCategories.find(
        (item) => String(item.id) === String(payload.category?.id),
      );
      const updated = {
        ...state.assets[index],
        name: payload.name ?? state.assets[index].name,
        description: payload.description ?? state.assets[index].description,
        status: payload.status ?? state.assets[index].status,
        imageUrl: payload.imageUrl ?? state.assets[index].imageUrl,
        organization: payload.organization
          ? { id: Number(payload.organization.id) }
          : state.assets[index].organization,
        category: category
          ? { id: category.id, name: category.name }
          : payload.category
            ? { id: Number(payload.category.id), name: state.assets[index].category?.name ?? "Category" }
            : null,
      };
      state.assets[index] = updated;
      return { ...updated };
    },
    async remove(id) {
      await wait();
      const index = state.assets.findIndex((item) => String(item.id) === String(id));
      if (index < 0) throw new Error("Asset not found");
      state.assets.splice(index, 1);
    },
  },
  bookings: {
    async list() {
      await wait();
      return [...state.bookings];
    },
    async get(id) {
      await wait();
      const booking = state.bookings.find((item) => String(item.id) === String(id));
      if (!booking) throw new Error("Booking not found");
      return { ...booking };
    },
    async create(payload) {
      await wait();
      const asset = state.assets.find((item) => String(item.id) === String(payload.asset?.id));
      const user = state.users.find((item) => String(item.id) === String(payload.user?.id));
      const approvedBy = state.users.find((item) => String(item.id) === String(payload.approvedBy?.id));
      const booking = {
        id: nextId(state.bookings),
        organization: { id: Number(payload.organization?.id) },
        asset: asset ? { id: asset.id, name: asset.name } : { id: Number(payload.asset?.id), name: "Asset" },
        user: user ? { id: user.id, fullName: user.fullName } : { id: Number(payload.user?.id), fullName: "User" },
        approvedBy: approvedBy ? { id: approvedBy.id, fullName: approvedBy.fullName } : null,
        startTime: payload.startTime,
        endTime: payload.endTime,
        status: payload.status ?? "PENDING",
        checkedInAt: payload.checkedInAt ?? null,
        checkedOutAt: payload.checkedOutAt ?? null,
      };
      state.bookings.push(booking);
      return { ...booking };
    },
    async update(id, payload) {
      await wait();
      const index = state.bookings.findIndex((item) => String(item.id) === String(id));
      if (index < 0) throw new Error("Booking not found");
      const approvedBy = state.users.find((item) => String(item.id) === String(payload.approvedBy?.id));
      const updated = {
        ...state.bookings[index],
        status: payload.status ?? state.bookings[index].status,
        checkedInAt: payload.checkedInAt ?? state.bookings[index].checkedInAt,
        checkedOutAt: payload.checkedOutAt ?? state.bookings[index].checkedOutAt,
        approvedBy: approvedBy
          ? { id: approvedBy.id, fullName: approvedBy.fullName }
          : payload.approvedBy
            ? { id: Number(payload.approvedBy.id), fullName: state.bookings[index].approvedBy?.fullName ?? "Approver" }
            : state.bookings[index].approvedBy,
      };
      state.bookings[index] = updated;
      return { ...updated };
    },
    async remove(id) {
      await wait();
      const index = state.bookings.findIndex((item) => String(item.id) === String(id));
      if (index < 0) throw new Error("Booking not found");
      state.bookings.splice(index, 1);
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
