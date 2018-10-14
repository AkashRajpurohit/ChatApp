const expect = require("expect");

const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate new message object", () => {
    const from = "Akash";
    const text = "Hey";
    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({ from, text });
  });
});

describe("generateLocationMessage", () => {
  it("should generate new location message object", () => {
    const from = "Admin";
    const lat = 123;
    const lng = 456;

    const message = generateLocationMessage(from, lat, lng);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({
      from,
      url: `https://www.google.com/maps?q=${lat},${lng}`
    });
  });
});
