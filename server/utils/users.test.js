const expect = require("expect");

const { Users } = require("./users");

describe("Users", () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: 1,
        name: "Akash",
        room: "Node Course"
      },
      {
        id: 2,
        name: "Jen",
        room: "React Course"
      },
      {
        id: 3,
        name: "Julie",
        room: "Node Course"
      }
    ];
  });

  it("should add new user", () => {
    const users = new Users();
    const user = {
      id: "2123",
      name: "Akash",
      room: "Joes"
    };

    const resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it("should remove a user", () => {
    const user = users.removeUser(2);

    expect(user).toMatchObject({ id: 2, name: "Jen", room: "React Course" });
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", () => {
    const user = users.removeUser(5);

    expect(user).toBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it("should return a user", () => {
    const user = users.getUser(2);

    expect(user).toMatchObject({ id: 2, name: "Jen", room: "React Course" });
  });

  it("should not return a user", () => {
    const user = users.getUser(5);

    expect(user).toBe(undefined);
  });

  it("should return names for Node Course", () => {
    const userList = users.getUserList("Node Course");

    expect(userList).toEqual(["Akash", "Julie"]);
  });

  it("should return names for React Course", () => {
    const userList = users.getUserList("React Course");

    expect(userList).toEqual(["Jen"]);
  });
});
